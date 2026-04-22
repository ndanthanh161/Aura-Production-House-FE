import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CalendarDays, Clock, CheckCircle, XCircle, AlertCircle, Loader2, X, RefreshCw } from 'lucide-react';
import { bookingApi } from '../../services/bookingApi';
import type { BookingSchedule, BookingStatus } from '../../types/booking.types';

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    Scheduled:     { label: 'Đã lên lịch',    color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  icon: <Clock size={12} /> },
    InProduction:  { label: 'Đang thực hiện',  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  icon: <AlertCircle size={12} /> },
    PreProduction: { label: 'Tiền sản xuất',   color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', icon: <AlertCircle size={12} /> },
    Completed:     { label: 'Hoàn thành',       color: '#22c55e', bg: 'rgba(34,197,94,0.12)',  icon: <CheckCircle size={12} /> },
    Cancelled:     { label: 'Đã hủy',           color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  icon: <XCircle size={12} /> },
};

const PhotographerProjects: React.FC = () => {
    const [schedules, setSchedules] = useState<BookingSchedule[]>([]);
    const [filtered, setFiltered] = useState<BookingSchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<BookingStatus | 'All'>('All');

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await bookingApi.getSchedules();
            setSchedules(res.data || []);
            setFiltered(res.data || []);
        } catch {
            setError('Không thể tải danh sách dự án.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(schedules.filter(s =>
            (filterStatus === 'All' || s.status === filterStatus) &&
            (s.projectName.toLowerCase().includes(q) || s.clientName.toLowerCase().includes(q))
        ));
    }, [search, filterStatus, schedules]);

    const fmtDate = (d: string) => new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.4rem' }}>Dự Án</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Theo dõi lịch chụp và trạng thái các dự án của bạn.</p>
                </div>
                <button onClick={fetchData} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.6rem 1rem', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-muted)', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <RefreshCw size={14} /> Làm mới
                </button>
            </header>

            {/* Toolbar */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: '360px' }}>
                    <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                        placeholder="Tìm tên dự án, khách hàng..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem 0.9rem 0.65rem 36px', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text)', fontSize: '0.875rem', boxSizing: 'border-box' }}
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value as BookingStatus | 'All')}
                    style={{ padding: '0.65rem 1rem', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text)', fontSize: '0.875rem', cursor: 'pointer' }}
                >
                    <option value="All">Tất cả trạng thái</option>
                    {(Object.keys(STATUS_CONFIG) as BookingStatus[]).map(s => (
                        <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                    ))}
                </select>
            </div>

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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                    {filtered.map((s, i) => {
                        const cfg = STATUS_CONFIG[s.status] ?? STATUS_CONFIG.Scheduled;
                        return (
                            <motion.div
                                key={s.projectId}
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.07 }}
                                style={{
                                    backgroundColor: 'var(--color-bg-secondary)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '8px',
                                    padding: '1.5rem',
                                    display: 'flex', flexDirection: 'column', gap: '1rem',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                                        {s.packageName}
                                    </span>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 600, backgroundColor: cfg.bg, color: cfg.color }}>
                                        {cfg.icon} {cfg.label}
                                    </span>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '4px' }}>{s.projectName}</h3>
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Khách hàng: {s.clientName}</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)', color: 'var(--color-text)', fontSize: '0.875rem' }}>
                                    <CalendarDays size={14} style={{ color: 'var(--color-accent)' }} />
                                    <span>Ngày chụp: <strong>{fmtDate(s.shootingDate)}</strong></span>
                                </div>
                            </motion.div>
                        );
                    })}
                    {filtered.length === 0 && !loading && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                            Không có dự án nào phù hợp.
                        </div>
                    )}
                </div>
            )}

            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
    );
};

export default PhotographerProjects;
