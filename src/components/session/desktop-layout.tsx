import { DocumentListSection } from "@/components/session/document-list-section";
import { StudyToolsDisplaySection } from "@/components/session/study-tools-display-section";
import { ChatSection } from "./chat-section";
import { ResultsTabs } from "./results-tab";
import { ContentType, SessionDocument } from "@/types";
import FlashcardOptions from "./flashcard-options-section";

interface DesktopLayoutProps {
  sessionData: SessionDocument;
  // Removed chatInput, setChatInput from props as ChatSection now uses Zustand
  isSendingMessage: boolean; // Keep this as it's passed to FlashcardOptions
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
}

export function DesktopLayout({
  sessionData,
  isSendingMessage,
  handleSendMessage,
  messagesEndRef,
  handleGenerateContent,
  flashcardOptions,
  onDifficultyChange,
  onNumQuestionsToggle,
  onNumOptionsToggle,
}: DesktopLayoutProps) {
  return (
    <main className="hidden md:flex h-[calc(100vh-4rem)] overflow-hidden">
      <div className="w-full md:w-[280px] lg:w-[320px] xl:w-[360px] flex-shrink-0 border-r border-border p-4 sm:p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
        <DocumentListSection files={sessionData.files} />
        <StudyToolsDisplaySection
          preferences={sessionData.preferences}
          sessionStatus={sessionData.status}
        />
        <FlashcardOptions
          difficulty={flashcardOptions.difficulty}
          numQuestions={flashcardOptions.numQuestions}
          numOptions={flashcardOptions.numOptions}
          onDifficultyChange={onDifficultyChange}
          onNumQuestionsToggle={onNumQuestionsToggle}
          onNumOptionsToggle={onNumOptionsToggle}
          isSendingMessage={isSendingMessage}
        />
      </div>

      <ChatSection
        sessionData={sessionData}
        // Removed chatInput, setChatInput, isSendingMessage from ChatSection props as it uses Zustand
        handleSendMessage={handleSendMessage}
        messagesEndRef={messagesEndRef}
        handleGenerateContent={handleGenerateContent}
      />

      <div className="w-full md:w-[280px] lg:w-[320px] xl:w-[360px] flex-shrink-0 p-4 sm:p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
        <ResultsTabs sessionData={sessionData} />
      </div>
    </main>
  );
}
