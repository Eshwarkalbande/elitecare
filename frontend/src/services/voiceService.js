/**
 * Phase 2B — voice-command phrases for the existing Voice Assistant.
 *
 * The assistant already had two behaviours: route a symptom query to
 * /ai/symptoms and everything else to /ai/chat, and speak the answer back.
 * These tables add (a) the locale for the Web Speech APIs and (b) a small,
 * honest phrase table for the three navigation intents the app already
 * supports through its navbar.
 *
 * Matching is deliberately simple and local: a phrase has to appear in the
 * transcript. Nothing is sent anywhere to decide this, and a miss simply means
 * the utterance goes to the AI as it always did. There is no "fuzzy" guessing
 * of a command the user did not say.
 */

/** Web Speech locale per language code — the same values i18n/index.js uses. */
export const SPEECH_LOCALE = { en: "en-IN", hi: "hi-IN", mr: "mr-IN" };

/**
 * The three intents the app can already perform, per language.
 * `tab` must be a value that already exists in App.jsx's ALL_PAGES.
 */
export const VOICE_COMMANDS = [
  {
    id: "find-doctor",
    tab: "Find the Doctor",
    phrases: {
      en: ["find a doctor", "book a doctor", "find doctor", "book an appointment", "i need a doctor", "see a doctor"],
      hi: ["डॉक्टर खोजें", "डॉक्टर बुक करें", "अपॉइंटमेंट बुक करें", "डॉक्टर चाहिए"],
      mr: ["डॉक्टर शोधा", "डॉक्टर बुक करा", "अपॉइंटमेंट बुक करा", "डॉक्टर हवा"],
    },
  },
  {
    id: "appointments",
    tab: "Patient Dashboard",
    phrases: {
      en: ["my appointments", "show my appointments", "appointment list", "my visits"],
      hi: ["मेरी अपॉइंटमेंट", "मेरे अपॉइंटमेंट दिखाएं", "अपॉइंटमेंट सूची"],
      mr: ["माझी अपॉइंटमेंट", "माझ्या अपॉइंटमेंट दाखवा", "अपॉइंटमेंट यादी"],
    },
  },
  {
    id: "hospitals",
    tab: "Nearby Hospitals",
    phrases: {
      en: ["nearby hospitals", "find a hospital", "hospitals near me", "nearest hospital"],
      hi: ["नज़दीकी अस्पताल", "अस्पताल खोजें", "मेरे पास अस्पताल"],
      mr: ["जवळचे रुग्णालय", "रुग्णालय शोधा", "माझ्या जवळचे रुग्णालय"],
    },
  },
];

/**
 * Returns the command a transcript matches, or null.
 * @param {string} transcript what the user said
 * @param {string} language   "en" | "hi" | "mr"
 * @returns {{id:string, tab:string}|null}
 */
export function matchVoiceCommand(transcript, language) {
  const text = String(transcript || "").toLowerCase().trim();
  if (!text) return null;
  const lang = SPEECH_LOCALE[language] ? language : "en";

  for (const command of VOICE_COMMANDS) {
    const phrases = command.phrases[lang] || command.phrases.en;
    if (phrases.some((phrase) => text.includes(phrase.toLowerCase()))) {
      return { id: command.id, tab: command.tab };
    }
  }
  return null;
}

/** Shown under the quick-trigger buttons so the phrases are discoverable. */
export const SAMPLE_VOICE_TRIGGERS = {
  en: [
    "I have severe chest pain that spreads to my arm and shortness of breath.",
    "Check safe dosage for Metformin with lisinopril and are there side effects?",
    "Recommend a specialist doctor for chronic joint pain and leg swelling.",
    "What is the recommended diet plan for managing high blood pressure?",
  ],
  hi: [
    "मुझे बुखार है।",
    "मेरे सिर में दर्द है।",
    "मेरी पीठ में दर्द है।",
    "मुझे सांस लेने में तकलीफ हो रही है।",
  ],
  mr: [
    "मला ताप आहे.",
    "माझ्या डोक्यात दुखणे आहे.",
    "माझ्या पाठ्यात दुखणे आहे.",
    "मला श्वास घेणे कठीण वाटत आहे.",
  ],
};

/** The two navigation phrases, per language, offered as one-tap chips. */
export const VOICE_COMMAND_CHIPS = {
  en: [
    { label: "Find a doctor", text: "find a doctor" },
    { label: "My appointments", text: "my appointments" },
    { label: "Nearby hospitals", text: "nearby hospitals" },
  ],
  hi: [
    { label: "डॉक्टर खोजें", text: "डॉक्टर खोजें" },
    { label: "मेरी अपॉइंटमेंट", text: "मेरी अपॉइंटमेंट" },
    { label: "नज़दीकी अस्पताल", text: "नज़दीकी अस्पताल" },
  ],
  mr: [
    { label: "डॉक्टर शोधा", text: "डॉक्टर शोधा" },
    { label: "माझी अपॉइंटमेंट", text: "माझी अपॉइंटमेंट" },
    { label: "जवळचे रुग्णालय", text: "जवळचे रुग्णालय" },
  ],
};
