import type {FC} from "react";
import {useEffect, useState} from "react";
import {adminService} from "../../services/admin.service";
import {TeacherSearch} from "./TeacherSearch";
import type {TeacherInfo, DatasetPermission} from "../../types/teacher.types";
import type {Dataset} from "../../types/dataset.types";

interface DatasetPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: Dataset | null;
}

export const DatasetPermissionsModal: FC<DatasetPermissionsModalProps> = ({
  isOpen,
  onClose,
  dataset
}) => {
  const [selectedTeachers, setSelectedTeachers] = useState<TeacherInfo[]>([]);
  const [permissions, setPermissions] = useState<DatasetPermission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGranting, setIsGranting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && dataset) {
      fetchPermissions();
    } else {
      // Reset state when modal closes
      setSelectedTeachers([]);
      setPermissions([]);
      setError(null);
      setSuccess(null);
    }
  }, [isOpen, dataset]);

  const fetchPermissions = async () => {
    if (!dataset) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await adminService.getDatasetPermissions(dataset.id);
      setPermissions(response.permissions || []);
    } catch (err: any) {
      setError("Не удалось загрузить список доступов");
      setPermissions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeacherSelect = (teacher: TeacherInfo) => {
    setSelectedTeachers([...selectedTeachers, teacher]);
  };

  const handleRemoveTeacher = (teacherId: string) => {
    setSelectedTeachers(selectedTeachers.filter(t => t.id !== teacherId));
  };

  const handleGrantAccess = async () => {
    if (!dataset || selectedTeachers.length === 0) return;

    setIsGranting(true);
    setError(null);
    setSuccess(null);

    try {
      for (const teacher of selectedTeachers) {
        await adminService.grantDatasetPermission(dataset.id, teacher.id, teacher.username);
      }

      setSuccess(`Доступ предоставлен ${selectedTeachers.length} преподавателям`);
      setSelectedTeachers([]);

      await fetchPermissions();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Не удалось предоставить доступ";
      setError(errorMessage);
    } finally {
      setIsGranting(false);
    }
  };

  const handleRevokeAccess = async (teacherId: string) => {
    if (!dataset) return;

    setError(null);
    setSuccess(null);

    try {
      await adminService.revokeDatasetPermission(dataset.id, teacherId);
      setSuccess("Доступ отозван");

      await fetchPermissions();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Не удалось отозвать доступ";
      setError(errorMessage);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  if (!isOpen || !dataset) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Управление доступом к датасету
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {dataset.title}
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
          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          {/* Add Teachers Section */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-4">
              Предоставить доступ преподавателям
            </h3>

            <TeacherSearch
              onTeacherSelect={handleTeacherSelect}
              selectedTeachers={selectedTeachers}
              onRemoveTeacher={handleRemoveTeacher}
            />

            {selectedTeachers.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={handleGrantAccess}
                  disabled={isGranting}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGranting ? 'Предоставление доступа...' : 'Предоставить доступ'}
                </button>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-4">
              Преподаватели с доступом
            </h3>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : permissions.length > 0 ? (
              <div className="space-y-2">
                {permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {permission.teacher_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Доступ предоставлен: {formatDate(permission.granted_at)} • {permission.granted_by}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRevokeAccess(permission.teacher_id)}
                      className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Отозвать
                    </button>
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
                  Нет преподавателей с доступом к этому датасету
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
