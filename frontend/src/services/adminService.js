import api from "./api";

export const getStats = () => api.get("/admin/stats").then((r) => r.data);

// Public health probe used by the admin navbar status pill. VITE_API_URL already
// ends in "/api", so the relative path resolves correctly.
export const getHealth = () => api.get("/health").then((r) => r.data);

export const listUsers = (params) => api.get("/admin/users", { params }).then((r) => r.data.users);
export const createUser = (payload) => api.post("/admin/users", payload).then((r) => r.data);
export const updateUser = (id, payload) => api.put(`/admin/users/${id}`, payload).then((r) => r.data);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`).then((r) => r.data);

export const listAllAppointments = () => api.get("/admin/appointments").then((r) => r.data.appointments);

export const listHospitals = () => api.get("/admin/hospitals").then((r) => r.data.hospitals);
export const createHospital = (payload) => api.post("/admin/hospitals", payload).then((r) => r.data);
