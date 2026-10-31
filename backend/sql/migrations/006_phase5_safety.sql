-- ============================================================
-- 006_phase5_safety.sql
-- Phase 5 — Emergency SOS, opt-in Emergency Health Card, doctor verification.
-- ============================================================

-- ------------------------------------------------------------
-- 5A. Emergency contacts. The CALL/share is done by the phone itself
--     (tel:112, sms:, wa.me) — the app never dials or sends anything, and it
--     only records an SOS row when the patient explicitly consents.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id         SERIAL PRIMARY KEY,
  patient_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name  VARCHAR(150) NOT NULL,
  phone      VARCHAR(30)  NOT NULL,
  relation   VARCHAR(50)  NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_emergency_contacts_patient
  ON emergency_contacts (patient_id, id);

CREATE TABLE IF NOT EXISTS sos_events (
  id              SERIAL PRIMARY KEY,
  patient_id      INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  latitude        NUMERIC(9,6) NULL,
  longitude       NUMERIC(9,6) NULL,
  note            VARCHAR(255) NULL,
  consent_logging BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 5B. Emergency Health Card — opt-in and OFF by default.
--     `token` is 32+ random characters; `show_fields` decides what the public
--     endpoint may ever return.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS emergency_cards (
  id          SERIAL PRIMARY KEY,
  patient_id  INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  token       VARCHAR(64) NOT NULL UNIQUE,
  enabled     BOOLEAN NOT NULL DEFAULT FALSE,
  show_fields JSONB NOT NULL DEFAULT
    '{"name": true, "blood_group": true, "allergies": false, "conditions": false, "medicines": false, "emergency_contact": true}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at  TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS idx_emergency_cards_token
  ON emergency_cards (token);

-- ------------------------------------------------------------
-- 5C. Doctor verification
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS doctor_verifications (
  id                  SERIAL PRIMARY KEY,
  doctor_id           INT NOT NULL UNIQUE REFERENCES doctor_profiles(id) ON DELETE CASCADE,
  registration_number VARCHAR(60) NOT NULL,
  council             VARCHAR(120) NULL,
  year                INT NULL,
  status              VARCHAR(10) NOT NULL DEFAULT 'pending',   -- pending | approved | rejected
  notes               VARCHAR(255) NULL,
  reviewed_by         INT NULL REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at         TIMESTAMPTZ NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doctor_verifications_status
  ON doctor_verifications (status, created_at DESC);

-- The seeded demo doctors are marked verified so the demo flow matches the
-- documented behaviour. Rows that already exist are never modified.
INSERT INTO doctor_verifications (doctor_id, registration_number, council, year, status, reviewed_at)
SELECT dp.id,
       'DEMO-' || dp.id,
       'Demo State Medical Council',
       2015,
       'approved',
       NOW()
FROM doctor_profiles dp
ON CONFLICT (doctor_id) DO NOTHING;
