/**
 * Notification / reminder delivery layer (Phase 0).
 *
 * Every provider implements the same tiny interface:
 *     { name, implemented, isConfigured(), send({ userId, title, message, meta }) }
 * and `send()` either resolves with a delivery result or throws. It must never
 * resolve for a message that was not actually handed to the transport.
 *
 * Providers
 *   inapp   – fully implemented, writes to the existing `notifications` table
 *   console – fully implemented, log-only transport for local development
 *   twilio  – adapter skeleton, throws unless its env vars exist (and it is not
 *             implemented in this build, so it never claims a delivery)
 *   msg91   – adapter skeleton, same rules as twilio
 *
 * Privacy: message bodies are health data. They are stored in the database for
 * `inapp`, but they are NEVER printed to the console/logs unless
 * NOTIFY_LOG_BODY=true AND NODE_ENV !== "production".
 */
require("dotenv").config();
const { pool } = require("../config/db");

const DEFAULT_PROVIDER = String(process.env.REMINDER_PROVIDER || "console").toLowerCase().trim();

function isTruthy(value) {
  return String(value || "").toLowerCase() === "true";
}

function notConfigured(provider, vars) {
  return new Error(`${provider} provider is not configured — set ${vars.join(", ")} in backend/.env.`);
}

function notImplemented(provider) {
  return new Error(
    `${provider} provider is configured but not implemented in this build: no ${provider} SDK is bundled, ` +
      `and this app never reports a delivery that did not happen.`
  );
}

// --------------------------------------------------------------------------
// inapp — the only provider that persists: writes to `notifications`
// --------------------------------------------------------------------------
const inapp = {
  name: "inapp",
  implemented: true,
  isConfigured() {
    return true;
  },
  async send({ userId, title, message }) {
    if (!userId) throw new Error("inapp provider requires a userId.");
    if (!title) throw new Error("inapp provider requires a title.");

    // Column limits: title VARCHAR(150), message VARCHAR(255)
    const safeTitle = String(title).slice(0, 150);
    const safeMessage = message == null ? null : String(message).slice(0, 255);

    const [result] = await pool.query(
      "INSERT INTO notifications (user_id, title, message) VALUES (?,?,?)",
      [userId, safeTitle, safeMessage]
    );
    return { provider: "inapp", transport: "inapp", delivered: true, id: result.insertId };
  },
};

// --------------------------------------------------------------------------
// console — log-only transport, used as the default in development
// --------------------------------------------------------------------------
const consoleProvider = {
  name: "console",
  implemented: true,
  isConfigured() {
    return true;
  },
  async send({ userId, title, message }) {
    if (!userId) throw new Error("console provider requires a userId.");
    const showBody = isTruthy(process.env.NOTIFY_LOG_BODY) && process.env.NODE_ENV !== "production";

    if (showBody) {
      console.log(`[notify:console] user=${userId} title="${title}" message="${message}"`);
    } else {
      console.log(
        `[notify:console] user=${userId} — message body withheld ` +
          `(set NOTIFY_LOG_BODY=true locally to print it; never enabled in production).`
      );
    }

    return { provider: "console", transport: "console", delivered: true, logOnly: true };
  },
};


// --------------------------------------------------------------------------
// twilio — SMS adapter skeleton (no SDK bundled, never fakes a send)
// --------------------------------------------------------------------------
const twilio = {
  name: "twilio",
  implemented: false,
  isConfigured() {
    return Boolean(
      process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER
    );
  },
  async send() {
    if (!this.isConfigured()) {
      throw notConfigured("twilio", ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER"]);
    }
    throw notImplemented("twilio");
  },
};

// --------------------------------------------------------------------------
// msg91 — SMS adapter skeleton (no SDK bundled, never fakes a send)
// --------------------------------------------------------------------------
const msg91 = {
  name: "msg91",
  implemented: false,
  isConfigured() {
    return Boolean(process.env.MSG91_AUTH_KEY && process.env.MSG91_SENDER_ID && process.env.MSG91_TEMPLATE_ID);
  },
  async send() {
    if (!this.isConfigured()) {
      throw notConfigured("msg91", ["MSG91_AUTH_KEY", "MSG91_SENDER_ID", "MSG91_TEMPLATE_ID"]);
    }
    throw notImplemented("msg91");
  },
};

const REGISTRY = { inapp, console: consoleProvider, twilio, msg91 };

function resolveProvider(name) {
  const key = String(name || DEFAULT_PROVIDER).toLowerCase().trim();
  const provider = REGISTRY[key];
  if (!provider) {
    throw new Error(`Unknown notification provider "${key}". Known providers: ${Object.keys(REGISTRY).join(", ")}.`);
  }
  return provider;
}

function listProviders() {
  return Object.values(REGISTRY).map((p) => ({
    name: p.name,
    implemented: p.implemented === true,
    configured: p.isConfigured(),
  }));
}

/**
 * Deliver one notification.
 * @param {object} payload
 * @param {number} payload.userId  recipient (users.id)
 * @param {string} payload.title   short human title (no clinical detail preferred)
 * @param {string} [payload.message]
 * @param {string} [payload.provider] "inapp" | "console" | "twilio" | "msg91" (default REMINDER_PROVIDER)
 * @param {string} [payload.channel] alias for `provider`, kept for readability at call sites
 * @returns {Promise<{provider:string, transport:string, delivered:boolean}>}
 */
async function deliver(payload = {}) {
  const { provider: requested, channel, ...rest } = payload;
  const provider = resolveProvider(requested || channel);
  return provider.send(rest);
}

module.exports = {
  deliver,
  send: deliver,
  resolveProvider,
  listProviders,
  DEFAULT_PROVIDER,
  PROVIDER_NAMES: Object.keys(REGISTRY),
};
