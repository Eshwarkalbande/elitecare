/**
 * Phase 1B — Prescription -> Reminders (patient side).
 *
 * The safety rule of this phase is enforced here:
 *   * `propose` only ever SUGGESTS. A reminder is created with `active: false`
 *     and an empty times array unless the patient sent real times with
 *     `confirm: true`.
 *   * `dose_text` is copied from the prescription verbatim — the app never
 *     rewrites what the doctor wrote.
 */
const { pool } = require("../config/db");
const { logAudit } = require("../services/audit");
const { sanitizeTimes } = require("../services/reminderParser");
const { DEFAULT_CHANNELS } = require("../services/reminders");

const ALLOWED_CHANNELS = ["inapp", "console"]; // only the transports that really exist
const EVENT_STATUSES = ["taken", "skipped"];

function normalizeChannels(input) {
  if (!Array.isArray(input)) return [...DEFAULT_CHANNELS];
  const cleaned = input
    .map((c) => String(c || "").toLowerCase().trim())
    .filter((c) => ALLOWED_CHANNELS.includes(c));
  return cleaned.length ? Array.from(new Set(cleaned)) : [...DEFAULT_CHANNELS];
}

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

/**
 * Adherence for the last `days` days, from `reminder_events`.
 * Only events that were actually SENT count towards the denominator — a future
 * dose the scheduler has not reached yet must not look like a miss.
 */
async function adherenceFor(patientId, days = 7, familyMemberId = null) {
  const params = [patientId, days];
  let memberClause = "";
  if (familyMemberId) {
    memberClause = " AND mr.family_member_id = ?";
    params.push(familyMemberId);
  }

  const [rows] = await pool.query(
    `SELECT ev.status, COUNT(*) AS total
     FROM reminder_events ev
     JOIN medicine_reminders mr ON mr.id = ev.reminder_id
     WHERE mr.patient_id = ?
       AND ev.scheduled_at >= (NOW() - (? || ' days')::interval)${memberClause}
     GROUP BY ev.status`,
    params
  );

  const counts = { pending: 0, sent: 0, taken: 0, skipped: 0, missed: 0 };
  for (const row of rows) {
    if (Object.prototype.hasOwnProperty.call(counts, row.status)) counts[row.status] = Number(row.total);
  }

  const settled = counts.taken + counts.skipped + counts.missed;
  return {
    days,
    counts,
    settled,
    takenRate: settled ? Math.round((counts.taken / settled) * 100) : null,
  };
}

/** Per-reminder 7-day totals, keyed by reminder id, for the list view. */
async function adherenceByReminder(patientId, days = 7) {
  const [rows] = await pool.query(
    `SELECT mr.id AS reminder_id, ev.status, COUNT(*) AS total
     FROM medicine_reminders mr
     LEFT JOIN reminder_events ev
       ON ev.reminder_id = mr.id
      AND ev.scheduled_at >= (NOW() - (? || ' days')::interval)
     WHERE mr.patient_id = ?
     GROUP BY mr.id, ev.status`,
    [days, patientId]
  );

  const map = new Map();
  for (const row of rows) {
    if (!map.has(row.reminder_id)) map.set(row.reminder_id, { taken: 0, skipped: 0, missed: 0, sent: 0, pending: 0 });
    if (row.status) map.get(row.reminder_id)[row.status] = Number(row.total);
  }
  return map;
}

function shapeReminder(row, counts) {
  return {
    id: row.id,
    patientId: row.patient_id,
    familyMemberId: row.family_member_id ?? null,
    prescriptionItemId: row.prescription_item_id,
    medicineName: row.medicine_name,
    doseText: row.dose_text,
    times: (row.times || []).map((t) => String(t).slice(0, 5)),
    startDate: row.start_date,
    endDate: row.end_date,
    channels: row.channels || [],
    active: row.active === true,
    confirmedAt: row.confirmed_at,
    adherence7d: counts || { taken: 0, skipped: 0, missed: 0, sent: 0, pending: 0 },
  };
}

// GET /api/patients/reminders
async function listReminders(req, res, next) {
  try {
    const { guardScope } = require("../services/access");
    const scope = await guardScope(req, res);
    if (!scope) return;

    const params = [scope.patientId];
    let sql = "SELECT * FROM medicine_reminders WHERE patient_id = ?";
    if (scope.familyMemberId) {
      sql += " AND family_member_id = ?";
      params.push(scope.familyMemberId);
    }
    sql += " ORDER BY active DESC, id DESC LIMIT 100";

    const [rows] = await pool.query(sql, params);
    const counts = await adherenceByReminder(scope.patientId);
    const adherence = await adherenceFor(scope.patientId, 7, scope.familyMemberId);

    if (req.user.role !== "patient") {
      await logAudit(req.user.id, "reminders.read", `patient ${scope.patientId} (${rows.length} row(s))`);
    }

    const [todayEvents] = await pool.query(
      `SELECT ev.id, ev.reminder_id, ev.scheduled_at, ev.sent_at, ev.status
       FROM reminder_events ev
       JOIN medicine_reminders mr ON mr.id = ev.reminder_id
       WHERE mr.patient_id = ? AND ev.scheduled_at::date = CURRENT_DATE
       ORDER BY ev.scheduled_at LIMIT 100`,
      [scope.patientId]
    );

    res.json({
      reminders: rows.map((row) => shapeReminder(row, counts.get(row.id))),
      todayEvents,
      adherence,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/patients/reminders/adherence
async function getAdherence(req, res, next) {
  try {
    const { guardScope } = require("../services/access");
    const scope = await guardScope(req, res);
    if (!scope) return;
    const days = Math.min(Math.max(Number(req.query.days) || 7, 1), 30);
    res.json({ adherence: await adherenceFor(scope.patientId, days, scope.familyMemberId) });
  } catch (err) {
    next(err);
  }
}

// POST /api/patients/reminders/propose
// Suggests a schedule for every prescription medicine that has no reminder yet.
// Nothing is stored here: this is a proposal the patient must confirm.
async function proposeReminders(req, res, next) {
  try {
    const { proposeSchedule } = require("../services/reminderParser");

    const [items] = await pool.query(
      `SELECT pi.id, pi.medicine_name, pi.dosage, pi.frequency, pi.duration, pi.instructions,
              pr.prescription_date, pr.id AS prescription_id
       FROM prescription_items pi
       JOIN prescriptions pr ON pr.id = pi.prescription_id
       WHERE pr.patient_id = ?
         AND pr.status = 'Active'
         AND pi.id NOT IN (
           SELECT prescription_item_id FROM medicine_reminders
           WHERE patient_id = ? AND prescription_item_id IS NOT NULL
         )
       ORDER BY pr.prescription_date DESC, pi.id DESC
       LIMIT 50`,
      [req.user.id, req.user.id]
    );

    res.json({
      proposals: items.map((item) => {
        const proposal = proposeSchedule(item);
        return {
          prescriptionItemId: item.id,
          prescriptionId: item.prescription_id,
          prescriptionDate: item.prescription_date,
          medicineName: item.medicine_name,
          // copied verbatim from the prescription — never rewritten
          doseText: item.dosage || item.frequency || null,
          frequency: item.frequency,
          duration: item.duration,
          confident: proposal.confident,
          times: proposal.times,
          endDate: proposal.endDate,
          reason: proposal.reason,
          parser: proposal.parser,
        };
      }),
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/patients/reminders
async function createReminder(req, res, next) {
  try {
    const { medicineName, doseText, times, startDate, endDate, channels, prescriptionItemId, familyMemberId, confirm } =
      req.body || {};

    const name = String(medicineName || "").trim();
    if (!name) return res.status(400).json({ error: "medicineName is required." });

    let memberId = null;
    if (familyMemberId) {
      const { ownsFamilyMember } = require("../services/access");
      if (!(await ownsFamilyMember(req.user.id, Number(familyMemberId)))) {
        return res.status(403).json({ error: "That family member does not belong to this account." });
      }
      memberId = Number(familyMemberId);
    }

    // A prescription item can be linked only if it really belongs to this patient.
    let itemId = null;
    if (prescriptionItemId) {
      const [owned] = await pool.query(
        `SELECT pi.id FROM prescription_items pi JOIN prescriptions pr ON pr.id = pi.prescription_id
         WHERE pi.id = ? AND pr.patient_id = ?`,
        [prescriptionItemId, req.user.id]
      );
      if (!owned.length) {
        return res.status(403).json({ error: "That prescription item does not belong to this patient." });
      }
      itemId = owned[0].id;
    }

    const confirmedTimes = sanitizeTimes(times);
    // Confirm-and-activate only happens when the patient sent real times.
    const isConfirmed = confirm === true && confirmedTimes.length > 0;

    const [result] = await pool.query(
      `INSERT INTO medicine_reminders
         (patient_id, family_member_id, prescription_item_id, medicine_name, dose_text, times, start_date, end_date, channels, active, confirmed_at)
       VALUES (?,?,?,?,?,?::time[],?,?,?::text[],?,?)`,
      [
        req.user.id,
        memberId,
        itemId,
        name.slice(0, 150),
        doseText ? String(doseText).slice(0, 100) : null,
        confirmedTimes,
        startDate || null,
        endDate || null,
        normalizeChannels(channels),
        isConfirmed,
        isConfirmed ? new Date().toISOString() : null,
      ]
    );

    res.status(201).json({
      message: isConfirmed
        ? "Reminder activated — it will now send at the times you confirmed."
        : "Reminder saved but NOT active. Confirm the times to turn it on.",
      reminderId: result.insertId ?? null,
      active: isConfirmed,
    });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/patients/reminders/:id
async function updateReminder(req, res, next) {
  try {
    const [rows] = await pool.query("SELECT * FROM medicine_reminders WHERE id = ? AND patient_id = ?", [
      req.params.id,
      req.user.id,
    ]);
    if (!rows.length) return res.status(404).json({ error: "Reminder not found." });
    const current = rows[0];

    const times = req.body.times === undefined ? null : sanitizeTimes(req.body.times);
    const channels = req.body.channels === undefined ? null : normalizeChannels(req.body.channels);
    let active = req.body.active === undefined ? null : req.body.active === true;

    // Turning a reminder on with no times would silently never fire.
    const nextTimes = times || current.times || [];
    if (active === true && (!Array.isArray(nextTimes) || nextTimes.length === 0)) {
      return res.status(400).json({ error: "Set at least one time before activating this reminder." });
    }
    if (times && times.length === 0 && req.body.active === undefined) active = false;

    await pool.query(
      `UPDATE medicine_reminders
         SET times = COALESCE(?::time[], times),
             channels = COALESCE(?::text[], channels),
             active = COALESCE(?, active),
             start_date = COALESCE(?, start_date),
             end_date = COALESCE(?, end_date),
             medicine_name = COALESCE(?, medicine_name),
             confirmed_at = CASE WHEN ? THEN NOW() ELSE confirmed_at END
       WHERE id = ? AND patient_id = ?`,
      [
        times,
        channels,
        active,
        req.body.startDate || null,
        req.body.endDate || null,
        req.body.medicineName ? String(req.body.medicineName).slice(0, 150) : null,
        active === true,
        req.params.id,
        req.user.id,
      ]
    );

    res.json({ message: "Reminder updated." });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/patients/reminders/:id
async function deleteReminder(req, res, next) {
  try {
    const [result] = await pool.query("DELETE FROM medicine_reminders WHERE id = ? AND patient_id = ?", [
      req.params.id,
      req.user.id,
    ]);
    if (!result.affectedRows) return res.status(404).json({ error: "Reminder not found." });
    res.json({ message: "Reminder removed." });
  } catch (err) {
    next(err);
  }
}

// POST /api/patients/reminders/:id/events/:eventId   { status: taken | skipped }
async function markEvent(req, res, next) {
  try {
    const status = String((req.body && req.body.status) || "").toLowerCase();
    if (!EVENT_STATUSES.includes(status)) {
      return res.status(400).json({ error: "status must be taken or skipped." });
    }

    const [rows] = await pool.query(
      `SELECT ev.id
       FROM reminder_events ev JOIN medicine_reminders mr ON mr.id = ev.reminder_id
       WHERE ev.id = ? AND ev.reminder_id = ? AND mr.patient_id = ?`,
      [req.params.eventId, req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Reminder event not found." });

    await pool.query("UPDATE reminder_events SET status = ? WHERE id = ?", [status, req.params.eventId]);
    res.json({ message: status === "taken" ? "Marked as taken." : "Marked as skipped." });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listReminders,
  getAdherence,
  proposeReminders,
  createReminder,
  updateReminder,
  deleteReminder,
  markEvent,
  normalizeChannels,
  adherenceFor,
  adherenceByReminder,
  shapeReminder,
  httpError,
  ALLOWED_CHANNELS,
  EVENT_STATUSES,
};
