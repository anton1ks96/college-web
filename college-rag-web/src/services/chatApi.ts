import type {AskEvent, Citation} from "../types/chat";
import {coreAPI} from "../api/client";
import {getAccessToken} from "../utils/cookies";

const ERROR_MESSAGES: Record<string, string> = {
  "no relevant content found": "По вашему запросу не найдено релевантной информации в датасете. Попробуйте переформулировать вопрос.",
  "failed to embed question": "Не удалось обработать ваш вопрос. Попробуйте позже.",
  "failed to search vectors": "Ошибка поиска по базе знаний. Попробуйте позже.",
  "failed to rerank": "Ошибка ранжирования результатов. Попробуйте позже.",
};

function formatError(error: string): string {
  return ERROR_MESSAGES[error] || error;
}

export interface StreamCallbacks {
  onThinking: (token: string) => void;
  onDelta: (token: string) => void;
  onCitations: (citations: Citation[]) => void;
  onDone: () => void;
  onError: (error: Error) => void;
}

export const chatApi = {
  async askQuestion(
    datasetId: string,
    message: string,
    callbacks: StreamCallbacks,
  ): Promise<void> {
    const token = getAccessToken();

    const baseURL = coreAPI.defaults.baseURL || "";
    const response = await fetch(`${baseURL}/api/v1/datasets/${datasetId}/ask`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? {Authorization: `Bearer ${token}`} : {}),
      },
      body: JSON.stringify({question: message}),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const msg = body?.error || `HTTP ${response.status}`;
      throw new Error(msg);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const {done, value} = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, {stream: true});

        const lines = buffer.split("\n");
        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || "";

        let eventType = "";
        for (const line of lines) {
          if (line.startsWith("event:")) {
            eventType = line.slice(6).trim();
          } else if (line.startsWith("data:") && eventType === "message") {
            const data = line.slice(5).trim();
            try {
              const event: AskEvent = JSON.parse(data);
              switch (event.type) {
                case "thinking":
                  callbacks.onThinking(event.delta);
                  break;
                case "delta":
                  callbacks.onDelta(event.delta);
                  break;
                case "citations":
                  callbacks.onCitations(event.citations);
                  break;
                case "done":
                  callbacks.onDone();
                  break;
                case "error":
                  callbacks.onError(new Error(formatError(event.error)));
                  break;
              }
            } catch {
              // skip malformed JSON
            }
            eventType = "";
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  },
};
