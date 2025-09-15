import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import type { LoginFormData } from "../../types";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, isLoading, error, clearError, isAuthenticated } =
        useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        return () => clearError();
    }, [clearError]);

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login(data);
            navigate("/dashboard");
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            // Ошибка уже обработана в store
        }
    };

    return (
        <div className="h-screen flex flex-col" style={{ backgroundColor: '#FDFDFD' }}>
            <div className="flex-1 flex min-h-0">
                {/* Левая часть - место под картинку */}
                <div className="hidden md:flex md:w-1/2 p-1">
                    <div className="w-full h-full rounded-3xl shadow-2xl border-2 border-white/50 overflow-hidden">
                        <img
                            src="/pandaBackground.png"
                            alt="Изображение для входа"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Правая часть - форма входа */}
                <div className="w-full md:w-1/2 flex flex-col p-1">
                    <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col justify-center min-h-0">
                        <div className="px-6 py-6 sm:px-8">
                            <div className="text-left mb-8">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                                    Войдите в аккаунт
                                </h1>
                                <p className="text-base sm:text-lg text-gray-600 max-w-xl">
                                    Введите логин и пароль для доступа к образовательным сервисам и
                                    персональному кабинету.
                                </p>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div>
                                    <label
                                        htmlFor="username"
                                        className="block text-xm font-medium text-gray-700 mb-2"
                                    >
                                        Логин
                                    </label>
                                    <input
                                        id="username"
                                        type="text"
                                        className={`w-full px-8 py-3 border rounded-lg placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                      transition-all duration-200
                      ${errors.username ? "border-red-500 bg-red-50" : "border-gray-300 bg-purple-50/30"}`}
                                        {...register("username", {
                                            required: "Введите логин",
                                        })}
                                        disabled={isLoading}
                                    />
                                    {errors.username && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.username.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-xm font-medium text-gray-700 mb-2"
                                    >
                                        Пароль
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        className={`w-full px-8 py-3 border rounded-lg placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                      transition-all duration-200
                      ${errors.password ? "border-red-500 bg-red-50" : "border-gray-300 bg-purple-50/30"}`}
                                        {...register("password", {
                                            required: "Введите пароль",
                                            minLength: {
                                                value: 6,
                                                message: "Пароль должен содержать минимум 6 символов",
                                            },
                                        })}
                                        disabled={isLoading}
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full text-xl py-4 px-6 rounded-lg font-medium text-white
                    transition-all duration-200 transform
                    ${
                                        isLoading
                                            ? "bg-purple-400 cursor-not-allowed"
                                            : "hover:shadow-lg hover:-translate-y-0.5"
                                    }
                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
                                    style={{
                                        background: isLoading
                                            ? undefined
                                            : "linear-gradient(to right, #9B8BDC 20%, #9605CA 100%)"
                                    }}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                      <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                      >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Выполняется вход...
                    </span>
                                    ) : (
                                        "Войти"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Футер прижат к низу с отступом как у фотографии */}
                    <footer className="text-center">
                        <p className="text-sm" style={{ color: "rgba(0, 0, 0, 0.6)" }}>
                            © 2025 Колледж Цифровых Технологий
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;