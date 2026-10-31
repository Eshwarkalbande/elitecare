/**
 * Phase 1C — Pre-consult AI summary (doctor side).
 *
 * GET /api/doctors/appointments/:id/pre-consult-summary
 *
 * Rules enforced here:
 *   * the doctor must OWN the appointment (appointments.doctor_id is resolved
 *     from the JWT, never from the request body);
 *   * `patient_profiles.ai_summary_consent` decides the path:
 *       FALSE (the default) -> a deterministic template built on the server and
 *       NO call to the AI provider at all;
 *       TRUE               -> Gemini is asked to "summarise, do not diagnose";
 *   * the result is cached per appointment in `pre_consult_summaries`, and every
 *     read or generation writes an `audit_logs` entry;
 *   * if the model fails or answers something unusable, the template is used —
 *     the doctor is never shown a half-built brief.
 */
const { pool } = require("../config/db");
const { logAudit } = require("../services/audit");
const { buildPatientContext } = require("../services/patientContext");
const { generateJson, isMockMode, normalizeLanguage } = require("../services/aiClient");

/** Resolves the caller's doctor_profiles.id, or null. */
async function doctorProfileIdFor(userId) {
  const [rows] = await pool.query("SELECT id FROM doctor_profiles WHERE user_id = ?", [userId]);
  return rows.length ? rows[0].id : null;
}

const list = (items, empty) => (items.length ? items.join("; ") : empty);

/**
 * Deterministic, no-AI brief. It only repeats facts already stored for the
 * patient — it adds no interpretation, which is exactly what making this the
 * no-consent path requires.
 */
function buildTemplateSummary(context) {
  const p = context.profile || {};
  const lines = [];

  lines.push("PRE-CONSULT SUMMARY (on-file facts only — no AI was used)");
  lines.push("");

  const who = [p.fullName || "Patient", p.age ? `${p.age} years` : null, p.gender, p.bloodGroup ? `blood group ${p.bloodGroup}` : null]
    .filter(Boolean)
    .join(", ");
  lines.push(`Patient: ${who}`);

  const conditions = (p.conditions || []).concat(p.otherConditions ? [p.otherConditions] : []);
  lines.push(`Known conditions: ${list(conditions, "none recorded")}`);

  if (context.appointment) {
    lines.push(
      `This visit: ${context.appointment.date} ${context.appointment.time || ""} — ` +
        `reason given at booking: ${context.appointment.reason || "not stated"}`
    );
  }

  if (context.medicalRecords.length) {
    lines.push("");
    lines.push("Recent history entries:");
    for (const row of context.medicalRecords.slice(0, 5)) {
      const parts = Object.entries(row)
        .filter(([key, value]) => value != null && value !== "" && !["id", "patient_id", "doctor_id"].includes(key))
        .slice(0, 6)
        .map(([key, value]) => `${key.replace(/_/g, " ")}: ${value}`);
      lines.push(`- ${parts.join(", ")}`);
    }
  } else {
    lines.push("");
    lines.push("Recent history entries: none recorded");
  }

  if (context.prescriptions.length) {
    lines.push("");
    lines.push("Medicines already on file:");
    for (const rx of context.prescriptions.slice(0, 3)) {
      const meds = rx.medicines
        .map((m) => [m.name, m.dosage, m.frequency].filter(Boolean).join(" "))
        .join(", ");
      lines.push(`- ${rx.date}: ${meds || "no items recorded"}${rx.diagnosis ? ` (diagnosis: ${rx.diagnosis})` : ""}`);
    }
  } else {
    lines.push("");
    lines.push("Medicines already on file: none recorded");
  }

  if (context.availability.tracker && context.vitals.tracker.length) {
    lines.push("");
    lines.push(
      "Latest tracker readings: " +
        context.vitals.tracker
          .slice(0, 5)
          .map((v) => `${v.type} ${v.value1}${v.value2 ? `/${v.value2}` : ""}${v.unit ? ` ${v.unit}` : ""}`)
          .join("; ")
    );
  }

  if (context.availability.wearables && context.vitals.wearable.length) {
    lines.push("");
    lines.push(
      `Wearable averages (14 days): ${context.vitals.wearable
        .map((w) => `${w.type} ${w.average}${w.unit ? ` ${w.unit}` : ""} (n=${w.samples})`)
        .join("; ")}`
    );
  }

  if (context.labSummaries.length) {
    lines.push("");
    lines.push(
      `Saved lab summaries: ${context.labSummaries
        .map((l) => `${l.title}${l.urgency ? ` (urgency ${l.urgency})` : ""}`)
        .join("; ")}`
    );
  }

  if (context.reminders.length) {
    lines.push("");
    lines.push(
      `Active medicine reminders: ${context.reminders
        .map((r) => `${r.medicine_name} at ${(r.times || []).map((t) => String(t).slice(0, 5)).join(", ")}`)
        .join("; ")}`
    );
  }

  lines.push("");
  lines.push("This brief lists what is on file for the patient. It is not a diagnosis.");
  return lines.join("\n");
}

const AI_SUMMARY_INSTRUCTION =
  "Summarise a patient's own records for the doctor who is about to see them.\n" +
  "Return ONLY a JSON object: {\"summary\": string}.\n" +
  "Rules: be factual and terse — bullet-style lines are fine inside `summary`. " +
  "Report only what is present in the supplied data. Never diagnose, never suggest a " +
  "medicine, a dose or a plan, and never speculate about a disease not already on file. " +
  "If a section has no data, say 'none recorded'. End with a single line: " +
  "'This brief is a summary of on-file data, not a diagnosis.'";

/** Compact, token-bounded serialisation of the context for the model. */
function contextForPrompt(context) {
  const p = context.profile || {};
  const lines = [
    `Patient: ${p.fullName || "unknown"}, age ${p.age ?? "unknown"}, gender ${p.gender || "unknown"}, blood group ${p.bloodGroup || "unknown"}`,
    `Known conditions: ${list(p.conditions || [], "none recorded")}${
      p.otherConditions ? `; other: ${p.otherConditions}` : ""
    }`,
  ];
  if (context.appointment) {
    lines.push(`Visit reason: ${context.appointment.reason || "not stated"}`);
  }
  lines.push(
    `History entries: ${
      context.medicalRecords.length
        ? context.medicalRecords
            .slice(0, 5)
            .map((r) => JSON.stringify(r).slice(0, 300))
            .join(" | ")
        : "none recorded"
    }`
  );
  lines.push(
    `Current prescriptions: ${
      context.prescriptions.length
        ? context.prescriptions
            .slice(0, 3)
            .map(
              (rx) =>
                `${rx.date}: ${rx.medicines
                  .map((m) => [m.name, m.dosage, m.frequency].filter(Boolean).join(" "))
                  .join(", ")}`
            )
            .join(" | ")
        : "none recorded"
    }`
  );
  if (context.vitals.tracker.length) {
    lines.push(
      `Tracker: ${context.vitals.tracker
        .slice(0, 6)
        .map((v) => `${v.type} ${v.value1}${v.value2 ? `/${v.value2}` : ""}`)
        .join(", ")}`
    );
  }
  if (context.vitals.wearable.length) {
    lines.push(`Wearable averages: ${context.vitals.wearable.map((w) => `${w.type} ${w.average}`).join(", ")}`);
  }
  if (context.labSummaries.length) {
    lines.push(`Saved lab summaries: ${context.labSummaries.map((l) => l.title).join(", ")}`);
  }
  if (context.reminders.length) {
    lines.push(`Active reminders: ${context.reminders.map((r) => r.medicine_name).join(", ")}`);
  }
  return lines.join("\n");
}

/**
 * Returns the model's summary text, or null so the caller uses the template.
 */
async function aiSummary(context, language) {
  if (isMockMode()) return null; // no key -> the caller uses the template
  const outcome = await generateJson({
    prompt: contextForPrompt(context),
    systemInstruction: AI_SUMMARY_INSTRUCTION,
    temperature: 0.2,
    language,
  });
  if (!outcome.ok || !outcome.data) return null;
  const text = String(outcome.data.summary || "").trim();
  return text ? text.slice(0, 6000) : null;
}

// GET /api/doctors/appointments/:id/pre-consult-summary?refresh=true
async function getPreConsultSummary(req, res, next) {
  try {
    const doctorProfileId = await doctorProfileIdFor(req.user.id);
    if (!doctorProfileId) return res.status(404).json({ error: "Doctor profile not found." });

    // Ownership is decided by the JWT, never by a body/query parameter.
    const [appointments] = await pool.query(
      "SELECT id, patient_id, appointment_date, appointment_time, status, reason FROM appointments WHERE id = ? AND doctor_id = ?",
      [req.params.id, doctorProfileId]
    );
    if (!appointments.length) return res.status(404).json({ error: "Appointment not found." });
    const appointment = appointments[0];

    const [consentRows] = await pool.query(
      "SELECT ai_summary_consent FROM patient_profiles WHERE user_id = ?",
      [appointment.patient_id]
    );
    const aiConsent = Boolean(consentRows.length && consentRows[0].ai_summary_consent);

    const language = normalizeLanguage(req.query.language);
    const refresh = String(req.query.refresh || "") === "true";

    if (!refresh) {
      const [cached] = await pool.query(
        "SELECT summary, source, language, created_at FROM pre_consult_summaries WHERE appointment_id = ?",
        [appointment.id]
      );
      if (cached.length) {
        await logAudit(req.user.id, "pre_consult.read", `appointment ${appointment.id} (cached)`);
        return res.json({
          summary: cached[0].summary,
          source: cached[0].source,
          cached: true,
          generatedAt: cached[0].created_at,
          aiConsent,
          patientId: appointment.patient_id,
        });
      }
    }

    const context = await buildPatientContext(appointment.patient_id, { appointmentId: appointment.id });

    let summary = null;
    let source = "template";
    let aiNote = null;

    if (!aiConsent) {
      // Default path: no patient data leaves the server.
      aiNote =
        "The patient has not switched on AI summaries, so this brief was built on the server from on-file data only.";
    } else if (isMockMode()) {
      aiNote = "AI summaries are switched on, but no AI provider key is configured, so the server-side brief was used.";
    } else {
      summary = await aiSummary(context, language);
      if (summary) source = "gemini";
      else aiNote = "The AI provider did not return a usable summary, so the server-side brief was used.";
    }

    if (!summary) summary = buildTemplateSummary(context);

    await pool.query(
      `INSERT INTO pre_consult_summaries (appointment_id, doctor_id, patient_id, summary, source, language)
       VALUES (?,?,?,?,?,?)
       ON CONFLICT (appointment_id) DO UPDATE
         SET summary = EXCLUDED.summary,
             source = EXCLUDED.source,
             language = EXCLUDED.language,
             created_at = NOW()`,
      [appointment.id, doctorProfileId, appointment.patient_id, summary, source, language]
    );

    await logAudit(
      req.user.id,
      "pre_consult.generate",
      `appointment ${appointment.id} source=${source} consent=${aiConsent ? "on" : "off"}`
    );

    res.json({
      summary,
      source,
      cached: false,
      generatedAt: new Date().toISOString(),
      aiConsent,
      patientId: appointment.patient_id,
      note: aiNote,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getPreConsultSummary, buildTemplateSummary, doctorProfileIdFor };
