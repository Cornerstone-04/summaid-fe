import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const { error } = await supabase
        .from("sessions")
        .delete()
        .eq("id", sessionId);

      if (error) throw new Error(error.message);
      return sessionId;
    },
    onSuccess: () => {
      toast.success("Session deleted.");
      queryClient.invalidateQueries({ queryKey: ["user-sessions"] });
    },
    onError: (err: Error) => {
      toast.error(`Failed to delete session: ${err.message}`);
    },
  });
}
