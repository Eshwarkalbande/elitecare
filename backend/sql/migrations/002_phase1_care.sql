-- ============================================================
-- 002_phase1_care.sql
-- Phase 1 (Care) — Lab Report Explainer, Prescription -> Reminders,
--                  Pre-Consult AI Summary.
--
-- Same rules as 001: CREATE TABLE IF NOT EXISTS / ADD COLUMN IF NOT EXISTS,
-- never DROP or TRUNCATE, safe to re-run.
-- ============================================================

-- ------------------------------------------------------------
-- 1C. Pre-consult AI summary — explicit opt-in, default OFF.
--     FALSE => the doctor still gets a deterministic template summary,
--     but no patient data is ever sent to the AI provider.
-- ------------------------------------------------------------
ALTER TABLE patient_profiles
  ADD COLUMN IF NOT EXISTS ai_summary_consent BOOLEAN NOT NULL DEFAULT FALSE;

-- ------------------------------------------------------------
-- 1A. Lab Report Explainer — only SAVED summaries live here.
--     An upload that the patient does not tap "Save summary" on is
--     never written to disk or to this table.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lab_reports (
  id                    SERIAL PRIMARY KEY,
  patient_id            INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title                 VARCHAR(150) NOT NULL,
  report_date           DATE NULL,
  summary               TEXT NULL,
  items                 JSONB NOT NULL DEFAULT '[]'::jsonb,
  questions_for_doctor  JSONB NOT NULL DEFAULT '[]'::jsonb,
  urgency               VARCHAR(20) NULL,
  language              VARCHAR(5) NOT NULL DEFAULT 'en',
  ai_source             VARCHAR(20) NOT NULL DEFAULT 'simulated',
  shared_with_doctor_at TIMESTAMPTZ NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lab_reports_patient
  ON lab_reports (patient_id, created_at DESC);

-- ------------------------------------------------------------
-- 1B. Prescription -> Reminders
--     A reminder stays inactive (active = FALSE) until the PATIENT
--     confirms or edits the times. The doctor's dose text is copied
--     verbatim and never rewritten by the app.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS medicine_reminders (
  id                   SERIAL PRIMARY KEY,
  patient_id           INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prescription_item_id INT NULL REFERENCES prescription_items(id) ON DELETE SET NULL,
  medicine_name        VARCHAR(150) NOT NULL,
  dose_text            VARCHAR(100) NULL,
  times                TIME[] NOT NULL DEFAULT '{}',
  start_date           DATE NULL,
  end_date             DATE NULL,
  channels             TEXT[] NOT NULL DEFAULT '{inapp}',
  active               BOOLEAN NOT NULL DEFAULT FALSE,
  confirmed_at         TIMESTAMPTZ NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_medicine_reminders_patient
  ON medicine_reminders (patient_id, active);

CREATE TABLE IF NOT EXISTS reminder_events (
  id           SERIAL PRIMARY KEY,
  reminder_id  INT NOT NULL REFERENCES medicine_reminders(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  sent_at      TIMESTAMPTZ NULL,
  status       VARCHAR(10) NOT NULL DEFAULT 'pending',
  provider     VARCHAR(20) NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One row per reminder per scheduled minute: makes the dispatcher
-- idempotent, so a re-run can never double-send.
CREATE UNIQUE INDEX IF NOT EXISTS uq_reminder_events_reminder_scheduled
  ON reminder_events (reminder_id, scheduled_at);

CREATE INDEX IF NOT EXISTS idx_reminder_events_status
  ON reminder_events (status, scheduled_at);

-- ------------------------------------------------------------
-- 1C. Pre-consult summary cache (one summary per appointment).
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pre_consult_summaries (
  id             SERIAL PRIMARY KEY,
  appointment_id INT NOT NULL UNIQUE REFERENCES appointments(id) ON DELETE CASCADE,
  doctor_id      INT NOT NULL REFERENCES doctor_profiles(id) ON DELETE CASCADE,
  patient_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  summary        TEXT NOT NULL,
  source         VARCHAR(20) NOT NULL DEFAULT 'template',
  language       VARCHAR(5) NOT NULL DEFAULT 'en',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pre_consult_summaries_doctor
  ON pre_consult_summaries (doctor_id, created_at DESC);
