import { axiosInstance } from '../lib/axiosInstance';
import type { ApiResponse } from '../types/auth.types';
import type { DashboardStats, MonthlyRevenue, StaffPerformance } from '../types/statistics.types';

export const statisticsApi = {
    getDashboard: async (): Promise<ApiResponse<DashboardStats>> => {
        const res = await axiosInstance.get<ApiResponse<DashboardStats>>('/v1/Statistics/dashboard');
        return res.data;
    },
    getMonthlyRevenue: async (months = 12): Promise<ApiResponse<MonthlyRevenue[]>> => {
        const res = await axiosInstance.get<ApiResponse<MonthlyRevenue[]>>(
            `/v1/Statistics/revenue?months=${months}`
        );
        return res.data;
    },
    getStaffPerformance: async (): Promise<ApiResponse<StaffPerformance[]>> => {
        const res = await axiosInstance.get<ApiResponse<StaffPerformance[]>>(
            '/v1/Statistics/staff-performance'
        );
        return res.data;
    },
};
