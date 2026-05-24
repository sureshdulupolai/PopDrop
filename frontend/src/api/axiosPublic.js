import axios from "axios";
import { BASE_URL } from "./config";

const publicApi = axios.create({
  baseURL: `${BASE_URL}/`, // ❗ auth nahi
  headers: {
    "Content-Type": "application/json",
  },
});

export default publicApi;
