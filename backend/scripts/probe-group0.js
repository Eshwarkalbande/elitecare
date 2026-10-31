// Group 0 probe: verifies the claims behind open issues 3-5 against the LIVE
// backend, rather than trusting a code read. Read-only apart from the throwaway
// doctor it registers, which it removes again.
//
//   node scripts/probe-group0.js
const BASE = process.env.SMOKE_BASE_URL || "http://127.0.0.1:5000/api";

let fails = 0;
const out = [];
function say(line) {
  out.push(line);
}
function check(label, ok, detail) {
  if (!ok) fails += 1;
  say(`${ok ? "PASS" : "FAIL"}  ${label}${detail === undefined ? "" : ` -> ${JSON.stringify(detail)}`}`);
}

async function call(method, path, { token, body } = {}) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  if (body) headers["Content-Type"] = "application/json";
  const res = await fetch(BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  let json = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }
  return { status: res.status, body: json };
}

const login = async (email, password) => (await call("POST", "/auth/login", { body: { email, password } })).body?.token;

(async () => {
  const admin = await login("admin@elitecare.com", "admin123");
  const doctor = await login("doctor@elitecare.com", "doctor123");
  const patient = await login("john.doe@example.com", "patient123");
  if (!admin || !doctor || !patient) {
    say("cannot log in; is the backend seeded and running?");
    process.exitCode = 1;
    return;
  }

  // ---- Issue 4: a malformed recordDate must be 400, never 500 ----
  say("\n--- issue 4: recordDate validation ---");
  const bad = await call("POST", "/patients/medical-history", {
    token: doctor,
    body: { patientId: 1, recordType: "note", recordDate: "not-a-real-date" },
  });
  check("malformed recordDate -> 400 (not 500)", bad.status === 400, { status: bad.status, error: bad.body?.error });

  const impossible = await call("POST", "/patients/medical-history", {
    token: doctor,
    body: { patientId: 1, recordType: "note", recordDate: "2026-02-31" },
  });
  check("impossible calendar date 2026-02-31 -> 400", impossible.status === 400, { status: impossible.status, error: impossible.body?.error });

  const future = await call("POST", "/patients/medical-history", {
    token: doctor,
    body: { patientId: 1, recordType: "note", recordDate: "2099-01-01" },
  });
  check("future recordDate -> 400", future.status === 400, { status: future.status, error: future.body?.error });

  // Wearables and health metrics carried their OWN copy of the date validator,
  // which was the pre-fix version: `new Date("2026-02-31")` rolls over to
  // 2026-03-03, so an impossible date was stored. Every one of these is a 400,
  // so nothing is written and the probe stays read-only.
  say("\n--- issue 4b: shared date validator on wearables + metrics ---");
  for (const [label, body] of [
    ["impossible recordedAt 2026-02-31", { type: "steps", value: 100, recordedAt: "2026-02-31" }],
    ["malformed recordedAt", { type: "steps", value: 100, recordedAt: "not-a-date" }],
    ["future recordedAt", { type: "steps", value: 100, recordedAt: "2099-01-01" }],
  ]) {
    const r = await call("POST", "/wearables/samples", { token: patient, body });
    check(`wearables ${label} -> 400`, r.status === 400, { status: r.status, error: r.body?.error });
  }
  const metric = await call("POST", "/patients/metrics", {
    token: patient,
    body: { type: "weight", value1: 70, recordedAt: "2026-02-31" },
  });
  check("metrics impossible recordedAt 2026-02-31 -> 400", metric.status === 400, {
    status: metric.status,
    error: metric.body?.error,
  });

  say("\n--- issue 7: translate route path ---");
  const tr = await call("POST", "/ai/translate", {
    token: patient,
    body: { text: "I have a fever", from: "en", to: "hi" },
  });
  check("POST /ai/translate -> 200", tr.status === 200, { status: tr.status });
  const doubled = await call("POST", "/ai/ai/translate", {
    token: patient,
    body: { text: "I have a fever", from: "en", to: "hi" },
  });
  check("POST /ai/ai/translate -> 404 (single mount, no double prefix)", doubled.status === 404, { status: doubled.status });

  say("\n--- issue 3: public doctor registration is pending ---");
  const stamp = Date.now();
  const email = `probe.doc.${stamp}@example.com`;
  const reg = await call("POST", "/auth/register", {
    body: { fullName: "Probe Doctor", email, password: "probe123", role: "doctor" },
  });
  check("register as doctor -> 201", reg.status === 201, { status: reg.status, message: reg.body?.message });
  check("register message mentions pending approval", /pending/i.test(reg.body?.message || ""), reg.body?.message);

  if (reg.status === 201) {
    const newToken = reg.body.token;
    const me = await call("GET", "/auth/me", { token: newToken });
    check("new doctor has a verificationStatus", Boolean(me.body?.user?.verificationStatus), me.body?.user?.verificationStatus);
    check("new doctor verificationStatus is 'none' or 'pending'", ["none", "pending"].includes(me.body?.user?.verificationStatus), me.body?.user?.verificationStatus);

    const adminQueue = await call("GET", "/admin/verifications?status=pending", { token: admin });
    const listed = (adminQueue.body?.verifications || []).some((v) => v.email === email);
    check("new doctor appears in the admin pending queue", listed, { count: (adminQueue.body?.verifications || []).length });

    const finder = await call("GET", "/doctors");
    const inFinder = (finder.body?.doctors || []).some((d) => d.name === "Probe Doctor");
    check("unverified doctor is visible in the finder while REQUIRE_DOCTOR_VERIFICATION=false", inFinder, inFinder);

    const canBook = await call("POST", "/patients/appointments", {
      token: patient,
      body: { doctorId: 999999, date: "2026-12-01", time: "10:00" },
    });
    check("booking an unknown doctorId -> 404/400, never a silent success", [400, 404].includes(canBook.status), { status: canBook.status });

    const del = await call("DELETE", `/admin/users/${reg.body.user.id}`, { token: admin });
    say(`      cleanup: probe doctor delete returned ${del.status} (${del.body?.error || "ok"})`);
  }

  console.log(out.join("\n"));
  console.log(fails ? `\n${fails} PROBE CHECK(S) FAILED\n` : "\nALL PROBE CHECKS PASSED\n");
  process.exitCode = fails ? 1 : 0;
})().catch((err) => {
  console.error("probe errored:", err.message);
  process.exitCode = 1;
});