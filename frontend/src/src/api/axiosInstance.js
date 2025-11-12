// src/api/axiosInstance.js
import axios from "axios";
import { getToken, removeToken } from "../utils/storage";

// Create axios instance with baseURL
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach JWT before each request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle expired or invalid token
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      removeToken();
      window.location.href = "/login"; // redirect to login on unauthorized
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
