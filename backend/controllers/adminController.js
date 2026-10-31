const bcrypt = require("bcryptjs");
const { pool } = require("../config/db");

const VALID_ROLES = ["patient", "doctor", "admin"];

// GET /api/admin/stats
async function getStats(req, res, next) {
  try {
    const [[{ totalPatients }]] = await pool.query("SELECT COUNT(*) AS totalPatients FROM users WHERE role='patient'");
    const [[{ totalDoctors }]] = await pool.query("SELECT COUNT(*) AS totalDoctors FROM users WHERE role='doctor'");
    const [[{ totalAppointments }]] = await pool.query("SELECT COUNT(*) AS totalAppointments FROM appointments");
    const [[{ totalHospitals }]] = await pool.query("SELECT COUNT(*) AS totalHospitals FROM hospitals");
    const [[{ scheduledToday }]] = await pool.query(
      "SELECT COUNT(*) AS scheduledToday FROM appointments WHERE appointment_date = CURRENT_DATE"
    );
    res.json({ totalPatients, totalDoctors, totalAppointments, totalHospitals, scheduledToday });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/users?role=patient|doctor|admin
async function listUsers(req, res, next) {
  try {
    const { role, search } = req.query;
    let sql = "SELECT id, full_name, email, phone, role, status, created_at FROM users WHERE 1=1";
    const params = [];
    if (role) {
      sql += " AND role = ?";
      params.push(role);
    }
    if (search) {
      sql += " AND (full_name LIKE ? OR email LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }
    sql += " ORDER BY created_at DESC";
    const [rows] = await pool.query(sql, params);
    res.json({ users: rows });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/users  (admin creates a user of any role)
async function createUser(req, res, next) {
  try {
    const { fullName, email, password, role, phone } = req.body;
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ error: "fullName, email, password and role are required." });
    }
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ error: "role must be one of patient, doctor, admin." });
    }
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email.toLowerCase()]);
    if (existing.length) return res.status(409).json({ error: "Email already registered." });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (full_name, email, password_hash, phone, role) VALUES (?,?,?,?,?)",
      [fullName, email.toLowerCase(), hash, phone || null, role]
    );
    if (role === "patient") {
      await pool.query("INSERT INTO patient_profiles (user_id) VALUES (?)", [result.insertId]);
    } else if (role === "doctor") {
      await pool.query("INSERT INTO doctor_profiles (user_id, specialization) VALUES (?, 'General Practitioner')", [result.insertId]);
    }
    res.status(201).json({ message: "User created.", userId: result.insertId });
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/users/:id  (update status/role)
async function updateUser(req, res, next) {
  try {
    const { status, role, fullName, phone } = req.body;
    if (role && !VALID_ROLES.includes(role)) {
      return res.status(400).json({ error: "role must be one of patient, doctor, admin." });
    }
    await pool.query(
      `UPDATE users SET
        status = COALESCE(?, status), role = COALESCE(?, role),
        full_name = COALESCE(?, full_name), phone = COALESCE(?, phone)
       WHERE id = ?`,
      [status || null, role || null, fullName || null, phone || null, req.params.id]
    );
    res.json({ message: "User updated." });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admin/users/:id
async function deleteUser(req, res, next) {
  try {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: "User not found." });
    res.json({ message: "User deleted." });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/appointments  (all appointments, any patient/doctor)
async function listAllAppointments(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT a.id, a.appointment_date, a.appointment_time, a.status, a.fee,
              pu.full_name AS patient_name, du.full_name AS doctor_name, dp.specialization
       FROM appointments a
       JOIN users pu ON pu.id = a.patient_id
       JOIN doctor_profiles dp ON dp.id = a.doctor_id
       JOIN users du ON du.id = dp.user_id
       ORDER BY a.appointment_date DESC, a.id DESC
       LIMIT 500`
    );
    res.json({ appointments: rows });
  } catch (err) {
    next(err);
  }
}

// ---------------- Hospitals ----------------

// GET /api/admin/hospitals (also exposed publicly at /api/hospitals)
async function listHospitals(req, res, next) {
  try {
    const [rows] = await pool.query("SELECT * FROM hospitals ORDER BY name");
    res.json({ hospitals: rows });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/hospitals
async function createHospital(req, res, next) {
  try {
    const { name, type, address, phone, rating, bedsAvailable, isEmergency, latitude, longitude } = req.body;
    if (!name) return res.status(400).json({ error: "name is required." });
    const [result] = await pool.query(
      `INSERT INTO hospitals (name, type, address, phone, rating, beds_available, is_emergency, latitude, longitude)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [name, type || null, address || null, phone || null, rating || 4.0, bedsAvailable || 0, !!isEmergency, latitude || null, longitude || null]
    );
    res.status(201).json({ message: "Hospital added.", hospitalId: result.insertId });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getStats, listUsers, createUser, updateUser, deleteUser,
  listAllAppointments, listHospitals, createHospital,
};
