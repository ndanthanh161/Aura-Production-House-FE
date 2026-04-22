import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, X, RefreshCw, Ban, Search, Loader2, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { bookingApi } from '../../services/bookingApi';
import type { BookingSchedule, BookingStatus } from '../../types/booking.types';

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    Scheduled:     { label: 'Đã lên lịch',    color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  icon: <Clock size={13} /> },
    InProduction:  { label: 'Đang thực hiện',  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  icon: <AlertCircle size={13} /> },
    PreProduction: { label: 'Chờ thanh toán',  color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', icon: <AlertCircle size={13} /> },
    Completed:     { label: 'Hoàn thành',       color: '#22c55e', bg: 'rgba(34,197,94,0.12)',  icon: <CheckCircle size={13} /> },
    Cancelled:     { label: 'Đã hủy',           color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  icon: <XCircle size={13} /> },
};

const AdminBookings: React.FC = () => {
    const [bookings, setBookings] = useState<BookingSchedule[]>([]);
    const [filtered, setFiltered] = useState<BookingSchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [rescheduleId, setRescheduleId] = useState<string | null>(null);
    const [newDate, setNewDate] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await bookingApi.getSchedules({
                from: fromDate || undefined,
                to: toDate || undefined,
            });
            setBookings(res.data || []);
            setFiltered(res.data || []);
        } catch {
            setError('Không thể tải danh sách booking.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBookings(); }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(bookings.filter(b =>
            b.projectName.toLowerCase().includes(q) ||
            b.clientName.toLowerCase().includes(q) ||
            (b.staffName || '').toLowerCase().includes(q)
        ));
    }, [search, bookings]);

    const handleReschedule = async () => {
        if (!rescheduleId || !newDate) return;
        setSaving(true);
        try {
            await bookingApi.reschedule({ projectId: rescheduleId, newShootingDate: new Date(newDate).toISOString() });
            setRescheduleId(null);
            setNewDate('');
            fetchBookings();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Đổi lịch thất bại.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = async (id: string, name: string) => {
        if (!confirm(`Hủy booking "${name}"?`)) return;
        try {
            await bookingApi.cancel(id);
            fetchBookings();
        } catch {
            setError('Hủy booking thất bại.');
        }
    };

    const fmtDate = (d: string) => new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--color-text)' }}>Quản Lý Booking</h1>
                <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Lịch chụp ảnh và trạng thái các dự án</p>
            </header>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ position: 'relative', flex: '1 1 200px' }}>
                    <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input placeholder="Tìm tên dự án, khách hàng..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: '36px' }} />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} style={{ ...inputStyle, width: 'auto' }} />
                    <span style={{ color: 'var(--color-text-muted)' }}>→</span>
                    <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} style={{ ...inputStyle, width: 'auto' }} />
                    <button onClick={fetchBookings} style={btnSecondary}><RefreshCw size={15} /></button>
                </div>
            </div>

            {error && <div style={alertStyle}>{error} <button onClick={() => setError('')}><X size={14} /></button></div>}

            {loading ? (
                <div style={centerStyle}><Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-accent)' }} /></div>
            ) : (
                <div style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                                {['Dự án', 'Khách hàng', 'Photographer', 'Ngày chụp', 'Trạng thái', 'Thao tác'].map(h => (
                                    <th key={h} style={{ padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((b, i) => {
                                const cfg = STATUS_CONFIG[b.status] || STATUS_CONFIG.Scheduled;
                                const isActive = b.status !== 'Completed' && b.status !== 'Cancelled';
                                return (
                                    <motion.tr key={b.projectId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                                        style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.9rem' }}>{b.projectName}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{b.packageName}</div>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text)', fontSize: '0.875rem' }}>{b.clientName}</td>
                                        <td style={{ padding: '1rem 1.25rem', color: b.staffName ? 'var(--color-text)' : 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                            {b.staffName || '—'}
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text)', fontSize: '0.875rem' }}>
                                                <CalendarDays size={14} style={{ color: 'var(--color-accent)' }} />
                                                {fmtDate(b.shootingDate)}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: cfg.bg, color: cfg.color }}>
                                                {cfg.icon} {cfg.label}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            {isActive && (
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button onClick={() => { setRescheduleId(b.projectId); setNewDate(''); }} style={btnIcon} title="Đổi lịch">
                                                        <RefreshCw size={15} />
                                                    </button>
                                                    <button onClick={() => handleCancel(b.projectId, b.projectName)} style={btnIconDanger} title="Hủy">
                                                        <Ban size={15} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </motion.tr>
                                );
                            })}
                            {filtered.length === 0 && (
                                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Không có booking nào.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Reschedule Modal */}
            {rescheduleId && (
                <div style={overlayStyle} onClick={e => e.target === e.currentTarget && setRescheduleId(null)}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={modalStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontWeight: 700, color: 'var(--color-text)' }}>Đổi Lịch Chụp</h2>
                            <button onClick={() => setRescheduleId(null)} style={{ color: 'var(--color-text-muted)' }}><X size={20} /></button>
                        </div>
                        <label style={labelStyle}>Ngày chụp mới *</label>
                        <input type="datetime-local" value={newDate} onChange={e => setNewDate(e.target.value)} style={{ ...inputStyle, marginBottom: '1.25rem' }} />
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button onClick={handleReschedule} disabled={!newDate || saving} style={{ ...btnPrimary, flex: 1, justifyContent: 'center' }}>
                                {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <RefreshCw size={16} />} Xác Nhận
                            </button>
                            <button onClick={() => setRescheduleId(null)} style={btnSecondary}>Huỷ</button>
                        </div>
                    </motion.div>
                </div>
            )}

            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
    );
};

const btnPrimary: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)', padding: '0.6rem 1.25rem', fontSize: '0.875rem', fontWeight: 600, borderRadius: '6px', cursor: 'pointer', border: 'none' };
const btnSecondary: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'transparent', color: 'var(--color-text-muted)', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500, borderRadius: '6px', cursor: 'pointer', border: '1px solid var(--color-border)' };
const btnIcon: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-muted)' };
const btnIconDanger: React.CSSProperties = { ...btnIcon, border: 'none', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' };
const alertStyle: React.CSSProperties = { backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const centerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem' };
const overlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalStyle: React.CSSProperties = { backgroundColor: 'var(--color-bg-secondary)', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '440px', border: '1px solid var(--color-border)' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.7rem 0.9rem', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text)', fontSize: '0.9rem', boxSizing: 'border-box' };

export default AdminBookings;
