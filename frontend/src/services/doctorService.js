import api from "./api";

export const listDoctors = (specialization) =>
  api.get("/doctors", { params: specialization ? { specialization } : {} }).then((r) => r.data.doctors);

export const getDoctor = (id) => api.get(`/doctors/${id}`).then((r) => r.data);

export const getMyProfile = () => api.get("/doctors/me/profile").then((r) => r.data.profile);
export const updateMyProfile = (payload) => api.put("/doctors/me/profile", payload).then((r) => r.data);

export const getMyAppointments = () => api.get("/doctors/me/appointments").then((r) => r.data.appointments);
export const updateAppointmentStatus = (id, status) =>
  api.put(`/doctors/me/appointments/${id}`, { status }).then((r) => r.data);

export const getMyPatients = () => api.get("/doctors/me/patients").then((r) => r.data.patients);

// Write a prescription for a patient (Prescription History feature)
export const addPrescription = (payload) => api.post("/patients/prescriptions", payload).then((r) => r.data);

// Add a medical history record for a patient
export const addMedicalHistory = (payload) => api.post("/patients/medical-history", payload).then((r) => r.data);
