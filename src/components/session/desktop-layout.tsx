import { DocumentListSection } from "@/components/session/document-list-section";
import { StudyToolsDisplaySection } from "@/components/session/study-tools-display-section";
import { ChatSection } from "./chat-section";
import { ResultsTabs } from "./results-tab";
import { ContentType, SessionDocument } from "@/types";

interface DesktopLayoutProps {
  sessionData: SessionDocument;
  chatInput: string;
  setChatInput: (val: string) => void;
  isSendingMessage: boolean;
  handleSendMessage: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  handleGenerateContent: (type: ContentType) => void;
}

export function DesktopLayout({
  sessionData,
  chatInput,
  setChatInput,
  isSendingMessage,
  handleSendMessage,
  messagesEndRef,
  handleGenerateContent,
}: DesktopLayoutProps) {
  return (
    <main className="hidden md:flex flex-1 h-[calc(100vh-theme(spacing.16))]">
      <div className="w-full md:w-[280px] lg:w-[320px] xl:w-[360px] flex-shrink-0 border-r border-border p-4 sm:p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
        <DocumentListSection files={sessionData.files} />
        <StudyToolsDisplaySection
          preferences={sessionData.preferences}
          sessionStatus={sessionData.status}
        />
      </div>

      <ChatSection
        sessionData={sessionData}
        chatInput={chatInput}
        setChatInput={setChatInput}
        isSendingMessage={isSendingMessage}
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
