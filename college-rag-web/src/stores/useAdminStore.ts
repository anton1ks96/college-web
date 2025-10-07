import { create } from 'zustand';
import { adminService, type AdminStats } from '../services/admin.service';
import type { TeacherTopic } from '../types/teacher.types';
import type { Dataset } from '../types/dataset.types';

interface AdminState {
  // Stats
  stats: AdminStats | null;
  isLoadingStats: boolean;
  statsError: string | null;

  // Topics
  topics: TeacherTopic[];
  totalTopics: number;
  currentTopicsPage: number;
  totalTopicsPages: number;
  isLoadingTopics: boolean;
  topicsError: string | null;

  // Datasets
  datasets: Dataset[];
  totalDatasets: number;
  currentDatasetsPage: number;
  totalDatasetsPages: number;
  isLoadingDatasets: boolean;
  datasetsError: string | null;

  // Actions
  fetchStats: () => Promise<void>;
  fetchAllTopics: (page?: number, limit?: number) => Promise<void>;
  fetchAllDatasets: (page?: number, limit?: number) => Promise<void>;
  deleteTopic: (topicId: string) => Promise<void>;
  deleteDataset: (datasetId: string) => Promise<void>;
  clearTopicsError: () => void;
  clearDatasetsError: () => void;
  clearStatsError: () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  // Initial state for stats
  stats: null,
  isLoadingStats: false,
  statsError: null,

  // Initial state for topics
  topics: [],
  totalTopics: 0,
  currentTopicsPage: 1,
  totalTopicsPages: 0,
  isLoadingTopics: false,
  topicsError: null,

  // Initial state for datasets
  datasets: [],
  totalDatasets: 0,
  currentDatasetsPage: 1,
  totalDatasetsPages: 0,
  isLoadingDatasets: false,
  datasetsError: null,

  // Fetch stats
  fetchStats: async () => {
    set({ isLoadingStats: true, statsError: null });
    try {
      const stats = await adminService.getStats();
      set({ stats, isLoadingStats: false });
    } catch (error: any) {
      set({
        statsError: error.response?.data?.detail || 'Ошибка при загрузке статистики',
        isLoadingStats: false,
      });
    }
  },

  // Fetch all topics
  fetchAllTopics: async (page = 1, limit = 20) => {
    set({ isLoadingTopics: true, topicsError: null });
    try {
      const response = await adminService.getAllTopics(page, limit);
      set({
        topics: response.topics,
        totalTopics: response.total,
        currentTopicsPage: response.page,
        totalTopicsPages: response.pages,
        isLoadingTopics: false,
      });
    } catch (error: any) {
      set({
        topicsError: error.response?.data?.detail || 'Ошибка при загрузке тем',
        isLoadingTopics: false,
      });
    }
  },

  // Fetch all datasets
  fetchAllDatasets: async (page = 1, limit = 20) => {
    set({ isLoadingDatasets: true, datasetsError: null });
    try {
      const response = await adminService.getAllDatasets(page, limit);
      set({
        datasets: response.datasets,
        totalDatasets: response.total,
        currentDatasetsPage: response.page,
        totalDatasetsPages: response.pages,
        isLoadingDatasets: false,
      });
    } catch (error: any) {
      set({
        datasetsError: error.response?.data?.detail || 'Ошибка при загрузке датасетов',
        isLoadingDatasets: false,
      });
    }
  },

  // Delete topic
  deleteTopic: async (topicId: string) => {
    try {
      await adminService.deleteTopic(topicId);
      const { currentTopicsPage } = get();
      await get().fetchAllTopics(currentTopicsPage);
    } catch (error: any) {
      set({
        topicsError: error.response?.data?.detail || 'Ошибка при удалении темы',
      });
      throw error;
    }
  },

  // Delete dataset
  deleteDataset: async (datasetId: string) => {
    try {
      await adminService.deleteDataset(datasetId);
      const { currentDatasetsPage } = get();
      await get().fetchAllDatasets(currentDatasetsPage);
    } catch (error: any) {
      set({
        datasetsError: error.response?.data?.detail || 'Ошибка при удалении датасета',
      });
      throw error;
    }
  },

  // Clear errors
  clearTopicsError: () => set({ topicsError: null }),
  clearDatasetsError: () => set({ datasetsError: null }),
  clearStatsError: () => set({ statsError: null }),
}));
