const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const ctrl = require("../controllers/aiController");
const tools = require("../controllers/aiToolsController");
const automationCtrl = require("../controllers/automationController");
const { runValidation } = require("../middleware/validate");
const { body } = require("express-validator");

router.post("/symptoms", requireAuth, ctrl.symptomChecker);
router.post("/scan-med", requireAuth, ctrl.medicineScanner);
router.post("/chat", requireAuth, ctrl.chatAssistant);
router.post("/health-advice", requireAuth, ctrl.healthAdvice);

// ---------------------------------------------------------------
// Phase 1A — Lab Report Explainer.
// multipart/form-data, ONE file, held in memory only (never written to disk).
// The route sits under /api/ai, so it already inherits the `aiLimiter` rate
// limit registered in server.js.
// ---------------------------------------------------------------
router.post("/lab-report", requireAuth, tools.upload.single("file"), tools.explainLabReport);

// ---------------------------------------------------------------
// Phase 2C — Health translator (en | hi | mr, max 1000 characters).
// ---------------------------------------------------------------
const translateRules = [
  body("text")
    .isString()
    .withMessage("text is required.")
    .trim()
    .notEmpty()
    .withMessage("text is required.")
    .isLength({ max: 1000 })
    .withMessage("text must be 1000 characters or fewer."),
  body("from").isIn(["en", "hi", "mr"]).withMessage("from must be en, hi or mr."),
  body("to").isIn(["en", "hi", "mr"]).withMessage("to must be en, hi or mr."),
];

router.post("/translate", requireAuth, translateRules, runValidation, tools.translateText);

// ---------------------------------------------------------------
// Phase 6A — symptom to speciality. It only READS doctors and free
// slots; it never books, reserves or holds anything.
// ---------------------------------------------------------------
const triageRules = [
  body("symptoms")
    .isString()
    .withMessage("symptoms is required.")
    .trim()
    .notEmpty()
    .withMessage("symptoms is required.")
    .isLength({ max: 500 })
    .withMessage("symptoms must be 500 characters or fewer."),
];

router.post("/triage", requireAuth, triageRules, runValidation, automationCtrl.suggestBooking);

module.exports = router;