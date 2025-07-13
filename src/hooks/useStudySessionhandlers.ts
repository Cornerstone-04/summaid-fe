import { useCallback } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  ChatMessage,
  sendMessageToChatbot,
  generateMCQs,
  generateSummary,
  getTopics,
} from "@/services/documents.services";
import { SessionDocument } from "@/types";
import { useChatStore } from "@/store/useChatStore";
import { capitalize } from "@/lib/utils";

interface FlashcardOptions {
  difficulty: "easy" | "medium" | "hard";
  numQuestions: number;
  numOptions: number;
}

interface UseHandlersProps {
  sessionId: string;
  sessionData: SessionDocument | null;
  flashcardOptions: FlashcardOptions;
  setSessionData: React.Dispatch<React.SetStateAction<SessionDocument | null>>;
  setFlashcardOptions: React.Dispatch<React.SetStateAction<FlashcardOptions>>;
  userId: string | undefined;
}

export function useStudySessionHandlers({
  sessionId,
  sessionData,
  flashcardOptions,
  setSessionData,
  setFlashcardOptions,
  userId,
}: UseHandlersProps) {
  const {
    chatInput,
    setChatInput,
    addMessage,
    isSendingMessage,
    setIsSendingMessage,
  } = useChatStore();

  const handleDifficultyChange = useCallback(
    (value: "easy" | "medium" | "hard") => {
      setFlashcardOptions((prev) => ({ ...prev, difficulty: value }));
    },
    [setFlashcardOptions]
  );

  const handleNumQuestionsToggle = useCallback(
    (enabled: boolean) => {
      setFlashcardOptions((prev) => ({
        ...prev,
        numQuestions: enabled ? 5 : 0,
      }));
    },
    [setFlashcardOptions]
  );

  const handleNumOptionsToggle = useCallback(
    (enabled: boolean) => {
      setFlashcardOptions((prev) => ({ ...prev, numOptions: enabled ? 4 : 0 }));
    },
    [setFlashcardOptions]
  );

  const handleSendMessage = useCallback(async () => {
    if (!chatInput.trim() || !sessionId || !userId) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: chatInput.trim(),
      timestamp: new Date().toISOString(),
    };

    setIsSendingMessage(true);
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
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const msg =
        err.response?.data?.message ||
        (error instanceof Error ? error.message : "Unknown error");
      toast.error(`Failed to get response from AI: ${msg}`);
    } finally {
      setIsSendingMessage(false);
    }
  }, [
    chatInput,
    sessionId,
    userId,
    addMessage,
    setChatInput,
    setIsSendingMessage,
  ]);

  const handleGenerateContent = useCallback(
    async (
      type: "summary" | "flashcards" | "studyGuide" | "research" | "explain"
    ) => {
      if (!sessionId || sessionData?.status !== "success") {
        toast.warning("Please wait for document processing to finish.");
        return;
      }

      if (isSendingMessage) {
        toast.info("A request is already running.");
        return;
      }

      const simulateUserPrompt = (content: string): ChatMessage => ({
        role: "user",
        content,
        timestamp: new Date().toISOString(),
      });

      setIsSendingMessage(true);
      const toastId = toast.loading(`Generating ${type}...`, {
        id: `generating_${type}`,
      });

      try {
        if (type === "summary") {
          const prompt = "Can you summarize this?";
          const userMsg = simulateUserPrompt(prompt);
          addMessage(userMsg);

          const res = await generateSummary(sessionId);
          setSessionData((prev) => (prev ? { ...prev, summary: res } : null));

          const message: ChatMessage = {
            role: "assistant",
            content:
              "I've generated your summary! You can find it in the **Summary** tab.",
            timestamp: new Date().toISOString(),
          };
          addMessage(message);
        } else if (type === "flashcards") {
          const prompt = "Can you generate flashcards?";
          addMessage(simulateUserPrompt(prompt));

          const res = await generateMCQs(
            sessionId,
            undefined,
            flashcardOptions.numQuestions,
            flashcardOptions.numOptions,
            flashcardOptions.difficulty
          );
          setSessionData((prev) =>
            prev ? { ...prev, flashcards: res } : null
          );

          const message: ChatMessage = {
            role: "assistant",
            content:
              "Your flashcards are ready! Head to the **Flashcards** tab to start practicing.",
            timestamp: new Date().toISOString(),
          };
          addMessage(message);
        } else if (type === "studyGuide") {
          const prompt = "Can you give me a study guide?";
          addMessage(simulateUserPrompt(prompt));

          const topics = await getTopics(sessionId);
          const content =
            topics.length > 0
              ? `
        <div>
          <h2 style="margin-bottom: 0.5rem;">Study Guide Topics</h2>
          <p>Studying the following topics should get you going:</p>
          <ul style="list-style-type: disc; padding-left: 1.5rem;">
            ${topics.map((t) => `<li>${capitalize(t)}</li>`).join("")}
          </ul>
        </div>
      `.trim()
              : "<p>No topics found for study guide.</p>";

          setSessionData((prev) =>
            prev ? { ...prev, study_guide: content } : null
          );

          const message: ChatMessage = {
            role: "assistant",
            content:
              "Your study guide has been prepared. Check it out in the **Study Guide** tab.",
            timestamp: new Date().toISOString(),
          };
          addMessage(message);
        } else if (type === "research" || type === "explain") {
          const prompt =
            type === "research"
              ? "Research and provide detailed information based on the documents."
              : "Explain the key concepts from the documents in more detail.";

          const userMessage: ChatMessage = {
            role: "user",
            content: prompt,
            timestamp: new Date().toISOString(),
          };
          addMessage(userMessage); // Show user's intent in chat

          const typingMessage: ChatMessage = {
            role: "assistant",
            content: "__typing__", // special flag to identify
            timestamp: new Date().toISOString(),
          };
          addMessage(typingMessage);

          const assistantResponse = await sendMessageToChatbot(
            sessionId,
            sessionId,
            prompt
          );
          setTimeout(() => {
            useChatStore.getState().removeLastMessageIfTyping();
            const assistantMessage: ChatMessage = {
              role: "assistant",
              content: assistantResponse,
              timestamp: new Date().toISOString(),
            };
            addMessage(assistantMessage);
          }, 300);
        }

        toast.success(`${type} generated!`, { id: toastId });
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const msg =
          err.response?.data?.message ||
          (error instanceof Error ? error.message : "Unknown error");
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
      setSessionData,
      setIsSendingMessage,
    ]
  );

  return {
    handleSendMessage,
    handleGenerateContent,
    handleDifficultyChange,
    handleNumQuestionsToggle,
    handleNumOptionsToggle,
  };
}
