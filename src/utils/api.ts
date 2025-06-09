// src/utils/api.ts
import { APP_BASE_URL } from "./constants";
import axios from "axios";
import { getAuth } from "firebase/auth";

export const api = axios.create({
  baseURL: `${APP_BASE_URL}/api/v1`,
});

// Add auth token to every request automatically
api.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

