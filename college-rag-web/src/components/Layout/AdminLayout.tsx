import type { FC, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
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
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-44">
                            <img
                                src="/logo_light.png"
                                alt="Колледж RAG"
                                className="h-12"
                            />

                            <nav className="flex space-x-2 border border-gray-200 rounded-lg p-1 bg-white shadow-sm">
                                <button
                                    onClick={() => navigate("/admin/chat")}
                                    className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none ${
                                        isActive("/admin/chat")
                                            ? "text-purple-600 bg-purple-50 border border-purple-200"
                                            : "text-gray-600 hover:text-purple-600 hover:bg-purple-50/50 border border-transparent"
                                    }`}
                                >
                                    Чат
                                </button>
                                <button
                                    onClick={() => navigate("/admin/topics")}
                                    className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none ${
                                        isActive("/admin/topics")
                                            ? "text-purple-600 bg-purple-50 border border-purple-200"
                                            : "text-gray-600 hover:text-purple-600 hover:bg-purple-50/50 border border-transparent"
                                    }`}
                                >
                                    Темы
                                </button>
                                <button
                                    onClick={() => navigate("/admin/datasets")}
                                    className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none ${
                                        isActive("/admin/datasets")
                                            ? "text-purple-600 bg-purple-50 border border-purple-200"
                                            : "text-gray-600 hover:text-purple-600 hover:bg-purple-50/50 border border-transparent"
                                    }`}
                                >
                                    Датасеты
                                </button>
                            </nav>
                        </div>
                        <div className="flex justify-end">
                            {user && (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() =>
                                            setIsDropdownOpen(!isDropdownOpen)
                                        }
                                        className="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 my-1 border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <div className="w-10 h-10 bg-purple-50 border border-purple-200 rounded-full flex items-center justify-center shadow-sm">
                                            <svg
                                                className="w-5 h-5 text-purple-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                                />
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
                                            className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-3 w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center space-x-3 mx-2 px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-md transition-colors"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                    />
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

            <main className="flex-1 flex overflow-hidden min-h-0">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t flex-shrink-0">
                <div className="px-4 sm:px-6 lg:px-8 py-3">
                    <p className="text-center text-sm text-gray-400">
                        © 2021-2025 АНПОО "Колледж Цифровых Технологий" •
                        Авторы студенты 2 курса: Иван Коломацкий, Артем
                        Джапаридзе
                    </p>
                </div>
            </footer>
        </div>
    );
};
