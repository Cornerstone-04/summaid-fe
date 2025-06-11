import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export function useLogin() {
  const loginMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Redirecting to Google...", {
        description: "Please complete the sign-in process",
      });
    },
    onError: (error) => {
      console.error("Login failed:", error);
      
      // Handle specific Supabase errors if needed
      if (error && typeof error === 'object' && 'message' in error) {
        toast.error(`Login failed: ${(error as { message: string }).message}`);
      } else {
        toast.error("Login failed. Please try again.");
      }
    },
  });

  return {
    login: loginMutation.mutate,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
    isSuccess: loginMutation.isSuccess,
  };
}