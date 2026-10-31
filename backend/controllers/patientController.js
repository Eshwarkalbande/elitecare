const { pool } = require("../config/db");

/**
 * Privacy guard: a doctor may only touch a patient's records when they have an
 * ACTIVE clinical relationship with them.
 *
 * Active relationship means:
 *   - An appointment that is NOT 'Cancelled' AND (upcoming OR within the last 90 days)
 *   - OR a medical_record / prescription the doctor wrote within the last 90 days
 *
 * A deleted/cancelled appointment does NOT grant access. Admin access is unchanged.
 * The 90-day window is configurable via DOCTOR_ACCESS_WINDOW_DAYS (default 90).
 */
const DOCTOR_ACCESS_WINDOW_DAYS = Number(process.env.DOCTOR_ACCESS_WINDOW_DAYS) || 90;

async function doctorCanAccessPatient(doctorUserId, patientId) {
  const [dp] = await pool.query("SELECT id FROM doctor_profiles WHERE user_id = ?", [doctorUserId]);
  if (!dp.length) return false;
  const doctorProfileId = dp[0].id;

  const windowDays = DOCTOR_ACCESS_WINDOW_DAYS;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - windowDays);
  const cutoffISO = cutoffDate.toISOString().split("T")[0];

  const [rows] = await pool.query(
    `SELECT 1
     FROM appointments
     WHERE doctor_id = ? AND patient_id = ?
       AND status != 'Cancelled'
       AND appointment_date >= ?
     UNION
     SELECT 1
     FROM medical_records
     WHERE doctor_id = ? AND patient_id = ?
       AND record_date >= ?
     UNION
     SELECT 1
     FROM prescriptions
     WHERE doctor_id = ? AND patient_id = ?
       AND prescription_date >= ?
     LIMIT 1`,
    [doctorProfileId, patientId, cutoffISO, doctorProfileId, patientId, cutoffISO, doctorProfileId, patientId, cutoffISO]
  );
  return rows.length > 0;
}

// Helper: patients may only view their own data unless the caller is doctor/admin.
// Returns { patientId } on success, or { status, error } when access is not allowed.
async function resolvePatientId(req) {
  if (req.user.role === "patient") return { patientId: req.user.id };

  const paramId = req.params.patientId || req.query.patientId;
  const patientId = paramId ? Number(paramId) : null;
  if (!patientId) return { status: 400, error: "patientId is required." };

  if (req.user.role === "admin") return { patientId };

  // Doctor: only their own patients.
  const allowed = await doctorCanAccessPatient(req.user.id, patientId);
  if (!allowed) {
    return { status: 403, error: "You do not have permission to access this patient's records." };
  }
  return { patientId };
}

/**
 * Wraps resolvePatientId for the GET handlers. Sends the 400/403 response itself
 * when access is denied and returns `null` so the caller can bail out early.
 */
async function guardPatientAccess(req, res) {
  const result = await resolvePatientId(req);
  if (result.error) {
    res.status(result.status).json({ error: result.error });
    return null;
  }
  return result.patientId;
}

// GET /api/patients/profile
async function getProfile(req, res, next) {
  try {
    const patientId = await guardPatientAccess(req, res);
    if (!patientId) return;

    const [rows] = await pool.query(
      `SELECT u.id, u.full_name, u.email, u.phone, p.date_of_birth, p.gender, p.blood_group, p.address,
              p.has_diabetes, p.has_hypertension, p.has_asthma, p.has_thyroid, p.has_heart_issue,
              p.other_conditions, p.emergency_contact_name, p.emergency_contact_phone,
              p.ai_summary_consent
       FROM users u
       LEFT JOIN patient_profiles p ON p.user_id = u.id
       WHERE u.id = ? AND u.role = 'patient'`,
      [patientId]
    );
    if (!rows.length) return res.status(404).json({ error: "Patient not found." });
    res.json({ profile: rows[0] });
  } catch (err) {
    next(err);
  }
}

// PUT /api/patients/profile
async function updateProfile(req, res, next) {
  try {
    const patientId = req.user.id; // patients can only edit themselves
    const {
      fullName, phone, dateOfBirth, gender, bloodGroup, address,
      hasDiabetes, hasHypertension, hasAsthma, hasThyroid, hasHeartIssue,
      otherConditions, emergencyContactName, emergencyContactPhone,
      aiSummaryConsent,
    } = req.body;

    // Phase 1C — explicit opt-in for AI pre-consult summaries (default OFF).
    // Handled on its own so the existing profile UPDATE below stays untouched.
    if (typeof aiSummaryConsent === "boolean") {
      await pool.query("UPDATE patient_profiles SET ai_summary_consent = ? WHERE user_id = ?", [
        aiSummaryConsent,
        patientId,
      ]);
    }

    if (fullName || phone) {
      await pool.query("UPDATE users SET full_name = COALESCE(?, full_name), phone = COALESCE(?, phone) WHERE id = ?", [
        fullName || null, phone || null, patientId,
      ]);
    }

    // Only re-write patient_profiles when the caller actually sent profile
    // fields. The upsert below sets every flag from the request body, so running
    // it for a request that carried only, say, `aiSummaryConsent` would reset
    // has_diabetes / has_asthma / ... to FALSE and silently wipe the patient's
    // own record.
    const touchesProfile = [
      dateOfBirth, gender, bloodGroup, address,
      hasDiabetes, hasHypertension, hasAsthma, hasThyroid, hasHeartIssue,
      otherConditions, emergencyContactName, emergencyContactPhone,
    ].some((value) => value !== undefined && value !== null);

    if (touchesProfile) {
      await pool.query(
        `INSERT INTO patient_profiles
          (user_id, date_of_birth, gender, blood_group, address, has_diabetes, has_hypertension, has_asthma, has_thyroid, has_heart_issue, other_conditions, emergency_contact_name, emergency_contact_phone)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
         ON CONFLICT (user_id) DO UPDATE SET
          date_of_birth = EXCLUDED.date_of_birth, gender = EXCLUDED.gender, blood_group = EXCLUDED.blood_group,
          address = EXCLUDED.address, has_diabetes = EXCLUDED.has_diabetes, has_hypertension = EXCLUDED.has_hypertension,
          has_asthma = EXCLUDED.has_asthma, has_thyroid = EXCLUDED.has_thyroid, has_heart_issue = EXCLUDED.has_heart_issue,
          other_conditions = EXCLUDED.other_conditions, emergency_contact_name = EXCLUDED.emergency_contact_name,
          emergency_contact_phone = EXCLUDED.emergency_contact_phone`,
        [patientId, dateOfBirth || null, gender || null, bloodGroup || null, address || null,
         !!hasDiabetes, !!hasHypertension, !!hasAsthma, !!hasThyroid, !!hasHeartIssue,
         otherConditions || null, emergencyContactName || null, emergencyContactPhone || null]
      );
    }

    res.json({ message: "Profile updated successfully." });
  } catch (err) {
    next(err);
  }
}

// GET /api/patients/appointments
async function getAppointments(req, res, next) {
  try {
    const patientId = await guardPatientAccess(req, res);
    if (!patientId) return;

    const [rows] = await pool.query(
      `SELECT a.id, a.appointment_date, a.appointment_time, a.reason, a.fee, a.status,
              du.full_name AS doctor_name, dp.specialization
       FROM appointments a
       JOIN doctor_profiles dp ON dp.id = a.doctor_id
       JOIN users du ON du.id = dp.user_id
       WHERE a.patient_id = ?
       ORDER BY a.appointment_date DESC, a.id DESC`,
      [patientId]
    );
    res.json({ appointments: rows });
  } catch (err) {
    next(err);
  }
}

// POST /api/patients/appointments  (book)
async function bookAppointment(req, res, next) {
  try {
    const patientId = req.user.id;
    const { doctorId, date, time, reason, fee } = req.body;
    if (!doctorId || !date || !time) {
      return res.status(400).json({ error: "doctorId, date and time are required." });
    }

    // Check doctor verification if required
    const { isDoctorVerified } = require("../controllers/safetyController");
    if (await isDoctorVerified(doctorId) === false) {
      return res.status(403).json({ error: "This doctor is not verified and cannot accept bookings." });
    }

    const [result] = await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, fee, status)
       VALUES (?,?,?,?,?,?, 'Scheduled')`,
      [patientId, doctorId, date, time, reason || null, fee || 0]
    );
    res.status(201).json({ message: "Appointment booked.", appointmentId: result.insertId });
  } catch (err) {
    next(err);
  }
}

// PUT /api/patients/appointments/:id/cancel
async function cancelAppointment(req, res, next) {
  try {
    const patientId = req.user.id;
    const { id } = req.params;
    const [result] = await pool.query(
      "UPDATE appointments SET status = 'Cancelled' WHERE id = ? AND patient_id = ?",
      [id, patientId]
    );
    if (!result.affectedRows) return res.status(404).json({ error: "Appointment not found." });
    res.json({ message: "Appointment cancelled." });
  } catch (err) {
    next(err);
  }
}

// ---------------- Medical History ----------------

// GET /api/patients/medical-history
async function getMedicalHistory(req, res, next) {
  try {
    const patientId = await guardPatientAccess(req, res);
    if (!patientId) return;

    const [rows] = await pool.query(
      `SELECT mr.id, mr.record_date, mr.record_type, mr.diagnosis, mr.notes,
              mr.attachment_name, mr.attachment_url,
              du.full_name AS doctor_name
       FROM medical_records mr
       LEFT JOIN doctor_profiles dp ON dp.id = mr.doctor_id
       LEFT JOIN users du ON du.id = dp.user_id
       WHERE mr.patient_id = ?
       ORDER BY mr.record_date DESC, mr.id DESC`,
      [patientId]
    );
    res.json({ records: rows });
  } catch (err) {
    next(err);
  }
}

// POST /api/patients/medical-history  (doctor or admin adds a record for a patient)
async function addMedicalHistory(req, res, next) {
  try {
    const { patientId, recordDate, recordType, diagnosis, notes, attachmentName, attachmentUrl, appointmentId } = req.body;
    if (!patientId || !recordDate || !recordType) {
      return res.status(400).json({ error: "patientId, recordDate and recordType are required." });
    }

    // Admins may write for anyone; a doctor only for patients they actually treat.
    if (req.user.role === "doctor") {
      const allowed = await doctorCanAccessPatient(req.user.id, patientId);
      if (!allowed) {
        return res.status(403).json({ error: "You do not have permission to access this patient's records." });
      }
    }

    // Resolve the acting doctor's doctor_profiles.id (if a doctor is creating this)
    let doctorProfileId = null;
    if (req.user.role === "doctor") {
      const [dp] = await pool.query("SELECT id FROM doctor_profiles WHERE user_id = ?", [req.user.id]);
      doctorProfileId = dp.length ? dp[0].id : null;
    }

    const [result] = await pool.query(
      `INSERT INTO medical_records (patient_id, doctor_id, appointment_id, record_date, record_type, diagnosis, notes, attachment_name, attachment_url)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [patientId, doctorProfileId, appointmentId || null, recordDate, recordType, diagnosis || null, notes || null, attachmentName || null, attachmentUrl || null]
    );
    res.status(201).json({ message: "Medical record added.", recordId: result.insertId });
  } catch (err) {
    next(err);
  }
}

// ---------------- Prescriptions ----------------

// GET /api/patients/prescriptions
async function getPrescriptions(req, res, next) {
  try {
    const patientId = await guardPatientAccess(req, res);
    if (!patientId) return;

    const [prescriptions] = await pool.query(
      `SELECT pr.id, pr.prescription_date, pr.diagnosis, pr.notes, pr.status,
              du.full_name AS doctor_name, dp.specialization
       FROM prescriptions pr
       JOIN doctor_profiles dp ON dp.id = pr.doctor_id
       JOIN users du ON du.id = dp.user_id
       WHERE pr.patient_id = ?
       ORDER BY pr.prescription_date DESC, pr.id DESC`,
      [patientId]
    );

    if (!prescriptions.length) return res.json({ prescriptions: [] });

    const ids = prescriptions.map((p) => p.id);
    // One placeholder per id: the pg driver cannot expand a JS array into a
    // single `IN (?)` slot (it arrives as an array literal -> 22P02), so the
    // list is flattened into `IN (?, ?, …)` before it reaches the shim.
    const placeholders = ids.map(() => "?").join(", ");
    const [items] = await pool.query(
      `SELECT * FROM prescription_items WHERE prescription_id IN (${placeholders})`,
      ids
    );

    const grouped = prescriptions.map((p) => ({
      ...p,
      medicines: items.filter((i) => i.prescription_id === p.id),
    }));

    res.json({ prescriptions: grouped });
  } catch (err) {
    next(err);
  }
}

// POST /api/patients/prescriptions  (doctor writes a new prescription)
async function addPrescription(req, res, next) {
  try {
    const { patientId, prescriptionDate, diagnosis, notes, appointmentId, medicines } = req.body;
    if (!patientId || !prescriptionDate || !Array.isArray(medicines) || !medicines.length) {
      return res.status(400).json({ error: "patientId, prescriptionDate and at least one medicine are required." });
    }

    const [dp] = await pool.query("SELECT id FROM doctor_profiles WHERE user_id = ?", [req.user.id]);
    if (!dp.length) return res.status(400).json({ error: "Doctor profile not found for the current user." });
    const doctorProfileId = dp[0].id;

    // A doctor may only prescribe for patients they actually treat.
    const allowed = await doctorCanAccessPatient(req.user.id, patientId);
    if (!allowed) {
      return res.status(403).json({ error: "You do not have permission to access this patient's records." });
    }

    const [result] = await pool.query(
      `INSERT INTO prescriptions (patient_id, doctor_id, appointment_id, prescription_date, diagnosis, notes, status)
       VALUES (?,?,?,?,?,?, 'Active')`,
      [patientId, doctorProfileId, appointmentId || null, prescriptionDate, diagnosis || null, notes || null]
    );

    // Phase 1B — propose a schedule for each medicine the doctor just added.
    // This is a suggestion only: nothing becomes active until the patient
    // confirms the times in the Health Hub. The doctor's dose text is copied
    // verbatim and never rewritten.
    const { proposeSchedule } = require("../services/reminderParser");
    const proposedSchedule = [];

    for (const m of medicines) {
      const [item] = await pool.query(
        `INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, instructions)
         VALUES (?,?,?,?,?,?)`,
        [result.insertId, m.name, m.dosage || null, m.frequency || null, m.duration || null, m.instructions || null]
      );
      const proposal = proposeSchedule(m);
      proposedSchedule.push({
        prescriptionItemId: item.insertId ?? null,
        medicineName: m.name,
        doseText: m.dosage || m.frequency || null,
        confident: proposal.confident,
        times: proposal.times,
        endDate: proposal.endDate,
        reason: proposal.reason,
        parser: proposal.parser,
      });
    }

    res.status(201).json({
      message: "Prescription created.",
      prescriptionId: result.insertId,
      proposedSchedule,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProfile, updateProfile,
  getAppointments, bookAppointment, cancelAppointment,
  getMedicalHistory, addMedicalHistory,
  getPrescriptions, addPrescription,
  // Exported so the phase 1-6 controllers reuse the SAME ownership rules
  // instead of re-implementing them (services/access.js wraps these).
  doctorCanAccessPatient,
  resolvePatientId,
  guardPatientAccess,
};
