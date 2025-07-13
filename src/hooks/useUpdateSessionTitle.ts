import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface UpdateTitleParams {
  sessionId: string;
  newTitle: string;
}

export function useUpdateSessionTitle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, newTitle }: UpdateTitleParams) => {
      const { error } = await supabase
        .from("sessions")
        .update({ title: newTitle })
        .eq("id", sessionId);

      if (error) throw new Error(error.message);
      return sessionId;
    },
    onSuccess: () => {
      toast.success("Session title updated.");
      queryClient.invalidateQueries({ queryKey: ["user-sessions"] }); // match useUserSessions
    },
    onError: (err: Error) => {
      toast.error(`Failed to update title: ${err.message}`);
    },
  });
}
