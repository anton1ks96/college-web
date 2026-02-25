import type {FC} from "react";
import {useEffect, useState} from "react";
import {AdminLayout} from "../../components/Layout/AdminLayout";
import {useAdminStore} from "../../stores/useAdminStore";
import {datasetService} from "../../services/dataset.service";
import {TagBadge} from "../../components/Common/TagBadge";
import {TagEditor} from "../../components/Common/TagEditor";
import {TagSearchBar} from "../../components/Common/TagSearchBar";
import type {Dataset} from "../../types/dataset.types";

export const AdminDatasetsTablePage: FC = () => {
  const {
    datasets,
    totalDatasets,
    currentDatasetsPage,
    totalDatasetsPages,
    isLoadingDatasets,
    datasetsError,
    fetchAllDatasets,
    clearDatasetsError,
  } = useAdminStore();

  const [editingTagDatasetId, setEditingTagDatasetId] = useState<string | null>(null);
  const [isTagSearchActive, setIsTagSearchActive] = useState(false);
  const [tagResults, setTagResults] = useState<Dataset[]>([]);
  const [tagTotal, setTagTotal] = useState(0);
  const [isTagSearching, setIsTagSearching] = useState(false);

  useEffect(() => {
    fetchAllDatasets();
  }, []);

  const handlePageChange = (page: number) => {
    fetchAllDatasets(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSetTag = async (datasetId: string, tag: string) => {
    await datasetService.setTag(datasetId, tag);
    const lowered = tag.toLowerCase();
    setEditingTagDatasetId(null);
    setTagResults(prev => prev.map(d => d.id === datasetId ? { ...d, tag: lowered } : d));
    fetchAllDatasets(currentDatasetsPage);
  };

  const handleRemoveTag = async (datasetId: string) => {
    await datasetService.removeTag(datasetId);
    setTagResults(prev => prev.filter(d => d.id !== datasetId));
    setTagTotal(prev => Math.max(0, prev - 1));
    fetchAllDatasets(currentDatasetsPage);
  };

  const handleTagSearch = async (tag: string) => {
    setIsTagSearching(true);
    setIsTagSearchActive(true);
    try {
      const response = await datasetService.searchByTag(tag, 1, 20);
      setTagResults(response.datasets || []);
      setTagTotal(response.total || 0);
    } finally {
      setIsTagSearching(false);
    }
  };

  const handleTagSearchClear = () => {
    setIsTagSearchActive(false);
    setTagResults([]);
    setTagTotal(0);
    fetchAllDatasets(currentDatasetsPage);
  };

  const displayedDatasets = isTagSearchActive ? tagResults : datasets;
  const displayedTotal = isTagSearchActive ? tagTotal : totalDatasets;

  return (
    <AdminLayout>
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0 bg-white shadow-sm border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Все датасеты (Таблица)</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Полный список всех датасетов в системе с возможностью управления
                </p>
              </div>
              <button
                onClick={() => fetchAllDatasets(currentDatasetsPage)}
                disabled={isLoadingDatasets}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className={`-ml-1 mr-2 h-4 w-4 ${isLoadingDatasets ? 'animate-spin' : ''}`}
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
            <div className="flex items-center justify-between mt-2">
              {displayedTotal > 0 && (
                <span className="text-xs text-gray-500">
                  Всего датасетов: {displayedTotal}
                </span>
              )}
              <div className="ml-auto">
                <TagSearchBar
                  onSearch={handleTagSearch}
                  onClear={handleTagSearchClear}
                  isSearching={isTagSearching}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto bg-gray-50 p-6">
            {datasetsError && (
              <div className="mb-4 bg-purple-50 border border-purple-200 text-purple-700 px-4 py-3 rounded-lg flex items-center justify-between">
                <span>{datasetsError}</span>
                <button
                  onClick={clearDatasetsError}
                  className="text-purple-500 hover:text-purple-700 focus:outline-none"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {isLoadingDatasets ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : displayedDatasets.length > 0 ? (
              <>
                {/* Table */}
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
                          Тег
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
                      {displayedDatasets.map((dataset) => (
                        <tr key={dataset.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 max-w-md truncate">
                              {dataset.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{dataset.author || 'Неизвестно'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingTagDatasetId === dataset.id ? (
                              <TagEditor
                                initialValue={dataset.tag || ""}
                                onSave={(tag) => handleSetTag(dataset.id, tag)}
                                onCancel={() => setEditingTagDatasetId(null)}
                              />
                            ) : (
                              <TagBadge
                                tag={dataset.tag}
                                editable
                                onEdit={() => setEditingTagDatasetId(dataset.id)}
                                onRemove={() => handleRemoveTag(dataset.id)}
                              />
                            )}
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

                {/* Pagination */}
                {!isTagSearchActive && totalDatasetsPages > 1 && (
                  <div className="flex justify-center items-center mt-6 space-x-2">
                    <button
                      onClick={() => handlePageChange(currentDatasetsPage - 1)}
                      disabled={currentDatasetsPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, totalDatasetsPages) }, (_, i) => {
                        let pageNum;
                        if (totalDatasetsPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentDatasetsPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentDatasetsPage >= totalDatasetsPages - 2) {
                          pageNum = totalDatasetsPages - 4 + i;
                        } else {
                          pageNum = currentDatasetsPage - 2 + i;
                        }

                        if (pageNum < 1 || pageNum > totalDatasetsPages) return null;

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                              currentDatasetsPage === pageNum
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
                      onClick={() => handlePageChange(currentDatasetsPage + 1)}
                      disabled={currentDatasetsPage === totalDatasetsPages}
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Нет датасетов</h3>
                <p className="text-gray-500 text-center max-w-md">
                  В системе пока нет созданных датасетов
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
