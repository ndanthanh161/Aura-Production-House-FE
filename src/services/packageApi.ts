import { axiosInstance } from '../lib/axiosInstance';
import type { ApiResponse } from '../types/auth.types';
import type { Package, CreatePackageRequest, UpdatePackageRequest } from '../types/package.types';

export const packageApi = {
    getAll: async (all = true): Promise<ApiResponse<Package[]>> => {
        const res = await axiosInstance.get<ApiResponse<Package[]>>(`/v1/Package?all=${all}`);
        return res.data;
    },
    getById: async (id: string): Promise<ApiResponse<Package>> => {
        const res = await axiosInstance.get<ApiResponse<Package>>(`/v1/Package/${id}`);
        return res.data;
    },
    create: async (data: CreatePackageRequest): Promise<ApiResponse<Package>> => {
        const res = await axiosInstance.post<ApiResponse<Package>>('/v1/Package', data);
        return res.data;
    },
    update: async (data: UpdatePackageRequest): Promise<ApiResponse<Package>> => {
        const res = await axiosInstance.put<ApiResponse<Package>>('/v1/Package', data);
        return res.data;
    },
    delete: async (id: string): Promise<ApiResponse<string>> => {
        const res = await axiosInstance.delete<ApiResponse<string>>(`/v1/Package/${id}`);
        return res.data;
    },
};
