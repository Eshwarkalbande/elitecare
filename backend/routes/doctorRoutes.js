const router = require("express").Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const ctrl = require("../controllers/doctorController");
const preConsultCtrl = require("../controllers/preConsultController");
const automationCtrl = require("../controllers/automationController");
const safetyCtrl = require("../controllers/safetyController");

// Public — used by "Find a Doctor" page
router.get("/", ctrl.listDoctors);

// Phase 1C — Pre-consult summary. The doctor must own the appointment; the
// ownership check uses the JWT, so no patient id is accepted from the client.
router.get(
  "/appointments/:id/pre-consult-summary",
  requireAuth,
  requireRole("doctor"),
  preConsultCtrl.getPreConsultSummary
);

// Phase 5C — doctor verification. A doctor submits their own details only.
router.get("/me/verification", requireAuth, requireRole("doctor"), safetyCtrl.getMyVerification);
router.post("/me/verification", requireAuth, requireRole("doctor"), safetyCtrl.submitVerification);

// Phase 6B/6C — the clinic queue and the follow-up suggestions a doctor sets.
router.get("/me/queue", requireAuth, requireRole("doctor"), automationCtrl.listClinicQueue);
router.post("/me/queue/:appointmentId", requireAuth, requireRole("doctor"), automationCtrl.issueMyToken);
router.put("/me/queue/:id", requireAuth, requireRole("doctor"), automationCtrl.updateQueueToken);
router.post("/me/follow-ups", requireAuth, requireRole("doctor"), automationCtrl.createFollowUp);

// Logged-in doctor's own dashboard data
router.get("/me/profile", requireAuth, requireRole("doctor"), ctrl.getMyProfile);
router.put("/me/profile", requireAuth, requireRole("doctor"), ctrl.updateMyProfile);
router.get("/me/appointments", requireAuth, requireRole("doctor"), ctrl.getMyAppointments);
router.put("/me/appointments/:id", requireAuth, requireRole("doctor"), ctrl.updateAppointmentStatus);
router.get("/me/patients", requireAuth, requireRole("doctor"), ctrl.getMyPatients);

router.get("/:id", ctrl.getDoctor);

module.exports = router;
