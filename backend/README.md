# EliteCare — Backend

Node.js + Express + PostgreSQL REST API. JWT auth, role-based access (`patient`, `doctor`, `admin`).

## Setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set DB_USER / DB_PASSWORD / DB_NAME / JWT_SECRET (DB_PORT is 5432)
npm run db:init      # creates tables + seeds demo accounts (see below)
npm run db:migrate   # applies sql/migrations/*.sql (safe to re-run, idempotent)
npm run dev          # starts on http://localhost:5000
```

### npm scripts

| Script | What it does |
|---|---|
| `npm start` | Run the API (`node server.js`). |
| `npm run dev` | Same, with nodemon auto-restart. |
| `npm run db:init` | Run `sql/schema_postgres.sql` (CREATE TABLE IF NOT EXISTS) + seed demo data. |
| `npm run db:migrate` | Apply any pending `sql/migrations/*.sql` in filename order. |
| `npm run db:status` | List applied / pending migrations (no writes). |
| `npm run test:smoke` | Read-only regression test against a **running** server — `npm start` in one terminal, then this in another. |

See the root `SETUP_GUIDE.md` for full PostgreSQL install + setup steps.

## Database migrations

`sql/migrate.js` is a tiny forward-only migration runner (no new dependencies):

- Applied files are recorded in the `schema_migrations` table (`name`, `checksum`, `applied_at`).
- Each migration runs inside a transaction, so a half-applied file is rolled back and stays pending.
- Re-running `npm run db:migrate` is a no-op when nothing is pending.
- **Never edit an applied migration** — the runner aborts with a checksum-drift error. Add a new numbered file instead.
- `sql/schema_postgres.sql` (used by `npm run db:init`) is kept in sync with the migrations: every index a migration adds is also in the schema, so new installs and migrated installs end up identical.

Adding a migration:

```bash
# sql/migrations/002_lab_reports.sql  -> write it, then:
npm run db:migrate
```
See `sql/migrations/README.md` for the naming rules and template.

## Background jobs (`services/scheduler.js`)

`startScheduler()` is called from `server.js` after the port opens. It runs **every minute** in `SCHEDULER_TIMEZONE` (default `Asia/Kolkata`) and currently has **0 registered jobs** — the job registry is ready for Phase 1 (medicine reminders, follow-up nudges, queue upkeep).

| Env var | Default | Purpose |
|---|---|---|
| `SCHEDULER_ENABLED` | `true` | `false` turns the whole runner off (use this on replicas that should not fire jobs). |
| `SCHEDULER_TIMEZONE` | `Asia/Kolkata` | Cron timezone. |
| `SCHEDULER_DEBUG` | `false` | Log one line per tick. |

One process per database: with more than one backend replica, set `SCHEDULER_ENABLED=false` on all but one (or move to a proper job queue later).

## Notifications (`services/notify.js`)

One entry point — `deliver(payload)` (exported twice, as `deliver` and `send`). It resolves a transport by name and hands it the payload, so a call site never imports a vendor SDK:

```js
const { deliver } = require("../services/notify");

await deliver({
  userId: 1,                             // required — users.id
  title: "Time for your medicine",       // required — stored truncated to 150 chars
  message: "Paracetamol 500 mg",         // optional — stored truncated to 255 chars
  provider: "inapp",                     // optional; `channel` is accepted as an alias.
});                                      // default = REMINDER_PROVIDER from .env
```

| Provider | Persists? | Behaviour |
|---|---|---|
| `inapp` | yes → `notifications` | The only provider that writes; this is the table the in-app bell will read. |
| `console` (default) | no | Log-only. The message body is withheld unless `NOTIFY_LOG_BODY=true` **and** `NODE_ENV !== "production"`, because reminder text is health data. |
| `twilio` | no | Skeleton. Throws `twilio provider is not configured — set TWILIO_ACCOUNT_SID, … in backend/.env.`, and `… is configured but not implemented in this build …` once the vars exist. |
| `msg91` | no | Same shape as `twilio`, with `MSG91_*` vars. |

Also exported: `resolveProvider(name)`, `listProviders()` (→ `{name, implemented, configured}`), `DEFAULT_PROVIDER`, `PROVIDER_NAMES`. An unknown provider name throws instead of silently falling back.

| Env var | Default |
|---|---|
| `REMINDER_PROVIDER` | `console` |
| `NOTIFY_LOG_BODY` | `false` |
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_FROM_NUMBER` | empty |
| `MSG91_AUTH_KEY` / `MSG91_SENDER_ID` / `MSG91_TEMPLATE_ID` | empty |

## Demo accounts (created by `npm run db:init`)

> **Local development only** — these are publicly known credentials and must not exist in a deployed environment.

| Role | Email | Password |
|---|---|---|
| Patient | john.doe@example.com | patient123 |
| Doctor | doctor@elitecare.com | doctor123 |
| Admin | admin@elitecare.com | admin123 |

## API reference

All routes are prefixed `/api`. Protected routes require header `Authorization: Bearer <token>` (token returned from login/register).

### Auth
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | public | Create account (`fullName`, `email`, `password`, `role?`, `phone?`). `role` may only be `patient` or `doctor`; `admin` is rejected with 403 — admins are created via `POST /admin/users`. |
| POST | `/auth/login` | public | `{ email, password }` → `{ token, user }` |
| GET | `/auth/me` | any logged-in | Current user info |

### Patients
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/patients/profile` | patient (self) / doctor (own patients only) / admin (`?patientId=`) | Profile + medical flags |
| PUT | `/patients/profile` | patient | Update own profile |
| GET | `/patients/appointments` | patient / doctor (own patients) / admin (`?patientId=`) | List appointments |
| POST | `/patients/appointments` | patient | Book appointment |
| PUT | `/patients/appointments/:id/cancel` | patient | Cancel own appointment |
| GET | `/patients/medical-history` | patient / doctor (own patients) / admin (`?patientId=`) | **Medical History** feature |
| POST | `/patients/medical-history` | doctor (own patients), admin | Add a record for a patient |
| GET | `/patients/prescriptions` | patient / doctor (own patients) / admin (`?patientId=`) | **Prescription History** feature |
| POST | `/patients/prescriptions` | doctor (own patients) | Write a prescription (`medicines: [{name, dosage, frequency, duration, instructions}]`) |

### Doctors
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/doctors` | public | List doctors (`?specialization=`) |
| GET | `/doctors/:id` | public | Doctor detail + open slots |
| GET | `/doctors/me/profile` | doctor | Own profile |
| PUT | `/doctors/me/profile` | doctor | Update own profile |
| GET | `/doctors/me/appointments` | doctor | Own appointment list |
| PUT | `/doctors/me/appointments/:id` | doctor | Update status (`Scheduled/Completed/Cancelled`) |
| GET | `/doctors/me/patients` | doctor | Patients this doctor has treated |

### Admin
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/admin/stats` | admin | Dashboard counters |
| GET | `/admin/users` | admin | List users (`?role=&search=`) |
| POST | `/admin/users` | admin | Create a user (any role) |
| PUT | `/admin/users/:id` | admin | Update status/role/name/phone |
| DELETE | `/admin/users/:id` | admin | Delete a user |
| GET | `/admin/appointments` | admin | All appointments (any patient/doctor) |
| GET | `/admin/hospitals` | admin | List hospitals |
| POST | `/admin/hospitals` | admin | Add a hospital |

### Public
| Method | Route | Description |
|---|---|---|
| GET | `/hospitals` | Public hospital list (Nearby Hospitals page) |
| GET | `/health` | Health check |

### AI (Symptom Checker / Medicine Scanner / Chatbot)
| Method | Route | Access |
|---|---|---|
| POST | `/ai/symptoms` | logged-in |
| POST | `/ai/scan-med` | logged-in |
| POST | `/ai/chat` | logged-in |
| POST | `/ai/health-advice` | logged-in |

Runs in mock mode automatically if `GEMINI_API_KEY` is blank in `.env`.

## Project layout

```
backend/
  config/db.js           PostgreSQL connection pool (pg) + mysql2-compat shim
  controllers/           request handlers (business logic + SQL)
  routes/                Express routers, one per resource
  middleware/auth.js     JWT verification + role guard
  middleware/errorHandler.js
  services/notify.js     one sendNotification() -> inapp / console / twilio / msg91
  services/scheduler.js  node-cron runner + job registry (started from server.js)
  scripts/smoke-test.js  read-only regression test (npm run test:smoke)
  sql/schema_postgres.sql  all CREATE TABLE statements (PostgreSQL)
  sql/initDb.js          runs schema_postgres.sql + inserts demo/seed data
  sql/migrate.js         forward-only migration runner (npm run db:migrate)
  sql/migrations/        numbered .sql files applied in order, tracked in schema_migrations
  server.js              app entry point
```

## Verifying it works

```bash
npm start            # terminal 1  (logs "⏱ Scheduler started …" on boot)
npm run test:smoke   # terminal 2  -> 22 checks: auth, ownership, roles, validation
```

The smoke test only issues GETs (plus failed login attempts), so it never writes clinical data. Override the target or credentials with `SMOKE_BASE_URL` and `SMOKE_ACCOUNTS` (JSON).

## Security notes

- `helmet()` sets the standard security response headers.
- `/api/auth/login` and `/api/auth/register` are rate limited to 10 requests / 15 min / IP.
- `/api/ai/*` is rate limited to 30 requests / 15 min / IP, and rejects inputs over 2000 characters.
- Public registration can only create `patient` or `doctor` accounts. Creating an `admin` requires `POST /api/admin/users`.
- Doctors can only read or write records for patients they have an appointment / record / prescription with. Admins keep full access.
- The server refuses to boot in production if `JWT_SECRET` is missing, shorter than 32 characters, or still contains placeholder text.
