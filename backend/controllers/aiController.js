const { GoogleGenAI } = require("@google/genai");

let ai = null;
function getGenAI() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) console.warn("WARN: GEMINI_API_KEY is not set — AI endpoints will run in mock mode.");
    ai = new GoogleGenAI({ apiKey: apiKey || "MOCK_KEY", httpOptions: { headers: { "User-Agent": "elitecare-backend" } } });
  }
  return ai;
}

// Hard cap on any free-text field that reaches Gemini, to bound prompt size and cost.
const MAX_INPUT_CHARS = 2000;

/**
 * Phase 2B — the app-wide language the user picked in the header.
 *
 * The client sends `language` on every AI call; this is the one place that turns
 * it into an instruction. It is appended to the system prompt and changes
 * NOTHING about the response shape, the safety rules, the input cap or the
 * English behaviour: an absent or unknown value yields "" and the prompts stay
 * byte-for-byte what they were.
 *
 * (The matching helpers live in services/aiClient.js, which imports THIS file —
 * so they are declared here and re-exported from there, to keep the dependency
 * pointing one way.)
 */
const AI_LANGUAGES = ["en", "hi", "mr"];
const LANGUAGE_NAME = { en: "English", hi: "Hindi (हिन्दी)", mr: "Marathi (मराठी)" };

function normalizeLanguage(value, fallback = "en") {
  const code = String(value || "").trim().toLowerCase();
  return AI_LANGUAGES.includes(code) ? code : fallback;
}

/** "respond in Hindi (हिन्दी)" — appended to the system instruction. */
function languageInstruction(language) {
  const code = normalizeLanguage(language);
  if (code === "en") return "";
  return `\n- Write every human-readable string in ${LANGUAGE_NAME[code]}. Keep medicine names, numbers, units and reference ranges exactly as written in the source.`;
}

/**
 * @param {object} [req] express request — reads req.body.language
 * @param {string} base the existing system instruction
 */
function withLanguage(req, base) {
  const code = normalizeLanguage(req && req.body ? req.body.language : undefined);
  return code === "en" ? base : `${base}${languageInstruction(code)}`;
}

function isTooLong(value) {
  return typeof value === "string" && value.length > MAX_INPUT_CHARS;
}

// Appended to every system instruction so the model behaves like a triage aid,
// never a clinician. Keeps the emergency signposting consistent across features.
const SAFETY_GUIDANCE = `

SAFETY RULES (must always be followed):
- You are an AI assistant, not a doctor, and you are not a licensed clinician.
- Never give a definitive diagnosis and never prescribe an exact dosage or treatment regimen. Recommend that the user consult a qualified clinician for diagnosis and dosing.
- If the user describes chest pain, trouble breathing, stroke signs (facial droop, arm weakness, speech difficulty, sudden confusion or severe headache), severe or uncontrolled bleeding, or any thoughts of self-harm or harming themselves, tell them to call their local emergency services immediately, and encourage them to stay with someone until help arrives.
- End every response with a single short line reminding the user to consult a licensed clinician.`;

// POST /api/ai/symptoms
async function symptomChecker(req, res, next) {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Symptom message is required." });
    if (isTooLong(message)) {
      return res.status(400).json({ error: `message must be ${MAX_INPUT_CHARS} characters or fewer.` });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        reply: `This is a simulated response (no GEMINI_API_KEY configured) regarding: "${message}". Please consult a doctor if symptoms are severe.`,
        department: "General Practitioner",
        urgency: "Medium",
        isMock: true,
      });
    }

    const genAI = getGenAI();
    const response = await genAI.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction: withLanguage(req, `You are EliteCare's AI Medical Symptom Checker. Give a warm, professional assessment with: possible causes, a recommended department (Cardiologist, Neurologist, Dermatologist, Pediatrician, Orthopedic, Gynecologist, or General Practitioner), guidance, urgency (Low/Medium/High), and a medical disclaimer.${SAFETY_GUIDANCE}`),
        temperature: 0.7,
      },
    });
    const replyText = response.text || "Unable to formulate a response. Please rephrase your symptoms.";
    const lower = replyText.toLowerCase();
    let department = "General Practitioner";
    if (lower.includes("cardio") || lower.includes("heart")) department = "Cardiologist";
    else if (lower.includes("neuro") || lower.includes("brain")) department = "Neurologist";
    else if (lower.includes("derm") || lower.includes("skin")) department = "Dermatologist";
    else if (lower.includes("pediatr") || lower.includes("child")) department = "Pediatrician";
    else if (lower.includes("ortho") || lower.includes("bone") || lower.includes("joint")) department = "Orthopedic";
    else if (lower.includes("gyne") || lower.includes("pregnancy")) department = "Gynecologist";

    let urgency = "Medium";
    if (lower.includes("urgent") || lower.includes("emergency")) urgency = "High";
    else if (lower.includes("mild") || lower.includes("home care")) urgency = "Low";

    res.json({ reply: replyText, department, urgency });
  } catch (err) {
    next(err);
  }
}

// POST /api/ai/scan-med
// Accepts EITHER a single medicine ("medicineName") OR multiple ("medicineNames": [...]).
// Kept backward compatible so any existing frontend code calling with medicineName still works.
async function medicineScanner(req, res, next) {
  try {
    const { medicineName, medicineNames, notes } = req.body;

    // Build a clean array of medicine names regardless of which field was sent.
    let namesList = [];
    if (Array.isArray(medicineNames) && medicineNames.length > 0) {
      namesList = medicineNames.map((n) => String(n).trim()).filter(Boolean);
    } else if (medicineName) {
      namesList = [String(medicineName).trim()];
    }

    if (namesList.length === 0) {
      return res.status(400).json({ error: "Provide medicineName (string) or medicineNames (array)." });
    }

    if (isTooLong(notes) || namesList.some(isTooLong)) {
      return res.status(400).json({ error: `Medicine names and notes must be ${MAX_INPUT_CHARS} characters or fewer.` });
    }

    // Limit how many can be scanned in one go, to keep responses fast and prompts sane.
    const MAX_MEDS = 5;
    if (namesList.length > MAX_MEDS) {
      return res.status(400).json({ error: `You can scan up to ${MAX_MEDS} medicines at once.` });
    }

    if (!process.env.GEMINI_API_KEY) {
      const mockSections = namesList
        .map((name) => `### ${name} — Simulated Analysis\nNo GEMINI_API_KEY configured. Refer to packaging or a pharmacist for accurate dosage and safety info.`)
        .join("\n\n---\n\n");
      return res.json({ analysis: mockSections, medicines: namesList, isMock: true });
    }

    const genAI = getGenAI();
    const medsListForPrompt = namesList.map((n, i) => `${i + 1}. ${n}`).join("\n");

    const response = await genAI.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Provide a structured medical analysis for the following medicine(s):\n${medsListForPrompt}\n\nExtra notes / question from the user: "${notes || "none"}".\n\nFor EACH medicine, use a top-level markdown heading with the medicine's name (e.g. "# Paracetamol"), then include: classification, uses, dosage, side effects, warnings, and reminders in markdown. Separate each medicine's section clearly with "---".`,
      config: { systemInstruction: withLanguage(req, `You are an EliteCare Pharmacist Consultant.${SAFETY_GUIDANCE}`), temperature: 0 },
    });

    res.json({
      analysis: response.text || "No medication metadata generated.",
      medicines: namesList,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/ai/health-advice
// Generates personalized guidance for a chronic condition, factoring in the patient's
// profile (age, existing conditions, allergies, etc.) if it is provided by the frontend.
async function healthAdvice(req, res, next) {
  try {
    const { diseaseName, symptoms, patientProfile, notes } = req.body;

    if (!diseaseName) {
      return res.status(400).json({ error: "diseaseName is required." });
    }

    if (isTooLong(diseaseName) || isTooLong(notes)) {
      return res.status(400).json({ error: `diseaseName and notes must be ${MAX_INPUT_CHARS} characters or fewer.` });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        advice: `### Personalized Guidance for ${diseaseName} — Simulated\nNo GEMINI_API_KEY configured. Please consult your physician for tailored advice regarding ${diseaseName}.`,
        isMock: true,
      });
    }

    const symptomsText = Array.isArray(symptoms) && symptoms.length > 0
      ? symptoms.join(", ")
      : "not specified";

    // Only include profile fields that were actually provided, so the prompt stays clean
    // even if patientProfile is missing or partially filled in.
    let profileText = "No specific patient profile provided.";
    if (patientProfile && typeof patientProfile === "object") {
      const parts = [];
      if (patientProfile.age) parts.push(`Age: ${patientProfile.age}`);
      if (patientProfile.gender) parts.push(`Gender: ${patientProfile.gender}`);
      if (patientProfile.existingConditions) parts.push(`Existing conditions: ${patientProfile.existingConditions}`);
      if (patientProfile.allergies) parts.push(`Allergies: ${patientProfile.allergies}`);
      if (patientProfile.medications) parts.push(`Current medications: ${patientProfile.medications}`);
      if (parts.length > 0) profileText = parts.join("\n");
    }

    const genAI = getGenAI();
    const response = await genAI.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Provide personalized health management guidance for a patient managing: "${diseaseName}".

Known warning signs/symptoms for this condition: ${symptomsText}

Patient profile:
${profileText}

Extra notes from the patient: "${notes || "none"}"

Tailor the advice to this specific patient's profile where relevant (e.g. flag any conflicts with their existing conditions, allergies, or medications). Structure the response in markdown with sections for: Personalized Recommendations, Things to Watch Out For (specific to this patient), Suggested Daily Habits, and a medical disclaimer.`,
      config: { systemInstruction: withLanguage(req, `You are an EliteCare Health Coach specializing in chronic disease management.${SAFETY_GUIDANCE}`), temperature: 0.3 },
    });

    res.json({ advice: response.text || "No personalized guidance could be generated." });
  } catch (err) {
    next(err);
  }
}

// POST /api/ai/chat
async function chatAssistant(req, res, next) {
  try {
    const { message, chatHistory } = req.body;
    if (!message) return res.status(400).json({ error: "message is required." });
    if (isTooLong(message)) {
      return res.status(400).json({ error: `message must be ${MAX_INPUT_CHARS} characters or fewer.` });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ reply: `I'm here to help with your EliteCare portal! (Simulated reply to: "${message}")`, isMock: true });
    }

    const genAI = getGenAI();
    const contents = [];
    if (Array.isArray(chatHistory)) {
      for (const turn of chatHistory.slice(-6)) {
        contents.push({ role: turn.role === "user" ? "user" : "model", parts: [{ text: turn.text }] });
      }
    }
    contents.push({ role: "user", parts: [{ text: message }] });

    const response = await genAI.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: { systemInstruction: withLanguage(req, `You are EliteCare's Interactive Health Assistant.${SAFETY_GUIDANCE}`), temperature: 0.5 },
    });
    res.json({ reply: response.text || "Let's try rephrasing that." });
  } catch (err) {
    next(err);
  }
}

// Shared AI plumbing is exported so the later phase controllers
// (lab report, health translator, pre-consult summary) reuse THIS setup
// instead of duplicating the client, the safety rules or the input cap.
module.exports = {
  symptomChecker,
  medicineScanner,
  chatAssistant,
  healthAdvice,
  getGenAI,
  SAFETY_GUIDANCE,
  MAX_INPUT_CHARS,
  isTooLong,
  // Phase 2B — declared here (see the note above) and re-exported by
  // services/aiClient.js, so there is only ever one implementation.
  AI_LANGUAGES,
  LANGUAGE_NAME,
  normalizeLanguage,
  languageInstruction,
  withLanguage,
};