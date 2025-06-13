import { QueryClient } from "@tanstack/react-query";
// react query client
const queryClient = new QueryClient();

// Firebase configuration
const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY || "";
const FIREBASE_AUTH_DOMAIN = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "";
const FIREBASE_PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID || "";
const FIREBASE_STORAGE_BUCKET =
  import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "";
const FIREBASE_MESSAGING_SENDER_ID =
  import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "";
const FIREBASE_APP_ID = import.meta.env.VITE_FIREBASE_APP_ID || "";
const FIREBASE_MEASUREMENT_ID =
  import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "";

// Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const SUPERBASE_REDIRECT_URL = import.meta.env.VITE_SUPABASE_REDIRECT_URL || "";

// Base URL for the application
const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export {
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_MEASUREMENT_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  APP_BASE_URL,
  queryClient,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  SUPERBASE_REDIRECT_URL,
};
