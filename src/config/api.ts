import axios from "axios";
// import { BACKEND_URL } from "./env"; // Import the backend API URL

// Create an Axios instance with a base URL
export const api = axios.create({
  // baseURL: BACKEND_URL,
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json", // Default content type for most requests
  },
});

// You can add interceptors here if needed, e.g., for authentication tokens
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("auth_token"); // Example: get token from local storage
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Handle unauthorized errors, e.g., redirect to login
//       console.error("Unauthorized request, redirecting to login...");
//       // window.location.href = "/auth/login";
//     }
//     return Promise.reject(error);
//   }
// );
