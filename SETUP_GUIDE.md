# EliteCare — Full Setup Guide

This project is split into two independent folders:

```
EliteCare/
  backend/    Node.js + Express + PostgreSQL REST API  (port 5000)
  frontend/   React + Vite web app                    (port 5173)
```

The frontend talks to the backend purely over HTTP (`VITE_API_URL`), so you can deploy, scale, or restart each one independently.

---

## Step 1 — Install PostgreSQL

**Windows:** download & run the installer from https://www.postgresql.org/download/windows/ (choose "PostgreSQL Server"). Remember the superuser password you set. The default port is **5432**.

**macOS:**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

Verify it's running:
```bash
psql --version
```

---

## Step 2 — Create the database and a dedicated user

Log in as the `postgres` superuser:
```bash
psql -U postgres
```

Then run:
```sql
CREATE DATABASE elitecare_db;
CREATE USER elitecare_user WITH PASSWORD 'change_this_password';
GRANT ALL PRIVILEGES ON DATABASE elitecare_db TO elitecare_user;
\q
```

> Use a strong password in place of `change_this_password` — you'll put it in `backend/.env` next.

---

## Step 3 — Configure and start the backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:
```env
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=elitecare_user
DB_PASSWORD=change_this_password
DB_NAME=elitecare_db
JWT_SECRET=some_long_random_string_here
```
(Generate a good `JWT_SECRET` with `openssl rand -hex 32`. It must be at least 32 characters and must not contain words like "change", "secret", "your" or "example" — the server refuses to start in production if it does.)

Everything under **"Reminders & notifications (Health Hub)"** in `backend/.env.example` is optional for local development — the defaults are safe (`REMINDER_PROVIDER=console` logs instead of sending SMS, `SCHEDULER_ENABLED=true` starts the idle job runner, `NOTIFY_LOG_BODY=false` keeps health data out of the logs). Copy those keys into `.env` when you want them, or just re-copy the whole example file.

Create the tables and seed demo data (one command — creates all 11 tables + demo login accounts):
```bash
npm run db:init
```

Then apply the migrations (indexes + `schema_migrations` bookkeeping table — safe to re-run any time, it is a no-op when nothing is pending):
```bash
npm run db:migrate    # apply pending sql/migrations/*.sql
npm run db:status     # show applied / pending migrations without writing anything
```

You should see:
```
✅ Schema created / verified.
✅ Demo users ready: [ ... ]
🎉 Database seed complete. Demo logins:
   Patient -> john.doe@example.com / patient123
   Doctor  -> doctor@elitecare.com / doctor123
   Admin   -> admin@elitecare.com / admin123
```

and from the migration step:
```
📋 schema_migrations — 0 applied, 1 file(s) on disk
▶ 1 pending migration(s): 001_foundation_indexes.sql
✅ applied 001_foundation_indexes.sql (41ms)
🎉 Migrations complete — 1 version(s) recorded in schema_migrations.
```

> These demo passwords are for **local development only** — never load this seed data into a deployed database.

Start the API server:
```bash
npm run dev
```
It runs at **http://localhost:5000**. Check it's alive: open http://localhost:5000/api/health in a browser — you should see `{"status":"ok", ...}`.

---

## Step 4 — Configure and start the frontend

Open a **second terminal**:
```bash
cd frontend
npm install
cp .env.example .env
```
`frontend/.env` should point at the backend (default is already correct for local dev):
```env
VITE_API_URL=http://localhost:5000/api
```

Start it:
```bash
npm run dev
```
Open **http://localhost:5173** in your browser.

---

## Step 5 — Log in

Use the "Quick Access Profiles" buttons on the login screen, or type the credentials manually:

| Role | Email | Password |
|---|---|---|
| Patient | john.doe@example.com | patient123 |
| Doctor | doctor@elitecare.com | doctor123 |
| Admin | admin@elitecare.com | admin123 |

Once logged in as the patient, open **Patient Dashboard** and scroll down — you'll see the new **Medical History** and **Prescription History** panels pulling live data from PostgreSQL (a sample record and prescription are seeded so it isn't empty on first run).

---

## Verifying the database directly (optional)

```bash
psql -U elitecare_user -d elitecare_db
\dt
SELECT * FROM users;
SELECT * FROM medical_records;
SELECT * FROM prescriptions;
```

---

## Inspecting the API with curl (optional)

```bash
# Login and grab a token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@example.com","password":"patient123"}'

# Use the returned token to call a protected route
curl http://localhost:5000/api/patients/medical-history \
  -H "Authorization: Bearer <PASTE_TOKEN_HERE>"
```

---

## What's already wired to real APIs

- Login & Registration (both dashboards route based on the role returned by the backend)
- Patient Dashboard: appointments, **Medical History**, **Prescription History**
- Full REST API exists for Doctor & Admin dashboards (`backend/README.md` has the full route table) — connecting each remaining panel is a matter of swapping its mock `useState` for a `useEffect` call into `frontend/src/services/doctorService.js` / `adminService.js`, following the same pattern already used in `PatientDashboard.jsx`.

## Health Hub (Phase 0 foundation)

The patient dashboard now has a **Health Hub** card that opens one in-app hub (`frontend/src/components/HealthHub.jsx`, opened with `setActiveTab("Health Hub")` — the top navigation bar is unchanged). It groups the upcoming sections — Lab Report Explainer, Medicine Reminders, Pre-Consult Summary, Wearables — and each one is switched **off** by default in `frontend/src/config/features.js`:

```js
export const FEATURES = Object.freeze({
  healthHub: true,            // master switch for the hub card + view
  labReportExplainer: false,  // flip to true when that section ships (Phase 1A)
  medicineReminders: false,   // Phase 1B
  preConsultSummary: false,   // Phase 1C
  wearables: false,           // Phase 6
  // …plus one boolean per later phase — all false today
});
```

- Flag `false` → that section is not listed anywhere; its group card shows a small "switched off for now" note, so the hub grows phase by phase instead of rendering half-built screens.
- Flag `true` → the section appears inside the hub as a button that calls `onNavigate(feature.tab)`. Only flip a flag once the matching view exists in `App.jsx`, otherwise the click lands on an empty view.
- `healthHub: false` → hides the dashboard card *and* the view (App.jsx guards the render with `FEATURES.healthHub`).

No existing screen, route or data call was changed — the hub is additive.

The hub is also the only place so far with an in-app language switcher (English / हिन्दी / मराठी). Those strings live in `frontend/src/i18n/{en,hi,mr}.js` and are read with the small `useT()` hook from `frontend/src/i18n/index.js`; every existing screen keeps its current translation setup.

Already wired on the backend, ready for Phase 1: `sql/migrations/` + `npm run db:migrate`, `services/notify.js` (one `deliver({ userId, title, message, provider })` behind the `inapp` / `console` / `twilio` / `msg91` adapters) and `services/scheduler.js` (cron runner, currently idle — 0 registered jobs).

### Regression check

```bash
cd backend
npm start              # terminal 1 — logs "⏱ Scheduler started …" on boot
npm run test:smoke     # terminal 2 — 22 read-only checks
```

The smoke test covers login (all three roles), wrong-password and missing-field handling, `401` on missing tokens, `403` on role violations, the doctor "own patients only" rule, the patient "self only" rule, and the 404 handler. It only issues GETs plus failed logins, so it never writes clinical data.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `npm run db:migrate` stops with a *checksum mismatch / drift* error | An already-applied file in `sql/migrations/` was edited after being applied. Restore that file to the exact content it had when it was applied (it is also mirrored in `sql/schema_postgres.sql`) and put the new change in a **new** numbered migration. |
| Health Hub card missing from the Patient Dashboard | `FEATURES.healthHub` is `false` in `frontend/src/config/features.js`, or you are logged in as doctor/admin (the hub is a patient-only section). |
| A Health Hub section says "switched off for now" | Expected: that flag is still `false` in `frontend/src/config/features.js`. Flip it only once the section ships. |
| `❌ PostgreSQL connection failed` on backend start | Check `DB_USER`/`DB_PASSWORD`/`DB_NAME` in `backend/.env`, and that PostgreSQL is running (`sudo systemctl status postgresql` / `brew services list`) |
| Login page shows "Something went wrong… check your connection" | Backend isn't running, or `VITE_API_URL` in `frontend/.env` doesn't match the backend's actual port |
| `password authentication failed for user ...` | Wrong `DB_USER`/`DB_PASSWORD` in `backend/.env`, or the role has no grant on the database — re-run the `CREATE USER` / `GRANT` commands from Step 2 |
| CORS errors in browser console | Make sure `CORS_ORIGIN` in `backend/.env` matches the frontend URL exactly (`http://localhost:5173`) |
