import api from "./api";

export async function loginRequest(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  return data; // { token, user }
}

export async function registerRequest({ fullName, email, password, role, phone }) {
  const { data } = await api.post("/auth/register", { fullName, email, password, role, phone });
  return data; // { token, user }
}

export async function fetchCurrentUser() {
  const { data } = await api.get("/auth/me");
  return data.user;
}

export function persistSession(token, user) {
  localStorage.setItem("elitecare_token", token);
  localStorage.setItem("elitecare_user", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("elitecare_token");
  localStorage.removeItem("elitecare_user");
}

export function getStoredUser() {
  const raw = localStorage.getItem("elitecare_user");
  return raw ? JSON.parse(raw) : null;
}
