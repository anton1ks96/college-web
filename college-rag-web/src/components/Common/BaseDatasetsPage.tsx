import type {FC, ReactNode} from "react";
import {useState} from "react";
import {Pagination} from "./Pagination";
import {LoadingSpinner} from "./LoadingSpinner";
import {ErrorAlert} from "./ErrorAlert";
import {EmptyState} from "./EmptyState";
import {DatasetModal} from "./DatasetModal";
import {DatasetPermissionsModal} from "../Admin/DatasetPermissionsModal";
import type {Dataset} from "../../types/dataset.types";

interface BaseDatasetsPageProps {
  Layout: FC<{ children: ReactNode }>;
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
  isAdmin?: boolean;
  additionalHeaderActions?: ReactNode;
}

type ViewMode = 'cards' | 'table';

export const BaseDatasetsPage: FC<BaseDatasetsPageProps> = ({
  Layout,
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
  isAdmin = false,
  additionalHeaderActions,
}) => {
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [isLoadingDataset, setIsLoadingDataset] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [datasetForPermissions, setDatasetForPermissions] = useState<Dataset | null>(null);

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

  const handleManagePermissions = (dataset: Dataset) => {
    setDatasetForPermissions(dataset);
    setIsPermissionsModalOpen(true);
  };

  const totalPages = Math.ceil(totalDatasets / datasetsPerPage);

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
              <div className="flex items-center space-x-3">
                {/* View Mode Toggle */}
                <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'cards'
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      <span>Карточки</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'table'
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Таблица</span>
                    </div>
                  </button>
                </div>

                {/* Additional Header Actions */}
                {additionalHeaderActions}

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
              <LoadingSpinner />
            ) : datasets && datasets.length > 0 ? (
              <>
                {/* Cards View */}
                {viewMode === 'cards' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {datasets.map((dataset) => (
                      <div
                        key={dataset.id}
                        className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-purple-300"
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
                          <div className="mt-auto space-y-2">
                            <button
                              onClick={() => handleViewDataset(dataset)}
                              className="w-full px-3 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition-colors text-sm font-medium"
                            >
                              Просмотреть
                            </button>
                            {isAdmin && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleManagePermissions(dataset);
                                }}
                                className="w-full px-3 py-2 bg-white text-purple-600 border border-purple-600 hover:bg-purple-50 rounded-lg transition-colors text-sm font-medium"
                              >
                                Управление доступом
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Table View */}
                {viewMode === 'table' && (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Название
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Автор
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Создан
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Обновлен
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Индексирован
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {datasets.map((dataset) => (
                          <tr key={dataset.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900 max-w-md truncate">
                                {dataset.title}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{dataset.author || 'Неизвестно'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(dataset.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(dataset.updated_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {dataset.indexed_at ? formatDate(dataset.indexed_at) : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
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
        />
      )}

      {/* Dataset Permissions Modal */}
      {isAdmin && (
        <DatasetPermissionsModal
          isOpen={isPermissionsModalOpen}
          onClose={() => {
            setIsPermissionsModalOpen(false);
            setDatasetForPermissions(null);
          }}
          dataset={datasetForPermissions}
        />
      )}
    </Layout>
  );
};
