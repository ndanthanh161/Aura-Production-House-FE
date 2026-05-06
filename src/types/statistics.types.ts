// ─── Statistics Types ──────────────────────────────────────────────

export interface DashboardStats {
    totalProjects: number;
    projectsInProduction: number;
    projectsScheduled: number;
    projectsCompleted: number;
    projectsCancelled: number;
    totalRevenue: number;
    revenueThisMonth: number;
    revenueLastMonth: number;
    revenueGrowth: number;
    averageOrderValue: number;
    totalCustomers: number;
    totalStaff: number;
    newCustomersThisMonth: number;
    conversionRate: number;
    revenueByPackage: Record<string, number>;
    projectsByCategory: Record<string, number>;
    totalBookings: number;
    bookingsThisMonth: number;
    cancelledThisMonth: number;
    totalActivePackages: number;
    generatedAt: string;
}

export interface MonthlyRevenue {
    year: number;
    month: number;
    revenue: number;
    projectCount: number;
}

export interface StaffPerformance {
    staffId: string;
    staffName: string;
    totalAssigned: number;
    completed: number;
    inProgress: number;
    cancelled: number;
    totalRevenue: number;
}
