// src/components/session/chat-section.tsx
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ContentType, SessionDocument } from "@/types";
import { useChatStore } from "@/store/useChatStore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatSectionProps {
  sessionData: SessionDocument;
  handleSendMessage: () => void;
  handleGenerateContent: (type: ContentType) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function ChatSection({
  sessionData,
  handleSendMessage,
  handleGenerateContent,
  messagesEndRef,
}: ChatSectionProps) {
  const { messages, chatInput, setChatInput, isSendingMessage } =
    useChatStore();

  return (
    <div className="flex-1 flex flex-col bg-muted/10 p-4 sm:p-6 min-h-0 h-full">
      <Card className="flex-1 flex flex-col bg-background rounded-none shadow-none border-none overflow-hidden min-h-0">
        <CardContent className="flex-1 max-h-full overflow-y-auto p-4 custom-scrollbar min-h-0">
          {messages.length === 0 ? (
            <div className="text-muted-foreground text-center py-10">
              <Sparkles className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
              No conversation yet. Ask a question or wait for processing to
              complete.
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 p-3 rounded-lg w-fit max-w-[75%] text-sm ${
                  message.role === "user"
                    ? "bg-sa-primary text-white ml-auto rounded-br-none"
                    : "bg-muted/80 text-foreground mr-auto rounded-bl-none border border-border"
                }`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp
                    ? new Date(message.timestamp).toLocaleTimeString()
                    : ""}
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
          disabled={isSendingMessage || sessionData.status !== "success"}
        />
        <Button
          size="icon"
          onClick={handleSendMessage}
          disabled={
            isSendingMessage ||
            !chatInput.trim() ||
            sessionData.status !== "success"
          }
          className="absolute bottom-3 right-3 flex items-center justify-center z-10"
        >
          <Send className="w-5 h-5" />
        </Button>

        <div className="absolute bottom-3 left-4 flex gap-3">
          {[
            ["summary", "Summarize note"],
            ["flashcards", "Create flashcards"],
            ["studyGuide", "Study Guide"],
            ["explain", "Explain more"],
          ].map(([type, label]) => (
            <Button
              key={type}
              variant="outline"
              size="sm"
              className="text-[10px] xxl:text-xs rounded-[6px] border-[0.8px]"
              onClick={() => handleGenerateContent(type as ContentType)}
              disabled={sessionData.status !== "success" || isSendingMessage}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
