import axios from "axios";
import { refreshToken } from "./refresh";

const privateApi = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

privateApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

privateApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const newToken = await refreshToken();
      original.headers.Authorization = `Bearer ${newToken}`;
      return privateApi(original);
    }
    return Promise.reject(error);
  }
);

export default privateApi;
