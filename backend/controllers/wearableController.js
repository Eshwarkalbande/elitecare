/**
 * Phase 3 — Wearables (patient only, own data or own family members' data).
 *
 * Honesty rules enforced here:
 *   * `source` is never invented: a manual entry is "manual", a CSV import is
 *     "csv", a batch ingest is whatever the caller declared (default "ingest"),
 *     and a Web Bluetooth session is saved by the browser as "bluetooth_hr".
 *   * provider tiles (Google Health Connect / Fitbit / Apple Health / Samsung
 *     Health) are reported as "planned" and can never be marked connected,
 *     because no OAuth handshake is implemented in this build.
 *   * readings are validated against plausibility ranges and future timestamps
 *     are rejected.
 */
const { pool } = require("../config/db");
const { logAudit } = require("../services/audit");
const { guardScope } = require("../services/access");
const { dailySummary, normalizeRange, UNITS, TYPES } = require("../services/wearableStats");

const PLAUSIBLE = {
  steps: { min: 0, max: 100000 },
  heart_rate: { min: 20, max: 250 },
  sleep: { min: 0, max: 24 },
  spo2: { min: 50, max: 100 },
  calories: { min: 0, max: 20000 },
};

const PROVIDERS = [
  { id: "google_health_connect", label: "Google Health Connect", state: "planned" },
  { id: "fitbit", label: "Fitbit", state: "planned" },
  { id: "apple_health", label: "Apple Health", state: "planned" },
  { id: "samsung_health", label: "Samsung Health", state: "planned" },
  { id: "bluetooth_hr", label: "Bluetooth heart-rate device", state: "browser" },
];

const MAX_CSV_ROWS = 5000;
const MAX_INGEST = 500;

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

/** Validates one reading. Throws a 400 with a precise reason otherwise. */
function validateSample(input, { forImport = false } = {}) {
  const type = String(input.type || "").toLowerCase().trim();
  if (!TYPES.includes(type)) {
    throw httpError(400, `type must be one of ${TYPES.join(", ")}.`);
  }
  const value = Number(input.value);
  if (!Number.isFinite(value)) throw httpError(400, "value must be a number.");
  const range = PLAUSIBLE[type];
  if (value < range.min || value > range.max) {
    throw httpError(400, `${type} must be between ${range.min} and ${range.max}.`);
  }

  const raw = input.recordedAt || input.recorded_at || new Date().toISOString();
  const recordedAt = new Date(raw);
  if (Number.isNaN(recordedAt.getTime())) throw httpError(400, "recordedAt must be a valid date.");
  if (recordedAt.getTime() > Date.now() + 60 * 1000) {
    throw httpError(400, "recordedAt cannot be in the future.");
  }

  const source = String(input.source || (forImport ? "csv" : "manual")).slice(0, 30);
  return {
    type,
    value,
    unit: input.unit ? String(input.unit).slice(0, 20) : UNITS[type] || null,
    recordedAt,
    source,
  };
}

/**
 * INSERT ... ON CONFLICT DO NOTHING: re-importing never duplicates.
 * @returns {Promise<number|null>} the new row's id, or null when the reading already existed
 */
async function insertSample(patientId, memberId, sample, sourceOverride) {
  const [result] = await pool.query(
    `INSERT INTO wearable_samples (patient_id, family_member_id, type, value, unit, recorded_at, source)
     VALUES (?,?,?,?,?,?::timestamptz,?)
     ON CONFLICT (patient_id, type, recorded_at, source) DO NOTHING`,
    [
      patientId,
      memberId,
      sample.type,
      sample.value,
      sample.unit,
      sample.recordedAt.toISOString(),
      sourceOverride || sample.source,
    ]
  );
  return result.insertId == null ? null : result.insertId;
}

// GET /api/wearables/connections
async function listConnections(req, res, next) {
  try {
    const [rows] = await pool.query("SELECT provider, status, connected_at FROM wearable_connections WHERE patient_id = ?", [
      req.user.id,
    ]);
    const byProvider = new Map(rows.map((row) => [row.provider, row]));
    res.json({
      connections: PROVIDERS.map((provider) => {
        const row = byProvider.get(provider.id);
        return {
          ...provider,
          // Only a genuinely recorded connection is ever reported as connected.
          status: row ? row.status : provider.state === "planned" ? "planned" : "not_connected",
          connectedAt: row ? row.connected_at : null,
          implemented: provider.state !== "planned",
        };
      }),
    });
  } catch (err) {
    next(err);
  }
}


// POST /api/wearables/samples   (manual entry)
async function addSample(req, res, next) {
  try {
    const scope = await guardScope(req, res);
    if (!scope) return;

    const sample = validateSample(req.body || {}, { forImport: false });
    const sampleId = await insertSample(scope.patientId, scope.familyMemberId, sample, "manual");
    if (sampleId == null) return res.status(409).json({ error: "That reading is already recorded." });

    await logAudit(req.user.id, "wearables.manual", `type=${sample.type}`);
    res.status(201).json({
      message: "Reading saved.",
      sample: { id: sampleId, ...sample, recordedAt: sample.recordedAt.toISOString() },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/wearables/import   { csv: "date,type,value\n…" }
async function importCsv(req, res, next) {
  try {
    const scope = await guardScope(req, res);
    if (!scope) return;

    const csv = String((req.body && req.body.csv) || "");
    if (!csv.trim()) return res.status(400).json({ error: "csv is required." });

    const lines = csv.split(/\r?\n/).filter((line) => line.trim());
    if (lines.length > MAX_CSV_ROWS + 1) {
      return res.status(413).json({ error: `A CSV import can hold at most ${MAX_CSV_ROWS} rows.` });
    }

    const errors = [];
    let imported = 0;
    let skipped = 0;

    for (let index = 0; index < lines.length; index += 1) {
      const rowNumber = index + 1;
      const cells = lines[index].split(",").map((cell) => cell.trim());
      if (index === 0 && /date/i.test(cells[0] || "") && /type/i.test(cells[1] || "")) continue; // header
      if (cells.length < 3) {
        errors.push({ row: rowNumber, error: "expected date,type,value" });
        continue;
      }
      try {
        const recordedAt = cells[3] ? `${cells[0]}T${cells[3]}Z` : cells[0];
        const sample = validateSample({ type: cells[1], value: cells[2], recordedAt, unit: cells[4] }, { forImport: true });
        const sampleId = await insertSample(scope.patientId, scope.familyMemberId, sample, "csv");
        if (sampleId != null) imported += 1;
        else skipped += 1;
      } catch (err) {
        errors.push({ row: rowNumber, error: err.message });
      }
    }

    await logAudit(req.user.id, "wearables.import", `imported=${imported} skipped=${skipped} errors=${errors.length}`);
    res.json({
      imported,
      skipped,
      errors: errors.slice(0, 100),
      errorCount: errors.length,
      message: `${imported} row(s) imported, ${skipped} already present, ${errors.length} rejected.`,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/wearables/ingest   { samples: [{type,value,recordedAt,source}] }
// Companion-app endpoint. It is JWT protected like everything else; there is no
// anonymous ingest in this build.
async function ingestBatch(req, res, next) {
  try {
    const scope = await guardScope(req, res);
    if (!scope) return;

    const samples = Array.isArray(req.body && req.body.samples) ? req.body.samples : null;
    if (!samples) return res.status(400).json({ error: "samples must be an array." });
    if (samples.length > MAX_INGEST) {
      return res.status(413).json({ error: `A batch can hold at most ${MAX_INGEST} samples.` });
    }

    const errors = [];
    let imported = 0;
    let skipped = 0;

    for (let index = 0; index < samples.length; index += 1) {
      try {
        const sample = validateSample({ ...samples[index], source: samples[index].source || "ingest" });
        const sampleId = await insertSample(scope.patientId, scope.familyMemberId, sample);
        if (sampleId != null) imported += 1;
        else skipped += 1;
      } catch (err) {
        errors.push({ row: index + 1, error: err.message });
      }
    }

    await logAudit(req.user.id, "wearables.ingest", `imported=${imported} skipped=${skipped}`);
    res.json({ imported, skipped, errorCount: errors.length, errors: errors.slice(0, 50) });
  } catch (err) {
    next(err);
  }
}

// GET /api/wearables/summary?range=7d|30d
async function getSummary(req, res, next) {
  try {
    const scope = await guardScope(req, res);
    if (!scope) return;
    const data = await dailySummary(scope.patientId, normalizeRange(req.query.range), scope.familyMemberId);
    if (req.user.role !== "patient") {
      await logAudit(req.user.id, "wearables.read", `patient ${scope.patientId} range=${data.range}`);
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// GET /api/wearables/samples?type=&range=&limit=
async function listSamples(req, res, next) {
  try {
    const scope = await guardScope(req, res);
    if (!scope) return;

    const params = [scope.patientId];
    let sql =
      "SELECT id, type, value, unit, recorded_at, source, family_member_id FROM wearable_samples WHERE patient_id = ?";
    if (scope.familyMemberId) {
      sql += " AND family_member_id = ?";
      params.push(scope.familyMemberId);
    }
    if (req.query.type && TYPES.includes(String(req.query.type))) {
      sql += " AND type = ?";
      params.push(String(req.query.type));
    }
    sql += " AND recorded_at >= (NOW() - (? || ' days')::interval)";
    params.push({ "7d": 7, "30d": 30, "90d": 90 }[normalizeRange(req.query.range)]);
    sql += " ORDER BY recorded_at DESC LIMIT ?";
    params.push(Math.min(Math.max(Number(req.query.limit) || 200, 1), 1000));

    const [rows] = await pool.query(sql, params);
    res.json({ samples: rows });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/wearables/samples/:id
async function deleteSample(req, res, next) {
  try {
    const [result] = await pool.query("DELETE FROM wearable_samples WHERE id = ? AND patient_id = ?", [
      req.params.id,
      req.user.id,
    ]);
    if (!result.affectedRows) return res.status(404).json({ error: "Reading not found." });
    res.json({ message: "Reading deleted." });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/wearables/all   { confirm: true }
async function deleteAll(req, res, next) {
  try {
    if (!(req.body && req.body.confirm === true)) {
      return res.status(400).json({ error: "Send confirm: true to delete every wearable reading." });
    }
    const familyMemberId = req.body.familyMemberId ? Number(req.body.familyMemberId) : null;

    const params = [req.user.id];
    let sql = "DELETE FROM wearable_samples WHERE patient_id = ?";
    if (familyMemberId) {
      const { ownsFamilyMember } = require("../services/access");
      if (!(await ownsFamilyMember(req.user.id, familyMemberId))) {
        return res.status(403).json({ error: "That family member does not belong to this account." });
      }
      sql += " AND family_member_id = ?";
      params.push(familyMemberId);
    }

    const [result] = await pool.query(sql, params);
    await logAudit(req.user.id, "wearables.delete_all", `removed=${result.affectedRows || 0}`);
    res.json({ message: "Wearable data deleted.", removed: result.affectedRows || 0 });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listConnections,
  addSample,
  importCsv,
  ingestBatch,
  getSummary,
  listSamples,
  deleteSample,
  deleteAll,
  PROVIDERS,
  PLAUSIBLE,
};
