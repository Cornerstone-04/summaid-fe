import { supabase } from "@/lib/supabase";
import { APP_BASE_URL } from "./env";
import axios from "axios";

export const api = axios.create({
  baseURL: APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    // Get the current session from Supabase
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      // If a session and access token exist, attach it to the Authorization header
      config.headers.Authorization = `Bearer ${session.access_token}`;
    } else {
      // If no session/token, ensure the Authorization header is not set
      // for requests that require authentication
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// You can also add a response interceptor for global error handling (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: if a 401 or 403 error is received, you might redirect to login
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.warn("Authentication error detected, redirecting to login...");
      // Depending on your auth flow, you might clear session and redirect
      // supabase.auth.signOut();
      // window.location.href = '/auth/login'; // Or your login route
    }
    return Promise.reject(error);
  }
);
