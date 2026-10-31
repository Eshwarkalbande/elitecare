const bcrypt = require("bcryptjs");
const { pool } = require("../config/db");
const { signToken } = require("../utils/token");

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { fullName, email, password, role, phone } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "fullName, email and password are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    // Public self-registration may only create patient or doctor accounts.
    // "admin" accounts can ONLY be created through POST /api/admin/users (requireRole("admin")).
    if (role && !["patient", "doctor"].includes(role)) {
      return res.status(403).json({ error: "You cannot register with this role." });
    }
    const allowedRoles = ["patient", "doctor"];
    const finalRole = allowedRoles.includes(role) ? role : "patient";

    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email.toLowerCase().trim()]);
    if (existing.length) {
      return res.status(409).json({ error: "This email address is already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (full_name, email, password_hash, phone, role) VALUES (?,?,?,?,?)",
      [fullName.trim(), email.toLowerCase().trim(), passwordHash, phone || null, finalRole]
    );

    // Create the matching profile row so dashboards have somewhere to write data
    if (finalRole === "patient") {
      await pool.query("INSERT INTO patient_profiles (user_id) VALUES (?)", [result.insertId]);
    } else if (finalRole === "doctor") {
      // NOTE: the pg compatibility shim in config/db.js returns a single OBJECT
      // (spreading the RETURNING row) for an INSERT, not a mysql2-style row
      // array. Indexing this as `dpResult[0].id` throws and 500s the whole
      // registration, so read `.id` directly.
      const [dpResult] = await pool.query(
        "INSERT INTO doctor_profiles (user_id, specialization) VALUES (?, 'General Practitioner') RETURNING id",
        [result.insertId]
      );
      const doctorProfileId = dpResult.id;
      // Create a pending verification entry for the new doctor
      await pool.query(
        "INSERT INTO doctor_verifications (doctor_id, registration_number, council, year, status) VALUES (?, 'PENDING', 'Awaiting submission', NULL, 'pending')",
        [doctorProfileId]
      );
    }

    const user = { id: result.insertId, email: email.toLowerCase().trim(), role: finalRole, full_name: fullName.trim() };
    const token = signToken(user);

    res.status(201).json({
      message: finalRole === "doctor" ? "Registration successful. Your verification is pending admin approval." : "Registration successful.",
      token,
      user: { id: user.id, name: user.full_name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    // Identical response for "unknown email" and "wrong password" so the login
    // form cannot be used to enumerate which email addresses are registered.
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email.toLowerCase().trim()]);
    if (!rows.length) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const user = rows[0];
    if (user.status !== "active") {
      return res.status(403).json({ error: "This account has been suspended. Contact support." });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = signToken(user);
    res.json({
      message: `Successfully signed in. Welcome back, ${user.full_name}.`,
      token,
      user: { id: user.id, name: user.full_name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me
async function me(req, res, next) {
  try {
    const [rows] = await pool.query(
      "SELECT id, full_name, email, phone, role, status, created_at FROM users WHERE id = ?",
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: "User not found." });
    const user = rows[0];

    // For doctors, include verification status
    if (user.role === "doctor") {
      const [dp] = await pool.query("SELECT id FROM doctor_profiles WHERE user_id = ?", [user.id]);
      if (dp.length) {
        const [verification] = await pool.query(
          "SELECT status, notes FROM doctor_verifications WHERE doctor_id = ?",
          [dp[0].id]
        );
        user.verificationStatus = verification.length ? verification[0].status : "none";
        user.verificationNotes = verification.length ? verification[0].notes : null;
      }
    }

    res.json({ user });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me };
