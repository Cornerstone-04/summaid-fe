import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, BookOpen } from "lucide-react";
import { SessionDocument } from "@/types";

interface ResultsTabsProps {
  sessionData: SessionDocument;
}

export function ResultsTabs({ sessionData }: ResultsTabsProps) {
  return (
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
            <h3 className="font-semibold text-lg mb-2">High-Level Summary</h3>
            <p>{sessionData.summary}</p>
          </div>
        ) : (
          <div className="text-muted-foreground text-center py-10">
            <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-muted-foreground/50" />
            Summary not yet generated or available.
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
                <p className="text-muted-foreground">{flashcard.answer}</p>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground text-center py-10">
            <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-muted-foreground/50" />
            Flashcards not yet generated or available.
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
