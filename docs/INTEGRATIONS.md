# Planned integrations (not built)

This file records the third-party integrations that the roadmap mentions but that are
**deliberately not implemented** — and what a real implementation would need — so nobody
mistakes a feature flag for working code.

`frontend/src/config/features.js` keeps `insurance` and `pharmacy` at `false`; there is no
UI, route, table or SDK for either one. No third-party credentials are read anywhere except
the notification adapters listed below.

## Insurance / claims (`FEATURES.insurance`)

Status: **not built.** Nothing in `backend/` or `frontend/` touches insurance data.

What a real build needs first:

1. A payer integration partner (in India the practical route is a claims aggregator / TPA
   API, not insurers one by one). Nothing here talks to a payer today.
2. New tables (`insurers`, `insurance_policies`, `claims`) added through
   `backend/sql/migrations/` — never by editing an applied migration.
3. An explicit consent screen + an `audit_logs` entry per policy/claim access: policy
   numbers are PII and must not appear in URLs, logs or notification bodies.
4. A server-side secret store for API keys (never a `VITE_*` variable — anything prefixed
   `VITE_` is shipped to the browser).

## Pharmacy / medicine delivery (`FEATURES.pharmacy`)

Status: **not built.** Prescriptions are read from the local `prescriptions` /
`prescription_items` tables only; nothing is sent to a pharmacy.

What a real build needs first:

1. A pharmacy partner API plus a contract — there is no generic "pharmacy" endpoint.
2. A `prescription_fulfilments` table (prescription id, partner, external order id, status)
   so the original prescription row stays the clinical source of truth.
3. Controlled-substance and DOS rules reviewed before any automated dispensing; a
   prescription that a doctor has not signed for a specific patient must never be sent.
4. Price / stock data is per-partner — do not cache it in the prescription row.

## SMS gateways (notification adapters)

`backend/services/notify.js` ships `twilio` and `msg91` as **skeleton adapters**: they
validate configuration and then throw a clear `not configured` error. No vendor SDK is
installed and no HTTP call is made to either service.

| Provider | Env vars it reads | Behaviour today |
|---|---|---|
| `console` (default) | `NOTIFY_LOG_BODY` | Logs the send. Body text is suppressed unless `NOTIFY_LOG_BODY=true` **and** `NODE_ENV=development`, because reminder text contains health data. |
| `inapp` | — | Inserts a row into `notifications` (what the in-app bell reads). |
| `twilio` | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` | Throws `twilio provider is not configured — set … in backend/.env.` — add the SDK and the send call there once an account exists. |
| `msg91` | `MSG91_AUTH_KEY`, `MSG91_SENDER_ID`, `MSG91_TEMPLATE_ID` | Same: throws until configured. |

Switching provider is a one-line `.env` change (`REMINDER_PROVIDER=…`); no call site changes.

## Gemini AI

`GEMINI_API_KEY` is the only AI credential. When it is blank the AI endpoints run in
**mock mode** and say so in the response — they never call Google. See the AI section of
`backend/README.md`.
