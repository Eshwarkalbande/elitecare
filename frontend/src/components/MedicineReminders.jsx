/**
 * Phase 1B — Medicine Reminders.
 *
 * The safety rule is visible in the UI, not hidden in the backend:
 *   * a proposal is only a SUGGESTION parsed from the doctor's own words, and
 *     it says so when the parser was not confident;
 *   * nothing becomes active until the patient taps "Confirm times";
 *   * the confirm button stays disabled while no time is chosen, mirroring the
 *     server rule that an active reminder must have at least one time;
 *   * the dose text is displayed exactly as the doctor wrote it.
 */
import React, { useEffect, useState } from "react";
import { Bell, Check, X, Plus, Sparkles, CalendarClock, Trash2 } from "lucide-react";
import useT from "../i18n";
import {
  HubSection,
  HubCard,
  HubButton,
  HubNote,
  HubMotion,
  Spinner,
  ErrorBanner,
  EmptyState,
  Field,
  inputClass,
  Pill,
  ConsentToggle,
} from "./hub/HubUI";
import {
  getReminders,
  proposeReminders,
  createReminder,
  updateReminder,
  deleteReminder,
  markReminderEvent,
} from "../services/hubService";

const STATUS_TONE = { taken: "green", skipped: "slate", missed: "red", sent: "blue", pending: "slate" };
const TIME_OPTIONS = ["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];

export default function MedicineReminders({ onBack }) {
  const { t } = useT();

  const [reminders, setReminders] = useState([]);
  const [todayEvents, setTodayEvents] = useState([]);
  const [adherence, setAdherence] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [showProposals, setShowProposals] = useState(false);

  // null | { reminder?, proposal?, medicineName, doseText, times[], endDate, channels[] }
  const [editing, setEditing] = useState(null);
  const [typedTimes, setTypedTimes] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  async function refresh() {
    try {
      const data = await getReminders();
      setReminders(Array.isArray(data.reminders) ? data.reminders : []);
      setTodayEvents(Array.isArray(data.todayEvents) ? data.todayEvents : []);
      setAdherence(data.adherence || null);
    } catch (err) {
      setError(err.response?.data?.error || t("rem.error", "Could not load your reminders."));
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadProposals() {
    setBusy(true);
    setError(null);
    try {
      const rows = await proposeReminders();
      setProposals(Array.isArray(rows) ? rows : []);
      setShowProposals(true);
    } catch (err) {
      setError(err.response?.data?.error || t("rem.propose.error", "Could not read your prescriptions."));
    } finally {
      setBusy(false);
    }
  }

  function startConfirm(proposal) {
    setMessage(null);
    setError(null);
    setEditing({
      proposal,
      medicineName: proposal.medicineName,
      doseText: proposal.doseText || null,
      // Only a CONFIDENT parser seeds the time buttons. Otherwise the patient
      // must type real times: the app will not guess a schedule.
      times: proposal.confident ? proposal.times || [] : [],
      endDate: proposal.endDate || null,
      channels: ["inapp"],
    });
    setTypedTimes("");
  }

  function toggleTime(time) {
    setEditing((current) => ({
      ...current,
      times: current.times.includes(time)
        ? current.times.filter((value) => value !== time)
        : [...current.times, time].sort(),
    }));
  }

  function parseTypedTimes(value) {
    setTypedTimes(value);
    const parsed = value
      .split(",")
      .map((part) => part.trim().match(/^(\d{1,2}):(\d{2})$/))
      .filter(Boolean)
      .filter((match) => Number(match[1]) <= 23 && Number(match[2]) <= 59)
      .map((match) => `${String(Number(match[1])).padStart(2, "0")}:${match[2]}`)
      .slice(0, 6);
    if (parsed.length) {
      setEditing((current) => ({ ...current, times: Array.from(new Set(parsed)).sort() }));
    }
  }

  async function confirmTimes() {
    if (!editing || busy || editing.times.length === 0) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await createReminder({
        medicineName: editing.medicineName,
        doseText: editing.doseText,
        times: editing.times,
        endDate: editing.endDate,
        channels: editing.channels,
        prescriptionItemId: editing.proposal ? editing.proposal.prescriptionItemId : undefined,
        confirm: true,
      });
      setEditing(null);
      setMessage(t("rem.confirmed", "Reminder switched on. It will remind you at the times you confirmed."));
      await loadProposals();
      await refresh();
    } catch (err) {
      setError(err.response?.data?.error || t("rem.save.error", "That reminder could not be saved."));
    } finally {
      setBusy(false);
    }
  }

  async function reschedule() {
    if (!editing || busy) return;
    setBusy(true);
    setError(null);
    try {
      await updateReminder(editing.reminder.id, {
        times: editing.times,
        endDate: editing.endDate,
        channels: editing.channels,
        active: editing.times.length > 0,
      });
      setEditing(null);
      setMessage(t("rem.updated", "Reminder updated."));
      await refresh();
    } catch (err) {
      setError(err.response?.data?.error || t("rem.save.error", "That reminder could not be updated."));
    } finally {
      setBusy(false);
    }
  }

  async function openForEditing(reminder) {
    setError(null);
    setMessage(null);
    setEditing({
      reminder,
      medicineName: reminder.medicineName,
      doseText: reminder.doseText,
      times: reminder.times || [],
      endDate: reminder.endDate || null,
      channels: reminder.channels || ["inapp"],
    });
    setTypedTimes("");
  }

  async function pause(reminder) {
    setBusy(true);
    setError(null);
    try {
      await updateReminder(reminder.id, { active: false });
      await refresh();
    } catch (err) {
      setError(err.response?.data?.error || t("rem.save.error", "That reminder could not be updated."));
    } finally {
      setBusy(false);
    }
  }

  async function remove(reminder) {
    setBusy(true);
    try {
      await deleteReminder(reminder.id);
      await refresh();
    } catch (err) {
      setError(err.response?.data?.error || t("rem.delete.error", "That reminder could not be removed."));
    } finally {
      setBusy(false);
    }
  }

  async function mark(event, status) {
    try {
      await markReminderEvent(event.reminder_id, event.id, status);
      await refresh();
    } catch (err) {
      setError(err.response?.data?.error || t("rem.mark.error", "That dose could not be marked."));
    }
  }

  const takenRate = adherence && adherence.settled > 0 ? adherence.takenRate : null;

  return (
    <HubSection
      badge={t("rem.badge", "Phase 1B")}
      title={t("rem.title", "Medicine Reminders")}
      subtitle={t(
        "rem.subtitle",
        "Your prescription turned into a daily timetable. Nothing is switched on until you confirm the times yourself."
      )}
      onBack={onBack}
    >
      <HubMotion className="space-y-5">
        {error && <ErrorBanner>{error}</ErrorBanner>}
        {message && <HubNote tone="ok">{message}</HubNote>}

        {/* ---------- today ---------- */}
        <HubCard
          title={t("rem.today", "Today's doses")}
          description={t(
            "rem.today.desc",
            "Mark each dose as taken or skipped. The adherence figure below is built only from what you mark here."
          )}
          icon={CalendarClock}
        >
          {todayEvents.length === 0 ? (
            <EmptyState icon={CalendarClock} title={t("rem.today.empty", "No doses scheduled for today")}>
              {t("rem.today.emptyHint", "Confirm a reminder and it appears here once its time arrives.")}
            </EmptyState>
          ) : (
            <ul className="space-y-2">
              {todayEvents.map((event) => (
                <li
                  key={event.id}
                  className="flex flex-wrap items-center gap-2 p-3 rounded-2xl border border-slate-200 bg-slate-50"
                >
                  <span className="text-xs font-black font-mono text-slate-700">
                    {new Date(event.scheduled_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <Pill tone={STATUS_TONE[event.status] || "slate"}>{event.status}</Pill>
                  <span className="flex-1" />
                  <HubButton
                    variant="secondary"
                    size="sm"
                    onClick={() => mark(event, "taken")}
                    disabled={event.status === "taken"}
                  >
                    <Check size={12} /> {t("rem.mark.taken", "Taken")}
                  </HubButton>
                  <HubButton
                    variant="ghost"
                    size="sm"
                    onClick={() => mark(event, "skipped")}
                    disabled={event.status === "skipped"}
                  >
                    <X size={12} /> {t("rem.mark.skipped", "Skip")}
                  </HubButton>
                </li>
              ))}
            </ul>
          )}

          {adherence && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-wide font-bold text-slate-400">
                  {t("rem.adherence", "Adherence (7 days)")}
                </p>
                <p className="text-lg font-black text-slate-800">{takenRate === null ? "—" : `${takenRate}%`}</p>
              </div>
              <div className="text-[11px] font-sans text-slate-500 space-y-0.5">
                <p>
                  {t("rem.counts.taken", "taken")}: {adherence.counts.taken} ·{" "}
                  {t("rem.counts.skipped", "skipped")}: {adherence.counts.skipped} ·{" "}
                  {t("rem.counts.missed", "missed")}: {adherence.counts.missed}
                </p>
                <p>
                  {t(
                    "rem.adherence.note",
                    "Only doses that were actually sent are counted, so a future dose is never shown as a miss."
                  )}
                </p>
              </div>
            </div>
          )}
        </HubCard>


        {/* ---------- confirm / reschedule ---------- */}
        {editing && (
          <HubCard
            title={editing.reminder ? t("rem.edit.title", "Change the times") : t("rem.confirm.title", "Confirm the times")}
            description={t("rem.confirm.desc", "Check the times below. Nothing is switched on until you confirm.")}
            icon={Bell}
            tint="bg-amber-50 text-amber-600"
          >
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-xs font-black text-slate-800">{editing.medicineName}</p>
                {editing.doseText && (
                  <p className="text-[11px] font-sans text-slate-600">
                    {t("rem.dose", "Dose, exactly as prescribed")}: <strong>{editing.doseText}</strong>
                  </p>
                )}
                <p className="text-[10px] font-sans text-slate-400">
                  {t("rem.dose.note", "ELITECARE never rewrites what your doctor wrote.")}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  {t("rem.times", "Times")}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {TIME_OPTIONS.map((time) => {
                    const on = editing.times.includes(time);
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => toggleTime(time)}
                        aria-pressed={on}
                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-mono font-bold border transition cursor-pointer ${
                          on
                            ? "bg-emerald-500 text-white border-emerald-500"
                            : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Field label={t("rem.customTime", "Or type your own time(s), comma separated")}>
                <input
                  className={inputClass}
                  placeholder="08:00, 20:00"
                  value={typedTimes}
                  onChange={(event) => parseTypedTimes(event.target.value)}
                />
              </Field>

              <Field label={t("rem.endDate", "Stop after (optional)")}>
                <input
                  type="date"
                  className={inputClass}
                  value={editing.endDate || ""}
                  onChange={(event) => setEditing((current) => ({ ...current, endDate: event.target.value || null }))}
                />
              </Field>

              <ConsentToggle
                id="rem-channels"
                checked={(editing.channels || []).includes("inapp")}
                onChange={(on) =>
                  setEditing((current) => ({ ...current, channels: on ? ["inapp", "console"] : ["console"] }))
                }
                label={t("rem.channels", "Also show this reminder in the in-app bell")}
                description={t(
                  "rem.channels.desc",
                  "In-app and the local console log are the only two channels that really work in this build. SMS is not switched on, and the app will never claim it sent an SMS."
                )}
              />

              <div className="flex flex-wrap gap-2 pt-1">
                <HubButton
                  onClick={editing.reminder ? reschedule : confirmTimes}
                  disabled={busy || editing.times.length === 0}
                >
                  {busy ? <Spinner size={13} /> : <Check size={13} />}
                  {t("rem.confirm.button", "Confirm these times")}
                </HubButton>
                <HubButton variant="ghost" onClick={() => setEditing(null)}>
                  {t("common.cancel", "Cancel")}
                </HubButton>
              </div>
              {editing.times.length === 0 && (
                <HubNote tone="warn">
                  {t("rem.times.required", "Choose at least one time before turning this on.")}
                </HubNote>
              )}
            </div>
          </HubCard>
        )}


        {/* ---------- proposals ---------- */}
        {showProposals && (
          <HubCard
            title={t("rem.proposals", "Suggested from your prescriptions")}
            description={t(
              "rem.proposals.desc",
              "Read from the text your doctor already wrote. Check the times before anything is saved."
            )}
            icon={Sparkles}
          >
            {proposals.length === 0 ? (
              <EmptyState icon={Sparkles} title={t("rem.proposals.empty", "Nothing left to suggest")}>
                {t("rem.proposals.emptyHint", "Every medicine on your active prescriptions already has a reminder.")}
              </EmptyState>
            ) : (
              <ul className="space-y-2.5">
                {proposals.map((proposal) => (
                  <li key={proposal.prescriptionItemId} className="p-3 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800">{proposal.medicineName}</p>
                        {proposal.doseText && <p className="text-[11px] font-sans text-slate-500">{proposal.doseText}</p>}
                      </div>
                      <Pill tone={proposal.confident ? "green" : "amber"}>
                        {proposal.confident ? t("rem.confident", "readable") : t("rem.notConfident", "needs your times")}
                      </Pill>
                    </div>
                    {proposal.confident ? (
                      <p className="text-[11px] font-mono text-slate-600">
                        {t("rem.suggested", "Suggested")}: {proposal.times.join(", ")}
                      </p>
                    ) : (
                      <p className="text-[11px] font-sans text-slate-500">
                        {t("rem.why", "Why")}: {proposal.reason}
                      </p>
                    )}
                    <HubButton size="sm" onClick={() => startConfirm(proposal)}>
                      <Plus size={12} /> {t("rem.review", "Review and confirm")}
                    </HubButton>
                  </li>
                ))}
              </ul>
            )}
          </HubCard>
        )}

        {/* ---------- my reminders ---------- */}
        <HubCard
          title={t("rem.mine", "My reminders")}
          description={t("rem.mine.desc", "Each one is off until its times are confirmed.")}
          icon={Bell}
          right={
            <HubButton size="sm" onClick={loadProposals} disabled={busy}>
              {busy ? <Spinner size={13} /> : <Sparkles size={13} />}
              {t("rem.suggest", "Suggest from prescriptions")}
            </HubButton>
          }
        >
          {reminders.length === 0 ? (
            <EmptyState icon={Bell} title={t("rem.mine.empty", "No reminders yet")}>
              {t("rem.mine.emptyHint", "Tap “Suggest from prescriptions” and check the times ELITECARE read for you.")}
            </EmptyState>
          ) : (
            <ul className="space-y-2.5">
              {reminders.map((reminder) => (
                <li key={reminder.id} className="p-3 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800">{reminder.medicineName}</p>
                      {reminder.doseText && <p className="text-[11px] font-sans text-slate-500">{reminder.doseText}</p>}
                    </div>
                    <Pill tone={reminder.active ? "green" : "slate"}>
                      {reminder.active ? t("rem.on", "on") : t("rem.off", "off")}
                    </Pill>
                  </div>
                  <p className="text-[11px] font-mono text-slate-600">
                    {reminder.times.length ? reminder.times.join(", ") : t("rem.noTimes", "no times set")}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {reminder.active ? (
                      <HubButton variant="secondary" size="sm" onClick={() => pause(reminder)} disabled={busy}>
                        {t("rem.pause", "Pause")}
                      </HubButton>
                    ) : (
                      <HubButton variant="secondary" size="sm" onClick={() => openForEditing(reminder)} disabled={busy}>
                        {t("rem.activate", "Set times")}
                      </HubButton>
                    )}
                    <HubButton variant="danger" size="sm" onClick={() => remove(reminder)} disabled={busy}>
                      <Trash2 size={12} />
                    </HubButton>
                    <span className="text-[10px] font-sans text-slate-400">
                      7d {t("rem.counts.taken", "taken")} {reminder.adherence7d.taken} ·{" "}
                      {t("rem.counts.missed", "missed")} {reminder.adherence7d.missed}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </HubCard>

        <HubNote tone="ai">
          {t(
            "rem.disclaimer",
            "A reminder is a prompt, not medical advice. Never change a dose because of a reminder — ask your doctor. In an emergency, call 112."
          )}
        </HubNote>
      </HubMotion>
    </HubSection>
  );
}
