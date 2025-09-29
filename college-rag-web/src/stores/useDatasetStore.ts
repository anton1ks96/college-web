import { create } from "zustand";
import { datasetService } from "../services/dataset.service";
import type { Dataset, CreateDatasetForm } from "../types/dataset.types";

interface DatasetState {
  datasets: Dataset[];
  totalDatasets: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchDatasets: (page?: number, limit?: number) => Promise<void>;
  createDataset: (data: CreateDatasetForm) => Promise<void>;
  deleteDataset: (id: string) => Promise<void>;
  reindexDataset: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useDatasetStore = create<DatasetState>((set, get) => ({
  datasets: [],
  totalDatasets: 0,
  isLoading: false,
  error: null,

  fetchDatasets: async (page = 1, limit = 20) => {
    set({ isLoading: true, error: null });
    try {
      const response = await datasetService.getDatasets(page, limit);
      set({
        datasets: response.datasets || [],
        totalDatasets: response.total || 0,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        datasets: [],
        error: error.response?.data?.error || "Ошибка загрузки датасетов",
        isLoading: false,
      });
    }
  },

  createDataset: async (data) => {
    if (!data.content.trim()) {
      set({ error: "Содержимое не может быть пустым" });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      await datasetService.createDataset(data.title, data.content, data.assignmentId);
      await get().fetchDatasets();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Ошибка создания датасета",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteDataset: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await datasetService.deleteDataset(id);
      await get().fetchDatasets();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Ошибка удаления датасета",
        isLoading: false,
      });
    }
  },

  reindexDataset: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await datasetService.reindexDataset(id);
      await get().fetchDatasets();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Ошибка переиндексации",
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
