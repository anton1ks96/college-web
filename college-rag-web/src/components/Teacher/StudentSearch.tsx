import type {FC} from "react";
import {useEffect, useState} from "react";
import {useTeacherTopicStore} from "../../stores/useTeacherTopicStore";
import type {StudentInfo} from "../../types/teacher.types";

interface StudentSearchProps {
  onStudentSelect?: (student: StudentInfo) => void;
  selectedStudents: StudentInfo[];
  onRemoveStudent?: (studentId: string) => void;
}

export const StudentSearch: FC<StudentSearchProps> = ({
  onStudentSelect,
  selectedStudents,
  onRemoveStudent
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { searchedStudents, isSearching, searchStudents, clearSearchedStudents } = useTeacherTopicStore();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const trimmedQuery = searchQuery.trim();

      if (trimmedQuery) {
        if (trimmedQuery.toLowerCase().startsWith('i') && trimmedQuery.length < 8) {
          clearSearchedStudents();
          return;
        }
        searchStudents(searchQuery);
      } else {
        clearSearchedStudents();
      }
    }, 900);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSelectStudent = (student: StudentInfo) => {
    if (onStudentSelect) {
      onStudentSelect(student);
    }
    setSearchQuery("");
    clearSearchedStudents();
  };

  const isStudentSelected = (studentId: string) => {
    return selectedStudents.some(s => s.id === studentId);
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Поиск студентов
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Введите имя студента..."
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
      {searchQuery && searchedStudents && searchedStudents.length > 0 && (
        <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
          {searchedStudents.map((student) => (
            <button
              key={student.id}
              onClick={() => handleSelectStudent(student)}
              disabled={isStudentSelected(student.id)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center justify-between ${
                isStudentSelected(student.id) ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''
              }`}
            >
              <span className="text-sm">{student.username}</span>
              {isStudentSelected(student.id) && (
                <span className="text-xs text-gray-500">Уже выбран</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {searchQuery && !isSearching && searchedStudents && searchedStudents.length === 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          Студенты не найдены
        </div>
      )}

      {/* Selected Students */}
      {selectedStudents.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Выбранные студенты ({selectedStudents.length})
          </h4>
          <div className="space-y-2">
            {selectedStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between bg-purple-50 px-3 py-2 rounded-lg"
              >
                <span className="text-sm text-purple-900">{student.username}</span>
                {onRemoveStudent && (
                  <button
                    onClick={() => onRemoveStudent(student.id)}
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