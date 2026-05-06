import { axiosInstance } from '../lib/axiosInstance';
import type { ApiResponse } from '../types/auth.types';

export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    subject: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export interface SendContactRequest {
    name: string;
    email: string;
    phoneNumber: string;
    subject: string;
    message: string;
}

export const contactApi = {
    // Public: Gửi tin nhắn liên hệ
    sendMessage: async (data: SendContactRequest): Promise<ApiResponse<ContactMessage>> => {
        const res = await axiosInstance.post<ApiResponse<ContactMessage>>('/Contact', data);
        return res.data;
    },

    // Admin: Lấy danh sách tin nhắn
    getAll: async (): Promise<ApiResponse<ContactMessage[]>> => {
        const res = await axiosInstance.get<ApiResponse<ContactMessage[]>>('/Contact');
        return res.data;
    },

    // Admin: Đánh dấu đã đọc
    markAsRead: async (id: string): Promise<ApiResponse<null>> => {
        const res = await axiosInstance.patch<ApiResponse<null>>(`/Contact/${id}/read`);
        return res.data;
    },

    // Admin: Xóa tin nhắn
    delete: async (id: string): Promise<ApiResponse<null>> => {
        const res = await axiosInstance.delete<ApiResponse<null>>(`/Contact/${id}`);
        return res.data;
    },
};
