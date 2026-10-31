/**
 * Phase 5 — Safety and trust.
 *
 *  5A  emergency contacts + a consented SOS log
 *  5B  opt-in Emergency Health Card with a public, read-only page
 *  5C  doctor verification (self-submit, admin review, REQUIRE_DOCTOR_VERIFICATION)
 *
 * The public card endpoint returns ONLY the fields the patient switched on, adds
 * X-Robots-Tag: noindex, is rate limited in the route file, and writes one audit
 * entry per view using a HASHED ip (never the raw address).
 */
const crypto = require("crypto");
const QRCode = require("qrcode");
const { pool } = require("../config/db");
const { logAudit, hashIp } = require("../services/audit");

const SHOW_FIELD_KEYS = ["name", "blood_group", "allergies", "conditions", "medicines", "emergency_contact"];
const DEFAULT_SHOW_FIELDS = {
  name: true,
  blood_group: true,
  allergies: false,
  conditions: false,
  medicines: false,
  emergency_contact: true,
};

/** 32+ character URL-safe random token. */
function makeCardToken() {
  return crypto.randomBytes(32).toString("base64url");
}

function normalizeShowFields(input) {
  const result = { ...DEFAULT_SHOW_FIELDS };
  if (input && typeof input === "object") {
    for (const key of SHOW_FIELD_KEYS) {
      if (typeof input[key] === "boolean") result[key] = input[key];
    }
  }
  return result;
}

/** True when unverified doctors must be hidden/blocked (default false). */
function verificationRequired() {
  return String(process.env.REQUIRE_DOCTOR_VERIFICATION || "false").toLowerCase() === "true";
}

/** 'approved' | 'pending' | 'rejected' | 'none' for a doctor_profiles.id */
async function verificationStatusOf(doctorProfileId) {
  const [rows] = await pool.query("SELECT status FROM doctor_verifications WHERE doctor_id = ?", [doctorProfileId]);
  return rows.length ? rows[0].status : "none";
}

/** Used by the finder and by booking when REQUIRE_DOCTOR_VERIFICATION=true. */
async function isDoctorVerified(doctorProfileId) {
  if (!verificationRequired()) return true;
  return (await verificationStatusOf(doctorProfileId)) === "approved";
}

// GET /api/patients/emergency-contacts
async function listContacts(req, res, next) {
  try {
    const [rows] = await pool.query(
      "SELECT id, full_name, phone, relation, created_at FROM emergency_contacts WHERE patient_id = ? ORDER BY id",
      [req.user.id]
    );
    res.json({ contacts: rows });
  } catch (err) {
    next(err);
  }
}

// POST /api/patients/emergency-contacts
async function addContact(req, res, next) {
  try {
    const { fullName, phone, relation } = req.body || {};
    if (!fullName || !String(fullName).trim()) return res.status(400).json({ error: "fullName is required." });
    if (!phone || !String(phone).trim()) return res.status(400).json({ error: "phone is required." });

    const [[{ total }]] = await pool.query("SELECT COUNT(*) AS total FROM emergency_contacts WHERE patient_id = ?", [
      req.user.id,
    ]);
    if (Number(total) >= 10) return res.status(400).json({ error: "You can keep up to 10 emergency contacts." });

    const [result] = await pool.query(
      "INSERT INTO emergency_contacts (patient_id, full_name, phone, relation) VALUES (?,?,?,?)",
      [req.user.id, String(fullName).slice(0, 150), String(phone).slice(0, 30), relation ? String(relation).slice(0, 50) : null]
    );
    res.status(201).json({ message: "Emergency contact added.", contactId: result.insertId ?? null });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/patients/emergency-contacts/:id
async function deleteContact(req, res, next) {
  try {
    const [result] = await pool.query("DELETE FROM emergency_contacts WHERE id = ? AND patient_id = ?", [
      req.params.id,
      req.user.id,
    ]);
    if (!result.affectedRows) return res.status(404).json({ error: "Contact not found." });
    res.json({ message: "Contact removed." });
  } catch (err) {
    next(err);
  }
}

// POST /api/patients/sos
// The app never dials and never sends: the phone does that through the tel:,
// sms: and wa.me links. This endpoint only records the event, and only when the
// patient explicitly consented to logging.
async function logSos(req, res, next) {
  try {
    const { latitude, longitude, note, consent } = req.body || {};
    const consentLogging = consent === true;

    const lat = Number.isFinite(Number(latitude)) ? Number(latitude) : null;
    const lon = Number.isFinite(Number(longitude)) ? Number(longitude) : null;
    if ((lat !== null && Math.abs(lat) > 90) || (lon !== null && Math.abs(lon) > 180)) {
      return res.status(400).json({ error: "Those coordinates are not valid." });
    }

    if (!consentLogging) {
      return res.json({
        logged: false,
        message: "Nothing was recorded, because you did not consent to logging this event.",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO sos_events (patient_id, latitude, longitude, note, consent_logging) VALUES (?,?,?,?,TRUE)",
      [req.user.id, lat, lon, note ? String(note).slice(0, 255) : null]
    );
    await logAudit(req.user.id, "sos.logged", `sos event ${result.insertId} (consented)`);
    res.status(201).json({ logged: true, sosId: result.insertId ?? null });
  } catch (err) {
    next(err);
  }
}

// ------------------------------------------------------------ 5B emergency card
/** Loads the caller's card, creating it lazily but always DISABLED. */
async function getOrCreateCard(patientId) {
  const [rows] = await pool.query("SELECT * FROM emergency_cards WHERE patient_id = ?", [patientId]);
  if (rows.length) return rows[0];

  const token = makeCardToken();
  const [created] = await pool.query(
    "INSERT INTO emergency_cards (patient_id, token, enabled, show_fields) VALUES (?,?,FALSE,?::jsonb)",
    [patientId, token, JSON.stringify(DEFAULT_SHOW_FIELDS)]
  );
  return {
    id: created.insertId,
    patient_id: patientId,
    token,
    enabled: false,
    show_fields: DEFAULT_SHOW_FIELDS,
    revoked_at: null,
  };
}

// GET /api/patients/emergency-card
async function getMyCard(req, res, next) {
  try {
    const card = await getOrCreateCard(req.user.id);
    // The QR is only useful while the card is ON; a revoked card gets no image,
    // because a picture of a dead link would be misleading.
    const publicUrl = `${process.env.PUBLIC_APP_URL || "http://localhost:5173"}/emergency/${card.token}`;
    const qrDataUrl =
      card.enabled && !card.revoked_at ? await QRCode.toDataURL(publicUrl, { margin: 1, width: 220 }) : null;

    res.json({
      card: {
        token: card.token,
        enabled: card.enabled === true,
        showFields: normalizeShowFields(card.show_fields),
        revokedAt: card.revoked_at,
        url: publicUrl,
        path: `/emergency/${card.token}`,
        qrDataUrl,
      },
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/patients/emergency-card   { enabled, showFields }
async function updateMyCard(req, res, next) {
  try {
    const card = await getOrCreateCard(req.user.id);
    const enabled = (req.body && req.body.enabled) === true;
    const showFields = normalizeShowFields((req.body && req.body.showFields) || card.show_fields);

    await pool.query(
      "UPDATE emergency_cards SET enabled = ?, show_fields = ?::jsonb, revoked_at = NULL WHERE patient_id = ?",
      [enabled, JSON.stringify(showFields), req.user.id]
    );
    await logAudit(req.user.id, "emergency_card.update", `enabled=${enabled}`);

    res.json({ message: enabled ? "Emergency card is on." : "Emergency card is off.", enabled, showFields });
  } catch (err) {
    next(err);
  }
}

// POST /api/patients/emergency-card/regenerate
async function regenerateMyCard(req, res, next) {
  try {
    await getOrCreateCard(req.user.id);
    const token = makeCardToken();
    await pool.query("UPDATE emergency_cards SET token = ?, revoked_at = NULL WHERE patient_id = ?", [
      token,
      req.user.id,
    ]);
    await logAudit(req.user.id, "emergency_card.regenerate", "new token issued");

    const publicUrl = `${process.env.PUBLIC_APP_URL || "http://localhost:5173"}/emergency/${token}`;
    res.json({
      message: "A new link was created. The old QR code no longer works.",
      token,
      path: `/emergency/${token}`,
      url: publicUrl,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/public/emergency/:token   (no auth — the token IS the capability)
 * Returns ONLY the fields the patient switched on. A revoked card 404s.
 */
async function publicCard(req, res, next) {
  try {
    const token = String(req.params.token || "");
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.setHeader("Cache-Control", "no-store");
    if (token.length < 32) return res.status(404).json({ error: "Card not found." });

    const [rows] = await pool.query("SELECT * FROM emergency_cards WHERE token = ?", [token]);
    if (!rows.length) return res.status(404).json({ error: "Card not found." });
    const card = rows[0];
    if (!card.enabled || card.revoked_at) {
      await logAudit(null, "emergency_card.public_view", `token ${token.slice(0, 6)} revoked/disabled`);
      return res.status(404).json({ error: "Card not found." });
    }

    const show = normalizeShowFields(card.show_fields);
    const [profiles] = await pool.query(
      `SELECT u.full_name, p.blood_group, p.other_conditions, p.has_diabetes, p.has_hypertension,
              p.has_asthma, p.has_thyroid, p.has_heart_issue
       FROM users u LEFT JOIN patient_profiles p ON p.user_id = u.id WHERE u.id = ?`,
      [card.patient_id]
    );
    const profile = profiles[0] || {};

    const payload = {};
    if (show.name) payload.name = profile.full_name || null;
    if (show.blood_group) payload.bloodGroup = profile.blood_group || null;
    if (show.conditions) {
      payload.conditions = [
        profile.has_diabetes ? "Diabetes" : null,
        profile.has_hypertension ? "Hypertension" : null,
        profile.has_asthma ? "Asthma" : null,
        profile.has_thyroid ? "Thyroid disorder" : null,
        profile.has_heart_issue ? "Heart condition" : null,
        profile.other_conditions || null,
      ].filter(Boolean);
    }
    if (show.allergies) payload.allergies = profile.allergies || null;
    if (show.medicines) {
      const [medicines] = await pool.query(
        `SELECT DISTINCT pi.medicine_name FROM prescription_items pi
         JOIN prescriptions pr ON pr.id = pi.prescription_id
         WHERE pr.patient_id = ? AND pr.status = 'Active' LIMIT 20`,
        [card.patient_id]
      );
      payload.currentMedicines = medicines.map((row) => row.medicine_name);
    }
    if (show.emergency_contact) {
      const [contacts] = await pool.query(
        "SELECT full_name, phone, relation FROM emergency_contacts WHERE patient_id = ? ORDER BY id LIMIT 3",
        [card.patient_id]
      );
      payload.emergencyContacts = contacts;
    }

    // One audit row per public view, keyed by a HASHED ip.
    await logAudit(null, "emergency_card.public_view", `ip=${hashIp(req.ip)}`);

    res.json({
      card: payload,
      emergencyNumber: "112",
      disclaimer:
        "This card only shows what the patient chose to publish. It is not a medical record and it is not a diagnosis.",
      viewedAt: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/patients/emergency-card/revoke
async function revokeMyCard(req, res, next) {
  try {
    await pool.query("UPDATE emergency_cards SET enabled = FALSE, revoked_at = NOW() WHERE patient_id = ?", [
      req.user.id,
    ]);
    await logAudit(req.user.id, "emergency_card.revoke", "revoked by patient");
    res.json({ message: "Emergency card revoked. The public link now returns 404." });
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------------------------
// 5C. Doctor verification
//
// A doctor submits their own registration number, an admin approves or rejects
// it, and REQUIRE_DOCTOR_VERIFICATION decides whether an unapproved doctor may
// still be listed / booked. With the flag OFF (the default) the feature only
// records the submission.
// ---------------------------------------------------------------------------

const VERIFICATION_STATUSES = ["pending", "approved", "rejected"];

/** The caller's doctor_profiles.id, or null when they have no profile. */
async function doctorProfileIdForUser(userId) {
  const [rows] = await pool.query("SELECT id FROM doctor_profiles WHERE user_id = ?", [userId]);
  return rows.length ? rows[0].id : null;
}

async function verificationRow(doctorProfileId) {
  const [rows] = await pool.query(
    "SELECT registration_number, council, year, status, notes, created_at FROM doctor_verifications WHERE doctor_id = ?",
    [doctorProfileId]
  );
  return rows[0] || null;
}

// POST /api/doctors/me/verification   { registrationNumber, council?, year? }
async function submitVerification(req, res, next) {
  try {
    const doctorProfileId = await doctorProfileIdForUser(req.user.id);
    if (!doctorProfileId) return res.status(404).json({ error: "Doctor profile not found." });

    const body = req.body || {};
    const registrationNumber = String(body.registrationNumber || "").trim();
    if (!registrationNumber) return res.status(400).json({ error: "registrationNumber is required." });
    if (registrationNumber.length > 60) {
      return res.status(400).json({ error: "registrationNumber must be 60 characters or fewer." });
    }

    const year = body.year === undefined || body.year === null || body.year === "" ? null : Number(body.year);
    if (year !== null && (!Number.isInteger(year) || year < 1950 || year > new Date().getFullYear())) {
      return res.status(400).json({ error: "year must be a realistic registration year." });
    }

    // One row per doctor, ever. Re-submitting while pending only refreshes the
    // details; once a decision is made the row is locked so a rejected doctor
    // cannot quietly overwrite the evidence.
    const [existing] = await pool.query("SELECT status FROM doctor_verifications WHERE doctor_id = ?", [
      doctorProfileId,
    ]);
    if (existing.length && existing[0].status !== "pending") {
      return res.status(409).json({
        error: `Your verification was already ${existing[0].status}. Contact an administrator to change it.`,
        status: existing[0].status,
      });
    }

    await pool.query(
      `INSERT INTO doctor_verifications (doctor_id, registration_number, council, year, status)
       VALUES (?,?,?,?,'pending')
       ON CONFLICT (doctor_id) DO UPDATE
         SET registration_number = EXCLUDED.registration_number,
             council             = EXCLUDED.council,
             year                = EXCLUDED.year,
             status              = 'pending',
             notes               = NULL,
             reviewed_by         = NULL,
             reviewed_at         = NULL,
             updated_at          = NOW()`,
      [doctorProfileId, registrationNumber, body.council || null, year]
    );
    await logAudit(req.user.id, "doctor_verification.submit", `doctor ${doctorProfileId}`);

    res.status(201).json({
      message: "Verification details submitted. An administrator will review them.",
      status: "pending",
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/doctors/me/verification
async function getMyVerification(req, res, next) {
  try {
    const doctorProfileId = await doctorProfileIdForUser(req.user.id);
    if (!doctorProfileId) return res.status(404).json({ error: "Doctor profile not found." });

    const status = await verificationStatusOf(doctorProfileId);
    const row = status === "none" ? null : await verificationRow(doctorProfileId);
    res.json({
      status,
      requiredForBooking: verificationRequired(),
      registrationNumber: row ? row.registration_number : null,
      council: row ? row.council : null,
      year: row ? row.year : null,
      notes: row ? row.notes : null,
      submittedAt: row ? row.created_at : null,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/verifications?status=pending|approved|rejected|all
async function adminListVerifications(req, res, next) {
  try {
    const requested = String(req.query.status || "").toLowerCase();
    const params = [];
    let sql =
      `SELECT v.id, v.doctor_id, v.registration_number, v.council, v.year, v.status, v.notes,
              v.reviewed_at, v.created_at, u.full_name, u.email
       FROM doctor_verifications v
       JOIN doctor_profiles dp ON dp.id = v.doctor_id
       JOIN users u ON u.id = dp.user_id`;
    if (requested && requested !== "all") {
      if (!VERIFICATION_STATUSES.includes(requested)) {
        return res.status(400).json({ error: "status must be pending, approved, rejected or all." });
      }
      sql += " WHERE v.status = ?";
      params.push(requested);
    }
    sql += " ORDER BY v.status, v.created_at DESC LIMIT 200";

    const [rows] = await pool.query(sql, params);
    res.json({
      verifications: rows.map((row) => ({
        id: row.id,
        doctorId: row.doctor_id,
        name: row.full_name,
        email: row.email,
        registrationNumber: row.registration_number,
        council: row.council,
        year: row.year,
        status: row.status,
        notes: row.notes,
        submittedAt: row.created_at,
        reviewedAt: row.reviewed_at,
      })),
      requiredForBooking: verificationRequired(),
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/verifications/:id   { status: approved|rejected, notes? }
async function adminReviewVerification(req, res, next) {
  try {
    const body = req.body || {};
    const status = String(body.status || "").toLowerCase();
    if (status !== "approved" && status !== "rejected") {
      return res.status(400).json({ error: "status must be approved or rejected." });
    }

    const [result] = await pool.query(
      `UPDATE doctor_verifications
          SET status = ?, notes = ?, reviewed_by = ?, reviewed_at = NOW(), updated_at = NOW()
        WHERE id = ?`,
      [status, body.notes ? String(body.notes).slice(0, 255) : null, req.user.id, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: "Verification request not found." });
    await logAudit(req.user.id, "doctor_verification.review", `verification ${req.params.id} -> ${status}`);

    res.json({ message: `Verification ${status}.`, status });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  // 5A
  listContacts,
  addContact,
  deleteContact,
  logSos,
  // 5B
  getMyCard,
  updateMyCard,
  regenerateMyCard,
  revokeMyCard,
  publicCard,
  // 5C
  submitVerification,
  getMyVerification,
  adminListVerifications,
  adminReviewVerification,
  isDoctorVerified,
  verificationStatusOf,
  verificationRequired,
  SHOW_FIELD_KEYS,
  DEFAULT_SHOW_FIELDS,
};

