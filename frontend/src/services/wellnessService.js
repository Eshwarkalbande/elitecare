/**
 * Wellness API wrappers + shared constants for Phase 4 (Track & Rewards) and
 * Phase 6 (Smart automation).
 *
 * Conventions copied from services/patientService.js. Everything goes through
 * services/api.js so the JWT is attached automatically.
 *
 * Note on coins: this is the SERVER-SIDE ledger (phase 4B). The existing
 * client-side XP/Wellness Coins in App.jsx keep working exactly as before —
 * the two systems are deliberately NOT merged (see docs/PHASE4_REPORT.md).
 */
import api from "./api";

/** The five metric types the backend accepts. */
export const HEALTH_METRIC_TYPES = [
  { id: "bp", label: "Blood pressure", unit: "mmHg", dual: true },
  { id: "glucose", label: "Blood sugar", unit: "mg/dL" },
  { id: "weight", label: "Weight", unit: "kg" },
  { id: "spo2", label: "SpO2", unit: "%" },
  { id: "heart_rate", label: "Heart rate", unit: "bpm" },
];

/** Conservative general ranges — used for a "consider a checkup" nudge, never a diagnosis. */
export const METRIC_RANGES = {
  bp: { label: "Blood pressure", min1: 90, max1: 120, min2: 60, max2: 80, unit: "mmHg" },
  glucose: { label: "Blood sugar (fasting)", min1: 70, max1: 110, unit: "mg/dL" },
  weight: { label: "Weight", min1: 25, max1: 200, unit: "kg" },
  spo2: { label: "SpO2", min1: 95, max1: 100, unit: "%" },
  heart_rate: { label: "Heart rate", min1: 55, max1: 100, unit: "bpm" },
};

export const TRACKER_COLORS = {
  bp: "#ef4444",
  glucose: "#f59e0b",
  weight: "#16a34a",
  spo2: "#0ea5e9",
  heart_rate: "#6366f1",
};

// ---------------------------------------------------------------- Phase 4A
export const getMetrics = (params = {}) => api.get("/patients/metrics", { params }).then((r) => r.data);
export const addMetric = (payload) => api.post("/patients/metrics", payload).then((r) => r.data);
export const deleteMetric = (id) => api.delete(`/patients/metrics/${id}`).then((r) => r.data);
export const getMetricTrends = (params = {}) => api.get("/patients/metrics/trends", { params }).then((r) => r.data);

// ---------------------------------------------------------------- Phase 4B
export const getRewards = () => api.get("/patients/rewards").then((r) => r.data);
export const redeemVoucher = (voucherId) =>
  api.post("/patients/rewards/redeem", { voucherId }).then((r) => r.data);

// ---------------------------------------------------------------- Phase 4C
export const getReferral = () => api.get("/patients/referrals").then((r) => r.data);
export const applyReferralCode = (code) => api.post("/patients/referrals/claim", { code }).then((r) => r.data);

// ---------------------------------------------------------------- Phase 4D
export const getChallenges = () => api.get("/patients/challenges").then((r) => r.data);
export const joinChallenge = (id) => api.post(`/patients/challenges/${id}/join`).then((r) => r.data);
export const updateChallengeProgress = (id, progress) =>
  api.post(`/patients/challenges/${id}/progress`, { progress }).then((r) => r.data);
export const getChallengeLeaderboard = (id) =>
  api.get(`/patients/challenges/${id}/leaderboard`).then((r) => r.data);

// ---------------------------------------------------------------- Phase 5
export const getEmergencyContacts = () => api.get("/patients/emergency-contacts").then((r) => r.data.contacts);
export const addEmergencyContact = (payload) => api.post("/patients/emergency-contacts", payload).then((r) => r.data);
export const deleteEmergencyContact = (id) => api.delete(`/patients/emergency-contacts/${id}`).then((r) => r.data);
export const getEmergencyCard = () => api.get("/patients/emergency-card").then((r) => r.data);
export const updateEmergencyCard = (payload) => api.put("/patients/emergency-card", payload).then((r) => r.data);
export const regenerateEmergencyCard = () => api.post("/patients/emergency-card/regenerate").then((r) => r.data);
export const revokeEmergencyCard = () => api.post("/patients/emergency-card/revoke").then((r) => r.data);
export const logSosEvent = (payload) => api.post("/patients/sos", payload).then((r) => r.data);

// ---------------------------------------------------------------- Phase 6
export const getMyQueue = () => api.get("/patients/queue").then((r) => r.data);
export const getMyFollowUps = () => api.get("/patients/follow-ups").then((r) => r.data.followUps);
export const dismissFollowUp = (id) => api.post(`/patients/follow-ups/${id}/dismiss`).then((r) => r.data);

