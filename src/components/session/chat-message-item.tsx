import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types";

interface ChatMessageItemProps {
  message: ChatMessage;
}

// Memoize the chat message item to prevent unnecessary re-renders
export const ChatMessageItem = React.memo(function ChatMessageItem({
  message,
}: ChatMessageItemProps) {
  if (message.content === "__typing__") {
    return (
      <div className="mb-4 p-3 rounded-lg w-fit max-w-[80%] text-xs leading-6 bg-muted/60 text-foreground mr-auto rounded-bl-none border border-border animate-pulse">
        <span className="opacity-60">Typing...</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mb-4 p-3 rounded-lg w-fit max-w-[80%] text-xs leading-6",
        message.role === "user"
          ? "bg-sa-primary text-white ml-auto rounded-br-none"
          : "bg-muted/80 text-foreground mr-auto rounded-bl-none border border-border"
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {message.content}
      </ReactMarkdown>
      <span className="text-xs opacity-70 mt-1 block">
        {message.timestamp
          ? new Date(message.timestamp).toLocaleTimeString([], {
              timeStyle: "short",
            })
          : ""}
      </span>
    </div>
  );
});
