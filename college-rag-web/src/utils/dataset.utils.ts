export const needsReindexing = (updatedAt: string, indexedAt: string | null | undefined): boolean => {
    if (!indexedAt) return true;

    const updated = new Date(updatedAt).getTime();
    const indexed = new Date(indexedAt).getTime();

    return updated > indexed;
};

export const getDatasetStatus = (dataset: { updated_at: string; indexed_at?: string | null }) => {
    if (!dataset.indexed_at) {
        return {
            status: 'not_indexed',
            text: 'Не индексирован',
            color: 'yellow',
            icon: '⏳'
        };
    }

    if (needsReindexing(dataset.updated_at, dataset.indexed_at)) {
        return {
            status: 'needs_reindex',
            text: 'Требуется переиндексация',
            color: 'orange',
            icon: '⚠️'
        };
    }

    return {
        status: 'indexed',
        text: 'Индексирован',
        color: 'green',
        icon: '✓'
    };
};