import axios from "axios";
import { BASE_URL } from "./apiPaths";

let navigateToLogin;

export const setNavigate = (navigate) => {
  navigateToLogin = navigate;
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 90000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        if (navigateToLogin) {
          navigateToLogin("/login");
        }
      } else if (error.response.status >= 500) {
        console.error("Server error. Please try again later.", error);
      }
    } else if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      console.warn("Request timed out waiting for backend.", error);
      error.customMessage = "The server is taking a moment to start up. Please try again in a few seconds.";
    } else if (!error.response && error.request) {
      console.warn("Network error / backend waking up:", error);
      error.customMessage = "Unable to connect to the server. The backend may be starting up on Render, please wait a moment and try again.";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;