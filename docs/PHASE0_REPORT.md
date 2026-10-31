# Phase 0 — Foundation: report

Date: 2026-09-29 · Scope: infrastructure + one additive patient-facing entry point. No existing screen, route, table or query was redesigned.

## 1. What was delivered

**Frontend (additive only)**

| File | New/Changed | What it is |
|---|---|---|
| `frontend/src/components/HealthHub.jsx` | new | The Health Hub view: five grouped areas (care, tracking, safety, rewards, devices), each listing only the sections whose flag is on, plus the EN / हिन्दी / मराठी language switcher. Same visual language as the existing panels (emerald/slate, lucide icons), transition inherited from `App.jsx`. |
| `frontend/src/config/features.js` | new | `FEATURES` (frozen) + `isFeatureEnabled()`. `healthHub: true`, every phase 1-6 flag `false`. |
| `frontend/src/i18n/index.js` | new | `useT()` hook, `translate()`, language list, `elitecare_lang` persistence, English fallback for unknown keys. No new dependency. |
| `frontend/src/i18n/en.js` / `hi.js` / `mr.js` | new | Flat string dictionaries **for the new screens only**. |
| `frontend/src/components/PatientDashboard.jsx` | changed (additive) | +1 "Health Hub" card (rendered only when `FEATURES.healthHub`) +1 optional prop `onNavigateToHealthHub`. Nothing else touched. |
| `frontend/src/App.jsx` | changed (additive) | `import HealthHub`, one `activeTab === "Health Hub"` render line guarded by `FEATURES.healthHub`, one prop passed to `PatientDashboard`. Top navigation unchanged. |

**Backend (infrastructure only, no behaviour change)**

| File | New | What it is |
|---|---|---|
| `backend/sql/migrate.js` | new | Zero-dependency forward-only migration runner. `npm run db:migrate` / `--status` / `--dry-run`. Per-file transaction, checksum recorded, drift aborts, never edits `schema_migrations` history. |
| `backend/sql/migrations/001_foundation_indexes.sql` | new | `schema_migrations` bookkeeping table + 6 indexes that `schema_postgres.sql` did not create (medical_records, prescriptions, prescription_items, notifications, appointments ×2). Empty by design — no new feature tables yet. |
| `backend/sql/migrations/README.md` | new | Naming rules + template for future migrations. |
| `backend/services/notify.js` | new | One `deliver({ userId, title, message, provider })` + 4 providers (`inapp` persists, `console` log-only, `twilio`/`msg91` skeletons that throw instead of faking a send). |
| `backend/services/scheduler.js` | new | `node-cron` runner (every minute, `Asia/Kolkata`) + `registerJob()` registry, **0 jobs registered**. |
| `backend/scripts/smoke-test.js` | new | `npm run test:smoke` — 22 read-only regression checks. |
| `backend/package.json` | changed | + `db:migrate`, `db:status`, `test:smoke` scripts. |
| `backend/.env.example` | changed | + reminder/notification + scheduler block (see §3). |
| `backend/server.js` | changed (2 lines) | Starts the scheduler after the port opens; logs provider + job count on boot. |

**Docs**: `SETUP_GUIDE.md` (migrations, Health Hub, regression check, 3 new troubleshooting rows), `backend/README.md` (scripts table, migrations, scheduler, notify), `frontend/README.md` (Health Hub + i18n), `docs/INTEGRATIONS.md` (what Phase 6C deliberately does **not** build).

## 2. Bug found and fixed by the regression test

`GET /api/patients/prescriptions` returned **400 `invalid input syntax for type integer`** for any patient with at least one prescription: `patientController.js` used the mysql2 array-expansion trick `WHERE prescription_id IN (?)` with `[ids]`, which the pg driver receives as a single array parameter (`22P02`). Fixed by flattening one placeholder per id (`IN (?, ?, …)`) — no response-shape change. Verified: 200 with 1 prescription and its 2 medicines.

## 3. New environment variables (`backend/.env.example`)

All optional with safe defaults; nothing breaks if `.env` is unchanged.

| Var | Default | Notes |
|---|---|---|
| `REMINDER_PROVIDER` | `console` | `console` \| `inapp` \| `twilio` \| `msg91`. Default never sends SMS. |
| `SCHEDULER_ENABLED` | `true` | Set `false` on every replica but one. |
| `SCHEDULER_TIMEZONE` | `Asia/Kolkata` | Cron timezone. |
| `SCHEDULER_DEBUG` | `false` | One log line per tick. |
| `NOTIFY_LOG_BODY` | `false` | Prints message bodies in dev logs; ignored when `NODE_ENV=production` (bodies contain health data). |
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_FROM_NUMBER` | empty | Adapter skeleton. |
| `MSG91_AUTH_KEY` / `MSG91_SENDER_ID` / `MSG91_TEMPLATE_ID` | empty | Adapter skeleton. |
| `SMOKE_BASE_URL` / `SMOKE_ACCOUNTS` | derived | Only for `npm run test:smoke`. |

## 4. How to verify it yourself

```bash
# backend — from ./backend
npm run db:migrate        # applies 001_foundation_indexes.sql once, then no-ops
npm run db:status         # 📋 schema_migrations — 1 applied, 1 file(s) on disk
npm start                 # ⏱ Scheduler started (every minute, Asia/Kolkata) — 0 job(s) registered.
npm run test:smoke        # 22 checks, all PASS, exit code 0

# frontend — from ./frontend
npm run build             # ✓ built in ~17s
npm run dev               # login john.doe@example.com / patient123 → Patient Dashboard → Health Hub card
```

Exact SQL to confirm the indexes landed:

```sql
SELECT indexname FROM pg_indexes
WHERE tablename IN ('medical_records','prescriptions','prescription_items','notifications','appointments')
ORDER BY tablename, indexname;

SELECT name, applied_at FROM schema_migrations ORDER BY name;
SELECT COUNT(*) AS notifications FROM notifications;   -- 0 until a phase writes one
```

`test:smoke` covers: health; login as patient/doctor/admin; wrong password → 401; missing fields → 400; `GET /auth/me` with and without a token; patient profile / medical history / prescriptions; a patient asking for **another** patient's id (still gets only their own rows); doctor without `patientId` → 400; doctor on an unknown patient → 403; doctor on own patient → 200; `/admin/stats` unauthenticated → 401, patient/doctor token → 403, admin → 200; patient on a doctor route → 403; public doctor directory → 200; unknown route → 404.



## 5. Assumptions & decisions

1. **Notifications default to `console`** (log-only). A build that silently starts sending SMS is worse than one that sends nothing; switching is a single `.env` change.
2. **`twilio` / `msg91` are skeletons** that throw rather than pretend to deliver. No vendor SDK is installed, so nothing can reach a phone from this codebase. Documented in `docs/INTEGRATIONS.md`.
3. **i18n is scoped to the new components.** Existing screens keep their current copy; `useT()` + flat dictionaries cover the hub only (33 keys × EN/HI/MR, all present in all three — checked). Fallbacks: unsupported language → `en`, missing key → the key itself is returned (never a blank string), choice persists in `localStorage.elitecare_lang`.
4. **Feature flags, not routes.** Phase 0 adds one view reachable from the dashboard card, because the plan is one entry point per new section; no router library was introduced (the app is single-file state-driven `activeTab`).
5. **Migrations coexist with `schema_postgres.sql`.** New installs run `db:init` (full schema); existing databases run `db:migrate`. The 6 indexes are in both, so both paths end up identical. `IF NOT EXISTS` everywhere keeps that safe.
6. **No new npm dependency** anywhere (frontend or backend), so `npm install` output is unchanged.

## 6. Known limitations (deliberate, not bugs)

- The scheduler has **0 registered jobs** — Phase 1B (`medicineReminders`) registers the first one. With multiple backend replicas, keep `SCHEDULER_ENABLED=true` on only one process.
- `notifications` is created but nothing writes to it yet; the in-app bell UI arrives with Phase 1B.
- `FEATURES.preConsultSummary` exists but has no hub card yet — Phase 1C adds it to the "care" group along with its view. The hub's five groups today surface `labReportExplainer`, `medicineReminders`, `healthTracker`, `emergencySos`, `emergencyCard`, `rewardsLedger`, `wearables`.
- Flipping a phase flag to `true` before that phase ships makes its card appear and then land on an empty view (`App.jsx` has no such view yet). Flip flags together with the phase that implements them.
- No version control in this folder (`Test-Path .git` → `False`). Worth running `git init` before Phase 1 so the phase boundaries are auditable.

## 7. Ready for Phase 1

Phase 1A (Lab Report Explainer) needs: `sql/migrations/002_lab_reports.sql` (new tables only), an `explain` controller reusing the existing `/api/ai/*` pattern (mock mode when `GEMINI_API_KEY` is blank), `FEATURES.labReportExplainer = true`, one `App.jsx` view line, and the hub card that already points at `flag: "labReportExplainer"`. The same four insertion points — **migration → controller/route → feature flag → hub card** — are what Phases 1B and 1C will use.
