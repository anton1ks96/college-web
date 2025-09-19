import type { FC } from "react";
import { useState, useEffect } from "react";
import { DatasetSidebar } from "../../components/Student/DatasetSidebar";
import { ChatInterface } from "../../components/Student/ChatInterface";
import { datasetService } from "../../services/dataset.service";
import type { Dataset } from "../../types/dataset.types";

// Интерфейс Dataset перенесен в src/types/dataset.ts

export const ChatPage: FC = () => {
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDatasets = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await datasetService.getDatasets();
        setDatasets(response.datasets);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Ошибка при загрузке датасетов";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadDatasets();
  }, []);

  const handleDatasetSelect = (datasetId: string) => {
    setSelectedDataset((prev) => (prev === datasetId ? null : datasetId));
  };


  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {/* Sidebar with datasets */}
      <DatasetSidebar
        datasets={datasets}
        selectedDataset={selectedDataset}
        onDatasetSelect={handleDatasetSelect}
        isLoading={isLoading}
        error={error}
      />

      {/* Chat Interface */}
      <ChatInterface selectedDataset={selectedDataset} datasets={datasets} />
    </div>
  );
};
