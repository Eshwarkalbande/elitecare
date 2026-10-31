const router = require("express").Router();
const { register, login, me } = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

// Runs after the express-validator chain and returns the FIRST error message
// verbatim, so the existing client-facing copy is preserved exactly.
const runValidation = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array()[0].msg });
  }
  next();
};

// Preserves the original combined message: if any of the three fields is missing
// the response is exactly "fullName, email and password are required." as before.
const requireRegisterFields = (req, res, next) => {
  const { fullName, email, password } = req.body || {};
  if (!fullName || !email || !password) {
    return res.status(400).json({ error: "fullName, email and password are required." });
  }
  next();
};

const registerRules = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),
];

const loginRules = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .bail()
    .notEmpty()
    .withMessage("Email and password are required."),
  body("password")
    .notEmpty()
    .withMessage("Email and password are required."),
];

router.post("/register", requireRegisterFields, registerRules, runValidation, register);
router.post("/login", loginRules, runValidation, login);
router.get("/me", requireAuth, me);

module.exports = router;
