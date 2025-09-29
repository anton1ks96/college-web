import {useEffect} from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {useAuthStore} from "./stores/useAuthStore";
import {ProtectedRoute} from "./components/ProtectedRoute";
import {StudentLayout} from "./components/Layout/StudentLayout";
import {TeacherLayout} from "./components/Layout/TeacherLayout";
import LoginPage from "./pages/Login/LoginPage";
import {ChatPage} from "./pages/Student/ChatPage";
import {DatasetsPage} from "./pages/Student/DatasetsPage.tsx";
import {TopicsPage} from "./pages/Student/Topics/TopicsPage";
import {TeacherTopicsPage} from "./pages/Teacher/TeacherTopicsPage";
import {TeacherDatasetsPage} from "./pages/Teacher/TeacherDatasetsPage";

// Component to redirect based on user role
function RoleBasedRedirect() {
    const {user} = useAuthStore();

    if (user?.role === 'teacher') {
        return <Navigate to="/teacher/topics" replace/>;
    }
    return <Navigate to="/dashboard" replace/>;
}

function App() {
    const {checkAuth, isLoading} = useAuthStore();

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
                <Route path="/login" element={<LoginPage/>}/>

                {/* Student routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <StudentLayout>
                                <Navigate to="/dashboard/chat" replace/>
                            </StudentLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard/chat"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <StudentLayout>
                                <ChatPage/>
                            </StudentLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard/topics"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <TopicsPage/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard/datasets"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <StudentLayout>
                                <DatasetsPage/>
                            </StudentLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Teacher routes */}
                <Route
                    path="/teacher"
                    element={
                        <ProtectedRoute allowedRoles={["teacher"]}>
                            <Navigate to="/teacher/topics" replace/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/teacher/chat"
                    element={
                        <ProtectedRoute allowedRoles={["teacher"]}>
                            <TeacherLayout>
                                <ChatPage/>
                            </TeacherLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/teacher/topics"
                    element={
                        <ProtectedRoute allowedRoles={["teacher"]}>
                            <TeacherTopicsPage/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/teacher/datasets"
                    element={
                        <ProtectedRoute allowedRoles={["teacher"]}>
                            <TeacherDatasetsPage/>
                        </ProtectedRoute>
                    }
                />

                {/* Root redirect based on role */}
                <Route path="/" element={
                    <ProtectedRoute allowedRoles={["student", "teacher"]}>
                        <RoleBasedRedirect/>
                    </ProtectedRoute>
                }/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
