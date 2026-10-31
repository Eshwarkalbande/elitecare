/**
 * Phase 1A (lab report explainer) + Phase 2C (health translator).
 *
 * Both endpoints live under /api/ai, so they inherit the existing `aiLimiter`
 * rate limit from server.js, the JWT requirement from aiRoutes.js and the
 * shared Gemini client / SAFETY_GUIDANCE / 2000-char cap from aiClient.js.
 *
 * Honesty rules applied here:
 *   * with no GEMINI_API_KEY every reply is clearly labelled `isMock: true`
 *     ("simulated") and never pretends to be a real reading of the report;
 *   * a malformed model reply falls back to a safe message instead of being
 *     shown as if it were valid;
 *   * the uploaded file is held in memory only and is dropped when the request
 *     ends unless the patient explicitly asked to save the summary.
 */
const multer = require("multer");
const { pool } = require("../config/db");
const { generateJson, generateText, isMockMode, normalizeLanguage, capText } = require("../services/aiClient");

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_MIME = ["image/jpeg", "image/png", "application/pdf"];

/** Reads the first bytes of the buffer: a MIME type from the client is not proof. */
function sniffMagicBytes(buffer) {
  if (!buffer || buffer.length < 4) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image/jpeg";
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return "image/png";
  if (buffer.subarray(0, 4).toString("latin1") === "%PDF") return "application/pdf";
  return null;
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_BYTES, files: 1 },
  fileFilter(req, file, cb) {
    if (!ACCEPTED_MIME.includes(file.mimetype)) {
      return cb(new Error("Only a JPG, PNG or PDF file can be explained."));
    }
    return cb(null, true);
  },
});

const DISCLAIMER =
  "This is an AI explanation of the text in your report, not a diagnosis. " +
  "Only a qualified clinician can interpret a report. In an emergency, call 112.";

const SAFE_FALLBACK = {
  summary:
    "We could not read this report reliably, so no explanation is shown. " +
    "Please share the original report with your doctor.",
  items: [],
  questionsForDoctor: [],
  urgency: "unknown",
};

const ITEM_STATUSES = ["low", "normal", "high", "unknown"];
const URGENCIES = ["low", "medium", "high", "unknown"];

/** Normalises one model-provided item; unknown junk is dropped rather than shown. */
function normalizeItem(raw) {
  if (!raw || typeof raw !== "object") return null;
  const name = String(raw.name || "").trim().slice(0, 80);
  if (!name) return null;
  const status = ITEM_STATUSES.includes(String(raw.status || "").toLowerCase())
    ? String(raw.status).toLowerCase()
    : "unknown";
  return {
    name,
    value: raw.value == null ? "" : String(raw.value).slice(0, 40),
    unit: raw.unit == null ? "" : String(raw.unit).slice(0, 20),
    referenceRange: raw.referenceRange == null ? "" : String(raw.referenceRange).slice(0, 40),
    status,
    note: raw.note == null ? "" : String(raw.note).slice(0, 300),
  };
}

/** Validates the model's JSON shape; returns null when it is not usable. */
function normalizeLabResult(data) {
  if (!data || typeof data !== "object") return null;
  const summary = String(data.summary || "").trim();
  if (!summary) return null;

  const items = Array.isArray(data.items) ? data.items.map(normalizeItem).filter(Boolean).slice(0, 60) : [];
  const questionsForDoctor = Array.isArray(data.questionsForDoctor)
    ? data.questionsForDoctor
        .map((q) => String(q || "").trim().slice(0, 200))
        .filter(Boolean)
        .slice(0, 10)
    : [];

  const urgencyRaw = String(data.urgency || "").toLowerCase();
  const urgency = URGENCIES.includes(urgencyRaw) ? urgencyRaw : "unknown";

  return { summary: summary.slice(0, 4000), items, questionsForDoctor, urgency };
}

/** Labelled mock used when no Gemini key is configured. */
function mockLabResult(language) {
  const note =
    language === "hi"
      ? "यह एक अनुकरणीय (simulated) उत्तर है — GEMINI_API_KEY सेट नहीं है।"
      : language === "mr"
        ? "हे एक अनुकरणीय (simulated) उत्तर आहे — GEMINI_API_KEY सेट केलेली नाही."
        : "This is a simulated answer — no GEMINI_API_KEY is configured, so the report was not analysed.";
  return {
    summary:
      `${note} In mock mode the app only shows the shape of the real answer: a short plain-language ` +
      `explanation of the report, the values it contains and why the flagged ones matter.`,
    items: [
      {
        name: "Hemoglobin",
        value: "11.2",
        unit: "g/dL",
        referenceRange: "13.0 - 17.0",
        status: "low",
        note: "Example row (simulated) — below the printed range.",
      },
      {
        name: "Total cholesterol",
        value: "182",
        unit: "mg/dL",
        referenceRange: "< 200",
        status: "normal",
        note: "Example row (simulated) — inside the printed range.",
      },
    ],
    questionsForDoctor: [
      "Which of these values should I repeat, and after how long?",
      "Does any change to my current medicine plan make sense?",
    ],
    urgency: "low",
  };
}

const LAB_SYSTEM_INSTRUCTION =
  "You explain a medical lab report to the patient who owns it, in plain language.\n" +
  "Return ONLY a JSON object with this exact shape:\n" +
  '{"summary": string, "items": [{"name": string, "value": string, "unit": string, ' +
  '"referenceRange": string, "status": "low"|"normal"|"high"|"unknown", "note": string}], ' +
  '"questionsForDoctor": [string], "urgency": "low"|"medium"|"high"}\n' +
  "Rules: repeat the values and the printed reference ranges exactly as they appear. " +
  "Never state or imply a diagnosis, never suggest a medicine or a dose. " +
  "`note` explains a flagged value in one short sentence. " +
  "`questionsForDoctor` holds at most 5 questions phrased for the patient to ask.";

// POST /api/ai/lab-report   (multipart/form-data: file, language, consent, save?, title?, reportDate?)
async function explainLabReport(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Attach one JPG, PNG or PDF report as the `file` field." });
    }
    if (req.file.size > MAX_FILE_BYTES) {
      return res.status(413).json({ error: "The report must be 5 MB or smaller." });
    }

    const sniffed = sniffMagicBytes(req.file.buffer);
    if (!sniffed) {
      return res.status(400).json({
        error: "That file does not look like a JPG, PNG or PDF. Upload the original report file.",
      });
    }

    // Explicit consent: the report leaves the server and goes to the AI provider.
    const consent = String(req.body.consent ?? "").toLowerCase() === "true";
    if (!consent) {
      return res.status(400).json({
        error: "Consent is required: confirm that this report may be sent to the AI provider.",
      });
    }

    const language = normalizeLanguage(req.body.language);
    const save = String(req.body.save ?? "").toLowerCase() === "true";

    let result = null;
    let isMock = false;

    if (isMockMode()) {
      result = mockLabResult(language);
      isMock = true;
    } else {
      const outcome = await generateJson({
        prompt: `Explain the attached lab report${
          req.body.title ? ` (titled "${capText(req.body.title, 120).text}")` : ""
        }.`,
        systemInstruction: LAB_SYSTEM_INSTRUCTION,
        temperature: 0.2,
        language,
        inlineFile: { mimeType: sniffed, data: req.file.buffer.toString("base64") },
      });
      result = outcome.ok ? normalizeLabResult(outcome.data) : null;
      if (!result) result = { ...SAFE_FALLBACK };
    }

    let savedReportId = null;
    // The file and its text are discarded at the end of this request unless the
    // patient explicitly asked to keep the summary (and it was a real analysis).
    if (save && !isMock) {
      const [inserted] = await pool.query(
        `INSERT INTO lab_reports (patient_id, title, report_date, summary, items, questions_for_doctor, urgency, language, ai_source)
         VALUES (?,?,?,?,?::jsonb,?::jsonb,?,?,?)`,
        [
          req.user.id,
          capText(req.body.title || "Lab report", 150).text,
          req.body.reportDate || null,
          result.summary,
          JSON.stringify(result.items),
          JSON.stringify(result.questionsForDoctor),
          result.urgency,
          language,
          "gemini",
        ]
      );
      savedReportId = inserted.insertId ?? null;
    }

    res.json({
      summary: result.summary,
      items: result.items,
      questionsForDoctor: result.questionsForDoctor,
      urgency: result.urgency,
      disclaimer: DISCLAIMER,
      language,
      isMock,
      savedReportId,
      stored: Boolean(savedReportId),
    });
  } catch (err) {
    if (err && err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ error: "The report must be 5 MB or smaller." });
    }
    next(err);
  }
}

// ---------------------------------------------------------------------------
// Phase 2C — health translator
// ---------------------------------------------------------------------------

/** Quick phrases the UI offers as one-tap buttons, served locally in mock mode. */
const QUICK_PHRASES = {
  "i have a fever": { hi: "मुझे बुखार है।", mr: "मला ताप आहे." },
  "i am allergic to penicillin": { hi: "मुझे पेनिसिलिन से एलर्जी है।", mr: "मला पेनिसिलिनची ऍलर्जी आहे." },
  "where does it hurt?": { hi: "आपको कहाँ दर्द हो रहा है?", mr: "तुम्हाला कुठे वेदना होत आहेत?" },
};

const TRANSLATE_NOTE =
  "Machine translation can be wrong — confirm important medical information with a clinician or a human interpreter.";

function localDictionaryLookup(text, to) {
  const key = String(text || "").trim().toLowerCase().replace(/[.!?]+$/, "");
  const entry = QUICK_PHRASES[key];
  return entry && entry[to] ? entry[to] : null;
}

const TRANSLATE_SYSTEM =
  "You translate short medical sentences between English, Hindi and Marathi.\n" +
  "Rules: translate faithfully and literally enough to be understood in a clinic. " +
  "Never add advice, never add a diagnosis, never add a dosage. " +
  "Keep every medicine name, number, unit and date unchanged, in Latin script. " +
  "Return ONLY the translated sentence — no notes, no quotes, no preamble.";

// POST /api/ai/translate  { text, from, to }
async function translateText(req, res, next) {
  try {
    const { text, from, to } = req.body || {};
    if (!text || !String(text).trim()) {
      return res.status(400).json({ error: "text is required." });
    }
    const capped = capText(String(text), 1000);
    if (capped.truncated) {
      return res.status(400).json({ error: "text must be 1000 characters or fewer." });
    }

    const sourceLanguage = normalizeLanguage(from, "en");
    const targetLanguage = normalizeLanguage(to, "hi");
    if (sourceLanguage === targetLanguage) {
      return res.status(400).json({ error: "Source and target languages must be different." });
    }

    const dictionaryHit = localDictionaryLookup(capped.text, targetLanguage);

    if (isMockMode()) {
      return res.json({
        translation: dictionaryHit || `[simulated ${targetLanguage.toUpperCase()} translation] ${capped.text}`,
        from: sourceLanguage,
        to: targetLanguage,
        isMock: true,
        source: dictionaryHit ? "dictionary" : "simulated",
        note: `No GEMINI_API_KEY is configured, so this is a labelled simulated result. ${TRANSLATE_NOTE}`,
      });
    }

    const outcome = await generateText({
      prompt: `Translate from ${sourceLanguage} to ${targetLanguage}:\n\n${capped.text}`,
      systemInstruction: TRANSLATE_SYSTEM,
      temperature: 0.1,
      language: targetLanguage,
    });

    if (!outcome.ok) {
      // Nothing is invented to fill the gap.
      return res.json({
        translation: dictionaryHit || "",
        from: sourceLanguage,
        to: targetLanguage,
        isMock: false,
        source: "unavailable",
        note: `The translation service did not answer. ${TRANSLATE_NOTE}`,
      });
    }

    res.json({
      translation: outcome.text.slice(0, 4000),
      from: sourceLanguage,
      to: targetLanguage,
      isMock: false,
      source: "gemini",
      note: TRANSLATE_NOTE,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  upload,
  explainLabReport,
  translateText,
  sniffMagicBytes,
  QUICK_PHRASES,
  MAX_FILE_BYTES,
};
