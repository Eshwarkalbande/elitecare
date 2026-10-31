import api from "./api";

/**
 * The app-wide language the user picked in the header (Phase 2B).
 *
 * `getLanguage()` is a plain read of the i18n store, so importing it here is safe
 * (i18n/index.js has no dependency on any service). Every AI call below sends
 * the current language, which the four original endpoints fold into their system
 * prompt and /ai/lab-report and /ai/translate use directly.
 */
import { getLanguage } from "../i18n";

// POST /ai/symptoms -> { reply, department, urgency, isMock? }
export const checkSymptoms = (message) =>
  api.post("/ai/symptoms", { message, language: getLanguage() }).then((r) => r.data);

// POST /ai/chat -> { reply, isMock? }
export const sendChatMessage = (message, chatHistory = []) =>
  api.post("/ai/chat", { message, chatHistory, language: getLanguage() }).then((r) => r.data);

// POST /ai/scan-med -> { analysis, medicines, isMock? }
export const scanMedicines = (payload) =>
  api.post("/ai/scan-med", { ...payload, language: getLanguage() }).then((r) => r.data);

// POST /ai/health-advice -> { advice, isMock? }
export const getHealthAdvice = (payload) =>
  api.post("/ai/health-advice", { ...payload, language: getLanguage() }).then((r) => r.data);

// POST /ai/triage -> { matches, doctors, note }  (Phase 6A: read-only, books nothing)
export const triageSymptoms = (symptoms) =>
  api.post("/ai/triage", { symptoms, language: getLanguage() }).then((r) => r.data);

// POST /ai/translate -> { translation, from, to, isMock, source, note }
// `from`/`to` are what this endpoint actually uses; the limit is 1000 characters.
export const translateText = ({ text, from, to }) =>
  api.post("/ai/translate", { text, from, to, language: getLanguage() }).then((r) => r.data);

/** The quick phrases the backend serves locally in mock mode. */
export const QUICK_TRANSLATION_PHRASES = [
  "i have a fever",
  "i am allergic to penicillin",
  "where does it hurt?",
];
