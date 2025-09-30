import type { FC } from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDatasetStore } from "../../stores/useDatasetStore";
import { useTopicStore } from "../../stores/useTopicStore";
import type { TopicWithAssignment } from "../../types/topic.types";

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
  const [content, setContent] = useState("");
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

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedTopic) {
      alert("Выберите тему для датасета");
      return;
    }

    if (!content.trim()) {
      alert("Введите содержимое датасета");
      return;
    }

    try {
      await createDataset({
        title: selectedTopic.topic.title,
        content,
        assignmentId: selectedTopic.assignment_id
      });
      setContent("");
      setSelectedTopic(null);
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Ошибка уже обработана в store
    }
  };

  const handleClose = () => {
    if (
      content.trim() &&
      !confirm("Вы уверены? Несохраненные изменения будут потеряны.")
    ) {
      return;
    }
    setContent("");
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
            <div className="flex items-center justify-between mb-2 flex-shrink-0">
              <label className="block text-sm font-medium text-gray-700">
                Содержимое датасета *
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  Символов: {content.length}
                </span>
              </div>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm"
              placeholder="Введите содержимое датасета..."
              disabled={isLoading}
              style={{ minHeight: "400px" }}
            />
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
            Совет: используйте заголовки для лучшей структуризации
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              Отмена
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !selectedTopic || !content.trim() || availableTopics.length === 0}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
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
