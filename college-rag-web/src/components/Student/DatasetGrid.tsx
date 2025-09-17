import type { FC } from "react";
import { useState } from "react";
import type { Dataset } from "../../types/dataset.types";
import { DatasetEditModal } from "./DatasetEditModal";

interface DatasetGridProps {
  datasets: Dataset[];
  onDatasetUpdated?: () => void;
}

export const DatasetGrid: FC<DatasetGridProps> = ({ datasets, onDatasetUpdated }) => {
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleOpenDataset = (dataset: Dataset) => {
    setSelectedDataset(dataset);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedDataset(null);
  };

  const handleDatasetSaved = () => {
    setIsEditModalOpen(false);
    setSelectedDataset(null);
    if (onDatasetUpdated) {
      onDatasetUpdated();
    }
  };
  if (!datasets || !Array.isArray(datasets)) {
    return null;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {datasets.map((dataset) => (
        <div
          key={dataset.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {dataset.title}
              </h3>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
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
                  {new Date(dataset.created_at).toLocaleDateString("ru-RU")}
                </span>
              </div>
            </div>

            {/* Status badge */}
            <div className="flex items-center justify-between">
              {dataset.indexed_at ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓ Индексирован
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  ⏳ Ожидает индексации
                </span>
              )}

              <button
                onClick={() => handleOpenDataset(dataset)}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                Открыть
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      <DatasetEditModal
        dataset={selectedDataset}
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        onSave={handleDatasetSaved}
      />
    </div>
  );
};
