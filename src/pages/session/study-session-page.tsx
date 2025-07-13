import { useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SessionSkeleton } from "@/components/session/session-skeleton";
import { SessionError } from "@/components/session/session-error";
import { MobileTabsView } from "@/components/session/mobile-tabs-view";
import { DesktopLayout } from "@/components/session/desktop-layout";

import { SessionDocument } from "@/types";
import { useAuth } from "@/store/useAuth";
import { useChatStore } from "@/store/useChatStore";
import { useStudySessionHandlers } from "@/hooks/useStudySessionhandlers";

import { useAutoGeneration } from "@/hooks/useAutoGeneration";

export default function StudySessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user } = useAuth();
  const userId = user?.id;

  const [sessionData, setSessionData] = useState<SessionDocument | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const [flashcardOptions, setFlashcardOptions] = useState({
    difficulty: "medium" as "easy" | "medium" | "hard",
    numQuestions: 5,
    numOptions: 4,
  });

  const { messages, isSendingMessage, initializeMessages } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    handleSendMessage,
    handleGenerateContent,
    handleDifficultyChange,
    handleNumQuestionsToggle,
    handleNumOptionsToggle,
  } = useStudySessionHandlers({
    sessionId: sessionId || "",
    sessionData,
    flashcardOptions,
    setSessionData,
    setFlashcardOptions,
    userId,
  });

  // Fetch session data and subscribe to real-time changes
  useEffect(() => {
    if (!sessionId) {
      setLoadingSession(false);
      toast.error("Invalid session ID.");
      return;
    }

    const fetchSession = async () => {
      setLoadingSession(true);
      try {
        const { data, error } = await supabase
          .from("sessions")
          .select("*")
          .eq("id", sessionId)
          .single();

        if (error || !data) {
          toast.error("Session not found or an error occurred.");
          setSessionData(null);
        } else {
          setSessionData(data);
          initializeMessages(sessionId, data.chat_history);
          if (data.preferences?.flashcardOptions) {
            setFlashcardOptions(data.preferences.flashcardOptions);
          }
        }
      } catch (err) {
        console.error("Fetch session error:", err);
        toast.error("Error loading session data.");
      } finally {
        setLoadingSession(false);
      }
    };

    fetchSession();

    const channel = supabase
      .channel(`session_${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sessions",
          filter: `id=eq.${sessionId}`,
        },
        (payload) => {
          if (payload.new) {
            const updated = payload.new as SessionDocument;
            setSessionData(updated);
            if (updated.chat_history?.at(-1)?.role === "assistant") {
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, initializeMessages]);

  useAutoGeneration({
    sessionData,
    sessionId: sessionId || "",
    isSendingMessage,
    flashcardOptions,
  });

  // Scroll chat to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loadingSession) return <SessionSkeleton />;
  if (!sessionData) return <SessionError />;

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground">
      <DashboardHeader sessionTitle={sessionData.title} />

      <MobileTabsView
        sessionData={sessionData}
        handleSendMessage={handleSendMessage}
        messagesEndRef={messagesEndRef}
        handleGenerateContent={handleGenerateContent}
        flashcardOptions={flashcardOptions}
        onDifficultyChange={handleDifficultyChange}
        onNumQuestionsToggle={handleNumQuestionsToggle}
        onNumOptionsToggle={handleNumOptionsToggle}
        isSendingMessage={isSendingMessage}
      />

      <DesktopLayout
        sessionData={sessionData}
        handleSendMessage={handleSendMessage}
        messagesEndRef={messagesEndRef}
        handleGenerateContent={handleGenerateContent}
        flashcardOptions={flashcardOptions}
        onDifficultyChange={handleDifficultyChange}
        onNumQuestionsToggle={handleNumQuestionsToggle}
        onNumOptionsToggle={handleNumOptionsToggle}
        isSendingMessage={isSendingMessage}
      />
    </div>
  );
}
