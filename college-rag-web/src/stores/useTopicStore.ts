import {create} from 'zustand';
import type {TopicWithAssignment} from '../types/topic.types';
import {topicService} from '../services/topic.service';

interface TopicStore {
  topics: TopicWithAssignment[];
  selectedTopic: TopicWithAssignment | null;
  isLoading: boolean;
  error: string | null;

  fetchAssignedTopics: () => Promise<void>;
  selectTopic: (topic: TopicWithAssignment | null) => void;
  clearError: () => void;
}

export const useTopicStore = create<TopicStore>((set) => ({
  topics: [],
  selectedTopic: null,
  isLoading: false,
  error: null,

  fetchAssignedTopics: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await topicService.getAssignedTopics();
      set({ topics: response.assignments, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Не удалось загрузить темы';
      set({ error: errorMessage, isLoading: false });
    }
  },

  selectTopic: (topic) => {
    set({ selectedTopic: topic });
  },

  clearError: () => {
    set({ error: null });
  },
}));