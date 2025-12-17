import axios from "axios";

const publicApi = axios.create({
  baseURL: "http://localhost:8000", // ❗ auth nahi
  headers: {
    "Content-Type": "application/json",
  },
});

export default publicApi;
