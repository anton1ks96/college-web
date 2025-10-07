import type { FC } from "react";
import { useEffect } from "react";
import { AdminLayout } from "../../components/Layout/AdminLayout";
import { BaseTopicsPage } from "../../components/Common/BaseTopicsPage";
import { useAdminStore } from "../../stores/useAdminStore";

export const AdminTopicsPage: FC = () => {
  const {
    topics,
    isLoadingTopics: isLoading,
    topicsError: error,
    fetchAllTopics: fetchTopics,
    clearTopicsError: clearError,
    totalTopics,
    currentTopicsPage: currentPage,
    totalTopicsPages: totalPages
  } = useAdminStore();

  useEffect(() => {
    fetchTopics();
  }, []);

  return (
    <BaseTopicsPage
      Layout={AdminLayout}
      colorScheme="red"
      title="Все темы"
      subtitle="Управление всеми темами в системе"
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
