/**
 * Phase 2C — Health Translator.
 *
 * Backed by the existing POST /api/ai/translate route. Three rules the screen
 * keeps:
 *   * the 1,000 character cap is the BACKEND's limit, so the counter and the
 *     disabled Translate button follow it exactly rather than guessing;
 *   * a mock result (no GEMINI_API_KEY) is always labelled, never shown as a
 *     real translation;
 *   * nothing is sent anywhere until the patient presses Translate.
 *
 * The microphone and Listen buttons use the Web Speech API and are hidden
 * entirely when the browser does not support them — no dead controls.
 */
import React, { useEffect, useRef, useState } from "react";
import { Languages, Mic, MicOff, Volume2, ArrowLeftRight, Copy, Check, Sparkles } from "lucide-react";
import useT from "../i18n";
import {
  HubSection,
  HubCard,
  HubButton,
  HubNote,
  HubMotion,
  Spinner,
  ErrorBanner,
  Field,
  inputClass,
  Pill,
} from "./hub/HubUI";
import { translateText, QUICK_TRANSLATION_PHRASES } from "../services/aiService";

const MAX_CHARS = 1000; // backend: body("text").isLength({ max: 1000 })
const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "mr", label: "Marathi" },
];

/** SpeechRecognition / speechSynthesis locale per language code. */
const SPEECH_LOCALE = { en: "en-IN", hi: "hi-IN", mr: "mr-IN" };

// Feature-detected at module load so the buttons are simply not rendered when
// the browser has no Web Speech support — no permanently broken control.
const SpeechRecognitionCtor =
  typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

export default function HealthTranslator({ onBack }) {
  const { t, language } = useT();

  const [from, setFrom] = useState(language);
  const [to, setTo] = useState(language === "en" ? "hi" : "en");
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [listening, setListening] = useState(false);
  const [copied, setCopied] = useState(false);

  const recognitionRef = useRef(null);
  const canListen = Boolean(SpeechRecognitionCtor);
  const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;

  // Keep the selector in step with the header picker, and never let it end up
  // with from === to, which the backend rejects.
  useEffect(() => {
    setFrom(language);
    setTo((current) => (current === language ? (language === "en" ? "hi" : "en") : current));
  }, [language]);

  // Stop the microphone and any speech on unmount.
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop?.();
      if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  function swap() {
    setFrom(to);
    setTo(from);
    setResult(null);
    setError(null);
  }

  async function run() {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    if (trimmed.length > MAX_CHARS) {
      setError(t("tr.error.tooLong", "Please keep this to 1000 characters or fewer."));
      return;
    }
    if (from === to) {
      setError(t("tr.error.same", "Choose two different languages."));
      return;
    }

    setBusy(true);
    setError(null);
    setResult(null);
    try {
      setResult(await translateText({ text: trimmed, from, to }));
    } catch (err) {
      setError(err?.response?.data?.error || t("tr.error.failed", "The translation could not be completed."));
    } finally {
      setBusy(false);
    }
  }

  function toggleListening() {
    if (listening) {
      recognitionRef.current?.stop?.();
      return;
    }
    try {
      const rec = new SpeechRecognitionCtor();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = SPEECH_LOCALE[from] || "en-IN";
      rec.onstart = () => setListening(true);
      rec.onend = () => setListening(false);
      rec.onerror = () => {
        setListening(false);
        setError(t("tr.error.voice", "Microphone access was refused or is unavailable."));
      };
      rec.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setText((current) => `${current}${current ? " " : ""}${transcript}`.slice(0, MAX_CHARS));
        }
      };
      recognitionRef.current = rec;
      rec.start();
    } catch {
      setListening(false);
      setError(t("tr.error.voice", "Microphone access was refused or is unavailable."));
    }
  }

  function speak() {
    if (!result?.translation || !canSpeak) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(result.translation);
    utterance.lang = SPEECH_LOCALE[to] || "en-IN";
    window.speechSynthesis.speak(utterance);
  }

  const tooLong = text.length > MAX_CHARS;
  const canTranslate = text.trim().length > 0 && !tooLong && from !== to && !busy;

  return (
    <HubSection
      badge={t("tr.badge", "Phase 2C")}
      title={t("tr.title", "Health Translator")}
      subtitle={t("tr.subtitle", "Translate a short medical sentence between English, Hindi and Marathi.")}
      onBack={onBack}
    >
      <HubMotion className="space-y-5">
        {error && <ErrorBanner>{error}</ErrorBanner>}

        <HubCard
          title={t("tr.pick", "Choose the languages")}
          icon={Languages}
          right={
            <HubButton variant="ghost" size="sm" onClick={swap} aria-label={t("tr.swap", "Swap languages")}>
              <ArrowLeftRight size={12} /> {t("tr.swap", "Swap")}
            </HubButton>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
            <Field label={t("tr.from", "From")}>
              <select
                id="tr-from"
                name="from"
                className={inputClass}
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                aria-label={t("tr.from", "From")}
              >
                {LANGS.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </Field>

            <button
              type="button"
              onClick={swap}
              aria-label={t("tr.swap", "Swap languages")}
              className="size-9 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-emerald-700 hover:border-emerald-300 transition flex items-center justify-center cursor-pointer self-end mb-0.5"
            >
              <ArrowLeftRight size={14} />
            </button>

            <Field label={t("tr.to", "To")}>
              <select
                id="tr-to"
                name="to"
                className={inputClass}
                value={to}
                onChange={(e) => setTo(e.target.value)}
                aria-label={t("tr.to", "To")}
              >
                {LANGS.map((lang) => (
                  <option key={lang.code} value={lang.code} disabled={lang.code === from}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          {from === to && <HubNote tone="warn">{t("tr.error.same", "Choose two different languages.")}</HubNote>}
        </HubCard>

        <HubCard
          title={t("tr.input", "What do you want to say?")}
          description={t("tr.inputDesc", "Up to 1,000 characters. Nothing is sent until you press Translate.")}
          icon={Languages}
        >
          <div className="space-y-3">
            <textarea
              id="tr-text"
              name="text"
              className={`${inputClass} min-h-28 resize-y`}
              placeholder={t("tr.placeholder", "For example: I have a fever and a headache.")}
              value={text}
              onChange={(event) => setText(event.target.value.slice(0, MAX_CHARS))}
              aria-label={t("tr.input", "What do you want to say?")}
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className={`text-[10px] font-sans ${tooLong ? "text-rose-600 font-bold" : "text-slate-400"}`}>
                {t("tr.counter", "{used} of {max} characters", { used: text.length, max: MAX_CHARS })}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {canListen && (
                  <HubButton variant="secondary" size="sm" onClick={toggleListening} disabled={busy}>
                    {listening ? <MicOff size={12} /> : <Mic size={12} />}
                    {listening ? t("tr.stopListening", "Stop") : t("tr.listen", "Speak")}
                  </HubButton>
                )}
                <HubButton onClick={run} disabled={!canTranslate}>
                  {busy ? <Spinner size={13} /> : <Languages size={13} />}
                  {t("tr.go", "Translate")}
                </HubButton>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                {t("tr.quick", "Common phrases")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_TRANSLATION_PHRASES.map((phrase) => (
                  <button
                    key={phrase}
                    type="button"
                    onClick={() => {
                      setText(phrase);
                      setResult(null);
                    }}
                    className="px-2.5 py-1.5 rounded-xl text-[10px] font-sans border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700 transition cursor-pointer"
                  >
                    {phrase}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </HubCard>


        {busy && <Spinner label={t("tr.working", "Translating…")} />}

        {result && (
          <HubCard
            title={t("tr.result", "Translation")}
            icon={Sparkles}
            right={
              <div className="flex items-center gap-1.5">
                {result.isMock && <Pill tone="amber">{t("tr.mock", "simulated")}</Pill>}
                {canSpeak && (
                  <HubButton variant="ghost" size="sm" onClick={speak} aria-label={t("tr.listenOut", "Listen")}>
                    <Volume2 size={12} />
                  </HubButton>
                )}
                <HubButton
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard?.writeText(result.translation || "");
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  aria-label={t("tr.copy", "Copy translation")}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                </HubButton>
              </div>
            }
          >
            <p className="text-xs font-sans leading-relaxed text-slate-800 whitespace-pre-wrap">
              {result.translation || t("tr.empty", "The service returned no translation.")}
            </p>
            {result.note && <HubNote tone="warn">{result.note}</HubNote>}
          </HubCard>
        )}

        <HubNote tone="warn">
          {t(
            "tr.disclaimer",
            "Machine translation can be wrong. Confirm anything important with a clinician or a human interpreter before you act on it."
          )}
        </HubNote>
      </HubMotion>
    </HubSection>
  );
}
