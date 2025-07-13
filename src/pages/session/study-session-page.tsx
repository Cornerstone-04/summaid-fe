import { useParams } from "react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AxiosError } from "axios";

import { SessionSkeleton } from "@/components/session/session-skeleton";
import { SessionError } from "@/components/session/session-error";
import { MobileTabsView } from "@/components/session/mobile-tabs-view";
import { DesktopLayout } from "@/components/session/desktop-layout";
import {
  ChatMessage,
  sendMessageToChatbot,
  generateMCQs,
  generateSummary,
} from "@/services/documents.services";
import { SessionDocument } from "@/types";
import { useAuth } from "@/store/useAuth";
import { useChatStore } from "@/store/useChatStore"; // Import the new chat store

export default function StudySessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user } = useAuth();
  const [sessionData, setSessionData] = useState<SessionDocument | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // Use Zustand store for chat state
  const {
    messages,
    chatInput,
    isSendingMessage,
    setChatInput,
    addMessage,
    setIsSendingMessage,
    initializeMessages,
  } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // State for Flashcard Options, initialized with defaults
  const [flashcardOptions, setFlashcardOptions] = useState({
    difficulty: "medium" as "easy" | "medium" | "hard", // Default to medium
    numQuestions: 10, // Default number of questions if enabled
    numOptions: 4, // Default number of options if enabled
  });

  // Ref to track if initial content generation has been triggered
  const initialContentGeneratedRef = useRef(false);

  // Fetch session data and set up real-time listener
  useEffect(() => {
    if (!sessionId) {
      setLoadingSession(false);
      toast.error("Invalid session ID.");
      return;
    }

    const fetchAndSubscribeSessionData = async () => {
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
          setSessionData(data as SessionDocument);
          // Initialize chat messages in Zustand store from Supabase or localStorage
          initializeMessages(sessionId, data.chat_history);

          // Initialize flashcard options from fetched session data preferences
          if (data.preferences?.flashcardOptions) {
            setFlashcardOptions(data.preferences.flashcardOptions);
          } else {
            // If preferences don't exist, use initial defaults.
            // This might happen if the session was created before flashcardOptions were added.
            // Consider updating old session data in Supabase if needed.
          }
        }
      } catch (err) {
        console.error("Error fetching initial session data:", err);
        toast.error("Error loading session data.");
      } finally {
        setLoadingSession(false);
      }
    };

    fetchAndSubscribeSessionData();

    // Real-time listener for session updates
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
          console.log("Real-time update received:", payload);
          if (payload.new) {
            setSessionData(payload.new as SessionDocument);
            const newSession = payload.new as SessionDocument;
            // The scroll logic for assistant messages is now less critical here
            // because of optimistic updates, but it can remain as a fallback.
            if (newSession.chat_history && newSession.chat_history.length > 0) {
              const lastMessage =
                newSession.chat_history[newSession.chat_history.length - 1];
              if (lastMessage.role === "assistant") {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, initializeMessages]);

  // Effect to trigger initial content generation based on preferences
  useEffect(() => {
    if (
      sessionData &&
      sessionData.status === "success" &&
      !initialContentGeneratedRef.current &&
      !isSendingMessage
    ) {
      const { preferences, summary, flashcards, study_guide } = sessionData;

      const triggerGenerations = async () => {
        let triggeredCount = 0;
        let toastId: string | number = "";

        if (preferences.generateSummary && !summary) {
          try {
            toastId = toast.loading("Automatically generating summary...", {
              id: `auto_summary`,
            });
            await generateSummary(sessionId!);
            toast.success("Summary generation initiated!", { id: toastId });
            triggeredCount++;
          } catch (error: unknown) {
            const err = error as AxiosError<{ message: string }>;
            const msg =
              err.response?.data?.message ||
              (error instanceof Error
                ? error.message
                : "An unknown error occurred.");
            toast.error(`Failed to auto-generate summary: ${msg}`, {
              id: toastId,
            });
          }
        }

        if (
          preferences.generateFlashcards &&
          (!flashcards || flashcards.length === 0)
        ) {
          try {
            toastId = toast.loading("Automatically generating flashcards...", {
              id: `auto_flashcards`,
            });
            const generatedFlashcards = await generateMCQs(
              sessionId!,
              undefined,
              flashcardOptions.numQuestions,
              flashcardOptions.numOptions,
              flashcardOptions.difficulty
            );
            setSessionData((prev) =>
              prev ? { ...prev, flashcards: generatedFlashcards } : null
            );
            toast.success("Flashcard generation initiated!", { id: toastId });
            triggeredCount++;
          } catch (error: unknown) {
            const err = error as AxiosError<{ message: string }>;
            const msg =
              err.response?.data?.message ||
              (error instanceof Error
                ? error.message
                : "An unknown error occurred.");
            toast.error(`Failed to auto-generate flashcards: ${msg}`, {
              id: toastId,
            });
          }
        }

        if (preferences.generateStudyGuide && !study_guide) {
          try {
            toastId = toast.loading("Automatically generating study guide...", {
              id: `auto_study_guide`,
            });
            await generateSummary(sessionId!, "detailed study guide");
            toast.success("Study guide generation initiated!", { id: toastId });
            triggeredCount++;
          } catch (error: unknown) {
            const err = error as AxiosError<{ message: string }>;
            const msg =
              err.response?.data?.message ||
              (error instanceof Error
                ? error.message
                : "An unknown error occurred.");
            toast.error(`Failed to auto-generate study guide: ${msg}`, {
              id: toastId,
            });
          }
        }

        if (triggeredCount > 0) {
          initialContentGeneratedRef.current = true;
        }
      };

      triggerGenerations();
    }
  }, [sessionData, sessionId, isSendingMessage, flashcardOptions]);

  // Scroll to bottom when chat history updates (now from Zustand store)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handlers for updating flashcard options state
  const handleDifficultyChange = useCallback(
    (value: "easy" | "medium" | "hard") => {
      setFlashcardOptions((prev) => ({ ...prev, difficulty: value }));
    },
    []
  );

  const handleNumQuestionsToggle = useCallback((enabled: boolean) => {
    setFlashcardOptions((prev) => ({
      ...prev,
      numQuestions: enabled ? 5 : 0,
    }));
  }, []);

  const handleNumOptionsToggle = useCallback((enabled: boolean) => {
    setFlashcardOptions((prev) => ({
      ...prev,
      numOptions: enabled ? 4 : 0,
    }));
  }, []);

  // Handle sending a chat message
  const handleSendMessage = useCallback(async () => {
    if (!chatInput.trim() || !sessionId || !user?.id) return;

    setIsSendingMessage(true);
    const userMessage: ChatMessage = {
      role: "user",
      content: chatInput.trim(),
      timestamp: new Date().toISOString(),
    };

    addMessage(userMessage);
    setChatInput("");

    try {
      const assistantResponse = await sendMessageToChatbot(
        sessionId,
        sessionId,
        userMessage.content
      );

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: assistantResponse,
        timestamp: new Date().toISOString(),
      };
      addMessage(assistantMessage);

      toast.success("Message sent and response received!");
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      const msg =
        err.response?.data?.message ||
        (error instanceof Error ? error.message : "An unknown error occurred.");
      toast.error(`Failed to get response from AI: ${msg}`);

      // Revert optimistic update for user message if API call fails
      // This is a bit tricky with Zustand's addMessage.
      // For simplicity, we'll just show the error and not remove the user message.
      // A more complex rollback logic would be needed for perfect optimistic UI.
      // For now, the user message will persist even if AI fails to respond.
    } finally {
      setIsSendingMessage(false);
    }
  }, [
    chatInput,
    sessionId,
    user?.id,
    addMessage,
    setChatInput,
    setIsSendingMessage,
  ]);

  // Handle generating content (Summary, Flashcards, Study Guide)
  const handleGenerateContent = useCallback(
    async (
      type: "summary" | "flashcards" | "studyGuide" | "research" | "explain"
    ) => {
      if (!sessionId || sessionData?.status !== "success") {
        toast.warning("Please wait for document processing to finish.");
        return;
      }

      if (isSendingMessage) {
        toast.info("A request is already running. Please wait.");
        return;
      }

      setIsSendingMessage(true);
      let toastId: string | number = "";

      try {
        if (type === "summary") {
          toastId = toast.loading("Generating summary...", {
            id: `generating_${type}`,
          });
          const generatedSummaryContent = await generateSummary(sessionId);
          setSessionData((prev) =>
            prev ? { ...prev, summary: generatedSummaryContent } : null
          );
          toast.success("Summary generation initiated!", { id: toastId });
        } else if (type === "flashcards") {
          toastId = toast.loading("Generating flashcards...", {
            id: `generating_${type}`,
          });
          const generatedFlashcards = await generateMCQs(
            sessionId,
            undefined,
            flashcardOptions.numQuestions,
            flashcardOptions.numOptions,
            flashcardOptions.difficulty
          );
          setSessionData((prev) =>
            prev ? { ...prev, flashcards: generatedFlashcards } : null
          );
          toast.success("Flashcard generation initiated!", { id: toastId });
        } else if (type === "studyGuide") {
          toastId = toast.loading("Generating study guide...", {
            id: `generating_${type}`,
          });
          const generatedStudyGuideContent = await generateSummary(
            sessionId,
            "detailed study guide"
          );
          setSessionData((prev) =>
            prev ? { ...prev, study_guide: generatedStudyGuideContent } : null
          );
          toast.success("Study guide generation initiated!", { id: toastId });
        } else if (type === "research" || type === "explain") {
          toastId = toast.loading(`Requesting AI to ${type} content...`, {
            id: `generating_${type}`,
          });
          const prompt =
            type === "research"
              ? "Research and provide detailed information based on the documents."
              : "Explain the key concepts from the documents in more detail.";

          const assistantResponse = await sendMessageToChatbot(
            sessionId,
            sessionId,
            prompt
          );
          const assistantMessage: ChatMessage = {
            role: "assistant",
            content: assistantResponse,
            timestamp: new Date().toISOString(),
          };
          addMessage(assistantMessage);

          toast.success(`AI response for '${type}' received!`, { id: toastId });
        } else {
          toast.error("Unsupported content generation type.", {
            id: `generating_${type}`,
          });
        }
      } catch (error: unknown) {
        const err = error as AxiosError<{ message: string }>;
        const msg =
          err.response?.data?.message ||
          (error instanceof Error
            ? error.message
            : "An unknown error occurred.");
        toast.error(`Failed to generate ${type}: ${msg}`, { id: toastId });
      } finally {
        setIsSendingMessage(false);
      }
    },
    [
      sessionId,
      sessionData?.status,
      isSendingMessage,
      flashcardOptions,
      addMessage,
      setIsSendingMessage,
    ]
  );

  if (loadingSession) return <SessionSkeleton />;
  if (!sessionData) return <SessionError />;

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground">
      <DashboardHeader sessionTitle={sessionData?.title} />

      <MobileTabsView
        sessionData={sessionData}
        handleSendMessage={handleSendMessage}
        messagesEndRef={messagesEndRef}
        handleGenerateContent={handleGenerateContent}
        flashcardOptions={flashcardOptions}
        onDifficultyChange={handleDifficultyChange}
        onNumQuestionsToggle={handleNumQuestionsToggle}
        onNumOptionsToggle={handleNumOptionsToggle}
        isSendingMessage={isSendingMessage} // Pass isSendingMessage here
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
