/**
 * Phase 4 - Track (4A) and Rewards (4B/4C/4D), patient side, plus the small
 * admin surface for the voucher catalog (4E).
 *
 * Coins are SERVER-SIDE ONLY. A balance is always SUM(coin_transactions.amount);
 * there is no endpoint that lets a client set a balance, and every award goes
 * through `award()` below. The client-side XP/Wellness Coins in App.jsx are a
 * separate, untouched system (see docs/PHASE4_REPORT.md for the comparison and
 * the proposed - not performed - merge).
 */
const { pool } = require("../config/db");
const { logAudit } = require("../services/audit");
const { guardScope } = require("../services/access");

const METRIC_TYPES = ["bp", "glucose", "weight", "spo2", "heart_rate"];
const METRIC_UNITS = { bp: "mmHg", glucose: "mg/dL", weight: "kg", spo2: "%", heart_rate: "bpm" };

/** Plausibility ranges - a stored reading must at least be physically possible. */
const METRIC_LIMITS = {
  bp: { v1: [50, 300], v2: [20, 200] },
  glucose: { v1: [20, 900] },
  weight: { v1: [2, 400] },
  spo2: { v1: [50, 100] },
  heart_rate: { v1: [20, 250] },
};

/** Conservative "general adult" reference band used for the friendly nudge. */
const GENERAL_RANGE = {
  bp: { v1: [90, 130], v2: [60, 85], label: "about 90-130 / 60-85 mmHg" },
  glucose: { v1: [70, 140], label: "about 70-140 mg/dL" },
  weight: { v1: [20, 250], label: "a wide healthy band - trends matter more than one reading" },
  spo2: { v1: [95, 100], label: "95-100%" },
  heart_rate: { v1: [55, 100], label: "about 55-100 bpm at rest" },
};

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

/** Validates a tracker reading. */
function validateMetric(input) {
  const type = String(input.type || "").toLowerCase().trim();
  if (!METRIC_TYPES.includes(type)) throw httpError(400, `type must be one of ${METRIC_TYPES.join(", ")}.`);
  const value1 = Number(input.value1);
  const limits = METRIC_LIMITS[type];
  if (!Number.isFinite(value1) || value1 < limits.v1[0] || value1 > limits.v1[1]) {
    throw httpError(400, `value1 for ${type} must be between ${limits.v1[0]} and ${limits.v1[1]}.`);
  }
  let value2 = null;
  if (type === "bp") {
    value2 = Number(input.value2);
    if (!Number.isFinite(value2) || value2 < limits.v2[0] || value2 > limits.v2[1]) {
      throw httpError(400, `value2 (diastolic) must be between ${limits.v2[0]} and ${limits.v2[1]}.`);
    }
  }
  const recordedAt = input.recordedAt ? new Date(input.recordedAt) : new Date();
  if (Number.isNaN(recordedAt.getTime())) throw httpError(400, "recordedAt must be a valid date.");
  if (recordedAt.getTime() > Date.now() + 60000) throw httpError(400, "recordedAt cannot be in the future.");

  return { type, value1, value2, recordedAt, unit: METRIC_UNITS[type] };
}

// ---------------------------------------------------------------- ledger
async function getCoinBalance(userId) {
  const [[row]] = await pool.query("SELECT COALESCE(SUM(amount),0) AS balance FROM coin_transactions WHERE user_id = ?", [
    userId,
  ]);
  return Number(row.balance);
}

/**
 * Adds one ledger entry. Returns true when it was newly created - the partial
 * unique index (user_id, reason, ref_type, ref_id) silently refuses duplicates,
 * which is what makes "reward only once" enforceable in the database.
 */
async function award(userId, amount, reason, { refType = null, refId = null, note = null } = {}) {
  const [result] = await pool.query(
    `INSERT INTO coin_transactions (user_id, amount, reason, ref_type, ref_id, note)
     VALUES (?,?,?,?,?,?)
     ON CONFLICT DO NOTHING`,
    [userId, Math.trunc(amount), String(reason).slice(0, 60), refType, refId, note ? String(note).slice(0, 150) : null]
  );
  return result.insertId != null;
}

async function listLedger(userId, limit = 30) {
  const [rows] = await pool.query(
    "SELECT id, amount, reason, note, created_at FROM coin_transactions WHERE user_id = ? ORDER BY id DESC LIMIT ?",
    [userId, Math.min(Math.max(Number(limit) || 30, 1), 100)]
  );
  return rows;
}

// ---------------------------------------------------------------- 4A metrics
// GET /api/patients/metrics?type=&range=30d&days=
async function listMetrics(req, res, next) {
  try {
    const scope = await guardScope(req, res);
    if (!scope) return;

    const params = [scope.patientId];
    let sql = "SELECT id, type, value1, value2, unit, recorded_at, source, family_member_id FROM health_metrics WHERE patient_id = ?";
    if (scope.familyMemberId) {
      sql += " AND family_member_id = ?";
      params.push(scope.familyMemberId);
    }
    if (req.query.type && METRIC_TYPES.includes(String(req.query.type))) {
      sql += " AND type = ?";
      params.push(String(req.query.type));
    }
    const days = Math.min(Math.max(Number(req.query.days) || 90, 1), 730);
    sql += " AND recorded_at >= (NOW() - (? || ' days')::interval) ORDER BY recorded_at DESC LIMIT 500";
    params.push(days);

    const [rows] = await pool.query(sql, params);
    if (req.user.role !== "patient") {
      await logAudit(req.user.id, "metrics.read", `patient ${scope.patientId} (${rows.length} row(s))`);
    }
    res.json({ metrics: rows });
  } catch (err) {
    next(err);
  }
}

// POST /api/patients/metrics
async function addMetric(req, res, next) {
  try {
    const scope = await guardScope(req, res);
    if (!scope) return;

    const metric = validateMetric(req.body || {});
    const [result] = await pool.query(
      `INSERT INTO health_metrics (patient_id, family_member_id, type, value1, value2, unit, recorded_at, source)
       VALUES (?,?,?,?,?,?,?::timestamptz,'manual')
       ON CONFLICT (patient_id, type, recorded_at, source) DO NOTHING`,
      [
        scope.patientId,
        scope.familyMemberId,
        metric.type,
        metric.value1,
        metric.value2,
        metric.unit,
        metric.recordedAt.toISOString(),
      ]
    );
    if (result.insertId == null) return res.status(409).json({ error: "That reading is already recorded." });

    res.status(201).json({ message: "Reading saved.", metricId: result.insertId });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/patients/metrics/:id
async function deleteMetric(req, res, next) {
  try {
    const [result] = await pool.query("DELETE FROM health_metrics WHERE id = ? AND patient_id = ?", [
      req.params.id,
      req.user.id,
    ]);
    if (!result.affectedRows) return res.status(404).json({ error: "Reading not found." });
    res.json({ message: "Reading deleted." });
  } catch (err) {
    next(err);
  }
}

/**
 * Rule-based trend alerts. Deliberately worded "consider a checkup" - this is a
 * nudge, never a diagnosis, and it never names a condition or a medicine.
 */
function buildAlerts(type, readings) {
  const alerts = [];
  const range = GENERAL_RANGE[type];
  const newestFirst = [...readings].sort((a, b) => new Date(b.recorded_at) - new Date(a.recorded_at));

  const last = newestFirst[0];
  if (last && range) {
    const outsideV1 = last.value1 < range.v1[0] || last.value1 > range.v1[1];
    const outsideV2 = range.v2 && last.value2 != null && (last.value2 < range.v2[0] || last.value2 > range.v2[1]);
    if (outsideV1 || outsideV2) {
      alerts.push({
        level: "watch",
        message:
          `Your most recent reading is outside the general adult range (${range.label}). ` +
          `Consider a checkup - your doctor decides what it means.`,
      });
    }
  }

  // Five consecutive rising systolic values.
  const rising = newestFirst.slice(0, 5);
  if (rising.length === 5) {
    let streaks = true;
    for (let i = 0; i < rising.length - 1; i += 1) {
      if (!(Number(rising[i].value1) > Number(rising[i + 1].value1))) {
        streaks = false;
        break;
      }
    }
    if (streaks) {
      alerts.push({
        level: "trend",
        message: "Your last 5 readings are each higher than the one before. Consider a checkup.",
      });
    }
  }

  return alerts;
}

// GET /api/patients/metrics/trends?type=bp&days=30
async function getMetricTrends(req, res, next) {
  try {
    const scope = await guardScope(req, res);
    if (!scope) return;

    const type = METRIC_TYPES.includes(String(req.query.type)) ? String(req.query.type) : "bp";
    const days = Math.min(Math.max(Number(req.query.days) || 30, 1), 365);

    const params = [scope.patientId, type, days];
    let memberClause = "";
    if (scope.familyMemberId) {
      memberClause = " AND family_member_id = ?";
      params.push(scope.familyMemberId);
    }

    const [rows] = await pool.query(
      `SELECT id, value1, value2, unit, recorded_at FROM health_metrics
       WHERE patient_id = ? AND type = ?
         AND recorded_at >= (NOW() - (? || ' days')::interval)${memberClause}
       ORDER BY recorded_at`,
      params
    );

    const daily = new Map();
    for (const row of rows) {
      const key = new Date(row.recorded_at).toISOString().slice(0, 10);
      daily.set(key, row); // last reading of the day wins
    }

    res.json({
      type,
      days,
      points: Array.from(daily, ([day, row]) => ({
        label: day.slice(5),
        value: Number(row.value1),
        value2: row.value2 == null ? null : Number(row.value2),
        unit: row.unit,
      })),
      alerts: buildAlerts(type, rows),
      generalRange: GENERAL_RANGE[type] || null,
    });
  } catch (err) {
    next(err);
  }
}


// ---------------------------------------------------------------- 4B rewards
// GET /api/patients/rewards
async function getRewards(req, res, next) {
  try {
    const balance = await getCoinBalance(req.user.id);
    const [vouchers] = await pool.query(
      "SELECT id, code, title, description, cost_coins, kind FROM vouchers WHERE active = TRUE ORDER BY cost_coins"
    );
    const [mine] = await pool.query(
      `SELECT r.id, r.code, r.cost_coins, r.status, r.redeemed_at, r.created_at, v.title
       FROM voucher_redemptions r JOIN vouchers v ON v.id = r.voucher_id
       WHERE r.user_id = ? ORDER BY r.id DESC LIMIT 50`,
      [req.user.id]
    );

    res.json({
      balance,
      ledger: await listLedger(req.user.id, 20),
      catalog: vouchers,
      redemptions: mine,
      // Stated plainly so the two coin systems are never confused.
      note: "This balance is the server-side rewards ledger. The Wellness Coins shown in the header are the separate, client-side gamification wallet and are not affected by this page.",
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/patients/rewards/redeem   { voucherId }
async function redeemVoucher(req, res, next) {
  const voucherId = Number(req.body && req.body.voucherId);
  if (!Number.isInteger(voucherId) || voucherId <= 0) {
    return res.status(400).json({ error: "voucherId is required." });
  }

  // A real transaction: the debit and the redemption must both land, or neither.
  const client = await pool.getConnection();
  try {
    await client.query("BEGIN");

    const { rows: vouchers } = await client.query(
      "SELECT id, code, title, cost_coins FROM vouchers WHERE id = $1 AND active = TRUE FOR UPDATE",
      [voucherId]
    );
    if (!vouchers.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "That reward is not available." });
    }
    const voucher = vouchers[0];

    const { rows: balanceRows } = await client.query(
      "SELECT COALESCE(SUM(amount),0) AS balance FROM coin_transactions WHERE user_id = $1",
      [req.user.id]
    );
    const balance = Number(balanceRows[0].balance);
    if (balance < voucher.cost_coins) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        error: `You need ${voucher.cost_coins} coins for this reward and you have ${balance}.`,
      });
    }

    const { rows: created } = await client.query(
      `INSERT INTO voucher_redemptions (voucher_id, user_id, cost_coins, code)
       VALUES ($1,$2,$3,$4) RETURNING id, code`,
      [voucher.id, req.user.id, voucher.cost_coins, `${voucher.code}-${Date.now().toString(36).toUpperCase()}`]
    );

    await client.query(
      `INSERT INTO coin_transactions (user_id, amount, reason, ref_type, ref_id, note)
       VALUES ($1,$2,'voucher.redeemed','voucher',$3,$4)`,
      [req.user.id, -voucher.cost_coins, voucher.id, voucher.title.slice(0, 150)]
    );

    await client.query("COMMIT");
    await logAudit(req.user.id, "rewards.redeem", `voucher ${voucher.id}`);

    res.status(201).json({
      message: `Redeemed: ${voucher.title}.`,
      redemptionId: created[0].id,
      code: created[0].code,
      balance: balance - voucher.cost_coins,
    });
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch {
      /* already rolled back */
    }
    next(err);
  } finally {
    client.release();
  }
}

// ---------------------------------------------------------------- 4C referrals
const REFERRAL_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function makeReferralCode() {
  let code = "";
  for (let i = 0; i < 8; i += 1) {
    code += REFERRAL_ALPHABET[Math.floor(Math.random() * REFERRAL_ALPHABET.length)];
  }
  return code;
}

/** Gets (or lazily creates) the caller's own referral code. */
async function ensureReferralCode(userId) {
  const [rows] = await pool.query("SELECT referral_code FROM users WHERE id = ?", [userId]);
  if (rows.length && rows[0].referral_code) return rows[0].referral_code;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = makeReferralCode();
    try {
      const [result] = await pool.query(
        "UPDATE users SET referral_code = ? WHERE id = ? AND referral_code IS NULL",
        [candidate, userId]
      );
      if (result.affectedRows) return candidate;
      const [again] = await pool.query("SELECT referral_code FROM users WHERE id = ?", [userId]);
      if (again.length && again[0].referral_code) return again[0].referral_code;
    } catch {
      /* extremely unlikely collision - try another code */
    }
  }
  throw httpError(500, "Could not create a referral code. Please try again.");
}

/** Paid only when the referred account completes its first appointment. */
const REFERRAL_REWARD = Number(process.env.REFERRAL_REWARD_COINS || 100);

async function rewardReferralIfDue(patientUserId) {
  const [rows] = await pool.query(
    "SELECT id, referred_by_user_id, referral_rewarded_at FROM users WHERE id = ?",
    [patientUserId]
  );
  if (!rows.length) return false;
  const user = rows[0];
  if (!user.referred_by_user_id || user.referral_rewarded_at) return false;

  const [[{ completed }]] = await pool.query(
    "SELECT COUNT(*) AS completed FROM appointments WHERE patient_id = ? AND status = 'Completed'",
    [patientUserId]
  );
  if (Number(completed) < 1) return false;

  // Mark first so two parallel requests cannot both pay out.
  const [mark] = await pool.query(
    "UPDATE users SET referral_rewarded_at = NOW() WHERE id = ? AND referral_rewarded_at IS NULL",
    [patientUserId]
  );
  if (!mark.affectedRows) return false;

  await award(user.referred_by_user_id, REFERRAL_REWARD, "referral.rewarded", {
    refType: "user",
    refId: patientUserId,
    note: "First completed appointment",
  });
  return true;
}

// GET /api/patients/referrals
async function getReferral(req, res, next) {
  try {
    const code = await ensureReferralCode(req.user.id);
    const [mine] = await pool.query(
      `SELECT u.id, u.full_name, u.referral_rewarded_at, u.created_at
       FROM users u WHERE u.referred_by_user_id = ? ORDER BY u.id DESC LIMIT 50`,
      [req.user.id]
    );
    const [me] = await pool.query("SELECT referred_by_user_id, referral_rewarded_at FROM users WHERE id = ?", [
      req.user.id,
    ]);

    res.json({
      code,
      rewardCoins: REFERRAL_REWARD,
      invited: mine.map((row) => ({
        id: row.id,
        // First name + initial only: a referrer never sees more than that.
        name: String(row.full_name || "").split(" ")[0],
        rewarded: Boolean(row.referral_rewarded_at),
        joinedAt: row.created_at,
      })),
      referredBy: me.length ? me[0].referred_by_user_id : null,
      myRewardPaid: Boolean(me.length && me[0].referral_rewarded_at),
      rules:
        "You earn the referral coins only after the person you invited completes their first appointment. Self-referral is blocked and each person can be rewarded once.",
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/patients/referrals/claim   { code }
async function claimReferral(req, res, next) {
  try {
    const code = String((req.body && req.body.code) || "").trim().toUpperCase();
    if (!code) return res.status(400).json({ error: "code is required." });

    const [mine] = await pool.query("SELECT referral_code, referred_by_user_id FROM users WHERE id = ?", [req.user.id]);
    if (!mine.length) return res.status(404).json({ error: "Account not found." });
    if (mine[0].referred_by_user_id) {
      return res.status(409).json({ error: "You have already used a referral code." });
    }
    if (mine[0].referral_code && mine[0].referral_code === code) {
      return res.status(400).json({ error: "You cannot use your own referral code." });
    }

    const [owner] = await pool.query("SELECT id FROM users WHERE referral_code = ?", [code]);
    if (!owner.length) return res.status(404).json({ error: "That referral code was not found." });
    if (owner[0].id === req.user.id) {
      return res.status(400).json({ error: "You cannot use your own referral code." });
    }

    await pool.query(
      "UPDATE users SET referred_by_user_id = ? WHERE id = ? AND referred_by_user_id IS NULL",
      [owner[0].id, req.user.id]
    );
    res.json({
      message: "Referral code saved. The coins are added after your first completed appointment.",
    });
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------------- 4D challenges
/** "Priya Sharma" -> "Priya S." - the only identity the leaderboard ever shows. */
function shortName(fullName) {
  const parts = String(fullName || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "Member";
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.`;
}

// GET /api/patients/challenges
async function listChallenges(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT c.id, c.code, c.title, c.description, c.metric, c.target, c.unit, c.starts_on, c.ends_on, c.reward_coins,
              p.progress, p.completed_at, p.joined_at,
              (SELECT COUNT(*) FROM challenge_participants x WHERE x.challenge_id = c.id) AS participants
       FROM challenges c
       LEFT JOIN challenge_participants p ON p.challenge_id = c.id AND p.user_id = ?
       WHERE c.active = TRUE
       ORDER BY c.ends_on, c.id`,
      [req.user.id]
    );

    res.json({
      challenges: rows.map((row) => ({
        ...row,
        joined: row.joined_at != null,
        progress: row.progress == null ? 0 : Number(row.progress),
        target: Number(row.target),
        rewardCoins: row.reward_coins,
        participants: Number(row.participants),
      })),
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/patients/challenges/:id/join
async function joinChallenge(req, res, next) {
  try {
    const [challenge] = await pool.query("SELECT id FROM challenges WHERE id = ? AND active = TRUE", [req.params.id]);
    if (!challenge.length) return res.status(404).json({ error: "Challenge not found." });

    const [result] = await pool.query(
      `INSERT INTO challenge_participants (challenge_id, user_id) VALUES (?,?)
       ON CONFLICT (challenge_id, user_id) DO NOTHING`,
      [req.params.id, req.user.id]
    );
    if (result.insertId == null) return res.status(409).json({ error: "You have already joined this challenge." });
    res.status(201).json({ message: "Joined." });
  } catch (err) {
    next(err);
  }
}

// POST /api/patients/challenges/:id/progress   { progress }
async function updateChallengeProgress(req, res, next) {
  try {
    const progress = Math.max(Number(req.body && req.body.progress) || 0, 0);

    const [rows] = await pool.query(
      `SELECT c.id, c.target, c.reward_coins, c.title
       FROM challenges c JOIN challenge_participants p ON p.challenge_id = c.id AND p.user_id = ?
       WHERE c.id = ?`,
      [req.user.id, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Join the challenge before logging progress." });
    const challenge = rows[0];
    const completed = progress >= Number(challenge.target);

    // GREATEST() means a stale client can never rewind progress.
    await pool.query(
      `UPDATE challenge_participants
         SET progress = GREATEST(progress, ?),
             completed_at = CASE WHEN ? AND completed_at IS NULL THEN NOW() ELSE completed_at END
       WHERE challenge_id = ? AND user_id = ?`,
      [progress, completed, req.params.id, req.user.id]
    );

    let awarded = false;
    if (completed) {
      // The partial unique index on the ledger pays this exactly once.
      awarded = await award(req.user.id, challenge.reward_coins, "challenge.completed", {
        refType: "challenge",
        refId: challenge.id,
        note: challenge.title,
      });
    }

    res.json({ message: "Progress saved.", completed, coinsAwarded: awarded ? challenge.reward_coins : 0 });
  } catch (err) {
    next(err);
  }
}

// GET /api/patients/challenges/:id/leaderboard  (first name + initial only)
async function getChallengeLeaderboard(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT u.full_name, p.progress, p.completed_at
       FROM challenge_participants p JOIN users u ON u.id = p.user_id
       WHERE p.challenge_id = ?
       ORDER BY p.progress DESC, p.joined_at
       LIMIT 20`,
      [req.params.id]
    );
    res.json({
      leaderboard: rows.map((row, index) => ({
        rank: index + 1,
        name: shortName(row.full_name),
        progress: Number(row.progress),
        completed: row.completed_at != null,
      })),
      note: "Only a first name and an initial are shown, and only for people who joined this challenge.",
    });
  } catch (err) {
    next(err);
  }
}

// ------------------------------------------------- admin (4E: catalog + redemptions)
async function adminListVouchers(req, res, next) {
  try {
    const [vouchers] = await pool.query("SELECT * FROM vouchers ORDER BY cost_coins");
    const [redemptions] = await pool.query(
      `SELECT r.id, r.code, r.cost_coins, r.status, r.redeemed_at, r.created_at, v.title, u.full_name AS member_name
       FROM voucher_redemptions r JOIN vouchers v ON v.id = r.voucher_id JOIN users u ON u.id = r.user_id
       ORDER BY r.id DESC LIMIT 200`
    );
    await logAudit(req.user.id, "admin.rewards.read", `${vouchers.length} reward(s), ${redemptions.length} redemption(s)`);
    res.json({ vouchers, redemptions });
  } catch (err) {
    next(err);
  }
}

async function adminUpsertVoucher(req, res, next) {
  try {
    const { id, code, title, description, costCoins, kind, active } = req.body || {};
    if (!title || !String(title).trim()) return res.status(400).json({ error: "title is required." });
    const cost = Number(costCoins);
    if (!Number.isFinite(cost) || cost < 0) return res.status(400).json({ error: "costCoins must be 0 or more." });

    if (id) {
      const [result] = await pool.query(
        `UPDATE vouchers
            SET title = ?, description = ?, cost_coins = ?, kind = COALESCE(?, kind), active = COALESCE(?, active)
          WHERE id = ?`,
        [
          String(title).slice(0, 120),
          description ? String(description).slice(0, 255) : null,
          Math.trunc(cost),
          kind ? String(kind).slice(0, 30) : null,
          typeof active === "boolean" ? active : null,
          id,
        ]
      );
      if (!result.affectedRows) return res.status(404).json({ error: "Reward not found." });
      await logAudit(req.user.id, "admin.voucher.update", `voucher ${id}`);
      return res.json({ message: "Reward updated." });
    }

    const finalCode =
      String(code || "").trim().toLowerCase().replace(/[^a-z0-9_]+/g, "_").slice(0, 30) || `voucher_${Date.now()}`;
    const [created] = await pool.query(
      "INSERT INTO vouchers (code, title, description, cost_coins, kind, active) VALUES (?,?,?,?,?,COALESCE(?,TRUE))",
      [
        finalCode,
        String(title).slice(0, 120),
        description ? String(description).slice(0, 255) : null,
        Math.trunc(cost),
        kind ? String(kind).slice(0, 30) : "voucher",
        typeof active === "boolean" ? active : null,
      ]
    );
    await logAudit(req.user.id, "admin.voucher.create", `voucher ${created.insertId}`);
    res.status(201).json({ message: "Reward added.", voucherId: created.insertId ?? null });
  } catch (err) {
    next(err);
  }
}

async function adminMarkRedemption(req, res, next) {
  try {
    const status = String((req.body && req.body.status) || "").toLowerCase();
    if (!["issued", "redeemed", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "status must be issued, redeemed or cancelled." });
    }
    const [result] = await pool.query(
      `UPDATE voucher_redemptions
          SET status = ?,
              redeemed_at = CASE WHEN ? = 'redeemed' THEN NOW() ELSE redeemed_at END
        WHERE id = ?`,
      [status, status, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: "Redemption not found." });
    await logAudit(req.user.id, "admin.redemption.update", `redemption ${req.params.id} -> ${status}`);
    res.json({ message: "Redemption updated." });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/referrals
async function adminReferrals(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.full_name, u.email, u.referral_code, u.referral_rewarded_at, u.created_at,
              ru.full_name AS referrer_name,
              (SELECT COALESCE(SUM(amount),0) FROM coin_transactions c WHERE c.user_id = u.id) AS balance
       FROM users u LEFT JOIN users ru ON ru.id = u.referred_by_user_id
       WHERE u.referred_by_user_id IS NOT NULL OR u.referral_code IS NOT NULL
       ORDER BY u.id DESC LIMIT 200`
    );
    res.json({
      referrals: rows.map((row) => ({
        id: row.id,
        name: shortName(row.full_name),
        email: row.email,
        referralCode: row.referral_code,
        referrerName: row.referrer_name,
        rewarded: row.referral_rewarded_at != null,
        balance: Number(row.balance),
        joinedAt: row.created_at,
      })),
      rewardCoins: REFERRAL_REWARD,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  // 4A
  listMetrics,
  addMetric,
  deleteMetric,
  getMetricTrends,
  // 4B
  getRewards,
  redeemVoucher,
  getCoinBalance,
  award,
  listLedger,
  // 4C
  getReferral,
  claimReferral,
  rewardReferralIfDue,
  ensureReferralCode,
  REFERRAL_REWARD,
  // 4D
  listChallenges,
  joinChallenge,
  updateChallengeProgress,
  getChallengeLeaderboard,
  // 4E (admin)
  adminListVouchers,
  adminUpsertVoucher,
  adminMarkRedemption,
  adminReferrals,
  // shared
  METRIC_TYPES,
  METRIC_UNITS,
  GENERAL_RANGE,
  buildAlerts,
  shortName,
};
