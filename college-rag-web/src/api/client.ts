import axios from "axios";
import {getAccessToken} from "../utils/cookies";

export const authAPI = axios.create({
  baseURL: "",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const coreAPI = axios.create({
    baseURL: "",
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
