export interface LoginFormData {
    username: string;
    password: string;
}

export interface User {
    id: string;
    username: string;
    role: 'student' | 'teacher' | 'admin';
}

export interface AuthTokens {
    access_token: string;
    refresh_token: string;
    expires_in: number;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user: User;
}