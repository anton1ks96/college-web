import axios from "axios";

export const authAPI = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL || "http://localhost:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const coreAPI = axios.create({
  baseURL: import.meta.env.VITE_CORE_API_URL || "http://localhost:8081",
  withCredentials: true,
});
