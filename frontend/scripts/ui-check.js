// Live check for the endpoints the new frontend screens call.
//
// It logs in as the real seeded roles, exercises the happy path, an error path
// and the empty shape for every screen, and prints what each screen receives.
// Read-only: it writes nothing.
//
//   node scripts/ui-check.js
//
// Point it elsewhere with BASE=http://localhost:5000/api
const BASE = process.env.BASE || "http://127.0.0.1:5000/api";

let failures = 0;
function check(label, ok, detail) {
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail === undefined ? "" : ` -> ${JSON.stringify(detail)}`}`);
}

async function call(method, path, { token, body, form, files } = {}) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  let payload;
  if (files || form) {
    const fd = new FormData();
    for (const [k, v] of Object.entries(form || {})) fd.append(k, v);
    for (const [k, v] of Object.entries(files || {})) fd.append(k, new Blob([v[0]], { type: v[2] }), v[1]);
    payload = fd;
  } else if (body) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
  const res = await fetch(BASE + path, { method, headers, body: payload });
  let json = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }
  return { status: res.status, body: json };
}

async function login(email, password) {
  const res = await call("POST", "/auth/login", { body: { email, password } });
  return res.body?.token || null;
}

/** The screen's contract: 200 plus the keys it actually reads. */
async function shape(name, res, ...keys) {
  const ok = res.status === 200 && keys.every((k) => res.body?.[k] !== undefined);
  check(name, ok, `${res.status} keys=[${Object.keys(res.body || {}).join(",")}]`);
  return res.body;
}

(async () => {
  const patient = await login("john.doe@example.com", "patient123");
  const doctor = await login("doctor@elitecare.com", "doctor123");
  const admin = await login("admin@elitecare.com", "admin123");
  check("logins (patient/doctor/admin)", Boolean(patient && doctor && admin), {
    patient: !!patient,
    doctor: !!doctor,
    admin: !!admin,
  });
  if (!patient || !doctor || !admin) throw new Error("cannot continue without a token for each role");

  // ---- Group A: the header language reaches every AI endpoint ----
  for (const code of ["en", "hi", "mr"]) {
    const res = await call("POST", "/ai/symptoms", { token: patient, body: { message: "chest pain", language: code } });
    check(`/ai/symptoms language=${code}`, res.status === 200 && Boolean(res.body?.department), res.body?.department);
  }
  const unknown = await call("POST", "/ai/symptoms", { token: patient, body: { message: "chest pain", language: "zz" } });
  check("/ai/symptoms unknown language falls back", unknown.status === 200, unknown.body?.urgency);

  const tr = await call("POST", "/ai/translate", {
    token: patient,
    body: { text: "I have a fever", from: "en", to: "hi", language: "hi" },
  });
  check("/ai/translate", tr.status === 200, tr.body?.translation);
  check("/ai/translate labels a mock", tr.body?.isMock === true, tr.body?.isMock);
  const over = await call("POST", "/ai/translate", { token: patient, body: { text: "x".repeat(1001), from: "en", to: "hi" } });
  check("/ai/translate over 1000 chars -> 400", over.status === 400, over.body?.error);

  // ---- Group B/C: the endpoints each new screen reads ----
  await shape("GET /patients/family", await call("GET", "/patients/family", { token: patient }), "familyMembers");
  await shape("GET /patients/metrics", await call("GET", "/patients/metrics", { token: patient }), "metrics");
  await shape(
    "GET /patients/metrics/trends",
    await call("GET", "/patients/metrics/trends?type=bp&days=30", { token: patient }),
    "points",
    "alerts",
    "generalRange"
  );
  await shape("GET /patients/rewards", await call("GET", "/patients/rewards", { token: patient }), "balance", "ledger", "catalog", "note");
  await shape("GET /patients/referrals", await call("GET", "/patients/referrals", { token: patient }), "code", "rewardCoins", "invited", "rules");
  await shape("GET /patients/challenges", await call("GET", "/patients/challenges", { token: patient }), "challenges");
  await shape("GET /patients/emergency-contacts", await call("GET", "/patients/emergency-contacts", { token: patient }), "contacts");
  const card = await shape("GET /patients/emergency-card", await call("GET", "/patients/emergency-card", { token: patient }), "card");
  check("  ... card is off by default", card?.card?.enabled === false, card?.card?.enabled);
  await shape("GET /patients/queue", await call("GET", "/patients/queue", { token: patient }), "date", "token", "peopleAhead");
  await shape("GET /patients/follow-ups", await call("GET", "/patients/follow-ups", { token: patient }), "followUps", "note");
  await shape("GET /wearables/connections", await call("GET", "/wearables/connections", { token: patient }), "connections");
  await shape("GET /wearables/summary", await call("GET", "/wearables/summary?range=7d", { token: patient }), "range", "series", "totals");

  await shape("GET /doctors/me/queue", await call("GET", "/doctors/me/queue", { token: doctor }), "date", "tokens", "nowServing");
  await shape("GET /doctors/me/verification", await call("GET", "/doctors/me/verification", { token: doctor }), "status");
  await shape("GET /admin/verifications", await call("GET", "/admin/verifications", { token: admin }), "verifications");
  await shape("GET /admin/rewards", await call("GET", "/admin/rewards", { token: admin }), "vouchers", "redemptions");
  await shape("GET /admin/referrals", await call("GET", "/admin/referrals", { token: admin }), "referrals", "rewardCoins");
  await shape("POST /ai/triage", await call("POST", "/ai/triage", { token: patient, body: { symptoms: "itchy skin rash" } }), "matches", "note");

  // ---- error paths each screen must render as a friendly message ----
  check("/patients/queue with a doctor token -> 403", (await call("GET", "/patients/queue", { token: doctor })).status === 403);
  check("/admin/verifications with a patient token -> 403", (await call("GET", "/admin/verifications", { token: patient })).status === 403);
  const badFamily = await call("GET", "/patients/metrics?familyMemberId=999999", { token: patient });
  check("/patients/metrics familyMemberId=999999 -> 403", badFamily.status === 403, badFamily.body?.error);
  check("a garbage token -> 401", (await call("GET", "/patients/metrics", { token: "not-a-real-token" })).status === 401);
  const badSpo2 = await call("POST", "/patients/metrics", { token: patient, body: { type: "spo2", value1: 140 } });
  check("spo2 140% -> 400", badSpo2.status === 400, badSpo2.body?.error);
  const badSteps = await call("POST", "/wearables/samples", { token: patient, body: { type: "steps", value: 999999 } });
  check("steps 999999 -> 400", badSteps.status === 400, badSteps.body?.error);
  const badCard = await call("PUT", "/patients/emergency-card", { token: doctor, body: { enabled: true } });
  check("PUT /patients/emergency-card with a doctor token -> 403", badCard.status === 403);

  // ---- empty states: a list must be [] and never null ----
  const empties = [
    ["family", (await call("GET", "/patients/family", { token: patient })).body?.familyMembers],
    ["metrics", (await call("GET", "/patients/metrics", { token: patient })).body?.metrics],
    ["challenges", (await call("GET", "/patients/challenges", { token: patient })).body?.challenges],
    ["follow-ups", (await call("GET", "/patients/follow-ups", { token: patient })).body?.followUps],
    ["contacts", (await call("GET", "/patients/emergency-contacts", { token: patient })).body?.contacts],
    ["wearable series", (await call("GET", "/wearables/summary?range=7d", { token: patient })).body?.series],
    ["doctor queue", (await call("GET", "/doctors/me/queue", { token: doctor })).body?.tokens],
  ];
  for (const [name, value] of empties) {
    check(`empty state: ${name} is an array, never null`, Array.isArray(value), Array.isArray(value) ? `length ${value.length}` : value);
  }

  console.log(failures ? `\n${failures} CHECK(S) FAILED\n` : "\nALL UI CHECKS PASSED\n");
  process.exitCode = failures ? 1 : 0;
})().catch((err) => {
  console.error("ui-check errored:", err.message);
  console.error("Is the backend running?  npm start   (base " + BASE + ")");
  process.exitCode = 1;
});
