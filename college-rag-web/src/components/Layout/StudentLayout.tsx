import type { FC, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

interface StudentLayoutProps {
  children: ReactNode;
}

export const StudentLayout: FC<StudentLayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-semibold text-gray-900">
                Колледж RAG
              </h1>

              {/* Navigation */}
              <nav className="flex space-x-4">
                <button
                  onClick={() => navigate("/dashboard/chat")}
                  className={`w-32 px-4 py-2 rounded-2xl font-medium text-white transition-all duration-200 transform hover:shadow-lg hover:-translate-y-0.5 hover:opacity-100 focus:outline-none text-center ${
                    isActive("/dashboard/chat")
                      ? "opacity-90"
                      : "opacity-80"
                  }`}
                  style={{
                    background: "linear-gradient(to right, #9B8BDC 20%, #9605CA 100%)"
                  }}
                >
                  Чат
                </button>
                <button
                  onClick={() => navigate("/dashboard/datasets")}
                  className={`w-32 px-4 py-2 rounded-2xl font-medium text-white transition-all duration-200 transform hover:shadow-lg hover:-translate-y-0.5 hover:opacity-100 focus:outline-none text-center ${
                    isActive("/dashboard/datasets")
                      ? "opacity-90"
                      : "opacity-80"
                  }`}
                  style={{
                    background: "linear-gradient(to right, #9B8BDC 20%, #9605CA 100%)"
                  }}
                >
                  Датасеты
                </button>
              </nav>
            </div>

            {/* Right side - User info and Logout */}
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-700">
                      {user.username}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Студент
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                  >
                    Выйти
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">{children}</main>
    </div>
  );
};
