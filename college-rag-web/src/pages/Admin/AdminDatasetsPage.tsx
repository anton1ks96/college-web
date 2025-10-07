import type { FC } from "react";
import { useEffect } from "react";
import { AdminLayout } from "../../components/Layout/AdminLayout";
import { BaseDatasetsPage } from "../../components/Common/BaseDatasetsPage";
import { useAdminStore } from "../../stores/useAdminStore";
import { datasetService } from "../../services/dataset.service";
import { formatDate } from "../../utils/dateFormat";

export const AdminDatasetsPage: FC = () => {
  const {
    datasets,
    totalDatasets,
    isLoadingDatasets: isLoading,
    datasetsError: error,
    fetchAllDatasets,
    currentDatasetsPage,
  } = useAdminStore();

  const datasetsPerPage = 12;

  useEffect(() => {
    fetchAllDatasets(1, datasetsPerPage);
  }, []);

  return (
    <BaseDatasetsPage
      Layout={AdminLayout}
      colorScheme="red"
      title="Все датасеты"
      subtitle="Просмотр всех датасетов в системе"
      datasets={datasets}
      totalDatasets={totalDatasets}
      isLoading={isLoading}
      error={error}
      fetchDatasets={fetchAllDatasets}
      getDatasetById={datasetService.getDataset}
      currentPage={currentDatasetsPage}
      setCurrentPage={(page) => fetchAllDatasets(page, datasetsPerPage)}
      datasetsPerPage={datasetsPerPage}
      emptyStateText="В системе пока нет датасетов"
      formatDate={formatDate}
    />
  );
};
