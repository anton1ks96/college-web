import type { FC } from "react";
import type { TeacherTopic } from "../../types/teacher.types";

interface TeacherTopicCardProps {
  topic: TeacherTopic;
  onClick: () => void;
  onManage?: () => void;
  onAddStudents?: () => void;
}

export const TeacherTopicCard: FC<TeacherTopicCardProps> = ({
  topic,
  onClick,
  onManage,
  onAddStudents
}) => {
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
        </div>

        <p className="text-sm text-gray-600 line-clamp-3">
          {topic.description || "Описание отсутствует"}
        </p>

        <div className="flex items-center justify-end pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-400">
            {formatDate(topic.created_at)}
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onManage) onManage();
            }}
            className="flex-1 px-3 py-1.5 text-xs bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
          >
            Управление
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onAddStudents) onAddStudents();
            }}
            className="flex-1 px-3 py-1.5 text-xs bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            + Студенты
          </button>
        </div>
      </div>

      <div className="absolute inset-0 rounded-xl ring-2 ring-purple-500 ring-opacity-0 group-hover:ring-opacity-100 transition-all duration-300 pointer-events-none" />
    </div>
  );
};