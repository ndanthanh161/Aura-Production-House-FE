import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { TrendingUp, TrendingDown, Users, CalendarCheck, Package, Briefcase, Loader2 } from 'lucide-react';
import { statisticsApi } from '../../services/statisticsApi';
import type { DashboardStats, MonthlyRevenue, StaffPerformance } from '../../types/statistics.types';

const MONTH_NAMES = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];

const fmtMoney = (n: number) =>
    n >= 1_000_000
        ? `${(n / 1_000_000).toFixed(1)}M ₫`
        : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const AdminStatistics: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [revenue, setRevenue] = useState<MonthlyRevenue[]>([]);
    const [performance, setPerformance] = useState<StaffPerformance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const [s, r, p] = await Promise.all([
                    statisticsApi.getDashboard(),
                    statisticsApi.getMonthlyRevenue(12),
                    statisticsApi.getStaffPerformance(),
                ]);
                setStats(s.data);
                setRevenue(r.data || []);
                setPerformance(p.data || []);
            } catch {
                setError('Không thể tải dữ liệu thống kê. Kiểm tra kết nối server.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const revenueChartData = revenue.map(r => ({
        name: `${MONTH_NAMES[r.month - 1]}/${r.year}`,
        'Doanh thu': r.revenue,
        'Dự án': r.projectCount,
    }));

    const projectStatusData = stats ? [
        { name: 'Scheduled', value: stats.projectsScheduled, color: '#3b82f6', label: 'Đã lên lịch' },
        { name: 'InProduction', value: stats.projectsInProduction, color: '#f59e0b', label: 'Đang thực hiện' },
        { name: 'Completed', value: stats.projectsCompleted, color: '#22c55e', label: 'Hoàn thành' },
        { name: 'Cancelled', value: stats.projectsCancelled, color: '#ef4444', label: 'Đã hủy' },
    ] : [];

    const revenueTrend = stats && stats.revenueLastMonth > 0
        ? ((stats.revenueThisMonth - stats.revenueLastMonth) / stats.revenueLastMonth * 100).toFixed(1)
        : null;

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div style={{ textAlign: 'center' }}>
                <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-accent)', marginBottom: '1rem' }} />
                <p style={{ color: 'var(--color-text-muted)' }}>Đang tải dữ liệu...</p>
            </div>
        </div>
    );

    if (error) return (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#ef4444' }}>
            <p>{error}</p>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--color-text)' }}>Thống Kê & Báo Cáo</h1>
                <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                    Số liệu cập nhật lúc: {stats ? new Date(stats.generatedAt).toLocaleTimeString('vi-VN') : '—'}
                </p>
            </header>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                {[
                    {
                        label: 'Tổng Doanh Thu', value: fmtMoney(stats?.totalRevenue || 0),
                        sub: `Tháng này: ${fmtMoney(stats?.revenueThisMonth || 0)}`,
                        icon: <TrendingUp size={22} />, color: 'var(--color-accent)',
                        trend: revenueTrend ? { val: revenueTrend, up: parseFloat(revenueTrend) >= 0 } : null,
                    },
                    {
                        label: 'Tổng Dự Án', value: stats?.totalProjects || 0,
                        sub: `Hoàn thành: ${stats?.projectsCompleted || 0}`,
                        icon: <Briefcase size={22} />, color: '#3b82f6', trend: null,
                    },
                    {
                        label: 'Khách Hàng', value: stats?.totalCustomers || 0,
                        sub: `Mới tháng này: +${stats?.newCustomersThisMonth || 0}`,
                        icon: <Users size={22} />, color: '#22c55e', trend: null,
                    },
                    {
                        label: 'Booking Tháng Này', value: stats?.bookingsThisMonth || 0,
                        sub: `Đã hủy: ${stats?.cancelledThisMonth || 0}`,
                        icon: <CalendarCheck size={22} />, color: '#f59e0b', trend: null,
                    },
                    {
                        label: 'Gói Dịch Vụ', value: stats?.totalActivePackages || 0,
                        sub: `Đang hoạt động`,
                        icon: <Package size={22} />, color: '#8b5cf6', trend: null,
                    },
                    {
                        label: 'Photographer', value: stats?.totalStaff || 0,
                        sub: `Nhân viên chụp ảnh`,
                        icon: <Users size={22} />, color: '#ec4899', trend: null,
                    },
                ].map((kpi, i) => (
                    <motion.div key={kpi.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', backgroundColor: kpi.color }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                            <div style={{ color: kpi.color, opacity: 0.9 }}>{kpi.icon}</div>
                            {kpi.trend && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', fontWeight: 600, color: kpi.trend.up ? '#22c55e' : '#ef4444' }}>
                                    {kpi.trend.up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                                    {kpi.trend.val}%
                                </div>
                            )}
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1 }}>{kpi.value}</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)', marginTop: '4px' }}>{kpi.label}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>{kpi.sub}</div>
                    </motion.div>
                ))}
            </div>

            {/* Revenue Chart */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '1.5rem' }}>Doanh Thu 12 Tháng Gần Nhất</h3>
                {revenueChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={revenueChartData}>
                            <defs>
                                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                            <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis stroke="var(--color-text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => fmtMoney(v)} />
                            <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '8px' }} formatter={(v: number | undefined) => [fmtMoney(v ?? 0), 'Doanh thu']} />
                            <Area type="monotone" dataKey="Doanh thu" stroke="var(--color-accent)" fill="url(#revGrad)" strokeWidth={2.5} dot={{ r: 4, fill: 'var(--color-accent)' }} activeDot={{ r: 6 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Chưa có dữ liệu doanh thu.</div>
                )}
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Project Status */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1.75rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '1.5rem' }}>Trạng Thái Dự Án</h3>
                    {projectStatusData.map(s => (
                        <div key={s.name} style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{s.label}</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>{s.value}</span>
                            </div>
                            <div style={{ height: '6px', backgroundColor: 'var(--color-bg)', borderRadius: '3px', overflow: 'hidden' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: stats?.totalProjects ? `${(s.value / stats.totalProjects) * 100}%` : '0%' }}
                                    transition={{ duration: 0.8, delay: 0.5 }}
                                    style={{ height: '100%', backgroundColor: s.color, borderRadius: '3px' }}
                                />
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Staff Performance */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1.75rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '1.5rem' }}>Hiệu Suất Photographer</h3>
                    {performance.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={performance} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                                <XAxis type="number" stroke="var(--color-text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis type="category" dataKey="staffName" stroke="var(--color-text-muted)" fontSize={11} tickLine={false} axisLine={false} width={90} />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '8px' }} />
                                <Bar dataKey="completed" name="Hoàn thành" radius={[0, 4, 4, 0]}>
                                    {performance.map((_, idx) => (
                                        <Cell key={idx} fill="var(--color-accent)" />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Chưa có dữ liệu.</div>
                    )}
                </motion.div>
            </div>

            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
    );
};

export default AdminStatistics;
