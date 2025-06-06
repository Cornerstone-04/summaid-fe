import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/store/useAuth";
import { UploadFormSection } from "@/components/upload/upload-form-section"; // Ensure correct import path
import { StudyToolsSection } from "@/components/upload/study-tools-section"; // Ensure correct import path
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CloudPlus } from "@/assets/icons";

export default function UploadPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialTool = searchParams.get("tool");

  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [preferences, setPreferences] = useState({
    generateFlashcards: false,
    generateStudyGuide: false,
    generateSummary: false,
  });

  const handleUploadAndProcess = async () => {
    if (
      !preferences.generateSummary &&
      !preferences.generateFlashcards &&
      !preferences.generateStudyGuide
    ) {
      toast.error(
        "Please select at least one content generation tool (Summary, Flashcards, or Study Guide)."
      );
      return;
    }

    if (files.length === 0) {
      toast.error("Please upload at least one document to start.");
      return;
    }
    if (!user) {
      toast.error("You must be logged in to upload documents.");
      navigate("/auth/get-started");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    const storage = getStorage();
    const sessionId = doc(collection(db, "sessions")).id;

    try {
      const uploadedFileDetails: {
        fileName: string;
        storagePath: string;
        downloadURL: string;
        mimeType: string;
        size: number;
      }[] = [];

      for (const file of files) {
        const fileRef = ref(
          storage,
          `users/${user.uid}/sessions/${sessionId}/${file.name}`
        );
        const uploadTask = uploadBytesResumable(fileRef, file);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(Math.round(progress));
            },
            (error) => {
              console.error("Upload failed:", error);
              toast.error(`Failed to upload ${file.name}.`);
              setIsUploading(false);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              uploadedFileDetails.push({
                fileName: file.name,
                storagePath: uploadTask.snapshot.ref.fullPath,
                downloadURL: downloadURL,
                mimeType: file.type,
                size: file.size,
              });
              resolve();
            }
          );
        });
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

      toast.success("Documents uploaded! Processing your session...");
      navigate(`/session/${sessionId}`);
    } catch (error) {
      console.error("Error during upload or Firestore update:", error);
      toast.error(
        "An error occurred during session creation. Please try again."
      );
      setIsUploading(false);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground">
      <DashboardHeader />
      <main className="flex-1 flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 md:min-w-[300px] md:max-w-[400px] p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 overflow-y-auto custom-scrollbar">
          <UploadFormSection files={files} setFiles={setFiles} />
          <StudyToolsSection
            initialTool={initialTool}
            preferences={preferences}
            setPreferences={setPreferences}
          />
        </div>

        <div className="flex-1 flex flex-col bg-muted/10">
          <Card className="flex-1 flex flex-col items-center justify-center text-center p-4 sm:p-6 bg-background rounded-none shadow-none">
            <img src={CloudPlus} alt="" />
            <p className="text-sm text-muted-foreground/80max-w-md">
              Upload your notes <br />
              to get started
            </p>
          </Card>
          <div className="relative mt-4 sm:mt-6 flex items-start gap-2">
            <Textarea
              placeholder="Ask a question about your documents..."
              value=""
              readOnly
              className="flex-1 h-[150px] cursor-not-allowed text-sm resize-none"
              disabled
            />
            <Button
              size="icon"
              className="absolute bottom-3 right-3 flex items-center justify-center"
              disabled
            >
              <Send className="w-5 h-5" />
            </Button>
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 mt-2 justify-center">
              <Button variant="outline" size="sm" disabled className="text-xs">
                Summarize note
              </Button>
              <Button variant="outline" size="sm" disabled className="text-xs">
                Create flashcards
              </Button>
              <Button variant="outline" size="sm" disabled className="text-xs">
                Research
              </Button>
              <Button variant="outline" size="sm" disabled className="text-xs">
                Explain more
              </Button>
            </div>
          </div>
        </div>
      </main>

      <div className="sticky bottom-0 w-full bg-background border-t border-border p-4 flex justify-center shadow-lg z-10">
        <div className="text-center w-full max-w-xs">
          <Button
            onClick={handleUploadAndProcess}
            disabled={isUploading || files.length === 0}
            className="px-6 py-4 rounded-full text-base bg-sa-primary hover:bg-[#054ed0] text-white w-full shadow-lg sm:px-8 sm:py-6 sm:text-lg disabled:cursor-not-allowed! cursor-pointer"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                Uploading & Processing ({uploadProgress}%)
              </>
            ) : (
              "Start Study Session"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
