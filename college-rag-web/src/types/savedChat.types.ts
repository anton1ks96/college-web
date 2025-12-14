import type { Citation } from "./chat";

export interface SavedChatMessage {
  id?: string;
  chat_id?: string;
  order_num?: number;
  question: string;
  answer: string;
  citations: Citation[];
  created_at?: string;
}

export interface SavedChat {
  id: string;
  dataset_id: string;
  user_id: string;
  title: string;
  created_by: string;
  messages: SavedChatMessage[];
  created_at: string;
  updated_at: string;
}

export interface SaveChatRequest {
  title: string;
  messages: {
    question: string;
    answer: string;
    citations: Citation[];
  }[];
}

export interface SavedChatListItem {
  id: string;
  dataset_id: string;
  user_id: string;
  title: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface SavedChatListResponse {
  chats: SavedChatListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface DeleteChatResponse {
  success: boolean;
  message: string;
}
