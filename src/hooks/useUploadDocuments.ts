import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/store/useAuth";

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
  const { user } = useAuth();
  const [uploadProgress, setUploadProgress] = useState(0);

  const mutation = useMutation<string, Error, UploadAndProcessArgs>({
    mutationFn: async ({ files, preferences }) => {
      if (!user) {
        throw new Error("User not authenticated.");
      }

      setUploadProgress(0);
      const sessionId = doc(collection(db, "sessions")).id;

      const uploadedFileDetails: CloudinaryFileDetail[] = [];
      let totalUploadedBytes = 0;
      const totalBytesToUpload = files.reduce(
        (sum, file) => sum + file.size,
        0
      );

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

      await setDoc(doc(db, "sessions", sessionId), {
        userId: user.uid,
        files: uploadedFileDetails,
        preferences: preferences,
        createdAt: serverTimestamp(),
        status: "processing",
        summary: null,
        flashcards: [],
        studyGuide: null,
        chatHistory: [],
      });

      return sessionId;
    },
    onSuccess: () => {
      toast.success(
        "Documents uploaded to Cloudinary! Processing your session..."
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
