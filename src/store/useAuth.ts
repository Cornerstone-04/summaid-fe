import { create } from "zustand";
import { User } from "@supabase/supabase-js"; // Import Supabase User type
import { supabase } from "@/lib/supabase"; // Import your Supabase client

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}));

export function listenToAuthChanges() {
  if (useAuth.getState().user !== null || !useAuth.getState().loading) {
    return;
  }

  useAuth.getState().setLoading(true);

  // Supabase listener for authentication state changes
  const {
    data: { subscription: authListener },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      useAuth.getState().setUser(session.user || null);
      console.log("Supabase Auth: User is logged in.", session.user?.email);
    } else {
      useAuth.getState().setUser(null);
      console.log("Supabase Auth: User is logged out.");
    }
    useAuth.getState().setLoading(false);
  });

  // Cleanup function to unsubscribe from the listener
  return () => {
    authListener.unsubscribe();
  };
}
