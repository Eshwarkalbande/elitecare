-- ============================================================
-- 003_phase2_family_language.sql
-- Phase 2A — Family profiles + the nullable family_member_id link.
--
-- `family_member_id` is NULL everywhere by default, which means every existing
-- read/write keeps behaving EXACTLY as before (a NULL link = "the account
-- holder themself"). No row is rewritten by this migration.
-- ============================================================

CREATE TABLE IF NOT EXISTS family_members (
  id            SERIAL PRIMARY KEY,
  owner_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name     VARCHAR(150) NOT NULL,
  relation      VARCHAR(50)  NULL,
  date_of_birth DATE NULL,
  gender        VARCHAR(10)  NULL,
  blood_group   VARCHAR(5)   NULL,
  allergies     TEXT NULL,
  conditions    TEXT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_family_members_owner
  ON family_members (owner_user_id);

-- Nullable links. ADD COLUMN IF NOT EXISTS keeps this re-runnable, and the
-- DEFAULT NULL means the existing rows are untouched.
ALTER TABLE appointments        ADD COLUMN IF NOT EXISTS family_member_id INT NULL REFERENCES family_members(id) ON DELETE SET NULL;
ALTER TABLE medical_records     ADD COLUMN IF NOT EXISTS family_member_id INT NULL REFERENCES family_members(id) ON DELETE SET NULL;
ALTER TABLE prescriptions       ADD COLUMN IF NOT EXISTS family_member_id INT NULL REFERENCES family_members(id) ON DELETE SET NULL;
ALTER TABLE medicine_reminders  ADD COLUMN IF NOT EXISTS family_member_id INT NULL REFERENCES family_members(id) ON DELETE SET NULL;
ALTER TABLE lab_reports         ADD COLUMN IF NOT EXISTS family_member_id INT NULL REFERENCES family_members(id) ON DELETE SET NULL;
