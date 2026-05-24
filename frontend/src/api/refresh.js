import axios from "axios";
import { BASE_URL } from "./config";

export const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) throw new Error("No refresh token");

  const res = await axios.post(
    `${BASE_URL}/auth/token/refresh/`,
    { refresh }
  );

  localStorage.setItem("access_token", res.data.access);
  return res.data.access;
};
