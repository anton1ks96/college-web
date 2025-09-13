import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/useAuthStore';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout/Layout';
import LoginPage from './pages/Login/LoginPage';
import { StudentDashboard } from './pages/Dashboard/StudentDashboard';
import { TeacherDashboard } from './pages/Dashboard/TeacherDashboard';
import { AdminDashboard } from './pages/Dashboard/AdminDashboard';

function App() {
    const { checkAuth, isLoading, user } = useAuthStore();

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

    const getDashboardByRole = () => {
        if (!user) return <Navigate to="/login" replace />;

        switch (user.role) {
            case 'student':
                return <StudentDashboard />;
            case 'teacher':
                return <TeacherDashboard />;
            case 'admin':
                return <AdminDashboard />;
            default:
                return <StudentDashboard />;
        }
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                {getDashboardByRole()}
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;