export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}

export interface SessionDocument {
  id: string;
  user_id: string;
  files: Array<{
    fileName: string;
    cloudStorageUrl: string;
    mimeType: string;
    size: number;
    publicId?: string;
  }>;
  preferences: {
    generateFlashcards: boolean;
    generateStudyGuide: boolean;
    generateSummary: boolean;
  };
  status: string;
  summary: string | null;
  flashcards: Array<{ question: string; answer: string }> | null;
  study_guide: string | null;
  chat_history: ChatMessage[] | null;
  error_message: string | null;
  created_at: string;
  processed_at: string | null;
  total_text_length: number | null;
  total_chunks: number | null;
  successful_files: string[] | null;
  processing_errors: string[] | null;
  title?: string; // Optional title for the session
}

export type Category =
  | "Summary"
  | "Flashcards"
  | "Study Guide"
  | "Processed"
  | "Pending"
  | "Error";

export type ContentType =
  | "summary"
  | "flashcards"
  | "studyGuide"
  | "research"
  | "explain";

export interface StudyMaterial {
  id: string;
  name: string;
  date: string;
  categories: Category[];
  status: string; // Reflects the processing status
}

{
  /**
  interface SessionData {
  id: string;
  user_id: string;
  files: FileDetail[];
  preferences: {
    generateFlashcards: boolean;
    generateStudyGuide: boolean;
    generateSummary: boolean;
  };
  created_at: string;
  status: string;
  summary: string | null;
  flashcards: Flashcard[];
  study_guide: string | null;
  chat_history: ChatMessage[];
  error_message?: string;
  processed_at: string | null;
  total_text_length: number;
  total_chunks: number;
  successful_files: string[];
  processing_errors: string[];
}
  */
}
