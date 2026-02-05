import axios from "axios";

export const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) throw new Error("No refresh token");

  const res = await axios.post(
    "https://popdrop-backend-2.onrender.com//auth/token/refresh/",
    { refresh }
  );

  localStorage.setItem("access_token", res.data.access);
  return res.data.access;
};
