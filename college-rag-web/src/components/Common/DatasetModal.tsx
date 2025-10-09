import type {FC} from "react";
import type {Dataset} from "../../types/dataset.types";
import type {ColorScheme} from "./Pagination";

interface DatasetModalProps {
  dataset: Dataset | null;
  isLoading: boolean;
  onClose: () => void;
  formatDate: (dateString: string) => string;
  colorScheme?: ColorScheme;
}

const borderColorClasses: Record<ColorScheme, string> = {
  purple: 'border-purple-600',
  red: 'border-red-600',
  blue: 'border-blue-600',
  green: 'border-green-600',
  yellow: 'border-yellow-600',
};

export const DatasetModal: FC<DatasetModalProps> = ({
  dataset,
  isLoading,
  onClose,
  formatDate,
  colorScheme = 'purple',
}) => {
  if (!dataset && !isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div
              className={`animate-spin rounded-full h-12 w-12 border-b-2 ${borderColorClasses[colorScheme]}`}
            ></div>
          </div>
        ) : (
          dataset && (
            <>
              <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {dataset.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Студент: {dataset.author || 'Неизвестно'}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
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
              <div className="flex-1 overflow-auto p-6">
                <div className="prose prose-gray max-w-none">
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Создан:</span>
                        <p className="text-gray-900">{formatDate(dataset.created_at)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Обновлен:</span>
                        <p className="text-gray-900">{formatDate(dataset.updated_at)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Статус:</span>
                        <p className="text-gray-900">
                          {dataset.indexed_at ? (
                            <span className="text-green-600">Проиндексирован</span>
                          ) : (
                            <span className="text-yellow-600">Ожидает индексации</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">ID:</span>
                        <p className="text-gray-900 font-mono text-xs">{dataset.id}</p>
                      </div>
                    </div>
                  </div>
                  {dataset.content ? (
                    <div className="whitespace-pre-wrap">{dataset.content}</div>
                  ) : (
                    <p className="text-gray-500 italic">Содержимое датасета недоступно</p>
                  )}
                </div>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};
