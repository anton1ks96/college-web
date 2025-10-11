import {create} from 'zustand';
import type {StudentInfo, TeacherTopic} from '../types/teacher.types';
import {teacherService} from '../services/teacher.service';

interface TeacherTopicStore {
  topics: TeacherTopic[];
  selectedTopic: TeacherTopic | null;
  searchedStudents: StudentInfo[];
  selectedStudents: StudentInfo[];
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  totalTopics: number;
  currentPage: number;
  totalPages: number;

  // Actions
  fetchTopics: (page?: number) => Promise<void>;
  createTopic: (title: string, description: string, students: StudentInfo[]) => Promise<void>;
  searchStudents: (query: string) => Promise<void>;
  addStudentsToTopic: (topicId: string, students: StudentInfo[]) => Promise<void>;
  selectTopic: (topic: TeacherTopic | null) => void;
  selectStudent: (student: StudentInfo) => void;
  removeSelectedStudent: (studentId: string) => void;
  clearSelectedStudents: () => void;
  clearSearchedStudents: () => void;
  clearError: () => void;
}

export const useTeacherTopicStore = create<TeacherTopicStore>((set, get) => ({
  topics: [],
  selectedTopic: null,
  searchedStudents: [],
  selectedStudents: [],
  isLoading: false,
  isSearching: false,
  error: null,
  totalTopics: 0,
  currentPage: 1,
  totalPages: 1,

  fetchTopics: async (page = 1) => {
    set({ isLoading: true, error: null, currentPage: page });
    try {
      const response = await teacherService.getMyTopics(page, 20);
      const totalPages = Math.ceil((response.total || 0) / 20);
      set({
        topics: response.topics || [],
        totalTopics: response.total || 0,
        totalPages: totalPages,
        isLoading: false
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Не удалось загрузить темы';
      set({ error: errorMessage, isLoading: false, topics: [] });
    }
  },

  createTopic: async (title, description, students) => {
    set({ isLoading: true, error: null });
    try {
      await teacherService.createTopic({
        title,
        description,
        students
      });
      await get().fetchTopics(1); // Обновляем список после создания
      set({ selectedStudents: [], isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Не удалось создать тему';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  searchStudents: async (query) => {
    if (query.trim().length < 2) {
      set({ searchedStudents: [] });
      return;
    }

    set({ isSearching: true });
    try {
      const response = await teacherService.searchStudents(query);
      set({
        searchedStudents: response.students,
        isSearching: false
      });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      set({
        searchedStudents: [],
        isSearching: false,
        error: 'Ошибка поиска студентов'
      });
    }
  },

  addStudentsToTopic: async (topicId, students) => {
    set({ isLoading: true, error: null });
    try {
      await teacherService.addStudentsToTopic(topicId, { students });
      await get().fetchTopics(get().currentPage);
      set({ selectedStudents: [], isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Не удалось добавить студентов';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  selectTopic: (topic) => {
    set({ selectedTopic: topic });
  },

  selectStudent: (student) => {
    const { selectedStudents } = get();
    const isAlreadySelected = selectedStudents.some(s => s.id === student.id);
    if (!isAlreadySelected) {
      set({ selectedStudents: [...selectedStudents, student] });
    }
  },

  removeSelectedStudent: (studentId) => {
    set((state) => ({
      selectedStudents: state.selectedStudents.filter(s => s.id !== studentId)
    }));
  },

  clearSelectedStudents: () => {
    set({ selectedStudents: [] });
  },

  clearSearchedStudents: () => {
    set({ searchedStudents: [] });
  },

  clearError: () => {
    set({ error: null });
  }
}));