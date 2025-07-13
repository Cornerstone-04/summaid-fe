// src/store/useChatStore.ts
import { create } from "zustand";
import { ChatMessage } from "@/services/documents.services"; // Import ChatMessage interface

interface ChatState {
  messages: ChatMessage[];
  chatInput: string;
  isSendingMessage: boolean;
  setChatInput: (input: string) => void;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  setIsSendingMessage: (sending: boolean) => void;
  initializeMessages: (
    sessionId: string,
    initialHistory: ChatMessage[] | null
  ) => void;
  _currentSessionId: string | null; // Added this property to the interface
}

// Function to get initial state from localStorage
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
  messages: [], // Initial state, will be hydrated by initializeMessages
  chatInput: "",
  isSendingMessage: false,

  setChatInput: (input) => set({ chatInput: input }),

  addMessage: (message) => {
    set((state) => {
      const newMessages = [...state.messages, message];
      // Save to localStorage whenever messages are added
      const currentSessionId = get()._currentSessionId; // Removed 'as any'
      if (currentSessionId) {
        localStorage.setItem(
          `chat_history_${currentSessionId}`,
          JSON.stringify(newMessages)
        );
      }
      return { messages: newMessages };
    });
  },

  clearMessages: () => {
    set({ messages: [] });
    const currentSessionId = get()._currentSessionId; // Removed 'as any'
    if (currentSessionId) {
      localStorage.removeItem(`chat_history_${currentSessionId}`);
    }
  },

  setIsSendingMessage: (sending) => set({ isSendingMessage: sending }),

  // This method will be called from StudySessionPage to hydrate the store
  // and set the context for localStorage key
  initializeMessages: (sessionId, initialHistory) => {
    set({ _currentSessionId: sessionId }); // Store sessionId internally for localStorage key
    const storedMessages = getInitialChatState(sessionId);

    // Prioritize stored messages from localStorage.
    // If localStorage is empty, use initialHistory from Supabase (if available).
    // This handles the case where backend isn't persisting, but frontend has local history.
    if (storedMessages.length > 0) {
      set({ messages: storedMessages });
    } else if (initialHistory && initialHistory.length > 0) {
      set({ messages: initialHistory });
      // If initialHistory comes from Supabase and localStorage was empty, save it to localStorage
      localStorage.setItem(
        `chat_history_${sessionId}`,
        JSON.stringify(initialHistory)
      );
    } else {
      set({ messages: [] });
    }
  },
  // Internal property to hold the current sessionId for localStorage key management
  _currentSessionId: null,
}));
