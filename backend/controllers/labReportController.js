/**
 * Phase 1A — Lab Report Explainer: the SAVED summaries only.
 *
 * The AI call itself lives in controllers/aiToolsController.js (POST /api/ai/lab-report).
 * Nothing is written here unless the patient tapped "Save summary", which is the
 * only path that reaches POST /api/patients/lab-reports.
 */
const { pool } = require("../config/db");
const { logAudit } = require("../services/audit");
const { guardScope } = require("../services/access");

const ITEM_STATUSES = ["low", "normal", "high", "unknown"];
const URGENCIES = ["low", "medium", "high", "unknown"];
const AI_LANGUAGES = ["en", "hi", "mr"];

function normalizeItems(input) {
  if (!Array.isArray(input)) return [];
  return input
    .filter((item) => item && typeof item === "object" && String(item.name || "").trim())
    .slice(0, 60)
    .map((item) => ({
      name: String(item.name).trim().slice(0, 80),
      value: item.value == null ? "" : String(item.value).slice(0, 40),
      unit: item.unit == null ? "" : String(item.unit).slice(0, 20),
      referenceRange: item.referenceRange == null ? "" : String(item.referenceRange).slice(0, 40),
      status: ITEM_STATUSES.includes(String(item.status || "").toLowerCase())
        ? String(item.status).toLowerCase()
        : "unknown",
      note: item.note == null ? "" : String(item.note).slice(0, 300),
    }));
}

function normalizeQuestions(input) {
  if (!Array.isArray(input)) return [];
  return input
    .map((q) => String(q || "").trim().slice(0, 200))
    .filter(Boolean)
    .slice(0, 10);
}

// GET /api/patients/lab-reports
async function listLabReports(req, res, next) {
  try {
    const scope = await guardScope(req, res);
    if (!scope) return;

    const params = [scope.patientId];
    let sql =
      `SELECT id, title, report_date, summary, items, questions_for_doctor, urgency,
              language, ai_source, shared_with_doctor_at, created_at, family_member_id
       FROM lab_reports WHERE patient_id = ?`;
    if (scope.familyMemberId) {
      sql += " AND family_member_id = ?";
      params.push(scope.familyMemberId);
    }
    sql += " ORDER BY created_at DESC, id DESC LIMIT 50";

    const [rows] = await pool.query(sql, params);

    // A doctor or an admin reading patient data must leave a trail.
    if (req.user.role !== "patient") {
      await logAudit(req.user.id, "lab_reports.read", `patient ${scope.patientId} (${rows.length} row(s))`);
    }

    res.json({
      labReports: rows.map((row) => ({
        ...row,
        items: Array.isArray(row.items) ? row.items : [],
        questionsForDoctor: Array.isArray(row.questions_for_doctor) ? row.questions_for_doctor : [],
      })),
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/patients/lab-reports   (patient saves a summary they just generated)
async function saveLabReport(req, res, next) {
  try {
    const { title, reportDate, summary, items, questionsForDoctor, urgency, language, familyMemberId } = req.body || {};

    let memberId = null;
    if (familyMemberId) {
      const { ownsFamilyMember } = require("../services/access");
      if (!(await ownsFamilyMember(req.user.id, Number(familyMemberId)))) {
        return res.status(403).json({ error: "That family member does not belong to this account." });
      }
      memberId = Number(familyMemberId);
    }

    const [result] = await pool.query(
      `INSERT INTO lab_reports
         (patient_id, family_member_id, title, report_date, summary, items, questions_for_doctor, urgency, language, ai_source)
       VALUES (?,?,?,?,?,?::jsonb,?::jsonb,?,?,?)`,
      [
        req.user.id,
        memberId,
        String(title || "Lab report").slice(0, 150),
        reportDate || null,
        String(summary || "").slice(0, 4000) || null,
        JSON.stringify(normalizeItems(items)),
        JSON.stringify(normalizeQuestions(questionsForDoctor)),
        URGENCIES.includes(String(urgency || "").toLowerCase()) ? String(urgency).toLowerCase() : "unknown",
        AI_LANGUAGES.includes(String(language || "")) ? String(language) : "en",
        "gemini",
      ]
    );

    res.status(201).json({ message: "Summary saved.", labReportId: result.insertId ?? null });
  } catch (err) {
    next(err);
  }
}


// POST /api/patients/lab-reports/:id/share
async function shareLabReport(req, res, next) {
  try {
    const [rows] = await pool.query("SELECT id, title FROM lab_reports WHERE id = ? AND patient_id = ?", [
      req.params.id,
      req.user.id,
    ]);
    if (!rows.length) return res.status(404).json({ error: "Saved summary not found." });

    const doctorProfileId = req.body && req.body.doctorId ? Number(req.body.doctorId) : null;

    if (doctorProfileId) {
      // The patient may only share with a doctor they actually have a visit with.
      const [link] = await pool.query(
        "SELECT 1 FROM appointments WHERE patient_id = ? AND doctor_id = ? LIMIT 1",
        [req.user.id, doctorProfileId]
      );
      if (!link.length) {
        return res.status(403).json({ error: "You can only share with a doctor you have an appointment with." });
      }
      const [doctorUser] = await pool.query("SELECT user_id FROM doctor_profiles WHERE id = ?", [doctorProfileId]);
      if (doctorUser.length) {
        // The notification body carries no clinical data — the doctor reads the
        // summary in the pre-consult panel, which writes its own audit entry.
        const { deliver } = require("../services/notify");
        try {
          await deliver({
            userId: doctorUser[0].user_id,
            title: "A patient shared a saved lab summary",
            message: "Open the patient's pre-consult summary to read it.",
            provider: "inapp",
          });
        } catch (err) {
          console.warn(`lab-report share: in-app notification failed (${String(err.message).slice(0, 80)})`);
        }
      }
    }

    await pool.query("UPDATE lab_reports SET shared_with_doctor_at = NOW() WHERE id = ?", [req.params.id]);
    await logAudit(req.user.id, "lab_reports.share", `lab report ${req.params.id}`);
    res.json({ message: "Shared with your doctor.", sharedWithDoctor: true });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/patients/lab-reports/:id
async function deleteLabReport(req, res, next) {
  try {
    const [result] = await pool.query("DELETE FROM lab_reports WHERE id = ? AND patient_id = ?", [
      req.params.id,
      req.user.id,
    ]);
    if (!result.affectedRows) return res.status(404).json({ error: "Saved summary not found." });
    await logAudit(req.user.id, "lab_reports.delete", `lab report ${req.params.id}`);
    res.json({ message: "Deleted." });
  } catch (err) {
    next(err);
  }
}

module.exports = { listLabReports, saveLabReport, shareLabReport, deleteLabReport };
