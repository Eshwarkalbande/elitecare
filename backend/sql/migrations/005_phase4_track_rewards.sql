-- ============================================================
-- 005_phase4_track_rewards.sql
-- Phase 4 — Health Tracker, server-side coin ledger, referrals, challenges.
-- ============================================================

-- ------------------------------------------------------------
-- 4A. Health Tracker (BP / sugar / weight / SpO2 / heart rate)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS health_metrics (
  id               SERIAL PRIMARY KEY,
  patient_id       INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  family_member_id INT NULL REFERENCES family_members(id) ON DELETE SET NULL,
  type             VARCHAR(20) NOT NULL,        -- bp | glucose | weight | spo2 | heart_rate
  value1           NUMERIC(12,3) NOT NULL,
  value2           NUMERIC(12,3) NULL,          -- diastolic, for blood pressure
  unit             VARCHAR(20) NULL,
  recorded_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source           VARCHAR(30) NOT NULL DEFAULT 'manual',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_health_metrics_patient_type_time
  ON health_metrics (patient_id, type, recorded_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS uq_health_metrics_dedupe
  ON health_metrics (patient_id, type, recorded_at, source);

-- ------------------------------------------------------------
-- 4B. Server-side coins: an append-only ledger.
--     Balances are always SUM(amount) — a client can never set a balance.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS coin_transactions (
  id         SERIAL PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount     INT NOT NULL,                      -- + credit, - debit
  reason     VARCHAR(60) NOT NULL,              -- challenge.completed | referral.rewarded | voucher.redeemed | ...
  ref_type   VARCHAR(30) NULL,
  ref_id     INT NULL,
  note       VARCHAR(150) NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coin_transactions_user
  ON coin_transactions (user_id, created_at DESC);

-- The same award can only be granted once (self-referral, double redeem, a
-- challenge completed twice). Ledger rows without a ref_id are not constrained.
CREATE UNIQUE INDEX IF NOT EXISTS uq_coin_transactions_award
  ON coin_transactions (user_id, reason, ref_type, ref_id)
  WHERE ref_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS vouchers (
  id          SERIAL PRIMARY KEY,
  code        VARCHAR(30) NOT NULL UNIQUE,
  title       VARCHAR(120) NOT NULL,
  description VARCHAR(255) NULL,
  cost_coins  INT NOT NULL,
  kind        VARCHAR(30) NOT NULL DEFAULT 'voucher',
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS voucher_redemptions (
  id          SERIAL PRIMARY KEY,
  voucher_id  INT NOT NULL REFERENCES vouchers(id) ON DELETE CASCADE,
  user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cost_coins  INT NOT NULL,
  code        VARCHAR(30) NOT NULL,
  status      VARCHAR(20) NOT NULL DEFAULT 'issued',   -- issued | redeemed | cancelled
  redeemed_at TIMESTAMPTZ NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_voucher_redemptions_user
  ON voucher_redemptions (user_id, created_at DESC);

-- ------------------------------------------------------------
-- 4C. Referrals. The code lives on `users`; the reward is only paid after the
--     referred account's first COMPLETED appointment, and only once.
-- ------------------------------------------------------------
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code VARCHAR(16) NULL UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by_user_id INT NULL REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_rewarded_at TIMESTAMPTZ NULL;

CREATE INDEX IF NOT EXISTS idx_users_referred_by
  ON users (referred_by_user_id);


-- ------------------------------------------------------------
-- 4D. Seeded weekly challenges + opt-in participants
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS challenges (
  id          SERIAL PRIMARY KEY,
  code        VARCHAR(40) NOT NULL UNIQUE,
  title       VARCHAR(120) NOT NULL,
  description VARCHAR(255) NULL,
  metric      VARCHAR(20) NOT NULL,             -- steps | water | sleep
  target      NUMERIC(12,2) NOT NULL,
  unit        VARCHAR(20) NULL,
  starts_on   DATE NOT NULL,
  ends_on     DATE NOT NULL,
  reward_coins INT NOT NULL DEFAULT 20,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS challenge_participants (
  id           SERIAL PRIMARY KEY,
  challenge_id INT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id      INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  progress     NUMERIC(12,2) NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ NULL,
  joined_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (challenge_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_challenge_participants_challenge
  ON challenge_participants (challenge_id, progress DESC);

-- ------------------------------------------------------------
-- Seeds (idempotent: ON CONFLICT DO NOTHING — nothing is ever overwritten)
-- ------------------------------------------------------------
INSERT INTO vouchers (code, title, description, cost_coins, kind) VALUES
  ('free_consult', 'Free follow-up consult', 'One free follow-up consultation with a doctor of your choice.', 300, 'consult'),
  ('lab_discount_10', '10% off a lab test', 'Use at the ELITECARE partner lab counter.', 150, 'discount'),
  ('pharmacy_50', 'Pharmacy delivery credit', 'Rupees 50 off a future pharmacy delivery order.', 200, 'credit')
ON CONFLICT (code) DO NOTHING;

INSERT INTO challenges (code, title, description, metric, target, unit, starts_on, ends_on, reward_coins) VALUES
  ('week_steps_50k', 'Weekly 50,000 steps', 'Walk 50,000 steps this week. Any day counts.', 'steps', 50000, 'steps', date_trunc('week', CURRENT_DATE)::date, (date_trunc('week', CURRENT_DATE)::date + 6), 50),
  ('week_water_14', 'Drink water every day', 'Log 2 litres of water on at least 14 days.', 'water', 14, 'days', date_trunc('week', CURRENT_DATE)::date, (date_trunc('week', CURRENT_DATE)::date + 6), 30),
  ('week_sleep_8', 'Sleep 8 hours', 'Log 8 hours of sleep on at least 3 nights.', 'sleep', 3, 'nights', date_trunc('week', CURRENT_DATE)::date, (date_trunc('week', CURRENT_DATE)::date + 6), 30)
ON CONFLICT (code) DO NOTHING;
