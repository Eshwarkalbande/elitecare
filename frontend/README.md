# EliteCare — Frontend

React 19 + Vite single-page app. Talks to the `backend/` API over REST (JSON + JWT).

## Setup

```bash
cd frontend
npm install
cp .env.example .env
# edit .env if your backend runs somewhere other than http://localhost:5000
npm run dev
```

App runs at **http://localhost:5173**. Make sure the backend (`../backend`) is running first at **http://localhost:5000**, otherwise login and dashboard data calls will fail.

## What's wired to the real backend

- **Login / Register** (`src/components/LoginPage.jsx`) — calls `POST /api/auth/login` and `POST /api/auth/register`.
- **Patient Dashboard**
  - Appointments list — `GET /api/patients/appointments`
  - **Medical History** panel (new) — `GET /api/patients/medical-history`
  - **Prescription History** panel (new) — `GET /api/patients/prescriptions`
- Session persistence — JWT stored in `localStorage` under `elitecare_token`; auto-restores login on page refresh.

## Service layer

All API calls live in `src/services/`:

| File | Covers |
|---|---|
| `api.js` | Axios instance, attaches JWT to every request |
| `authService.js` | login, register, session storage |
| `patientService.js` | profile, appointments, medical history, prescriptions |
| `doctorService.js` | doctor profile, doctor's appointments/patients, writing prescriptions & records |
| `adminService.js` | user management, stats, hospitals, all-appointments |

## Wiring up the remaining dashboards

The Doctor Dashboard and Admin Dashboard components still render their original demo/mock data (from `src/mockData.ts`) for panels beyond what was explicitly requested (login + patient medical/prescription history). The backend already exposes full REST endpoints for both — see `../backend/README.md` for the full route list. To connect any panel:

```js
import { getMyAppointments } from "../services/doctorService";
// or
import { listUsers, getStats } from "../services/adminService";

useEffect(() => {
  getMyAppointments().then(setAppointments);
}, []);
```

Swap the local `useState(MOCK_DATA)` initializers for a `useEffect` fetch like above, the same pattern used in `PatientDashboard.jsx` / `MedicalHistoryPanel.jsx`.

## Health Hub (Phase 0 foundation)

One new patient-facing view plus the plumbing the next phases will sit on. Nothing that existed before was redesigned — the hub is additive and everything in it is switched off by default.

| File | Purpose |
|---|---|
| `src/components/HealthHub.jsx` | The hub view: grouped section cards + the language switcher. Reached from the **Health Hub** card on the Patient Dashboard. |
| `src/config/features.js` | `FEATURES` booleans — the only way to turn a new section on. `healthHub: true` shows the hub; every phase-1+ flag is `false`. |
| `src/i18n/en.js` · `hi.js` · `mr.js` | String dictionaries for the new screens only (English / हिन्दी / मराठी). |
| `src/i18n/index.js` | `useT()` hook + `translate()`. Chosen language persists in `localStorage` under `elitecare_lang`; unknown keys fall back to English, unsupported languages fall back to `en`. |

`App.jsx` renders the hub as another `activeTab` value (`"Health Hub"`), guarded by `FEATURES.healthHub`, and passes `onNavigate={setActiveTab}` down so a section can hand navigation back to the app shell.

Existing screens keep using their current (non-`useT`) translation setup — `useT` is intentionally scoped to the new components so nothing that ships today changes behaviour.

Run `npm run build` after flipping flags; the hub adds no new dependency (icons come from the `lucide-react` already in use).

## AI features (Symptom Checker, Medicine Scanner, Chatbot)

These now call the backend at `/api/ai/*` instead of the old embedded `server.ts`. They require the user to be logged in (JWT) and work in "mock mode" automatically if `GEMINI_API_KEY` isn't set in `backend/.env`.
