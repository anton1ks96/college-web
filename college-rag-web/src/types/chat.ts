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