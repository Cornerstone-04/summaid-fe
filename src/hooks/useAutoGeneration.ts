// src/hooks/useAutoGeneration.ts
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { SessionDocument } from "@/types";
import {
  generateMCQs,
  generateSummary,
  getTopics,
} from "@/services/documents.services";

interface FlashcardOptions {
  difficulty: "easy" | "medium" | "hard";
  numQuestions: number;
  numOptions: number;
}

export function useAutoGeneration({
  sessionData,
  sessionId,
  isSendingMessage,
  flashcardOptions,
}: {
  sessionData: SessionDocument | null;
  sessionId: string;
  isSendingMessage: boolean;
  flashcardOptions: FlashcardOptions;
}) {
  const initialContentGeneratedRef = useRef(false);

  useEffect(() => {
    const shouldGenerate =
      sessionData &&
      sessionData.status === "success" &&
      !initialContentGeneratedRef.current &&
      !isSendingMessage;

    if (!shouldGenerate) return;

    const { preferences, summary, flashcards, study_guide } = sessionData;
    const toastId = toast.loading("Generating study tools...");

    const generateIfNeeded = async () => {
      const success: string[] = [];

      try {
        if (preferences.generateSummary && !summary) {
          await generateSummary(sessionId);
          success.push("Summary");
        }

        if (
          preferences.generateFlashcards &&
          (!flashcards || flashcards.length === 0)
        ) {
          await generateMCQs(
            sessionId,
            undefined,
            flashcardOptions.numQuestions,
            flashcardOptions.numOptions,
            flashcardOptions.difficulty
          );
          success.push("Flashcards");
        }

        if (preferences.generateStudyGuide && !study_guide) {
          await getTopics(sessionId);
          success.push("Study Guide");
        }

        toast.success(
          success.length > 0
            ? `${success.join(", ")} generated successfully.`
            : "All content already available.",
          { id: toastId }
        );

        initialContentGeneratedRef.current = true;
      } catch (err) {
        console.error("Auto-generation error:", err);
        toast.error("Some content failed to generate.", { id: toastId });
      }
    };

    generateIfNeeded();
  }, [sessionData, sessionId, isSendingMessage, flashcardOptions]);
}
