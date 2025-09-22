import type { FC, ReactNode } from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

interface StudentLayoutProps {
  children: ReactNode;
}

export const StudentLayout: FC<StudentLayoutProps> = ({ children }) => {
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
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-semibold text-gray-900">
                Колледж RAG
              </h1>

              {/* Navigation */}
              <nav className="flex space-x-4">
                <button
                  onClick={() => navigate("/dashboard/chat")}
                  className={`w-32 px-4 py-2 rounded-2xl font-medium transition-all duration-200 transform hover:shadow-lg hover:-translate-y-0.5 hover:opacity-100 focus:outline-none text-center ${
                    isActive("/dashboard/chat")
                      ? "opacity-90"
                      : "opacity-80"
                  }`}
                  style={{
                    background: "#9333ea",
                    color: "white"
                  }}
                >
                  Чат
                </button>
                <button
                  onClick={() => navigate("/dashboard/datasets")}
                  className={`w-32 px-4 py-2 rounded-2xl font-medium transition-all duration-200 transform hover:shadow-lg hover:-translate-y-0.5 hover:opacity-100 focus:outline-none text-center ${
                    isActive("/dashboard/datasets")
                      ? "opacity-90"
                      : "opacity-80"
                  }`}
                  style={{
                    background: "#9333ea",
                    color: "white"
                  }}
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
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>

                    {/* User Info */}
                    <div className="flex flex-col text-left">
                      <span className="text-base font-semibold text-gray-900">
                        {user.username}
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        Студент
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
    </div>
  );
};
