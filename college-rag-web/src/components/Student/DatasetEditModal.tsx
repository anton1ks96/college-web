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
    const [isReindexing, setIsReindexing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [currentDataset, setCurrentDataset] = useState<Dataset | null>(null);

    useEffect(() => {
        const loadDatasetContent = async () => {
            if (dataset && isOpen) {
                setTitle(dataset.title);
                setOriginalTitle(dataset.title);
                setError(null);
                setSuccessMessage(null);
                setIsLoading(true);
                setCurrentDataset(dataset);

                try {
                    const fullDataset = await datasetService.getDataset(dataset.id);
                    const datasetContent = fullDataset.content || "";
                    setContent(datasetContent);
                    setOriginalContent(datasetContent);
                    setCurrentDataset(fullDataset);
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

    const hasChanges = title !== originalTitle || content !== originalContent;

    const needsReindexing = currentDataset && (
        !currentDataset.indexed_at ||
        (currentDataset.indexed_at && currentDataset.updated_at &&
            new Date(currentDataset.updated_at) > new Date(currentDataset.indexed_at))
    );

    const handleSave = async () => {
        if (!dataset || !title.trim()) {
            setError("Название не может быть пустым");
            return;
        }

        if (!hasChanges) {
            setError("Нет изменений для сохранения");
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const updatedDataset = await datasetService.updateDataset(dataset.id, title, content);

            setOriginalTitle(title);
            setOriginalContent(content);

            setCurrentDataset(updatedDataset);

            setSuccessMessage("Датасет успешно сохранен. Требуется переиндексация для применения изменений в поиске.");

            onSave();
        } catch (error: any) {
            setError(error.message || "Ошибка при сохранении датасета");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveAndReindex = async () => {
        if (!dataset || !title.trim()) {
            setError("Название не может быть пустым");
            return;
        }

        setIsLoading(true);
        setIsReindexing(true);
        setError(null);
        setSuccessMessage(null);

        try {
            if (hasChanges) {
                const updatedDataset = await datasetService.updateDataset(dataset.id, title, content);
                setOriginalTitle(title);
                setOriginalContent(content);
                setCurrentDataset(updatedDataset);
            }

            await datasetService.reindexDataset(dataset.id);

            const reindexedDataset = await datasetService.getDataset(dataset.id);
            setCurrentDataset(reindexedDataset);

            setSuccessMessage("Датасет сохранен и переиндексирован");

            onSave();

            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error: any) {
            setError(error.message || "Ошибка при сохранении и переиндексации");
        } finally {
            setIsLoading(false);
            setIsReindexing(false);
        }
    };

    const handleReindex = async () => {
        if (!dataset) return;

        setIsReindexing(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await datasetService.reindexDataset(dataset.id);
            setSuccessMessage("Датасет успешно переиндексирован");

            const updatedDataset = await datasetService.getDataset(dataset.id);
            setCurrentDataset(updatedDataset);

            onSave();
        } catch (error: any) {
            setError(error.message || "Ошибка при переиндексации");
        } finally {
            setIsReindexing(false);
        }
    };

    const handleCancel = () => {
        onClose();
        setTitle(originalTitle);
        setContent(originalContent);
        setError(null);
        setSuccessMessage(null);
        setCurrentDataset(null);
    };

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return "Не индексирован";
        return new Date(dateString).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isOpen || !dataset) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 max-w-4xl shadow-lg rounded-md bg-white">
                {/* Header */}
                <div className="pb-4 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium text-gray-900">
                            Редактирование датасета
                        </h3>
                        <div className="flex items-center space-x-2">
                            {needsReindexing ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                                    {currentDataset?.indexed_at ? 'Требуется переиндексация' : 'Не индексирован'}
                </span>
                            ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Индексирован: {formatDate(currentDataset?.indexed_at)}
                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success message */}
                {successMessage && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700">{successMessage}</p>
                            </div>
                        </div>
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
                            disabled={isLoading || isReindexing}
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
                                disabled={isLoading || isReindexing}
                            />
                        )}
                        <div className="mt-1 flex justify-between items-center">
                            <p className="text-xs text-gray-500">
                                Символов: {content.length}
                            </p>
                            {hasChanges && (
                                <span className="text-xs text-amber-600 font-medium">
                  ⚠️ Есть несохраненные изменения
                </span>
                            )}
                        </div>
                    </div>

                    {/* Info box */}
                    {needsReindexing && !hasChanges ? (
                        <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-amber-800">
                                        <strong>Внимание:</strong> {currentDataset?.indexed_at
                                        ? "Датасет был изменен после последней индексации."
                                        : "Датасет еще не был индексирован."}
                                        Нажмите "Переиндексировать", чтобы содержимое стало доступно в поиске.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-blue-800">
                                        <strong>Совет:</strong> Вы можете сохранить изменения без переиндексации и выполнить индексацию позже,
                                        когда это будет удобно. Переиндексация необходима для того, чтобы изменения стали доступны в поиске.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-6">
                    <div className="flex space-x-3">
                        {needsReindexing && !hasChanges && (
                            <button
                                onClick={handleReindex}
                                disabled={isLoading || isReindexing}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
                                title="Переиндексировать датасет для обновления поиска"
                            >
                                {isReindexing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Переиндексация...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Переиндексировать
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                            disabled={isLoading || isReindexing}
                        >
                            Отмена
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={isLoading || isReindexing || !title.trim() || !hasChanges}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            title="Сохранить изменения без переиндексации"
                        >
                            {isLoading && !isReindexing ? "Сохранение..." : "Сохранить"}
                        </button>

                        <button
                            onClick={handleSaveAndReindex}
                            disabled={isLoading || isReindexing || !title.trim() || !hasChanges}
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
                            title="Сохранить изменения и переиндексировать"
                        >
                            {isReindexing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Обработка...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V2" />
                                    </svg>
                                    Сохранить и переиндексировать
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};