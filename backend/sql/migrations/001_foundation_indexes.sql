-- ============================================================
-- 001_foundation_indexes.sql
-- Phase 0 (Health Hub) — additive foundation only.
--
-- Rules for every migration in this folder:
--   * CREATE TABLE IF NOT EXISTS / ADD COLUMN IF NOT EXISTS / CREATE INDEX IF NOT EXISTS
--   * never DROP, TRUNCATE or re-seed existing data
--   * safe to re-run on a database that already has the change
-- ============================================================

-- Migration bookkeeping. backend/sql/migrate.js also creates this table
-- before it runs anything, so a brand-new database gets it either way.
CREATE TABLE IF NOT EXISTS schema_migrations (
  name       VARCHAR(255) PRIMARY KEY,
  checksum   VARCHAR(64)  NOT NULL,
  applied_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Notification panel: "my notifications, newest first".
CREATE INDEX IF NOT EXISTS idx_notifications_user_created_at
  ON notifications (user_id, created_at DESC);

-- Audit explorer (Admin) and the doctor/admin "read patient data" audit trail.
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
  ON audit_logs (created_at DESC);

-- Appointment lookups used by the patient dashboard, the doctor dashboard,
-- the clinic queue and the pre-consult summary.
CREATE INDEX IF NOT EXISTS idx_appointments_patient_date
  ON appointments (patient_id, appointment_date DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date
  ON appointments (doctor_id, appointment_date DESC);

-- Medical history / prescriptions are always fetched per patient.
CREATE INDEX IF NOT EXISTS idx_medical_records_patient
  ON medical_records (patient_id, record_date DESC);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient
  ON prescriptions (patient_id, prescription_date DESC);
CREATE INDEX IF NOT EXISTS idx_prescription_items_prescription
  ON prescription_items (prescription_id);
