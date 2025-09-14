import type { FC } from "react";
import { useState } from "react";
import { DatasetSidebar } from "../../components/Student/DatasetSidebar";
import { ChatInterface } from "../../components/Student/ChatInterface";

export interface Dataset {
  id: string;
  title: string;
  createdAt: string;
  indexed: boolean;
  selected?: boolean;
}

export const ChatPage: FC = () => {
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);

  // Временные данные для демонстрации
  const [datasets] = useState<Dataset[]>([
    {
      id: "1",
      title: "Основы программирования",
      createdAt: "2025-01-10",
      indexed: true,
    },
    {
      id: "2",
      title: "Базы данных MySQL",
      createdAt: "2025-01-09",
      indexed: true,
    },
    {
      id: "3",
      title: "Алгоритмы и структуры данных",
      createdAt: "2025-01-08",
      indexed: false,
    },
    {
      id: "4",
      title: "Web-разработка",
      createdAt: "2025-01-07",
      indexed: true,
    },
    {
      id: "5",
      title: "Машинное обучение",
      createdAt: "2025-01-06",
      indexed: true,
    },
  ]);

  const handleDatasetSelect = (datasetId: string) => {
    setSelectedDataset((prev) => (prev === datasetId ? null : datasetId));
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar with datasets */}
      <DatasetSidebar
        datasets={datasets}
        selectedDataset={selectedDataset}
        onDatasetSelect={handleDatasetSelect}
      />

      {/* Chat Interface */}
      <ChatInterface selectedDataset={selectedDataset} datasets={datasets} />
    </div>
  );
};
