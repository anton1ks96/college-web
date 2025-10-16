import type {FC} from "react";
import {useEffect, useState} from "react";
import {AdminLayout} from "../../components/Layout/AdminLayout";
import {BaseDatasetsPage} from "../../components/Common/BaseDatasetsPage";
import {AllPermissionsModal} from "../../components/Admin/AllPermissionsModal";
import {useAdminStore} from "../../stores/useAdminStore";
import {datasetService} from "../../services/dataset.service";
import {formatDate} from "../../utils/dateFormat";

export const AdminDatasetsPage: FC = () => {
  const {
    datasets,
    totalDatasets,
    isLoadingDatasets: isLoading,
    datasetsError: error,
    fetchAllDatasets,
    currentDatasetsPage,
  } = useAdminStore();

  const [isAllPermissionsModalOpen, setIsAllPermissionsModalOpen] = useState(false);

  const datasetsPerPage = 12;

  useEffect(() => {
    fetchAllDatasets(1, datasetsPerPage);
  }, [fetchAllDatasets]);

  return (
    <>
      <BaseDatasetsPage
        Layout={AdminLayout}
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
        isAdmin={true}
        additionalHeaderActions={
          <button
            onClick={() => setIsAllPermissionsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 focus:outline-none text-purple-600 bg-purple-50 border border-purple-200 hover:bg-purple-100 shadow-sm"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            Все разрешения
          </button>
        }
      />

      <AllPermissionsModal
        isOpen={isAllPermissionsModalOpen}
        onClose={() => setIsAllPermissionsModalOpen(false)}
      />
    </>
  );
};
