import { create } from "zustand";
import { savedChatService } from "../services/savedChat.service";
import type {
  SavedChat,
  SavedChatListItem,
  SaveChatRequest,
} from "../types/savedChat.types";

interface SavedChatState {
  chats: SavedChatListItem[];
  totalChats: number;
  currentPage: number;

  currentChat: SavedChat | null;

  isLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;

  error: string | null;

  fetchChats: (datasetId: string, page?: number, limit?: number) => Promise<void>;
  fetchChatById: (chatId: string) => Promise<SavedChat>;
  createChat: (datasetId: string, data: SaveChatRequest) => Promise<SavedChat>;
  updateChat: (chatId: string, data: SaveChatRequest) => Promise<SavedChat>;
  deleteChat: (chatId: string) => Promise<void>;
  downloadChat: (chatId: string, filename?: string) => Promise<void>;

  setCurrentChat: (chat: SavedChat | null) => void;
  clearChats: () => void;
  clearError: () => void;
}

export const useSavedChatStore = create<SavedChatState>((set, get) => ({
  chats: [],
  totalChats: 0,
  currentPage: 1,
  currentChat: null,
  isLoading: false,
  isSaving: false,
  isDeleting: false,
  error: null,

  fetchChats: async (datasetId, page = 1, limit = 20) => {
    set({ isLoading: true, error: null, currentPage: page });
    try {
      const response = await savedChatService.getDatasetChats(datasetId, page, limit);
      set({
        chats: response.chats || [],
        totalChats: response.total || 0,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        chats: [],
        error: error.response?.data?.error || "Ошибка загрузки чатов",
        isLoading: false,
      });
    }
  },

  fetchChatById: async (chatId) => {
    set({ isLoading: true, error: null });
    try {
      const chat = await savedChatService.getChatById(chatId);
      set({ currentChat: chat, isLoading: false });
      return chat;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Ошибка загрузки чата",
        isLoading: false,
      });
      throw error;
    }
  },

  createChat: async (datasetId, data) => {
    set({ isSaving: true, error: null });
    try {
      const chat = await savedChatService.createChat(datasetId, data);
      const { currentPage } = get();
      await get().fetchChats(datasetId, currentPage);
      set({ isSaving: false });
      return chat;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Ошибка сохранения чата",
        isSaving: false,
      });
      throw error;
    }
  },

  updateChat: async (chatId, data) => {
    set({ isSaving: true, error: null });
    try {
      const chat = await savedChatService.updateChat(chatId, data);
      set({ currentChat: chat, isSaving: false });
      return chat;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Ошибка обновления чата",
        isSaving: false,
      });
      throw error;
    }
  },

  deleteChat: async (chatId) => {
    set({ isDeleting: true, error: null });
    try {
      await savedChatService.deleteChat(chatId);
      set((state) => ({
        chats: state.chats.filter((c) => c.id !== chatId),
        totalChats: state.totalChats - 1,
        currentChat: state.currentChat?.id === chatId ? null : state.currentChat,
        isDeleting: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Ошибка удаления чата",
        isDeleting: false,
      });
      throw error;
    }
  },

  downloadChat: async (chatId, filename = "chat.md") => {
    try {
      const blob = await savedChatService.downloadChat(chatId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Ошибка скачивания чата",
      });
      throw error;
    }
  },

  setCurrentChat: (chat) => set({ currentChat: chat }),
  clearChats: () => set({ chats: [], totalChats: 0, currentPage: 1, currentChat: null }),
  clearError: () => set({ error: null }),
}));
