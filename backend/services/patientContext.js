/**
 * Patient clinical context builder (Phase 1C) — also feeds Phase 4 trends.
 *
 * Everything the pre-consult summary needs, in one place:
 *   * the patient's profile (age, sex, blood group, conditions)
 *   * why the appointment was booked (appointments.reason)
 *   * the medical history the doctor wrote (medical_records)
 *   * the medicines already on file (prescription_items of recent prescriptions)
 *   * ONLY IF THE TABLES EXIST: tracker readings, wearable averages and the
 *     patient's own saved lab summaries.
 *
 * The "if the table exists" part is deliberate: this module is wired into
 * services that can run before the later phases have migrated a database, so a
 * missing table must degrade to "not available", never to a 500.
 */
const { pool } = require("../config/db");

const tableCache = new Map();

/** Cached `to_regclass` check — one round-trip per table per process. */
async function tableExists(name) {
  if (tableCache.has(name)) return tableCache.get(name);
  try {
    const [rows] = await pool.query("SELECT to_regclass(?) AS reg", [`public.${name}`]);
    const exists = Boolean(rows.length && rows[0].reg);
    tableCache.set(name, exists);
    return exists;
  } catch {
    tableCache.set(name, false);
    return false;
  }
}

function ageFrom(dateOfBirth) {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) age -= 1;
  return age >= 0 && age < 130 ? age : null;
}

/**
 * @param {number} patientId users.id of the patient
 * @param {{appointmentId?:number}} [options]
 */
async function buildPatientContext(patientId, options = {}) {
  const context = {
    patientId,
    profile: null,
    appointment: null,
    medicalRecords: [],
    prescriptions: [],
    vitals: { tracker: [], wearable: [] },
    labSummaries: [],
    reminders: [],
    availability: { tracker: false, wearables: false, labs: false, reminders: false },
  };

  const [profiles] = await pool.query(
    `SELECT u.full_name, u.id, p.date_of_birth, p.gender, p.blood_group, p.other_conditions,
            p.has_diabetes, p.has_hypertension, p.has_asthma, p.has_thyroid, p.has_heart_issue
     FROM users u LEFT JOIN patient_profiles p ON p.user_id = u.id
     WHERE u.id = ?`,
    [patientId]
  );
  if (profiles.length) {
    const row = profiles[0];
    context.profile = {
      fullName: row.full_name,
      age: ageFrom(row.date_of_birth),
      gender: row.gender || null,
      bloodGroup: row.blood_group || null,
      conditions: [
        row.has_diabetes ? "diabetes" : null,
        row.has_hypertension ? "hypertension" : null,
        row.has_asthma ? "asthma" : null,
        row.has_thyroid ? "thyroid disorder" : null,
        row.has_heart_issue ? "heart condition" : null,
      ].filter(Boolean),
      otherConditions: row.other_conditions || null,
    };
  }

  if (options.appointmentId) {
    const [appointments] = await pool.query(
      `SELECT a.id, a.appointment_date, a.appointment_time, a.status, a.reason
       FROM appointments a WHERE a.id = ?`,
      [options.appointmentId]
    );
    if (appointments.length) {
      context.appointment = {
        id: appointments[0].id,
        date: appointments[0].appointment_date,
        time: appointments[0].appointment_time,
        status: appointments[0].status,
        reason: appointments[0].reason || null,
      };
    }
  }

  // `SELECT *` on purpose: the exact medical_records columns live in the
  // original schema, and the summary only needs to list them for the doctor
  // who is already allowed to read them.
  const [records] = await pool.query(
    "SELECT * FROM medical_records WHERE patient_id = ? ORDER BY id DESC LIMIT 8",
    [patientId]
  );
  context.medicalRecords = records;

  const [prescriptions] = await pool.query(
    `SELECT pr.id, pr.prescription_date, pr.diagnosis, pi.medicine_name, pi.dosage, pi.frequency, pi.duration
     FROM prescriptions pr
     LEFT JOIN prescription_items pi ON pi.prescription_id = pr.id
     WHERE pr.patient_id = ?
     ORDER BY pr.prescription_date DESC, pr.id DESC LIMIT 40`,
    [patientId]
  );
  const byId = new Map();
  for (const row of prescriptions) {
    if (!byId.has(row.id)) {
      byId.set(row.id, { id: row.id, date: row.prescription_date, diagnosis: row.diagnosis, medicines: [] });
    }
    if (row.medicine_name) {
      byId.get(row.id).medicines.push({
        name: row.medicine_name,
        dosage: row.dosage,
        frequency: row.frequency,
        duration: row.duration,
      });
    }
  }
  context.prescriptions = Array.from(byId.values()).slice(0, 6);

  // ---- optional tables added by later phases ------------------------------
  if (await tableExists("health_metrics")) {
    context.availability.tracker = true;
    const [metrics] = await pool.query(
      `SELECT type, value1, value2, unit, recorded_at FROM health_metrics
       WHERE patient_id = ? ORDER BY recorded_at DESC LIMIT 10`,
      [patientId]
    );
    context.vitals.tracker = metrics;
  }

  if (await tableExists("wearable_samples")) {
    context.availability.wearables = true;
    try {
      const { wearableAverages } = require("./wearableStats");
      context.vitals.wearable = await wearableAverages(patientId, { days: 14 });
    } catch {
      context.vitals.wearable = [];
    }
  }

  if (await tableExists("lab_reports")) {
    context.availability.labs = true;
    const [labs] = await pool.query(
      `SELECT title, urgency, created_at FROM lab_reports
       WHERE patient_id = ? ORDER BY created_at DESC LIMIT 3`,
      [patientId]
    );
    context.labSummaries = labs;
  }

  if (await tableExists("medicine_reminders")) {
    context.availability.reminders = true;
    const [reminders] = await pool.query(
      `SELECT medicine_name, times FROM medicine_reminders
       WHERE patient_id = ? AND active = TRUE ORDER BY id LIMIT 20`,
      [patientId]
    );
    context.reminders = reminders;
  }

  return context;
}

module.exports = { buildPatientContext, tableExists, ageFrom };
