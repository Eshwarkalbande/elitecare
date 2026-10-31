/**
 * Typed-ish wrappers for every Health Hub / phase endpoint added after Phase 0.
 *
 * Conventions copied from services/patientService.js: one small exported
 * function per endpoint, returning the useful slice of `response.data`.
 * All calls go through services/api.js, so the JWT is attached automatically.
 */
import api from "./api";

// ---------------------------------------------------------------- Phase 1A
export const explainLabReport = (formData, onProgress) =>
  api
    .post("/ai/lab-report", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: onProgress,
    })
    .then((r) => r.data);

export const getLabReports = (familyMemberId) =>
  api
    .get("/patients/lab-reports", { params: familyMemberId ? { familyMemberId } : undefined })
    .then((r) => r.data.labReports);

export const saveLabReport = (payload) => api.post("/patients/lab-reports", payload).then((r) => r.data);
export const shareLabReport = (id, doctorId) =>
  api.post(`/patients/lab-reports/${id}/share`, doctorId ? { doctorId } : {}).then((r) => r.data);
export const deleteLabReport = (id) => api.delete(`/patients/lab-reports/${id}`).then((r) => r.data);

// ---------------------------------------------------------------- Phase 1B
export const getReminders = (familyMemberId) =>
  api
    .get("/patients/reminders", { params: familyMemberId ? { familyMemberId } : undefined })
    .then((r) => r.data);

export const proposeReminders = () => api.post("/patients/reminders/propose").then((r) => r.data.proposals);
export const createReminder = (payload) => api.post("/patients/reminders", payload).then((r) => r.data);
export const updateReminder = (id, payload) => api.patch(`/patients/reminders/${id}`, payload).then((r) => r.data);
export const deleteReminder = (id) => api.delete(`/patients/reminders/${id}`).then((r) => r.data);
export const markReminderEvent = (reminderId, eventId, status) =>
  api.post(`/patients/reminders/${reminderId}/events/${eventId}`, { status }).then((r) => r.data);

// ---------------------------------------------------------------- Phase 1C
export const getPreConsultSummary = (appointmentId, options = {}) =>
  api
    .get(`/doctors/appointments/${appointmentId}/pre-consult-summary`, {
      params: { refresh: options.refresh === true, language: options.language },
    })
    .then((r) => r.data);

// ---------------------------------------------------------------- Phase 2A
export const getFamilyMembers = () => api.get("/patients/family").then((r) => r.data.familyMembers);
export const createFamilyMember = (payload) => api.post("/patients/family", payload).then((r) => r.data);
export const updateFamilyMember = (id, payload) => api.put(`/patients/family/${id}`, payload).then((r) => r.data);
export const deleteFamilyMember = (id) => api.delete(`/patients/family/${id}`).then((r) => r.data);

// ---------------------------------------------------------------- Phase 2C
export const translateText = (text, from, to) =>
  api.post("/ai/translate", { text, from, to }).then((r) => r.data);

// ---------------------------------------------------------------- Phase 3
export const getWearableSummary = (range = "7d", familyMemberId) =>
  api
    .get("/wearables/summary", { params: { range, ...(familyMemberId ? { familyMemberId } : {}) } })
    .then((r) => r.data);

export const getWearableSamples = (params = {}) => api.get("/wearables/samples", { params }).then((r) => r.data);
export const addWearableSample = (payload) => api.post("/wearables/samples", payload).then((r) => r.data);
export const importWearableCsv = (payload) => api.post("/wearables/import", payload).then((r) => r.data);
export const deleteWearableSample = (id) => api.delete(`/wearables/samples/${id}`).then((r) => r.data);
export const deleteAllWearableSamples = (familyMemberId) =>
  api
    .delete("/wearables/all", { data: { confirm: true, familyMemberId } })
    .then((r) => r.data);

export const getWearableConnections = () => api.get("/wearables/connections").then((r) => r.data.connections);
