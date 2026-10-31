# Migrations

Every schema change for the Health Hub work lives here as a numbered, **additive** SQL file.

```bash
npm run db:migrate                  # apply everything pending
npm run db:migrate -- --dry-run     # list pending files only
npm run db:migrate -- --status      # show applied files + checksums
```

## Rules

1. File name: `NNN_short_description.sql` (three-digit, zero padded, ASCII, `.sql`).
2. Additive only — `CREATE TABLE IF NOT EXISTS`, `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`,
   `CREATE INDEX IF NOT EXISTS`. **Never** `DROP`, `TRUNCATE` or re-seed existing data.
3. Idempotent: the runner records each file in `schema_migrations`, but the file itself
   must also be safe to run twice (some deployments paste these into pgAdmin by hand).
4. Never edit a file that has already been applied — the runner refuses to continue if an
   applied file's checksum changed. Add a new numbered file instead.
5. When you add a table/column/index here, mirror it in **both**
   `backend/sql/schema_postgres.sql` and `Database/schema_postgres.sql` so a fresh
   `npm run db:init` install and a migrated install end up identical. Those two files must
   stay byte-for-byte identical.

## Applied migrations

| File | Phase | What it does |
|---|---|---|
| `001_foundation_indexes.sql` | 0 | Creates the `schema_migrations` tracking table and supporting indexes on `notifications`, `audit_logs`, `appointments`, `medical_records`, `prescriptions`, `prescription_items`. |
