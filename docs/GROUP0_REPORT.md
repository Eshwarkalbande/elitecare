# Group 0 — Auth and validation hardening: report

**Status: complete and verified, pausing for review before Group B.**

Everything below was confirmed against the **running** backend and a **real
browser**, not by reading code. Verification (all green):

| Gate | Command | Result |
|---|---|---|
| Group 0 probe | `cd backend && node scripts/probe-group0.js` | **14/14 PASS** (`ALL PROBE CHECKS PASSED`, exit 0) |
| Backend smoke | `cd backend && npm run test:smoke` | **ALL CHECKS PASSED** (exit 0) |
| Backend smoke + writes | `cd backend && npm run test:smoke:full` | **ALL CHECKS PASSED** (exit 0) |
| Live browser + a11y + CSP | `cd frontend && node scripts/browser-check.js` | **ALL BROWSER CHECKS PASSED** (exit 0) |
| Production build | `cd frontend && npm run build` | exit 0, 2193 modules |
| i18n | `npm run check:i18n` | 251/251/251 keys, 0 duplicates, 0 orphans |
| Scope | `node scripts/check-scope.js` | exit 0 |

> Before → after on the browser check: **28 failures → 0**. Every failure was a
> form control with no `id`/`name` (and often no accessible name either).

---

## 1. The DevTools warning in the screenshot: found and fixed

The warning *"A form field element should have an id or name attribute"* came
from **`LoginPage`**. The email and password inputs had **no `id` and no
`name`**, and their `<label>`s sat *next to* the input (siblings), not wrapped
around it, so there was no programmatic label link either:

```jsx
<label>Email or phone number</label>   {/* no htmlFor */}
<div className="relative">
  <input type="email" placeholder="..." />   {/* no id, no name */}
```

Fixed with an explicit `id`, `name` and a matching `htmlFor` on all three login
fields (`login-fullname`, `login-email`, `login-password`).

The checker now reads every control out of the **live DOM** — a static grep
cannot do this, because attributes span lines and control can be built at
runtime — and fails on the two things the Issues panel reports:

- **no `id`/`name`** — "should have an id or name attribute"
- **no accessible name at all** — a screen reader announces it as just "edit text"

That audit is why the count was 28, not 1: the same defect was on **13 files**.

### Files given `id` / `name` (and accessible names where `placeholder` was the only label)

| File | Controls |
|---|---|
| `LoginPage.jsx` | login-fullname, login-email, login-password |
| `App.jsx` | global-search |
| `AdminDashboard.jsx` | heatmap-page, heatmap-device, admin-panel-search |
| `DoctorDashboard.jsx` | doc-task-text, doc-task-tag, doctor-panel-search |
| `DoctorFinder.jsx` | doctor-search |
| `HealthTranslator.jsx` | tr-from, tr-to, tr-text |
| `LabReportExplainer.jsx` | lab-language, lab-report-file, lab-consent |
| `LabTests.jsx` | lab-test-search |
| `MedicineScanner.jsx` | medicine-search, medicine-custom-name, medicine-notes |
| `NearbyHospitals.jsx` | hospital-radius |
| `PatientDashboard.jsx` | sleep-hours, new-health-target |
| `SymptomChecker.jsx` | symptom-details |
| `hub/EmergencyCard.jsx` | ecard-field-&lt;key&gt; (×6), ecard-public-link |

Verified live: every audited screen now reports `all named`, e.g.
`patient: Medicine Scanner: 5 form control(s), all named`.

---

## 2. The second DevTools issue (CSP blocks `eval`) is NOT ours

I could not reproduce it, and I believe the code is innocent. Evidence:

| Probe | Result |
|---|---|
| `eval(` / `new Function` in `frontend/src` and `backend/{controllers,services,routes,middleware,utils}` | **zero occurrences** |
| `document header` seen by the browser | `(none set by this app)` |
| CSP violations logged on **every** screen (all 3 roles, all 11 hub cards) | `violations: none` |
| CSP `<meta>` in `dist/index.html` | none |
| `_headers` / `netlify.toml` / `vercel.json` / `nginx.conf` / `.htaccess` | none exist |

The only CSP header in the project is from `app.use(helmet())` in
`backend/server.js`, and helmet v8's default is `script-src 'self'` with **no
`unsafe-eval`** — which matches the wording in the screenshot exactly. But the
backend is **API-only**: there is no `express.static`, and every non-API path
falls through to `notFound`. Helmet's CSP therefore only ever reaches JSON error
responses from `/api/*`, never our HTML.

So the CSP in that screenshot is being injected by something outside the repo —
most likely a **sandboxed preview proxy** (they block `unsafe-eval` and
`unsafe-inline` to contain user code sharing the origin) or a browser extension
/ stale service worker in the local profile.

**What I need from you to close this one:** expand the issue in DevTools →
Issues → CSP and paste (a) the blocked script URL and (b) the `Content-Security-Policy`
header value. If it is a preview proxy, the correct fix is not to loosen the app
but to ensure the app needs no `eval` — which the grep above already confirms it
does not. If it *is* ours, that value will point straight at the file.

`browser-check.js` now records the document's CSP header and every CSP violation
on every run, so if it ever reappears it will name the blocked URL here.

---

## 3. Backend Group 0

### 3.1 Strict calendar dates (the `2026-02-31` bug)

`new Date("2026-02-31")` is **not** invalid — JavaScript rolls it over to
`2026-03-03`. A plain `isDate()` therefore accepted an impossible date and stored
one the user never typed.

`backend/middleware/validate.js` now owns one strict validator, exported for all
routes: `isRealCalendarDate` (round-trips `YYYY-MM-DD` parts so `2026-02-31`,
`2025-02-29` and `2026-13-01` are rejected while `2024-02-29` passes),
`dateRule` / `dateValidator` / `optionalDateValidator`, and `todayUtc` for the
no-future-date comparison.

`backend/routes/patientRoutes.js` had its own **duplicate** copies; they are gone
and it now imports the shared ones. Verified: `2026-02-31` → 400
`recordDate must be a real calendar date (YYYY-MM-DD), for example 2026-01-31.`

### 3.2 Wearables had drifted — found during this work

`backend/routes/wearableRoutes.js` still carried its own **pre-fix** copy of the
validator, so `POST /api/wearables/samples` happily stored `2026-02-31`. That is
the exact bug the shared validator exists to prevent, and it survived the fix
because the duplication was never removed there. It now imports the shared
validator, and the probe asserts it:

```
PASS  wearables impossible recordedAt 2026-02-31 -> 400
PASS  wearables malformed recordedAt -> 400
PASS  wearables future recordedAt -> 400
PASS  metrics impossible recordedAt 2026-02-31 -> 400
```

### 3.3 Doctor registration no longer 500s

`authController.js` read `dpResult[0].id` from an `INSERT`, but the pg
compatibility shim in `config/db.js` returns a **single object** (the RETURNING
row), not a mysql2-style row array — so indexing `[0]` was `undefined` and threw,
500-ing the whole registration. Now `RETURNING id` is read directly, and a
`pending` row is created in `doctor_verifications`; `/auth/me` reports
`verificationStatus`, and the reply says *"Your verification is pending admin
approval."*

### 3.4 Also in this change set

- `server.js` — rate limits are env-overridable (`RATE_LIMIT_LOGIN_MAX`, …),
  defaults unchanged (10/15 min auth, 30/15 min AI).
- `.env.example` — documents the rate-limit and `DOCTOR_ACCESS_WINDOW_DAYS` vars.
- `.gitignore` (both) — `.env`, logs, `_temp` artifacts, `dist/`, `node_modules/`.

---

## 4. Fixes to the checker itself (three silent-failure bugs)

1. **It was pointing at an origin the API refuses.** `APP` defaulted to
   `http://127.0.0.1:5178` while `CORS_ORIGIN=http://localhost:5173`. Every
   sign-in failed with *"check your connection to the server"*, and it failed
   **silently**: `cors` answers the OPTIONS preflight and ends the response
   without calling `next()`, so `morgan` never logged the request and the backend
   looked idle. Default is now `http://localhost:5173`, with the reason in a comment.
2. **CSP violations were discarded.** The `Log.entryAdded` handler skipped any
   entry whose `source !== "javascript"`, so the very issue in the screenshot
   could never be caught by this tool. They are now collected and reported.
3. **A crashed login page reported `PASS`.** Only `visit()` checked the
   `ErrorBoundary`, so the login screen passed on a mere character count — which
   is how a dead Vite server looked like an app bug ("162 chars"). The login
   screen now checks the boundary, the console, and dumps url/page text/inputs
   when it cannot fill the form.

Also: `SKIP`ped screens are now counted and summarised, so an unreachable screen
Also: `SKIP`ped screens are now counted and summarised, so an unreachable screen

---

## 5. Known gaps — deliberately NOT fixed, need your call

These are real and I left them visible rather than quietly widening the diff.

### 5.1 Nine screens are not covered at all

The driver clicks nav items **by label**, and these labels are not clickable text
in the current UI, so they are `SKIP`ped:

| Role | Skipped |
|---|---|
| patient | Lab Report Explainer, Medicine Reminders, Emergency Health Card, AI Consent, Voice Assistance, Quick Symptom Log |
| physician | Voice Assistance |
| admin | Home, Voice Assistance |

Their a11y is therefore **unverified**. Most are reached anyway through the hub
cards (Lab Report Explainer, Medicine Reminders, Emergency Health Card and
Health Translator all passed via the hub). Genuinely unverified: **AI Consent,
Voice Assistance, Quick Symptom Log**, and the admin **Home** screen. Fixing
this means correcting the `TABS` labels to the real nav text.

### 5.2 The accessibility backlog is bigger than the screenshot

A case-**sensitive** static scan (a case-insensitive one matches `className=`
and silently under-reports by ~95%) puts a **lower bound of ~206 control lines
across ~45 components** that carry no explicit `id`/`name`. I fixed the ones the
live driver reached, because those are what a user actually meets, and left the
rest for a deliberate sweep. The new audit will catch them as the walk grows.

Two patterns worth a decision for Group B:
- Many inputs use `placeholder` as their only label. Visible to sighted users,
  invisible to screen readers. I added explicit names on the reached ones.
- `HubUI`'s `Field` renders `<label>` wrapping its children, which *does* give an
  accessible name — so `Field`-based controls are fine and were not churned.

### 5.3 `vite-plugin-pwa` is installed but not wired

It is a devDependency, yet `vite.config.ts` registers only `react()` and
`tailwindcss()`. The PWA is not built. Relevant to Group D, and worth confirming
it is deliberate.

### 5.4 Git: the repo root is your home directory

`git rev-parse --show-toplevel` resolves to `C:\Users\Admin`; `ELITECARE` is
merely a nested folder. So `git add .` from the root would stage your entire
profile. I staged **explicit paths only**. `docs/PHASE0_REPORT.md` claims "No
version control in this folder" — that is now stale and should be updated.

---

## 6. Manual test steps

```bash
cd backend  && npm start                       # terminal 1
cd frontend && npm run dev                      # terminal 2
```

```bash
cd backend  && node scripts/probe-group0.js     # 14/14
cd backend  && npm run test:smoke:full          # ALL CHECKS PASSED
cd frontend && node scripts/browser-check.js    # ALL BROWSER CHECKS PASSED
```

1. **Login screen** — open DevTools → Issues. The "form field should have an id
   or name" warning is gone. Tab through the form: email, password are announced
   by their label, not as "edit text".
2. **Hub cards** — sign in as a patient, open Health Hub → Lab Report Explainer.
   The language select, the file picker and the consent checkbox are all named.
3. **Sliders** — Patient Dashboard sleep slider and Nearby Hospitals radius
   slider announce "Sleep hours per night" / "Search radius in kilometres".
4. **Bad dates** — `POST /api/wearables/samples` with `recordedAt: "2026-02-31"`
   now returns 400, not a stored 2026-03-03 reading.

> **Rate limiting:** `/auth/login` allows 10 requests per 15 minutes per IP.
> Repeated full runs from one machine exhaust the in-memory bucket and produce
> 429s. Restart the backend to clear it (it is in-process, not in the database),
> or raise `RATE_LIMIT_LOGIN_MAX` in `backend/.env`.

---

## 7. Assumptions and judgement calls

1. **I fixed the reported warning, not all 206 lines.** A mechanical sweep across
   ~45 components would have buried a security-relevant change under attribute
   noise. The live audit now makes the remainder impossible to forget.
2. **`aria-label` over new visible labels** for the reached controls, matching the
   existing convention in `HealthTranslator` and `ConsentToggle`, and avoiding
   layout changes in a group whose scope is auth/validation.
3. **I did not add `unsafe-eval` anywhere.** No `eval`/`new Function` exists in
   this codebase, so loosening a CSP would buy nothing and weaken the header that
   does apply to the API.
4. **The probe stays read-only.** The four new date assertions all expect 400, so
   nothing is written; the throwaway doctor is still deleted in cleanup.
5. **Rate-limit defaults unchanged.** Only the env overrides were added.

---

## 8. Ready for review — paused here, not starting Group B

Two things I would like a decision on before Group B:

1. **The CSP issue** — needs the blocked URL + header value from your DevTools,
   because it is not reproducible from this repo (§2).
2. **Scope of the a11y sweep** — the ~206-line backlog (§5.2). Group B is a
   natural place for it, or it can be its own pass with the audit as the gate.
