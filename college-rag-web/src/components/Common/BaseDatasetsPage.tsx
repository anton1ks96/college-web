import type { FC, ReactNode } from "react";
import { useState } from "react";
import type { ColorScheme } from "./Pagination";
import { Pagination } from "./Pagination";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorAlert } from "./ErrorAlert";
import { EmptyState } from "./EmptyState";
import { DatasetModal } from "./DatasetModal";
import type { Dataset } from "../../types/dataset.types";

interface BaseDatasetsPageProps {
  Layout: FC<{ children: ReactNode }>;
  colorScheme: ColorScheme;
  title: string;
  subtitle: string;
  datasets: Dataset[];
  totalDatasets: number;
  isLoading: boolean;
  error: string | null;
  fetchDatasets: (page: number, limit: number) => void;
  getDatasetById: (id: string) => Promise<Dataset>;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  datasetsPerPage: number;
  emptyStateText: string;
  formatDate: (dateString: string) => string;
}

export const BaseDatasetsPage: FC<BaseDatasetsPageProps> = ({
  Layout,
  colorScheme,
  title,
  subtitle,
  datasets,
  totalDatasets,
  isLoading,
  error,
  fetchDatasets,
  getDatasetById,
  currentPage,
  setCurrentPage,
  datasetsPerPage,
  emptyStateText,
  formatDate,
}) => {
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [isLoadingDataset, setIsLoadingDataset] = useState(false);

  const handleViewDataset = async (dataset: Dataset) => {
    setIsLoadingDataset(true);
    try {
      const fullDataset = await getDatasetById(dataset.id);
      setSelectedDataset(fullDataset);
    } catch (error) {
      console.error("Ошибка загрузки датасета:", error);
    } finally {
      setIsLoadingDataset(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedDataset(null);
  };

  const totalPages = Math.ceil(totalDatasets / datasetsPerPage);

  const ringColorClasses: Record<ColorScheme, string> = {
    purple: 'focus:ring-purple-500',
    red: 'focus:ring-red-500',
    blue: 'focus:ring-blue-500',
    green: 'focus:ring-green-500',
    yellow: 'focus:ring-yellow-500',
  };

  const borderColorClasses: Record<ColorScheme, string> = {
    purple: 'hover:border-purple-300',
    red: 'hover:border-red-300',
    blue: 'hover:border-blue-300',
    green: 'hover:border-green-300',
    yellow: 'hover:border-yellow-300',
  };

  const bgColorClasses: Record<ColorScheme, string> = {
    purple: 'bg-purple-50 text-purple-700 hover:bg-purple-100',
    red: 'bg-red-50 text-red-700 hover:bg-red-100',
    blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
    green: 'bg-green-50 text-green-700 hover:bg-green-100',
    yellow: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100',
  };

  return (
    <Layout>
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0 bg-white shadow-sm border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
              </div>
              <button
                onClick={() => fetchDatasets(currentPage, datasetsPerPage)}
                disabled={isLoading}
                className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 ${ringColorClasses[colorScheme]} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <svg
                  className={`-ml-1 mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Обновить
              </button>
            </div>
            {totalDatasets > 0 && (
              <div className="mt-2">
                <span className="text-xs text-gray-500">
                  Всего датасетов: {totalDatasets}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto bg-gray-50 p-6">
            <ErrorAlert error={error} onClose={undefined} />

            {isLoading ? (
              <LoadingSpinner colorScheme={colorScheme} />
            ) : datasets && datasets.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {datasets.map((dataset) => (
                    <div
                      key={dataset.id}
                      className={`bg-white rounded-xl shadow-md p-6 border border-gray-200 ${borderColorClasses[colorScheme]} transition-all duration-300`}
                    >
                      <div className="flex flex-col h-full">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {dataset.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          Студент: {dataset.author || 'Неизвестно'}
                        </p>
                        <div className="flex flex-col space-y-2 text-xs text-gray-500 mb-4">
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1.5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span>Создан: {formatDate(dataset.created_at)}</span>
                          </div>
                          {dataset.indexed_at && (
                            <div className="flex items-center">
                              <svg
                                className="w-4 h-4 mr-1.5 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span>Проиндексирован</span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleViewDataset(dataset)}
                          className={`mt-auto w-full px-3 py-2 ${bgColorClasses[colorScheme]} rounded-lg transition-colors text-sm font-medium`}
                        >
                          Просмотреть
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  colorScheme={colorScheme}
                />
              </>
            ) : (
              <EmptyState title="Нет датасетов" description={emptyStateText} />
            )}
          </div>
        </div>
      </div>

      {/* View Dataset Modal */}
      {(selectedDataset || isLoadingDataset) && (
        <DatasetModal
          dataset={selectedDataset}
          isLoading={isLoadingDataset}
          onClose={handleCloseModal}
          formatDate={formatDate}
          colorScheme={colorScheme}
        />
      )}
    </Layout>
  );
};
