import axios from "axios";
import { mockAdapter } from "./mockApi";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 15000,
});

if (!import.meta.env.VITE_API_URL) {
  api.defaults.adapter = mockAdapter;
}

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fd_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle auth errors globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("fd_token");
      localStorage.removeItem("fd_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
