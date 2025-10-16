import type {FC, ReactNode} from "react";
import {useEffect, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useAuthStore} from "../../stores/useAuthStore";

interface TeacherLayoutProps {
  children: ReactNode;
}

export const TeacherLayout: FC<TeacherLayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm border-b flex-shrink-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center space-x-44">
              <img src="/logo_light.png" alt="Колледж RAG" className="h-12" />

              {/* Navigation */}
              <nav className="flex space-x-2 border border-gray-200 rounded-lg p-1 bg-white shadow-sm">
                <button
                  onClick={() => navigate("/teacher/chat")}
                  className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none ${
                    isActive("/teacher/chat")
                      ? "text-purple-600 bg-purple-50 border border-purple-200"
                      : "text-gray-600 hover:text-purple-600 hover:bg-purple-50/50 border border-transparent"
                  }`}
                >
                  Чат
                </button>
                <button
                  onClick={() => navigate("/teacher/topics")}
                  className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none ${
                    isActive("/teacher/topics")
                      ? "text-purple-600 bg-purple-50 border border-purple-200"
                      : "text-gray-600 hover:text-purple-600 hover:bg-purple-50/50 border border-transparent"
                  }`}
                >
                  Мои темы
                </button>
                <button
                  onClick={() => navigate("/teacher/datasets")}
                  className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none ${
                    isActive("/teacher/datasets")
                      ? "text-purple-600 bg-purple-50 border border-purple-200"
                      : "text-gray-600 hover:text-purple-600 hover:bg-purple-50/50 border border-transparent"
                  }`}
                >
                  Датасеты
                </button>
              </nav>
            </div>

            {/* Right side - User Profile Dropdown */}
            <div className="flex justify-end mr-4">
              {user && (
                <div className="relative" ref={dropdownRef}>
                  {/* User Profile Button */}
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 my-1 border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {/* Avatar Icon */}
                    <div className="w-10 h-10 bg-purple-50 border border-purple-200 rounded-full flex items-center justify-center shadow-sm">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>

                    {/* User Info */}
                    <div className="flex flex-col text-left">
                      <span className="text-base font-semibold text-gray-900">
                        {user.username}
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        Преподаватель
                      </span>
                    </div>

                    {/* Dropdown Arrow */}
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 mx-2 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Выйти из системы</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden min-h-0">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t flex-shrink-0">
        <div className="px-4 sm:px-6 lg:px-8 py-2">
          <p className="text-center text-sm text-gray-400">
            © 2021-2025 АНПОО "Колледж Цифровых Технологий" • Авторы студенты 2 курса: Иван Коломацкий, Артем Джапаридзе
          </p>
        </div>
      </footer>
    </div>
  );
};