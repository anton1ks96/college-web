import type { FC } from "react";
import type { TopicWithAssignment } from "../../../types/topic.types";
import { useNavigate } from "react-router-dom";

interface TopicDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: TopicWithAssignment | null;
}

export const TopicDetailModal: FC<TopicDetailModalProps> = ({
  isOpen,
  onClose,
  assignment,
}) => {
  const navigate = useNavigate();

  if (!isOpen || !assignment) return null;

  const { topic } = assignment;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  const handleCreateDataset = () => {
    navigate("/dashboard/datasets", {
      state: {
        assignmentId: assignment.assignment_id,
        topicTitle: topic.title
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                <h3 className="text-2xl font-bold leading-6 text-gray-900 mb-4">
                  {topic.title}
                </h3>

                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Описание</h4>
                    <p className="text-base text-gray-700 whitespace-pre-wrap">
                      {topic.description || "Описание не предоставлено"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Преподаватель</h4>
                      <p className="text-base text-gray-700">{topic.created_by}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Дата назначения</h4>
                      <p className="text-base text-gray-700">{formatDate(assignment.assigned_at)}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-purple-900 mb-2">Действия</h4>
                      <p className="text-sm text-purple-700 mb-3">
                        Вы можете создать датасет для этой темы, перейдя в раздел "Датасеты"
                      </p>
                      <button
                        onClick={handleCreateDataset}
                        className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                      >
                        Создать датасет для темы
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">
                        ID задания: <span className="font-mono text-gray-700">{assignment.assignment_id}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};