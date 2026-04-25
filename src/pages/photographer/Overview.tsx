import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle2, Clock, CalendarDays, Loader2 } from 'lucide-react';
import { projectApi } from '../../services/projectApi';
import { useAuth } from '../../context/AuthContext';
import type { Project } from '../../types/project.types';

const STATUS_COLORS: Record<string, string> = {
    Scheduled:     '#3b82f6',
    InProduction:  '#f59e0b',
    Completed:     '#22c55e',
    Cancelled:     '#ef4444',
};

const STATUS_LABELS: Record<string, string> = {
    Scheduled: 'Đã Lên Lịch',
    InProduction: 'Đang Thực Hiện',
    Completed: 'Hoàn Thành',
    Cancelled: 'Đã Hủy',
};

const PhotographerOverview: React.FC = () => {
    const { user } = useAuth();
    const [schedules, setSchedules] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const res = await projectApi.getSchedules();
                setSchedules(res.data || []);
            } catch {
                setError('Không thể tải dữ liệu.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const active = schedules.filter(s => s.status === 'InProduction' || s.status === 'Scheduled' || s.status === 'PreProduction');
    const completed = schedules.filter(s => s.status === 'Completed');

    const kpis = [
        { label: 'Tổng Dự Án',          value: schedules.length,  icon: <Briefcase size={20} />,    color: 'var(--color-accent)' },
        { label: 'Đang Thực Hiện',       value: active.length,     icon: <Clock size={20} />,        color: '#3b82f6' },
        { label: 'Đã Hoàn Thành',        value: completed.length,  icon: <CheckCircle2 size={20} />, color: '#22c55e' },
    ];

    const fmtDate = (d: string) => new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.4rem' }}>Tổng Quan</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        Xin chào, <strong style={{ color: 'var(--color-accent)' }}>{user?.fullName || 'Photographer'}</strong> 👋
                    </p>
                </div>
            </header>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                {kpis.map((kpi, i) => (
                    <motion.div
                        key={kpi.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        style={{
                            padding: '1.5rem',
                            backgroundColor: 'var(--color-bg-secondary)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '8px',
                            display: 'flex', alignItems: 'center', gap: '1.25rem',
                        }}
                    >
                        <div style={{ padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: kpi.color }}>
                            {kpi.icon}
                        </div>
                        <div>
                            {loading
                                ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-accent)' }} />
                                : <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{kpi.value}</div>
                            }
                            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{kpi.label}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Active Schedules */}
            <section style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem' }}>Lịch Chụp Sắp Tới</h3>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                        <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-accent)' }} />
                    </div>
                ) : error ? (
                    <p style={{ color: '#ef4444', textAlign: 'center', padding: '2rem' }}>{error}</p>
                ) : active.length === 0 ? (
                    <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>Không có lịch chụp nào đang hoạt động.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                                    {['Tên Dự Án', 'Khách Hàng', 'Ngày Chụp', 'Trạng Thái'].map(h => (
                                        <th key={h} style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {active.map((s, i) => {
                                    const cfg = STATUS_COLORS[s.status] ?? STATUS_COLORS.Scheduled;
                                    return (
                                        <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                                            style={{ borderBottom: '1px solid var(--color-border)' }}>
                                            <td style={{ padding: '1rem', color: 'var(--color-text)', fontWeight: 500 }}>{s.name}</td>
                                            <td style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>{s.clientName}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text)', fontSize: '0.875rem' }}>
                                                    <CalendarDays size={13} style={{ color: 'var(--color-accent)' }} />
                                                    {fmtDate(s.deadline)}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: cfg }}>
                                                    {STATUS_LABELS[s.status] || s.status}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
    );
};

export default PhotographerOverview;
