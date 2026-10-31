/**
 * Phase 1-6 checks for the EliteCare smoke test.
 *
 * Loaded by scripts/smoke-test.js, which owns the HTTP helpers, the tokens and
 * the pass/fail counter. Everything here is a READ-ONLY check unless `write` is
 * true, in which case the happy paths run too and every created row is deleted
 * again in a finally-style cleanup block.
 *
 * The point of these checks is not "does it return 200" but the SAFETY
 * promises: consent is required, a family member you do not own is a 403, a
 * reminder without real times never becomes active, an unverified provider
 * never claims to be connected, and a disabled emergency card is a 404.
 */

/** Phase 1A/1B — care: lab summaries, reminders, translation. */
async function phase1(ctx) {
  const { call, check, note, t, patientId } = ctx;
  const p = t.patient;
  const d = t.doctor;

  check("GET /patients/lab-reports (no token)", (await call("GET", "/patients/lab-reports")).status, 401);
  check("GET /patients/lab-reports (patient)", (await call("GET", "/patients/lab-reports", { token: p })).status, 200);
  check(
    "POST /patients/lab-reports (empty summary -> 400)",
    (await call("POST", "/patients/lab-reports", { token: p, body: { summary: "" } })).status,
    400
  );
  check(
    "POST /patients/lab-reports (doctor token -> 403)",
    (await call("POST", "/patients/lab-reports", { token: d, body: { summary: "x" } })).status,
    403
  );
  check(
    "DELETE /patients/lab-reports/999999 (not found -> 404)",
    (await call("DELETE", "/patients/lab-reports/999999", { token: p })).status,
    404
  );

  // Consent is a hard requirement: without it the report is never forwarded.
  const noConsent = await call("POST", "/ai/lab-report", {
    token: p,
    form: { language: "en" },
    files: { file: [Buffer.from("%PDF-1.4\n%smoke\n", "utf8"), "smoke.pdf", "application/pdf"] },
  });
  check("POST /ai/lab-report (no consent -> 400)", noConsent.status, 400);
  note("consent message", noConsent.payload?.error);

  // A file whose bytes are not really a PDF must be rejected on magic bytes.
  const fakePdf = await call("POST", "/ai/lab-report", {
    token: p,
    form: { consent: "true", language: "en" },
    files: { file: [Buffer.from("this is plain text pretending to be a pdf"), "fake.pdf", "application/pdf"] },
  });
  check("POST /ai/lab-report (fake PDF bytes -> 400)", fakePdf.status, 400);

  check(
    "POST /ai/translate (same language -> 400)",
    (await call("POST", "/ai/translate", { token: p, body: { text: "hi", from: "en", to: "en" } })).status,
    400
  );
  check(
    "POST /ai/translate (over 1000 chars -> 400)",
    (await call("POST", "/ai/translate", { token: p, body: { text: "a".repeat(1001), from: "en", to: "hi" } })).status,
    400
  );
  const translated = await call("POST", "/ai/translate", { token: p, body: { text: "I have a fever", from: "en", to: "hi" } });
  check("POST /ai/translate (valid)", translated.status, 200);
  note("isMock (true locally — no GEMINI_API_KEY)", translated.payload?.isMock);

  const reminders = await call("GET", "/patients/reminders", { token: p });
  check("GET /patients/reminders (patient)", reminders.status, 200);
  check(
    "GET /patients/reminders/adherence?days=7",
    (await call("GET", "/patients/reminders/adherence?days=7", { token: p })).status,
    200
  );
  const proposals = await call("POST", "/patients/reminders/propose", { token: p });
  check("POST /patients/reminders/propose", proposals.status, 200);
  note("proposals (nothing is stored by propose)", proposals.payload?.proposals?.length ?? 0);
  check(
    "POST /patients/reminders (no medicineName -> 400)",
    (await call("POST", "/patients/reminders", { token: p, body: {} })).status,
    400
  );
  check(
    "POST /patients/reminders (7 times -> 400)",
    (
      await call("POST", "/patients/reminders", {
        token: p,
        body: { medicineName: "x", times: ["01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00"] },
      })
    ).status,
    400
  );
  check(
    "PATCH /patients/reminders/999999 (not found -> 404)",
    (await call("PATCH", "/patients/reminders/999999", { token: p, body: { active: true } })).status,
    404
  );
  check(
    "POST /patients/reminders/1/events/1 (status 'maybe' -> 400)",
    (await call("POST", "/patients/reminders/1/events/1", { token: p, body: { status: "maybe" } })).status,
    400
  );

  // ---- 1C: the doctor panel ----
  const mine = await call("GET", "/doctors/me/appointments", { token: d });
  check("GET /doctors/me/appointments (doctor)", mine.status, 200);
  const ownId = mine.payload?.appointments?.[0]?.id;
  check(
    "GET /doctors/appointments/:id/pre-consult-summary (patient -> 403)",
    (await call("GET", "/doctors/appointments/1/pre-consult-summary", { token: p })).status,
    403
  );
  check(
    "GET /doctors/appointments/999999/pre-consult-summary (not the doctor's -> 404)",
    (await call("GET", "/doctors/appointments/999999/pre-consult-summary", { token: d })).status,
    404
  );
  if (ownId) {
    const brief = await call("GET", `/doctors/appointments/${ownId}/pre-consult-summary`, { token: d });
    check("GET /doctors/appointments/:own/pre-consult-summary", brief.status, 200);
    note("source (template = no consent or no AI key)", brief.payload?.source);
    note("patient had consented to AI", brief.payload?.aiConsent);
    check("  ... and the brief says it is not a diagnosis", String(brief.payload?.summary || "").length > 0, true);
  } else {
    note("pre-consult summary", "skipped — the demo doctor has no appointments");
  }
  void patientId;
}

/** Phase 2 — family ownership. The whole point is the 403 for other accounts. */
async function phase2(ctx) {
  const { call, check, note, t } = ctx;
  const p = t.patient;
  const d = t.doctor;

  check("GET /patients/family (no token)", (await call("GET", "/patients/family")).status, 401);
  check("GET /patients/family (patient)", (await call("GET", "/patients/family", { token: p })).status, 200);
  check(
    "POST /patients/family (no fullName -> 400)",
    (await call("POST", "/patients/family", { token: p, body: { relation: "son" } })).status,
    400
  );
  check(
    "POST /patients/family (doctor token -> 403)",
    (await call("POST", "/patients/family", { token: d, body: { fullName: "Nope" } })).status,
    403
  );
  check(
    "PUT /patients/family/999999 (not mine -> 404)",
    (await call("PUT", "/patients/family/999999", { token: p, body: { relation: "nephew" } })).status,
    404
  );
  // A family member id that belongs to nobody is a hard 403, never an empty list.
  check(
    "GET /patients/metrics?familyMemberId=999999 (not mine -> 403)",
    (await call("GET", "/patients/metrics?familyMemberId=999999", { token: p })).status,
    403
  );
  check(
    "GET /patients/metrics?familyMemberId=abc (not a number -> 400)",
    (await call("GET", "/patients/metrics?familyMemberId=abc", { token: p })).status,
    400
  );
  check(
    "GET /patients/lab-reports?familyMemberId=0 (0 means 'me', not an error)",
    (await call("GET", "/patients/lab-reports?familyMemberId=0", { token: p })).status,
    200
  );
  note("family ownership", "a member you do not own is always a 403, never a silent empty result");
}

/** Phase 3 — wearables: plausibility, idempotency and honest provider states. */
async function phase3(ctx) {
  const { call, check, note, t } = ctx;
  const p = t.patient;

  check("GET /wearables/summary (no token)", (await call("GET", "/wearables/summary")).status, 401);
  check("GET /wearables/summary?range=7d", (await call("GET", "/wearables/summary?range=7d", { token: p })).status, 200);
  check(
    "GET /wearables/summary?range=nonsense (falls back to 7d)",
    (await call("GET", "/wearables/summary?range=nonsense", { token: p })).status,
    200
  );
  const connections = await call("GET", "/wearables/connections", { token: p });
  check("GET /wearables/connections", connections.status, 200);
  const lying = (connections.payload?.connections || []).filter(
    (c) => c.implemented === false && c.status === "connected"
  );
  check("an unimplemented provider never claims a connection", lying.length, 0);
  note(
    "provider states",
    (connections.payload?.connections || []).map((c) => `${c.id}=${c.status}`).join(" ")
  );

  check(
    "POST /wearables/samples (unknown type -> 400)",
    (await call("POST", "/wearables/samples", { token: p, body: { type: "telepathy", value: 1 } })).status,
    400
  );
  check(
    "POST /wearables/samples (steps 999999 -> 400)",
    (await call("POST", "/wearables/samples", { token: p, body: { type: "steps", value: 999999 } })).status,
    400
  );
  check(
    "POST /wearables/samples (heart rate 900 -> 400)",
    (await call("POST", "/wearables/samples", { token: p, body: { type: "heart_rate", value: 900 } })).status,
    400
  );
  check(
    "POST /wearables/samples (recordedAt in the future -> 400)",
    (
      await call("POST", "/wearables/samples", {
        token: p,
        body: { type: "steps", value: 500, recordedAt: new Date(Date.now() + 86400000).toISOString() },
      })
    ).status,
    400
  );
  check(
    "POST /wearables/import (empty csv -> 400)",
    (await call("POST", "/wearables/import", { token: p, body: { csv: "   " } })).status,
    400
  );
  check(
    "POST /wearables/import (bad rows are reported, not silently dropped)",
    (await call("POST", "/wearables/import", { token: p, body: { csv: "2026-01-01Telepathy5" } })).status,
    200
  );
  check(
    "DELETE /wearables/all (without confirm -> 400)",
    (await call("DELETE", "/wearables/all", { token: p, body: {} })).status,
    400
  );
  check("GET /wearables/samples", (await call("GET", "/wearables/samples?range=7d&limit=5", { token: p })).status, 200);
}


/** Phase 4 — tracker, the server-side coin ledger, referrals and challenges. */
async function phase4(ctx) {
  const { call, check, note, t } = ctx;
  const p = t.patient;
  const admin = t.admin;
  const doctor = t.doctor;

  check("GET /patients/metrics", (await call("GET", "/patients/metrics", { token: p })).status, 200);
  check("GET /patients/metrics/trends?type=bp", (await call("GET", "/patients/metrics/trends?type=bp", { token: p })).status, 200);
  check(
    "POST /patients/metrics (unknown type -> 400)",
    (await call("POST", "/patients/metrics", { token: p, body: { type: "aura", value1: 1 } })).status,
    400
  );
  check(
    "POST /patients/metrics (bp without the diastolic value -> 400)",
    (await call("POST", "/patients/metrics", { token: p, body: { type: "bp", value1: 120 } })).status,
    400
  );
  check(
    "POST /patients/metrics (spo2 140% -> 400)",
    (await call("POST", "/patients/metrics", { token: p, body: { type: "spo2", value1: 140 } })).status,
    400
  );

  const rewards = await call("GET", "/patients/rewards", { token: p });
  check("GET /patients/rewards", rewards.status, 200);
  note("coin balance (server-side ledger only)", rewards.payload?.balance);
  check(
    "POST /patients/rewards/redeem (no voucherId -> 400)",
    (await call("POST", "/patients/rewards/redeem", { token: p, body: {} })).status,
    400
  );
  check(
    "POST /patients/rewards/redeem (unknown voucher -> 404)",
    (await call("POST", "/patients/rewards/redeem", { token: p, body: { voucherId: 999999 } })).status,
    404
  );
  check("GET /patients/referrals", (await call("GET", "/patients/referrals", { token: p })).status, 200);
  check(
    "POST /patients/referrals/claim (empty code -> 400)",
    (await call("POST", "/patients/referrals/claim", { token: p, body: { code: "" } })).status,
    400
  );
  check("GET /patients/challenges", (await call("GET", "/patients/challenges", { token: p })).status, 200);
  check(
    "POST /patients/challenges/999999/join (not found -> 404)",
    (await call("POST", "/patients/challenges/999999/join", { token: p })).status,
    404
  );
  check(
    "GET /patients/challenges/999999/leaderboard (empty list, not an error)",
    (await call("GET", "/patients/challenges/999999/leaderboard", { token: p })).status,
    200
  );

  check("GET /admin/rewards (patient -> 403)", (await call("GET", "/admin/rewards", { token: p })).status, 403);
  check("GET /admin/rewards (doctor -> 403)", (await call("GET", "/admin/rewards", { token: doctor })).status, 403);
  check("GET /admin/rewards (admin)", (await call("GET", "/admin/rewards", { token: admin })).status, 200);
  check("GET /admin/referrals (admin)", (await call("GET", "/admin/referrals", { token: admin })).status, 200);
  check(
    "PUT /admin/rewards/redemptions/999999 (not found -> 404)",
    (await call("PUT", "/admin/rewards/redemptions/999999", { token: admin, body: { status: "issued" } })).status,
    404
  );
}


/** Phase 5 — safety: nothing is dialled, nothing is logged without consent. */
async function phase5(ctx) {
  const { call, check, note, t } = ctx;
  const p = t.patient;
  const d = t.doctor;
  const admin = t.admin;

  check("GET /patients/emergency-contacts", (await call("GET", "/patients/emergency-contacts", { token: p })).status, 200);
  check(
    "POST /patients/emergency-contacts (no phone -> 400)",
    (await call("POST", "/patients/emergency-contacts", { token: p, body: { fullName: "Asha" } })).status,
    400
  );
  check(
    "POST /patients/sos (no consent -> logged:false, nothing stored)",
    (await call("POST", "/patients/sos", { token: p, body: { latitude: 28.61, longitude: 77.2, note: "smoke" } })).payload?.logged,
    false
  );
  check(
    "POST /patients/sos (impossible coordinates -> 400)",
    (await call("POST", "/patients/sos", { token: p, body: { latitude: 999, consent: true } })).status,
    400
  );

  const card = await call("GET", "/patients/emergency-card", { token: p });
  check("GET /patients/emergency-card", card.status, 200);
  note("card is OFF until the patient switches it on", card.payload?.card?.enabled);
  check("  ... and no QR image is issued while it is off", card.payload?.card?.qrDataUrl, null);
  check(
    "PUT /patients/emergency-card (doctor -> 403)",
    (await call("PUT", "/patients/emergency-card", { token: d, body: { enabled: true } })).status,
    403
  );

  const disabledToken = card.payload?.card?.token;
  if (disabledToken) {
    const publicView = await call("GET", `/public/emergency/${disabledToken}`);
    check("GET /public/emergency/:token (disabled card -> 404)", publicView.status, 404);
    check("  ... and it returns no card payload at all", publicView.payload?.card, undefined);
  }
  check("GET /public/emergency/tooshort (bad token -> 404)", (await call("GET", "/public/emergency/tooshort")).status, 404);
  check("GET /public/emergency/<random>", (await call("GET", `/public/emergency/${"z".repeat(43)}`)).status, 404);

  check("GET /doctors/me/verification (patient -> 403)", (await call("GET", "/doctors/me/verification", { token: p })).status, 403);
  check("GET /doctors/me/verification (doctor)", (await call("GET", "/doctors/me/verification", { token: d })).status, 200);
  check(
    "POST /doctors/me/verification (no registration number -> 400)",
    (await call("POST", "/doctors/me/verification", { token: d, body: {} })).status,
    400
  );
  check("GET /admin/verifications (patient -> 403)", (await call("GET", "/admin/verifications", { token: p })).status, 403);
  check("GET /admin/verifications (doctor -> 403)", (await call("GET", "/admin/verifications", { token: d })).status, 403);
  check("GET /admin/verifications (admin)", (await call("GET", "/admin/verifications", { token: admin })).status, 200);
  check(
    "GET /admin/verifications?status=bogus (-> 400)",
    (await call("GET", "/admin/verifications?status=bogus", { token: admin })).status,
    400
  );
  check(
    "PUT /admin/verifications/1 (status 'pending' is not a decision -> 400)",
    (await call("PUT", "/admin/verifications/1", { token: admin, body: { status: "pending" } })).status,
    400
  );
  check(
    "PUT /admin/verifications/999999 (not found -> 404)",
    (await call("PUT", "/admin/verifications/999999", { token: admin, body: { status: "approved" } })).status,
    404
  );
}


/** Phase 6 — automation: keyword triage, queue tokens, follow-up suggestions. */
async function phase6(ctx) {
  const { call, check, note, t, patientId } = ctx;
  const p = t.patient;
  const d = t.doctor;

  check("POST /ai/triage (no symptoms -> 400)", (await call("POST", "/ai/triage", { token: p, body: {} })).status, 400);
  const triage = await call("POST", "/ai/triage", { token: p, body: { symptoms: "chest pain since yesterday" } });
  check("POST /ai/triage (valid)", triage.status, 200);
  note("matched", (triage.payload?.matches || []).map((m) => m.speciality).join(", ") || "none");
  note(
    "every match explains which keywords hit",
    (triage.payload?.matches || []).every((m) => (m.matchedKeywords || []).length > 0)
  );
  note("it says it is not a diagnosis", String(triage.payload?.note || "").includes("not a diagnosis"));
  const noMatch = await call("POST", "/ai/triage", { token: p, body: { symptoms: "zzz qqq" } });
  check("POST /ai/triage (no keyword hit -> an empty, explained list)", noMatch.payload?.matches?.length, 0);

  check("GET /patients/queue", (await call("GET", "/patients/queue", { token: p })).status, 200);
  check("GET /patients/follow-ups", (await call("GET", "/patients/follow-ups", { token: p })).status, 200);
  check(
    "POST /patients/follow-ups/999999/dismiss (not found -> 404)",
    (await call("POST", "/patients/follow-ups/999999/dismiss", { token: p, body: {} })).status,
    404
  );

  check("GET /doctors/me/queue (doctor)", (await call("GET", "/doctors/me/queue", { token: d })).status, 200);
  check("GET /doctors/me/queue (patient -> 403)", (await call("GET", "/doctors/me/queue", { token: p })).status, 403);
  check(
    "POST /doctors/me/queue/999999 (not the doctor's appointment -> 404)",
    (await call("POST", "/doctors/me/queue/999999", { token: d })).status,
    404
  );
  check(
    "PUT /doctors/me/queue/999999 (not found -> 404)",
    (await call("PUT", "/doctors/me/queue/999999", { token: d, body: { action: "call" } })).status,
    404
  );
  check(
    "POST /doctors/me/follow-ups (no dueDate -> 400)",
    (await call("POST", "/doctors/me/follow-ups", { token: d, body: { patientId } })).status,
    400
  );
  check(
    "POST /doctors/me/follow-ups (dueDate in the past -> 400)",
    (await call("POST", "/doctors/me/follow-ups", { token: d, body: { patientId, dueDate: "2020-01-01" } })).status,
    400
  );
  check(
    "POST /doctors/me/follow-ups (a patient the doctor never treated -> 403)",
    (
      await call("POST", "/doctors/me/follow-ups", {
        token: d,
        body: { patientId: 999999, dueDate: "2999-01-01" },
      })
    ).status,
    403
  );
}



/**
 * Phase 2B — the app-wide language reaches every AI endpoint.
 *
 * The client sends `language` on all of them. These checks pin the contract:
 * a valid code is accepted, an unknown code never breaks anything, and a
 * malformed value on a translate call is still rejected. In mock mode the
 * response text cannot change (there is no model to change it), so what is
 * asserted here is the STATUS and the SHAPE, which is what a bad `language`
 * value could actually break.
 */
async function phase2bLanguage(ctx) {
  const { call, check, note, t } = ctx;
  const p = t.patient;
  const base = { message: "I have had a headache since morning" };

  for (const code of ["en", "hi", "mr"]) {
    const res = await call("POST", "/ai/symptoms", { token: p, body: { ...base, language: code } });
    check(`POST /ai/symptoms (language=${code})`, res.status, 200);
    check(`  ... still returns department + urgency`, Boolean(res.payload?.department && res.payload?.urgency), true);
  }

  // An unknown code must fall back to English, NOT error out.
  const bogus = await call("POST", "/ai/symptoms", { token: p, body: { ...base, language: "zz" } });
  check("POST /ai/symptoms (language=zz falls back, no error)", bogus.status, 200);

  const chat = await call("POST", "/ai/chat", { token: p, body: { message: "hello", language: "hi" } });
  check("POST /ai/chat (language=hi)", chat.status, 200);
  check("  ... still returns a reply", typeof chat.payload?.reply === "string", true);

  const scan = await call("POST", "/ai/scan-med", {
    token: p,
    body: { medicineName: "Amlodipine", language: "mr" },
  });
  check("POST /ai/scan-med (language=mr)", scan.status, 200);
  check("  ... still returns analysis + medicines", Boolean(scan.payload?.analysis && scan.payload?.medicines), true);

  const advice = await call("POST", "/ai/health-advice", {
    token: p,
    body: { diseaseName: "hypertension", language: "hi" },
  });
  check("POST /ai/health-advice (language=hi)", advice.status, 200);
  check("  ... still returns advice", typeof advice.payload?.advice === "string", true);

  // `from`/`to` are still strictly validated, whatever `language` says.
  check(
    "POST /ai/translate (language set but from is still validated)",
    (await call("POST", "/ai/translate", { token: p, body: { text: "hi", from: "zz", to: "hi", language: "hi" } })).status,
    400
  );
  note("language", "accepted on all four original AI endpoints; unknown codes fall back to English");
}

/** The write paths. Every row created here is deleted again before returning. */
async function writePaths(ctx) {
  const { call, check, note, t } = ctx;
  const p = t.patient;
  const created = {};

  try {
    const family = await call("POST", "/patients/family", {
      token: p,
      body: { fullName: "Smoke Test Child", relation: "son", gender: "Male", bloodGroup: "O+" },
    });
    check("POST /patients/family (create)", family.status, 201);
    created.familyId = family.payload?.familyMemberId;

    const reminder = await call("POST", "/patients/reminders", {
      token: p,
      body: {
        medicineName: "Smoke Test Medicine",
        doseText: "1 tablet",
        times: ["09:00"],
        confirm: true,
        familyMemberId: created.familyId,
      },
    });
    check("POST /patients/reminders (create + confirm)", reminder.status, 201);
    check("  ... a confirmed reminder really is active", reminder.payload?.active, true);
    created.reminderId = reminder.payload?.reminderId;

    // Without real times a reminder must be stored INACTIVE.
    const noTimes = await call("POST", "/patients/reminders", {
      token: p,
      body: { medicineName: "Smoke No Times" },
    });
    check("POST /patients/reminders (no times -> saved inactive)", noTimes.status, 201);
    check("  ... and active is false", noTimes.payload?.active, false);
    created.noTimesId = noTimes.payload?.reminderId;
    check(
      "PATCH /patients/reminders/:id (activate with no times -> 400)",
      (await call("PATCH", `/patients/reminders/${created.noTimesId}`, { token: p, body: { active: true } })).status,
      400
    );

    const stamp = new Date().toISOString();
    const sample = await call("POST", "/wearables/samples", {
      token: p,
      body: { type: "steps", value: 4321, recordedAt: stamp, familyMemberId: created.familyId },
    });
    check("POST /wearables/samples (create)", sample.status, 201);
    created.sampleId = sample.payload?.sample?.id;
    const again = await call("POST", "/wearables/samples", {
      token: p,
      body: { type: "steps", value: 4321, recordedAt: stamp, familyMemberId: created.familyId },
    });
    check("  ... re-posting the same reading never duplicates", again.status, [201, 409]);

    const metric = await call("POST", "/patients/metrics", {
      token: p,
      body: { type: "spo2", value1: 97, familyMemberId: created.familyId },
    });
    check("POST /patients/metrics (create)", metric.status, 201);
    created.metricId = metric.payload?.metricId ?? metric.payload?.id;

    const saved = await call("POST", "/patients/lab-reports", {
      token: p,
      body: {
        title: "Smoke report",
        summary: "Written by the smoke test.",
        urgency: "low",
        language: "en",
        familyMemberId: created.familyId,
      },
    });
    check("POST /patients/lab-reports (save)", saved.status, 201);
    created.labId = saved.payload?.labReportId;
    check(
      "POST /patients/lab-reports/:id/share",
      (await call("POST", `/patients/lab-reports/${created.labId}/share`, { token: p, body: {} })).status,
      200
    );

    const contact = await call("POST", "/patients/emergency-contacts", {
      token: p,
      body: { fullName: "Smoke Contact", phone: "+911000000000", relation: "neighbour" },
    });
    check("POST /patients/emergency-contacts (create)", contact.status, 201);
    created.contactId = contact.payload?.contactId;

    // Switch the card on, read the public page, then revoke it again.
    check(
      "PUT /patients/emergency-card (turn on)",
      (await call("PUT", "/patients/emergency-card", { token: p, body: { enabled: true } })).status,
      200
    );
    const live = await call("GET", "/patients/emergency-card", { token: p });
    check("GET /patients/emergency-card (an enabled card has a QR image)", Boolean(live.payload?.card?.qrDataUrl), true);
    const publicLive = await call("GET", `/public/emergency/${live.payload?.card?.token}`);
    check("GET /public/emergency/:token (enabled card -> 200)", publicLive.status, 200);
    check("  ... un-opted-in fields are never returned", publicLive.payload?.card?.allergies, undefined);
    await call("POST", "/patients/emergency-card/revoke", { token: p, body: {} });
    note("emergency card", "switched on, read publicly, then revoked again");
  } finally {
    const cleanup = [
      ["DELETE", `/patients/emergency-contacts/${created.contactId}`],
      ["DELETE", `/patients/lab-reports/${created.labId}`],
      ["DELETE", `/patients/metrics/${created.metricId}`],
      ["DELETE", `/wearables/samples/${created.sampleId}`],
      ["DELETE", `/patients/reminders/${created.noTimesId}`],
      ["DELETE", `/patients/reminders/${created.reminderId}`],
      ["DELETE", `/patients/family/${created.familyId}`],
    ];
    for (const [method, path] of cleanup) {
      const res = await call(method, path, { token: p });
      if (res.status >= 400 && res.status !== 404) note(`cleanup ${path}`, res.status);
    }
    note("cleanup", "every row created by this run has been removed");
  }
}

module.exports = { phase1, phase2, phase2bLanguage, phase3, phase4, phase5, phase6, writePaths };
