import {create} from "zustand";
import {datasetService} from "../services/dataset.service";
import type {CreateDatasetForm, Dataset} from "../types/dataset.types";

interface DatasetState {
  datasets: Dataset[];
  totalDatasets: number;
  isLoading: boolean;
  error: string | null;

  tagSearchResults: Dataset[];
  tagSearchTotal: number;
  isTagSearching: boolean;

  fetchDatasets: (page?: number, limit?: number) => Promise<void>;
  getDatasetById: (id: string) => Promise<Dataset>;
  createDataset: (data: CreateDatasetForm) => Promise<void>;
  deleteDataset: (id: string) => Promise<void>;
  reindexDataset: (id: string) => Promise<void>;
  setDatasetTag: (id: string, tag: string) => Promise<void>;
  removeDatasetTag: (id: string) => Promise<void>;
  searchDatasetsByTag: (tag: string, page?: number, limit?: number) => Promise<void>;
  clearTagSearch: () => void;
  clearError: () => void;
}

export const useDatasetStore = create<DatasetState>((set, get) => ({
  datasets: [],
  totalDatasets: 0,
  isLoading: false,
  error: null,

  tagSearchResults: [],
  tagSearchTotal: 0,
  isTagSearching: false,

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

  getDatasetById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const dataset = await datasetService.getDataset(id);
      set({ isLoading: false });
      return dataset;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Ошибка загрузки датасета",
        isLoading: false,
      });
      throw error;
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

  setDatasetTag: async (id: string, tag: string) => {
    set({ error: null });
    try {
      await datasetService.setTag(id, tag);
      const lowered = tag.toLowerCase();
      const datasets = get().datasets.map(d =>
        d.id === id ? { ...d, tag: lowered } : d
      );
      const tagSearchResults = get().tagSearchResults.map(d =>
        d.id === id ? { ...d, tag: lowered } : d
      );
      set({ datasets, tagSearchResults });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Ошибка установки тега",
      });
    }
  },

  removeDatasetTag: async (id: string) => {
    set({ error: null });
    try {
      await datasetService.removeTag(id);
      const datasets = get().datasets.map(d =>
        d.id === id ? { ...d, tag: null } : d
      );
      const tagSearchResults = get().tagSearchResults.filter(d => d.id !== id);
      set({ datasets, tagSearchResults, tagSearchTotal: tagSearchResults.length });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Ошибка удаления тега",
      });
    }
  },

  searchDatasetsByTag: async (tag: string, page = 1, limit = 20) => {
    set({ isTagSearching: true, error: null });
    try {
      const response = await datasetService.searchByTag(tag, page, limit);
      set({
        tagSearchResults: response.datasets || [],
        tagSearchTotal: response.total || 0,
        isTagSearching: false,
      });
    } catch (error: any) {
      set({
        tagSearchResults: [],
        error: error.response?.data?.error || "Ошибка поиска по тегу",
        isTagSearching: false,
      });
    }
  },

  clearTagSearch: () => set({ tagSearchResults: [], tagSearchTotal: 0 }),

  clearError: () => set({ error: null }),
}));
