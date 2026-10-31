/**
 * Minute-by-minute background scheduler (Phase 0).
 *
 * Started from server.js. Jobs are registered with registerJob(name, fn) and
 * run sequentially on every tick; a failing job is logged and never stops the
 * others. Later phases register their own jobs:
 *     registerJob("medicine-reminders", require("./reminders").dispatchDue);
 *
 * Env:
 *   SCHEDULER_ENABLED=true|false   (default true — set to false to disable)
 *   SCHEDULER_TIMEZONE=Asia/Kolkata
 *   SCHEDULER_DEBUG=true|false     (logs one line per tick, for local testing)
 */
require("dotenv").config();
const cron = require("node-cron");

const TIMEZONE = process.env.SCHEDULER_TIMEZONE || "Asia/Kolkata";
const TICK_CRON = "* * * * *"; // every minute

const jobs = [];
let task = null;

function isEnabled() {
  return String(process.env.SCHEDULER_ENABLED ?? "true").toLowerCase() !== "false";
}

function registerJob(name, fn) {
  if (typeof fn !== "function") throw new Error(`Scheduler job "${name}" must be a function.`);
  if (jobs.some((j) => j.name === name)) return false;
  jobs.push({ name, fn });
  return true;
}

/** Runs every registered job once. Exported so tests can drive a single tick. */
async function runTick(now = new Date()) {
  const results = [];
  for (const job of jobs) {
    const startedAt = Date.now();
    try {
      const value = await job.fn(now);
      results.push({ job: job.name, ok: true, ms: Date.now() - startedAt, value });
    } catch (err) {
      // Job errors are logged (message only — never the payload/health data).
      console.error(`❌ scheduler: job "${job.name}" failed: ${err.message}`);
      results.push({ job: job.name, ok: false, ms: Date.now() - startedAt, error: err.message });
    }
  }

  if (String(process.env.SCHEDULER_DEBUG || "").toLowerCase() === "true") {
    console.log(
      `⏱  scheduler tick ${now.toISOString()} — ${jobs.length} job(s): ` +
        (results.length ? results.map((r) => `${r.job}:${r.ok ? "ok" : "fail"}`).join(", ") : "none registered")
    );
  }
  return results;
}

/** Starts the cron task. Returns the task, or null when disabled. */
function startScheduler() {
  if (task) return task;

  if (!isEnabled()) {
    console.log("⏸  Scheduler disabled (SCHEDULER_ENABLED=false).");
    return null;
  }

  task = cron.schedule(
    TICK_CRON,
    () => {
      runTick().catch((err) => console.error(`❌ scheduler tick failed: ${err.message}`));
    },
    { timezone: TIMEZONE }
  );

  console.log(`⏱  Scheduler started (every minute, ${TIMEZONE}) — ${jobs.length} job(s) registered.`);
  return task;
}

function stopScheduler() {
  if (!task) return;
  task.stop();
  task = null;
}

module.exports = { registerJob, startScheduler, stopScheduler, runTick, isEnabled, TIMEZONE, TICK_CRON };
