import type { FC } from "react";
import { useEffect, useState } from "react";
import { TeacherLayout } from "../../components/Layout/TeacherLayout";
import { useDatasetStore } from "../../stores/useDatasetStore";
import type { Dataset } from "../../types/dataset.types";

export const TeacherDatasetsPage: FC = () => {
  const { datasets, totalDatasets, isLoading, error, fetchDatasets } = useDatasetStore();
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const datasetsPerPage = 12;

  useEffect(() => {
    fetchDatasets(currentPage, datasetsPerPage);
  }, [currentPage]);

  const handleViewDataset = (dataset: Dataset) => {
    setSelectedDataset(dataset);
  };

  const handleCloseModal = () => {
    setSelectedDataset(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  const totalPages = Math.ceil(totalDatasets / datasetsPerPage);

  return (
    <TeacherLayout>
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0 bg-white shadow-sm border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Датасеты студентов</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Просмотр работ студентов по вашим темам
                </p>
              </div>
              <button
                onClick={() => fetchDatasets(currentPage, datasetsPerPage)}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p>{error}</p>
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : datasets && datasets.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {datasets.map((dataset) => (
                    <div
                      key={dataset.id}
                      className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:border-purple-300 transition-all duration-300"
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
                            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Создан: {formatDate(dataset.created_at)}</span>
                          </div>
                          {dataset.indexed_at && (
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Проиндексирован</span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleViewDataset(dataset)}
                          className="mt-auto w-full px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
                        >
                          Просмотреть
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-6 space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>

                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        if (pageNum < 1 || pageNum > totalPages) return null;

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                              currentPage === pageNum
                                ? 'bg-purple-600 text-white'
                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <svg
                  className="w-20 h-20 text-gray-300 mb-4"
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
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Нет датасетов
                </h3>
                <p className="text-gray-500 text-center max-w-md">
                  Студенты еще не создали датасеты по вашим темам
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Dataset Modal */}
      {selectedDataset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedDataset.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Студент: {selectedDataset.author || 'Неизвестно'}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
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
                      <p className="text-gray-900">{formatDate(selectedDataset.created_at)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Обновлен:</span>
                      <p className="text-gray-900">{formatDate(selectedDataset.updated_at)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Статус:</span>
                      <p className="text-gray-900">
                        {selectedDataset.indexed_at ? (
                          <span className="text-green-600">Проиндексирован</span>
                        ) : (
                          <span className="text-yellow-600">Ожидает индексации</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">ID:</span>
                      <p className="text-gray-900 font-mono text-xs">{selectedDataset.id}</p>
                    </div>
                  </div>
                </div>
                {selectedDataset.content ? (
                  <div className="whitespace-pre-wrap">{selectedDataset.content}</div>
                ) : (
                  <p className="text-gray-500 italic">Содержимое датасета недоступно</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </TeacherLayout>
  );
};