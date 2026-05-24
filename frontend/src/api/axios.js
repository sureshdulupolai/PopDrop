import axios from "axios";
import { refreshToken } from "./refresh"; // naya file

const api = axios.create({
  baseURL: "http://localhost:8000/auth/",
});

let loadingCallback = null;
let activeRequests = 0;

export const setLoadingInterceptor = (callback) => {
  loadingCallback = callback;
};

const updateLoading = (val) => {
  if (val) {
    activeRequests++;
    if (loadingCallback) loadingCallback(true);
  } else {
    activeRequests--;
    if (activeRequests <= 0) {
      activeRequests = 0;
      if (loadingCallback) loadingCallback(false);
    }
  }
};

// Add access token automatically
api.interceptors.request.use((config) => {
  updateLoading(true);
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => {
  updateLoading(false);
  return Promise.reject(error);
});

// Response interceptor for 401
api.interceptors.response.use(
  (res) => {
    updateLoading(false);
    return res;
  },
  async (error) => {
    updateLoading(false);
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
