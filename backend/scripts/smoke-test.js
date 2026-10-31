/**
 * EliteCare — read-only regression smoke test  (npm run test:smoke)
 * -----------------------------------------------------------------------------
 * Hits a *running* backend and proves that authentication, role checks, patient
 * ownership rules and request validation still behave as they should.
 *
 * By default it is READ-ONLY: GETs plus login attempts, never a write. Set
 * SMOKE_WRITE=1 to also exercise the create/update/delete happy paths of the
 * phase 1-6 features. Those tests clean up every row they create, so the
 * database is left exactly as they found it.
 *
 *   1. npm start                 (terminal 1)
 *   2. npm run test:smoke        (terminal 2)   regression only
 *   3. npm run test:smoke:full   (terminal 2)   regression + write paths
 *
 * Needs the seeded demo accounts from `npm run db:init` (see backend/sql/initDb.js).
 * Exits 0 when every check passes, 1 otherwise (so CI can gate on it).
 *
 * Point it somewhere else / use other accounts with:
 *   SMOKE_BASE_URL=http://localhost:5000/api  SMOKE_ACCOUNTS={"patient":{"email":"…","password":"…"}}
 */
require("dotenv").config();

const BASE = process.env.SMOKE_BASE_URL || `http://127.0.0.1:${process.env.PORT || 5000}/api`;
const CREDS = JSON.parse(
  process.env.SMOKE_ACCOUNTS ||
    JSON.stringify({
      patient: { email: "john.doe@example.com", password: "patient123" },
      doctor: { email: "doctor@elitecare.com", password: "doctor123" },
      admin: { email: "admin@elitecare.com", password: "admin123" },
    })
);
const WRITE =
  process.argv.includes("--write") || String(process.env.SMOKE_WRITE || "").toLowerCase() === "true";

let failures = 0;

function check(label, actual, expected) {
  const ok = Array.isArray(expected) ? expected.includes(actual) : actual === expected;
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label} -> ${actual} (expected ${JSON.stringify(expected)})`);
}

function note(label, value) {
  console.log(`      ${label}: ${typeof value === "string" ? value : JSON.stringify(value)}`);
}

function section(title) {
  console.log(`\n--- ${title} ${"-".repeat(Math.max(0, 58 - title.length))}`);
}

async function call(method, path, { token, body, form, files } = {}) {
  const isMultipart = Boolean(files || form);
  const headers = { ...(token ? { Authorization: `Bearer ${token}` } : {}) };

  let payloadBody;
  if (isMultipart) {
    const fd = new FormData();
    for (const [key, value] of Object.entries(form || {})) fd.append(key, value);
    for (const [key, value] of Object.entries(files || {})) {
      // value is [Buffer, filename, contentType]
      fd.append(key, new Blob([value[0]], { type: value[2] }), value[1]);
    }
    payloadBody = fd; // the browser/node fetch sets the multipart boundary itself
  } else if (body) {
    headers["Content-Type"] = "application/json";
    payloadBody = JSON.stringify(body);
  }

  const res = await fetch(BASE + path, { method, headers, body: payloadBody });
  let payload = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }
  return { status: res.status, payload };
}

async function login(email, password) {
  const res = await call("POST", "/auth/login", { body: { email, password } });
  return {
    ...res,
    token: res.payload?.token,
    user: res.payload?.user || res.payload?.patient || res.payload?.doctor || null,
  };
}

(async () => {
  console.log(`\nSmoke testing ${BASE}\n`);

  const health = await call("GET", "/health");
  check("GET /health", health.status, 200);
  if (health.status === 200) note("backend", health.payload?.service);

  // ---- auth ---------------------------------------------------------------
  const patient = await login(CREDS.patient.email, CREDS.patient.password);
  const doctor = await login(CREDS.doctor.email, CREDS.doctor.password);
  const admin = await login(CREDS.admin.email, CREDS.admin.password);

  check("POST /auth/login (patient)", patient.status, 200);
  check("POST /auth/login (doctor)", doctor.status, 200);
  check("POST /auth/login (admin)", admin.status, 200);
  check("POST /auth/login (wrong password)", (await login(CREDS.patient.email, "definitely-wrong")).status, 401);
  check("POST /auth/login (missing fields)", (await call("POST", "/auth/login", { body: {} })).status, [400, 422]);

  check("GET /auth/me (no token)", (await call("GET", "/auth/me")).status, 401);
  const me = await call("GET", "/auth/me", { token: patient.token });
  check("GET /auth/me (patient token)", me.status, 200);

  const patientId = patient.user?.id;
  note("logged-in patient id", patientId);
  if (!patientId) throw new Error("login response did not include a user id — check its shape");

  // ---- ownership: a patient only ever sees their own records --------------
  check("GET /patients/profile (self)", (await call("GET", "/patients/profile", { token: patient.token })).status, 200);
  check(
    "GET /patients/medical-history (self)",
    (await call("GET", "/patients/medical-history", { token: patient.token })).status,
    200
  );

  const rx = await call("GET", "/patients/prescriptions", { token: patient.token });
  check("GET /patients/prescriptions (self)", rx.status, 200);
  note("prescriptions returned", rx.payload?.prescriptions?.length ?? 0);
  note("medicines on first prescription", rx.payload?.prescriptions?.[0]?.medicines?.length ?? 0);

  // Asking for another patient's id must still return the caller's own data.
  const otherId = patientId === 2 ? 1 : 2;
  const crossPatient = await call("GET", `/patients/medical-history?patientId=${otherId}`, { token: patient.token });
  check("GET /patients/medical-history?patientId=<other patient> (patient)", crossPatient.status, 200);
  note("rows returned for the other id", crossPatient.payload?.records?.length ?? crossPatient.payload?.history?.length ?? "n/a");

  // ---- ownership: a doctor is limited to patients they actually treat -----
  check(
    "GET /patients/medical-history (doctor, no patientId)",
    (await call("GET", "/patients/medical-history", { token: doctor.token })).status,
    400
  );
  check(
    "GET /patients/medical-history?patientId=999999 (doctor, no relationship)",
    (await call("GET", "/patients/medical-history?patientId=999999", { token: doctor.token })).status,
    403
  );
  check(
    `GET /patients/medical-history?patientId=${patientId} (doctor, own patient)`,
    (await call("GET", `/patients/medical-history?patientId=${patientId}`, { token: doctor.token })).status,
    200
  );

  // ---- role checks --------------------------------------------------------
  check("GET /admin/stats (no token)", (await call("GET", "/admin/stats")).status, 401);
  check("GET /admin/stats (patient token)", (await call("GET", "/admin/stats", { token: patient.token })).status, 403);
  check("GET /admin/stats (doctor token)", (await call("GET", "/admin/stats", { token: doctor.token })).status, 403);
  check("GET /admin/stats (admin token)", (await call("GET", "/admin/stats", { token: admin.token })).status, 200);
  check("GET /doctors/me/patients (patient token)", (await call("GET", "/doctors/me/patients", { token: patient.token })).status, 403);
  check("GET /doctors (public directory)", (await call("GET", "/doctors")).status, 200);
  check("GET /nothing-here (404 handler)", (await call("GET", "/nothing-here")).status, 404);

  // =========================================================================
  // Phases 1-6 — the Health Hub surface. See scripts/smoke-phases.js.
  // =========================================================================
  const ctx = {
    call,
    check,
    note,
    section,
    patientId,
    t: { patient: patient.token, doctor: doctor.token, admin: admin.token },
  };
  const phases = require("./smoke-phases");

  section("Phase 1 — Care");
  await phases.phase1(ctx);
  section("Phase 2 — Family and language");
  await phases.phase2(ctx);
  section("Phase 2B — Language reaches every AI endpoint");
  await phases.phase2bLanguage(ctx);
  section("Phase 3 — Wearables");
  await phases.phase3(ctx);
  section("Phase 4 — Tracker, rewards, challenges");
  await phases.phase4(ctx);
  section("Phase 5 — Safety and trust");
  await phases.phase5(ctx);
  section("Phase 6 — Smart automation");
  await phases.phase6(ctx);

  if (WRITE) {
    section("Write paths (SMOKE_WRITE=1)");
    await phases.writePaths(ctx);
  } else {
    console.log("\n      (write paths skipped — run `npm run test:smoke:full` to include them)");
  }

  console.log(failures ? `\n${failures} CHECK(S) FAILED\n` : "\nALL CHECKS PASSED\n");
  // Set exitCode (not process.exit) so pending stdout writes are flushed first.
  process.exitCode = failures ? 1 : 0;
})().catch((err) => {
  console.error(`\nSmoke run errored: ${err.message}`);
  console.error(`Is the backend running?  npm start   (base ${BASE})\n`);
  process.exitCode = 1;
});
