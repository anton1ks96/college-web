import type {FC} from "react";
import {useEffect, useState} from "react";
import {DatasetSidebar} from "../../components/Student/DatasetSidebar";
import {ChatInterface} from "../../components/Student/ChatInterface";
import {datasetService} from "../../services/dataset.service";
import type {Dataset} from "../../types/dataset.types";

// Интерфейс Dataset перенесен в src/types/dataset.ts

export const ChatPage: FC = () => {
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="flex flex-1 h-full overflow-hidden relative">
      {/* Desktop sidebar - always visible */}
      <div className="hidden md:block">
        <DatasetSidebar
          datasets={datasets}
          selectedDataset={selectedDataset}
          onDatasetSelect={handleDatasetSelect}
          isLoading={isLoading}
          error={error}
        />
      </div>

      {/* Mobile sidebar overlay with animation */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setIsSidebarOpen(false)}
        />
        <div
          className={`absolute inset-y-0 left-0 w-80 max-w-[85vw] z-50 shadow-xl transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <DatasetSidebar
            datasets={datasets}
            selectedDataset={selectedDataset}
            onDatasetSelect={(id) => {
              handleDatasetSelect(id);
              setIsSidebarOpen(false);
            }}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>

      {/* Chat Interface */}
      <ChatInterface
        selectedDataset={selectedDataset}
        datasets={datasets}
        onToggleSidebar={() => setIsSidebarOpen(true)}
      />
    </div>
  );
};
