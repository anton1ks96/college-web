import type { FC } from "react";
import { useState } from "react";
import { DatasetGrid } from "../../components/Student/DatasetGrid";

export const DatasetsPage: FC = () => {
  // Временные данные
  const [datasets] = useState([
    {
      id: "1",
      title: "Основы программирования",
      content:
        "Базовые концепции программирования, переменные, циклы, функции...",
      createdAt: "2025-01-10",
      indexed: true,
    },
    {
      id: "2",
      title: "Базы данных MySQL",
      content: "Реляционные базы данных, SQL запросы, нормализация...",
      createdAt: "2025-01-09",
      indexed: true,
    },
    {
      id: "3",
      title: "Алгоритмы и структуры данных",
      content: "Сортировка, поиск, деревья, графы, хэш-таблицы...",
      createdAt: "2025-01-08",
      indexed: false,
    },
    {
      id: "4",
      title: "Web-разработка",
      content: "HTML, CSS, JavaScript, React, REST API...",
      createdAt: "2025-01-07",
      indexed: true,
    },
    {
      id: "5",
      title: "Машинное обучение",
      content: "Supervised learning, unsupervised learning, нейронные сети...",
      createdAt: "2025-01-06",
      indexed: true,
    },
  ]);

  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Мои датасеты</h1>
          <p className="mt-1 text-sm text-gray-500">
            Управляйте вашими учебными материалами
          </p>
        </div>

        {/* Actions bar */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              + Создать датасет
            </button>
          </div>
          <div className="text-sm text-gray-600">
            Всего датасетов:{" "}
            <span className="font-medium">{datasets.length}</span>
          </div>
        </div>
        {/* Datasets grid */}
        <DatasetGrid datasets={datasets} />
      </div>
    </div>
  );
};
