import type {FC} from "react";
import {useEffect, useState} from "react";
import {DatasetGrid} from "../../components/Student/DatasetGrid";
import {CreateDatasetModal} from "../../components/Student/CreateDatasetModal";
import {useDatasetStore} from "../../stores/useDatasetStore";

export const DatasetsPage: FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const datasetsPerPage = 12;
  const { datasets, totalDatasets, isLoading, fetchDatasets } =
    useDatasetStore();

  useEffect(() => {
    fetchDatasets(currentPage, datasetsPerPage);
  }, [fetchDatasets, currentPage]);

  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Мои датасеты</h1>
          <p className="mt-1 text-sm text-gray-500">
            Управляйте вашими учебными материалами
          </p>
        </div>

        {/* Actions bar */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 focus:outline-none text-purple-600 bg-purple-50 border border-purple-200 hover:bg-purple-100 shadow-sm flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Создать датасет
            </button>
          </div>
          <div className="text-sm text-gray-600">
            Всего датасетов:{" "}
            <span className="font-medium">{totalDatasets}</span>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (!datasets || datasets.length === 0) ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Загрузка датасетов...</p>
            </div>
          </div>
        ) : !datasets || datasets.length === 0 ? (
          <div className="text-center py-12">
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Нет датасетов
            </h3>
            <p className="text-gray-500 mb-4">
              Создайте ваш первый датасет для начала работы
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Создать первый датасет
            </button>
          </div>
        ) : (
          <>
            <DatasetGrid
              datasets={datasets}
              onDatasetUpdated={() => fetchDatasets(currentPage, datasetsPerPage)}
            />

            {/* Pagination */}
            {Math.ceil(totalDatasets / datasetsPerPage) > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-2">
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
                  {Array.from({
                    length: Math.min(5, Math.ceil(totalDatasets / datasetsPerPage))
                  }, (_, i) => {
                    const totalPages = Math.ceil(totalDatasets / datasetsPerPage);
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
                  onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalDatasets / datasetsPerPage), prev + 1))}
                  disabled={currentPage === Math.ceil(totalDatasets / datasetsPerPage)}
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
        )}

        {/* Create Modal */}
        <CreateDatasetModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </div>
  );
};
