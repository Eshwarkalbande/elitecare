const { body, validationResult } = require("express-validator");

/**
 * Shared express-validator result middleware (same behaviour and copy as the
 * chain already used in routes/authRoutes.js: the FIRST error message verbatim).
 */
const runValidation = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array()[0].msg });
  }
  next();
};

// ---------------------------------------------------------------------------
// Strict calendar-date validation (Group 0).
//
// `new Date("2026-02-31")` is NOT invalid: JavaScript rolls it over to
// 2026-03-03. A plain isDate() check therefore accepts an impossible date and
// stores a date the user never typed. This validator requires a real
// YYYY-MM-DD (or full ISO 8601) whose parts round-trip back to themselves.
// ---------------------------------------------------------------------------
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * True only when `value` is a real date whose calendar parts match the input.
 * Rejects 2026-02-31, 2026-13-01, 2025-02-29 and anything unparseable.
 */
function isRealCalendarDate(value) {
  if (value instanceof Date) return !Number.isNaN(value.getTime());

  if (typeof value === "string") {
    const match = ISO_DATE.exec(value.trim());
    // Date-only form: verify the parts round-trip.
    if (match) {
      const [y, m, d] = match[0].split("-").map(Number);
      const probe = new Date(Date.UTC(y, m - 1, d));
      return (
        probe.getUTCFullYear() === y && probe.getUTCMonth() === m - 1 && probe.getUTCDate() === d
      );
    }
  }

  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime());
}

/** Today's date as YYYY-MM-DD in UTC, for the "not in the future" comparison. */
function todayUtc() {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
}

/**
 * Shared express-validator chain for a body date field.
 *
 * @param {string} field    body field name
 * @param {string} label    human name used in the error message
 * @param {object} opts     { optional, allowFuture }
 */
function dateRule(field, label, { optional = false, allowFuture = false } = {}) {
  let chain = optional ? body(field).optional({ nullable: true }) : body(field);
  return chain.custom((value) => {
    if (value === undefined || value === null || value === "") {
      if (optional) return true;
      throw new Error(`${label} is required.`);
    }
    if (!isRealCalendarDate(value)) {
      throw new Error(`${label} must be a real calendar date (YYYY-MM-DD), for example 2026-01-31.`);
    }
    if (!allowFuture) {
      const d = new Date(value);
      const inputUtc = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
      if (inputUtc > todayUtc()) {
        throw new Error(`${label} cannot be in the future.`);
      }
    }
    return true;
  });
}

/**
 * Wraps the shared date validator: accepts ISO 8601 (full or date-only), a real
 * calendar date, and never a future date. Kept as a named function because the
 * route file already calls it in several places.
 */
const dateValidator = (field, label) => dateRule(field, label);

// Optional date validator (allows undefined/null but validates if present).
const optionalDateValidator = (field, label) => dateRule(field, label, { optional: true });

module.exports = {
  runValidation,
  isRealCalendarDate,
  dateRule,
  dateValidator,
  optionalDateValidator,
};
