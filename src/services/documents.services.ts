import { api } from "@/config/api";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}

export interface MCQ {
  question: string;
  options: string[];
  answer: string;
}

/**
 * Initiates the document processing on the backend for a given session.
 * @param sessionId The unique identifier for the current study session.
 */
export const triggerDocumentProcessing = async (sessionId: string) => {
  await api.post("/process-documents/", { session_id: sessionId });
};

/**
 * Sends a user message to the backend chatbot and retrieves a response.
 * @param sessionId The unique identifier for the current study session.
 * @param conversationId The unique identifier for the current chat conversation within the session.
 * @param message The user's message to send to the chatbot.
 * @returns A Promise that resolves with the chatbot's response string.
 */
export const sendMessageToChatbot = async (
  sessionId: string,
  conversationId: string,
  message: string
): Promise<string> => {
  try {
    const response = await api.post<{ response: string }>("/chat/", {
      session_id: sessionId,
      conversation_id: conversationId,
      message: message,
    });

    if (response.data && typeof response.data.response === "string") {
      return response.data.response;
    } else {
      throw new Error("Invalid response format from chatbot API.");
    }
  } catch (error) {
    console.error("Error sending message to chatbot:", error);
    throw error;
  }
};

/**
 * Generates Multiple Choice Questions (MCQs) from documents in the vectorstore.
 * @param sessionId The unique identifier for the current study session.
 * @param query An optional topic or keyword to focus MCQ generation.
 * @param numQuestions The number of questions to generate (default: 5).
 * @param numOptions The number of options per question (default: 4).
 * @param difficulty The difficulty level ('easy', 'medium', 'hard', default: 'medium').
 * @returns A Promise that resolves with an array of generated MCQs.
 */
export const generateMCQs = async (
  sessionId: string,
  query?: string,
  numQuestions: number = 5,
  numOptions: number = 4,
  difficulty: "easy" | "medium" | "hard" = "hard"
): Promise<MCQ[]> => {
  try {
    const payload = {
      session_id: sessionId,
      ...(query && { query }),
      num_questions: numQuestions,
      num_options: numOptions,
      difficulty: difficulty,
    };
    const response = await api.post<{ mcqs: MCQ[] }>(
      "/generate-mcqs/",
      payload
    );

    if (response.data && Array.isArray(response.data.mcqs)) {
      return response.data.mcqs;
    } else {
      throw new Error("Invalid response format for MCQs from backend.");
    }
  } catch (error) {
    console.error("Error generating MCQs:", error);
    throw error;
  }
};

/**
 * Summarizes vector-retrieved content from a user’s document collection.
 * @param sessionId The unique identifier for the current study session.
 * @param query An optional topic or keyword to focus the summarization.
 * @returns A Promise that resolves with the summary string.
 */
export const generateSummary = async (
  sessionId: string,
  query?: string
): Promise<string> => {
  try {
    const payload = {
      session_id: sessionId,
      ...(query && { query }),
    };
    const response = await api.post<{ summary: string }>(
      "/summarize/",
      payload
    );

    if (response.data && typeof response.data.summary === "string") {
      return response.data.summary;
    } else {
      throw new Error("Invalid response format for summary from backend.");
    }
  } catch (error) {
    console.error("Error generating summary:", error);
    throw error;
  }
};

/**
 * Extracts and returns a list of relevant topics from user documents.
 * @param sessionId The unique identifier for the current study session.
 * @returns A Promise that resolves with an array of topic strings.
 */
export const getTopics = async (sessionId: string): Promise<string[]> => {
  try {
    const response = await api.get<{ topics: string[] }>(
      `/topics/${sessionId}`
    );

    if (response.data && Array.isArray(response.data.topics)) {
      return response.data.topics;
    } else {
      throw new Error("Invalid response format for topics from backend.");
    }
  } catch (error) {
    console.error("Error fetching topics:", error);
    throw error;
  }
};
