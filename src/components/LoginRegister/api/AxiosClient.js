// src/api/AxiosClient.js
import axios from "axios";

// ⛳ Gunakan ENV agar scalable ke production/dev/staging
const AxiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1",
});

export default AxiosClient;
