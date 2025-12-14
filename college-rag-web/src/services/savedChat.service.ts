import { coreAPI } from "../api/client";
import type {
  SavedChat,
  SavedChatListResponse,
  SaveChatRequest,
  DeleteChatResponse,
} from "../types/savedChat.types";

class SavedChatService {
  async createChat(datasetId: string, data: SaveChatRequest): Promise<SavedChat> {
    const response = await coreAPI.post<SavedChat>(
      `/api/v1/datasets/${datasetId}/chats`,
      data
    );
    return response.data;
  }

  async getDatasetChats(
    datasetId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<SavedChatListResponse> {
    const response = await coreAPI.get<SavedChatListResponse>(
      `/api/v1/datasets/${datasetId}/chats`,
      { params: { page, limit } }
    );
    return response.data;
  }

  async getChatById(chatId: string): Promise<SavedChat> {
    const response = await coreAPI.get<SavedChat>(`/api/v1/chats/${chatId}`);
    return response.data;
  }

  async updateChat(chatId: string, data: SaveChatRequest): Promise<SavedChat> {
    const response = await coreAPI.put<SavedChat>(
      `/api/v1/chats/${chatId}`,
      data
    );
    return response.data;
  }

  async deleteChat(chatId: string): Promise<DeleteChatResponse> {
    const response = await coreAPI.delete<DeleteChatResponse>(
      `/api/v1/chats/${chatId}`
    );
    return response.data;
  }

  async downloadChat(chatId: string): Promise<Blob> {
    const response = await coreAPI.get(`/api/v1/chats/${chatId}/download`, {
      responseType: "blob",
    });
    return response.data;
  }
}

export const savedChatService = new SavedChatService();
