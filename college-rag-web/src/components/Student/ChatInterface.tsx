import type {FC} from "react";
import {useEffect, useRef, useState} from "react";
import type {Dataset} from "../../types/dataset.types";
import {chatApi} from "../../services/chatApi";
import type {Citation} from "../../types/chat";
import type {SavedChat, SavedChatListItem} from "../../types/savedChat.types";
import {useAuthStore} from "../../stores/useAuthStore";
import {useSavedChatStore} from "../../stores/useSavedChatStore";
import {SaveChatModal} from "../Common/SaveChatModal";
import {SavedChatsList} from "../Common/SavedChatsList";
import {SavedChatViewModal} from "../Common/SavedChatViewModal";
import {ConfirmDeleteModal} from "../Common/ConfirmDeleteModal";

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
  thinking?: string;
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

  // Saved chats state
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isSavedChatsOpen, setIsSavedChatsOpen] = useState(false);
  const [viewingChat, setViewingChat] = useState<SavedChat | null>(null);
  const [deletingChat, setDeletingChat] = useState<SavedChatListItem | null>(null);

  // Auth and saved chats stores
  const {user} = useAuthStore();
  const {
    chats,
    isLoading: isLoadingChats,
    isSaving,
    isDeleting,
    fetchChats,
    fetchChatById,
    createChat,
    updateChat,
    deleteChat,
    downloadChat,
    setCurrentChat,
  } = useSavedChatStore();

  // Check if user can save chats (teacher or admin only)
  const canSaveChats = user?.role === "teacher" || user?.role === "admin";

  const extractThinkContent = (text: string) => {
    if (!text) return {visibleText: "", hiddenText: null};
    const thinkMatch = text.match(/<think>([\s\S]*?)<\/think>/i);
    const hiddenText = thinkMatch ? thinkMatch[1].trim() : null;
    const visibleText = thinkMatch ? text.replace(thinkMatch[0], "").trim() : text;
    return {visibleText, hiddenText};
  };

  const streamTextRef = useRef("");
  const thinkingTextRef = useRef("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedDataset) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    const assistantId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantId,
      text: "",
      sender: "assistant",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    const questionText = inputValue;
    setInputValue("");
    setIsLoading(true);
    setError(null);
    streamTextRef.current = "";
    thinkingTextRef.current = "";

    try {
      await chatApi.askQuestion(selectedDataset, questionText, {
        onThinking(token) {
          thinkingTextRef.current += token;
          const thinking = thinkingTextRef.current;
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? {...m, thinking} : m)),
          );
        },
        onDelta(token) {
          streamTextRef.current += token;
          const text = streamTextRef.current;
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? {...m, text} : m)),
          );
        },
        onCitations(citations) {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? {...m, citations} : m)),
          );
        },
        onDone() {},
        onError(err) {
          setError(err.message);
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Произошла неизвестная ошибка";
      setError(errorMessage);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                text: m.text || "Извините, произошла ошибка при обработке вашего запроса.",
                error: errorMessage,
              }
            : m,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Saved chats handlers
  const handleSaveChat = async (title: string) => {
    if (!selectedDataset || messages.length === 0) return;

    // Convert messages to API format (pair user questions with assistant answers)
    const chatMessages: {question: string; answer: string; citations: Citation[]}[] = [];
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      if (msg.sender === "user") {
        // Find the next assistant message
        const nextMsg = messages[i + 1];
        if (nextMsg && nextMsg.sender === "assistant" && !nextMsg.error) {
          chatMessages.push({
            question: msg.text,
            answer: nextMsg.text,
            citations: nextMsg.citations || [],
          });
        }
      }
    }

    if (chatMessages.length === 0) return;

    await createChat(selectedDataset, {title, messages: chatMessages});
  };

  const handleOpenSavedChats = () => {
    if (selectedDataset) {
      fetchChats(selectedDataset);
      setIsSavedChatsOpen(true);
    }
  };

  const handleViewChat = async (chat: SavedChatListItem) => {
    setIsSavedChatsOpen(false);
    const fullChat = await fetchChatById(chat.id);
    setViewingChat(fullChat);
  };

  const handleUpdateChatTitle = async (title: string) => {
    if (viewingChat) {
      const updatedChat = await updateChat(viewingChat.id, {
        title,
        messages: viewingChat.messages.map((m) => ({
          question: m.question,
          answer: m.answer,
          citations: m.citations,
        })),
      });
      setViewingChat(updatedChat);
      // Refresh list if dataset is selected
      if (selectedDataset) {
        fetchChats(selectedDataset);
      }
    }
  };

  const handleDownloadChat = async (chat: SavedChatListItem | SavedChat) => {
    await downloadChat(chat.id, `${chat.title}.md`);
  };

  const handleDeleteChat = async () => {
    if (deletingChat) {
      await deleteChat(deletingChat.id);
      setDeletingChat(null);
    }
  };

  const handleCloseViewModal = () => {
    setViewingChat(null);
    setCurrentChat(null);
  };

  const selectedDatasetName = selectedDataset
    ? datasets.find((d) => d.id === selectedDataset)?.title
    : null;

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full relative">
      {/* Messages area - full height with overlay header */}
      <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
        {/* Fixed header with selected dataset - positioned absolutely inside messages area */}
        {selectedDataset && (
          <div className="absolute top-0 left-0 right-0 bg-gray-50 p-3.5 z-10 border-b border-gray-200">
            <div className="flex items-center justify-between px-6">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-100 border border-purple-200">
                <span className="text-sm text-purple-700 font-medium">
                  Поиск в: {selectedDatasetName}
                </span>
              </div>
              {canSaveChats && (
                <div className="flex items-center space-x-2">
                  {messages.length > 0 && (
                    <button
                      onClick={() => setIsSaveModalOpen(true)}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-full hover:bg-purple-100 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      Сохранить
                    </button>
                  )}
                  <button
                    onClick={handleOpenSavedChats}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    История
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="text-xm text-center max-w-md min-h-[3rem] flex items-center justify-center">
              {!selectedDataset
                ? "Выберите датасет слева для начала работы"
                : "Задайте вопрос, и я найду ответ в выбранном датасете"}
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto" style={{ paddingTop: selectedDataset ? '4rem' : '0' }}>
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
                  {(() => {
                    const {visibleText, hiddenText} = extractThinkContent(
                      message.text,
                    );
                    const thinkingContent = message.thinking || hiddenText;
                    return (
                      <>
                        {thinkingContent && (
                          <details open className="mb-1 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                            <summary className="cursor-pointer select-none text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Рассуждения
                            </summary>
                            <pre className="mt-1 mb-0 whitespace-pre-wrap text-xs text-gray-600">{thinkingContent}</pre>
                          </details>
                        )}
                        {visibleText.trim() && (
                          <div className="text-sm whitespace-pre-wrap">{visibleText.trim()}</div>
                        )}
                      </>
                    );
                  })()}

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
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="px-6 py-4 flex-shrink-0">
        {/* Отображение общей ошибки */}
        {error && (
          <div className="mb-4 max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 shadow-sm">
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
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-full shadow-lg shadow-purple-300/50 border border-gray-200 flex items-center px-6 py-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Спросите что-нибудь..."
              disabled={!selectedDataset || isLoading}
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSendMessage}
              disabled={!selectedDataset || !inputValue.trim() || isLoading}
              className="ml-3 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Saved Chats Modals */}
      <SaveChatModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveChat}
        isSaving={isSaving}
      />

      <SavedChatsList
        isOpen={isSavedChatsOpen}
        chats={chats}
        isLoading={isLoadingChats}
        onClose={() => setIsSavedChatsOpen(false)}
        onView={handleViewChat}
        onDownload={handleDownloadChat}
        onDelete={(chat) => setDeletingChat(chat)}
      />

      <SavedChatViewModal
        chat={viewingChat}
        isOpen={!!viewingChat}
        isLoading={isLoadingChats}
        isSaving={isSaving}
        onClose={handleCloseViewModal}
        onSave={handleUpdateChatTitle}
        onDownload={() => viewingChat && handleDownloadChat(viewingChat)}
      />

      <ConfirmDeleteModal
        isOpen={!!deletingChat}
        title="Удалить чат?"
        message={`Вы уверены, что хотите удалить чат "${deletingChat?.title}"? Это действие нельзя отменить.`}
        isDeleting={isDeleting}
        onConfirm={handleDeleteChat}
        onCancel={() => setDeletingChat(null)}
      />
    </div>
  );
};
