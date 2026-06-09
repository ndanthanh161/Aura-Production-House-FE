import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '../types/auth.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7283/api/v1/';

function normalizeApiResponse<T>(raw: Record<string, unknown>): ApiResponse<T> {
    return {
        succeeded: (raw.succeeded ?? raw.Succeeded ?? raw.success ?? raw.Success ?? false) as boolean,
        message: (raw.message ?? raw.Message ?? '') as string,
        statusCode: (raw.statusCode ?? raw.StatusCode ?? 0) as number,
        data: (raw.data ?? raw.Data ?? null) as T | null,
        errors: (raw.errors ?? raw.Errors ?? []) as string[],
    };
}

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
    accessToken = token;
}

export function getAccessToken() {
    return accessToken;
}

export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string | null) => void;
    reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

function clearLegacyAuthStorage() {
    localStorage.removeItem('aura_access_token');
    localStorage.removeItem('aura_refresh_token');
    localStorage.removeItem('aura_user');
    localStorage.removeItem('aura_role');
}

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        response.data = normalizeApiResponse(response.data);
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        const requestUrl = originalRequest?.url ?? '';
        const isAuthRequest =
            requestUrl.includes('Auth/refresh-token') ||
            requestUrl.includes('Auth/login') ||
            requestUrl.includes('Auth/google-login');

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthRequest) {
            if (isRefreshing) {
                return new Promise<string | null>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const res = await axios.post(`${API_BASE_URL}/Auth/refresh-token`, {}, {
                    withCredentials: true,
                });
                const normalized = normalizeApiResponse<any>(res.data);

                if (normalized.succeeded && normalized.data) {
                    const { accessToken: newAccessToken } = normalized.data;
                    setAccessToken(newAccessToken);
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    processQueue(null, newAccessToken);
                    return axiosInstance(originalRequest);
                }

                throw new Error(normalized.message || 'Unable to refresh session');
            } catch (refreshError) {
                processQueue(refreshError, null);
                setAccessToken(null);
                clearLegacyAuthStorage();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        const data = error.response?.data;
        const normalized = data ? normalizeApiResponse(data as Record<string, unknown>) : null;

        const message = normalized?.errors?.length
            ? normalized.errors.join(', ')
            : normalized?.message || error.message || 'An error occurred';

        return Promise.reject(new Error(message));
    }
);
