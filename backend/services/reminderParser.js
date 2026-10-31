/**
 * Conservative prescription -> reminder schedule parser (Phase 1B).
 *
 * It reads the DOCTOR'S OWN TEXT (dosage + frequency + duration) and proposes
 * times. Two hard rules:
 *
 *   1. It never rewrites the dose. `dose_text` is copied verbatim; only the
 *      `times[]` array is proposed, and the patient confirms or edits it.
 *   2. When it is not confident it returns `confident: false` and an EMPTY
 *      times array — never a guess presented as a schedule.
 *
 * Examples
 *   "1-0-1"                     -> 08:00, 20:00        (pattern)
 *   "1-1-1"                     -> 08:00, 14:00, 20:00 (pattern)
 *   "Twice a day, after food"   -> 08:00, 20:00        (frequency)
 *   "Once daily"                -> 08:00               (frequency)
 *   "SOS / as needed"           -> []  (cannot be scheduled)
 *   "Twice a week"              -> []  (not a daily schedule)
 */

// The three slots a "1-0-1" style pattern maps onto.
const SLOTS = ["08:00", "14:00", "20:00"];

/** Frequency phrases -> slots. Ordered: the first match wins. */
const FREQUENCY_RULES = [
  { re: /\b(four times|4 times|qds|qid|q\.i\.d)\b/, times: ["06:00", "12:00", "18:00", "22:00"] },
  { re: /\b(three times|thrice|tds|tid|t\.i\.d|3 times)\b/, times: ["08:00", "14:00", "20:00"] },
  { re: /\b(twice|two times|bd|b\.i\.d|2 times)\b/, times: ["08:00", "20:00"] },
  { re: /\b(once|one time|single dose|od|o\.d|every day|daily)\b/, times: ["08:00"] },
];

/** Phrases that mean "cannot be put on a clock" — always unconfident. */
const UNPARSEABLE = /\b(sos|s\.o\.s|as needed|as required|when required|when needed|prn|p\.r\.n|if pain|when fever)\b/;
/** Frequencies that are real but not a daily clock. */
const NON_DAILY = /\b(weekly|once a week|monthly|every other day|alternate day|twice a week|every \d+ weeks?)\b/;

const EVERY_HOURS = /\bevery\s+(\d{1,2})\s*(?:hours?|hrs?|h)\b/;

function toArray(parts) {
  return parts.filter(Boolean).map((t) => String(t).slice(0, 5));
}

/** "1-0-1" / "1 - 0 - 1" / "1/0/1" with single digits 0-2. */
function parseDosePattern(text) {
  const match = text.match(/(?:^|[^\d])([0-2])\s*[-/]\s*([0-2])\s*[-/]\s*([0-2])(?:[^\d]|$)/);
  if (!match) return null;
  const counts = [Number(match[1]), Number(match[2]), Number(match[3])];
  if (counts.every((c) => c === 0)) return null;
  const times = toArray(SLOTS.filter((_, index) => counts[index] > 0));
  return times.length ? times : null;
}

/** "every 6 hours" -> fixed clock slots, only for the common divisors of 24. */
function parseEveryHours(text) {
  const match = text.match(EVERY_HOURS);
  if (!match) return null;
  const hours = Number(match[1]);
  if (![4, 6, 8, 12].includes(hours)) return null;
  const times = [];
  for (let hour = hours; hour <= 24; hour += hours) {
    times.push(`${String(hour === 24 ? 0 : hour).padStart(2, "0")}:00`);
  }
  return times.sort();
}

/**
 * Proposes a schedule.
 * @param {{dosage?:string, frequency?:string, duration?:string, instructions?:string}} item
 * @returns {{confident:boolean, times:string[], endDate:string|null, reason:string, parser:string, doseText:string|null}}
 */
function proposeSchedule(item = {}) {
  const dosage = String(item.dosage || "");
  const frequency = String(item.frequency || "");
  const instructions = String(item.instructions || "");
  const haystack = `${frequency} ${dosage} ${instructions}`.toLowerCase();

  const base = {
    confident: false,
    times: [],
    endDate: parseDuration(item.duration),
    reason: "no-schedule-found",
    parser: "none",
    doseText: (dosage || frequency).trim() || null,
  };

  if (!haystack.trim()) return { ...base, reason: "empty" };
  if (UNPARSEABLE.test(haystack)) return { ...base, reason: "as-needed" };
  if (NON_DAILY.test(haystack)) return { ...base, reason: "not-daily" };

  const pattern = parseDosePattern(dosage) || parseDosePattern(frequency);
  if (pattern) {
    return { ...base, confident: true, times: pattern, reason: "dose-pattern", parser: "pattern" };
  }

  const everyHours = parseEveryHours(haystack);
  if (everyHours) {
    return { ...base, confident: true, times: everyHours, reason: "every-n-hours", parser: "interval" };
  }

  for (const rule of FREQUENCY_RULES) {
    if (rule.re.test(haystack)) {
      return { ...base, confident: true, times: rule.times, reason: "frequency-text", parser: "frequency" };
    }
  }

  return base;
}

/**
 * "7 days" -> YYYY-MM-DD (start + 7 days). "1 month" -> +30 days.
 * Returns null when no duration is stated.
 * @param {string} [duration]
 * @param {Date} [from]
 */
function parseDuration(duration, from = new Date()) {
  const text = String(duration || "").toLowerCase();
  if (!text) return null;

  const match = text.match(/(\d{1,3})\s*(day|days|week|weeks|month|months|fortnight)/);
  if (!match) return null;

  const amount = Number(match[1]);
  const unit = match[2];
  let days = amount;
  if (unit.startsWith("week")) days = amount * 7;
  else if (unit.startsWith("month")) days = amount * 30;
  else if (unit === "fortnight") days = 14;
  if (!days || days > 365) return null;

  const end = new Date(from.getTime() + days * 24 * 60 * 60 * 1000);
  return end.toISOString().slice(0, 10);
}

/** Validates a caller-supplied times array ("HH:MM", max 6 entries, unique, sorted). */
function sanitizeTimes(input) {
  if (!Array.isArray(input)) return [];
  const seen = new Set();
  for (const raw of input) {
    const match = String(raw).trim().match(/^(\d{1,2}):(\d{2})$/);
    if (!match) continue;
    const hour = Number(match[1]);
    const minute = Number(match[2]);
    if (hour > 23 || minute > 59) continue;
    seen.add(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
  }
  return Array.from(seen).sort().slice(0, 6);
}

module.exports = { proposeSchedule, parseDuration, sanitizeTimes, SLOTS };
