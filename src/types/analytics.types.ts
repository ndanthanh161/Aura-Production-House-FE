export interface AnalyticsStats {
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
    outstandingAmount: number;
    paidProjects: number;
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

export interface OverviewProject {
    projectId: string;
    projectName: string;
    customerName: string;
    packageName: string;
    photographerName?: string | null;
    deadline: string;
}

export interface RecentPayment {
    paymentId: string;
    transactionId: string;
    projectId: string;
    projectName: string;
    customerName: string;
    packageName: string;
    amount: number;
    status: string;
    paidAt: string;
}

export interface OverviewStats {
    revenueThisMonth: number;
    projectsInProduction: number;
    awaitingPaymentProjects: number;
    unreadMessages: number;
    unassignedProjects: OverviewProject[];
    upcomingProjects: OverviewProject[];
    recentPayments: RecentPayment[];
    generatedAt: string;
}

export interface MonthlyRevenue {
    year: number;
    month: number;
    revenue: number;
    projectCount: number;
}

export interface PackageRanking {
    packageId: string;
    packageName: string;
    orderCount: number;
    revenue: number;
    revenueShare: number;
    growth: number;
    lastPurchasedAt?: string | null;
}

export interface PhotographerPerformance {
    photographerId: string;
    photographerName: string;
    totalAssigned: number;
    completed: number;
    inProgress: number;
    cancelled: number;
    totalRevenue: number;
}

export interface AnalyticsDashboard {
    dashboard: AnalyticsStats;
    overview: OverviewStats;
    monthlyRevenue: MonthlyRevenue[];
    packageRanking: PackageRanking[];
    recentPayments: RecentPayment[];
    photographerPerformance: PhotographerPerformance[];
    months: number;
    periodStart: string;
    periodEnd: string;
    generatedAt: string;
}
