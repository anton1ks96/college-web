import type {FC, ReactNode} from "react";
import {useState} from "react";
import {type ColorScheme, Pagination} from "./Pagination";
import {LoadingSpinner} from "./LoadingSpinner";
import {ErrorAlert} from "./ErrorAlert";
import {TeacherTopicGrid} from "../Teacher/TeacherTopicGrid";
import {CreateTopicModal} from "../Teacher/CreateTopicModal";
import {TopicManagementModal} from "../Teacher/TopicManagementModal";
import {AddStudentsModal} from "../Teacher/AddStudentsModal";
import type {TeacherTopic} from "../../types/teacher.types";

interface BaseTopicsPageProps {
  Layout: FC<{ children: ReactNode }>;
  colorScheme: ColorScheme;
  title: string;
  subtitle: string;
  topics: TeacherTopic[];
  isLoading: boolean;
  error: string | null;
  fetchTopics: (page?: number) => void;
  clearError: () => void;
  totalTopics: number;
  currentPage: number;
  totalPages: number;
}

export const BaseTopicsPage: FC<BaseTopicsPageProps> = ({
  Layout,
  colorScheme,
  title,
  subtitle,
  topics,
  isLoading,
  error,
  fetchTopics,
  clearError,
  totalTopics,
  currentPage,
  totalPages,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false);
  const [isAddStudentsModalOpen, setIsAddStudentsModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<TeacherTopic | null>(null);

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

  const ringColorClasses: Record<ColorScheme, string> = {
    purple: 'focus:ring-purple-500',
    red: 'focus:ring-red-500',
    blue: 'focus:ring-blue-500',
    green: 'focus:ring-green-500',
    yellow: 'focus:ring-yellow-500',
  };

  return (
    <Layout>
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-shrink-0 bg-white shadow-sm border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => fetchTopics(currentPage)}
                  disabled={isLoading}
                  className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 ${ringColorClasses[colorScheme]} disabled:opacity-50 disabled:cursor-not-allowed`}
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
                  className="inline-flex items-center px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 focus:outline-none text-purple-600 bg-purple-50 border border-purple-200 hover:bg-purple-100 shadow-sm"
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
            <div className="mt-3 flex items-center justify-between">
              {totalTopics > 0 && (
                <span className="text-xs text-gray-500">Всего тем: {totalTopics}</span>
              )}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={fetchTopics}
                colorScheme={colorScheme}
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto bg-gray-50 p-6">
            <ErrorAlert error={error} onClose={clearError} />

            {isLoading ? (
              <LoadingSpinner colorScheme={colorScheme} />
            ) : (
              <TeacherTopicGrid
                topics={topics}
                onTopicClick={handleTopicClick}
                onManageTopic={handleManageTopic}
                onAddStudents={handleAddStudents}
              />
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
    </Layout>
  );
};
