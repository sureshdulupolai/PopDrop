import api from "./api";

export const getProfile = () => api.get("/auth/profile/");

export const updateProfile = (data) =>
  api.put("/auth/profile/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
