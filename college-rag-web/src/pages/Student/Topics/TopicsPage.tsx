import type {FC} from "react";
import {useEffect, useState} from "react";
import {StudentLayout} from "../../../components/Layout/StudentLayout";
import {TopicGrid} from "../../../components/Student/Topics/TopicGrid";
import {TopicDetailModal} from "../../../components/Student/Topics/TopicDetailModal";
import {useTopicStore} from "../../../stores/useTopicStore";
import type {TopicWithAssignment} from "../../../types/topic.types";

export const TopicsPage: FC = () => {
  const { topics, isLoading, error, fetchAssignedTopics, clearError } = useTopicStore();
  const [selectedTopic, setSelectedTopic] = useState<TopicWithAssignment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAssignedTopics();
  }, []);

  const handleTopicClick = (topic: TopicWithAssignment) => {
    setSelectedTopic(topic);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTopic(null);
  };

  return (
    <StudentLayout>
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-shrink-0 bg-white shadow-sm border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Мои темы</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Темы, назначенные вам преподавателем для работы
                </p>
              </div>
              <button
                onClick={fetchAssignedTopics}
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
            </div>
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
              <TopicGrid topics={topics} onTopicClick={handleTopicClick} />
            )}
          </div>
        </div>
      </div>

      <TopicDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        assignment={selectedTopic}
      />
    </StudentLayout>
  );
};