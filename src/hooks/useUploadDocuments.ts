import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/store/useAuth";
import { api } from "@/utils/api";

const CLOUDINARY_CLOUD_NAME = "dszltxxy2";
const CLOUDINARY_UPLOAD_PRESET = "summaid_unsigned";

interface Preferences {
  generateFlashcards: boolean;
  generateStudyGuide: boolean;
  generateSummary: boolean;
}

interface CloudinaryFileDetail {
  fileName: string;
  cloudStorageUrl: string;
  mimeType: string;
  size: number;
  publicId?: string;
}

interface UploadAndProcessArgs {
  files: File[];
  preferences: Preferences;
}

export function useUploadDocuments() {
  const { user } = useAuth(); // User state from your authentication hook
  const [uploadProgress, setUploadProgress] = useState(0);

  const mutation = useMutation<string, Error, UploadAndProcessArgs>({
    mutationFn: async ({ files, preferences }) => {
      // Step 1: Ensure user is authenticated AND we have their UID
      if (!user || !user.id) {
        throw new Error("User not authenticated or UID missing.");
      }

      setUploadProgress(0);
      const sessionId = crypto.randomUUID();

      const uploadedFileDetails: CloudinaryFileDetail[] = [];
      let totalUploadedBytes = 0;
      const totalBytesToUpload = files.reduce(
        (sum, file) => sum + file.size,
        0
      );

      // Step 2: Upload files to Cloudinary
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);

        const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;

        try {
          const response = await axios.post(cloudinaryUploadUrl, formData, {
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const overallProgress =
                  ((totalUploadedBytes + progressEvent.loaded) /
                    totalBytesToUpload) *
                  100;
                setUploadProgress(Math.min(100, Math.round(overallProgress)));
              }
            },
          });

          if (response.status !== 200) {
            throw new Error(
              `Cloudinary upload failed for ${file.name}: ${
                response.data?.error?.message ||
                response.statusText ||
                "Unknown error"
              }`
            );
          }

          const data = response.data;
          uploadedFileDetails.push({
            fileName: file.name,
            cloudStorageUrl: data.secure_url,
            mimeType: file.type,
            size: file.size,
            publicId: data.public_id,
          });
          totalUploadedBytes += file.size;
        } catch (axiosError: unknown) {
          if (axiosError instanceof AxiosError) {
            console.error(
              "Cloudinary upload failed for file:",
              file.name,
              axiosError.response?.data || axiosError.message
            );
            throw new Error(
              `Failed to upload ${file.name}: ${
                axiosError.response?.data?.error?.message || axiosError.message
              }`
            );
          } else {
            console.error(
              "An unexpected non-Axios error occurred:",
              axiosError
            );
            throw new Error(
              `An unexpected error occurred while uploading ${file.name}.`
            );
          }
        }
      }

      // Step 3: Crucial check for Supabase session directly before DB insert
      // This ensures the client has the most up-to-date authentication state
      const {
        data: { session: currentSession },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(
          `Failed to get current Supabase session: ${sessionError.message}`
        );
      }

      if (
        !currentSession ||
        !currentSession.user ||
        currentSession.user.id !== user.id
      ) {
        // This indicates a mismatch between useAuth's user and the actual Supabase session
        console.error("Supabase session mismatch or missing:", {
          useAuthUser: user?.id,
          currentSessionUser: currentSession?.user?.id,
        });
        throw new Error(
          "Supabase session invalid or not fully synchronized. Please try logging in again."
        );
      }

      console.log("Inserting session with user_id:", user.id); // Log the user.id being used
      console.log("Debug info before insert:", {
        userId: user.id,
        userIdType: typeof user.id,
        sessionUserId: currentSession.user.id,
        sessionUserIdType: typeof currentSession.user.id,
        areEqual: user.id === currentSession.user.id,
      });
      // Step 4: Supabase: Insert a new session record
      const { data: sessionInsertData, error: sessionInsertError } =
        await supabase
          .from("sessions")
          .insert({
            id: sessionId,
            user_id: user.id, // This is fine - Supabase will handle the conversion
            files: uploadedFileDetails,
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
        console.error("Supabase session insert failed:", sessionInsertError); // Log full error object
        throw new Error(
          `Failed to create session in Supabase: ${errorMessage}`
        );
      }

      if (!sessionInsertData) {
        throw new Error("Session data not returned after insertion.");
      }

      // Step 5: Call your backend API to initiate processing
      try {
        await api.post("/documents/process", { sessionId });
        toast.success("Session created and processing initiated!");
      } catch (backendError) {
        const err = backendError as AxiosError<{ message: string }>;
        const message = err.response?.data?.message || err.message;
        console.error("Error initiating backend processing:", message);
        await supabase
          .from("sessions")
          .update({
            status: "failed",
            error_message: `Backend processing initiation failed: ${message}`,
            processed_at: new Date().toISOString(),
          })
          .eq("id", sessionId);

        throw new Error(
          `Failed to initiate document processing on backend: ${message}`
        );
      }

      return sessionId;
    },
    onSuccess: (sessionId) => {
      toast.success(
        `Documents uploaded and session ${sessionId} initiated successfully!`
      );
    },
    onError: (error) => {
      console.error("Upload process error:", error);
      toast.error(
        error.message || "An unexpected error occurred during upload."
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
