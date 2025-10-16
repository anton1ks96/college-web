import type {FC} from "react";
import type {TeacherTopic} from "../../types/teacher.types";

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

        <div className="flex flex-col space-y-2 text-xs text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Создатель: {topic.created_by}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="font-medium text-gray-700">
                {topic.student_count ?? topic.students?.length ?? 0} студентов
              </span>
            </div>
            <div className="text-gray-400">
              {formatDate(topic.created_at)}
            </div>
          </div>
        </div>

        <div className="flex">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onManage) onManage();
            }}
            className="w-full px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 focus:outline-none text-purple-600 bg-purple-50 border border-purple-200 hover:bg-purple-100 shadow-sm"
          >
            Управление
          </button>
        </div>
      </div>

      <div className="absolute inset-0 rounded-xl ring-2 ring-purple-500 ring-opacity-0 group-hover:ring-opacity-100 transition-all duration-300 pointer-events-none" />
    </div>
  );
};