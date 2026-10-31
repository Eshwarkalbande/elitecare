/**
 * Wearable aggregation helpers (Phase 3).
 *
 * Used by /api/wearables/summary, by the Phase 4 tracker charts and by the
 * Phase 1C pre-consult summary — one implementation, three callers.
 */
const { pool } = require("../config/db");

const RANGE_DAYS = { "7d": 7, "30d": 30, "90d": 90 };
const TYPES = ["steps", "heart_rate", "sleep", "spo2", "calories"];
const UNITS = { steps: "steps", heart_rate: "bpm", sleep: "h", spo2: "%", calories: "kcal" };

function normalizeRange(range) {
  const key = String(range || "7d").toLowerCase();
  return RANGE_DAYS[key] ? key : "7d";
}

function daysFor(range) {
  return RANGE_DAYS[normalizeRange(range)];
}

/**
 * Daily aggregates for one patient.
 * @returns {Promise<{range:string, days:number, series:object[], totals:object}>}
 */
async function dailySummary(patientId, range = "7d", familyMemberId = null) {
  const normalized = normalizeRange(range);
  const days = daysFor(normalized);

  const params = [patientId, days];
  let memberClause = "";
  if (familyMemberId) {
    memberClause = " AND family_member_id = ?";
    params.push(familyMemberId);
  }

  const [rows] = await pool.query(
    `SELECT type,
            date_trunc('day', recorded_at)::date AS day,
            SUM(value)  AS total,
            AVG(value)  AS average,
            MIN(value)  AS minimum,
            MAX(value)  AS maximum,
            COUNT(*)    AS samples
     FROM wearable_samples
     WHERE patient_id = ?
       AND recorded_at >= (NOW() - (? || ' days')::interval)${memberClause}
     GROUP BY type, day
     ORDER BY day, type`,
    params
  );

  // Day buckets (so a chart always has a slot per day, even with no reading).
  const dayKeys = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - i);
    dayKeys.push(date.toISOString().slice(0, 10));
  }

  const series = dayKeys.map((day) => ({ day, values: {} }));
  const index = new Map(series.map((entry) => [entry.day, entry]));

  for (const row of rows) {
    const key = row.day instanceof Date ? row.day.toISOString().slice(0, 10) : String(row.day).slice(0, 10);
    const entry = index.get(key);
    if (!entry) continue;
    entry.values[row.type] = {
      total: Number(row.total),
      average: Number(Number(row.average).toFixed(2)),
      minimum: Number(row.minimum),
      maximum: Number(row.maximum),
      samples: Number(row.samples),
    };
  }

  // "Today" cards + the 7/30-day average per type.
  const today = dayKeys[dayKeys.length - 1];
  const totals = {};
  for (const type of TYPES) {
    const withData = series.filter((entry) => entry.values[type]);
    totals[type] = {
      unit: UNITS[type],
      today: series.find((entry) => entry.day === today)?.values[type]?.total ?? 0,
      average:
        withData.length
          ? Number((withData.reduce((sum, entry) => sum + entry.values[type].total, 0) / withData.length).toFixed(2))
          : null,
      days: withData.length,
    };
  }

  return { range: normalized, days, series, totals };
}

/** {type, average, unit, samples} per type — used by the pre-consult summary. */
async function wearableAverages(patientId, options = {}) {
  const days = Number(options.days) || 14;
  const params = [patientId, days];
  let memberClause = "";
  if (options.familyMemberId) {
    memberClause = " AND family_member_id = ?";
    params.push(options.familyMemberId);
  }

  const [rows] = await pool.query(
    `SELECT type, AVG(value) AS average, COUNT(*) AS samples
     FROM wearable_samples
     WHERE patient_id = ?
       AND recorded_at >= (NOW() - (? || ' days')::interval)${memberClause}
     GROUP BY type
     ORDER BY type`,
    params
  );

  return rows.map((row) => ({
    type: row.type,
    average: Number(Number(row.average).toFixed(1)),
    unit: UNITS[row.type] || null,
    samples: Number(row.samples),
  }));
}

module.exports = { dailySummary, wearableAverages, normalizeRange, daysFor, TYPES, UNITS, RANGE_DAYS };
