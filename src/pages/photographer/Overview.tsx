import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle2, Clock, CalendarDays, Loader2, User as UserIcon, Camera } from 'lucide-react';
import { projectApi } from '../../services/projectApi';
import { photographerApi } from '../../services/userApi';
import { useAuth } from '../../context/AuthContext';
import type { Project } from '../../types/project.types';
import type { UserDTO } from '../../types/user.types';
import { Link } from 'react-router-dom';

const STATUS_COLORS: Record<string, string> = {
    Scheduled: '#3b82f6',
    InProduction: '#f59e0b',
    Completed: '#22c55e',
    Cancelled: '#ef4444',
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
    const [fullProfile, setFullProfile] = useState<UserDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            const userId = user?.userId;
            if (!userId) return;

            try {
                setLoading(true);
                const [projRes, profileRes] = await Promise.all([
                    projectApi.getSchedules(),
                    photographerApi.getById(userId)
                ]);
                setSchedules(projRes.data || []);
                if (profileRes.data) setFullProfile(profileRes.data);
            } catch (err) {
                console.error('Overview load error:', err);
                setError('Không thể tải dữ liệu tổng quan.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [user?.userId]);

    const active = schedules.filter(s => s.status === 'InProduction' || s.status === 'Scheduled');
    const completed = schedules.filter(s => s.status === 'Completed');

    const kpis = [
        { label: 'Tổng Dự Án', value: schedules.length, icon: <Briefcase size={20} />, color: 'var(--color-accent)' },
        { label: 'Đang Thực Hiện', value: active.length, icon: <Clock size={20} />, color: '#3b82f6' },
        { label: 'Đã Hoàn Thành', value: completed.length, icon: <CheckCircle2 size={20} />, color: '#22c55e' },
    ];

    const fmtDate = (d: string) => new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Tổng Quan</h1>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        Chào mừng trở lại, <strong style={{ color: 'var(--color-accent)' }}>{user?.fullName || 'Photographer'}</strong> 👋
                    </p>
                </div>
            </header>

            {/* Top Section: KPI & Quick Profile */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', flexWrap: 'wrap' }}>
                {/* KPI Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                    {kpis.map((kpi, i) => (
                        <motion.div
                            key={kpi.label}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            style={cardStyle}
                        >
                            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', color: kpi.color }}>
                                {kpi.icon}
                            </div>
                            <div>
                                {loading
                                    ? <Loader2 size={20} className="animate-spin" color="var(--color-accent)" />
                                    : <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{kpi.value}</div>
                                }
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>{kpi.label}</div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Quick Stats / Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        style={{ ...cardStyle, gridColumn: 'span 3', background: 'linear-gradient(135deg, rgba(197,160,89,0.05) 0%, transparent 100%)' }}
                    >
                        <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-accent)' }}>THÔNG ĐIỆP HÔM NAY</h4>
                            <p style={{ fontSize: '1rem', color: 'var(--color-text)', lineHeight: 1.6, maxWidth: '600px' }}>
                                "Nhiếp ảnh là cách để nắm giữ một khoảnh khắc mà trái tim cảm nhận được. Hãy tạo nên những tuyệt phẩm hôm nay!"
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Quick Profile Side Card */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                        backgroundColor: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '16px',
                        padding: '1.75rem',
                        display: 'flex', flexDirection: 'column', gap: '1.5rem',
                        height: 'fit-content'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '12px', backgroundColor: 'rgba(197,160,89,0.1)', borderRadius: '12px', color: 'var(--color-accent)' }}>
                            <UserIcon size={24} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{user?.fullName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600, textTransform: 'uppercase' }}>{user?.role}</div>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
                        <div style={infoLabel}><Camera size={12} /> Chuyên môn</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '4px', color: fullProfile?.specialization ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
                            {fullProfile?.specialization || 'Chưa cập nhật chuyên môn'}
                        </div>
                    </div>

                    <div>
                        <div style={infoLabel}><UserIcon size={12} /> Giới thiệu</div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5, marginTop: '4px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {fullProfile?.bio || 'Hãy cập nhật giới thiệu bản thân để thu hút nhiều khách hàng hơn.'}
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Active Schedules */}
            <section style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CalendarDays size={20} color="var(--color-accent)" /> Lịch Chụp Sắp Tới
                    </h3>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                        <Loader2 size={32} className="animate-spin" color="var(--color-accent)" />
                    </div>
                ) : error ? (
                    <p style={{ color: '#ef4444', textAlign: 'center', padding: '2rem' }}>{error}</p>
                ) : active.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--color-text-muted)' }}>
                        <Briefcase size={40} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                        <p>Hiện chưa có lịch chụp nào được lên lịch.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                                    {['Tên Dự Án', 'Khách Hàng', 'Ngày Chụp', 'Trạng Thái'].map(h => (
                                        <th key={h} style={{ padding: '1rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {active.map((s, i) => {
                                    const cfg = STATUS_COLORS[s.status] ?? STATUS_COLORS.Scheduled;
                                    return (
                                        <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                                            style={{ borderBottom: '1px solid var(--color-border)' }}>
                                            <td style={{ padding: '1.25rem 1rem', color: 'var(--color-text)', fontWeight: 600 }}>{s.name}</td>
                                            <td style={{ padding: '1.25rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{s.clientName}</td>
                                            <td style={{ padding: '1.25rem 1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)', fontSize: '0.9rem' }}>
                                                    <CalendarDays size={14} style={{ color: 'var(--color-accent)' }} />
                                                    {fmtDate(s.deadline)}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem' }}>
                                                <span style={{
                                                    fontSize: '0.7rem', fontWeight: 800, color: cfg,
                                                    backgroundColor: `${cfg}15`, padding: '4px 10px', borderRadius: '4px',
                                                    textTransform: 'uppercase', letterSpacing: '0.05em'
                                                }}>
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

            <style>{`
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

const cardStyle: React.CSSProperties = {
    padding: '1.75rem',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    borderRadius: '16px',
    display: 'flex', alignItems: 'center', gap: '1.5rem',
    transition: 'transform 0.2s ease',
};

const infoLabel: React.CSSProperties = {
    fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em',
    color: 'var(--color-text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px'
};

export default PhotographerOverview;
