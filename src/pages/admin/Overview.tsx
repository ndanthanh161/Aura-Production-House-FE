import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area,
} from 'recharts';
import { DollarSign, Users, Briefcase, CalendarCheck, Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { statisticsApi } from '../../services/statisticsApi';
import type { DashboardStats, MonthlyRevenue } from '../../types/statistics.types';

const MONTH_NAMES = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];

const fmtMoney = (n: number) =>
    n >= 1_000_000
        ? `${(n / 1_000_000).toFixed(1)}M ₫`
        : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const AdminOverview: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [revenue, setRevenue] = useState<MonthlyRevenue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const [s, r] = await Promise.all([
                    statisticsApi.getDashboard(),
                    statisticsApi.getMonthlyRevenue(6),
                ]);
                setStats(s.data);
                setRevenue(r.data || []);
            } catch {
                setError('Không thể tải dữ liệu tổng quan.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const chartData = revenue.map(r => ({
        name: `${MONTH_NAMES[r.month - 1]}/${String(r.year).slice(2)}`,
        'Doanh thu': r.revenue,
        'Dự án': r.projectCount,
    }));

    const revenueTrend =
        stats && stats.revenueLastMonth > 0
            ? ((stats.revenueThisMonth - stats.revenueLastMonth) / stats.revenueLastMonth * 100).toFixed(1)
            : null;

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-accent)' }} />
            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    if (error) return (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#ef4444' }}>{error}</div>
    );

    const kpis = [
        {
            label: 'Tổng Doanh Thu',
            value: fmtMoney(stats?.totalRevenue ?? 0),
            sub: `Tháng này: ${fmtMoney(stats?.revenueThisMonth ?? 0)}`,
            icon: <DollarSign size={20} />,
            trend: revenueTrend,
            trendUp: revenueTrend ? parseFloat(revenueTrend) >= 0 : null,
        },
        {
            label: 'Tổng Khách Hàng',
            value: stats?.totalCustomers ?? 0,
            sub: `Mới tháng này: +${stats?.newCustomersThisMonth ?? 0}`,
            icon: <Users size={20} />,
            trend: null, trendUp: null,
        },
        {
            label: 'Booking Tháng Này',
            value: stats?.bookingsThisMonth ?? 0,
            sub: `Đã hủy: ${stats?.cancelledThisMonth ?? 0}`,
            icon: <CalendarCheck size={20} />,
            trend: null, trendUp: null,
        },
        {
            label: 'Dự Án Đang Thực Hiện',
            value: stats?.projectsInProduction ?? 0,
            sub: `Đã lên lịch: ${stats?.projectsScheduled ?? 0}`,
            icon: <Briefcase size={20} />,
            trend: null, trendUp: null,
        },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--color-text)' }}>
                    Tổng Quan
                </h1>
                <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                    Số liệu thực tế từ hệ thống — cập nhật lúc {stats ? new Date(stats.generatedAt).toLocaleTimeString('vi-VN') : '—'}
                </p>
            </header>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem' }}>
                {kpis.map((kpi, i) => (
                    <motion.div
                        key={kpi.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.08 }}
                        style={{
                            backgroundColor: 'var(--color-bg-secondary)',
                            padding: '1.5rem',
                            border: '1px solid var(--color-border)',
                            borderRadius: '8px',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <div style={{ color: 'var(--color-accent)' }}>{kpi.icon}</div>
                            {kpi.trend && (
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '3px',
                                    fontSize: '0.75rem', fontWeight: 600,
                                    color: kpi.trendUp ? '#22c55e' : '#ef4444',
                                }}>
                                    {kpi.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    {kpi.trend}%
                                </div>
                            )}
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1 }}>
                            {kpi.value}
                        </div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)', marginTop: '4px' }}>
                            {kpi.label}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '3px' }}>
                            {kpi.sub}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Revenue Chart */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    padding: '1.75rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                }}
            >
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '1.5rem' }}>
                    Doanh Thu 6 Tháng Gần Nhất
                </h3>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#c5a059" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#c5a059" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                            <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="var(--color-text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => fmtMoney(v)} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                                formatter={(v: number | undefined) => [fmtMoney(v ?? 0), 'Doanh thu']}
                            />
                            <Area type="monotone" dataKey="Doanh thu" stroke="#c5a059" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2.5} dot={{ r: 4, fill: '#c5a059' }} activeDot={{ r: 6 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                        Chưa có dữ liệu doanh thu.
                    </div>
                )}
            </motion.div>

            {/* Project Status Summary */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}
            >
                {[
                    { label: 'Đã lên lịch',    value: stats?.projectsScheduled ?? 0,    color: '#3b82f6' },
                    { label: 'Đang thực hiện', value: stats?.projectsInProduction ?? 0,  color: '#f59e0b' },
                    { label: 'Hoàn thành',      value: stats?.projectsCompleted ?? 0,     color: '#22c55e' },
                    { label: 'Đã hủy',          value: stats?.projectsCancelled ?? 0,     color: '#ef4444' },
                ].map(s => (
                    <div key={s.label} style={{
                        backgroundColor: 'var(--color-bg-secondary)',
                        border: `1px solid var(--color-border)`,
                        borderLeft: `4px solid ${s.color}`,
                        borderRadius: '8px',
                        padding: '1.25rem',
                    }}>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>{s.label}</div>
                    </div>
                ))}
            </motion.div>

            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
    );
};

export default AdminOverview;
