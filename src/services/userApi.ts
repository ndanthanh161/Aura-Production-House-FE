import { axiosInstance } from '../lib/axiosInstance';
import type { ApiResponse } from '../types/auth.types';
import type { UserDTO, UpdateUserRequest } from '../types/user.types';

// ─── Photographer API ─────────────────────────────────────────────

export const photographerApi = {
    getAll: async (): Promise<ApiResponse<UserDTO[]>> => {
        const res = await axiosInstance.get<ApiResponse<UserDTO[]>>('/v1/Photographer');
        return res.data;
    },
    create: async (data: any): Promise<ApiResponse<UserDTO>> => {
        const res = await axiosInstance.post<ApiResponse<UserDTO>>('/v1/Photographer', data);
        return res.data;
    },
    getById: async (id: string): Promise<ApiResponse<UserDTO>> => {
        const res = await axiosInstance.get<ApiResponse<UserDTO>>(`/v1/Photographer/${id}`);
        return res.data;
    },
    update: async (data: UpdateUserRequest): Promise<ApiResponse<UserDTO>> => {
        const res = await axiosInstance.put<ApiResponse<UserDTO>>('/v1/Photographer', data);
        return res.data;
    },
    assignToProject: async (photographerId: string, projectId: string): Promise<ApiResponse<string>> => {
        const res = await axiosInstance.patch<ApiResponse<string>>(
            `/v1/Photographer/${photographerId}/assign/${projectId}`
        );
        return res.data;
    },
    deactivate: async (id: string): Promise<ApiResponse<string>> => {
        const res = await axiosInstance.patch<ApiResponse<string>>(`/v1/Photographer/${id}/deactivate`);
        return res.data;
    },
};

// ─── Customer API ─────────────────────────────────────────────────

export const customerApi = {
    getAll: async (): Promise<ApiResponse<UserDTO[]>> => {
        const res = await axiosInstance.get<ApiResponse<UserDTO[]>>('/v1/Customer');
        return res.data;
    },
    getById: async (id: string): Promise<ApiResponse<UserDTO>> => {
        const res = await axiosInstance.get<ApiResponse<UserDTO>>(`/v1/Customer/${id}`);
        return res.data;
    },
    update: async (data: UpdateUserRequest): Promise<ApiResponse<UserDTO>> => {
        const res = await axiosInstance.put<ApiResponse<UserDTO>>('/v1/Customer', data);
        return res.data;
    },
};
