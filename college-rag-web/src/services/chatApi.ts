import type {AskResponse} from "../types/chat";
import {coreAPI} from "../api/client";

export const chatApi = {
  async askQuestion(datasetId: string, message: string): Promise<AskResponse> {
    const makeRequest = () =>
      coreAPI.post<AskResponse>(`/api/v1/datasets/${datasetId}/ask`, {
        question: message,
      });

    try {
      const response = await makeRequest();
      return response.data;
    } catch (error: any) {
      if (error.message === "Network Error") {
        const response = await makeRequest();
        return response.data;
      }
      throw error;
    }
  },
};