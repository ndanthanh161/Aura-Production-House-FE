import { axiosInstance } from '../lib/axiosInstance';
import type { ApiResponse } from '../types/auth.types';
import type { DocumentTemplate, CreateDocumentTemplateRequest, UpdateDocumentTemplateRequest } from '../types/documentTemplate.types';

export const documentTemplateApi = {
    getAll: async (): Promise<ApiResponse<DocumentTemplate[]>> => {
        const res = await axiosInstance.get<ApiResponse<DocumentTemplate[]>>('DocumentTemplates');
        return res.data;
    },
    getById: async (id: string): Promise<ApiResponse<DocumentTemplate>> => {
        const res = await axiosInstance.get<ApiResponse<DocumentTemplate>>(`DocumentTemplates/${id}`);
        return res.data;
    },
    create: async (data: CreateDocumentTemplateRequest): Promise<ApiResponse<DocumentTemplate>> => {
        const formData = new FormData();
        formData.append('title', data.title);
        if (data.description) {
            formData.append('description', data.description);
        }
        formData.append('file', data.file);
        formData.append('isPublished', String(data.isPublished));

        const res = await axiosInstance.post<ApiResponse<DocumentTemplate>>('DocumentTemplates', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    },
    update: async (data: UpdateDocumentTemplateRequest): Promise<ApiResponse<DocumentTemplate>> => {
        const res = await axiosInstance.put<ApiResponse<DocumentTemplate>>('DocumentTemplates', data);
        return res.data;
    },
    delete: async (id: string): Promise<ApiResponse<string>> => {
        const res = await axiosInstance.delete<ApiResponse<string>>(`DocumentTemplates/${id}`);
        return res.data;
    },
};
