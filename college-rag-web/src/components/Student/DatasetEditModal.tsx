import type {FC} from "react";
import {useEffect, useState} from "react";
import type {Dataset} from "../../types/dataset.types";
import {datasetService} from "../../services/dataset.service";
import {
  createEmptyChunk,
  parseContentToChunks,
  serializeChunks,
  type Chunk,
} from "../../utils/datasetChunks";

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
    const [chunks, setChunks] = useState<Chunk[]>([createEmptyChunk()]);
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
                    const parsedChunks = parseContentToChunks(fullDataset.content || "");
                    const datasetContent = serializeChunks(parsedChunks);
                    setChunks(parsedChunks);
                    setOriginalContent(datasetContent.trim());
                    setCurrentDataset(fullDataset);
                } catch (error: any) {
                    setError("Ошибка при загрузке содержимого датасета");
                    const fallbackChunks = parseContentToChunks(dataset.content || "");
                    setChunks(fallbackChunks);
                    setOriginalContent(serializeChunks(fallbackChunks).trim());
                } finally {
                    setIsLoading(false);
                }
            }
        };

        loadDatasetContent();
    }, [dataset, isOpen]);

    const compiledContent = serializeChunks(chunks).trim();
    const hasChanges = title !== originalTitle || compiledContent !== originalContent;

    const handleChunkChange = (chunkId: string, field: "title" | "body", value: string) => {
        setChunks((prev) => prev.map((chunk) => (chunk.id === chunkId ? {...chunk, [field]: value} : chunk)));
    };

    const handleAddChunk = (index: number) => {
        setChunks((prev) => {
            const next = [...prev];
            next.splice(index + 1, 0, createEmptyChunk());
            return next;
        });
    };

    const handleRemoveChunk = (chunkId: string) => {
        setChunks((prev) => {
            if (prev.length === 1) {
                return [createEmptyChunk()];
            }
            return prev.filter((chunk) => chunk.id !== chunkId);
        });
    };

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

        if (!compiledContent) {
            setError("Введите содержимое датасета");
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
            const updatedDataset = await datasetService.updateDataset(dataset.id, title, compiledContent);

            setOriginalTitle(title);
            setOriginalContent(compiledContent);

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

        if (!compiledContent) {
            setError("Введите содержимое датасета");
            return;
        }

        setIsLoading(true);
        setIsReindexing(true);
        setError(null);
        setSuccessMessage(null);

        try {
            if (hasChanges) {
                const updatedDataset = await datasetService.updateDataset(dataset.id, title, compiledContent);
                setOriginalTitle(title);
                setOriginalContent(compiledContent);
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
        setChunks(parseContentToChunks(originalContent));
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
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Структура датасета
                                </label>
                            </div>
                            <div className="text-xs text-gray-500">
                                Символов: {compiledContent.length}
                            </div>
                        </div>

                        {isLoading && !compiledContent ? (
                            <div className="w-full h-96 border border-gray-200 rounded-3xl flex items-center justify-center bg-gray-50">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                                    <p className="text-sm text-gray-500">Загрузка содержимого...</p>
                                </div>
                            </div>
                        ) : (
                            <div className="max-h-[26rem] overflow-y-auto pr-2">
                                <div className="flex flex-col space-y-8">
                                    {chunks.map((chunk, index) => {
                                        const order = index + 1;
                                        const canRemove = chunks.length > 1;
                                        const disabled = isLoading || isReindexing;

                                        return (
                                            <div
                                                key={chunk.id}
                                                className="w-full rounded-3xl border border-gray-200/80 bg-white/80 backdrop-blur-sm shadow-sm transition hover:shadow-md"
                                            >
                                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
                                                    <div>
                                                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
                                                            Чанк {order.toString().padStart(2, "0")}
                                                        </p>
                                                        <p className="text-sm text-gray-400">
                                                            {chunk.title ? chunk.title : "Добавьте название блока"}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleAddChunk(index)}
                                                            disabled={disabled}
                                                            className="inline-flex h-9 items-center rounded-full border border-gray-200 bg-white px-4 text-xs font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 disabled:opacity-40"
                                                        >
                                                            <span className="mr-2 text-lg leading-none">+</span>
                                                            Добавить чанк
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveChunk(chunk.id)}
                                                            disabled={disabled || !canRemove}
                                                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:text-red-500 hover:border-red-200 disabled:opacity-40"
                                                            title={canRemove ? "Удалить этот блок" : "Нельзя удалить единственный блок"}
                                                        >
                                                            <svg
                                                                className="h-4 w-4"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="1.8"
                                                                    d="M6 7h12M9 7V5h6v2m-7 3v8m4-8v8m4-8v8M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="grid gap-5 px-5 py-5">
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-700">
                                                            Заголовок чанка
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={chunk.title}
                                                            onChange={(e) => handleChunkChange(chunk.id, "title", e.target.value)}
                                                            disabled={disabled}
                                                            placeholder="Например: Введение"
                                                            className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                        />
                                                    </div>

                                                    <div>
                                                        <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                                                            <span>Контент</span>
                                                        </div>
                                                        <textarea
                                                            value={chunk.body}
                                                            onChange={(e) => handleChunkChange(chunk.id, "body", e.target.value)}
                                                            disabled={disabled}
                                                            placeholder="Добавьте содержимое чанка..."
                                                            className="mt-2 w-full min-h-[160px] resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {hasChanges && (
                            <div className="mt-2 text-xs text-amber-600 font-medium">
                                ⚠️ Есть несохраненные изменения
                            </div>
                        )}
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
                                className="px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 focus:outline-none text-purple-600 bg-purple-50 border border-purple-200 hover:bg-purple-100 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
                            className="px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 focus:outline-none text-gray-600 bg-white border border-gray-200 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading || isReindexing}
                        >
                            Отмена
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={isLoading || isReindexing || !title.trim() || !compiledContent || !hasChanges}
                            className="px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 focus:outline-none text-gray-600 bg-white border border-gray-200 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Сохранить изменения без переиндексации"
                        >
                            {isLoading && !isReindexing ? "Сохранение..." : "Сохранить"}
                        </button>

                        <button
                            onClick={handleSaveAndReindex}
                            disabled={isLoading || isReindexing || !title.trim() || !compiledContent}
                            className="px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 focus:outline-none text-purple-600 bg-purple-50 border border-purple-200 hover:bg-purple-100 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
