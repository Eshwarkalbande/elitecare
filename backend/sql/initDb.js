/**
 * One-shot DB bootstrap script (PostgreSQL version).
 * 1) Runs schema_postgres.sql (creates all tables if they don't exist)
 * 2) Seeds demo accounts + sample doctors/hospitals so the app is usable immediately
 *
 * Usage:  npm run db:init      (from the backend/ folder)
 */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

async function run() {
  const pool = new Pool({
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "elitecare_db",
  });

  console.log("▶ Connected to PostgreSQL. Running schema_postgres.sql ...");
  const schemaSql = fs.readFileSync(path.join(__dirname, "schema_postgres.sql"), "utf8");
  await pool.query(schemaSql);
  console.log("✅ Schema created / verified.");

  // ---------------------------------------------------------------
  // Phases 1-6 live in sql/migrations/*.sql, NOT in this file.
  // Applying the very same migration files here is what guarantees that a
  // fresh `db:init` install and a database upgraded with `db:migrate` end up
  // with exactly the same tables — there is only ever one copy of the DDL.
  // ---------------------------------------------------------------
  const MIGRATIONS_DIR = path.join(__dirname, "migrations");
  const migrationFiles = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((name) => /^\d+_[A-Za-z0-9_-]+\.sql$/.test(name))
    .sort((a, b) => a.localeCompare(b, "en"));

  for (const name of migrationFiles) {
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, name), "utf8");
    const checksum = require("crypto").createHash("sha256").update(sql, "utf8").digest("hex");

    const already = await pool.query("SELECT checksum FROM schema_migrations WHERE name = $1", [name]);
    if (already.rows.length) {
      if (already.rows[0].checksum !== checksum) {
        // Same refusal as sql/migrate.js: never silently re-run edited DDL.
        console.warn(`⚠️  ${name} was already applied but its contents changed — skipping.`);
        console.warn("   Revert the edit and add a new NNN_*.sql migration instead.");
      }
      continue;
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (name, checksum) VALUES ($1,$2)", [name, checksum]);
      await client.query("COMMIT");
      console.log(`✅ applied ${name}`);
    } catch (err) {
      await client.query("ROLLBACK");
      throw new Error(`Migration ${name} failed and was rolled back: ${err.message}`);
    } finally {
      client.release();
    }
  }

  // ---------- Seed demo users ----------
  // NOTE: The passwords below (patient123 / doctor123 / admin123) are for LOCAL
  // DEVELOPMENT ONLY. They are publicly known demo credentials and must never be
  // used in a deployed environment — remove or rotate these accounts before any
  // real deployment.
  const demoUsers = [
    { name: "John Doe", email: "john.doe@example.com", password: "patient123", role: "patient", phone: "+1 555 010 1111" },
    { name: "Dr. Sarah Johnson", email: "doctor@elitecare.com", password: "doctor123", role: "doctor", phone: "+1 555 010 2222" },
    { name: "System Administrator", email: "admin@elitecare.com", password: "admin123", role: "admin", phone: "+1 555 010 3333" },
  ];

  const userIds = {};
  for (const u of demoUsers) {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [u.email]);
    if (existing.rows.length) {
      userIds[u.email] = existing.rows[0].id;
      continue;
    }
    const hash = await bcrypt.hash(u.password, 10);
    const result = await pool.query(
      "INSERT INTO users (full_name, email, password_hash, phone, role) VALUES ($1,$2,$3,$4,$5) RETURNING id",
      [u.name, u.email, hash, u.phone, u.role]
    );
    userIds[u.email] = result.rows[0].id;
  }
  console.log("✅ Demo users ready:", Object.keys(userIds));

  // Patient profile
  await pool.query(
    `INSERT INTO patient_profiles (user_id, blood_group, address, emergency_contact_name, emergency_contact_phone)
     VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (user_id) DO UPDATE SET blood_group = EXCLUDED.blood_group`,
    [userIds["john.doe@example.com"], "O+", "221B Baker Street, Springfield", "Jane Doe", "+1 555 010 9999"]
  );

  // Doctor profile
  const existingDoctor = await pool.query(
    "SELECT id FROM doctor_profiles WHERE user_id = $1",
    [userIds["doctor@elitecare.com"]]
  );
  let doctorProfileId;
  if (existingDoctor.rows.length) {
    doctorProfileId = existingDoctor.rows[0].id;
  } else {
    const docRes = await pool.query(
      `INSERT INTO doctor_profiles (user_id, specialization, experience, rating, location, bio, consultation_fee, is_available)
       VALUES ($1,$2,$3,$4,$5,$6,$7,true) RETURNING id`,
      [userIds["doctor@elitecare.com"], "Cardiologist", "12 years", 4.8, "EliteCare Main Campus",
       "Senior cardiologist specializing in preventive heart care.", 120.0]
    );
    doctorProfileId = docRes.rows[0].id;
  }

  // A few extra sample doctors (for Find-a-Doctor / Admin lists), all under one shared password for demo
  const extraDoctors = [
    { name: "Dr. Alan Fischer", email: "alan.fischer@elitecare.com", spec: "Neurologist", fee: 115 },
    { name: "Dr. Meera Nair", email: "meera.nair@elitecare.com", spec: "Dermatologist", fee: 95 },
    { name: "Dr. Wei Chen", email: "wei.chen@elitecare.com", spec: "Pediatrician", fee: 85 },
  ];
  for (const d of extraDoctors) {
    const ex = await pool.query("SELECT id FROM users WHERE email = $1", [d.email]);
    let uid;
    if (ex.rows.length) {
      uid = ex.rows[0].id;
    } else {
      const hash = await bcrypt.hash("doctor123", 10);
      const r = await pool.query(
        "INSERT INTO users (full_name, email, password_hash, role) VALUES ($1,$2,$3,'doctor') RETURNING id",
        [d.name, d.email, hash]
      );
      uid = r.rows[0].id;
    }
    const exProfile = await pool.query("SELECT id FROM doctor_profiles WHERE user_id = $1", [uid]);
    if (!exProfile.rows.length) {
      await pool.query(
        `INSERT INTO doctor_profiles (user_id, specialization, experience, rating, location, bio, consultation_fee, is_available)
         VALUES ($1,$2,$3,$4,$5,$6,$7,true)`,
        [uid, d.spec, "8 years", 4.6, "EliteCare Main Campus", `Experienced ${d.spec}.`, d.fee]
      );
    }
  }
  console.log("✅ Doctor profiles ready.");

  // Sample hospital
  const hospCheck = await pool.query("SELECT id FROM hospitals LIMIT 1");
  if (!hospCheck.rows.length) {
    await pool.query(
      `INSERT INTO hospitals (name, type, address, phone, rating, beds_available, is_emergency, latitude, longitude)
       VALUES ('EliteCare General Hospital','Multi-Specialty','100 Wellness Ave, Springfield','+1 555 900 4000',4.7,42,true,40.7128,-74.0060)`
    );
  }

  // Sample appointment (patient <-> doctor)
  const apptCheck = await pool.query("SELECT id FROM appointments LIMIT 1");
  let appointmentId;
  if (!apptCheck.rows.length) {
    const apptRes = await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, fee, status)
       VALUES ($1,$2,CURRENT_DATE,'10:30 AM','Routine heart checkup',120.00,'Completed') RETURNING id`,
      [userIds["john.doe@example.com"], doctorProfileId]
    );
    appointmentId = apptRes.rows[0].id;
  }

  // Sample medical record (Medical History feature)
  const recCheck = await pool.query("SELECT id FROM medical_records LIMIT 1");
  if (!recCheck.rows.length) {
    await pool.query(
      `INSERT INTO medical_records (patient_id, doctor_id, appointment_id, record_date, record_type, diagnosis, notes)
       VALUES ($1,$2,$3,CURRENT_DATE,'Consultation','Mild Hypertension','Advised to reduce salt intake and monitor BP weekly.')`,
      [userIds["john.doe@example.com"], doctorProfileId, appointmentId || null]
    );
  }

  // Sample prescription + items (Prescription History feature)
  const presCheck = await pool.query("SELECT id FROM prescriptions LIMIT 1");
  if (!presCheck.rows.length) {
    const presRes = await pool.query(
      `INSERT INTO prescriptions (patient_id, doctor_id, appointment_id, prescription_date, diagnosis, notes, status)
       VALUES ($1,$2,$3,CURRENT_DATE,'Mild Hypertension','Follow up in 2 weeks','Active') RETURNING id`,
      [userIds["john.doe@example.com"], doctorProfileId, appointmentId || null]
    );
    await pool.query(
      `INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, instructions)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [presRes.rows[0].id, "Amlodipine", "5mg", "Once daily", "30 days", "Take in the morning, with or without food"]
    );
    await pool.query(
      `INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, instructions)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [presRes.rows[0].id, "Aspirin", "75mg", "Once daily", "30 days", "Take after food"]
    );
  }

  console.log("🎉 Database seed complete. Demo logins:");
  console.log("   Patient -> john.doe@example.com / patient123");
  console.log("   Doctor  -> doctor@elitecare.com / doctor123");
  console.log("   Admin   -> admin@elitecare.com / admin123");

  await pool.end();
}

run().catch((err) => {
  console.error("❌ DB init failed:", err);
  process.exit(1);
});
