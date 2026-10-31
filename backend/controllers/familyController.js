/**
 * Phase 2A — Family profiles (patient only).
 *
 * Every handler here is scoped to `req.user.id`, so one account can never see
 * or touch another account's family members.
 */
const { pool } = require("../config/db");
const { logAudit } = require("../services/audit");

const MAX_PER_ACCOUNT = 12;

// GET /api/patients/family
async function listFamily(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT id, full_name, relation, date_of_birth, gender, blood_group, allergies, conditions, created_at
       FROM family_members WHERE owner_user_id = ? ORDER BY id`,
      [req.user.id]
    );
    res.json({ familyMembers: rows });
  } catch (err) {
    next(err);
  }
}

// POST /api/patients/family
async function createFamily(req, res, next) {
  try {
    const { fullName, relation, dateOfBirth, gender, bloodGroup, allergies, conditions } = req.body || {};
    const name = String(fullName || "").trim();
    if (!name) return res.status(400).json({ error: "fullName is required." });

    const [[{ total }]] = await pool.query("SELECT COUNT(*) AS total FROM family_members WHERE owner_user_id = ?", [
      req.user.id,
    ]);
    if (Number(total) >= MAX_PER_ACCOUNT) {
      return res.status(400).json({ error: `You can keep up to ${MAX_PER_ACCOUNT} family members.` });
    }

    const [result] = await pool.query(
      `INSERT INTO family_members (owner_user_id, full_name, relation, date_of_birth, gender, blood_group, allergies, conditions)
       VALUES (?,?,?,?,?,?,?,?)`,
      [
        req.user.id,
        name.slice(0, 150),
        relation ? String(relation).slice(0, 50) : null,
        dateOfBirth || null,
        ["Male", "Female", "Other"].includes(gender) ? gender : null,
        bloodGroup ? String(bloodGroup).slice(0, 5) : null,
        allergies ? String(allergies).slice(0, 500) : null,
        conditions ? String(conditions).slice(0, 500) : null,
      ]
    );

    await logAudit(req.user.id, "family.create", `family member ${result.insertId}`);
    res.status(201).json({ message: "Family member added.", familyMemberId: result.insertId ?? null });
  } catch (err) {
    next(err);
  }
}

// PUT /api/patients/family/:id
async function updateFamily(req, res, next) {
  try {
    const { fullName, relation, dateOfBirth, gender, bloodGroup, allergies, conditions } = req.body || {};
    const [result] = await pool.query(
      `UPDATE family_members SET
         full_name = COALESCE(?, full_name),
         relation = COALESCE(?, relation),
         date_of_birth = COALESCE(?, date_of_birth),
         gender = COALESCE(?, gender),
         blood_group = COALESCE(?, blood_group),
         allergies = COALESCE(?, allergies),
         conditions = COALESCE(?, conditions)
       WHERE id = ? AND owner_user_id = ?`,
      [
        fullName ? String(fullName).slice(0, 150) : null,
        relation ? String(relation).slice(0, 50) : null,
        dateOfBirth || null,
        ["Male", "Female", "Other"].includes(gender) ? gender : null,
        bloodGroup ? String(bloodGroup).slice(0, 5) : null,
        allergies ? String(allergies).slice(0, 500) : null,
        conditions ? String(conditions).slice(0, 500) : null,
        req.params.id,
        req.user.id,
      ]
    );
    if (!result.affectedRows) return res.status(404).json({ error: "Family member not found." });
    res.json({ message: "Family member updated." });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/patients/family/:id
async function deleteFamily(req, res, next) {
  try {
    const [result] = await pool.query("DELETE FROM family_members WHERE id = ? AND owner_user_id = ?", [
      req.params.id,
      req.user.id,
    ]);
    if (!result.affectedRows) return res.status(404).json({ error: "Family member not found." });
    await logAudit(req.user.id, "family.delete", `family member ${req.params.id}`);
    res.json({ message: "Family member removed." });
  } catch (err) {
    next(err);
  }
}

module.exports = { listFamily, createFamily, updateFamily, deleteFamily };
