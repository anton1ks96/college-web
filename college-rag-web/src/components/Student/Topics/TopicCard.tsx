import type {FC} from "react";
import type {TopicWithAssignment} from "../../../types/topic.types";

interface TopicCardProps {
  assignment: TopicWithAssignment;
  onClick: () => void;
}

export const TopicCard: FC<TopicCardProps> = ({ assignment, onClick }) => {
  const { topic } = assignment;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-gray-200 hover:border-purple-300"
    >
      <div className="flex flex-col space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
            {topic.title}
          </h3>
          <div className="flex-shrink-0 ml-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Назначена
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-3">
          {topic.description || "Описание отсутствует"}
        </p>

        <div className="flex flex-col space-y-2 text-xs text-gray-500">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Преподаватель: {topic.created_by}</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Назначена: {formatDate(assignment.assigned_at)}</span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 rounded-xl ring-2 ring-purple-500 ring-opacity-0 group-hover:ring-opacity-100 transition-all duration-300 pointer-events-none" />
    </div>
  );
};