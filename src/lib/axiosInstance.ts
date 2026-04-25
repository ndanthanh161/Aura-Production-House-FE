import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '../types/auth.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7283/api';

// ─── Normalize BE response: hỗ trợ cả PascalCase lẫn camelCase ─

function normalizeApiResponse<T>(raw: Record<string, unknown>): ApiResponse<T> {
    return {
        succeeded: (raw.succeeded ?? raw.Succeeded ?? raw.success ?? raw.Success ?? false) as boolean,
        message: (raw.message ?? raw.Message ?? '') as string,
        statusCode: (raw.statusCode ?? raw.StatusCode ?? 0) as number,
        data: (raw.data ?? raw.Data ?? null) as T | null,
        errors: (raw.errors ?? raw.Errors ?? []) as string[],
    };
}

// ─── Axios instance ──────────────────────────────────────────────

export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
});

// ─── Request interceptor: tự gắn Authorization header ───────────

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('aura_access_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Response interceptor: normalize + chỉ throw khi HTTP lỗi ──

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        // Normalize body về camelCase chuẩn
        response.data = normalizeApiResponse(response.data);
        return response;
    },
    (error) => {
        // Axios throw khi status 4xx/5xx
        const data = error.response?.data;
        const normalized = data ? normalizeApiResponse(data as Record<string, unknown>) : null;

        const message = normalized?.errors?.length
            ? normalized.errors.join(', ')
            : normalized?.message || error.message || 'An error occurred';

        return Promise.reject(new Error(message));
    }
);
