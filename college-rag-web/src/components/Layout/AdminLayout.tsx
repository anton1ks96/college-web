import type { FC, ReactNode } from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      <header className="bg-white shadow-sm border-b flex-shrink-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-semibold text-gray-900">
                Колледж RAG
              </h1>

              <nav className="flex space-x-3 flex-wrap gap-y-2">
                <button
                  onClick={() => navigate("/admin/chat")}
                  className={`px-3 py-2 rounded-2xl font-medium transition-all duration-200 transform hover:shadow-lg hover:-translate-y-0.5 hover:opacity-100 focus:outline-none text-center text-sm ${
                    isActive("/admin/chat")
                      ? "opacity-90"
                      : "opacity-80"
                  }`}
                  style={{
                    background: "#dc2626",
                    color: "white"
                  }}
                >
                  Чат
                </button>
                <button
                  onClick={() => navigate("/admin/topics")}
                  className={`px-3 py-2 rounded-2xl font-medium transition-all duration-200 transform hover:shadow-lg hover:-translate-y-0.5 hover:opacity-100 focus:outline-none text-center text-sm ${
                    isActive("/admin/topics")
                      ? "opacity-90"
                      : "opacity-80"
                  }`}
                  style={{
                    background: "#dc2626",
                    color: "white"
                  }}
                >
                  Темы
                </button>
                <button
                  onClick={() => navigate("/admin/datasets")}
                  className={`px-3 py-2 rounded-2xl font-medium transition-all duration-200 transform hover:shadow-lg hover:-translate-y-0.5 hover:opacity-100 focus:outline-none text-center text-sm ${
                    isActive("/admin/datasets")
                      ? "opacity-90"
                      : "opacity-80"
                  }`}
                  style={{
                    background: "#dc2626",
                    color: "white"
                  }}
                >
                  Датасеты
                </button>
                <button
                  onClick={() => navigate("/admin/datasets-table")}
                  className={`px-3 py-2 rounded-2xl font-medium transition-all duration-200 transform hover:shadow-lg hover:-translate-y-0.5 hover:opacity-100 focus:outline-none text-center text-sm ${
                    isActive("/admin/datasets-table")
                      ? "opacity-90"
                      : "opacity-80"
                  }`}
                  style={{
                    background: "#dc2626",
                    color: "white"
                  }}
                >
                  Таблица датасетов
                </button>
              </nav>
            </div>

            <div className="flex justify-end mr-4">
              {user && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 my-1 border transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>

                    <div className="flex flex-col text-left">
                      <span className="text-base font-semibold text-gray-900">
                        {user.username}
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        Администратор
                      </span>
                    </div>

                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

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

      <main className="flex-1 flex overflow-hidden min-h-0">{children}</main>
    </div>
  );
};
