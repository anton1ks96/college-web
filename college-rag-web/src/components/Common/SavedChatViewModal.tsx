import type { FC } from "react";
import { useState, useEffect } from "react";
import type { SavedChat } from "../../types/savedChat.types";

interface SavedChatViewModalProps {
  chat: SavedChat | null;
  isOpen: boolean;
  isLoading: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSave: (title: string) => Promise<void>;
  onDownload: () => void;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const extractThinkContent = (text: string) => {
  const thinkMatch = text.match(/<think>([\s\S]*?)<\/think>/i);
  const hiddenText = thinkMatch ? thinkMatch[1].trim() : null;
  const visibleText = thinkMatch ? text.replace(thinkMatch[0], "").trim() : text;
  return { visibleText, hiddenText };
};

export const SavedChatViewModal: FC<SavedChatViewModalProps> = ({
  chat,
  isOpen,
  isLoading,
  isSaving,
  onClose,
  onSave,
  onDownload,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (chat) {
      setTitle(chat.title);
      setIsEditing(false);
    }
  }, [chat]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (title.trim() && title !== chat?.title) {
      await onSave(title.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(chat?.title || "");
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-xl font-semibold text-gray-900 w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    autoFocus
                  />
                  <button
                    onClick={handleSave}
                    disabled={isSaving || !title.trim()}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                    title="Сохранить"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                    title="Отмена"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {chat?.title}
                    </h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                      title="Редактировать название"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                  {chat && (
                    <p className="text-sm text-gray-500 mt-1">
                      Автор: {chat.created_by} • Создан: {formatDate(chat.created_at)}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={onDownload}
                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Скачать в Markdown"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : chat?.messages && chat.messages.length > 0 ? (
            <div className="space-y-6 max-w-3xl mx-auto">
              {chat.messages.map((message, index) => (
                <div key={message.id || index} className="space-y-3">
                  {/* Question */}
                  <div className="flex justify-end">
                    <div className="max-w-2xl px-4 py-3 rounded-lg bg-purple-600 text-white">
                      <p className="text-sm whitespace-pre-wrap">{message.question}</p>
                    </div>
                  </div>

                  {/* Answer */}
                  <div className="flex justify-start">
                    <div className="max-w-2xl">
                      <div className="px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-900">
                        {(() => {
                          const { visibleText, hiddenText } = extractThinkContent(message.answer);
                          return (
                            <>
                              {visibleText && (
                                <p className="text-sm whitespace-pre-wrap">{visibleText}</p>
                              )}
                              {hiddenText && (
                                <details className="mt-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                                  <summary className="cursor-pointer select-none text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Рассуждения
                                  </summary>
                                  <pre className="mt-2 whitespace-pre-wrap text-xs text-gray-600">
                                    {hiddenText}
                                  </pre>
                                </details>
                              )}
                            </>
                          );
                        })()}
                      </div>

                      {/* Citations */}
                      {message.citations && message.citations.length > 0 && (
                        <div className="mt-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Источники:
                          </div>
                          <div className="space-y-1">
                            {message.citations.map((citation, citIndex) => (
                              <div
                                key={citIndex}
                                className="text-xs text-gray-600 flex items-center"
                              >
                                <span className="inline-block w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></span>
                                Chunk #{citation.chunk_id}
                                <span className="mx-1.5 text-gray-300">•</span>
                                <span className="text-purple-600 font-medium">
                                  {Math.round(citation.score * 100)}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Нет сообщений в этом чате
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
