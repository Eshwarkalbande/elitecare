/**
 * Read-only table inventory helper.
 *
 * Usage (from backend/):
 *   node scripts/check-schema.js
 *
 * It reports which of the phase 1-6 tables exist, so a partially migrated
 * database is obvious before a feature is switched on. It never writes.
 */
require("dotenv").config();
const { pool } = require("../config/db");

const TABLES = [
  // phase 1
  "lab_reports",
  "medicine_reminders",
  "reminder_events",
  "pre_consult_summaries",
  // phase 2
  "family_members",
  // phase 3
  "wearable_samples",
  // phase 4
  "health_metrics",
  "coin_transactions",
  "vouchers",
  "voucher_redemptions",
  "challenges",
  "challenge_participants",
  // phase 5
  "emergency_contacts",
  "sos_events",
  "emergency_cards",
  "doctor_verifications",
  // phase 6
  "queue_tokens",
  "follow_up_suggestions",
];

(async () => {
  const [rows] = await pool.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
  );
  const present = new Set(rows.map((row) => row.table_name));

  let missing = 0;
  for (const name of TABLES) {
    const ok = present.has(name);
    if (!ok) missing += 1;
    console.log(`${ok ? "OK  " : "MISS"}  ${name}`);
  }

  const [applied] = await pool.query("SELECT name, applied_at FROM schema_migrations ORDER BY name");
  console.log(`\nmigrations recorded: ${applied.length}`);
  for (const row of applied) {
    console.log(`   ${row.name}  ${new Date(row.applied_at).toISOString()}`);
  }

  // A quick row count per phase table makes an empty demo obvious at a glance.
  console.log("\nrows per table:");
  for (const name of TABLES) {
    if (!present.has(name)) continue;
    const [count] = await pool.query(`SELECT COUNT(*)::int AS n FROM ${name}`);
    console.log(`   ${String(count[0].n).padStart(5)}  ${name}`);
  }

  // Safety: a public emergency card must never be left switched on by a test run.
  const [openCards] = await pool.query("SELECT COUNT(*)::int AS n FROM emergency_cards WHERE enabled = TRUE");
  if (openCards[0].n > 0) {
    console.log(`\n⚠️  ${openCards[0].n} emergency card(s) are currently ENABLED.`);
  } else {
    console.log("\n✅ no emergency card is switched on.");
  }

  console.log(missing ? `\n${missing} table(s) missing - run: npm run db:migrate` : "\nAll phase tables present.");
  await pool.end();
  process.exitCode = missing ? 1 : 0;
})().catch((err) => {
  console.error("schema check failed:", err.message);
  process.exitCode = 1;
});