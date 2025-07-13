import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { UploadFormSection } from "@/components/upload/upload-form-section";
import { StudyToolsSection } from "@/components/upload/study-tools-section";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CloudPlus } from "@/assets/icons";
import { useUploadDocuments } from "@/hooks/useUploadDocuments";

export default function UploadPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTool = searchParams.get("tool");

  const [files, setFiles] = useState<File[]>([]);
  const [preferences, setPreferences] = useState({
    generateFlashcards: false,
    generateStudyGuide: false,
    generateSummary: false,
  });

  const {
    uploadDocuments,
    isLoading,
    isSuccess,
    uploadProgress,
    data: sessionId,
  } = useUploadDocuments();

  useEffect(() => {
    if (isSuccess && sessionId) {
      toast.success("Documents uploaded! Preparing your session...");
      navigate(`/session/${sessionId}`);
    }
  }, [isSuccess, sessionId, navigate]);

  const handleSubmitUpload = () => {
    const noToolsSelected =
      !preferences.generateSummary &&
      !preferences.generateFlashcards &&
      !preferences.generateStudyGuide;

    if (noToolsSelected) {
      toast.error(
        "Please select at least one study tool (Summary, Flashcards, or Study Guide)."
      );
      return;
    }

    if (files.length === 0) {
      toast.error("Please upload at least one document.");
      return;
    }

    uploadDocuments({ files, preferences });
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground">
      <DashboardHeader />

      <main className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 md:min-w-[300px] md:max-w-[400px] p-4 sm:p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
          <UploadFormSection files={files} setFiles={setFiles} />
          <StudyToolsSection
            initialTool={initialTool}
            preferences={preferences}
            setPreferences={setPreferences}
          />
        </div>

        {/* Preview Section */}
        <div className="flex-1 flex flex-col bg-muted/10">
          <Card className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-background rounded-none shadow-none">
            <img src={CloudPlus} alt="Cloud icon" />
            <p className="text-sm text-muted-foreground/80 max-w-md">
              Upload your notes to get started
            </p>
          </Card>

          <div className="relative mt-6 flex items-start gap-2">
            <Textarea
              placeholder="Ask a question about your documents..."
              value=""
              readOnly
              disabled
              className="flex-1 h-[150px] text-sm resize-none cursor-not-allowed"
            />
            <Button size="icon" className="absolute bottom-3 right-3" disabled>
              <Send className="w-5 h-5" />
            </Button>
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
              {[
                "Summarize note",
                "Create flashcards",
                "Research",
                "Explain more",
              ].map((label) => (
                <Button
                  key={label}
                  variant="outline"
                  size="sm"
                  disabled
                  className="text-xs"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Upload CTA */}
      <div className="sticky bottom-0 w-full bg-background border-t border-border p-4 flex justify-center shadow-lg z-10">
        <div className="text-center w-full max-w-xs">
          <Button
            onClick={handleSubmitUpload}
            disabled={isLoading || files.length === 0}
            className="w-full px-6 py-4 sm:px-8 sm:py-6 text-base sm:text-lg rounded-full bg-sa-primary hover:bg-[#054ed0] text-white shadow-lg disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                Uploading & Processing ({uploadProgress}%)
              </>
            ) : (
              "Start Study Session"
            )}
          </Button>
          <p className="text-muted-foreground text-xs sm:text-sm mt-3">
            Your files will be processed securely.
          </p>
        </div>
      </div>
    </div>
  );
}
