/**
 * Phase 2B — a REAL browser check.
 *
 * `ui-check.js` talks to the API and proves the endpoints answer. It cannot see
 * a single line of React, which is why `HealthTranslator` shipped with
 * `const canTranslate = text.trim()...` stranded outside the component: that is
 * valid JavaScript, so it transformed cleanly and then threw on render and
 * blanked the app.
 *
 * So this launches real Chrome, signs in as each role, clicks through the nav
 * tabs and every Health Hub card, and FAILS if the browser console reports any
 * error or uncaught exception at any point. It also asserts each screen
 * actually painted something, so a blank page cannot pass as success.
 *
 *   node scripts/browser-check.js
 *
 * Env: APP=<url> (default http://localhost:5173 — must match CORS_ORIGIN),
 * CHROME=<path>, KEEP=1 to leave the browser open, SHOTS=<dir> to save a PNG
 * per screen. Also audits the live DOM for form controls with no id/name and
 * reports the document's CSP plus anything CSP blocked.
 */
import { spawn } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

// Must match the backend's CORS_ORIGIN (see backend/.env, default
// http://localhost:5173). Pointing this at another origin — 127.0.0.1:5178 was
// the old default — makes every sign-in fail with "check your connection to the
// server", and it fails silently: `cors` answers the preflight OPTIONS and ends
// the response without calling next(), so morgan never logs the request and the
// backend looks idle.
const APP = process.env.APP || "http://localhost:5173";
const PORT = 9333 + Math.floor(Math.random() * 400);
const SHOTS = process.env.SHOTS || "";

const CHROME_CANDIDATES = [
  process.env.CHROME,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

const ROLES = {
  patient: { email: "john.doe@example.com", password: "patient123" },
  physician: { email: "doctor@elitecare.com", password: "doctor123" },
  admin: { email: "admin@elitecare.com", password: "admin123" },
};

/** Console noise that is not a defect in our code. */
const IGNORE = [
  /favicon/i,
  /Download the React DevTools/i,
  /\[vite\] connect/i,
  /\[vite\] hot updated/i,
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function findChrome() {
  const hit = CHROME_CANDIDATES.find((p) => p && fs.existsSync(p));
  if (!hit) throw new Error("No Chrome/Edge found. Set CHROME=<path to executable>.");
  return hit;
}

/** Minimal CDP client over the built-in WebSocket. */
class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.handlers = new Map();
    ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
        return;
      }
      const list = this.handlers.get(msg.method);
      if (list) for (const fn of list) fn(msg.params);
    });
  }

  static async attach(port) {
    const deadline = Date.now() + 20000;
    let target = null;
    while (Date.now() < deadline) {
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json/list`);
        const list = await res.json();
        target = list.find((t) => t.type === "page" && t.webSocketDebuggerUrl);
        if (target) break;
      } catch {
        /* not up yet */
      }
      await sleep(250);
    }
    if (!target) throw new Error("Chrome did not expose a debuggable page in time.");

    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.addEventListener("open", resolve, { once: true });
      ws.addEventListener("error", () => reject(new Error("CDP socket failed")), { once: true });
    });
    return new CDP(ws);
  }

  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  on(method, fn) {
    if (!this.handlers.has(method)) this.handlers.set(method, []);
    this.handlers.get(method).push(fn);
  }

  /** Evaluate in the page and return the JSON result. */
  async eval(expression) {
    const res = await this.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.exception?.description || "evaluate threw");
    }
    return res.result?.value;
  }
}

/** Chrome flags: headless, no first-run UI, a throwaway profile per run. */
function launchChrome(exe, userDataDir) {
  const args = [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${userDataDir}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-gpu",
    "--disable-extensions",
    "--disable-background-networking",
    "--disable-sync",
    "--window-size=1440,1000",
    "about:blank",
  ];
  return spawn(exe, args, { stdio: "ignore" });
}

let errors = [];
// CSP violations are tracked separately from console errors: they are worth
// reporting even when a third-party script caused them, and the blocked URL is
// the whole point of collecting them. Note the Log.entryAdded handler below
// used to *discard* these (it skipped anything whose source !== "javascript"),
// which is exactly why the DevTools "blocks the use of 'eval'" issue went
// unnoticed by this check.
let cspViolations = [];
let docCsp = null;
let chrome;
let profileDir;

/** Everything the driver runs inside the page. */
const HELPERS = `
window.__ui = {
  // Click the first element whose trimmed text matches, as a real user would.
  clickText(text) {
    const nodes = Array.from(document.querySelectorAll('button, a, [role="button"]'));
    const hit = nodes.find((n) => (n.innerText || "").trim().toLowerCase().includes(text.toLowerCase()));
    if (!hit) return false;
    hit.scrollIntoView({ block: "center" });
    hit.click();
    return true;
  },
  // Fill a controlled React input: the native setter is what React listens to.
  fill(placeholder, value) {
    const el = Array.from(document.querySelectorAll("input")).find(
      (i) => (i.placeholder || "").includes(placeholder)
    );
    if (!el) return false;
    const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement : HTMLInputElement;
    Object.getOwnPropertyDescriptor(proto.prototype, "value").set.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    return true;
  },
  submit() {
    const form = document.querySelector("form");
    if (!form) return false;
    form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    return true;
  },
  // Is the app showing our recovery message rather than a blank page?
  // Matched on the marker attribute, not the words: the login page's own
  // fallback error text also says "Something went wrong".
  boundaryText() {
    const el = document.querySelector('[data-error-boundary="true"]');
    return el ? (el.innerText || "").replace(/\\s+/g, " ").trim().slice(0, 200) : "";
  },
  // Is there actually painted content in the main area?
  painted() {
    const main = document.querySelector("main") || document.body;
    return (main.innerText || "").trim().length;
  },
  // Signed in means the login form is gone and the app shell is up.
  signedIn() {
    const form = document.querySelector("form");
    const inputs = Array.from(document.querySelectorAll("input"));
    const stillLogin = !!form && inputs.some((i) => (i.type === "password"));
    return !stillLogin && (document.body.innerText || "").length > 1000;
  },
  // Hub cards live inside a #health-hub-group-* container. Reading the label
  // from the DOM keeps this in step with the i18n dictionaries automatically.
  hubCards() {
    const out = [];
    for (const group of document.querySelectorAll('[id^="health-hub-group-"]')) {
      for (const b of group.querySelectorAll("button")) {
        const label = (b.innerText || "").trim().split("\\n")[0].trim();
        if (label) out.push(label);
      }
    }
    return out;
  },
  cards() {
    return Array.from(document.querySelectorAll("button, a"))
      .map((n) => (n.innerText || "").trim())
      .filter((t) => t.length > 2 && t.length < 60);
  },
  // Accessibility audit, run live against the real DOM. Mirrors the rule the
  // DevTools Issues panel reports ("A form field element should have an id or
  // name attribute") so it can never regress unnoticed again.
  //   idOrName: controls Chrome flags because they have neither
  //   unnamed:  controls with no accessible name at all (worse: screen readers
  //             announce them as just "edit text")
  fields() {
    const out = [];
    for (const el of document.querySelectorAll("input, select, textarea")) {
      if (el.type === "hidden") continue;
      const aria = el.getAttribute("aria-label") || el.getAttribute("aria-labelledby") || el.title;
      let forLabel = false;
      if (el.id) {
        forLabel = !!document.querySelector('label[for="' + el.id + '"]');
      }
      // A control wrapped in <label> is covered; a bare placeholder is not a label.
      out.push({
        tag: el.tagName.toLowerCase(),
        type: el.type || null,
        id: el.id || null,
        name: el.name || null,
        placeholder: el.placeholder || null,
        idOrName: !!(el.id || el.name),
        accessibleName: !!(forLabel || el.closest("label") || aria),
      });
    }
    return out;
  },
};
"ok";`;

/** Snapshot the current console errors so a step only reports its own. */
function drain() {
  const out = errors;
  errors = [];
  return out;
}

let cdp;
let failures = 0;
// Screens the driver could not reach. These used to pass silently, which made
// an untouched screen indistinguishable from a healthy one.
let skipped = 0;

async function shoot(name) {
  if (!SHOTS) return;
  const res = await cdp.send("Page.captureScreenshot", { format: "png" });
  fs.mkdirSync(SHOTS, { recursive: true });
  fs.writeFileSync(path.join(SHOTS, `${name}.png`), Buffer.from(res.data, "base64"));
}

/**
 * Visits one screen: clicks it, waits for React to settle, then asserts that it
 * painted something and that nothing was logged to the console while it did.
 */
async function visit(label, clickExpr) {
  drain();
  const clicked = await cdp.eval(clickExpr);
  if (!clicked) {
    skipped += 1;
    console.log(`SKIP  ${label} (control not found)`);
    return;
  }
  await sleep(900);
  const chars = await cdp.eval("__ui.painted()");
  const boundary = await cdp.eval("__ui.boundaryText()");
  const own = drain();

  if (boundary) {
    failures += 1;
    console.log(`FAIL  ${label} -> hit the error boundary\n        ${boundary.replace(/\s+/g, " ").slice(0, 200)}`);
    return;
  }
  if (!chars || chars < 40) {
    failures += 1;
    console.log(`FAIL  ${label} -> rendered nothing (${chars || 0} chars of text)`);
    return;
  }
  const noise = own.filter((e) => !IGNORE.some((re) => re.test(e.text)));
  if (noise.length) {
    failures += 1;
    console.log(`FAIL  ${label} -> console errors while rendering\n        ${noise.map((e) => e.text).join("\n        ")}`);
    return;
  }
  await auditFields(label);
  console.log(`PASS  ${label} (${chars} chars)`);
}

/**
 * Reads every form control out of the live DOM and fails on the two things the
 * DevTools Issues panel reports for form fields: a control with neither an id
 * nor a name ("A form field element should have an id or name attribute"), and
 * a control with no accessible name at all (a screen reader announces it as
 * just "edit text"). Static grepping cannot do this: attributes span lines and
 * a control can be built at runtime, so the DOM is the only honest source.
 */
async function auditFields(label) {
  let list;
  try {
    list = JSON.parse(await cdp.eval("JSON.stringify(__ui.fields())"));
  } catch {
    return;
  }
  if (!list.length) return;

  const noId = list.filter((f) => !f.idOrName);
  const noName = list.filter((f) => !f.accessibleName);
  if (!noId.length && !noName.length) {
    console.log(`      ${label}: ${list.length} form control(s), all named`);
    return;
  }

  failures += 1;
  console.log(
    `FAIL  ${label}: ${noId.length} control(s) with no id/name, ${noName.length} with no accessible name`
  );
  for (const f of noId) {
    console.log(
      `        no id/name: <${f.tag} type="${f.type}"> placeholder=${JSON.stringify(f.placeholder)}`
    );
  }
  for (const f of noName) {
    console.log(`        no accessible name: <${f.tag} type="${f.type}"> id=${JSON.stringify(f.id)}`);
  }
}

/** Prints what the page was served, and anything CSP blocked, as evidence. */
function reportCsp() {
  console.log("\n=== Content Security Policy ===");
  console.log(docCsp ? `document header: ${docCsp}` : "document header: (none set by this app)");
  if (!cspViolations.length) {
    console.log("violations: none");
    return;
  }
  failures += 1;
  console.log(`violations: ${cspViolations.length}`);
  for (const v of cspViolations) {
    console.log(`  - ${v.text}`);
    if (v.url) console.log(`    blocked: ${v.url}`);
  }
}

/** The screens each role can actually reach, by nav label. */
const TABS = {
  patient: [
    "Home",
    "Patient Dashboard",
    "Health Hub",
    "Health Translator",
    "Lab Report Explainer",
    "Medicine Reminders",
    "Emergency Health Card",
    "AI Consent",
    "Voice Assistance",
    "Find the Doctor",
    "Nearby Hospitals",
    "Medicine Scanner",
    "Quick Symptom Log",
    "Lab Tests",
  ],
  physician: ["Home", "Doctor Dashboard", "Voice Assistance", "Find the Doctor"],
  admin: ["Home", "Admin Dashboard", "Voice Assistance", "Nearby Hospitals"],
};

/**
 * Puts the app back on the Health Hub screen.
 *
 * There is no "Health Hub" nav item — it is reached from the patient dashboard
 * via "Open Health Hub" — so both hops are needed after visiting a card.
 */
async function openHub() {
  await cdp.eval('__ui.clickText("Patient Dashboard")');
  await sleep(800);
  const ok = await cdp.eval('__ui.clickText("Open Health Hub")');
  await sleep(1000);
  return ok;
}

(async () => {
  const exe = findChrome();
  profileDir = fs.mkdtempSync(path.join(os.tmpdir(), "elitecare-chrome-"));
  chrome = launchChrome(exe, profileDir);

  try {
    cdp = await CDP.attach(PORT);
  } catch (err) {
    console.error("Could not attach to Chrome:", err.message);
    chrome.kill();
    process.exit(1);
  }

  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Log.enable");
  await cdp.send("Network.enable");

  // Collect everything the page complains about. Note the drain() call in the
  // role loop runs AFTER these are attached, so a startup crash is not lost.
  cdp.on("Runtime.exceptionThrown", (p) => {
    const d = p.exceptionDetails;
    errors.push({
      text: d.exception?.description || d.text || "uncaught exception",
      fatal: true,
    });
  });
  cdp.on("Runtime.consoleAPICalled", (p) => {
    if (p.type !== "error") return;
    errors.push({ text: (p.args || []).map((a) => a.value ?? a.description ?? a.type).join(" "), fatal: false });
  });
  cdp.on("Log.entryAdded", (p) => {
    const e = p.entry;
    // Network 4xx/5xx are the API saying no, which each screen renders on
    // purpose. Only script errors should fail this check.
    if (e.level !== "error") return;
    // Keep CSP violations: they name the blocked resource, which is the only
    // way to tell our own script from a third party's.
    const asText = `${e.text || ""} ${e.url || ""}`;
    if (/content security policy|refused to (evaluate|load|execute|connect|apply)/i.test(asText)) {
      cspViolations.push({ text: (e.text || "").trim(), url: e.url || null, source: e.source || null });
      return;
    }
    if (e.source && e.source !== "javascript") return;
    errors.push({ text: asText.trim(), fatal: false });
  });
  // The document's own CSP header, if the page is served with one. A blank page
  // served by a different origin than the API is the usual reason a CSP shows
  // up that is nowhere in this repository.
  cdp.on("Network.responseReceived", (p) => {
    if (p.type !== "Document") return;
    const headers = p.response?.headers || {};
    const key = Object.keys(headers).find((k) => k.toLowerCase() === "content-security-policy");
    if (key) docCsp = headers[key];
  });

  console.log(`Driving ${exe}`);
  console.log(`App under test: ${APP}\n`);

  await cdp.send("Page.navigate", { url: APP });
  await sleep(3500);
  await cdp.eval(HELPERS);
  await cdp.send("Page.addScriptToEvaluateOnNewDocument", { source: HELPERS });

  for (const [role, creds] of Object.entries(ROLES)) {
    console.log(`\n=== ${role.toUpperCase()} ===`);

    // Reload per role so each session starts signed out.
    await cdp.send("Page.navigate", { url: APP });
    await sleep(3000);
    await cdp.eval(HELPERS);

    // Captured AFTER the navigate above: a crash during startup is exactly the
    // thing this check exists to report.
    const startup = drain();
    const loginChars = await cdp.eval("__ui.painted()");
    if (!loginChars || loginChars < 50) {
      failures += 1;
      const noise = startup.filter((e) => !IGNORE.some((re) => re.test(e.text)));
      console.log(`FAIL  ${role}: blank screen — the app crashed before rendering (${loginChars || 0} chars)`);
      if (noise.length) {
        console.log(`        cause: ${noise.map((e) => e.text.split("\n")[0]).join("\n               ")}`);
      } else {
        console.log("        cause: no console output captured");
      }
    } else {
      console.log(`PASS  ${role}: login screen renders (${loginChars} chars)`);
      await auditFields(`${role}: login screen`);
      // The boundary check lives in visit(); without it here a crashed login
      // page reports as a healthy "renders" and the real cause is lost.
      const loginBoundary = await cdp.eval("__ui.boundaryText()");
      const loginNoise = startup.filter((e) => !IGNORE.some((re) => re.test(e.text)));
      if (loginBoundary) {
        console.log(`      login screen hit the error boundary: ${loginBoundary.replace(/\s+/g, " ")}`);
      }
      if (loginNoise.length) {
        console.log(`      login screen console: ${loginNoise.map((e) => e.text.split("\n")[0]).join(" | ")}`);
      }
    }
    await shoot(`${role}-login`);

    const filled = await cdp.eval(
      `__ui.fill("email","${creds.email}") && __ui.fill("password","${creds.password}") && __ui.submit()`
    );
    if (!filled) {
      failures += 1;
      console.log(`FAIL  ${role}: could not fill the login form`);
      const seen = await cdp.eval("(document.body.innerText || '').replace(/\\s+/g, ' ').slice(0, 300)");
      const inputs = await cdp.eval(
        "JSON.stringify(Array.from(document.querySelectorAll('input')).map(i => i.placeholder || i.type))"
      );
      console.log(`        url: ${await cdp.eval("location.href")}`);
      console.log(`        page text: ${seen}`);
      console.log(`        inputs found: ${inputs}`);
      continue;
    }
    // Wait for the sign-in to actually take. LoginPage defers the switch by
    // 600ms, so a fixed sleep is flaky; poll until the login form is gone.
    let signedIn = false;
    for (let i = 0; i < 40; i += 1) {
      await sleep(400);
      if (await cdp.eval("__ui.signedIn()")) {
        signedIn = true;
        break;
      }
    }
    if (!signedIn) {
      failures += 1;
      console.log(`FAIL  ${role}: still on the login screen after sign-in`);
      const why = await cdp.eval(
        `JSON.stringify(Array.from(document.querySelectorAll("p,span,div")).map(n=>n.innerText||"").filter(t=>t&&t.length<200&&/error|invalid|failed|wrong/i.test(t)).slice(0,3))`
      );
      console.log(`        page said: ${why}`);
      continue;
    }
    console.log(`PASS  ${role}: signed in`);
    await auditFields(`${role}: home`);
    await shoot(`${role}-home`);

    for (const tab of TABS[role]) {
      await visit(`${role}: ${tab}`, `__ui.clickText(${JSON.stringify(tab)})`);
      await shoot(`${role}-${tab.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`);
    }

    // Every Health Hub card. The labels are read out of the rendered hub rather
    // than hardcoded, so this cannot drift from the i18n dictionaries.
    if (role === "patient") {
      const opened = await openHub();
      if (!opened) {
        failures += 1;
        console.log("FAIL  patient: could not reach the Health Hub from the dashboard");
      } else {
        await visit("patient: Health Hub itself", "true");

        const cards = await cdp.eval("JSON.stringify(__ui.hubCards())");
        const list = JSON.parse(cards);
        console.log(`      hub exposes ${list.length} card(s): ${list.join(" | ")}`);

        for (const card of list) {
          const backHome = await openHub();
          if (!backHome) {
            failures += 1;
            console.log(`FAIL  patient: could not return to the hub for "${card}"`);
            break;
          }
          await visit(`patient: Hub card "${card}"`, `__ui.clickText(${JSON.stringify(card)})`);
          await shoot(`hub-${card.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`);
        }
      }
    }

    // Sign out for the next role.
    await cdp.eval("try { localStorage.clear(); sessionStorage.clear(); } catch (e) {}");
  }

  reportCsp();
  if (skipped) console.log(`\n${skipped} screen(s) SKIPPED — the nav label was not found, so they are NOT covered.`);
  console.log(failures ? `\n${failures} BROWSER CHECK FAILURE(S)\n` : "\nALL BROWSER CHECKS PASSED\n");
  process.exitCode = failures ? 1 : 0;
})()
  .catch((err) => {
    console.error("browser-check errored:", err.stack || err.message);
    process.exitCode = 1;
  })
  .finally(() => {
    try {
      chrome?.kill();
    } catch {
      /* already gone */
    }
    try {
      if (profileDir && !process.env.KEEP) fs.rmSync(profileDir, { recursive: true, force: true });
      else if (profileDir) console.log("Chrome profile kept at", profileDir);
    } catch {
      /* best effort */
    }
  });