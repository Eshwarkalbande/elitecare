/**
 * Audit trail helper (Phases 1-6).
 *
 * `audit_logs` is the existing table used by the Admin "Audit Logs" panel:
 *   actor_id INT NULL REFERENCES users(id)
 *   action   VARCHAR(150) NOT NULL
 *   details  VARCHAR(255) NULL
 *
 * Rules this helper enforces:
 *   * an audit row is written whenever a doctor or an admin reads patient data,
 *     and whenever a public emergency card is viewed;
 *   * `details` must never contain health data or secrets — callers pass short
 *     machine-readable facts ("lab_report 12", "pre_consult appointment 7"),
 *     and the value is truncated to the column width;
 *   * an audit failure must NEVER break the request it is auditing.
 */
const { pool } = require("../config/db");
const crypto = require("crypto");

/** One-way hash of an IP so the public emergency-card trail is useful but not identifying. */
function hashIp(ip) {
  const value = String(ip || "unknown");
  return crypto.createHash("sha256").update(`elitecare-audit|${value}`).digest("hex").slice(0, 16);
}

/**
 * Writes one audit row. Never throws.
 * @param {number|null} actorId users.id, or null for anonymous/public actions
 * @param {string} action short verb, e.g. "patient.read.prescriptions"
 * @param {string} [details] short machine-readable context (no health data)
 */
async function logAudit(actorId, action, details) {
  try {
    await pool.query("INSERT INTO audit_logs (actor_id, action, details) VALUES (?,?,?)", [
      actorId || null,
      String(action || "unknown.action").slice(0, 150),
      details == null ? null : String(details).slice(0, 255),
    ]);
    return true;
  } catch (err) {
    // Message only — never the payload.
    console.error(`audit: could not record "${action}": ${err.message}`);
    return false;
  }
}

module.exports = { logAudit, hashIp };
