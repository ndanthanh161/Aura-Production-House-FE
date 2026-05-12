
import { axiosInstance } from '../lib/axiosInstance';
import type {
    ApiResponse,
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    MeResponse,
} from '../types/auth.types';

export const authApi = {
    login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
        const res = await axiosInstance.post<ApiResponse<AuthResponse>>('/Auth/login', data);
        return res.data;
    },

    googleLogin: async (idToken: string): Promise<ApiResponse<AuthResponse>> => {
        const res = await axiosInstance.post<ApiResponse<AuthResponse>>('/Auth/google-login', { idToken });
        return res.data;
    },

    register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
        const res = await axiosInstance.post<ApiResponse<AuthResponse>>('/Auth/register', data);
        return res.data;
    },

    refreshToken: async (refreshToken: string): Promise<ApiResponse<AuthResponse>> => {
        const res = await axiosInstance.post<ApiResponse<AuthResponse>>('/Auth/refresh-token', {
            refreshToken,
        });
        return res.data;
    },

    // Authorization header tự được gắn qua request interceptor
    logout: async (): Promise<void> => {
        await axiosInstance.post('/Auth/logout');
    },

    getMe: async (): Promise<ApiResponse<MeResponse>> => {
        const res = await axiosInstance.get<ApiResponse<MeResponse>>('/Auth/me');
        return res.data;
    },

    forgotPassword: async (email: string): Promise<ApiResponse<any>> => {
        const res = await axiosInstance.post<ApiResponse<any>>('Auth/forgot-password', { email });
        return res.data;
    },

    resetPassword: async (data: any): Promise<ApiResponse<any>> => {
        const res = await axiosInstance.post<ApiResponse<any>>('Auth/reset-password', data);
        return res.data;
    },
};

