/**
 * Shared AI plumbing for the phase controllers (lab report, translator,
 * pre-consult summary, tracker explanation).
 *
 * It deliberately imports the client, the safety rules and the character cap
 * from `controllers/aiController.js` — the single place they are defined — so
 * every AI endpoint in the app behaves identically.
 *
 * Nothing here ever returns health data to a log: failures are surfaced as a
 * short message, and the caller decides what the user sees.
 */
const {
  getGenAI,
  SAFETY_GUIDANCE,
  MAX_INPUT_CHARS,
  AI_LANGUAGES,
  LANGUAGE_NAME,
  normalizeLanguage,
  languageInstruction,
} = require("../controllers/aiController");

// Phase 2B: `AI_LANGUAGES`, `LANGUAGE_NAME`, `normalizeLanguage` and
// `languageInstruction` are declared in aiController.js and re-exported here, so
// both modules expose the same single implementation. They stay in this file's
// public API because the phase controllers already import them from here.

/** True when no Gemini key is configured, so callers must return a labelled mock. */
function isMockMode() {
  return !process.env.GEMINI_API_KEY;
}

/** Caps a free-text field so a prompt can never grow without bound. */
function capText(value, cap = MAX_INPUT_CHARS) {
  const text = typeof value === "string" ? value : String(value ?? "");
  return { text: text.slice(0, cap), truncated: text.length > cap };
}

/**
 * Strips a ```json fence and parses the first JSON object in a model reply.
 * Returns `null` when the reply is not usable, so the caller can fall back to a
 * safe message (a malformed answer is never shown as if it were valid).
 */
function parseJsonReply(raw) {
  if (!raw || typeof raw !== "string") return null;
  let text = raw.trim();

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) text = fenced[1].trim();

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;

  try {
    const parsed = JSON.parse(text.slice(start, end + 1));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * One JSON round-trip to Gemini.
 *
 * @param {object} options
 * @param {string} options.prompt
 * @param {string} options.systemInstruction  (SAFETY_GUIDANCE is appended automatically)
 * @param {number} [options.temperature]
 * @param {string} [options.language]         en | hi | mr — only changes the output language
 * @param {{mimeType:string,data:string}} [options.inlineFile] base64 attachment (lab reports)
 * @returns {Promise<{ok:boolean, data?:object, mock?:boolean, error?:string, raw?:string}>}
 */
async function generateJson({ prompt, systemInstruction, temperature = 0.2, language = "en", inlineFile }) {
  if (isMockMode()) return { ok: false, mock: true, error: "no-key" };

  try {
    const genAI = getGenAI();
    const parts = [{ text: prompt }];
    if (inlineFile && inlineFile.data) {
      parts.push({ inlineData: { mimeType: inlineFile.mimeType, data: inlineFile.data } });
    }

    const response = await genAI.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts }],
      config: {
        systemInstruction: `${systemInstruction}${SAFETY_GUIDANCE}${languageInstruction(language)}`,
        temperature,
        responseMimeType: "application/json",
      },
    });

    const data = parseJsonReply(response.text);
    if (!data) return { ok: false, error: "invalid-json", raw: response.text };
    return { ok: true, data };
  } catch (err) {
    // Message only — a provider error can echo the prompt back.
    return { ok: false, error: String(err.message || "ai-error").slice(0, 200) };
  }
}

/** One plain-text round-trip to Gemini (used by the health translator). */
async function generateText({ prompt, systemInstruction, temperature = 0.2, language = "en" }) {
  if (isMockMode()) return { ok: false, mock: true, error: "no-key" };

  try {
    const genAI = getGenAI();
    const response = await genAI.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `${systemInstruction}${SAFETY_GUIDANCE}${languageInstruction(language)}`,
        temperature,
      },
    });
    const text = (response.text || "").trim();
    if (!text) return { ok: false, error: "empty-reply" };
    return { ok: true, text };
  } catch (err) {
    return { ok: false, error: String(err.message || "ai-error").slice(0, 200) };
  }
}

module.exports = {
  AI_LANGUAGES,
  LANGUAGE_NAME,
  MAX_INPUT_CHARS,
  SAFETY_GUIDANCE,
  capText,
  generateJson,
  generateText,
  isMockMode,
  languageInstruction,
  normalizeLanguage,
  parseJsonReply,
};
