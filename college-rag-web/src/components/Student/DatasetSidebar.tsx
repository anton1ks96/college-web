import type { FC } from 'react';
import type { Dataset } from '../../pages/Student/ChatPage';

interface DatasetSidebarProps {
    datasets: Dataset[];
    selectedDataset: string | null;
    onDatasetSelect: (datasetId: string) => void;
}

export const DatasetSidebar: FC<DatasetSidebarProps> = ({
                                                            datasets,
                                                            selectedDataset,
                                                            onDatasetSelect,
                                                        }) => {
    return (
        <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Мои датасеты</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Выберите один датасет для поиска
                </p>
            </div>

            {/* Datasets list */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-2">
                    {datasets.map((dataset) => (
                        <div
                            key={dataset.id}
                            className={`p-3 rounded-lg border transition-all cursor-pointer ${
                                selectedDataset === dataset.id
                                    ? 'border-purple-300 bg-purple-50'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
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
                      {new Date(dataset.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                                        {dataset.indexed ? (
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
                    ))}
                </div>
            </div>

            {/* Footer with selected count */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-600">
                    {selectedDataset ? (
                        <span>Выбран: <span className="font-medium text-purple-600">{datasets.find(d => d.id === selectedDataset)?.title}</span></span>
                    ) : (
                        <span className="text-gray-400">Датасет не выбран</span>
                    )}
                </p>
            </div>
        </aside>
    );
};