const router = require("express").Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const ctrl = require("../controllers/adminController");
const wellnessCtrl = require("../controllers/wellnessController");
const safetyCtrl = require("../controllers/safetyController");

router.use(requireAuth, requireRole("admin"));

router.get("/stats", ctrl.getStats);

router.get("/users", ctrl.listUsers);
router.post("/users", ctrl.createUser);
router.put("/users/:id", ctrl.updateUser);
router.delete("/users/:id", ctrl.deleteUser);

router.get("/appointments", ctrl.listAllAppointments);

router.get("/hospitals", ctrl.listHospitals);
router.post("/hospitals", ctrl.createHospital);

// ---------------------------------------------------------------
// Phase 4E — the reward catalog and its redemptions.
// ---------------------------------------------------------------
router.get("/rewards", wellnessCtrl.adminListVouchers);
router.post("/rewards", wellnessCtrl.adminUpsertVoucher);
router.put("/rewards/redemptions/:id", wellnessCtrl.adminMarkRedemption);
router.get("/referrals", wellnessCtrl.adminReferrals);

// ---------------------------------------------------------------
// Phase 5C — doctor verification review queue.
// ---------------------------------------------------------------
router.get("/verifications", safetyCtrl.adminListVerifications);
router.put("/verifications/:id", safetyCtrl.adminReviewVerification);

module.exports = router;
