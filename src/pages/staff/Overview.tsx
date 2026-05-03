import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle2, Clock, Bell, Loader2, Calendar } from 'lucide-react';
import { projectApi } from '../../services/projectApi';
import type { Project } from '../../types/project.types';
import { useAuth } from '../../context/AuthContext';

const STATUS_LABELS: any = {
    Scheduled: 'Đã lên lịch',
    InProduction: 'Đang thực hiện',
    Completed: 'Hoàn thành',
    Cancelled: 'Đã hủy',
};

const PhotographerOverview: React.FC = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const fetch = async () => {
        try {
            setLoading(true);
            const res = await projectApi.getSchedules();
            setProjects(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetch(); }, []);

    const inProduction = projects.filter(p => p.status === 'InProduction').length;
    const scheduled = projects.filter(p => p.status === 'Scheduled').length;
    const completed = projects.filter(p => p.status === 'Completed').length;

    const statsCards = [
        { label: 'Đang Triển Khai', value: inProduction + scheduled, icon: <Briefcase size={20} />, color: 'var(--color-accent)' },
        { label: 'Đang Thực Hiện', value: inProduction, icon: <Clock size={20} />, color: '#3b82f6' },
        { label: 'Hoàn Thành', value: completed, icon: <CheckCircle2 size={20} />, color: '#22c55e' },
    ];

    const activeList = projects.filter(p => p.status !== 'Completed' && p.status !== 'Cancelled').slice(0, 5);

    if (loading) return (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-accent)', margin: '0 auto' }} />
            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Tổng Quan</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Chào mừng trở lại, {user?.fullName || 'Photographer'}.</p>
                </div>
                <button style={{ position: 'relative', color: 'var(--color-text-muted)' }}>
                    <Bell size={24} />
                    {projects.length > 0 && <span style={{ position: 'absolute', top: -2, right: -2, width: '10px', height: '10px', backgroundColor: 'var(--color-accent)', borderRadius: '50%', border: '2px solid var(--color-bg)' }} />}
                </button>
            </header>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                {statsCards.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        style={{
                            padding: '1.5rem',
                            backgroundColor: 'var(--color-bg-secondary)',
                            border: '1px solid var(--color-border)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.5rem'
                        }}
                    >
                        <div style={{ padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stat.value}</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{stat.label}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Active Projects Table */}
            <section style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem' }}>Công Việc Ưu Tiên</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Hiển thị {activeList.length} dự án mới nhất</div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                                <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Tên Dự Án</th>
                                <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Khách Hàng</th>
                                <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Hạn Chót</th>
                                <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Trạng Thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeList.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '1rem', color: 'var(--color-text)', fontWeight: 600 }}>{p.name}</td>
                                    <td style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>{p.clientName}</td>
                                    <td style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Calendar size={13} />
                                            {new Date(p.deadline).toLocaleDateString('vi-VN')}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            backgroundColor: 'rgba(197,160,89,0.1)',
                                            color: 'var(--color-accent)',
                                            fontSize: '0.75rem',
                                            borderRadius: '4px',
                                            fontWeight: 600
                                        }}>
                                            {STATUS_LABELS[p.status] || p.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {activeList.length === 0 && (
                                <tr>
                                    <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                        Bạn không có dự án nào đang triển khai.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default PhotographerOverview;
