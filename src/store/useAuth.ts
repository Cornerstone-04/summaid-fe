import { create } from "zustand";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true, // start as loading until auth resolves
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}));

let authListenerInitialized = false;

export function listenToAuthChanges() {
  if (authListenerInitialized) {
    return;
  }

  useAuth.getState().setLoading(true);

  onAuthStateChanged(auth, (user) => {
    useAuth.getState().setUser(user);
    useAuth.getState().setLoading(false);
    authListenerInitialized = true;
  });
}
