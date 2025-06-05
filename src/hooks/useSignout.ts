import { auth } from "@/lib/firebase";
import { FirebaseError } from "firebase/app";
import { signOut } from "firebase/auth";
import { toast } from "sonner";

export function useSignout() {
  async function signoutUser() {
    try {
      await signOut(auth);
      toast.success("User signed out successfully");
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/no-current-user") {
          toast.error("No user is currently signed in.");
        } else {
          toast.error("An unexpected error occurred while signing out.");
        }
      }
    }
  }

  return { signoutUser };
}
