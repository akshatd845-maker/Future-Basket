import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor - add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      if (config.headers && typeof config.headers.set === "function") {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        if (!config.headers) config.headers = {};
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (response.data.success && response.data.accessToken) {
          const newToken = response.data.accessToken;
          localStorage.setItem("accessToken", newToken);
          
          if (originalRequest.headers && typeof originalRequest.headers.set === "function") {
            originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
          } else {
            if (!originalRequest.headers) originalRequest.headers = {};
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          }
          
          return api(originalRequest);
        }
      } catch {
        // Refresh failed, clear tokens
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// Product API calls
export const productApi = {
  getAllProducts: () => api.get("/products"),
  getProductById: (id) => api.get(`/products/${id}`),
};

// Auth API calls
export const authApi = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
};

export default api;