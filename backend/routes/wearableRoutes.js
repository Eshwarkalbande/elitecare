/**
 * Phase 3 — Wearables. Mounted at /api/wearables by server.js.
 *
 * Every handler is scoped through services/access.js, so a patient reads and
 * writes their own readings (and their own family members'), a doctor or admin
 * must already have a clinical relationship with the patient, and anyone else's
 * family member is a hard 403.
 */
const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const { requireAuth, requireRole } = require("../middleware/auth");
const ctrl = require("../controllers/wearableController");
// The date validator is shared (middleware/validate.js) rather than duplicated
// here: a local copy drifts, and this one used to be the pre-fix version that
// accepted an impossible calendar date such as 2026-02-31 because `new Date()`
// silently rolls it over to 2026-03-03.
const { runValidation, optionalDateValidator } = require("../middleware/validate");
const { body } = require("express-validator");

// Imports and batches are the write-heavy paths, so they get their own limit.
const importLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many imports. Please try again later." },
});

const addSampleRules = [
  body("type").isIn(["steps", "heart_rate", "sleep", "spo2", "calories"]).withMessage("type must be one of steps, heart_rate, sleep, spo2, calories."),
  body("value").isNumeric().withMessage("value must be a number."),
  optionalDateValidator("recordedAt", "recordedAt"),
];

router.get("/connections", requireAuth, requireRole("patient"), ctrl.listConnections);
router.get("/summary", requireAuth, ctrl.getSummary);
router.get("/samples", requireAuth, ctrl.listSamples);

router.post("/samples", requireAuth, requireRole("patient"), addSampleRules, runValidation, ctrl.addSample);
router.post("/ingest", requireAuth, ctrl.ingestBatch);
router.post("/import", requireAuth, requireRole("patient"), importLimiter, ctrl.importCsv);

router.delete("/samples/:id", requireAuth, requireRole("patient"), ctrl.deleteSample);
router.delete("/all", requireAuth, requireRole("patient"), ctrl.deleteAll);

module.exports = router;
