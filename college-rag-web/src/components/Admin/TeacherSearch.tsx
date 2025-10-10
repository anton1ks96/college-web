import type {FC} from "react";
import {useEffect, useState} from "react";
import {adminService} from "../../services/admin.service";
import type {TeacherInfo} from "../../types/teacher.types";

interface TeacherSearchProps {
  onTeacherSelect?: (teacher: TeacherInfo) => void;
  selectedTeachers: TeacherInfo[];
  onRemoveTeacher?: (teacherId: string) => void;
}

export const TeacherSearch: FC<TeacherSearchProps> = ({
  onTeacherSelect,
  selectedTeachers,
  onRemoveTeacher
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedTeachers, setSearchedTeachers] = useState<TeacherInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const trimmedQuery = searchQuery.trim();

      if (trimmedQuery) {
        if (trimmedQuery.length < 2) {
          setSearchedTeachers([]);
          return;
        }
        searchTeachers(trimmedQuery);
      } else {
        setSearchedTeachers([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const searchTeachers = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await adminService.searchTeachers(query);
      setSearchedTeachers(response.teachers || []);
    } catch (error) {
      console.error("Error searching teachers:", error);
      setSearchedTeachers([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectTeacher = (teacher: TeacherInfo) => {
    if (onTeacherSelect) {
      onTeacherSelect(teacher);
    }
    setSearchQuery("");
    setSearchedTeachers([]);
  };

  const isTeacherSelected = (teacherId: string) => {
    return selectedTeachers.some(t => t.id === teacherId);
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Поиск преподавателей
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Введите имя преподавателя..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {isSearching && (
            <div className="absolute right-3 top-3">
              <svg className="animate-spin h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && searchedTeachers.length > 0 && (
        <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
          {searchedTeachers.map((teacher) => (
            <button
              key={teacher.id}
              onClick={() => handleSelectTeacher(teacher)}
              disabled={isTeacherSelected(teacher.id)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center justify-between ${
                isTeacherSelected(teacher.id) ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''
              }`}
            >
              <span className="text-sm">{teacher.username}</span>
              {isTeacherSelected(teacher.id) && (
                <span className="text-xs text-gray-500">Уже выбран</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {searchQuery && !isSearching && searchedTeachers.length === 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          Преподаватели не найдены
        </div>
      )}

      {/* Selected Teachers */}
      {selectedTeachers.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Выбранные преподаватели ({selectedTeachers.length})
          </h4>
          <div className="space-y-2">
            {selectedTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="flex items-center justify-between bg-purple-50 px-3 py-2 rounded-lg"
              >
                <span className="text-sm text-purple-900">{teacher.username}</span>
                {onRemoveTeacher && (
                  <button
                    onClick={() => onRemoveTeacher(teacher.id)}
                    className="text-purple-600 hover:text-purple-800 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
