import axios from "axios";

export const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) throw new Error("No refresh token");

  const res = await axios.post(
    "http://localhost:8000/auth/token/refresh/",
    { refresh }
  );

  localStorage.setItem("access_token", res.data.access);
  return res.data.access;
};
