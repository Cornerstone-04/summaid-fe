// src/hooks/useUserSessions.ts
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/store/useAuth";
import { toast } from "sonner";
import { SessionDocument } from "@/types";

export function useUserSessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionDocument[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [sessionsError, setSessionsError] = useState<string | null>(null);

  useEffect(() => {
    const channelId = `public:sessions:user_id=eq.${user?.id}`;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const fetchAndSubscribeSessions = async () => {
      if (!user?.id) {
        setSessions([]);
        setIsLoadingSessions(false);
        setSessionsError("User not authenticated.");
        return;
      }

      setIsLoadingSessions(true);
      setSessionsError(null);

      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching sessions:", error);
        setSessionsError(error.message);
        setIsLoadingSessions(false);
        toast.error(`Failed to load study sessions: ${error.message}`);
        return;
      }

      setSessions(data as SessionDocument[]);
      setIsLoadingSessions(false);

      // Setup realtime subscription
      channel = supabase
        .channel(channelId)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "sessions",
            filter: `user_id=eq.${user.id}`,
          },
          async () => {
            console.log("Realtime change received");

            const { data: updatedData, error: updatedError } = await supabase
              .from("sessions")
              .select("*")
              .eq("user_id", user.id)
              .order("created_at", { ascending: false });

            if (updatedError) {
              console.error("Realtime fetch error:", updatedError);
              toast.error(`Realtime update failed: ${updatedError.message}`);
            } else {
              setSessions(updatedData as SessionDocument[]);
              toast.info("Study session status updated!");
            }
          }
        )
        .subscribe((status) => {
          if (status !== "SUBSCRIBED") {
            console.warn("Supabase subscription status:", status);
          }
        });
    };

    fetchAndSubscribeSessions();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user?.id]);

  return { sessions, isLoadingSessions, sessionsError };
}
