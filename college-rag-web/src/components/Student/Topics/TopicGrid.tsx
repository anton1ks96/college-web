import type { FC } from "react";
import type { TopicWithAssignment } from "../../../types/topic.types";
import { TopicCard } from "./TopicCard";

interface TopicGridProps {
  topics: TopicWithAssignment[];
  onTopicClick: (topic: TopicWithAssignment) => void;
}

export const TopicGrid: FC<TopicGridProps> = ({ topics, onTopicClick }) => {
  if (topics.length === 0) {
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
          Нет назначенных тем
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          Вам пока не назначены темы. Обратитесь к преподавателю для получения задания.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {topics.map((assignment) => (
        <TopicCard
          key={assignment.id}
          assignment={assignment}
          onClick={() => onTopicClick(assignment)}
        />
      ))}
    </div>
  );
};