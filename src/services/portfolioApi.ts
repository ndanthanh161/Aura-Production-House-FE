import { axiosInstance } from '../lib/axiosInstance';
import type { ApiResponse } from '../types/auth.types';

// ─── Types ───────────────────────────────────────────────

export interface PortfolioMedia {
    id: string;
    url: string;
    publicId: string;
    mediaType: 'image' | 'video';
    displayOrder: number;
}

export interface PortfolioItem {
    id: string;
    title: string;
    category: number | string; // BE có thể trả về số hoặc string tùy cấu hình
    thumbnailUrl: string | null;
    content: string | null;
    clientName: string | null;
    projectId: string | null;
    isPublished: boolean;
    displayOrder: number;
    createdAt: string;
    updatedAt: string;
    mediaItems: PortfolioMedia[];
}

export interface CreatePortfolioRequest {
    title: string;
    category: number;
    content?: string;
    clientName?: string;
    projectId?: string;
    displayOrder: number;
    thumbnailUrl?: string;
}

export interface UpdatePortfolioRequest extends CreatePortfolioRequest {
    id: string;
}

// ─── Category Helpers ────────────────────────────────────

export const PORTFOLIO_CATEGORIES = [
    { value: 0, label: 'Nhiếp Ảnh',           enumName: 'Photography' },
    { value: 1, label: 'Quay Phim',            enumName: 'Videography' },
    { value: 2, label: 'Thương Hiệu Cá Nhân', enumName: 'PersonalBranding' },
    { value: 3, label: 'Thương Mại',           enumName: 'Commercial' },
    { value: 4, label: 'Nội Dung MXH',         enumName: 'SocialContent' },
] as const;

// Hỗ trợ cả số (0) lẫn string ("Photography") từ BE
export const getCategoryLabel = (value: number | string): string => {
    // Tìm theo số
    const byNumber = PORTFOLIO_CATEGORIES.find(c => c.value === Number(value));
    if (byNumber) return byNumber.label;
    // Tìm theo tên enum string
    const byName = PORTFOLIO_CATEGORIES.find(c => c.enumName === value);
    if (byName) return byName.label;
    return 'Khác';
};

// Helper: chuyển số (0) hoặc string ("Photography") sang string enum mà BE chấp nhận
const toCategoryEnumName = (value: number | string): string => {
    if (typeof value === 'string' && isNaN(Number(value))) {
        // Đã là string enum name rồi (vd: "Photography")
        return value;
    }
    // Là số, tìm trong PORTFOLIO_CATEGORIES
    return PORTFOLIO_CATEGORIES.find(c => c.value === Number(value))?.enumName ?? 'Photography';
};

export const portfolioApi = {
    // Public
    getPublished: async (): Promise<ApiResponse<PortfolioItem[]>> => {
        const res = await axiosInstance.get<ApiResponse<PortfolioItem[]>>('/Portfolio/published');
        return res.data;
    },

    getById: async (id: string): Promise<ApiResponse<PortfolioItem>> => {
        const res = await axiosInstance.get<ApiResponse<PortfolioItem>>(`/Portfolio/${id}`);
        return res.data;
    },

    // Admin
    getAll: async (): Promise<ApiResponse<PortfolioItem[]>> => {
        const res = await axiosInstance.get<ApiResponse<PortfolioItem[]>>('/Portfolio');
        return res.data;
    },

    create: async (data: CreatePortfolioRequest): Promise<ApiResponse<PortfolioItem>> => {
        const res = await axiosInstance.post<ApiResponse<PortfolioItem>>('/Portfolio', {
            ...data,
            category: toCategoryEnumName(data.category),
        });
        return res.data;
    },

    update: async (data: UpdatePortfolioRequest): Promise<ApiResponse<PortfolioItem>> => {
        const res = await axiosInstance.put<ApiResponse<PortfolioItem>>('/Portfolio', {
            ...data,
            category: toCategoryEnumName(data.category),
        });
        return res.data;
    },

    togglePublish: async (id: string): Promise<ApiResponse<null>> => {
        const res = await axiosInstance.patch<ApiResponse<null>>(`/Portfolio/${id}/toggle-publish`);
        return res.data;
    },

    setThumbnail: async (id: string, thumbnailUrl: string): Promise<ApiResponse<PortfolioItem>> => {
        const item = await portfolioApi.getById(id);
        if (!item.data) throw new Error('Không tìm thấy portfolio');
        const res = await axiosInstance.put<ApiResponse<PortfolioItem>>('/Portfolio', {
            id,
            title: item.data.title,
            category: toCategoryEnumName(item.data.category), // Đảm bảo luôn gửi string
            content: item.data.content,
            clientName: item.data.clientName,
            displayOrder: item.data.displayOrder,
            thumbnailUrl,
        });
        return res.data;
    },

    delete: async (id: string): Promise<ApiResponse<null>> => {
        const res = await axiosInstance.delete<ApiResponse<null>>(`/Portfolio/${id}`);
        return res.data;
    },

    uploadMedia: async (id: string, file: File): Promise<ApiResponse<PortfolioMedia>> => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await axiosInstance.post<ApiResponse<PortfolioMedia>>(`/Portfolio/${id}/media`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 120000, // 2 min for large videos
        });
        return res.data;
    },

    deleteMedia: async (mediaId: string): Promise<ApiResponse<null>> => {
        const res = await axiosInstance.delete<ApiResponse<null>>(`/Portfolio/media/${mediaId}`);
        return res.data;
    },

    // Upload ảnh bìa: upload file → lấy URL → set làm thumbnail
    uploadThumbnailFile: async (id: string, file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await axiosInstance.post<ApiResponse<PortfolioMedia>>(
            `/Portfolio/${id}/media`, formData,
            { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 }
        );
        const url = uploadRes.data.data?.url;
        if (!url) throw new Error('Upload thất bại');
        // Set as thumbnail
        const item = await portfolioApi.getById(id);
        if (!item.data) throw new Error('Không tìm thấy portfolio');
        await axiosInstance.put<ApiResponse<PortfolioItem>>('/Portfolio', {
            id,
            title: item.data.title,
            category: toCategoryEnumName(item.data.category), // Đảm bảo gửi string
            content: item.data.content,
            clientName: item.data.clientName,
            displayOrder: item.data.displayOrder,
            thumbnailUrl: url,
        });
        return url;
    },
};
