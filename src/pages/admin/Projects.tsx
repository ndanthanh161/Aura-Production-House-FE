import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, Loader2, X, RefreshCw, CalendarDays, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { bookingApi } from '../../services/bookingApi';
import type { BookingSchedule, BookingStatus } from '../../types/booking.types';

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    Scheduled:     { label: 'Đã lên lịch',    color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  icon: <Clock size={12} /> },
    InProduction:  { label: 'Đang thực hiện',  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  icon: <AlertCircle size={12} /> },
    PreProduction: { label: 'Chờ thanh toán',  color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', icon: <AlertCircle size={12} /> },
    Completed:     { label: 'Hoàn thành',       color: '#22c55e', bg: 'rgba(34,197,94,0.12)',  icon: <CheckCircle size={12} /> },
    Cancelled:     { label: 'Đã hủy',           color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  icon: <XCircle size={12} /> },
};

const AdminProjects: React.FC = () => {
    const [projects, setProjects] = useState<BookingSchedule[]>([]);
    const [filtered, setFiltered] = useState<BookingSchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const res = await bookingApi.getSchedules();
            setProjects(res.data || []);
            setFiltered(res.data || []);
        } catch {
            setError('Không thể tải danh sách dự án.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProjects(); }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(projects.filter(p =>
            p.projectName.toLowerCase().includes(q) ||
            p.clientName.toLowerCase().includes(q) ||
            (p.staffName || '').toLowerCase().includes(q)
        ));
    }, [search, projects]);

    const fmtDate = (d: string) => new Date(d).toLocaleDateString('vi-VN');
    const fmtMoney = (n: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--color-text)' }}>Giám Sát Dự Án</h1>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{projects.length} dự án đang hoạt động</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input
                            placeholder="Tìm dự án, khách hàng..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ padding: '0.65rem 0.9rem 0.65rem 36px', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text)', fontSize: '0.875rem', width: '240px', boxSizing: 'border-box' }}
                        />
                    </div>
                    <button onClick={fetchProjects} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.65rem 1rem', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-muted)', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.875rem' }}>
                        <RefreshCw size={14} />
                    </button>
                </div>
            </header>

            {error && (
                <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                    {error} <button onClick={() => setError('')}><X size={14} /></button>
                </div>
            )}

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-accent)' }} />
                </div>
            ) : (
                <div style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                                {['Tên Dự Án', 'Khách Hàng', 'Nhân Viên Phụ Trách', 'Ngày Chụp', 'Trạng Thái', 'Chi tiết'].map(h => (
                                    <th key={h} style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((p, i) => {
                                const cfg = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.Scheduled;
                                return (
                                    <motion.tr key={p.projectId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                                        style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.9rem' }}>{p.projectName}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{p.packageName}</div>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text)', fontSize: '0.875rem' }}>{p.clientName}</td>
                                        <td style={{ padding: '1rem 1.25rem', color: p.staffName ? 'var(--color-text)' : 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                            {p.staffName || '—'}
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text)', fontSize: '0.875rem' }}>
                                                <CalendarDays size={13} style={{ color: 'var(--color-accent)' }} />
                                                {fmtDate(p.shootingDate)}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: cfg.bg, color: cfg.color }}>
                                                {cfg.icon} {cfg.label}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <button title="Chi tiết" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '6px', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', backgroundColor: 'transparent', cursor: 'pointer' }}>
                                                <Eye size={15} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                                        Không có dự án nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
    );
};

export default AdminProjects;
