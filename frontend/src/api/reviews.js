import api from "./api"; // same file jisme interceptor laga hai

export const getReviews = () => api.get("/auth/reviews/");
export const createReview = (data) => api.post("/auth/reviews/", data);
export const deleteReview = () => api.delete("/auth/reviews/delete/");
