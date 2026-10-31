-- ============================================================
-- 004_phase3_wearables.sql
-- Phase 3 — Wearables (steps / heart rate / sleep / SpO2 / calories).
-- ============================================================

-- One row per provider the patient has actually linked. The app never performs
-- an OAuth handshake (no provider SDK is bundled), so this table only ever holds
-- what the patient entered or imported — never a fabricated connection.
CREATE TABLE IF NOT EXISTS wearable_connections (
  id              SERIAL PRIMARY KEY,
  patient_id      INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  family_member_id INT NULL REFERENCES family_members(id) ON DELETE SET NULL,
  provider        VARCHAR(30) NOT NULL,       -- google_health_connect | fitbit | apple_health | samsung_health | bluetooth_hr | csv | manual
  status          VARCHAR(20) NOT NULL DEFAULT 'planned',  -- planned | connected | disconnected
  connected_at    TIMESTAMPTZ NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_wearable_connections_patient_provider
  ON wearable_connections (patient_id, provider);

CREATE TABLE IF NOT EXISTS wearable_samples (
  id               SERIAL PRIMARY KEY,
  patient_id       INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  family_member_id INT NULL REFERENCES family_members(id) ON DELETE SET NULL,
  type             VARCHAR(20) NOT NULL,      -- steps | heart_rate | sleep | spo2 | calories
  value            NUMERIC(12,3) NOT NULL,
  unit             VARCHAR(20) NULL,
  recorded_at      TIMESTAMPTZ NOT NULL,
  source           VARCHAR(30) NOT NULL DEFAULT 'manual',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- The daily-aggregate queries always filter by patient + type + day.
CREATE INDEX IF NOT EXISTS idx_wearable_samples_patient_type_time
  ON wearable_samples (patient_id, type, recorded_at DESC);

-- Re-importing the same CSV (or replaying the same ingest batch) must not
-- duplicate a reading.
CREATE UNIQUE INDEX IF NOT EXISTS uq_wearable_samples_dedupe
  ON wearable_samples (patient_id, type, recorded_at, source);

CREATE INDEX IF NOT EXISTS idx_wearable_samples_patient_created
  ON wearable_samples (patient_id, created_at DESC);
