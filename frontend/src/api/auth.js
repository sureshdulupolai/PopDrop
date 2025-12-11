import axios from "axios";

export const signupUser = (data) => axios.post("http://localhost:8000/auth/signup/", data);
export const loginUser = (data) => axios.post("http://localhost:8000/auth/login/", data);
export const verifyOtp = (data) => axios.post("http://localhost:8000/auth/verify-otp/", data);

// Add this if missing:
export const resendOtp = (data) => axios.post("http://localhost:8000/auth/resend-otp/", data);
