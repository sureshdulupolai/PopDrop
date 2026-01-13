import axios from "axios";

const publicApi = axios.create({
  baseURL: "https://popdrop-backend-1.onrender.com/", // ❗ auth nahi
  headers: {
    "Content-Type": "application/json",
  },
});

export default publicApi;
