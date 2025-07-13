import { create } from "zustand";
import { ChatMessage } from "@/services/documents.services";

interface ChatState {
  messages: ChatMessage[];
  chatInput: string;
  isSendingMessage: boolean;
  setChatInput: (input: string) => void;
  addMessage: (message: ChatMessage) => void;
  removeLastMessageIfTyping: () => void;
  clearMessages: () => void;
  setIsSendingMessage: (sending: boolean) => void;
  initializeMessages: (
    sessionId: string,
    initialHistory: ChatMessage[] | null
  ) => void;
  _currentSessionId: string | null;
}

const getInitialChatState = (sessionId: string): ChatMessage[] => {
  try {
    const storedMessages = localStorage.getItem(`chat_history_${sessionId}`);
    return storedMessages ? JSON.parse(storedMessages) : [];
  } catch (e) {
    console.error("Failed to parse chat history from localStorage", e);
    return [];
  }
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  chatInput: "",
  isSendingMessage: false,
  _currentSessionId: null,

  setChatInput: (input) => set({ chatInput: input }),

  addMessage: (message) => {
    set((state) => {
      const newMessages = [...state.messages, message];
      const currentSessionId = get()._currentSessionId;
      if (currentSessionId) {
        localStorage.setItem(
          `chat_history_${currentSessionId}`,
          JSON.stringify(newMessages)
        );
      }
      return { messages: newMessages };
    });
  },

  removeLastMessageIfTyping: () => {
    set((state) => {
      const last = state.messages[state.messages.length - 1];
      if (last && last.role === "assistant" && last.content === "__typing__") {
        return { messages: state.messages.slice(0, -1) };
      }
      return {};
    });
  },

  clearMessages: () => {
    set({ messages: [] });
    const currentSessionId = get()._currentSessionId;
    if (currentSessionId) {
      localStorage.removeItem(`chat_history_${currentSessionId}`);
    }
  },

  setIsSendingMessage: (sending) => set({ isSendingMessage: sending }),

  initializeMessages: (sessionId, initialHistory) => {
    set({ _currentSessionId: sessionId });
    const storedMessages = getInitialChatState(sessionId);

    if (storedMessages.length > 0) {
      set({ messages: storedMessages });
    } else if (initialHistory && initialHistory.length > 0) {
      set({ messages: initialHistory });
      localStorage.setItem(
        `chat_history_${sessionId}`,
        JSON.stringify(initialHistory)
      );
    } else {
      set({ messages: [] });
    }
  },
}));
