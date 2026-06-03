import { axiosInstance } from '../lib/axiosInstance';
import type { ApiResponse } from '../types/auth.types';

export interface SePayInfo {
    bankId: string;
    accountNumber: string;
    accountName: string;
}

export const paymentApi = {
    getSePayInfo: async (): Promise<ApiResponse<SePayInfo>> => {
        const res = await axiosInstance.get<ApiResponse<SePayInfo>>('SePay/info');
        return res.data;
    },
    manualConfirm: async (data: { projectId: string; transferAmount: number; transactionId: string }): Promise<ApiResponse<{ success: boolean }>> => {
        const res = await axiosInstance.post<ApiResponse<{ success: boolean }>>('SePay/manual-confirm', data);
        return res.data;
    }
};
