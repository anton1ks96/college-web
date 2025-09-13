import { authAPI } from '../api/client';
import type { LoginFormData, LoginResponse, User } from '../types';

class AuthService {
    async login(credentials: LoginFormData): Promise<LoginResponse> {
        const response = await authAPI.post<LoginResponse>('/api/v1/users/signin', credentials);
        return response.data;
    }

    async logout(): Promise<void> {
        await authAPI.post('/api/v1/users/signout');
    }

    async validateToken(): Promise<User> {
        const response = await authAPI.post<{ user: User }>('/api/v1/auth/validate');
        return response.data.user;
    }

    async getMe(): Promise<User> {
        return this.validateToken();
    }
}

export const authService = new AuthService();