import axios from "axios";
import {getAccessToken} from "../utils/cookies";

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

// Добавляем перехватчик для автоматического добавления Bearer токена
coreAPI.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
