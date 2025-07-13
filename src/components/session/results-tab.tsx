import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles } from "lucide-react";
import { SessionDocument } from "@/types";
import { toast } from "sonner";
import { FlashcardQuiz } from "./flashcards";
import { Button } from "../ui/button";

interface ResultsTabsProps {
  sessionData: SessionDocument;
}

export function ResultsTabs({ sessionData }: ResultsTabsProps) {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState({ score: 0, total: 0 });

  useEffect(() => {
    console.log("ResultsTabs - sessionData:", sessionData);
  }, [sessionData]);

  const handleQuizComplete = (score: number, total: number) => {
    setQuizCompleted(true);
    setQuizScore({ score, total });
    toast.success(`Quiz Completed! You scored ${score} out of ${total}.`);
  };

  const handleCancelQuiz = () => {
    setQuizCompleted(false);
    setQuizScore({ score: 0, total: 0 });
  };

  const renderContent = (
    content: string | null | undefined,
    type: "Summary" | "Study Guide"
  ) => {
    const prefKey = `generate${type.replace(
      /\s/g,
      ""
    )}` as keyof typeof sessionData.preferences;

    if (!sessionData.preferences[prefKey]) {
      return renderPlaceholder(
        `${type} generation was not enabled for this session.`
      );
    }

    if (sessionData.status !== "success") {
      return renderLoading(
        `${type} will be available once documents are done processing.`
      );
    }

    if (content) {
      return (
        <div className="prose dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      );
    }

    return renderPlaceholder(
      `${type} not yet generated or available. Use the "Generate ${type}" button in the chat.`
    );
  };

  const renderPlaceholder = (message: string) => (
    <div className="text-muted-foreground text-center py-10">
      <Sparkles className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
      {message}
    </div>
  );

  const renderLoading = (message: string) => (
    <div className="text-muted-foreground text-center py-10">
      <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-muted-foreground/50" />
      {message}
    </div>
  );

  const renderFlashcards = () => {
    if (!sessionData.preferences.generateFlashcards) {
      return renderPlaceholder(
        "Flashcard generation was not enabled for this session."
      );
    }

    if (sessionData.status !== "success") {
      return renderLoading(
        "Flashcards will be available once documents are done processing."
      );
    }

    if (!sessionData.flashcards || sessionData.flashcards.length === 0) {
      return renderPlaceholder(
        'Flashcards not yet generated or available. Use the "Create flashcards" button in the chat.'
      );
    }
    if (quizCompleted) {
      return (
        <div className="text-center mb-6">
          <h4 className="text-base font-semibold text-green-600">
            🎉 You scored {quizScore.score} out of {quizScore.total}
          </h4>
          <Button size="sm" className="mt-3" onClick={handleCancelQuiz}>
            Retake Quiz
          </Button>
        </div>
      );
    }

    return (
      <FlashcardQuiz
        flashcards={sessionData.flashcards}
        sessionTitle={
          sessionData.title || `Session ${sessionData.id.slice(0, 6)}`
        }
        initialDifficulty={
          sessionData.preferences.flashcardOptions?.difficulty || "medium"
        }
        numQuestionsToGenerate={
          sessionData.preferences.flashcardOptions?.numQuestions || 5
        }
        onQuizComplete={handleQuizComplete}
        onCancelQuiz={handleCancelQuiz}
      />
    );
  };

  return (
    <Tabs
      defaultValue="summary"
      className="flex flex-col flex-1 text-xs leading-6"
    >
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="summary" className="text-xs">Summary</TabsTrigger>
        <TabsTrigger value="flashcards" className="text-xs">Flashcards</TabsTrigger>
        <TabsTrigger value="study-guide" className="text-xs">Study Guide</TabsTrigger>
      </TabsList>

      <TabsContent
        value="summary"
        className="flex-1 overflow-y-auto custom-scrollbar p-2"
      >
        {renderContent(sessionData.summary, "Summary")}
      </TabsContent>

      <TabsContent
        value="flashcards"
        className="flex-1 overflow-y-auto custom-scrollbar p-2"
      >
        {renderFlashcards()}
      </TabsContent>

      <TabsContent
        value="study-guide"
        className="flex-1 overflow-y-auto custom-scrollbar p-2"
      >
        {renderContent(sessionData.study_guide, "Study Guide")}
      </TabsContent>
    </Tabs>
  );
}
