import { useMutation } from "@tanstack/react-query";
import { signInWithGoogle } from "@/lib/firebase";
import { createUserIfNotExists } from "@/lib/createUserIfNotExists";

export function useLogin() {
  const loginMutation = useMutation({
    mutationFn: async () => {
      const result = await signInWithGoogle();
      await createUserIfNotExists(result.user);
      return result.user;
    },
  });

  return {
    login: loginMutation.mutate,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
    isSuccess: loginMutation.isSuccess,
  };
}
