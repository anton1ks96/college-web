import type { FC } from "react";
import { useEffect } from "react";
import { TeacherLayout } from "../../components/Layout/TeacherLayout";
import { BaseTopicsPage } from "../../components/Common/BaseTopicsPage";
import { useTeacherTopicStore } from "../../stores/useTeacherTopicStore";

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

  useEffect(() => {
    fetchTopics();
  }, []);

  return (
    <BaseTopicsPage
      Layout={TeacherLayout}
      colorScheme="purple"
      title="Мои темы"
      subtitle="Управление темами и назначениями студентов"
      topics={topics}
      isLoading={isLoading}
      error={error}
      fetchTopics={fetchTopics}
      clearError={clearError}
      totalTopics={totalTopics}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
};