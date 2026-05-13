import axios from "axios";

/**
 * Axios API client instance
 * - Base URL from environment
 * - JWT token interceptor
 * - 401 auto-logout interceptor
 */
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    // Access token from localStorage (Zustand persist)
    if (typeof window !== "undefined") {
      const authStorage = localStorage.getItem("tradenova-auth");
      if (authStorage) {
        try {
          const { state } = JSON.parse(authStorage);
          if (state?.token) {
            config.headers.Authorization = `Bearer ${state.token}`;
          }
        } catch {
          // Invalid storage — ignore
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 (token expired)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("tradenova-auth");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
