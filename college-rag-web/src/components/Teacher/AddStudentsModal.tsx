import type {FC} from "react";
import {useEffect, useState} from "react";
import {StudentSearch} from "./StudentSearch";
import {useTeacherTopicStore} from "../../stores/useTeacherTopicStore";
import type {TeacherTopic} from "../../types/teacher.types";

interface AddStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: TeacherTopic | null;
  onSuccess?: () => void;
}

export const AddStudentsModal: FC<AddStudentsModalProps> = ({
  isOpen,
  onClose,
  topic,
  onSuccess
}) => {
  const {
    selectedStudents,
    selectStudent,
    removeSelectedStudent,
    clearSelectedStudents,
    addStudentsToTopic,
    isLoading,
    error,
    clearError
  } = useTeacherTopicStore();

  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      clearSelectedStudents();
      setLocalError(null);
      clearError();
    }
  }, [isOpen]);

  if (!isOpen || !topic) return null;

  const handleSubmit = async () => {
    if (selectedStudents.length === 0) {
      setLocalError("Выберите хотя бы одного студента");
      return;
    }

    try {
      await addStudentsToTopic(topic.id, selectedStudents);
      clearSelectedStudents();
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      // Ошибка обрабатывается в store
    }
  };

  const handleClose = () => {
    if (
      selectedStudents.length > 0 &&
      !confirm("Вы уверены? Выбранные студенты не будут добавлены.")
    ) {
      return;
    }
    clearSelectedStudents();
    clearError();
    setLocalError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Добавление студентов
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Тема: {topic.title}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Error messages */}
          {(error || localError) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error || localError}</p>
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <div className="flex">
              <svg
                className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  Найдите и выберите студентов для добавления к теме.
                  Студенты, уже назначенные на эту тему, не будут показаны в результатах поиска.
                </p>
              </div>
            </div>
          </div>

          {/* Student Search */}
          <StudentSearch
            selectedStudents={selectedStudents}
            onStudentSelect={selectStudent}
            onRemoveStudent={removeSelectedStudent}
          />

          {/* Summary */}
          {selectedStudents.length > 0 && (
            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-purple-900">
                Будет добавлено студентов: {selectedStudents.length}
              </p>
              <p className="text-xs text-purple-700 mt-1">
                После добавления студенты получат доступ к созданию датасетов по этой теме
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center flex-shrink-0">
          <div className="text-sm text-gray-500">
            {selectedStudents.length === 0
              ? "Выберите студентов для добавления"
              : `Выбрано: ${selectedStudents.length}`
            }
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 focus:outline-none text-gray-600 bg-white border border-gray-200 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Отмена
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || selectedStudents.length === 0}
              className="px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 focus:outline-none text-purple-600 bg-purple-50 border border-purple-200 hover:bg-purple-100 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Добавление...
                </span>
              ) : (
                "Добавить студентов"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};