import type { FC } from "react";
import { useState } from "react";
import type { Dataset } from "../../types/dataset.types";
import { chatApi } from "../../services/chatApi";
import type { Citation } from "../../types/chat";

interface ChatInterfaceProps {
  selectedDataset: string | null;
  datasets: Dataset[];
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
  citations?: Citation[];
  error?: string;
}

export const ChatInterface: FC<ChatInterfaceProps> = ({
  selectedDataset,
  datasets,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedDataset) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const questionText = inputValue;
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatApi.askQuestion(selectedDataset, questionText);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.answer,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Произошла неизвестная ошибка";
      setError(errorMessage);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Извините, произошла ошибка при обработке вашего запроса.",
        sender: "assistant",
        timestamp: new Date(),
        error: errorMessage,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedDatasetName = selectedDataset
    ? datasets.find((d) => d.id === selectedDataset)?.title
    : null;

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Selected datasets indicator */}
      {selectedDataset && (
        <div className="bg-purple-50 border-b border-purple-200 px-6 py-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-purple-700 font-medium">
              Поиск в датасете:
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
              {selectedDatasetName}
            </span>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              Начните диалог
            </h3>
            <p className="text-sm text-center max-w-md">
              {!selectedDataset
                ? "Выберите датасет слева для начала работы"
                : "Задайте вопрос, и я найду ответ в выбранном датасете"}
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-2xl px-4 py-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-purple-600 text-white"
                      : message.error
                      ? "bg-red-50 border border-red-200 text-red-900"
                      : "bg-white border border-gray-200 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>

                  {/* Отображение ошибки */}
                  {message.error && (
                    <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-xs text-red-700">
                      <strong>Ошибка:</strong> {message.error}
                    </div>
                  )}


                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "user"
                        ? "text-purple-200"
                        : message.error
                        ? "text-red-400"
                        : "text-gray-400"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString("ru-RU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg">
                  <div className="flex space-x-2">
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 bg-white px-6 py-4">
        {/* Отображение общей ошибки */}
        {error && (
          <div className="mb-4 max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setError(null)}
                    className="inline-flex rounded-md text-red-400 hover:text-red-500 focus:outline-none"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex space-x-4 max-w-4xl mx-auto">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder={
              !selectedDataset
                ? "Сначала выберите датасет..."
                : "Введите ваш вопрос..."
            }
            disabled={!selectedDataset || isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSendMessage}
            disabled={!selectedDataset || !inputValue.trim() || isLoading}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Отправка..." : "Отправить"}
          </button>
        </div>
      </div>
    </div>
  );
};
