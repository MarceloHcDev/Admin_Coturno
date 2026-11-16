import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8001/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor para injetar o Bearer Token e garantir Accept: application/json
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers.Accept = "application/json";
  return config;
});

// Interceptor para redirecionar para /login se a sessão expirar (401, 419)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isSessionExpired =
      status === 401 ||
      status === 419 ||
      (status === 403 &&
        typeof error.response?.data?.message === "string" &&
        error.response.data.message.toLowerCase().includes("token"));

    if (isSessionExpired && window.location.pathname !== "/login") {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_token_expires_at");
      window.location.href = "/login?session_expired=1";
    }
    return Promise.reject(error);
  },
);

export default api;
