import { axiosInstance } from '../lib/axiosInstance';
import type { ApiResponse } from '../types/auth.types';
import type {
    BookingSchedule,
    BookingStatusDetail,
    SlotAvailability,
    RescheduleRequest,
    GetSchedulesParams,
} from '../types/booking.types';

export const bookingApi = {
    getSchedules: async (params?: GetSchedulesParams): Promise<ApiResponse<BookingSchedule[]>> => {
        const query = new URLSearchParams();
        if (params?.from) query.append('from', params.from);
        if (params?.to) query.append('to', params.to);
        if (params?.staffId) query.append('staffId', params.staffId);
        const res = await axiosInstance.get<ApiResponse<BookingSchedule[]>>(
            `/v1/Booking/schedules?${query.toString()}`
        );
        return res.data;
    },
    checkSlot: async (date: string, maxSlots = 3): Promise<ApiResponse<SlotAvailability>> => {
        const res = await axiosInstance.get<ApiResponse<SlotAvailability>>(
            `/v1/Booking/slots?date=${date}&maxSlots=${maxSlots}`
        );
        return res.data;
    },
    reschedule: async (request: RescheduleRequest): Promise<ApiResponse<BookingSchedule>> => {
        const res = await axiosInstance.patch<ApiResponse<BookingSchedule>>('/v1/Booking/reschedule', request);
        return res.data;
    },
    cancel: async (projectId: string): Promise<ApiResponse<string>> => {
        const res = await axiosInstance.patch<ApiResponse<string>>(`/v1/Booking/${projectId}/cancel`);
        return res.data;
    },
    getStatus: async (projectId: string): Promise<ApiResponse<BookingStatusDetail>> => {
        const res = await axiosInstance.get<ApiResponse<BookingStatusDetail>>(`/v1/Booking/${projectId}/status`);
        return res.data;
    },
};
