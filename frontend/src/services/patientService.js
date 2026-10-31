import api from "./api";

export const getProfile = () => api.get("/patients/profile").then((r) => r.data.profile);
export const updateProfile = (payload) => api.put("/patients/profile", payload).then((r) => r.data);

export const getAppointments = () => api.get("/patients/appointments").then((r) => r.data.appointments);
export const bookAppointment = (payload) => api.post("/patients/appointments", payload).then((r) => r.data);
export const cancelAppointment = (id) => api.put(`/patients/appointments/${id}/cancel`).then((r) => r.data);

// Medical History
export const getMedicalHistory = () => api.get("/patients/medical-history").then((r) => r.data.records);

// Prescription History
export const getPrescriptions = () => api.get("/patients/prescriptions").then((r) => r.data.prescriptions);
