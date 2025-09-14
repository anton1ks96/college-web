import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/useAuthStore';
import { ProtectedRoute } from './components/ProtectedRoute';
import { StudentLayout } from './components/Layout/StudentLayout';
import LoginPage from './pages/Login/LoginPage';
import { ChatPage } from './pages/Student/ChatPage';

function App() {
    const { checkAuth, isLoading } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Загрузка приложения...</p>
                </div>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                {/* Student routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <StudentLayout>
                                <Navigate to="/dashboard/chat" replace />
                            </StudentLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard/chat"
                    element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <StudentLayout>
                                <ChatPage />
                            </StudentLayout>
                        </ProtectedRoute>
                    }
                />

                <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;