/**
 * Health Hub feature switches.
 *
 * Every new section added on top of the original app is behind one boolean here.
 * A section whose flag is `false` renders NOTHING at all — no card, no nav item,
 * no empty container — so shipping this file can never change the existing UI.
 *
 * Flip a flag to `true` only once its phase is finished and tested.
 * Do not rename the existing roles ("patient" / "physician" / "admin").
 *
 * Flags are switched on phase by phase; `insurance` and `pharmacy` stay `false`
 * on purpose (Phase 7B builds nothing for them — see docs/INTEGRATIONS.md).
 */
export const FEATURES = Object.freeze({
  // Phase 0 — the hub itself
  healthHub: true,

  // Phase 1 — Care
  labReportExplainer: true,
  medicineReminders: true,
  preConsultSummary: true,

  // Phase 2 — Family and language
  familyProfiles: true,
  appLanguage: true,
  healthTranslator: true,
  voiceMultiLanguage: true,

  // Phase 3 — Wearables
  wearables: true,

  // Phase 4 — Track and rewards
  healthTracker: true,
  rewardsLedger: true,
  referrals: true,
  challenges: true,

  // Phase 5 — Safety and trust
  emergencySos: true,
  emergencyCard: true,
  doctorVerification: true,

  // Phase 6 — Smart automation
  smartBooking: true,
  liveQueue: true,
  followUp: true,

  // Phase 7 — Offline & placeholders
  offlineMode: true,
  // Intentionally NOT built, documented only (docs/INTEGRATIONS.md):
  insurance: false,
  pharmacy: false,
});

/** True when the given feature flag is explicitly enabled. */
export function isFeatureEnabled(key) {
  return FEATURES[key] === true;
}

export default FEATURES;

