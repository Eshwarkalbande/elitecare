require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const { testConnection } = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const { startScheduler, registerJob } = require("./services/scheduler");

// Phase 1B — medicine reminder job. Registered at module load so it is part of
// the first tick; `startScheduler()` is still the only thing that starts cron.
registerJob("medicine-reminders", require("./services/reminders").run);

const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const adminRoutes = require("./routes/adminRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");
const aiRoutes = require("./routes/aiRoutes");
const wearableRoutes = require("./routes/wearableRoutes");
const { publicCard } = require("./controllers/safetyController");

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------------------------
// Fail fast on a weak / placeholder JWT secret (Task: secrets hygiene)
// ---------------------------------------------------------------------------
(function validateJwtSecret() {
  const secret = process.env.JWT_SECRET || "";
  const weak = !secret || secret.length < 32 || /change|secret|your|example/i.test(secret);
  if (!weak) return;

  const message =
    "JWT_SECRET is missing, shorter than 32 characters, or still contains placeholder text. " +
    "Set a strong random value (e.g. `openssl rand -hex 32`).";

  if (process.env.NODE_ENV === "production") {
    console.error(`❌ FATAL: ${message}`);
    process.exit(1);
  }
  console.warn(`⚠️  WARNING: ${message} (non-fatal in development)`);
})();

const jsonErrorMessage = { error: "Too many requests. Please try again later." };

// Rate limit configuration (env-overridable; current values are production defaults).
const AUTH_LIMIT_MAX = Number(process.env.RATE_LIMIT_LOGIN_MAX) || 10;
const AUTH_LIMIT_WINDOW_MIN = Number(process.env.RATE_LIMIT_LOGIN_WINDOW_MIN) || 15;
const AI_LIMIT_MAX = Number(process.env.RATE_LIMIT_AI_MAX) || 30;
const AI_LIMIT_WINDOW_MIN = Number(process.env.RATE_LIMIT_AI_WINDOW_MIN) || 15;

// Brute-force protection on the credential endpoints.
const authLimiter = rateLimit({
  windowMs: AUTH_LIMIT_WINDOW_MIN * 60 * 1000,
  limit: AUTH_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: jsonErrorMessage,
  handler: (req, res) => res.status(429).json(jsonErrorMessage),
});

// Keeps the Gemini bill bounded: caps AI requests per IP.
const aiLimiter = rateLimit({
  windowMs: AI_LIMIT_WINDOW_MIN * 60 * 1000,
  limit: AI_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: jsonErrorMessage,
  handler: (req, res) => res.status(429).json(jsonErrorMessage),
});

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "elitecare-backend", time: new Date().toISOString() });
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/ai", aiLimiter);

// Public Emergency Health Card. The 32+ character token IS the capability, so
// this one route is deliberately unauthenticated — but it is rate limited,
// sends noindex, and every view is written to the audit log with a hashed IP.
const publicCardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many card views. Please try again later." },
});

app.get("/api/public/emergency/:token", publicCardLimiter, publicCard);

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/wearables", wearableRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 EliteCare backend running on http://localhost:${PORT}`);
  testConnection();
  // Background jobs (medicine reminders, follow-ups, queue upkeep …) run once a
  // minute in Asia/Kolkata. Disable with SCHEDULER_ENABLED=false.
  startScheduler();
});
