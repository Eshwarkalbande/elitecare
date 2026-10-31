const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "elitecare_db",
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
  max: 10,
});

/**
 * Compatibility shim so the existing controllers (written against
 * mysql2's `pool.query(sql, params)` -> `[rows]` / `[result]` API)
 * keep working unchanged against Postgres via `pg`.
 *
 *  - Converts MySQL-style "?" placeholders to Postgres "$1, $2, ..."
 *  - For INSERT statements without a RETURNING clause, appends
 *    "RETURNING id" so we can fabricate `result.insertId`.
 *  - Returns a tuple [rowsOrResult, fields] just like mysql2 does,
 *    so both `const [rows] = await pool.query(...)` (SELECT) and
 *    `const [result] = await pool.query(...)` (INSERT/UPDATE) work.
 */
function toPgQuery(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

async function query(sql, params = []) {
  let pgSql = toPgQuery(sql);
  const trimmed = pgSql.trim().toUpperCase();
  const isInsert = trimmed.startsWith("INSERT");
  if (isInsert && !trimmed.includes("RETURNING")) {
    pgSql = pgSql.replace(/;\s*$/, "") + " RETURNING id";
  }

  const result = await pool.query(pgSql, params);

  if (isInsert) {
    const insertId = result.rows[0] ? result.rows[0].id : undefined;
    return [{ insertId, affectedRows: result.rowCount, ...result.rows[0] }, undefined];
  }

  if (trimmed.startsWith("UPDATE") || trimmed.startsWith("DELETE")) {
    return [{ affectedRows: result.rowCount }, undefined];
  }

  // SELECT (and everything else): behave like mysql2 -> [rows, fields]
  return [result.rows, result.fields];
}

// Quick sanity check on boot
async function testConnection() {
  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    console.log(`✅ PostgreSQL connected -> ${process.env.DB_NAME}@${process.env.DB_HOST}:${process.env.DB_PORT}`);
  } catch (err) {
    console.error("❌ PostgreSQL connection failed:", err.message);
    console.error("   Check backend/.env DB_* values and that PostgreSQL is running.");
  }
}

module.exports = { pool: { query, getConnection: () => pool.connect(), end: () => pool.end() }, testConnection };
