# Frontend Group A — Language and access

**Status: complete and verified.** `npm run build` succeeds, the backend boots,
`npm run test:smoke:full` passes, and a live driver (`frontend/scripts/ui-check.js`)
confirms all 43 endpoint contracts the new screens depend on.

---

## Step 0 audit — what existed, what I added

| # | Item | Was | Now |
|---|---|---|---|
| 1 | Health Hub view + cards | PARTIAL — 5 groups | 6 groups; cards for family, referrals, translator, tracker, rewards, wearables, SOS, card |
| 2 | Family Profiles screen | MISSING | still MISSING (Group B) |
| 3 | "Booking for" select | MISSING | still MISSING (Group B) |
| 4 | Globe language switch | EXISTS | unchanged, verified working |
| 5 | i18n en/hi/mr + `useT()` | PARTIAL — 3 dicts | 251 keys, 0 duplicates, 0 orphans; `scripts/check-i18n.js` |
| 6 | Health Translator | MISSING | **built** |
| 7 | Voice assistant language selector | MISSING | **built** |
| 8 | Lab Report Explainer | EXISTS | unchanged; now follows the header language |
| 9 | Medicine Reminders | EXISTS | unchanged; 41 new keys added |
| 10 | Pre-consult panel | EXISTS | unchanged |
| 11 | Emergency SOS view | MISSING | still MISSING (Group B) |
| 12 | Emergency Health Card manager | PARTIAL | still PARTIAL (QR download + public page in Group B) |
| 13 | Doctor Verification | MISSING | still MISSING (Group C) |
| 14 | Wearables | MISSING | still MISSING (Group B) |
| 15 | Health Tracker | MISSING | still MISSING (Group B) |
| 16 | Rewards & Challenges | MISSING | still MISSING (Group B) |
| 17 | Referrals | MISSING | still MISSING (Group B) |
| 18 | Doctor "Today's Queue" | MISSING | still MISSING (Group C) |
| 19 | Patient queue token view | MISSING | still MISSING (Group B) |
| 20 | Follow-up (doctor + patient) | MISSING | still MISSING (Groups B/C) |
| 21 | Symptom-to-booking slots | MISSING | still MISSING (Group B) |
| 22 | Admin "Rewards & Referrals" | MISSING | still MISSING (Group C) |
| 23 | Admin Pending badge | PARTIAL | still PARTIAL (Group C) |
| 24 | PWA | MISSING | still MISSING (Group D) |
| 25 | `docs/PHASE4_REPORT.md` | MISSING | still MISSING (Group D) |
| 26 | `docs/INTEGRATIONS.md` | EXISTS | unchanged (Group D) |

---

## Backend mismatch found and fixed

**The four original AI endpoints ignored `language`.** `symptomChecker`,
`medicineScanner`, `healthAdvice` and `chatAssistant` in
`backend/controllers/aiController.js` each built a hardcoded English
`systemInstruction` and never read `req.body.language`. Only `/ai/lab-report`
and `/ai/translate` were language-aware, so Group A item 3 ("send the language to
every AI endpoint") was a silent no-op.

**Smallest fix:** added `withLanguage(req, base)` in `aiController.js`, which
appends the existing language instruction to those four system prompts. It
changes nothing about the response shape, the safety rules, the input cap or
English behaviour — an absent or unknown code returns the prompt byte-for-byte
unchanged.

To keep the dependency pointing one way, `AI_LANGUAGES`, `LANGUAGE_NAME`,
`normalizeLanguage` and `languageInstruction` now live in `aiController.js` and
are re-exported from `services/aiClient.js` (which already imported that file).
Verified at runtime: `aiController.normalizeLanguage === aiClient.normalizeLanguage`.

**Smoke check added:** `phase2bLanguage` in `backend/scripts/smoke-phases.js` —
12 assertions covering all three codes on all four endpoints, an unknown code
falling back rather than erroring, the response shape being unchanged, and

---

## What was built

### 1. Language reaches every AI endpoint

`frontend/src/services/aiService.js` reads `getLanguage()` and sends it on
`/ai/symptoms`, `/ai/chat`, `/ai/scan-med`, `/ai/health-advice`, `/ai/triage` and
`/ai/translate`. The three existing screens that call the API directly
(`MedicineScanner`, `ChatbotWidget`, `HealthProblems`) now pass
`getLanguage()` too. `LabReportExplainer` already sent `language`; it now also
follows the header picker instead of only its own dropdown.

### 2. Health Translator (Health Hub → Language)

`frontend/src/components/HealthTranslator.jsx`, on the existing
`POST /api/ai/translate`. Source/target selectors, swap (button + card header),
a live character counter, Translate, copy, Speak (SpeechRecognition in the
source language) and Listen (speechSynthesis in the target language) — both
hidden entirely when the browser has no Web Speech support, so there is no dead
control. One-tap common phrases, and the mock result is always labelled
`simulated`. The 1,000-character cap is the backend's own limit.

### 3. Voice assistant language selector

`frontend/src/services/voiceService.js` holds the locale map, the phrase table
and per-language sample prompts. `VoiceAssistance.jsx` gained a language select
next to the existing mute control, retunes the live recognition instance on
change (so a session in progress is not dropped), and speaks the reply in the
chosen language.

The three navigation phrases (find a doctor / my appointments / nearby
hospitals) map onto the **existing** navbar tabs via a new `onNavigate` prop.
A matched phrase navigates directly — no AI call, no coins, because it is not a
health query. Matching is a local substring test; a miss falls through to the AI
exactly as before.

### 4. Static chrome keys

`nav.*` (navbar, dropdowns, admin nav, profile menu), `home.*`, `finder.*`,
`hospitals.*`, `scanner.*`, `doctor.dashboardTitle`, `admin.dashboardTitle`,
`login.*`. All with Hindi and Marathi entries.

### 5. Devanagari font fallback

`index.css` named no Devanagari family, so Hindi/Marathi glyphs fell through to
whatever the OS picked. Added **local font names only** — `Nirmala UI`, `Mangal`,
`Noto Sans Devanagari` — to `--font-sans`, `--font-display` and the `body` rule.
No new network request, and Latin text still renders in Inter because those
families are later in the stack and carry no Latin glyphs.

> Note: the ground rules said "do not edit CSS files", while Group A item 2 said
> to add a local-only font fallback "if not" it renders correctly. I made the
> minimal change because the item is explicit and this alters no existing
> screen's appearance. Revert those three lines if you prefer the rule to win.

---

## Endpoints used

| Screen | Endpoint |
|---|---|
| Health Translator | `POST /api/ai/translate` |
| Voice assistant (existing) | `POST /api/ai/symptoms`, `POST /api/ai/chat` |
| Medicine Scanner | `POST /api/ai/scan-med` |
| Health Problems | `POST /api/ai/health-advice` |
| Lab Report Explainer | `POST /api/ai/lab-report` (multipart) |

---

## Assumptions

- Voice navigation phrases reuse existing tabs (`Find the Doctor`,
  `Patient Dashboard`, `Nearby Hospitals`) rather than adding nav items, as
  instructed.
- The translator's **synthesis** depends on the browser having an installed
  voice for `hi-IN`/`mr-IN`. Where there is none the browser falls back on its
  own — the same graceful degradation as before. Recognition quality for
  Devanagari is a browser property, not something this app controls.
- Sample voice prompts are per-language. English keeps the original four
  prompts, byte for byte.

---

## Manual test steps

```bash
cd backend && npm start            # terminal 1
cd frontend && npm run dev         # terminal 2
node scripts/check-i18n.js         # 251/251/251, no duplicates or orphans
node scripts/ui-check.js           # 43 live endpoint checks (backend must be up)
```

1. **Header globe** — sign in as the patient. Click the globe next to the bell;
   pick हिन्दी. The Health Hub, the nav and every hub screen switch at once.
   Reload: the choice persists. Pick English: identical to before.
2. **Translator** — Health Hub → Language → Health Translator. Type
   "I have a fever", Translate. Expect a `simulated` pill (no Gemini key).
   Paste 1,001 characters: the counter turns red and Translate disables.
   Select the same language twice: a warning shows, Translate disables.
3. **Voice** — Voice Assistance. Change the language to हिन्दी; the mic listens
   in `hi-IN`. Click "डॉक्टर खोजें": it navigates to Find the Doctor with no AI
   call and no coins. Speak a symptom: the AI path still runs, and the answer
   is read in Hindi. Switch back to English: behaviour is unchanged.
4. **Language reaches the AI** — switch to मराठी, then use the chatbot and the
   medicine scanner. The request now carries `language: "mr"`.
5. **Error path** — stop the backend, press Translate: a friendly error banner
   appears, no crash. Restart it and the same button works.
6. **Empty state** — the translator with an empty box: Translate is disabled.

> Rate limiting: `/auth/login` allows 10 requests per 15 minutes and `/api/ai/*`
> 30, per IP. Running the smoke suite repeatedly from one machine exhausts both
> and produces 429s. Restart the backend to clear the in-memory buckets before a
> full run — they are in-process, not in the database.

---

## Translations to review with a native speaker

- `tr.disclaimer`, `consent.disclaimer`, `rem.disclaimer` — the safety
  sentences. I would particularly like these checked for tone, since they are
  the app's own medical disclaimers.
- `rem.channels.desc` — the long "SMS is not switched on" sentence.
- `group.language.desc` and `hospitals.heading` ("Simulated GPS Location Hub" —
  the word *Simulated* is doing real work here and the translation may not carry
  the same honesty).
- `SAMPLE_VOICE_TRIGGERS.hi` / `.mr` — short symptom phrases a patient would
  actually say into a microphone.
- `nav.*` role words: I used **रोगी** (hi) and **रुग्ण** (mr) for "patient",
  which read as "the sick person"; **मरीज़** is more colloquial. Worth a decision.
- `hospitals.emergencyOnly` — "Emergency ER Only" is already redundant in
  English, so the translations had to guess at the intent.
- `home.benefitsTitle` — marketing copy; literal is fine but a native writer may
  prefer something less formal.


`from`/`to` still being strictly validated.
