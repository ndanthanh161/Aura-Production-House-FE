import { axiosInstance } from '../lib/axiosInstance';
import type { ApiResponse } from '../types/auth.types';
import type { AnalyticsDashboard } from '../types/analytics.types';

export const analyticsApi = {
    getDashboard: async (months = 12, recentTake = 20): Promise<ApiResponse<AnalyticsDashboard>> => {
        const response = await axiosInstance.get<ApiResponse<AnalyticsDashboard>>(
            `Analytics/dashboard?months=${months}&recentTake=${recentTake}`
        );
        return response.data;
    },
};
