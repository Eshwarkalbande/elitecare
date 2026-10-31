/**
 * Idempotent migration runner for the EliteCare PostgreSQL database.
 *
 *   npm run db:migrate            apply every pending migration
 *   npm run db:migrate -- --dry-run   only list what would be applied
 *   npm run db:migrate -- --status    show applied migrations and checksums
 *
 * How it works
 *   1) ensures the `schema_migrations` tracking table exists
 *   2) reads backend/sql/migrations/*.sql in filename order
 *   3) runs each not-yet-applied file inside its own transaction and records
 *      its name + SHA-256 checksum in `schema_migrations`
 *   4) re-running is a no-op, and an already-applied file whose contents were
 *      edited afterwards is reported as a conflict instead of being re-run
 *
 * It never drops, truncates or re-seeds anything: every migration file is
 * expected to be additive (CREATE ... IF NOT EXISTS / ADD COLUMN IF NOT EXISTS).
 */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { Pool } = require("pg");

const MIGRATIONS_DIR = path.join(__dirname, "migrations");
const FILE_PATTERN = /^\d+_[A-Za-z0-9_\-]+\.sql$/;

function checksumOf(sql) {
  return crypto.createHash("sha256").update(sql, "utf8").digest("hex");
}

function readMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) return [];

  const names = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((name) => FILE_PATTERN.test(name))
    .sort((a, b) => a.localeCompare(b, "en"));

  return names.map((name) => {
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, name), "utf8");
    return { name, sql, checksum: checksumOf(sql) };
  });
}

async function ensureTrackingTable(client) {
  await client.query(
    `CREATE TABLE IF NOT EXISTS schema_migrations (
       name       VARCHAR(255) PRIMARY KEY,
       checksum   VARCHAR(64)  NOT NULL,
       applied_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
     )`
  );
}

async function loadApplied(client) {
  const { rows } = await client.query("SELECT name, checksum, applied_at FROM schema_migrations");
  const map = new Map();
  for (const row of rows) map.set(row.name, row);
  return map;
}

async function run() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const statusOnly = args.includes("--status");

  const pool = new Pool({
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "elitecare_db",
  });

  const client = await pool.connect();
  try {
    await ensureTrackingTable(client);
    const applied = await loadApplied(client);
    const files = readMigrationFiles();

    if (statusOnly) {
      console.log(`📋 schema_migrations — ${applied.size} applied, ${files.length} file(s) on disk`);
      for (const file of files) {
        const row = applied.get(file.name);
        const state = row ? `applied ${new Date(row.applied_at).toISOString()}` : "PENDING";
        const drift = row && row.checksum !== file.checksum ? "  ⚠️  contents changed since it was applied" : "";
        console.log(`   ${file.name}  ->  ${state}${drift}`);
      }
      return;
    }

    // Editing an applied migration is refused: add a new file instead.
    const drifted = files.filter((f) => {
      const row = applied.get(f.name);
      return row && row.checksum !== f.checksum;
    });
    if (drifted.length) {
      console.error("❌ These migrations were already applied but their contents changed:");
      for (const f of drifted) console.error(`   ${f.name}`);
      console.error("   Revert the edit and add a new NNN_*.sql migration instead.");
      process.exitCode = 1;
      return;
    }

    const pending = files.filter((f) => !applied.has(f.name));
    if (!pending.length) {
      console.log(`✅ Database is up to date — no pending migrations (${applied.size} applied).`);
      return;
    }

    console.log(`▶ ${pending.length} pending migration(s): ${pending.map((f) => f.name).join(", ")}`);
    if (dryRun) {
      console.log("ℹ️  --dry-run: nothing was applied.");
      return;
    }

    for (const file of pending) {
      const startedAt = Date.now();
      try {
        await client.query("BEGIN");
        await client.query(file.sql);
        await client.query("INSERT INTO schema_migrations (name, checksum) VALUES ($1,$2)", [
          file.name,
          file.checksum,
        ]);
        await client.query("COMMIT");
        console.log(`✅ applied ${file.name} (${Date.now() - startedAt}ms)`);
      } catch (err) {
        await client.query("ROLLBACK");
        throw new Error(`Migration ${file.name} failed and was rolled back: ${err.message}`);
      }
    }

    console.log(`🎉 Migrations complete — ${applied.size + pending.length} version(s) recorded in schema_migrations.`);
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((err) => {
  console.error("❌ db:migrate failed:", err.message);
  process.exit(1);
});
