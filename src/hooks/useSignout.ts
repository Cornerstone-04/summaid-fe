import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export function useSignout() {
  async function signoutUser() {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast.success("User signed out successfully");
    } catch (error: unknown) {
      console.error("Sign out error:", error);
      
      // Handle specific Supabase auth errors
      if (error && typeof error === 'object' && 'message' in error) {
        toast.error(`Sign out failed: ${(error as { message: string }).message}`);
      } else {
        toast.error("An unexpected error occurred while signing out.");
      }
    }
  }

  return { signoutUser };
}