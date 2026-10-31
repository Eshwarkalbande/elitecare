# Phase 1 — Care (Lab Report Explainer, Reminders, Pre-consult Summary)

**Status: complete and verified.** Migrations applied, backend boots, frontend
builds, and `npm run test:smoke:full` passes every check (regression + write
paths, all cleaned up afterwards).

---

## What was built

| Piece | Where | Flag |
|---|---|---|
| Lab Report Explainer | `backend/controllers/aiToolsController.js`, `labReportController.js` · `frontend/src/components/LabReportExplainer.jsx` | `labReportExplainer` |
| Prescription → Reminders | `backend/controllers/reminderController.js`, `services/reminderParser.js`, `services/reminders.js` · `frontend/src/components/MedicineReminders.jsx` | `medicineReminders` |
| Pre-consult summary (doctor) | `backend/controllers/preConsultController.js` · `frontend/src/components/hub/PreConsultSummary.jsx` | `preConsultSummary` |
| AI consent switch (patient) | `frontend/src/components/hub/AiConsentSetting.jsx` | `preConsultSummary` |
| App-wide language button | `frontend/src/components/hub/LanguageButton.jsx` | `appLanguage` |

Supporting infrastructure: `services/access.js` (ownership), `services/aiClient.js`
(shared AI plumbing), `services/patientContext.js` (clinical context), `services/audit.js`,
`middleware/validate.js`, and migrations `002_phase1_care.sql` through `007_phase6_automation.sql`.

---

## The safety promises, and where each one is enforced

These are the rules the phase was designed around. Each is enforced on the
server **and** mirrored in the UI, so the user can see the rule rather than
being asked to trust it.

**1. Nothing is stored unless the patient asks for it.**
`POST /api/ai/lab-report` holds the upload in memory only. A summary is written
to `lab_reports` only via `POST /api/patients/lab-reports`, which the UI reaches
through a separate "Save summary" tap.

**2. A reminder is never active until the patient confirms real times.**
`createReminder` sets `active = (confirm === true && times.length > 0)`, and
`updateReminder` refuses `active: true` while the times array is empty — an
active reminder with no time would silently never fire.
*Test:* `POST /patients/reminders` without times returns `active: false`; `PATCH`
with `active: true` and no times returns **400**.

**3. The doctor's dose text is copied, never rewritten.**
`reminderParser.proposeSchedule` only proposes `times[]`; `dose_text` is the
doctor's own `dosage` / `frequency` string. When the parser is not confident it
returns `confident: false` with an **empty** times array rather than a guess.

**4. AI summaries are off by default and the no-consent path never calls a provider.**
`patient_profiles.ai_summary_consent` defaults to `FALSE`. The pre-consult
handler checks it on every read: consent off → a deterministic server-side
template is built and **no AI call is made at all**; consent on but no
`GEMINI_API_KEY` → the same template, with a note saying why.
*Test:* `source` comes back as `template` and `aiConsent: false` for the demo patient.

**5. Consent is required before a report leaves the server.**
`explainLabReport` rejects the request with 400 when `consent` is not `true`.
*Test:* `POST /ai/lab-report` without consent → **400**.

**6. Only real files are accepted.**
The MIME type from the client is not trusted; the first bytes are checked
(`sniffMagicBytes`) for JPEG, PNG and PDF.
*Test:* a `.pdf` file containing plain text → **400**.

**7. Sharing is limited to a doctor you actually have a visit with.**
`shareLabReport` verifies an `appointments` row links the patient to that doctor,
and the in-app notification it sends contains no clinical detail at all.
*Test:* share with an unrelated `doctorId` → **403**.

**8. A doctor can only brief their own appointment.**
`getPreConsultSummary` resolves `doctor_profiles.id` from the JWT — never from a
parameter — and returns 404 for anyone else's appointment.
*Test:* a patient token → **403**; a doctor asking for appointment 999999 → **404**.

**9. Mock mode is always labelled.**
With no `GEMINI_API_KEY`, every AI response carries `isMock: true` and a
"simulated" label. The app never presents a canned answer as a real reading.

**10. Delivered ≠ attempted.**
`services/notify.js` only reports `delivered: true` when a transport actually
accepted the message. The `twilio` and `msg91` adapters are skeletons that
**throw** rather than pretend, so a reminder can never be marked `sent` on the

---

## Endpoints added

```
POST   /api/ai/lab-report                (multipart, consent required, 5 MB cap)
POST   /api/ai/translate                { text <= 1000, from, to }
GET    /api/patients/lab-reports
POST   /api/patients/lab-reports
POST   /api/patients/lab-reports/:id/share
DELETE /api/patients/lab-reports/:id

GET    /api/patients/reminders
GET    /api/patients/reminders/adherence?days=7
POST   /api/patients/reminders/propose
POST   /api/patients/reminders
PATCH  /api/patients/reminders/:id
DELETE /api/patients/reminders/:id
POST   /api/patients/reminders/:id/events/:eventId

GET    /api/doctors/appointments/:id/pre-consult-summary?refresh=true
```

All patient routes accept an optional `familyMemberId` (Phase 2) which is
checked through `services/access.js`; a member you do not own is a hard **403**,
never a silent empty result.

---

## Reminder dispatch

`backend/services/reminders.js` is registered as a scheduler job
(`registerJob("medicine-reminders", …)`, one tick a minute, `Asia/Kolkata`).

- **Idempotent by construction.** `reminder_events` has a unique index on
  `(reminder_id, scheduled_at)`, and the insert is `ON CONFLICT DO NOTHING`, so a
  restart mid-tick can never double-send.
- **A dose older than 15 minutes is recorded as `missed`**, never delivered late.
- **A sent dose the patient never actioned becomes `missed`** after 4 hours.
- **Adherence only counts what was actually sent**, so a future dose the
  scheduler has not reached yet is not shown as a miss.

Disable the whole job with `SCHEDULER_ENABLED=false`.

---

## Data model

`002_phase1_care.sql` — all additive (`CREATE TABLE IF NOT EXISTS` /
`ADD COLUMN IF NOT EXISTS`), safe to re-run, nothing dropped or rewritten:

- `lab_reports` — only **saved** summaries
- `medicine_reminders` — `active BOOLEAN NOT NULL DEFAULT FALSE`
- `reminder_events` — the idempotency key is the unique index
- `pre_consult_summaries` — one cached brief per appointment
- `patient_profiles.ai_summary_consent BOOLEAN NOT NULL DEFAULT FALSE`

A fresh `npm run db:init` and a database upgraded with `npm run db:migrate` end
up identical: `initDb.js` applies the very same migration files rather than
carrying a second copy of the DDL.

---

## Running it

```bash
cd backend
npm run db:migrate      # 002-007, additive and idempotent
npm run db:check        # which phase tables exist + a row count
npm start               # terminal 1
npm run test:smoke      # terminal 2 — regression + safety checks
npm run test:smoke:full # terminal 2 — also the create/update/delete paths
```

`test:smoke:full` writes to the database and **deletes every row it created**,
including switching the emergency card on and off again. `npm run db:check`
finishes with a line confirming no emergency card is left enabled.

---

## What is deliberately *not* here

- **No SMS or WhatsApp delivery.** The adapters exist but throw; nothing claims
  a message was sent. Add real credentials and an SDK before enabling them.
- **No lab-report OCR of its own.** Without a Gemini key the explainer shows a
  clearly-labelled *simulated* answer so the shape of the feature is visible.
  It never claims to have read a report it did not read.
- **Insurance and pharmacy are documented, not built** — see `docs/INTEGRATIONS.md`.
- **The pre-consult brief does not diagnose.** Both the server prompt and the
  doctor-facing panel say so, and the source (`template` vs `gemini`) is always
  displayed so the doctor knows what they are reading.

