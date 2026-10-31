-- ============================================================
-- 007_phase6_automation.sql
-- Phase 6 — Live clinic queue and smart follow-up suggestions.
-- (6A "symptom-to-booking" needs no table: it reads doctor_slots.)
-- ============================================================

CREATE TABLE IF NOT EXISTS queue_tokens (
  id             SERIAL PRIMARY KEY,
  doctor_id      INT NOT NULL REFERENCES doctor_profiles(id) ON DELETE CASCADE,
  appointment_id INT NULL REFERENCES appointments(id) ON DELETE SET NULL,
  patient_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  queue_date     DATE NOT NULL,
  token_number   INT NOT NULL,
  status         VARCHAR(10) NOT NULL DEFAULT 'waiting',  -- waiting | called | done | skipped
  called_at      TIMESTAMPTZ NULL,
  done_at        TIMESTAMPTZ NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_queue_tokens_doctor_date_number
  ON queue_tokens (doctor_id, queue_date, token_number);

CREATE INDEX IF NOT EXISTS idx_queue_tokens_doctor_date_status
  ON queue_tokens (doctor_id, queue_date, status);

CREATE INDEX IF NOT EXISTS idx_queue_tokens_patient_date
  ON queue_tokens (patient_id, queue_date DESC);

-- "follow-up in N days", set by the doctor when completing an appointment or
-- when writing a prescription. The patient sees a card and gets an in-app
-- notification through services/notify.js.
CREATE TABLE IF NOT EXISTS follow_up_suggestions (
  id              SERIAL PRIMARY KEY,
  patient_id      INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_id       INT NOT NULL REFERENCES doctor_profiles(id) ON DELETE CASCADE,
  appointment_id  INT NULL REFERENCES appointments(id) ON DELETE SET NULL,
  prescription_id INT NULL REFERENCES prescriptions(id) ON DELETE SET NULL,
  due_date        DATE NOT NULL,
  note            VARCHAR(255) NULL,
  status          VARCHAR(12) NOT NULL DEFAULT 'suggested',  -- suggested | notified | dismissed
  notified_at     TIMESTAMPTZ NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_follow_up_suggestions_patient
  ON follow_up_suggestions (patient_id, due_date);

CREATE INDEX IF NOT EXISTS idx_follow_up_suggestions_pending
  ON follow_up_suggestions (status, due_date);
