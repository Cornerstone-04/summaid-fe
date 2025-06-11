import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentListSection } from "@/components/session/document-list-section";
import { StudyToolsDisplaySection } from "@/components/session/study-tools-display-section";
import { ChatSection } from "./chat-section";
import { ResultsTabs } from "./results-tab";
import { ContentType, SessionDocument } from "@/types";

interface MobileTabsViewProps {
  sessionData: SessionDocument;
  chatInput: string;
  setChatInput: (val: string) => void;
  isSendingMessage: boolean;
  handleSendMessage: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  handleGenerateContent: (type: ContentType) => void;
}

export function MobileTabsView({
  sessionData,
  chatInput,
  setChatInput,
  isSendingMessage,
  handleSendMessage,
  messagesEndRef,
  handleGenerateContent,
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
        </TabsContent>

        <TabsContent value="chat">
          <ChatSection
            sessionData={sessionData}
            chatInput={chatInput}
            setChatInput={setChatInput}
            isSendingMessage={isSendingMessage}
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
