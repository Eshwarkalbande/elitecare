/**
 * Shared ownership rules for every phase 1-6 endpoint.
 *
 * Nothing here is a new security model: it wraps the rules the app already
 * enforces in `controllers/patientController.js`
 *   * `doctorCanAccessPatient` — a doctor only sees a patient they really treat;
 *   * `resolvePatientId` / `guardPatientAccess` — a patient only sees themselves.
 *
 * Phase 2 adds family members on top:
 *   * a patient may read/write their own data AND their family members' data;
 *   * anyone else's family member is a hard 403, never a silent empty result.
 */
const { pool } = require("../config/db");
const {
  doctorCanAccessPatient,
  resolvePatientId,
  guardPatientAccess,
} = require("../controllers/patientController");

/**
 * Resolves the subject of a request.
 *
 * @returns {Promise<{patientId:number, familyMemberId:number|null}|{status:number,error:string}>}
 *   `patientId` is always the OWNER (users.id). `familyMemberId` is set only
 *   when the caller asked for a family member and is allowed to use it.
 */
async function resolveScope(req) {
  const scope = await resolvePatientId(req);
  if (scope.error) return scope;

  const rawMember = req.params.familyMemberId || req.query.familyMemberId || req.body?.familyMemberId;
  if (rawMember === undefined || rawMember === null || rawMember === "" || rawMember === "0") {
    return { patientId: scope.patientId, familyMemberId: null };
  }

  const familyMemberId = Number(rawMember);
  if (!Number.isInteger(familyMemberId) || familyMemberId <= 0) {
    return { status: 400, error: "familyMemberId must be a positive integer." };
  }

  const member = await getOwnedFamilyMember(scope.patientId, familyMemberId);
  if (!member) {
    return { status: 403, error: "That family member does not belong to this account." };
  }
  return { patientId: scope.patientId, familyMemberId };
}

/**
 * Like resolveScope but for endpoints that are patient-only (no ?patientId=).
 * Sends the 400/403 itself and returns null when the caller must bail out.
 */
async function guardScope(req, res) {
  const result = await resolveScope(req);
  if (result.error) {
    res.status(result.status).json({ error: result.error });
    return null;
  }
  return result;
}

/** Returns the family member row when it belongs to `ownerUserId`, else null. */
async function getOwnedFamilyMember(ownerUserId, familyMemberId) {
  const [rows] = await pool.query(
    "SELECT id, owner_user_id, full_name, relation FROM family_members WHERE id = ? AND owner_user_id = ?",
    [familyMemberId, ownerUserId]
  );
  return rows.length ? rows[0] : null;
}

/** True when the id is one of the caller's family members. */
async function ownsFamilyMember(ownerUserId, familyMemberId) {
  return Boolean(await getOwnedFamilyMember(ownerUserId, familyMemberId));
}

/** Resolves the patient a DOCTOR is asking about, with the existing access rule. */
async function guardDoctorPatientAccess(req, res, patientId) {
  if (req.user.role === "admin") return true;
  if (req.user.role !== "doctor") {
    res.status(403).json({ error: "You do not have permission to access this resource." });
    return false;
  }
  const allowed = await doctorCanAccessPatient(req.user.id, patientId);
  if (!allowed) {
    res.status(403).json({ error: "You do not have permission to access this patient's records." });
    return false;
  }
  return true;
}

module.exports = {
  resolveScope,
  guardScope,
  getOwnedFamilyMember,
  ownsFamilyMember,
  guardDoctorPatientAccess,
  guardPatientAccess,
  doctorCanAccessPatient,
};
