import api from "./api";

export const signupUser = (data) => api.post("/auth/signup/", data);
export const loginUser = (data) => api.post("/auth/login/", data);
export const verifyOtp = (data) => api.post("/auth/otp/verify/", data);
export const resendOtp = (data) => api.post("/auth/otp/resend/", data);
