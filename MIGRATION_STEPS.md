# EliteCare: MySQL → PostgreSQL Migration Guide

## What's in this folder
- `schema_postgres.sql` – your table structure, converted from `backend/sql/schema.sql` (MySQL) to PostgreSQL.
- `seed_postgres.sql` – the demo accounts + sample data, converted to plain SQL (passwords are pre-hashed with bcrypt so it runs directly in pgAdmin, no Node needed).
- `backend/` – your full backend, patched to talk to PostgreSQL instead of MySQL (see "What changed in the code" below).

> **Note:** the demo accounts in `seed_postgres.sql` (`patient123` / `doctor123` / `admin123`) are for **local development only**. Do not load them into a production database.

## Part 0 — Install PostgreSQL and create the database

The backend uses the `pg` driver against **PostgreSQL on port 5432** (not MySQL 3306).

**Windows:** install from https://www.postgresql.org/download/windows/ and remember the superuser password.
**macOS:** `brew install postgresql@16 && brew services start postgresql@16`
**Linux:** `sudo apt install postgresql && sudo systemctl start postgresql`

Create the database and a dedicated user:
```sql
CREATE DATABASE elitecare_db;
CREATE USER elitecare_user WITH PASSWORD 'change_this_password';
GRANT ALL PRIVILEGES ON DATABASE elitecare_db TO elitecare_user;
```

## Part 1 — Create the database in pgAdmin 4

1. Open **pgAdmin 4** and connect to your local PostgreSQL server (create a server connection if you haven't already — right-click **Servers → Register → Server**, fill in host `localhost`, port `5432`, and your postgres superuser password).
2. Right-click **Databases → Create → Database…**
3. Name it `elitecare_db` (or whatever you set as `DB_NAME`), then click **Save**.
4. Click on the new `elitecare_db` database to select it, then open the **Query Tool** (Tools → Query Tool, or the lightning-bolt icon).

## Part 2 — Run the schema

1. In the Query Tool, click the folder icon and open `schema_postgres.sql` (or paste its contents in).
2. Click **Execute/Run** (▶ or F5).
3. In the left sidebar, refresh **Schemas → public → Tables** — you should see all 11 tables (`users`, `patient_profiles`, `doctor_profiles`, `doctor_slots`, `hospitals`, `appointments`, `medical_records`, `prescriptions`, `prescription_items`, `notifications`, `audit_logs`).

## Part 3 — Load the demo/sample data (optional but recommended)

1. Open a new Query Tool tab, load `seed_postgres.sql`, and run it.
2. This creates the same 3 demo logins your MySQL setup had:
   - Patient → `john.doe@example.com` / `patient123`
   - Doctor → `doctor@elitecare.com` / `doctor123`
   - Admin → `admin@elitecare.com` / `admin123`
   plus 3 extra sample doctors, a sample hospital, an appointment, a medical record, and a prescription.

That's the database side done — your schema now lives in PostgreSQL exactly as it did in MySQL.

## Part 4 — Point the backend at PostgreSQL

Your Node/Express backend used the `mysql2` driver with MySQL-only SQL in a couple of places, so I patched it to use `pg` instead. What changed:

| File | Change |
|---|---|
| `backend/config/db.js` | Now uses `pg.Pool` instead of `mysql2`. Includes a small compatibility layer so the rest of the code (`pool.query(...)` returning `[rows]`/`result.insertId`) keeps working unchanged. |
| `backend/sql/schema_postgres.sql` | The converted schema (same file as above), now living where `schema.sql` used to. |
| `backend/sql/initDb.js` | Rewritten to seed via `pg` — an alternative to running the SQL files manually in pgAdmin (`npm run db:init`). |
| `backend/controllers/adminController.js`, `doctorController.js` | `CURDATE()` → `CURRENT_DATE` (MySQL vs. Postgres date function). |
| `backend/controllers/patientController.js` | `INSERT ... ON DUPLICATE KEY UPDATE ... VALUES(col)` (MySQL upsert) → `INSERT ... ON CONFLICT (user_id) DO UPDATE SET col = EXCLUDED.col` (Postgres upsert). |
| `backend/package.json` | `mysql2` dependency swapped for `pg`. |
| `backend/.env.example` | Default port changed from `3306` to `5432`. |

Everything else (routes, controllers' business logic, auth, JWT, etc.) is untouched — only the database-facing bits changed.

### To run it:

```bash
cd backend
cp .env.example .env
# edit .env: set DB_USER / DB_PASSWORD / DB_NAME to match what you created in pgAdmin
npm install
npm run db:init      # optional — only if you didn't already run seed_postgres.sql in pgAdmin
npm run dev
```

## Key MySQL → PostgreSQL differences applied

- `AUTO_INCREMENT` → `SERIAL`
- `ENUM('a','b','c')` columns → native PostgreSQL `CREATE TYPE ... AS ENUM (...)`
- `TINYINT(1)` (boolean-style flags) → `BOOLEAN`
- `ON UPDATE CURRENT_TIMESTAMP` (auto-updating `updated_at`) → a `BEFORE UPDATE` trigger, since Postgres has no equivalent column option
- `ENGINE=InnoDB DEFAULT CHARSET=utf8mb4` → removed (not applicable; Postgres tables are transactional and UTF-8 by default)
- `?` placeholders → `$1, $2, ...` (handled transparently by the `db.js` shim)
- `CURDATE()` → `CURRENT_DATE`
- `ON DUPLICATE KEY UPDATE ... VALUES(col)` → `ON CONFLICT (...) DO UPDATE SET col = EXCLUDED.col`
- MySQL's `result.insertId` on INSERT → Postgres `RETURNING id`, faked back into `result.insertId` by the shim so no controller code had to change

## If you'd rather use command line instead of pgAdmin

```bash
psql -U postgres -c "CREATE DATABASE elitecare_db;"
psql -U postgres -d elitecare_db -f schema_postgres.sql
psql -U postgres -d elitecare_db -f seed_postgres.sql
```
