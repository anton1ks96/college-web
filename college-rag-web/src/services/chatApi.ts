import type {AskResponse} from "../types/chat";
import { getAccessToken } from "../utils/cookies";

const CHAT_API_BASE_URL = "http://localhost:8081";

export const chatApi = {
  async askQuestion(datasetId: string, message: string): Promise<AskResponse> {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("No access token found");
    }

    const response = await fetch(`${CHAT_API_BASE_URL}/api/v1/datasets/${datasetId}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ question: message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  },
};