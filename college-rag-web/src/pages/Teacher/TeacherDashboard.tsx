import type { FC } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TeacherLayout } from "../../components/Layout/TeacherLayout";
import { useTeacherTopicStore } from "../../stores/useTeacherTopicStore";

export const TeacherDashboard: FC = () => {
  const navigate = useNavigate();
  const { topics, fetchTopics } = useTeacherTopicStore();
  const [stats, setStats] = useState({
    topicsCount: 0,
    studentsCount: 0,
    datasetsCount: 0
  });

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    // Подсчет статистики
    if (topics && topics.length > 0) {
      const totalStudents = topics.reduce((acc, topic) => acc + (topic.student_count || 0), 0);
      setStats({
        topicsCount: topics.length,
        studentsCount: totalStudents,
        datasetsCount: 0 // Это можно будет обновить позже
      });
    }
  }, [topics]);

  return (
    <TeacherLayout>
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Панель управления
            </h1>
            <p className="mt-2 text-gray-600">
              Добро пожаловать в систему управления обучением
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Всего тем</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.topicsCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => navigate('/teacher/topics')}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Управлять темами →
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Назначено студентов</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.studentsCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Общее количество назначений
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Датасеты студентов</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.datasetsCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => navigate('/teacher/datasets')}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Просмотреть датасеты →
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Быстрые действия
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/teacher/topics')}
                className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Создать тему</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Создайте новую тему и назначьте студентов
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/teacher/chat')}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Открыть чат</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Общайтесь с AI-ассистентом
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/teacher/datasets')}
                className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v1a1 1 0 001 1h4a1 1 0 001-1v-1m3-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v7m3-2h6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Датасеты</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Просмотрите работы студентов
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Topics */}
          {topics && topics.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Последние темы
                </h2>
                <button
                  onClick={() => navigate('/teacher/topics')}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Все темы →
                </button>
              </div>
              <div className="space-y-3">
                {topics.slice(0, 3).map((topic) => (
                  <div
                    key={topic.id}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">{topic.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {topic.student_count || 0} студентов
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/teacher/topics')}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Управлять
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </TeacherLayout>
  );
};