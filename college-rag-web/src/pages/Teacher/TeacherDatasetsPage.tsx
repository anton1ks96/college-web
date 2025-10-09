import type {FC} from "react";
import {useEffect, useState} from "react";
import {TeacherLayout} from "../../components/Layout/TeacherLayout";
import {BaseDatasetsPage} from "../../components/Common/BaseDatasetsPage";
import {useDatasetStore} from "../../stores/useDatasetStore";
import {formatDate} from "../../utils/dateFormat";

export const TeacherDatasetsPage: FC = () => {
  const { datasets, totalDatasets, isLoading, error, fetchDatasets, getDatasetById } = useDatasetStore();
  const [currentPage, setCurrentPage] = useState(1);
  const datasetsPerPage = 12;

  useEffect(() => {
    fetchDatasets(currentPage, datasetsPerPage);
  }, [currentPage]);

  return (
    <BaseDatasetsPage
      Layout={TeacherLayout}
      title="Датасеты студентов"
      subtitle="Просмотр работ студентов по вашим темам"
      datasets={datasets}
      totalDatasets={totalDatasets}
      isLoading={isLoading}
      error={error}
      fetchDatasets={fetchDatasets}
      getDatasetById={getDatasetById}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      datasetsPerPage={datasetsPerPage}
      emptyStateText="Студенты еще не создали датасеты по вашим темам"
      formatDate={formatDate}
    />
  );
};