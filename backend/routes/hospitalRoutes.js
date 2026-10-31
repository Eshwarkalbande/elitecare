const router = require("express").Router();
const { pool } = require("../config/db");

// GET /api/hospitals — public, used by "Nearby Hospitals" page
router.get("/", async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM hospitals ORDER BY name");
    res.json({ hospitals: rows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
