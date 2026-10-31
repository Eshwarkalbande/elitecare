/**
 * Medicine reminder dispatcher (Phase 1B) — registered as a scheduler job.
 *
 *   registerJob("medicine-reminders", require("./reminders").run)
 *
 * `run(now)` does two things every tick:
 *   dispatchDue    materialises today's `reminder_events` rows for every
 *                  ACTIVE reminder, then delivers the ones that are due.
 *                  The unique index (reminder_id, scheduled_at) makes this
 *                  idempotent: an event that already exists is never sent
 *                  twice, even if the process restarts mid-tick.
 *   markMissed     flips events that were sent but never actioned to `missed`.
 *
 * Delivery goes through services/notify.js. The default channels are the two
 * that are really implemented: `inapp` (the bell) and `console` (log-only).
 * A reminder is only marked `sent` when a transport actually accepted it —
 * nothing here ever reports a delivery that did not happen.
 */
const { pool } = require("../config/db");
const { deliver } = require("./notify");

const TIMEZONE = process.env.SCHEDULER_TIMEZONE || "Asia/Kolkata";
const DEFAULT_CHANNELS = ["inapp", "console"];
// A due event older than this is given up on and recorded as missed.
const GIVE_UP_MINUTES = 15;
// An event that was sent but never marked Taken/Skipped within this window
// becomes `missed`.
const MISSED_AFTER_MINUTES = 240;

/** Wall-clock date + time in the scheduler timezone. */
function zonedParts(date = new Date(), timeZone = TIMEZONE) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value])
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    hhmm: `${parts.hour === "24" ? "00" : parts.hour}:${parts.minute}`,
  };
}

/** Milliseconds `timeZone` is ahead of UTC at `date`. */
function zoneOffsetMs(date, timeZone = TIMEZONE) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value])
  );
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second)
  );
  return asUtc - date.getTime();
}

/** 'YYYY-MM-DD' + 'HH:MM' in `timeZone` -> the exact UTC instant. */
function zonedDateTimeToUtc(dateStr, hhmm, timeZone = TIMEZONE) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = hhmm.split(":").map(Number);
  const naiveUtc = Date.UTC(y, m - 1, d, hh, mm, 0);
  return new Date(naiveUtc - zoneOffsetMs(new Date(naiveUtc), timeZone));
}

/** 'HH:MM:SS' | Date-ish -> 'HH:MM' */
function toHhmm(value) {
  const match = String(value || "").match(/(\d{2}):(\d{2})/);
  return match ? `${match[1]}:${match[2]}` : null;
}

/**
 * Creates the due `reminder_events` rows and delivers them.
 * @param {Date} [now]
 */
async function dispatchDue(now = new Date()) {
  const { date: today, hhmm: currentTime } = zonedParts(now);

  const [reminders] = await pool.query(
    `SELECT r.id, r.patient_id, r.medicine_name, r.dose_text, r.times, r.channels, r.start_date, r.end_date
     FROM medicine_reminders r
     WHERE r.active = TRUE
       AND (r.start_date IS NULL OR r.start_date <= ?)
       AND (r.end_date   IS NULL OR r.end_date   >= ?)`,
    [today, today]
  );

  const stats = { checked: reminders.length, created: 0, delivered: 0, failed: 0 };

  for (const reminder of reminders) {
    const channels = Array.isArray(reminder.channels) && reminder.channels.length
      ? reminder.channels
      : DEFAULT_CHANNELS;

    for (const raw of reminder.times || []) {
      const hhmm = toHhmm(raw);
      if (!hhmm || hhmm > currentTime) continue; // not due yet today

      const scheduledAt = zonedDateTimeToUtc(today, hhmm, TIMEZONE);
      const ageMinutes = (now.getTime() - scheduledAt.getTime()) / 60000;
      if (ageMinutes > MISSED_AFTER_MINUTES) continue; // too old to be useful

      // INSERT ... ON CONFLICT DO NOTHING RETURNING id -> insertId is undefined
      // when the row already existed, so a re-run can never double-send.
      const [result] = await pool.query(
        "INSERT INTO reminder_events (reminder_id, scheduled_at, status) VALUES (?, ?::timestamptz, 'pending') ON CONFLICT (reminder_id, scheduled_at) DO NOTHING",
        [reminder.id, scheduledAt.toISOString()]
      );
      if (result.insertId == null) continue;
      stats.created += 1;

      if (ageMinutes > GIVE_UP_MINUTES) {
        await pool.query("UPDATE reminder_events SET status = 'missed' WHERE id = ?", [result.insertId]);
        continue;
      }

      let anyDelivered = false;
      let usedProvider = null;
      for (const channel of channels) {
        try {
          const outcome = await deliver({
            userId: reminder.patient_id,
            title: "Medicine reminder",
            message: `${reminder.medicine_name}${reminder.dose_text ? ` (${reminder.dose_text})` : ""}`.slice(0, 255),
            provider: channel,
          });
          if (outcome && outcome.delivered) {
            anyDelivered = true;
            usedProvider = usedProvider || outcome.provider;
          }
        } catch (err) {
          // Provider not configured/implemented is a real failure, not a send.
          console.warn(`reminders: channel "${channel}" unavailable (${String(err.message).slice(0, 80)})`);
        }
      }

      if (anyDelivered) {
        await pool.query(
          "UPDATE reminder_events SET status = 'sent', sent_at = NOW(), provider = ? WHERE id = ?",
          [usedProvider, result.insertId]
        );
        stats.delivered += 1;
      } else {
        stats.failed += 1;
      }
    }
  }

  return stats;
}

/** Events that were sent but never actioned become `missed`. */
async function markMissed(now = new Date()) {
  const cutoff = new Date(now.getTime() - MISSED_AFTER_MINUTES * 60000).toISOString();
  const [result] = await pool.query(
    "UPDATE reminder_events SET status = 'missed' WHERE status = 'sent' AND scheduled_at < ?::timestamptz",
    [cutoff]
  );
  return { missed: result.affectedRows || 0 };
}

/** Scheduler entry point. */
async function run(now = new Date()) {
  const dispatch = await dispatchDue(now);
  const missed = await markMissed(now);
  return { ...dispatch, ...missed };
}

module.exports = {
  run,
  dispatchDue,
  markMissed,
  zonedParts,
  zoneOffsetMs,
  zonedDateTimeToUtc,
  toHhmm,
  DEFAULT_CHANNELS,
  GIVE_UP_MINUTES,
  MISSED_AFTER_MINUTES,
  TIMEZONE,
};
