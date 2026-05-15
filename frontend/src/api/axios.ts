import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

const { VITE_BACKEND_URL } = import.meta.env;

const api = axios.create({
  baseURL: VITE_BACKEND_URL,
  withCredentials: true,
});

// Global refresh lock: if multiple requests fail with 401 simultaneously, only
// one refresh call is made. Others are queued and replayed once the refresh completes.
let isRefreshing = false;
let refreshQueue: Array<() => void> = [];

const drainQueue = () => {
  refreshQueue.forEach((resolve) => resolve());
  refreshQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle rate limiting (429 Too Many Requests)
    if (error.response?.status === 429) {
      toast.error("Limite de requêtes atteinte. Veuillez réessayer dans quelques secondes.", {
        id: "rate-limit",
      });
      return Promise.reject(error);
    }

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Login/register failures must reach the form's catch — no redirect
    const isAuthFormEndpoint =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register");
    if (isAuthFormEndpoint) {
      return Promise.reject(error);
    }

    if (originalRequest._retry || originalRequest.url?.includes("/auth/")) {
      useAuthStore.getState().clearAuth();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Another refresh is already in progress — queue this request and wait
    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshQueue.push(() => resolve(api(originalRequest)));
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await api.post("/auth/refresh");
      drainQueue();
      return api(originalRequest);
    } catch (refreshError) {
      refreshQueue = [];
      useAuthStore.getState().clearAuth();
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
