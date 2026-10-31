const { pool } = require("../config/db");
const { isDoctorVerified, verificationRequired } = require("../controllers/safetyController");

// GET /api/doctors  (public list - used by "Find a Doctor")
async function listDoctors(req, res, next) {
  try {
    const { specialization } = req.query;
    let sql = `SELECT dp.id, u.full_name AS name, dp.specialization, dp.experience, dp.rating,
                      dp.location, dp.bio, dp.consultation_fee, dp.image_url, dp.is_available
               FROM doctor_profiles dp
               JOIN users u ON u.id = dp.user_id
               WHERE u.status = 'active'`;
    const params = [];
    if (specialization) {
      sql += " AND dp.specialization = ?";
      params.push(specialization);
    }
    sql += " ORDER BY dp.rating DESC";
    const [rows] = await pool.query(sql, params);

    // Filter by verification status if REQUIRED
    if (verificationRequired()) {
      const verifiedDoctors = [];
      for (const doctor of rows) {
        if (await isDoctorVerified(doctor.id)) {
          verifiedDoctors.push(doctor);
        }
      }
      return res.json({ doctors: verifiedDoctors });
    }

    res.json({ doctors: rows });
  } catch (err) {
    next(err);
  }
}

// GET /api/doctors/:id
async function getDoctor(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT dp.id, u.full_name AS name, u.email, dp.specialization, dp.experience, dp.rating,
              dp.location, dp.bio, dp.consultation_fee, dp.image_url, dp.is_available
       FROM doctor_profiles dp JOIN users u ON u.id = dp.user_id
       WHERE dp.id = ?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Doctor not found." });

    const [slots] = await pool.query(
      "SELECT slot_date, slot_time, is_booked FROM doctor_slots WHERE doctor_id = ? AND slot_date >= CURRENT_DATE ORDER BY slot_date, slot_time",
      [req.params.id]
    );
    res.json({ doctor: rows[0], slots });
  } catch (err) {
    next(err);
  }
}

// GET /api/doctors/me/profile  (logged-in doctor's own profile)
async function getMyProfile(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT dp.*, u.full_name AS name, u.email, u.phone
       FROM doctor_profiles dp JOIN users u ON u.id = dp.user_id
       WHERE u.id = ?`,
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Doctor profile not found." });
    res.json({ profile: rows[0] });
  } catch (err) {
    next(err);
  }
}

// PUT /api/doctors/me/profile
async function updateMyProfile(req, res, next) {
  try {
    const { specialization, experience, location, bio, consultationFee, isAvailable, phone } = req.body;
    await pool.query(
      `UPDATE doctor_profiles SET
        specialization = COALESCE(?, specialization),
        experience = COALESCE(?, experience),
        location = COALESCE(?, location),
        bio = COALESCE(?, bio),
        consultation_fee = COALESCE(?, consultation_fee),
        is_available = COALESCE(?, is_available)
       WHERE user_id = ?`,
      [specialization || null, experience || null, location || null, bio || null,
       consultationFee || null, typeof isAvailable === "boolean" ? isAvailable : null, req.user.id]
    );
    if (phone) {
      await pool.query("UPDATE users SET phone = ? WHERE id = ?", [phone, req.user.id]);
    }
    res.json({ message: "Doctor profile updated." });
  } catch (err) {
    next(err);
  }
}

// GET /api/doctors/me/appointments  (logged-in doctor's appointment list)
async function getMyAppointments(req, res, next) {
  try {
    const [dp] = await pool.query("SELECT id FROM doctor_profiles WHERE user_id = ?", [req.user.id]);
    if (!dp.length) return res.status(404).json({ error: "Doctor profile not found." });

    const [rows] = await pool.query(
      `SELECT a.id, a.appointment_date, a.appointment_time, a.reason, a.fee, a.status,
              pu.id AS patient_id, pu.full_name AS patient_name, pu.email AS patient_email
       FROM appointments a
       JOIN users pu ON pu.id = a.patient_id
       WHERE a.doctor_id = ?
       ORDER BY a.appointment_date DESC, a.id DESC`,
      [dp[0].id]
    );
    res.json({ appointments: rows });
  } catch (err) {
    next(err);
  }
}

// PUT /api/doctors/me/appointments/:id  (mark completed / cancelled)
async function updateAppointmentStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!["Scheduled", "Completed", "Cancelled"].includes(status)) {
      return res.status(400).json({ error: "status must be Scheduled, Completed or Cancelled." });
    }
    const [dp] = await pool.query("SELECT id FROM doctor_profiles WHERE user_id = ?", [req.user.id]);
    if (!dp.length) return res.status(404).json({ error: "Doctor profile not found." });

    const [result] = await pool.query(
      "UPDATE appointments SET status = ? WHERE id = ? AND doctor_id = ?",
      [status, req.params.id, dp[0].id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: "Appointment not found." });
    res.json({ message: "Appointment updated." });
  } catch (err) {
    next(err);
  }
}

// GET /api/doctors/me/patients  (distinct patients this doctor has treated)
async function getMyPatients(req, res, next) {
  try {
    const [dp] = await pool.query("SELECT id FROM doctor_profiles WHERE user_id = ?", [req.user.id]);
    if (!dp.length) return res.status(404).json({ error: "Doctor profile not found." });

    const [rows] = await pool.query(
      `SELECT DISTINCT pu.id, pu.full_name, pu.email, pu.phone
       FROM appointments a
       JOIN users pu ON pu.id = a.patient_id
       WHERE a.doctor_id = ?
       ORDER BY pu.full_name`,
      [dp[0].id]
    );
    res.json({ patients: rows });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listDoctors, getDoctor, getMyProfile, updateMyProfile,
  getMyAppointments, updateAppointmentStatus, getMyPatients,
};
