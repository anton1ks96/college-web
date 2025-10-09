import type {FC} from "react";
import type {TeacherTopic} from "../../types/teacher.types";
import {TeacherTopicCard} from "./TeacherTopicCard";

interface TeacherTopicGridProps {
  topics: TeacherTopic[];
  onTopicClick: (topic: TeacherTopic) => void;
  onManageTopic?: (topic: TeacherTopic) => void;
  onAddStudents?: (topic: TeacherTopic) => void;
}

export const TeacherTopicGrid: FC<TeacherTopicGridProps> = ({
  topics,
  onTopicClick,
  onManageTopic,
  onAddStudents
}) => {
  if (!topics || topics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <svg
          className="w-20 h-20 text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Нет созданных тем
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          Создайте первую тему для ваших студентов, нажав на кнопку "Создать тему" выше.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {topics.map((topic) => (
        <TeacherTopicCard
          key={topic.id}
          topic={topic}
          onClick={() => onTopicClick(topic)}
          onManage={() => onManageTopic && onManageTopic(topic)}
          onAddStudents={() => onAddStudents && onAddStudents(topic)}
        />
      ))}
    </div>
  );
};