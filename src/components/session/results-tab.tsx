import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { SessionDocument } from "@/types";
import { useEffect } from "react"; // Import useEffect for the debug log

interface ResultsTabsProps {
  sessionData: SessionDocument;
}

export function ResultsTabs({ sessionData }: ResultsTabsProps) {
  // Debugging log to check preferences and status
  useEffect(() => {
    console.log("ResultsTabs - sessionData:", sessionData);
    console.log(
      "ResultsTabs - generateFlashcards preference:",
      sessionData.preferences.generateFlashcards
    );
    console.log("ResultsTabs - session status:", sessionData.status);
    console.log("ResultsTabs - flashcards data:", sessionData.flashcards);
  }, [sessionData]); // Log whenever sessionData changes

  // Helper function to render content or a placeholder
  const renderContent = (content: string | null | undefined, type: string) => {
    const preferenceKey = `generate${type.replace(
      /\s/g,
      ""
    )}` as keyof typeof sessionData.preferences;

    if (!sessionData.preferences[preferenceKey]) {
      return (
        <div className="text-muted-foreground text-center py-10">
          <Sparkles className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
          {type} generation was not enabled for this session.
        </div>
      );
    }

    // Check if documents are still being processed
    // Use 'processed' or 'success' depending on your backend's final status
    if (
      sessionData.status !== "processed" &&
      sessionData.status !== "success"
    ) {
      return (
        <div className="text-muted-foreground text-center py-10">
          <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-muted-foreground/50" />
          Documents are still being processed. {type} will be available once
          complete.
        </div>
      );
    }

    if (content) {
      return (
        <div className="prose dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      );
    }

    return (
      <div className="text-muted-foreground text-center py-10">
        <Sparkles className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
        {type} not yet generated or available. Please use the "Generate {type}"
        button in the chat.
      </div>
    );
  };

  return (
    <Tabs defaultValue="summary" className="flex flex-col flex-1">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
        <TabsTrigger value="study-guide">Study Guide</TabsTrigger>
      </TabsList>

      {/* Summary Tab Content */}
      <TabsContent
        value="summary"
        className="flex-1 overflow-y-auto custom-scrollbar p-2"
      >
        {renderContent(sessionData.summary, "Summary")}
      </TabsContent>

      {/* Flashcards Tab Content */}
      <TabsContent
        value="flashcards"
        className="flex-1 overflow-y-auto custom-scrollbar p-2"
      >
        {sessionData.preferences.generateFlashcards ? (
          sessionData.status !== "processed" &&
          sessionData.status !== "success" ? (
            <div className="text-muted-foreground text-center py-10">
              <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-muted-foreground/50" />
              Documents are still being processed. Flashcards will be available
              once complete.
            </div>
          ) : sessionData.flashcards && sessionData.flashcards.length > 0 ? (
            <div className="space-y-4">
              {sessionData.flashcards.map((flashcard, index) => (
                <Card key={index} className="p-4">
                  <p className="font-semibold text-base mb-1">
                    {flashcard.question}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {flashcard.answer}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground text-center py-10">
              <Sparkles className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
              Flashcards not yet generated or available. Please use the "Create
              flashcards" button in the chat.
            </div>
          )
        ) : (
          <div className="text-muted-foreground text-center py-10">
            <Sparkles className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
            Flashcard generation was not enabled for this session.
          </div>
        )}
      </TabsContent>

      {/* Study Guide Tab Content */}
      <TabsContent
        value="study-guide"
        className="flex-1 overflow-y-auto custom-scrollbar p-2"
      >
        {renderContent(sessionData.study_guide, "Study Guide")}
      </TabsContent>
    </Tabs>
  );
}
