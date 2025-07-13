import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/store/useAuth";
import { BACKEND_URL } from "@/config/env";
import { api } from "@/config/api";

interface Preferences {
  generateFlashcards: boolean;
  generateStudyGuide: boolean;
  generateSummary: boolean;
}

interface UploadAndProcessArgs {
  files: File[];
  preferences: Preferences;
}

export function useUploadDocuments() {
  const { user } = useAuth();
  const [uploadProgress, setUploadProgress] = useState(0);

  const mutation = useMutation<string, Error, UploadAndProcessArgs>({
    mutationFn: async ({ files, preferences }) => {
      if (!user?.id) {
        throw new Error("User not authenticated or UID missing.");
      }

      setUploadProgress(0);
      const sessionId = crypto.randomUUID();
      const conversationId = sessionId;

      console.log("Inserting session with user_id:", user.id);
      const { data: sessionInsertData, error: sessionInsertError } =
        await supabase
          .from("sessions")
          .insert({
            id: sessionId,
            user_id: user.id,
            title: `Session ${sessionId.slice(0, 6)}`,
            files: files.map((file) => ({
              fileName: file.name,
              mimeType: file.type,
              size: file.size,
            })),
            preferences: preferences,
            created_at: new Date().toISOString(),
            status: "pending",
            summary: null,
            flashcards: [],
            study_guide: null,
            chat_history: [],
            error_message: null,
            processed_at: null,
            total_text_length: 0,
            total_chunks: 0,
            successful_files: [],
            processing_errors: [],
          })
          .select()
          .single();

      if (sessionInsertError) {
        const errorMessage =
          sessionInsertError.message ||
          "Unknown error during Supabase session creation.";
        console.error("Supabase session insert failed:", sessionInsertError);
        throw new Error(
          `Failed to create session in Supabase: ${errorMessage}`
        );
      }

      if (!sessionInsertData) {
        throw new Error("Session data not returned after insertion.");
      }

      const formData = new FormData();
      formData.append("session_id", sessionId);
      formData.append("conversation_id", conversationId);

      files.forEach((file) => {
        formData.append("files", file);
      });

      try {
        console.log(
          "Posting files to backend:",
          `${BACKEND_URL}/process-documents/`
        );

        const response = await api.post("/process-documents/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            }
          },
        });

        if (response.status !== 200) {
          throw new Error(
            `Backend processing failed: ${
              response.data?.message || response.statusText || "Unknown error"
            }`
          );
        }

        await supabase
          .from("sessions")
          .update({
            status: "success", // Or 'processed' if your backend confirms full processing
            processed_at: new Date().toISOString(),
            // You can also parse response.data to update other fields like total_text_length, total_chunks, successful_files
            // For now, assuming successful processing means the files were handled.
          })
          .eq("id", sessionId);

        toast.success(
          response.data.message ||
            "Documents processed successfully by backend!"
        );
      } catch (backendError) {
        const err = backendError as AxiosError<{ message: string }>;
        const message =
          err.response?.data?.message ||
          err.message ||
          "An unknown error occurred.";
        console.error("Error initiating backend processing:", message);

        await supabase
          .from("sessions")
          .update({
            status: "failed",
            error_message: `Backend processing failed: ${message}`,
            processed_at: new Date().toISOString(),
          })
          .eq("id", sessionId);

        throw new Error(`Failed to process documents on backend: ${message}`);
      }

      return sessionId;
    },
    onSuccess: (sessionId) => {
      toast.success(
        `Documents uploaded and session ${sessionId} initiated successfully!`
      );
      // Optionally, navigate to the session page or dashboard
      // navigate(`/session/${sessionId}`);
    },
    onError: (error) => {
      console.error("Upload process error:", error);
      toast.error(
        error.message || "An unexpected error occurred during document upload."
      );
    },
  });

  return {
    uploadDocuments: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    uploadProgress,
    data: mutation.data,
  };
}
