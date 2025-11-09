import type {FC} from "react";
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useDatasetStore} from "../../stores/useDatasetStore";
import {useTopicStore} from "../../stores/useTopicStore";
import type {TopicWithAssignment} from "../../types/topic.types";
import {
  createEmptyChunk,
  serializeChunks,
  type Chunk,
} from "../../utils/datasetChunks";

interface CreateDatasetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateDatasetModal: FC<CreateDatasetModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { createDataset, isLoading, error, clearError } = useDatasetStore();
  const { topics, fetchAssignedTopics } = useTopicStore();
  const location = useLocation();
  const [chunks, setChunks] = useState<Chunk[]>([createEmptyChunk()]);
  const [selectedTopic, setSelectedTopic] = useState<TopicWithAssignment | null>(null);

  useEffect(() => {
    if (isOpen && topics.length === 0) {
      fetchAssignedTopics();
    }
  }, [fetchAssignedTopics, isOpen, topics.length]);

  useEffect(() => {
    if (location.state?.assignmentId && topics.length > 0) {
      const topic = topics.find(t => t.assignment_id === location.state.assignmentId);
      if (topic) {
        setSelectedTopic(topic);
      }
    }
  }, [location.state, topics]);

  // Filter topics that don't have datasets yet (using backend flag)
  const availableTopics = topics.filter(topic => !topic.has_dataset);

  const compiledContent = serializeChunks(chunks);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedTopic) {
      alert("Выберите тему для датасета");
      return;
    }

    if (!compiledContent.trim()) {
      alert("Введите содержимое датасета");
      return;
    }

    try {
      await createDataset({
        title: selectedTopic.topic.title,
        content: compiledContent.trim(),
        assignmentId: selectedTopic.assignment_id
      });
      setChunks([createEmptyChunk()]);
      setSelectedTopic(null);
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Ошибка уже обработана в store
    }
  };

  const handleChunkChange = (
    chunkId: string,
    field: "title" | "body",
    value: string,
  ) => {
    setChunks((prev) =>
      prev.map((chunk) =>
        chunk.id === chunkId ? {...chunk, [field]: value} : chunk,
      ),
    );
  };

  const handleAddChunk = (index: number) => {
    setChunks((prev) => {
      const next = [...prev];
      next.splice(index + 1, 0, createEmptyChunk());
      return next;
    });
  };

  const handleRemoveChunk = (chunkId: string) => {
    setChunks((prev) => {
      if (prev.length === 1) {
        return [createEmptyChunk()];
      }
      return prev.filter((chunk) => chunk.id !== chunkId);
    });
  };

  const handleClose = () => {
    if (
      compiledContent.trim() &&
      !confirm("Вы уверены? Несохраненные изменения будут потеряны.")
    ) {
      return;
    }
    setChunks([createEmptyChunk()]);
    setSelectedTopic(null);
    clearError();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Создать новый датасет
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col px-6 py-4">
          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex-shrink-0">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Topic selection */}
          <div className="mb-4 flex-shrink-0">
            <label
              htmlFor="topic"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Тема *
            </label>
            <select
              id="topic"
              value={selectedTopic?.assignment_id || ""}
              onChange={(e) => {
                const topic = availableTopics.find(t => t.assignment_id === e.target.value);
                setSelectedTopic(topic || null);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isLoading || availableTopics.length === 0}
            >
              <option value="">
                {availableTopics.length === 0
                  ? "Нет доступных тем"
                  : "Выберите тему"}
              </option>
              {availableTopics.map((topic) => (
                <option key={topic.assignment_id} value={topic.assignment_id}>
                  {topic.topic.title}
                </option>
              ))}
            </select>
            {selectedTopic && (
              <p className="mt-1 text-xs text-gray-500">
                Преподаватель: {selectedTopic.topic.created_by}
              </p>
            )}
            {topics.length > 0 && availableTopics.length === 0 && (
              <p className="mt-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-2">
                У всех назначенных вам тем уже есть датасеты. Можно создать только один датасет на тему.
              </p>
            )}
            {topics.length > availableTopics.length && availableTopics.length > 0 && (
              <p className="mt-2 text-xs text-gray-500">
                Показаны только темы без датасетов ({availableTopics.length} из {topics.length})
              </p>
            )}
          </div>

          {/* Content Editor */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <div>
                <p className="text-sm font-medium text-gray-700">Структура датасета *</p>
                <p className="text-xs text-gray-500">
                  Заголовок превратится в `## Заголовок` при сохранении
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  Символов: {compiledContent.length}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3 text-xs text-gray-600 mb-4">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-600 font-bold">
                !
              </div>
              <p>
                Делите материал на чанки 400–800 символов: короткий заголовок, затем 2–3 абзаца. Один чанк описывает одну мысль, без длинных полотен и смешения тем.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              <div className="flex flex-col space-y-8">
                {chunks.map((chunk, index) => {
                  const order = index + 1;
                  const canRemove = chunks.length > 1;

                  return (
                    <div
                      key={chunk.id}
                      className="w-full rounded-3xl border border-gray-200/80 bg-white/80 backdrop-blur-sm shadow-sm transition hover:shadow-md"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
                            Чанк {order.toString().padStart(2, "0")}
                          </p>
                          <p className="text-sm text-gray-400">
                            {chunk.title ? chunk.title : "Добавьте краткий заголовок"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleAddChunk(index)}
                            className="inline-flex h-9 items-center rounded-full border border-gray-200 bg-white px-4 text-xs font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 disabled:opacity-40"
                            disabled={isLoading}
                          >
                            <span className="mr-2 text-lg leading-none">+</span>
                            Добавить чанк
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveChunk(chunk.id)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:text-red-500 hover:border-red-200 disabled:opacity-40"
                            disabled={isLoading || !canRemove}
                            title={
                              canRemove
                                ? "Удалить этот блок"
                                : "Нельзя удалить единственный блок"
                            }
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.8"
                                d="M6 7h12M9 7V5h6v2m-7 3v8m4-8v8m4-8v8M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="grid gap-5 px-5 py-5">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Заголовок блока
                          </label>
                          <input
                            type="text"
                            value={chunk.title}
                            onChange={(e) =>
                              handleChunkChange(chunk.id, "title", e.target.value)
                            }
                            placeholder="Например: История направления"
                            className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            disabled={isLoading}
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                            <span>Контент</span>
                          </div>
                          <textarea
                            value={chunk.body}
                            onChange={(e) =>
                              handleChunkChange(chunk.id, "body", e.target.value)
                            }
                            placeholder="Добавьте содержимое чанка..."
                            className="mt-2 w-full min-h-[160px] resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4 flex-shrink-0">
            <div className="flex">
              <svg
                className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  После сохранения датасет будет автоматически проиндексирован
                  для поиска. Используйте Markdown для структурирования
                  контента.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center flex-shrink-0">
          <div className="text-sm text-gray-500">
            Совет: разбивайте контент на небольшие осмысленные блоки
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 focus:outline-none text-gray-600 bg-white border border-gray-200 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Отмена
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                isLoading ||
                !selectedTopic ||
                !compiledContent.trim() ||
                availableTopics.length === 0
              }
              className="px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 focus:outline-none text-purple-600 bg-purple-50 border border-purple-200 hover:bg-purple-100 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Создание...
                </span>
              ) : (
                "Создать датасет"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
