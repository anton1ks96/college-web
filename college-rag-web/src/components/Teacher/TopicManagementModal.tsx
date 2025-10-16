import type {FC} from "react";
import {useEffect, useState} from "react";
import type {TeacherTopic} from "../../types/teacher.types";
import {teacherService} from "../../services/teacher.service";

interface TopicManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: TeacherTopic | null;
  onAddStudents: () => void;
}

interface TopicStudent {
  id: string;
  student: {
    id: string;
    username: string;
  };
  assigned_at: string;
}

export const TopicManagementModal: FC<TopicManagementModalProps> = ({
  isOpen,
  onClose,
  topic,
  onAddStudents
}) => {
  const [students, setStudents] = useState<TopicStudent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removingStudentId, setRemovingStudentId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && topic) {
      fetchTopicStudents();
    }
  }, [isOpen, topic]);

  const fetchTopicStudents = async () => {
    if (!topic) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await teacherService.getTopicStudents(topic.id);
      setStudents(response.students || []);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      setError("Не удалось загрузить список студентов");
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!topic) return;

    const confirmed = window.confirm(
      'Вы уверены, что хотите отозвать студента от темы? Датасет студента останется у него.'
    );

    if (!confirmed) return;

    setRemovingStudentId(studentId);
    setError(null);

    try {
      await teacherService.removeStudentFromTopic(topic.id, studentId);
      // Обновляем список студентов
      await fetchTopicStudents();
    } catch (err: any) {
      setError(err.response?.data?.message || "Не удалось удалить студента");
    } finally {
      setRemovingStudentId(null);
    }
  };

  if (!isOpen || !topic) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Управление темой
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {topic.title}
              </p>
            </div>
            <button
              onClick={onClose}
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
          {/* Topic Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Информация о теме</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-600">Название:</span>
                <p className="text-gray-900">{topic.title}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Описание:</span>
                <p className="text-gray-900">{topic.description || "Не указано"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Создатель:</span>
                <p className="text-gray-900">{topic.created_by}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <span className="font-medium text-gray-600">Создана:</span>
                  <p className="text-gray-900">{formatDate(topic.created_at)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Студентов назначено:</span>
                  <p className="text-gray-900">{students.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Students Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">
                Назначенные студенты
              </h3>
              <button
                onClick={onAddStudents}
                className="inline-flex items-center px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 focus:outline-none text-purple-600 bg-purple-50 border border-purple-200 hover:bg-purple-100 shadow-sm"
              >
                <svg
                  className="-ml-0.5 mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Добавить студентов
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : students.length > 0 ? (
              <div className="space-y-2">
                {students.map((student, index) => (
                  <div
                    key={student.id || index}
                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {student.student?.username || 'Имя не указано'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Назначен: {student.assigned_at ? formatDate(student.assigned_at) : 'Дата не указана'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {student.student?.id && (
                        <div className="text-xs text-gray-400">
                          ID: {student.student.id.length > 8 ? `${student.student.id.slice(0, 8)}...` : student.student.id}
                        </div>
                      )}
                      {student.student?.id && (
                        <button
                          onClick={() => handleRemoveStudent(student.student.id)}
                          disabled={removingStudentId === student.student.id}
                          className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 focus:outline-none text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Отозвать студента от темы"
                        >
                          {removingStudentId === student.student.id ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Удаление...
                            </span>
                          ) : (
                            'Отозвать'
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-600">
                  Нет назначенных студентов
                </p>
                <button
                  onClick={onAddStudents}
                  className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Добавить первых студентов
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 focus:outline-none text-gray-600 bg-white border border-gray-200 hover:text-gray-900 hover:bg-gray-50"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};