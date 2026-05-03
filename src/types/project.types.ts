// ─── Project Types ─────────────────────────────────────────────────

export type ProjectStatus =
    | 'InProduction'
    | 'Scheduled'
    | 'Completed'
    | 'Cancelled';

export interface Project {
    id: string;
    name: string;
    clientId: string;
    clientName?: string;
    packageId: string;
    packageName?: string;
    staffId?: string;
    staffName?: string;
    status: ProjectStatus;
    revenue: number;

    deadline: string;
    description?: string;
    resultLink?: string;
    benefits: string[];
    createdAt: string;
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
}

export interface GetSchedulesParams {
    from?: string;
    to?: string;
    staffId?: string;
}

export interface CreateProjectRequest {
    name: string;
    clientId: string;
    packageId: string;

    description?: string;
}

export interface UpdateProjectRequest {
    id: string;
    name: string;
    staffId?: string;
    status: ProjectStatus;
    revenue: number;

    deadline: string;
    description?: string;
    resultLink?: string;
}
