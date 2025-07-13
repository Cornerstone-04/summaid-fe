import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { SessionDocument } from "@/types";
import { useAuth } from "@/store/useAuth";

export function useUserSessions() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery<SessionDocument[]>({
    queryKey: ["user-sessions"],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data as SessionDocument[];
    },
    enabled: !!user?.id,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!user?.id) return;

    const channelId = `public:sessions:user_id=eq.${user.id}`;
    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sessions",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["user-sessions"] });
        }
      )
      .subscribe((status) => {
        if (status !== "SUBSCRIBED") {
          console.warn("Supabase subscription status:", status);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  return {
    sessions: query.data || [],
    isLoadingSessions: query.isLoading,
    sessionsError: query.error?.message || null,
  };
}
