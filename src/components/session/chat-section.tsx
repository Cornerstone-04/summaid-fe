import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ContentType, SessionDocument } from "@/types";

interface ChatSectionProps {
  sessionData: SessionDocument;
  chatInput: string;
  setChatInput: (val: string) => void;
  isSendingMessage: boolean;
  handleSendMessage: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  handleGenerateContent: (type: ContentType) => void;
}

export function ChatSection({
  sessionData,
  chatInput,
  setChatInput,
  isSendingMessage,
  handleSendMessage,
  messagesEndRef,
  handleGenerateContent,
}: ChatSectionProps) {
  return (
    <div className="flex-1 flex flex-col bg-muted/10 p-4 sm:p-6 min-h-0 h-full">
      <Card className="flex-1 flex flex-col bg-background rounded-none shadow-none border-none overflow-hidden min-h-0">
        <CardContent className="flex-1 max-h-full overflow-y-auto p-4 custom-scrollbar min-h-0">
          {sessionData.chat_history?.length === 0 ? (
            <div className="text-muted-foreground text-center py-10">
              <Sparkles className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
              No conversation yet. Ask a question or wait for processing to
              complete.
            </div>
          ) : (
            sessionData.chat_history?.map((message, index) => (
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
                  {new Date(message.timestamp!).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </CardContent>
      </Card>

      <div className="relative mt-4 flex-shrink-0">
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
          className="flex-1 h-[150px] text-sm resize-none pr-12 pb-[50px] pt-5 border rounded-2xl pl-4"
          disabled={isSendingMessage || sessionData.status !== "completed"}
        />
        <Button
          size="icon"
          onClick={handleSendMessage}
          disabled={
            isSendingMessage ||
            !chatInput.trim() ||
            sessionData.status !== "completed"
          }
          className="absolute bottom-3 right-3 flex items-center justify-center"
        >
          <Send className="w-5 h-5" />
        </Button>

        <div className="absolute bottom-3 left-4 flex flex-wrap gap-3">
          {[
            ["summary", "Summarize note"],
            ["flashcards", "Create flashcards"],
            ["research", "Research"],
            ["explain", "Explain more"],
          ].map(([type, label]) => (
            <Button
              key={type}
              variant="outline"
              size="sm"
              className="text-xs rounded-[6px] border-[0.8px]"
              onClick={() => handleGenerateContent(type as ContentType)}
              disabled={sessionData.status !== "completed" || isSendingMessage}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
