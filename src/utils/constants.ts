import { QueryClient } from "@tanstack/react-query";
// react query client
const queryClient = new QueryClient();

// Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const SUPERBASE_REDIRECT_URL = import.meta.env.VITE_SUPABASE_REDIRECT_URL || "";

// Base URL for the application
const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export {
  APP_BASE_URL,
  queryClient,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  SUPERBASE_REDIRECT_URL,
};
