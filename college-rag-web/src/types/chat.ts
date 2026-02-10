export interface Citation {
  chunk_id: number;
  score: number;
  original_score?: number;
  score_improvement?: number;
}

export interface AskResponse {
  answer: string;
  citations: Citation[];
}

export interface AskRequest {
  question: string;
}

export interface ChatError {
  message: string;
  status?: number;
}

// SSE event types
export type AskEvent =
  | { type: "thinking"; delta: string }
  | { type: "delta"; delta: string }
  | { type: "citations"; citations: Citation[] }
  | { type: "done" };