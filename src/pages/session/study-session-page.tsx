// summaid-fe/src/pages/session/study-session-page.tsx
import { useParams } from "react-router"; // Use react-router-dom for useParams
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Send, Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DocumentListSection } from "@/components/session/document-list-section";
import { StudyToolsDisplaySection } from "@/components/session/study-tools-display-section";
import { api } from "@/utils/api"; // Import your configured Axios API client
import { AxiosError } from "axios";

interface FileDetail {
  fileName: string;
  cloudStorageUrl: string;
  mimeType: string;
  size: number;
  publicId?: string;
}

interface Flashcard {
  question: string;
  answer: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Timestamp;
}

interface SessionData {
  userId: string;
  files: FileDetail[];
  preferences: {
    generateFlashcards: boolean;
    generateStudyGuide: boolean;
    generateSummary: boolean;
  };
  createdAt: Timestamp;
  status: string;
  summary: string | null;
  flashcards: Flashcard[];
  studyGuide: string | null;
  chatHistory: ChatMessage[];
  errorMessage?: string;
}

interface BackendErrorResponse {
  message?: string;
  // Add other properties your backend might send in an error response, e.g., 'code', 'details'
}

export default function StudySessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
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

    const sessionRef = doc(db, "sessions", sessionId);
    const unsubscribe = onSnapshot(
      sessionRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as SessionData;
          setSessionData(data);
          setLoadingSession(false);
        } else {
          toast.error("Session not found.");
          setLoadingSession(false);
        }
      },
      (error) => {
        console.error("Error fetching session:", error);
        toast.error("Error loading session data.");
        setLoadingSession(false);
      }
    );

    return () => unsubscribe();
  }, [sessionId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [sessionData?.chatHistory]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !sessionId) return;

    setIsSendingMessage(true);

    const userMessage: ChatMessage = {
      role: "user",
      content: chatInput.trim(),
      timestamp: Timestamp.now(),
    };

    setSessionData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        chatHistory: [...prev.chatHistory, userMessage],
      };
    });
    setChatInput("");

    try {
      const backendUrl =
        process.env.NODE_ENV === "production"
          ? "YOUR_DEPLOYED_BACKEND_RENDER_URL"
          : "http://localhost:5000";

      const response = await api.post(`${backendUrl}/api/v1/chat-document`, {
        sessionId: sessionId,
        message: userMessage.content,
      });
      console.log(
        "Chatbot response initiated (backend will update Firestore):",
        response.data
      );
    } catch (error) {
      console.error("Error sending message to chatbot:", error);
      toast.error("Failed to get response from AI. Please try again.");

      setSessionData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          chatHistory: prev.chatHistory.slice(0, prev.chatHistory.length - 1),
        };
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  // --- NEW: Function to trigger on-demand content generation ---
  const handleGenerateContent = async (
    contentType:
      | "summary"
      | "flashcards"
      | "studyGuide"
      | "research"
      | "explain"
  ) => {
    if (!sessionId || sessionData?.status !== "completed") {
      toast.warning("Please wait for document processing to complete.");
      return;
    }
    if (isSendingMessage) {
      // Prevent multiple simultaneous calls
      toast.info("A request is already in progress.");
      return;
    }

    setIsSendingMessage(true); // Use this for a generic loading state for content generation
    toast.loading(
      `Generating ${contentType.replace(/([A-Z])/g, " $1").toLowerCase()}...`
    ); // E.g., "Generating study guide..."

    try {
      const backendUrl =
        process.env.NODE_ENV === "production"
          ? "YOUR_DEPLOYED_BACKEND_RENDER_URL"
          : "http://localhost:5000";

      // Call a new backend endpoint to trigger specific content generation
      const response = await api.post(
        `${backendUrl}/api/v1/documents/generate`,
        {
          sessionId: sessionId,
          contentType: contentType, // Send the type of content to generate
        }
      );

      toast.success(
        `Request for ${contentType
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()} sent to backend!`,
        { id: `generating_${contentType}` }
      );
      console.log("Content generation request sent:", response.data);

      // The backend will update Firestore, and the onSnapshot will update UI
    } catch (error) {
      const err = error as AxiosError<BackendErrorResponse>; // NEW: Use BackendErrorResponse here

      const errorMessage =
        err.response?.data?.message || // Now TypeScript knows data might have 'message'
        err.message ||
        `Failed to generate ${contentType.toLowerCase()}.`;

      console.error(
        `Error generating ${contentType.toLowerCase()}:`,
        errorMessage
      );
      toast.error(errorMessage, { id: `generating_${contentType}` });
    } finally {
      setIsSendingMessage(false);
    }
  };

  if (loadingSession) {
    return (
      <div className="relative flex flex-col min-h-screen bg-background text-foreground">
        <DashboardHeader />
        <main className="flex-1 flex flex-col md:flex-row p-4 sm:p-6">
          <Skeleton className="w-full md:w-1/4 h-[calc(100vh-100px)] rounded-lg mr-4 mb-4 md:mb-0" />
          <Skeleton className="flex-1 h-[calc(100vh-100px)] rounded-lg mr-4 mb-4 md:mb-0" />
          <Skeleton className="w-full md:w-1/4 h-[calc(100vh-100px)] rounded-lg" />
        </main>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="relative flex flex-col min-h-screen bg-background text-foreground">
        <DashboardHeader />
        <main className="flex-1 container mx-auto py-8 px-6 text-center text-destructive">
          <p>
            Session data could not be loaded. Please go back to the dashboard.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground">
      <DashboardHeader />
      <main className="flex-1 flex flex-col md:flex-row">
        {" "}
        {/* Main three-column layout */}
        {/* Left Sidebar: Data Sources & Study Tools Status */}
        <div className="w-full md:w-[280px] lg:w-[320px] xl:w-[360px] flex-shrink-0 border-r border-border p-4 sm:p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
          <DocumentListSection files={sessionData.files} />
          <StudyToolsDisplaySection
            preferences={sessionData.preferences}
            sessionStatus={sessionData.status}
          />
        </div>
        {/* Middle Column: Chat Area */}
        <div className="flex-1 flex flex-col bg-muted/10 p-4 sm:p-6">
          <Card className="flex-1 flex flex-col bg-background border rounded-lg shadow-sm">
            <CardHeader className="border-b p-4">
              <CardTitle className="text-lg">Chat with AI Assistant</CardTitle>
              <CardDescription>
                Get instant answers about your documents.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {sessionData.chatHistory.length === 0 ? (
                <div className="text-muted-foreground text-center py-10">
                  <Sparkles className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
                  No conversation yet. Ask a question or wait for processing to
                  complete.
                </div>
              ) : (
                sessionData.chatHistory.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 p-3 rounded-lg max-w-[80%] ${
                      message.role === "user"
                        ? "bg-sa-primary text-white ml-auto rounded-br-none"
                        : "bg-muted/80 text-foreground mr-auto rounded-bl-none border border-border"
                    }`}
                  >
                    <p>{message.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toDate().toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </CardContent>
            <CardFooter className="border-t p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Textarea
                  placeholder="Ask a question about your documents..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="flex-1 min-h-[40px] max-h-[120px] resize-y"
                  disabled={
                    isSendingMessage || sessionData.status !== "completed"
                  }
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={
                    isSendingMessage ||
                    !chatInput.trim() ||
                    sessionData.status !== "completed"
                  }
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleGenerateContent("summary")} // NEW: Call with content type
                  disabled={
                    sessionData.status !== "completed" || isSendingMessage
                  }
                >
                  Summarize note
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleGenerateContent("flashcards")} // NEW: Call with content type
                  disabled={
                    sessionData.status !== "completed" || isSendingMessage
                  }
                >
                  Create flashcards
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleGenerateContent("research")} // NEW: Call with content type
                  disabled={
                    sessionData.status !== "completed" || isSendingMessage
                  }
                >
                  Research
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleGenerateContent("explain")} // NEW: Call with content type
                  disabled={
                    sessionData.status !== "completed" || isSendingMessage
                  }
                >
                  Explain more
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
        {/* Right Sidebar: Generated Content Tabs */}
        <div className="w-full md:w-[280px] lg:w-[320px] xl:w-[360px] flex-shrink-0 p-4 sm:p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
          <Tabs defaultValue="summary" className="flex flex-col flex-1">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="summary">
                <Sparkles className="w-4 h-4 mr-2" /> Summary
              </TabsTrigger>
              <TabsTrigger value="flashcards">
                <BookOpen className="w-4 h-4 mr-2" /> Flashcards
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="summary"
              className="flex-1 overflow-y-auto custom-scrollbar p-2"
            >
              {sessionData.summary ? (
                <div className="prose dark:prose-invert">
                  <h3 className="font-semibold text-lg mb-2">
                    High-Level Summary
                  </h3>
                  <p>{sessionData.summary}</p>
                </div>
              ) : (
                <div className="text-muted-foreground text-center py-10">
                  <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-muted-foreground/50" />
                  Summary not yet generated or available.
                  {sessionData.status === "processing" && (
                    <p>Processing your document...</p>
                  )}
                  {sessionData.status === "completed" &&
                    !sessionData.summary && <p>No summary generated.</p>}
                </div>
              )}
            </TabsContent>
            <TabsContent
              value="flashcards"
              className="flex-1 overflow-y-auto custom-scrollbar p-2"
            >
              {sessionData.flashcards && sessionData.flashcards.length > 0 ? (
                <div className="space-y-4">
                  {sessionData.flashcards.map((flashcard, index) => (
                    <Card key={index} className="p-4">
                      <p className="font-semibold">{flashcard.question}</p>
                      <p className="text-muted-foreground">
                        {flashcard.answer}
                      </p>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground text-center py-10">
                  <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-muted-foreground/50" />
                  Flashcards not yet generated or available.
                  {sessionData.status === "processing" && (
                    <p>Processing your document...</p>
                  )}
                  {sessionData.status === "completed" &&
                    !sessionData.flashcards.length && (
                      <p>No flashcards generated.</p>
                    )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
