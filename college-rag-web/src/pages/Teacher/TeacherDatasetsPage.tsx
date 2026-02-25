import type {FC} from "react";
import {useEffect, useState} from "react";
import {TeacherLayout} from "../../components/Layout/TeacherLayout";
import {BaseDatasetsPage} from "../../components/Common/BaseDatasetsPage";
import {useDatasetStore} from "../../stores/useDatasetStore";
import {formatDate} from "../../utils/dateFormat";

export const TeacherDatasetsPage: FC = () => {
  const {
    datasets,
    totalDatasets,
    isLoading,
    error,
    fetchDatasets,
    getDatasetById,
    setDatasetTag,
    removeDatasetTag,
    searchDatasetsByTag,
    tagSearchResults,
    tagSearchTotal,
    isTagSearching,
    clearTagSearch,
  } = useDatasetStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [isTagSearchActive, setIsTagSearchActive] = useState(false);
  const datasetsPerPage = 12;

  useEffect(() => {
    fetchDatasets(currentPage, datasetsPerPage);
  }, [currentPage]);

  const handleTagSearch = (tag: string) => {
    setIsTagSearchActive(true);
    searchDatasetsByTag(tag, 1, datasetsPerPage);
  };

  const handleTagSearchClear = () => {
    setIsTagSearchActive(false);
    clearTagSearch();
    fetchDatasets(currentPage, datasetsPerPage);
  };

  const displayedDatasets = isTagSearchActive ? tagSearchResults : datasets;
  const displayedTotal = isTagSearchActive ? tagSearchTotal : totalDatasets;

  return (
    <BaseDatasetsPage
      Layout={TeacherLayout}
      title="Датасеты студентов"
      subtitle="Просмотр работ студентов по вашим темам"
      datasets={displayedDatasets}
      totalDatasets={displayedTotal}
      isLoading={isLoading}
      error={error}
      fetchDatasets={fetchDatasets}
      getDatasetById={getDatasetById}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      datasetsPerPage={datasetsPerPage}
      emptyStateText="Студенты еще не создали датасеты по вашим темам"
      formatDate={formatDate}
      onTagSearch={handleTagSearch}
      onTagSearchClear={handleTagSearchClear}
      isTagSearching={isTagSearching}
      onSetTag={setDatasetTag}
      onRemoveTag={removeDatasetTag}
    />
  );
};
