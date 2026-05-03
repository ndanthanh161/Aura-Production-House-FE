import { axiosInstance } from '../lib/axiosInstance';
import type { ApiResponse } from '../types/auth.types';

export interface SePayInfo {
    bankId: string;
    accountNumber: string;
    accountName: string;
}

export const paymentApi = {
    getSePayInfo: async (): Promise<ApiResponse<SePayInfo>> => {
        const res = await axiosInstance.get<ApiResponse<SePayInfo>>('/v1/SePay/info');
        return res.data;
    }
};
