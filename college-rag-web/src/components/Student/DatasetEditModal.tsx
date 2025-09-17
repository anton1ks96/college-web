import type { FC } from "react";
import { useState, useEffect } from "react";
import type { Dataset } from "../../types/dataset.types";
import { datasetService } from "../../services/dataset.service";

interface DatasetEditModalProps {
  dataset: Dataset | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const DatasetEditModal: FC<DatasetEditModalProps> = ({
  dataset,
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDatasetContent = async () => {
      if (dataset && isOpen) {
        setTitle(dataset.title);
        setOriginalTitle(dataset.title);
        setError(null);
        setIsLoading(true);

        try {
          // Загружаем полные данные датасета, включая содержимое
          const fullDataset = await datasetService.getDataset(dataset.id);
          const datasetContent = fullDataset.content || "";
          setContent(datasetContent);
          setOriginalContent(datasetContent);
        } catch (error: any) {
          setError("Ошибка при загрузке содержимого датасета");
          const fallbackContent = dataset.content || "";
          setContent(fallbackContent);
          setOriginalContent(fallbackContent);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadDatasetContent();
  }, [dataset, isOpen]);

  // Проверяем, были ли изменения
  const hasChanges = title !== originalTitle || content !== originalContent;

  const handleSave = async () => {
    if (!dataset || !title.trim()) {
      setError("Название не может быть пустым");
      return;
    }

    if (!hasChanges) {
      setError("Нет изменений для сохранения");
      return;
    }

    const wasPreviouslyLoading = isLoading;
    if (!wasPreviouslyLoading) {
      setIsLoading(true);
    }
    setError(null);

    try {
      await datasetService.updateDataset(dataset.id, title, content);

      // После успешного обновления отправляем на переиндексацию
      try {
        await datasetService.reindexDataset(dataset.id, dataset.user_id);
      } catch (reindexError: any) {
        console.warn("Ошибка при переиндексации:", reindexError);
        // Не показываем ошибку переиндексации пользователю, так как обновление прошло успешно
      }

      onSave();
      onClose();
    } catch (error: any) {
      setError(error.message || "Ошибка при сохранении датасета");
    } finally {
      if (!wasPreviouslyLoading) {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    onClose();
    // Сбрасываем изменения к оригинальным значениям
    setTitle(originalTitle);
    setContent(originalContent);
    setError(null);
  };

  if (!isOpen || !dataset) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 max-w-4xl shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="pb-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Редактирование датасета
          </h3>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Content */}
        <div className="mt-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Название датасета
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Введите название датасета"
              disabled={isLoading}
            />
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Содержимое датасета
            </label>
            {isLoading && !content ? (
              <div className="w-full h-96 border border-gray-300 rounded-md flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">Загрузка содержимого...</p>
                </div>
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm"
                placeholder="Введите содержимое датасета..."
                disabled={isLoading}
              />
            )}
            <p className="mt-1 text-xs text-gray-500">
              Символов: {content.length}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            disabled={isLoading}
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || !title.trim() || !hasChanges}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
};