import { QueryClient } from "@tanstack/react-query";
// react query client
const queryClient = new QueryClient();

// Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Base URL for the application
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export { BACKEND_URL, queryClient, SUPABASE_ANON_KEY, SUPABASE_URL };
