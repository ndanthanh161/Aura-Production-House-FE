import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area,
} from 'recharts';
import { DollarSign, Users, Briefcase, CalendarCheck, Loader2, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { statisticsApi } from '../../services/statisticsApi';
import type { DashboardStats, MonthlyRevenue } from '../../types/statistics.types';

const MONTH_NAMES = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];

const fmtMoney = (n: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

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
            trend: stats?.revenueGrowth ? `${stats.revenueGrowth > 0 ? '+' : ''}${stats.revenueGrowth}%` : '0%',
            trendUp: stats?.revenueGrowth ? stats.revenueGrowth >= 0 : null,
            context: 'So với tháng trước'
        },
        {
            label: 'Giá Trị Đơn Trung Bình',
            value: fmtMoney(stats?.averageOrderValue ?? 0),
            sub: 'AOV - Doanh thu trên dự án',
            icon: <TrendingUp size={20} />,
            trend: null, trendUp: null,
            context: 'Chỉ số hiệu quả'
        },
        {
            label: 'Tỉ Lệ Chuyển Đổi',
            value: `${stats?.conversionRate ?? 0}%`,
            sub: 'Booking -> Thanh toán',
            icon: <Activity size={20} />,
            trend: null, trendUp: null,
            context: 'Hiệu quả bán hàng'
        },
        {
            label: 'Tổng Khách Hàng',
            value: stats?.totalCustomers ?? 0,
            sub: `Mới tháng này: +${stats?.newCustomersThisMonth ?? 0}`,
            icon: <Users size={20} />,
            trend: null, trendUp: null,
            context: 'Quy mô tệp khách'
        },
    ];

    const projectKPIs = [
        {
            label: 'Booking Tháng Này',
            value: stats?.bookingsThisMonth ?? 0,
            sub: `Đã hủy: ${stats?.cancelledThisMonth ?? 0}`,
            icon: <CalendarCheck size={20} />,
        },
        {
            label: 'Dự Án Đang Thực Hiện',
            value: stats?.projectsInProduction ?? 0,
            sub: `Đã lên lịch: ${stats?.projectsScheduled ?? 0}`,
            icon: <Briefcase size={20} />,
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
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        style={{
                            backgroundColor: 'var(--color-bg-secondary)',
                            padding: '1.5rem',
                            border: '1px solid var(--color-border)',
                            borderRadius: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                            position: 'relative'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ color: 'var(--color-accent)', opacity: 0.8 }}>{kpi.icon}</div>
                            {kpi.trend && (
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '3px',
                                    fontSize: '0.75rem', fontWeight: 700,
                                    color: kpi.trendUp ? '#22c55e' : '#ef4444',
                                    backgroundColor: kpi.trendUp ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                                    padding: '2px 8px',
                                    borderRadius: '10px'
                                }}>
                                    {kpi.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    {kpi.trend}
                                </div>
                            )}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {kpi.label}
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginTop: '4px' }}>
                                {kpi.value}
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{kpi.sub}</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--color-accent)', fontWeight: 600 }}>{kpi.context}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem' }}>
                {projectKPIs.map((kpi, i) => (
                    <motion.div
                        key={kpi.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + (i * 0.08) }}
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.02)',
                            padding: '1.25rem',
                            border: '1px solid var(--color-border)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}
                    >
                        <div style={{ color: 'var(--color-text-muted)' }}>{kpi.icon}</div>
                        <div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>{kpi.value}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{kpi.label}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', flexWrap: 'wrap' }}>
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

                {/* Revenue Breakdown by Package */}
                <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    style={{
                        backgroundColor: 'var(--color-bg-secondary)',
                        padding: '1.75rem',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                    }}
                >
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '1.5rem' }}>
                        Cơ Cấu Doanh Thu
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {stats && stats.revenueByPackage && Object.entries(stats.revenueByPackage).length > 0 ? (
                            Object.entries(stats.revenueByPackage)
                                .sort((a, b) => (b[1] as number) - (a[1] as number))
                                .map(([pkg, rev], idx) => {
                                    const total = stats.totalRevenue || 1;
                                    const percent = (((rev as number) / total) * 100).toFixed(1);
                                    return (
                                        <div key={pkg}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                                                <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{pkg}</span>
                                                <span style={{ color: 'var(--color-text-muted)' }}>{percent}%</span>
                                            </div>
                                            <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{ 
                                                    height: '100%', 
                                                    width: `${percent}%`, 
                                                    backgroundColor: idx === 0 ? 'var(--color-accent)' : 'var(--color-text-muted)',
                                                    transition: 'width 1s ease-out'
                                                }} />
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                                                {fmtMoney(rev as number)}
                                            </div>
                                        </div>
                                    );
                                })
                        ) : (
                            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Không có dữ liệu phân bổ.</div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Project Status Summary */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
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
                        borderRadius: '8px',
                        padding: '1.25rem',
                    }}>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)' }}>{s.value}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>{s.label}</div>
                    </div>
                ))}
            </motion.div>

            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
    );
};

export default AdminOverview;
