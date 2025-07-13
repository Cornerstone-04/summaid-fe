import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentListSection } from "@/components/session/document-list-section";
import { StudyToolsDisplaySection } from "@/components/session/study-tools-display-section";
import { ChatSection } from "./chat-section";
import { ResultsTabs } from "./results-tab";
import { ContentType, SessionDocument } from "@/types";
import FlashcardOptions from "./flashcard-options-section"; // Import FlashcardOptions

interface MobileTabsViewProps {
  sessionData: SessionDocument;
  // Removed chatInput, setChatInput, isSendingMessage from props
  handleSendMessage: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  handleGenerateContent: (type: ContentType) => void;
  // Props for FlashcardOptions
  flashcardOptions: {
    difficulty: "easy" | "medium" | "hard";
    numQuestions: number;
    numOptions: number;
  };
  onDifficultyChange: (value: "easy" | "medium" | "hard") => void;
  onNumQuestionsToggle: (enabled: boolean) => void;
  onNumOptionsToggle: (enabled: boolean) => void;
  isSendingMessage: boolean; // Keep this as it's passed to FlashcardOptions
}

export function MobileTabsView({
  sessionData,
  handleSendMessage,
  messagesEndRef,
  handleGenerateContent,
  flashcardOptions,
  onDifficultyChange,
  onNumQuestionsToggle,
  onNumOptionsToggle,
  isSendingMessage, 
}: MobileTabsViewProps) {
  return (
    <div className="flex md:hidden p-4 space-y-4">
      <Tabs defaultValue="chat" className="w-full flex flex-col gap-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-6" value="sources">
          <DocumentListSection files={sessionData.files} />
          <StudyToolsDisplaySection
            preferences={sessionData.preferences}
            sessionStatus={sessionData.status}
          />
          {/* Render FlashcardOptions here for mobile view */}
          <FlashcardOptions
            difficulty={flashcardOptions.difficulty}
            numQuestions={flashcardOptions.numQuestions}
            numOptions={flashcardOptions.numOptions}
            onDifficultyChange={onDifficultyChange}
            onNumQuestionsToggle={onNumQuestionsToggle}
            onNumOptionsToggle={onNumOptionsToggle}
            isSendingMessage={isSendingMessage}
          />
        </TabsContent>

        <TabsContent value="chat">
          <ChatSection
            sessionData={sessionData}
            // Removed chatInput, setChatInput, isSendingMessage from ChatSection props
            handleSendMessage={handleSendMessage}
            messagesEndRef={messagesEndRef}
            handleGenerateContent={handleGenerateContent}
          />
        </TabsContent>

        <TabsContent value="results">
          <ResultsTabs sessionData={sessionData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
