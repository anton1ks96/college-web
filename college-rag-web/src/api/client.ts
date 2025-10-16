import axios from "axios";
import {getAccessToken} from "../utils/cookies";

export const authAPI = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const coreAPI = axios.create({
    baseURL: "http://localhost:8081",
  withCredentials: true,
});

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
