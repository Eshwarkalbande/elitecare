-- ============================================================
-- EliteCare Health Portal — PostgreSQL Schema
-- Converted from MySQL (backend/sql/schema.sql)
-- Run this in pgAdmin 4's Query Tool against your target database.
-- ============================================================

-- ------------------------------------------------------------
-- ENUM TYPES (MySQL ENUM columns become native Postgres enums)
-- ------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('patient','doctor','admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE user_status AS ENUM ('active','inactive','suspended');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE gender_type AS ENUM ('Male','Female','Other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE appointment_status AS ENUM ('Scheduled','Completed','Cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE prescription_status AS ENUM ('Active','Completed','Expired');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ------------------------------------------------------------
-- 1. USERS  (core auth table for all roles)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  full_name     VARCHAR(150)  NOT NULL,
  email         VARCHAR(150)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  phone         VARCHAR(30)   NULL,
  role          user_role NOT NULL DEFAULT 'patient',
  status        user_status NOT NULL DEFAULT 'active',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MySQL's "ON UPDATE CURRENT_TIMESTAMP" needs a trigger in Postgres
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ------------------------------------------------------------
-- 2. PATIENT PROFILES (1:1 with users where role='patient')
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS patient_profiles (
  id                      SERIAL PRIMARY KEY,
  user_id                 INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  date_of_birth           DATE NULL,
  gender                  gender_type NULL,
  blood_group             VARCHAR(5) NULL,
  address                 VARCHAR(255) NULL,
  has_diabetes            BOOLEAN DEFAULT FALSE,
  has_hypertension        BOOLEAN DEFAULT FALSE,
  has_asthma              BOOLEAN DEFAULT FALSE,
  has_thyroid             BOOLEAN DEFAULT FALSE,
  has_heart_issue         BOOLEAN DEFAULT FALSE,
  other_conditions        TEXT NULL,
  emergency_contact_name  VARCHAR(150) NULL,
  emergency_contact_phone VARCHAR(30)  NULL
);

-- ------------------------------------------------------------
-- 3. DOCTOR PROFILES (1:1 with users where role='doctor')
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS doctor_profiles (
  id              SERIAL PRIMARY KEY,
  user_id         INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  specialization  VARCHAR(100) NOT NULL DEFAULT 'General Practitioner',
  experience      VARCHAR(50)  NULL,
  rating          DECIMAL(2,1) DEFAULT 4.5,
  location        VARCHAR(150) NULL,
  bio             TEXT NULL,
  consultation_fee DECIMAL(10,2) DEFAULT 90.00,
  image_url       VARCHAR(255) NULL,
  is_available    BOOLEAN DEFAULT TRUE
);

-- ------------------------------------------------------------
-- 4. DOCTOR AVAILABILITY SLOTS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS doctor_slots (
  id          SERIAL PRIMARY KEY,
  doctor_id   INT NOT NULL REFERENCES doctor_profiles(id) ON DELETE CASCADE,
  slot_date   DATE NOT NULL,
  slot_time   VARCHAR(20) NOT NULL,
  is_booked   BOOLEAN DEFAULT FALSE,
  CONSTRAINT uq_doctor_slot UNIQUE (doctor_id, slot_date, slot_time)
);

-- ------------------------------------------------------------
-- 5. HOSPITALS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hospitals (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(150) NOT NULL,
  type            VARCHAR(100) NULL,
  address         VARCHAR(255) NULL,
  phone           VARCHAR(30)  NULL,
  rating          DECIMAL(2,1) DEFAULT 4.0,
  beds_available  INT DEFAULT 0,
  is_emergency    BOOLEAN DEFAULT FALSE,
  latitude        DECIMAL(10,6) NULL,
  longitude       DECIMAL(10,6) NULL
);

-- ------------------------------------------------------------
-- 6. APPOINTMENTS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS appointments (
  id              SERIAL PRIMARY KEY,
  patient_id      INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_id       INT NOT NULL REFERENCES doctor_profiles(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time VARCHAR(20) NOT NULL,
  reason          VARCHAR(255) NULL,
  fee             DECIMAL(10,2) DEFAULT 0,
  status          appointment_status NOT NULL DEFAULT 'Scheduled',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 7. MEDICAL HISTORY / RECORDS  (Patient Medical History feature)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS medical_records (
  id              SERIAL PRIMARY KEY,
  patient_id      INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_id       INT NULL REFERENCES doctor_profiles(id) ON DELETE SET NULL,
  appointment_id  INT NULL REFERENCES appointments(id) ON DELETE SET NULL,
  record_date     DATE NOT NULL,
  record_type     VARCHAR(100) NOT NULL,   -- e.g. Consultation, Lab Report, Surgery, Diagnosis
  diagnosis       VARCHAR(255) NULL,
  notes           TEXT NULL,
  attachment_name VARCHAR(255) NULL,
  attachment_url  VARCHAR(255) NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 8. PRESCRIPTIONS  (Patient Prescription History feature)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS prescriptions (
  id              SERIAL PRIMARY KEY,
  patient_id      INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_id       INT NOT NULL REFERENCES doctor_profiles(id) ON DELETE CASCADE,
  appointment_id  INT NULL REFERENCES appointments(id) ON DELETE SET NULL,
  prescription_date DATE NOT NULL,
  diagnosis       VARCHAR(255) NULL,
  notes           TEXT NULL,
  status          prescription_status NOT NULL DEFAULT 'Active',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Individual medicines within a prescription (one prescription -> many medicines)
CREATE TABLE IF NOT EXISTS prescription_items (
  id              SERIAL PRIMARY KEY,
  prescription_id INT NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  medicine_name   VARCHAR(150) NOT NULL,
  dosage          VARCHAR(100) NULL,        -- e.g. "500mg"
  frequency       VARCHAR(100) NULL,        -- e.g. "Twice a day, after food"
  duration        VARCHAR(100) NULL,        -- e.g. "7 days"
  instructions    VARCHAR(255) NULL
);

-- ------------------------------------------------------------
-- 9. NOTIFICATIONS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
  id          SERIAL PRIMARY KEY,
  user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(150) NOT NULL,
  message     VARCHAR(255) NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 11. AUDIT LOG (Admin Dashboard)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
  id          SERIAL PRIMARY KEY,
  actor_id    INT NULL REFERENCES users(id) ON DELETE SET NULL,
  action      VARCHAR(150) NOT NULL,
  details     VARCHAR(255) NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 12. MIGRATION TRACKING
-- Kept here so a fresh `npm run db:init` install and a database that
-- was upgraded with `npm run db:migrate` end up identical.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS schema_migrations (
  name       VARCHAR(255) PRIMARY KEY,
  checksum   VARCHAR(64)  NOT NULL,
  applied_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 13. SUPPORTING INDEXES (mirrors sql/migrations/001_foundation_indexes.sql)
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_notifications_user_created_at
  ON notifications (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
  ON audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_date
  ON appointments (patient_id, appointment_date DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date
  ON appointments (doctor_id, appointment_date DESC);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient
  ON medical_records (patient_id, record_date DESC);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient
  ON prescriptions (patient_id, prescription_date DESC);
CREATE INDEX IF NOT EXISTS idx_prescription_items_prescription
  ON prescription_items (prescription_id);
