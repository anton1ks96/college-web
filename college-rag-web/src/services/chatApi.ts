import type {AskResponse} from "../types/chat";
import { coreAPI } from "../api/client";

export const chatApi = {
  async askQuestion(datasetId: string, message: string): Promise<AskResponse> {
    const response = await coreAPI.post<AskResponse>(
      `/api/v1/datasets/${datasetId}/ask`,
      { question: message }
    );

    return response.data;
  },
};