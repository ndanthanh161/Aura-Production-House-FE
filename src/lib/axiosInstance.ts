import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '../types/auth.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7283/api/v1/';

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

// ─── Constants for Storage ──────────────────────────────────────

const STORAGE_KEYS = {
    ACCESS_TOKEN: 'aura_access_token',
    REFRESH_TOKEN: 'aura_refresh_token',
} as const;

// ─── Request interceptor: tự gắn Authorization header ───────────

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Helper for Refresh Token ───────────────────────────────────

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// ─── Response interceptor: normalize + Silent Refresh ────────────

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        // Normalize body về camelCase chuẩn
        response.data = normalizeApiResponse(response.data);
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi 401 và chưa được retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

            if (refreshToken) {
                try {
                    // Gọi trực tiếp axios để tránh circular dependency với authApi/axiosInstance
                    const res = await axios.post(`${API_BASE_URL}/Auth/refresh-token`, {
                        refreshToken,
                    });

                    // Server trả về ApiResponse<AuthResponse>
                    const normalized = normalizeApiResponse<any>(res.data);
                    
                    if (normalized.succeeded && normalized.data) {
                        const { accessToken, refreshToken: newRefreshToken } = normalized.data;

                        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
                        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

                        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                        processQueue(null, accessToken);
                        return axiosInstance(originalRequest);
                    }
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    // Logout và redirect nếu refresh thất bại
                    localStorage.clear();
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }
        }

        // Axios throw khi status 4xx/5xx
        const data = error.response?.data;
        const normalized = data ? normalizeApiResponse(data as Record<string, unknown>) : null;

        const message = normalized?.errors?.length
            ? normalized.errors.join(', ')
            : normalized?.message || error.message || 'An error occurred';

        return Promise.reject(new Error(message));
    }
);
