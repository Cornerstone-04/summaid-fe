import { useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { api } from "@/config/api";
import { AxiosError } from "axios";

import { SessionSkeleton } from "@/components/session/session-skeleton";
import { SessionError } from "@/components/session/session-error";
import { MobileTabsView } from "@/components/session/mobile-tabs-view";
import { DesktopLayout } from "@/components/session/desktop-layout";
import { ChatMessage, SessionDocument } from "@/types";

export default function StudySessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [sessionData, setSessionData] = useState<SessionDocument | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sessionId) {
      setLoadingSession(false);
      toast.error("Invalid session ID.");
      return;
    }

    fetchSessionData();

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
            setSessionData(payload.new as SessionDocument);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const fetchSessionData = async () => {
    try {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("id", sessionId)
        .single();

      if (error || !data) {
        toast.error("Session not found.");
        setSessionData(null);
      } else {
        setSessionData(data as SessionDocument);
      }
    } catch {
      toast.error("Error loading session data.");
    } finally {
      setLoadingSession(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessionData?.chat_history]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !sessionId) return;

    setIsSendingMessage(true);
    const userMessage: ChatMessage = {
      role: "user",
      content: chatInput.trim(),
      timestamp: new Date().toISOString(),
    };

    setSessionData((prev) =>
      prev
        ? {
            ...prev,
            chat_history: [...(prev.chat_history || []), userMessage],
          }
        : null
    );

    setChatInput("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) throw new Error("Missing token");

      await api.post(
        "/api/v1/chat-document",
        { sessionId, message: userMessage.content },
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      );
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const msg = err.response?.data?.message || err.message || "Error";
      toast.error(`Failed to get response from AI.\n ${msg}`);
      setSessionData((prev) =>
        prev
          ? {
              ...prev,
              chat_history: prev.chat_history
                ? prev.chat_history.slice(0, -1)
                : [],
            }
          : null
      );
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleGenerateContent = async (
    type: "summary" | "flashcards" | "studyGuide" | "research" | "explain"
  ) => {
    if (!sessionId || sessionData?.status !== "completed") {
      toast.warning("Please wait for processing to finish.");
      return;
    }

    if (isSendingMessage) {
      toast.info("A request is already running.");
      return;
    }

    setIsSendingMessage(true);
    toast.loading(`Generating ${type}...`);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) throw new Error("Missing token");

      await api.post(
        "/api/v1/documents/generate",
        { sessionId, contentType: type },
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(`${type} request sent!`, { id: `generating_${type}` });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const msg = err.response?.data?.message || err.message || "Error";
      toast.error(msg, { id: `generating_${type}` });
    } finally {
      setIsSendingMessage(false);
    }
  };

  if (loadingSession) return <SessionSkeleton />;
  if (!sessionData) return <SessionError />;

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground">
      <DashboardHeader sessionTitle={sessionData?.title} />

      <MobileTabsView
        sessionData={sessionData}
        chatInput={chatInput}
        setChatInput={setChatInput}
        isSendingMessage={isSendingMessage}
        handleSendMessage={handleSendMessage}
        messagesEndRef={messagesEndRef}
        handleGenerateContent={handleGenerateContent}
      />
      <DesktopLayout
        sessionData={sessionData}
        chatInput={chatInput}
        setChatInput={setChatInput}
        isSendingMessage={isSendingMessage}
        handleSendMessage={handleSendMessage}
        messagesEndRef={messagesEndRef}
        handleGenerateContent={handleGenerateContent}
      />
    </div>
  );
}
