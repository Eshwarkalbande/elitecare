/**
 * Phase 6 — Smart automation.
 *
 *  6A  symptom-to-booking: turns free-text symptoms into a shortlist of
 *      specialities and the next bookable slots. It NEVER books anything.
 *  6B  live clinic queue: one token per appointment, per doctor, per day.
 *  6C  follow-up suggestions the doctor sets; the patient sees a card and can
 *      dismiss it.
 *
 * Honesty rules enforced here:
 *   * the speciality match is a transparent keyword table, not a diagnosis. The
 *     API always returns the keywords that matched so the UI can explain it;
 *   * a queue token is only issued for an appointment that genuinely exists,
 *     belongs to the caller's doctor (resolved from the JWT, never a param) and
 *     is not already tokenised for that day;
 *   * a follow-up is a SUGGESTION written by the doctor. Nothing is booked and
 *     nobody is contacted unless a real transport accepts the notification.
 */
const { pool } = require("../config/db");
const { logAudit } = require("../services/audit");

// ---------------------------------------------------------------------------
// 6A — symptom to speciality
// ---------------------------------------------------------------------------

/**
 * A deliberately small, inspectable keyword table. The matching keywords are
 * returned in the API response so the UI can always explain WHY a speciality
 * was suggested — the app never shows an opaque recommendation.
 */
const SPECIALITY_RULES = [
  {
    speciality: "Cardiology",
    doctorSpeciality: "Cardiologist",
    keywords: ["chest pain", "palpitation", "heart", "blood pressure", "irregular heartbeat", "chest"],
  },
  {
    speciality: "Dermatology",
    doctorSpeciality: "Dermatologist",
    keywords: ["rash", "skin", "itch", "acne", "mole", "hair loss", "eczema"],
  },
  {
    speciality: "Orthopaedics",
    doctorSpeciality: "Orthopaedic Surgeon",
    keywords: ["knee", "joint", "bone", "fracture", "back pain", "shoulder", "ankle", "spine"],
  },
  {
    speciality: "Paediatrics",
    doctorSpeciality: "Paediatrician",
    keywords: ["child", "baby", "infant", "toddler", "newborn", "my son", "my daughter"],
  },
  {
    speciality: "Obstetrics & Gynaecology",
    doctorSpeciality: "Gynaecologist",
    keywords: ["pregnancy", "pregnant", "period", "menstrual", "antenatal", "delivery", "pcos"],
  },
  {
    speciality: "ENT",
    doctorSpeciality: "ENT Specialist",
    keywords: ["ear", "nose", "throat", "sore throat", "hearing", "sinus", "tonsil"],
  },
  {
    speciality: "Ophthalmology",
    doctorSpeciality: "Ophthalmologist",
    keywords: ["eye", "eyes", "vision", "blurry", "cataract", "conjunctivitis"],
  },
  {
    speciality: "Gastroenterology",
    doctorSpeciality: "Gastroenterologist",
    keywords: ["stomach", "abdominal", "liver", "acidity", "indigestion", "constipation"],
  },
  {
    speciality: "Pulmonology",
    doctorSpeciality: "Pulmonologist",
    keywords: ["cough", "cold", "breathless", "breathing", "asthma", "wheeze"],
  },
  {
    speciality: "Psychiatry",
    doctorSpeciality: "Psychiatrist",
    keywords: ["anxiety", "depression", "stress", "panic", "insomnia", "mood"],
  },
];

const NO_MATCH_NOTE =
  "This is a keyword match on what you typed, not a diagnosis. A doctor decides what your symptoms mean.";

/** Specialities whose keywords appear in `text`, best match first. */
function matchSpecialities(text) {
  const haystack = String(text || "").toLowerCase();
  if (!haystack.trim()) return [];

  const scored = [];
  for (const rule of SPECIALITY_RULES) {
    const hits = rule.keywords.filter((word) => haystack.includes(word));
    if (!hits.length) continue;
    // Multi-word hits weigh more: "chest pain" beats a bare "chest".
    const score = hits.reduce((sum, word) => sum + word.split(" ").length, 0);
    scored.push({ rule, hits, score });
  }

  return scored
    .sort((a, b) => b.score - a.score || a.rule.speciality.localeCompare(b.rule.speciality))
    .map(({ rule, hits }) => ({
      speciality: rule.speciality,
      doctorSpeciality: rule.doctorSpeciality,
      matchedKeywords: hits,
    }));
}

/** 'YYYY-MM-DD' for the next `days` days, starting today. */
function upcomingDays(days = 14) {
  const out = [];
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  for (let i = 0; i < days; i += 1) {
    const date = new Date(today);
    date.setUTCDate(date.getUTCDate() + i);
    out.push(date.toISOString().slice(0, 10));
  }
  return out;
}

// POST /api/ai/triage   { symptoms: string }
async function suggestBooking(req, res, next) {
  try {
    const symptoms = String((req.body || {}).symptoms || "").trim();
    if (!symptoms) return res.status(400).json({ error: "symptoms is required." });
    if (symptoms.length > 500) {
      return res.status(400).json({ error: "symptoms must be 500 characters or fewer." });
    }

    const matches = matchSpecialities(symptoms);
    if (!matches.length) {
      return res.json({
        matches: [],
        doctors: [],
        note:
          "Nothing in your description matched a speciality keyword, so no doctor is suggested. " +
          "Please book a general physician, or call 112 if this is an emergency. " +
          NO_MATCH_NOTE,
      });
    }

    const wanted = matches.map((match) => match.doctorSpeciality.toLowerCase());
    // READ-ONLY throughout: nothing is reserved, held or booked here.
    const [doctors] = await pool.query(
      `SELECT dp.id, u.full_name AS name, dp.specialization, dp.experience, dp.consultation_fee, dp.location
       FROM doctor_profiles dp
       JOIN users u ON u.id = dp.user_id
       WHERE LOWER(dp.specialization) = ANY(?) AND u.status = 'active'
       ORDER BY dp.rating DESC, u.full_name
       LIMIT 12`,
      [wanted]
    );

    const [slots] = await pool.query(
      `SELECT doctor_id, slot_date, slot_time
       FROM doctor_slots
       WHERE slot_date = ANY(?) AND is_booked = FALSE
       ORDER BY slot_date, slot_time
       LIMIT 400`,
      [upcomingDays()]
    );

    const byDoctor = new Map();
    for (const slot of slots) {
      if (!byDoctor.has(slot.doctor_id)) byDoctor.set(slot.doctor_id, []);
      const list = byDoctor.get(slot.doctor_id);
      if (list.length < 5) {
        list.push({ date: String(slot.slot_date).slice(0, 10), time: String(slot.slot_time).slice(0, 5) });
      }
    }

    res.json({
      matches,
      doctors: doctors.map((doctor) => ({
        id: doctor.id,
        name: doctor.name,
        specialization: doctor.specialization,
        experience: doctor.experience,
        consultationFee: doctor.consultation_fee,
        location: doctor.location || null,
        nextSlots: byDoctor.get(doctor.id) || [],
      })),
      note: NO_MATCH_NOTE,
    });
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------------------------
// 6B — live clinic queue
// ---------------------------------------------------------------------------

/** The caller's doctor_profiles.id, or null. Ownership is always JWT-derived. */
async function doctorProfileIdFor(userId) {
  const [rows] = await pool.query("SELECT id FROM doctor_profiles WHERE user_id = ?", [userId]);
  return rows.length ? rows[0].id : null;
}

function shapeToken(row) {
  return {
    id: row.id,
    tokenNumber: Number(row.token_number),
    status: row.status,
    appointmentId: row.appointment_id,
    appointmentTime: row.appointment_time || null,
    doctorName: row.doctor_name || null,
    calledAt: row.called_at,
    doneAt: row.done_at,
    createdAt: row.created_at,
  };
}


/** Issues a token for an appointment, appending after the day's last number. */
async function issueToken({ doctorId, appointmentId, patientId, date, appointmentTime }) {
  const client = await pool.getConnection();
  try {
    await client.query("BEGIN");
    // The table lock stops two clerks issuing the same number concurrently.
    await client.query("LOCK TABLE queue_tokens IN SHARE ROW EXCLUSIVE MODE");

    const { rows: maxRows } = await client.query(
      "SELECT COALESCE(MAX(token_number), 0) AS max FROM queue_tokens WHERE doctor_id = $1 AND queue_date = $2",
      [doctorId, date]
    );
    const nextNumber = Number(maxRows[0].max) + 1;

    const { rows: created } = await client.query(
      `INSERT INTO queue_tokens (doctor_id, appointment_id, patient_id, queue_date, token_number, status)
       VALUES ($1,$2,$3,$4,$5,'waiting') RETURNING id`,
      [doctorId, appointmentId, patientId, date, nextNumber]
    );
    await client.query("COMMIT");

    return {
      id: created[0].id,
      token_number: nextNumber,
      status: "waiting",
      appointment_id: appointmentId,
      appointment_time: appointmentTime,
      called_at: null,
      done_at: null,
      created_at: new Date().toISOString(),
    };
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch {
      /* already rolled back */
    }
    throw err;
  } finally {
    client.release();
  }
}

// POST /api/doctors/me/queue/:appointmentId   (doctor issues a token)
async function issueMyToken(req, res, next) {
  try {
    const doctorId = await doctorProfileIdFor(req.user.id);
    if (!doctorId) return res.status(404).json({ error: "Doctor profile not found." });

    const [rows] = await pool.query(
      `SELECT a.id, a.patient_id, a.appointment_date, a.appointment_time, a.status
       FROM appointments a WHERE a.id = ? AND a.doctor_id = ?`,
      [req.params.appointmentId, doctorId]
    );
    if (!rows.length) return res.status(404).json({ error: "Appointment not found." });
    const appointment = rows[0];

    if (appointment.status === "Cancelled") {
      return res.status(400).json({ error: "A cancelled appointment cannot be given a queue token." });
    }

    const date = String(appointment.appointment_date).slice(0, 10);
    const [existing] = await pool.query(
      "SELECT * FROM queue_tokens WHERE doctor_id = ? AND appointment_id = ? AND queue_date = ?",
      [doctorId, appointment.id, date]
    );
    if (existing.length) {
      return res.json({
        message: "This appointment already has a token for that day.",
        token: shapeToken(existing[0]),
        alreadyIssued: true,
      });
    }

    const token = await issueToken({
      doctorId,
      appointmentId: appointment.id,
      patientId: appointment.patient_id,
      date,
      appointmentTime: appointment.appointment_time,
    });
    await logAudit(req.user.id, "queue.issue", `appointment ${appointment.id} -> token ${token.token_number}`);

    res.status(201).json({ message: "Queue token issued.", token: shapeToken(token) });
  } catch (err) {
    next(err);
  }
}

// GET /api/doctors/me/queue?date=YYYY-MM-DD
async function listClinicQueue(req, res, next) {
  try {
    const doctorId = await doctorProfileIdFor(req.user.id);
    if (!doctorId) return res.status(404).json({ error: "Doctor profile not found." });

    const date = /^\d{4}-\d{2}-\d{2}$/.test(String(req.query.date || ""))
      ? String(req.query.date)
      : new Date().toISOString().slice(0, 10);

    const [rows] = await pool.query(
      `SELECT qt.*, u.full_name AS patient_name, a.appointment_time
       FROM queue_tokens qt
       JOIN users u ON u.id = qt.patient_id
       LEFT JOIN appointments a ON a.id = qt.appointment_id
       WHERE qt.doctor_id = ? AND qt.queue_date = ?
       ORDER BY qt.token_number`,
      [doctorId, date]
    );

    const waiting = rows.filter((row) => row.status === "waiting");

    res.json({
      date,
      tokens: rows.map(shapeToken),
      // First name only — a waiting-room screen is public-facing.
      display: rows.map((row) => ({
        tokenNumber: Number(row.token_number),
        status: row.status,
        patient: String(row.patient_name || "").split(" ")[0] || "Patient",
        appointmentTime: row.appointment_time || null,
      })),
      nowServing: waiting.length ? waiting[0].token_number : null,
      waitingCount: waiting.length,
    });
  } catch (err) {
    next(err);
  }
}


// PUT /api/doctors/me/queue/:id   { action: call | done | skip }
async function updateQueueToken(req, res, next) {
  try {
    const doctorId = await doctorProfileIdFor(req.user.id);
    if (!doctorId) return res.status(404).json({ error: "Doctor profile not found." });

    const action = String((req.body || {}).action || "").toLowerCase();
    const updates = {
      call: { status: "called", stamp: "called_at = NOW()" },
      done: { status: "done", stamp: "done_at = NOW()" },
      skip: { status: "skipped", stamp: "done_at = NOW()" },
    }[action];
    if (!updates) return res.status(400).json({ error: "action must be call, done or skip." });

    const [result] = await pool.query(
      `UPDATE queue_tokens SET status = ?, ${updates.stamp} WHERE id = ? AND doctor_id = ?`,
      [updates.status, req.params.id, doctorId]
    );
    if (!result.affectedRows) return res.status(404).json({ error: "Queue token not found." });

    const [rows] = await pool.query("SELECT * FROM queue_tokens WHERE id = ?", [req.params.id]);
    await logAudit(req.user.id, `queue.${action}`, `token ${req.params.id}`);
    res.json({ message: `Token marked as ${updates.status}.`, token: shapeToken(rows[0]) });
  } catch (err) {
    next(err);
  }
}

// GET /api/patients/queue?date=YYYY-MM-DD   (the caller's own token)
async function getMyQueue(req, res, next) {
  try {
    const date = /^\d{4}-\d{2}-\d{2}$/.test(String(req.query.date || ""))
      ? String(req.query.date)
      : new Date().toISOString().slice(0, 10);

    const [rows] = await pool.query(
      `SELECT qt.*, a.appointment_time, u.full_name AS doctor_name
       FROM queue_tokens qt
       LEFT JOIN appointments a ON a.id = qt.appointment_id
       LEFT JOIN doctor_profiles dp ON dp.id = qt.doctor_id
       LEFT JOIN users u ON u.id = dp.user_id
       WHERE qt.patient_id = ? AND qt.queue_date = ?
       ORDER BY qt.token_number LIMIT 5`,
      [req.user.id, date]
    );
    if (!rows.length) {
      return res.json({
        date,
        token: null,
        peopleAhead: 0,
        message: "You do not have a queue token for this day yet.",
      });
    }

    // How many people are still ahead of this patient.
    const [ahead] = await pool.query(
      `SELECT COUNT(*) AS total FROM queue_tokens
       WHERE doctor_id = ? AND queue_date = ? AND status = 'waiting' AND token_number < ?`,
      [rows[0].doctor_id, date, rows[0].token_number]
    );

    res.json({
      date,
      token: shapeToken(rows[0]),
      peopleAhead: Number(ahead[0].total),
      note: "Queue positions move as the clinic runs. This is not an appointment time.",
    });
  } catch (err) {
    next(err);
  }
}


// ---------------------------------------------------------------------------
// 6C — follow-up suggestions
// ---------------------------------------------------------------------------

// POST /api/doctors/me/follow-ups   { patientId, appointmentId?, dueDate, note? }
async function createFollowUp(req, res, next) {
  try {
    const doctorId = await doctorProfileIdFor(req.user.id);
    if (!doctorId) return res.status(404).json({ error: "Doctor profile not found." });

    const body = req.body || {};
    const patientId = Number(body.patientId);
    if (!Number.isInteger(patientId) || patientId <= 0) {
      return res.status(400).json({ error: "patientId is required." });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(body.dueDate || ""))) {
      return res.status(400).json({ error: "dueDate must be a real date (YYYY-MM-DD)." });
    }
    const dueDate = String(body.dueDate);
    if (dueDate < new Date().toISOString().slice(0, 10)) {
      return res.status(400).json({ error: "dueDate cannot be in the past." });
    }

    // The patient must genuinely be this doctor's patient.
    const { guardDoctorPatientAccess } = require("../services/access");
    if (!(await guardDoctorPatientAccess(req, res, patientId))) return;

    const [result] = await pool.query(
      `INSERT INTO follow_up_suggestions (patient_id, doctor_id, appointment_id, due_date, note)
       VALUES (?,?,?,?,?)`,
      [
        patientId,
        doctorId,
        body.appointmentId ? Number(body.appointmentId) : null,
        dueDate,
        body.note ? String(body.note).slice(0, 255) : null,
      ]
    );
    await logAudit(req.user.id, "follow_up.create", `patient ${patientId} due ${dueDate}`);

    res.status(201).json({
      message: "Follow-up suggested. The patient will see it in their Health Hub.",
      followUpId: result.insertId ?? null,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/patients/follow-ups
async function getMyFollowUps(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT f.id, f.due_date, f.note, f.status, f.created_at, f.appointment_id,
              u.full_name AS doctor_name, dp.specialization
       FROM follow_up_suggestions f
       LEFT JOIN doctor_profiles dp ON dp.id = f.doctor_id
       LEFT JOIN users u ON u.id = dp.user_id
       WHERE f.patient_id = ? AND f.status <> 'dismissed'
       ORDER BY f.due_date LIMIT 20`,
      [req.user.id]
    );
    res.json({
      followUps: rows.map((row) => ({
        id: row.id,
        dueDate: String(row.due_date).slice(0, 10),
        note: row.note,
        status: row.status,
        doctorName: row.doctor_name,
        specialization: row.specialization,
        appointmentId: row.appointment_id,
        createdAt: row.created_at,
      })),
      note: "A follow-up is a reminder your doctor suggested. It is not a booked appointment.",
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/patients/follow-ups/:id/dismiss
async function dismissFollowUp(req, res, next) {
  try {
    const [result] = await pool.query(
      `UPDATE follow_up_suggestions SET status = 'dismissed'
       WHERE id = ? AND patient_id = ? AND status = 'suggested'`,
      [req.params.id, req.user.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: "Follow-up not found or already handled." });
    res.json({ message: "Follow-up dismissed." });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  // 6A
  suggestBooking,
  matchSpecialities,
  SPECIALITY_RULES,
  // 6B
  issueMyToken,
  listClinicQueue,
  updateQueueToken,
  getMyQueue,
  // 6C
  createFollowUp,
  getMyFollowUps,
  dismissFollowUp,
};

