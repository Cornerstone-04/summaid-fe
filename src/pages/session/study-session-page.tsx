import { useParams } from "react-router"; // You might need to install react-router-dom: pnpm add react-router-dom
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Send, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Your firestore instance
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Define the structure of a session document in Firestore
interface FileDetail {
  fileName: string;
  downloadURL: string;
  mimeType: string;
  storagePath: string;
}

// Define the structure for a Flashcard
interface Flashcard {
  question: string;
  answer: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Timestamp; // Firebase Timestamp or string
}

interface SessionData {
  userId: string;
  files: FileDetail[];
  preferences: {
    generateFlashcards: boolean;
    generateStudyGuide: boolean;
    // ... other preferences
  };
  createdAt: Timestamp; // Firebase Timestamp
  status: string;
  summary: string | null;
  flashcards: Flashcard[]; // Define a more specific type later if needed
  studyGuide: string | null;
  chatHistory: ChatMessage[];
}

export default function StudySessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false); // For chatbot loading state

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
          toast.success("Session data loaded!");
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

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [sessionId]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !sessionId) return;

    setIsSendingMessage(true);
    // Here you would typically call a Firebase Cloud Function (HTTP Callable)
    // that handles the chatbot interaction, including RAG.
    // For now, this is a placeholder.

    // Example of calling a hypothetical Cloud Function (replace with actual implementation)
    // const functions = getFunctions();
    // const chatWithDocument = httpsCallable(functions, 'chatWithDocument');
    // await chatWithDocument({ sessionId, message: chatInput.trim() });

    // For demonstration, let's simulate a response and update chat history locally
    const newChatMessage: ChatMessage = {
      role: "user",
      content: chatInput.trim(),
      timestamp: Timestamp.now(),
    };

    // Optimistically update UI (real implementation would wait for Cloud Function response)
    setSessionData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        chatHistory: [...prev.chatHistory, newChatMessage],
      };
    });

    setChatInput("");
    setIsSendingMessage(false);

    // In a real scenario, the Cloud Function would update the Firestore document
    // with the full chat history, including the AI's response.
    // The onSnapshot listener above would then automatically update the UI.
  };

  if (loadingSession) {
    return (
      <div className="relative flex flex-col min-h-screen bg-background text-foreground">
        <DashboardHeader />
        <main className="flex-1 container mx-auto py-8 px-6">
          <Skeleton className="h-10 w-1/3 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="grid grid-cols-3 gap-8">
            <Skeleton className="col-span-2 h-[600px] rounded-lg" />
            <Skeleton className="h-[600px] rounded-lg" />
          </div>
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
      <main className="flex-1 container mx-auto py-8 px-6">
        <h1 className="text-3xl font-bold mb-2">Study Session: {sessionId}</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Engage with your materials and learn interactively.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[calc(100vh-250px)]">
          {/* Left Column: Chat Area */}
          <Card className="md:col-span-2 flex flex-col p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-lg">
                Chat with your documents
              </CardTitle>
              <CardDescription>
                Ask questions, clarify concepts, and explore your content.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <div className="flex-1 overflow-y-auto border rounded-md p-4 bg-muted/20 custom-scrollbar">
                {sessionData.chatHistory.length === 0 ? (
                  <div className="text-muted-foreground text-center py-10">
                    No conversation yet. Start by asking a question!
                  </div>
                ) : (
                  sessionData.chatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`mb-4 p-3 rounded-lg max-w-[80%] ${
                        message.role === "user"
                          ? "bg-sa-primary text-white ml-auto rounded-br-none"
                          : "bg-background text-foreground mr-auto rounded-bl-none border"
                      }`}
                    >
                      <p>{message.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.role === "user" ? "You" : "AI"} at{" "}
                        {message.timestamp.toDate().toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                )}
                {isSendingMessage && (
                  <div className="mb-4 p-3 rounded-lg max-w-[80%] bg-background text-foreground mr-auto rounded-bl-none border">
                    <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
                    AI is typing...
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center gap-2">
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
                  disabled={isSendingMessage}
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={isSendingMessage || !chatInput.trim()}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right Column: Generated Content Tabs */}
          <Card className="flex flex-col p-6">
            <Tabs defaultValue="summary" className="flex flex-col flex-1">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="summary">
                  <Sparkles className="w-4 h-4 mr-2" /> Summary
                </TabsTrigger>
                <TabsTrigger value="flashcards">
                  <BookOpen className="w-4 h-4 mr-2" /> Flashcards
                </TabsTrigger>
                {/* Add more tabs for Study Guide if distinct from summary */}
              </TabsList>
              <TabsContent
                value="summary"
                className="flex-1 overflow-y-auto custom-scrollbar p-2"
              >
                {sessionData.summary ? (
                  <div className="prose dark:prose-invert">
                    {/* Render summary content here, e.g., using markdown renderer if needed */}
                    <p>{sessionData.summary}</p>
                  </div>
                ) : (
                  <div className="text-muted-foreground text-center py-10">
                    Summary not yet generated or available.
                    {sessionData.status === "processing" && (
                      <p>Processing your document...</p>
                    )}
                    {/* Add a button to manually trigger summary generation if not automatic */}
                  </div>
                )}
              </TabsContent>
              <TabsContent
                value="flashcards"
                className="flex-1 overflow-y-auto custom-scrollbar p-2"
              >
                {sessionData.flashcards && sessionData.flashcards.length > 0 ? (
                  <div className="space-y-4">
                    {sessionData.flashcards.map(
                      (flashcard: Flashcard, index: number) => (
                        <Card key={index} className="p-4">
                          <p className="font-semibold">{flashcard.question}</p>
                          <p className="text-muted-foreground">
                            {flashcard.answer}
                          </p>
                        </Card>
                      )
                    )}
                  </div>
                ) : (
                  <div className="text-muted-foreground text-center py-10">
                    Flashcards not yet generated or available.
                    {sessionData.preferences.generateFlashcards &&
                      sessionData.status === "processing" && (
                        <p>Processing your document...</p>
                      )}
                    {/* Add a button to manually trigger flashcard generation if not automatic */}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
    </div>
  );
}
