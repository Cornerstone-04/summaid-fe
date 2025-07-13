// src/types/index.ts

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
    cloudStorageUrl: string; // This might be redundant if Cloudinary is removed, but keeping for now.
    mimeType: string;
    size: number;
    publicId?: string; // This might be redundant if Cloudinary is removed, but keeping for now.
  }>;
  preferences: {
    generateFlashcards: boolean;
    flashcardOptions?: { // New: Optional nested object for flashcard specific preferences
      difficulty: "easy" | "medium" | "hard";
      numQuestions: number; // e.g., 5, 10, or 0 if disabled
      numOptions: number;   // e.g., 4, 2, or 0 if disabled (for true/false questions)
    };
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
  title?: string;
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
  status: string;
}
