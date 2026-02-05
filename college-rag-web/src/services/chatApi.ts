import type {AskResponse} from "../types/chat";
import {coreAPI} from "../api/client";

export const chatApi = {
  async askQuestion(datasetId: string, message: string, maxRetries = 5): Promise<AskResponse> {
    const makeRequest = () =>
      coreAPI.post<AskResponse>(`/api/v1/datasets/${datasetId}/ask`, {
        question: message,
      }, {
        timeout: 7000,
      });

    let lastError: any;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await makeRequest();
        return response.data;
      } catch (error: any) {
        lastError = error;
        const isTimeout = error.code === "ECONNABORTED" || error.message?.includes("timeout");
        const isNetworkError = error.message === "Network Error";
        if (!isTimeout && !isNetworkError) {
          throw error;
        }
      }
    }
    throw lastError;
  },
};