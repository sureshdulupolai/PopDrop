import api from "./api";

export const signupUser = (data) => api.post("/auth/signup/", data);
export const loginUser = (data) => api.post("/auth/login/", data);
export const verifyOtp = (data) => api.post("/auth/otp/verify/", data);
export const resendOtp = (data) => api.post("/auth/otp/resend/", data);
export const forgotPassword = (data) => api.post("/auth/forgot-password/", data);
export const resetPassword = (data) => api.post("/auth/reset-password/", data);

