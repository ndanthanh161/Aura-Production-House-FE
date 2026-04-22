// ─── Booking Types ─────────────────────────────────────────────────

export type BookingStatus =
    | 'PreProduction'
    | 'InProduction'
    | 'Scheduled'
    | 'Completed'
    | 'Cancelled';

export interface BookingSchedule {
    projectId: string;
    projectName: string;
    clientId: string;
    clientName: string;
    staffId?: string;
    staffName?: string;
    packageId: string;
    packageName: string;
    shootingDate: string;
    status: BookingStatus;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface BookingStatusDetail {
    projectId: string;
    projectName: string;
    status: BookingStatus;
    statusLabel: string;
    shootingDate: string;
    isCancellable: boolean;
    isReschedulable: boolean;
    updatedAt: string;
}

export interface SlotAvailability {
    date: string;
    bookedCount: number;
    isAvailable: boolean;
    bookedProjectIds: string[];
}

export interface RescheduleRequest {
    projectId: string;
    newShootingDate: string;
    reason?: string;
}

export interface GetSchedulesParams {
    from?: string;
    to?: string;
    staffId?: string;
}
