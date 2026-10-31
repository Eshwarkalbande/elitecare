/**
 * Tiny i18n layer for the Health Hub screens (Phase 0) and the app-wide
 * language switch (Phase 2B).
 *
 *   const { t, language, setLanguage, languages } = useT();
 *   t("hub.title")                       -> "Health Hub"
 *   t("hub.sectionCount", { count: 3 })   -> "3 tools"
 *   t("nav.dashboard", "Dashboard")       -> "डैशबोर्ड" / "Dashboard"
 *
 * The second argument is overloaded on purpose:
 *   * a `string` -> the ORIGINAL ENGLISH copy, used whenever no translation
 *                   exists. This is what makes the rollout safe: an untranslated
 *                   key renders the exact original string — never a blank label
 *                   and never a raw key.
 *   * an `object` -> `{placeholder}` values (the pre-existing phase-0 usage).
 *
 * Deliberately dependency-free (no i18next).
 *
 * Phase 2B makes the selected language APP-WIDE: `useT()` reads a tiny external
 * store (useSyncExternalStore), so the globe button in the header and every
 * screen that calls `t()` switch together. The stored value keeps living under
 * the same `elitecare_lang` localStorage key.
 */
import { useCallback, useMemo, useSyncExternalStore } from "react";
import en from "./en";
import hi from "./hi";
import mr from "./mr";

export const DICTIONARIES = { en, hi, mr };

/** Supported UI languages, with the SpeechRecognition / speechSynthesis locale. */
export const LANGUAGES = [
  { code: "en", label: "English", nativeLabel: "English", speech: "en-IN" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", speech: "hi-IN" },
  { code: "mr", label: "Marathi", nativeLabel: "मराठी", speech: "mr-IN" },
];

export const DEFAULT_LANGUAGE = "en";
export const LANGUAGE_STORAGE_KEY = "elitecare_lang";

export function isSupportedLanguage(code) {
  return Object.prototype.hasOwnProperty.call(DICTIONARIES, String(code || ""));
}

/** Reads the saved language, falling back to English for anything unknown. */
export function getInitialLanguage() {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isSupportedLanguage(saved) ? saved : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

// ---------------------------------------------------------------------------
// App-wide language store (Phase 2B)
// ---------------------------------------------------------------------------
let currentLanguage = getInitialLanguage();
const listeners = new Set();

export function getLanguage() {
  return currentLanguage;
}

function applyDocumentLanguage(code) {
  try {
    if (typeof document !== "undefined") document.documentElement.lang = code;
  } catch {
    /* no document — the in-memory value still applies */
  }
}

applyDocumentLanguage(currentLanguage);

/** Switches the whole app's language and persists the choice. */
export function setLanguage(code) {
  const next = isSupportedLanguage(code) ? code : DEFAULT_LANGUAGE;
  if (next === currentLanguage) {
    applyDocumentLanguage(next);
    return next;
  }
  currentLanguage = next;
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
  } catch {
    /* storage unavailable (private mode) — language still applies this session */
  }
  applyDocumentLanguage(next);
  for (const listener of listeners) listener();
  return next;
}

function subscribeLanguage(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Resolves a key.
 * @param {string} language
 * @param {string} key
 * @param {string|object} [fallbackOrVars] original English copy, or {vars}
 */
export function translate(language, key, fallbackOrVars) {
  const vars = fallbackOrVars && typeof fallbackOrVars === "object" ? fallbackOrVars : null;
  const englishFallback = typeof fallbackOrVars === "string" ? fallbackOrVars : null;

  const dict = DICTIONARIES[language] || DICTIONARIES[DEFAULT_LANGUAGE];
  let value = dict[key];
  if (value == null) value = DICTIONARIES[DEFAULT_LANGUAGE][key];
  if (value == null) value = englishFallback;
  if (value == null) value = key;

  if (vars && typeof value === "string") {
    for (const [name, replacement] of Object.entries(vars)) {
      value = value.replace(new RegExp(`\\{${name}\\}`, "g"), String(replacement));
    }
  }
  return value;
}

/** For non-component code (services, handlers) — reads the current language. */
export function tGlobal(key, fallbackOrVars) {
  return translate(currentLanguage, key, fallbackOrVars);
}

export function useT() {
  const language = useSyncExternalStore(subscribeLanguage, getLanguage, getLanguage);
  const t = useCallback((key, fallbackOrVars) => translate(language, key, fallbackOrVars), [language]);

  return useMemo(
    () => ({
      t,
      language,
      setLanguage,
      languages: LANGUAGES,
      languageInfo: LANGUAGES.find((l) => l.code === language),
    }),
    [t, language]
  );
}

export default useT;
