const router = require("express").Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const ctrl = require("../controllers/patientController");
const labCtrl = require("../controllers/labReportController");
const reminderCtrl = require("../controllers/reminderController");
const familyCtrl = require("../controllers/familyController");
const wellnessCtrl = require("../controllers/wellnessController");
const safetyCtrl = require("../controllers/safetyController");
const automationCtrl = require("../controllers/automationController");
const {
  runValidation,
  dateValidator,
  optionalDateValidator,
} = require("../middleware/validate");
const { body, query } = require("express-validator");

// All patient routes require login. Patients can only see their own data;
// doctors/admins may pass ?patientId=123 to view a specific patient's records.
router.get("/profile", requireAuth, ctrl.getProfile);
router.put("/profile", requireAuth, requireRole("patient"), ctrl.updateProfile);

router.get("/appointments", requireAuth, ctrl.getAppointments);
router.post(
  "/appointments",
  requireAuth,
  requireRole("patient"),
  [
    body("doctorId").isInt().withMessage("doctorId must be an integer."),
    dateValidator("date", "appointment date"),
    body("time").matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("time must be in HH:MM format."),
  ],
  runValidation,
  ctrl.bookAppointment
);
router.put("/appointments/:id/cancel", requireAuth, requireRole("patient"), ctrl.cancelAppointment);

// Medical History (Patient Dashboard feature)
router.get("/medical-history", requireAuth, ctrl.getMedicalHistory);
router.post(
  "/medical-history",
  requireAuth,
  requireRole("doctor", "admin"),
  [
    body("patientId").isInt().withMessage("patientId must be an integer."),
    dateValidator("recordDate", "recordDate"),
    body("recordType").isString().trim().notEmpty().withMessage("recordType is required."),
  ],
  runValidation,
  ctrl.addMedicalHistory
);

// Prescription History (Patient Dashboard feature)
router.get("/prescriptions", requireAuth, ctrl.getPrescriptions);
router.post(
  "/prescriptions",
  requireAuth,
  requireRole("doctor"),
  [
    body("patientId").isInt().withMessage("patientId must be an integer."),
    dateValidator("prescriptionDate", "prescriptionDate"),
    body("medicines").isArray({ min: 1 }).withMessage("At least one medicine is required."),
  ],
  runValidation,
  ctrl.addPrescription
);

// ---------------------------------------------------------------
// Phase 1A — Lab Report Explainer: SAVED summaries only.
// ---------------------------------------------------------------
const saveLabReportRules = [
  body("summary").isString().withMessage("summary is required.").trim().notEmpty().withMessage("summary is required."),
  body("title").optional().isLength({ max: 150 }).withMessage("title must be 150 characters or fewer."),
  body("urgency").optional().isIn(["low", "medium", "high", "unknown"]).withMessage("urgency is not valid."),
  body("language").optional().isIn(["en", "hi", "mr"]).withMessage("language must be en, hi or mr."),
  optionalDateValidator("reportDate", "reportDate"),
];

router.get("/lab-reports", requireAuth, labCtrl.listLabReports);
router.post("/lab-reports", requireAuth, requireRole("patient"), saveLabReportRules, runValidation, labCtrl.saveLabReport);
router.post("/lab-reports/:id/share", requireAuth, requireRole("patient"), labCtrl.shareLabReport);
router.delete("/lab-reports/:id", requireAuth, requireRole("patient"), labCtrl.deleteLabReport);

// ---------------------------------------------------------------
// Phase 1B — Prescription -> Reminders.
// A reminder is never active until the patient confirms real times.
// ---------------------------------------------------------------
const createReminderRules = [
  body("medicineName")
    .isString()
    .withMessage("medicineName is required.")
    .trim()
    .notEmpty()
    .withMessage("medicineName is required.")
    .isLength({ max: 150 })
    .withMessage("medicineName must be 150 characters or fewer."),
  body("doseText").optional().isLength({ max: 100 }).withMessage("doseText must be 100 characters or fewer."),
  body("times").optional().isArray({ max: 6 }).withMessage("times must hold at most 6 entries."),
  body("channels").optional().isArray({ max: 4 }).withMessage("channels must hold at most 4 entries."),
];

const markEventRules = [
  body("status").isIn(["taken", "skipped"]).withMessage("status must be taken or skipped."),
];

router.get("/reminders", requireAuth, reminderCtrl.listReminders);
router.get("/reminders/adherence", requireAuth, reminderCtrl.getAdherence);
router.post("/reminders/propose", requireAuth, requireRole("patient"), reminderCtrl.proposeReminders);
router.post("/reminders", requireAuth, requireRole("patient"), createReminderRules, runValidation, reminderCtrl.createReminder);
router.patch("/reminders/:id", requireAuth, requireRole("patient"), reminderCtrl.updateReminder);
router.delete("/reminders/:id", requireAuth, requireRole("patient"), reminderCtrl.deleteReminder);
router.post(
  "/reminders/:id/events/:eventId",
  requireAuth,
  requireRole("patient"),
  markEventRules,
  runValidation,
  reminderCtrl.markEvent
);

// ---------------------------------------------------------------
// Phase 2A — Family profiles. Patient-only: one account, one family.
// ---------------------------------------------------------------
router.get("/family", requireAuth, familyCtrl.listFamily);
router.post("/family", requireAuth, requireRole("patient"), familyCtrl.createFamily);
router.put("/family/:id", requireAuth, requireRole("patient"), familyCtrl.updateFamily);
router.delete("/family/:id", requireAuth, requireRole("patient"), familyCtrl.deleteFamily);

// ---------------------------------------------------------------
// Phase 4A — Health tracker readings + trends.
// ---------------------------------------------------------------
const addMetricRules = [
  body("type").isIn(["bp", "glucose", "weight", "spo2", "heart_rate"]).withMessage("type must be one of bp, glucose, weight, spo2, heart_rate."),
  body("value1").isNumeric().withMessage("value1 must be a number."),
  body("value2").optional().isNumeric().withMessage("value2 must be a number."),
  optionalDateValidator("recordedAt", "recordedAt"),
];

router.get("/metrics", requireAuth, wellnessCtrl.listMetrics);
router.post("/metrics", requireAuth, requireRole("patient"), addMetricRules, runValidation, wellnessCtrl.addMetric);
router.delete("/metrics/:id", requireAuth, requireRole("patient"), wellnessCtrl.deleteMetric);
router.get("/metrics/trends", requireAuth, wellnessCtrl.getMetricTrends);

// ---------------------------------------------------------------
// Phase 4B/4C/4D — coins, rewards, referrals, challenges.
// ---------------------------------------------------------------
router.get("/rewards", requireAuth, requireRole("patient"), wellnessCtrl.getRewards);
router.post("/rewards/redeem", requireAuth, requireRole("patient"), wellnessCtrl.redeemVoucher);
router.get("/referrals", requireAuth, requireRole("patient"), wellnessCtrl.getReferral);
router.post("/referrals/claim", requireAuth, requireRole("patient"), wellnessCtrl.claimReferral);
router.get("/challenges", requireAuth, requireRole("patient"), wellnessCtrl.listChallenges);
router.post("/challenges/:id/join", requireAuth, requireRole("patient"), wellnessCtrl.joinChallenge);
router.post("/challenges/:id/progress", requireAuth, requireRole("patient"), wellnessCtrl.updateChallengeProgress);
router.get("/challenges/:id/leaderboard", requireAuth, wellnessCtrl.getChallengeLeaderboard);

// ---------------------------------------------------------------
// Phase 5A/5B — emergency contacts, SOS log, Emergency Health Card.
// ---------------------------------------------------------------
router.get("/emergency-contacts", requireAuth, requireRole("patient"), safetyCtrl.listContacts);
router.post("/emergency-contacts", requireAuth, requireRole("patient"), safetyCtrl.addContact);
router.delete("/emergency-contacts/:id", requireAuth, requireRole("patient"), safetyCtrl.deleteContact);
router.post("/sos", requireAuth, requireRole("patient"), safetyCtrl.logSos);

router.get("/emergency-card", requireAuth, requireRole("patient"), safetyCtrl.getMyCard);
router.put("/emergency-card", requireAuth, requireRole("patient"), safetyCtrl.updateMyCard);
router.post("/emergency-card/regenerate", requireAuth, requireRole("patient"), safetyCtrl.regenerateMyCard);
router.post("/emergency-card/revoke", requireAuth, requireRole("patient"), safetyCtrl.revokeMyCard);

// ---------------------------------------------------------------
// Phase 6B/6C — the patient's own queue token and follow-up cards.
// ---------------------------------------------------------------
router.get("/queue", requireAuth, requireRole("patient"), automationCtrl.getMyQueue);
router.get("/follow-ups", requireAuth, requireRole("patient"), automationCtrl.getMyFollowUps);
router.post("/follow-ups/:id/dismiss", requireAuth, requireRole("patient"), automationCtrl.dismissFollowUp);

module.exports = router;
