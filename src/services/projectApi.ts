import { axiosInstance } from '../lib/axiosInstance';
import type { ApiResponse } from '../types/auth.types';
import type { Project, CreateProjectRequest, UpdateProjectRequest } from '../types/project.types';
import type { ProjectStatus } from '../types/project.types';

export const projectApi = {
    getAll: async (): Promise<ApiResponse<Project[]>> => {
        const res = await axiosInstance.get<ApiResponse<Project[]>>('Project');
        return res.data;
    },
    getById: async (id: string): Promise<ApiResponse<Project>> => {
        const res = await axiosInstance.get<ApiResponse<Project>>(`Project/${id}`);
        return res.data;
    },
    create: async (data: CreateProjectRequest): Promise<ApiResponse<Project>> => {
        const res = await axiosInstance.post<ApiResponse<Project>>('Project', data);
        return res.data;
    },
    update: async (data: UpdateProjectRequest): Promise<ApiResponse<Project>> => {
        const res = await axiosInstance.put<ApiResponse<Project>>('Project', data);
        return res.data;
    },
    updateStatus: async (id: string, status: ProjectStatus): Promise<ApiResponse<string>> => {
        const res = await axiosInstance.patch<ApiResponse<string>>(`Project/${id}/status?status=${status}`);
        return res.data;
    },
    assignPhotographer: async (projectId: string, photographerId: string): Promise<ApiResponse<string>> => {
        const res = await axiosInstance.patch<ApiResponse<string>>(
            `Project/${projectId}/assign-photographer?photographerId=${photographerId}`
        );
        return res.data;
    },
    getSchedules: async (params?: import('../types/project.types').GetSchedulesParams): Promise<ApiResponse<Project[]>> => {
        const query = new URLSearchParams();
        if (params?.from) query.append('from', params.from);
        if (params?.to) query.append('to', params.to);
        if (params?.staffId) query.append('staffId', params.staffId);
        const res = await axiosInstance.get<ApiResponse<Project[]>>(
            `Project/schedules?${query.toString()}`
        );
        return res.data;
    },
    checkSlot: async (date: string, maxSlots = 3): Promise<ApiResponse<import('../types/project.types').SlotAvailability>> => {
        const res = await axiosInstance.get<ApiResponse<import('../types/project.types').SlotAvailability>>(
            `Project/slots?date=${date}&maxSlots=${maxSlots}`
        );
        return res.data;
    },
    reschedule: async (request: import('../types/project.types').RescheduleRequest): Promise<ApiResponse<Project>> => {
        const res = await axiosInstance.patch<ApiResponse<Project>>('Project/reschedule', request);
        return res.data;
    },
    cancel: async (id: string): Promise<ApiResponse<string>> => {
        const res = await axiosInstance.delete<ApiResponse<string>>(`Project/${id}`);
        return res.data;
    },
};
