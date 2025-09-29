import type { FC } from "react";
import { useEffect, useState } from "react";
import { TeacherLayout } from "../../components/Layout/TeacherLayout";
import { TeacherTopicGrid } from "../../components/Teacher/TeacherTopicGrid";
import { CreateTopicModal } from "../../components/Teacher/CreateTopicModal";
import { TopicManagementModal } from "../../components/Teacher/TopicManagementModal";
import { AddStudentsModal } from "../../components/Teacher/AddStudentsModal";
import { useTeacherTopicStore } from "../../stores/useTeacherTopicStore";
import type { TeacherTopic } from "../../types/teacher.types";

export const TeacherTopicsPage: FC = () => {
  const {
    topics,
    isLoading,
    error,
    fetchTopics,
    clearError,
    totalTopics,
    currentPage,
    totalPages
  } = useTeacherTopicStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false);
  const [isAddStudentsModalOpen, setIsAddStudentsModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<TeacherTopic | null>(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleTopicClick = (topic: TeacherTopic) => {
    setSelectedTopic(topic);
    setIsManagementModalOpen(true);
  };

  const handleManageTopic = (topic: TeacherTopic) => {
    setSelectedTopic(topic);
    setIsManagementModalOpen(true);
  };

  const handleAddStudents = (topic: TeacherTopic) => {
    setSelectedTopic(topic);
    setIsAddStudentsModalOpen(true);
  };

  const handleAddStudentsFromManagement = () => {
    setIsManagementModalOpen(false);
    setIsAddStudentsModalOpen(true);
  };

  return (
    <TeacherLayout>
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-shrink-0 bg-white shadow-sm border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Мои темы</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Управление темами и назначениями студентов
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => fetchTopics(currentPage)}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className={`-ml-1 mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Обновить
                </button>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Создать тему
                </button>
              </div>
            </div>
            {totalTopics > 0 && (
              <div className="mt-2">
                <span className="text-xs text-gray-500">
                  Всего тем: {totalTopics}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-auto bg-gray-50 p-6">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
                <span>{error}</span>
                <button
                  onClick={clearError}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <TeacherTopicGrid
                topics={topics}
                onTopicClick={handleTopicClick}
                onManageTopic={handleManageTopic}
                onAddStudents={handleAddStudents}
              />
            )}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="flex justify-center items-center mt-6 space-x-2">
                <button
                  onClick={() => fetchTopics(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    if (pageNum < 1 || pageNum > totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => fetchTopics(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === pageNum
                            ? 'bg-purple-600 text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => fetchTopics(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateTopicModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <TopicManagementModal
        isOpen={isManagementModalOpen}
        onClose={() => {
          setIsManagementModalOpen(false);
          setSelectedTopic(null);
        }}
        topic={selectedTopic}
        onAddStudents={handleAddStudentsFromManagement}
      />

      <AddStudentsModal
        isOpen={isAddStudentsModalOpen}
        onClose={() => {
          setIsAddStudentsModalOpen(false);
          setSelectedTopic(null);
        }}
        topic={selectedTopic}
        onSuccess={() => {
          fetchTopics();
        }}
      />
    </TeacherLayout>
  );
};