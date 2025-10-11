import type {FC} from "react";
import type {Dataset} from "../../types/dataset.types";

interface DatasetSidebarProps {
  datasets: Dataset[];
  selectedDataset: string | null;
  onDatasetSelect: (datasetId: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export const DatasetSidebar: FC<DatasetSidebarProps> = ({
  datasets,
  selectedDataset,
  onDatasetSelect,
  isLoading = false,
  error = null,
}) => {
  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Мои датасеты</h2>
      </div>

      {/* Datasets list */}
      <div className="flex-1 overflow-y-auto">
        {/* Состояние загрузки */}
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
              <span className="text-sm text-gray-600">Загрузка датасетов...</span>
            </div>
          </div>
        )}

        {/* Состояние ошибки */}
        {error && !isLoading && (
          <div className="p-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Ошибка загрузки</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Список датасетов */}
        {!isLoading && !error && (
          <div className="p-4 space-y-2">
            {!datasets || datasets.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                    <svg
                        className="w-24 h-24 text-gray-400 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-900">Нет датасетов</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Пока нет доступных датасетов для поиска
                </p>
              </div>
            ) : (
              datasets.map((dataset) => (
            <div
              key={dataset.id}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                selectedDataset === dataset.id
                  ? "border-purple-300 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => onDatasetSelect(dataset.id)}
            >
              <div className="flex items-start space-x-3">
                {/* Checkbox */}
                <div className="mt-1">
                  <input
                    type="radio"
                    name="selectedDataset"
                    checked={selectedDataset === dataset.id}
                    onChange={() => {}}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* Dataset info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {dataset.title}
                  </h3>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className="text-xs text-gray-500">
                      {new Date(dataset.created_at).toLocaleDateString("ru-RU")}
                    </span>
                    {dataset.indexed_at ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Индексирован
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                        Не индексирован
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
              ))
            )}
          </div>
        )}
      </div>

    </aside>
  );
};
