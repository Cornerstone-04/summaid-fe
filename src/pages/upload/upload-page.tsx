// src/pages/upload/upload-page.tsx
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, UploadCloud, FileText, XCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
// Import firebase storage functions
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { db } from "@/lib/firebase"; // Your firestore instance
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/store/useAuth"; // To get current user UID

export default function UploadPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // State for study tool preferences
  const [preferences, setPreferences] = useState({
    generateFlashcards: false,
    generateStudyGuide: false,
    // Add other preferences as needed, e.g., chatbotEnabled: true
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Filter out unsupported file types if necessary, though backend should also validate
      const validFiles = acceptedFiles.filter((file) => {
        const mimeType = file.type;
        // Allow common document types, adjust as needed
        if (
          mimeType === "application/pdf" ||
          mimeType ===
            "application/vnd.openxmlformats-officedocument.presentationml.presentation" || // .pptx
          mimeType === "application/msword" || // .doc
          mimeType ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || // .docx
          mimeType.startsWith("image/") // All image types
        ) {
          return true;
        }
        toast.error(`File type not supported for ${file.name}.`);
        return false;
      });

      if (validFiles.length > 0) {
        // Limit to max 5 attachments as per UI design (Home-3.png)
        if (files.length + validFiles.length > 5) {
          toast.error("Maximum 5 attachments allowed per session.");
          setFiles((prevFiles) => [
            ...prevFiles,
            ...validFiles.slice(0, 5 - prevFiles.length),
          ]);
        } else {
          setFiles((prevFiles) => [...prevFiles, ...validFiles]);
        }
      }
    },
    [files.length]
  );

  const removeFile = (fileToRemove: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUploadAndProcess = async () => {
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
    const sessionId = doc(collection(db, "sessions")).id; // Generate a unique session ID

    try {
      const uploadedFileDetails: {
        fileName: string;
        storagePath: string;
        downloadURL: string;
        mimeType: string;
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
              });
              resolve();
            }
          );
        });
      }

      // Store session metadata in Firestore
      await setDoc(doc(db, "sessions", sessionId), {
        userId: user.uid,
        files: uploadedFileDetails,
        preferences: preferences, // Store selected preferences
        createdAt: serverTimestamp(),
        status: "processing", // Initial status
        summary: null, // Placeholder for summary
        flashcards: [], // Placeholder for flashcards
        studyGuide: null, // Placeholder for study guide
        chatHistory: [], // Placeholder for chat history
      });

      toast.success("Documents uploaded! Processing your session...");
      navigate(`/session/${sessionId}`); // Navigate to the new session page
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
      <main className="flex-1 container mx-auto py-8 px-6">
        <h1 className="text-3xl font-bold mb-2">Start a New Study Session</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Upload your lecture materials and let AI help you learn smarter.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: File Upload */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
              <CardDescription>
                Max of 5 attachments. Supports PDF, DOCX, PPTX, and Images.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-sa-primary/50 transition-colors"
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-muted-foreground">
                    Drop the files here ...
                  </p>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <UploadCloud className="w-12 h-12 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      <span className="text-sa-primary font-medium">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                  </div>
                )}
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Selected Files:</h3>
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-md bg-muted/30"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-sa-primary" />
                        <span>{file.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(file)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Column: Study Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Study Tools Available</CardTitle>
              <CardDescription>
                Select AI tools to generate for this session.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="flashcards-switch">Generate Flashcards</Label>
                  <CardDescription>
                    Create interactive flashcards from your content.
                  </CardDescription>
                </div>
                <Switch
                  id="flashcards-switch"
                  checked={preferences.generateFlashcards}
                  onCheckedChange={(checked) =>
                    setPreferences((prev) => ({
                      ...prev,
                      generateFlashcards: checked,
                    }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="study-guide-switch">
                    Generate Study Guide
                  </Label>
                  <CardDescription>
                    Get a structured study guide with key points.
                  </CardDescription>
                </div>
                <Switch
                  id="study-guide-switch"
                  checked={preferences.generateStudyGuide}
                  onCheckedChange={(checked) =>
                    setPreferences((prev) => ({
                      ...prev,
                      generateStudyGuide: checked,
                    }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="chatbot-switch">Enable Chatbot</Label>
                  <CardDescription>
                    Interact with AI for further learning.
                  </CardDescription>
                </div>
                <Switch
                  id="chatbot-switch"
                  checked={true} // Chatbot is always enabled as per UI design
                  disabled
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Start Session Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={handleUploadAndProcess}
            disabled={isUploading || files.length === 0}
            className="px-8 py-6 rounded-full text-lg bg-sa-primary hover:bg-[#054ed0] text-white"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Uploading & Processing ({uploadProgress}%)
              </>
            ) : (
              "Start Study Session"
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
