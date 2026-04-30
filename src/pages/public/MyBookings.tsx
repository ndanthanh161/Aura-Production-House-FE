import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Clock, CheckCircle2, XCircle, AlertCircle,
    ChevronRight, ChevronLeft, CalendarDays, Loader2, X,
    ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { projectApi } from '../../services/projectApi';
import { useAuth } from '../../context/AuthContext';
import type { Project, ProjectStatus } from '../../types/project.types';
import { Button } from '../../components/ui/Button';

const MyBookings: React.FC = () => {
    const { user, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Reschedule state
    const [rescheduleTarget, setRescheduleTarget] = useState<Project | null>(null);
    const [newDate, setNewDate] = useState('');
    const [checkingSlot, setCheckingSlot] = useState(false);
    const [slotAvailable, setSlotAvailable] = useState<boolean | null>(null);
    const [rescheduling, setRescheduling] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    useEffect(() => {
        if (user) {
            fetchBookings();
        } else if (!authLoading) {
            setLoading(false);
        }
    }, [user, authLoading]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await projectApi.getSchedules();
            if (res.succeeded && res.data) {
                // Sort by date descending
                setBookings(res.data.sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime()));
            } else if (!res.succeeded) {
                setError(res.message || 'Không thể tải danh sách lịch hẹn.');
            }
        } catch (err) {
            setError('Đã có lỗi kết nối đến máy chủ.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (projectId: string) => {
        if (!window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) return;
        try {
            const res = await projectApi.cancel(projectId);
            if (res.succeeded) {
                alert('Hủy lịch thành công.');
                fetchBookings();
            } else {
                alert(res.message || 'Hủy lịch thất bại.');
            }
        } catch (err) {
            alert('Đã có lỗi xảy ra.');
        }
    };

    const checkSlotAvailability = async (date: string) => {
        if (!date) return;
        setCheckingSlot(true);
        setSlotAvailable(null);
        try {
            const res = await projectApi.checkSlot(date);
            setSlotAvailable(res.data?.isAvailable ?? false);
        } catch (err) {
            setSlotAvailable(false);
        } finally {
            setCheckingSlot(false);
        }
    };

    const handleReschedule = async () => {
        if (!rescheduleTarget || !newDate || !slotAvailable) return;
        setRescheduling(true);
        try {
            const res = await projectApi.reschedule({
                projectId: rescheduleTarget.id,
                newShootingDate: newDate
            });
            if (res.succeeded) {
                alert('Đổi lịch thành công.');
                setRescheduleTarget(null);
                setNewDate('');
                setSlotAvailable(null);
                fetchBookings();
            } else {
                alert(res.message || 'Đổi lịch thất bại.');
            }
        } catch (err) {
            alert('Đã có lỗi xảy ra.');
        } finally {
            setRescheduling(false);
        }
    };

    const getStatusStyle = (status: ProjectStatus) => {
        switch (status) {
            case 'Scheduled': return { color: '#ADFF00' };
            case 'InProduction': return { color: '#3b82f6' };
            case 'Completed': return { color: '#10b981' };
            case 'Cancelled': return { color: '#ef4444' };
            default: return { color: '#94a3b8' };
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatMoney = (amount: number) => {
        if (amount === undefined || amount === null) return '—';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    return (
        <div style={{
            paddingTop: '160px',
            paddingBottom: '100px',
            minHeight: '100vh',
            backgroundColor: 'var(--color-bg)',
            backgroundImage: 'radial-gradient(circle at top right, rgba(7, 31, 217, 0.03), transparent), radial-gradient(circle at bottom left, rgba(173, 255, 0, 0.02), transparent)'
        }} className="container">
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <header style={{ marginBottom: '5rem', position: 'relative' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span style={{
                            display: 'block',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            letterSpacing: '0.3em',
                            textTransform: 'uppercase',
                            color: 'var(--color-accent)',
                            marginBottom: '1rem'
                        }}>
                            Dashboard — Thành viên
                        </span>
                        <h1 style={{
                            fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                            lineHeight: 1,
                            margin: 0,
                            fontFamily: 'var(--font-display)',
                            textTransform: 'none',
                            letterSpacing: 'var(--ls-tight)',
                            fontWeight: 200
                        }}>
                            Dự án <span style={{ fontWeight: 900 }}>của tôi</span>
                        </h1>
                    </motion.div>
                </header>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ padding: '8rem', textAlign: 'center' }}
                        >
                            <Loader2 size={48} className="animate-spin" style={{ color: 'var(--color-accent)', margin: '0 auto' }} />
                        </motion.div>
                    ) : error ? (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                padding: '4rem',
                                backgroundColor: 'rgba(239, 68, 68, 0.02)',
                                borderRadius: '32px',
                                textAlign: 'center',
                                border: '1px solid rgba(239, 68, 68, 0.1)',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            <AlertCircle size={48} style={{ color: '#ef4444', marginBottom: '1.5rem', opacity: 0.5 }} />
                            <p style={{ color: '#ef4444', fontSize: '1.1rem', marginBottom: '2rem' }}>{error}</p>
                            <Button onClick={fetchBookings} variant="outline">Thử lại</Button>
                        </motion.div>
                    ) : !user ? (
                        <motion.div
                            key="unauthorized"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                padding: '6rem 2rem',
                                backgroundColor: 'var(--color-bg-secondary)',
                                borderRadius: '40px',
                                textAlign: 'center',
                                border: '1px solid var(--color-border)',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.02)'
                            }}
                        >
                            <div style={{
                                width: '80px', height: '80px', borderRadius: '50%',
                                backgroundColor: 'rgba(15, 15, 15, 0.03)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 2rem'
                            }}>
                                <AlertCircle size={32} style={{ color: 'var(--color-text-muted)' }} />
                            </div>
                            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-display)', fontWeight: 900 }}>Truy cập bị hạn chế</h2>
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem', maxWidth: '400px', margin: '0 auto 2.5rem' }}>
                                Bạn cần đăng nhập tài khoản Aura để có thể xem và quản lý các lịch chụp của mình.
                            </p>
                            <Button size="lg" onClick={() => navigate('/login')} style={{ borderRadius: '0', padding: '1.25rem 3rem' }}>
                                Đăng nhập ngay
                            </Button>
                        </motion.div>
                    ) : bookings.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                padding: '6rem 2rem',
                                backgroundColor: 'var(--color-bg-secondary)',
                                borderRadius: '40px',
                                textAlign: 'center',
                                border: '1px dashed var(--color-border)',
                            }}
                        >
                            <CalendarDays size={64} style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', opacity: 0.2 }} />
                            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-display)', fontWeight: 900 }}>Chưa có dự án nào</h2>
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem', maxWidth: '450px', margin: '0 auto 2.5rem' }}>
                                Hãy bắt đầu hành trình sáng tạo của bạn bằng cách lựa chọn một gói dịch vụ phù hợp.
                            </p>
                            <Button size="lg" onClick={() => navigate('/packages')} style={{ borderRadius: '0', padding: '1.25rem 3rem' }}>
                                Khám phá các gói dịch vụ
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ display: 'grid', gap: '2rem' }}
                        >
                            {bookings.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((booking, index) => {
                                const style = getStatusStyle(booking.status);
                                return (
                                    <motion.div
                                        key={booking.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                        style={{
                                            backgroundColor: 'var(--color-bg-secondary)',
                                            border: '1px solid var(--color-border)',
                                            borderRadius: '32px',
                                            padding: '2.5rem',
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            alignItems: 'center',
                                            gap: '2.5rem',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            transition: 'var(--transition-cinematic)'
                                        }}
                                        whileHover={{
                                            borderColor: 'var(--color-accent)',
                                            boxShadow: '0 30px 60px rgba(7, 31, 217, 0.05)',
                                            y: -8
                                        }}
                                    >
                                        <div style={{ flex: '1', minWidth: '300px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1.5rem' }}>
                                                <span style={{
                                                    fontSize: '0.65rem',
                                                    fontWeight: 800,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.15em',
                                                    color: style.color,
                                                    display: 'inline-flex',
                                                    alignItems: 'center'
                                                }}>
                                                    {booking.status === 'Scheduled' ? 'Đã lên lịch' :
                                                        booking.status === 'InProduction' ? 'Đang thực hiện' :
                                                            booking.status === 'Completed' ? 'Hoàn thành' :
                                                                booking.status === 'Cancelled' ? 'Đã hủy' : booking.status}
                                                </span>
                                                <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--color-border)' }} />
                                                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                                                    REF: {booking.id.slice(0, 8).toUpperCase()}
                                                </span>
                                            </div>

                                            <h3 style={{
                                                fontSize: '2rem',
                                                fontFamily: 'var(--font-sans)',
                                                fontWeight: 800,
                                                marginBottom: '1rem',
                                                letterSpacing: 'var(--ls-tight)',
                                                textTransform: 'none'
                                            }}>
                                                {booking.name}
                                            </h3>

                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

                                                    <div>
                                                        <span style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, opacity: 0.5, letterSpacing: '0.1em' }}>Dự kiến hoàn thành</span>
                                                        <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{formatDate(booking.deadline)}</span>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div>
                                                        <span style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, opacity: 0.5, letterSpacing: '0.1em' }}>Gói dịch vụ</span>
                                                        <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{booking.packageName}</span>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

                                                    <div>
                                                        <span style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, opacity: 0.5, letterSpacing: '0.1em' }}>Tiền cọc</span>
                                                        <span style={{ fontWeight: 600, color: 'var(--color-accent)' }}>{formatMoney(booking.deposit)}</span>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

                                                    <div>
                                                        <span style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, opacity: 0.5, letterSpacing: '0.1em' }}>Giá gói</span>
                                                        <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{formatMoney(booking.revenue)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <Button
                                                variant="ghost"
                                                onClick={() => {
                                                    if (booking.resultLink) {
                                                        window.open(booking.resultLink, '_blank');
                                                    } else {
                                                        navigate('/portfolio');
                                                    }
                                                }}
                                                style={{ gap: '10px' }}
                                            >
                                                {booking.resultLink ? 'Xem sản phẩm' : 'Xem chi tiết'} <ArrowRight size={18} />
                                            </Button>
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {/* Pagination Controls */}
                            {bookings.length > ITEMS_PER_PAGE && (
                                <div style={{
                                    marginTop: '5rem',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '1rem'
                                }}>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        style={{
                                            width: '50px', height: '50px',
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--color-bg-secondary)',
                                            border: '1px solid var(--color-border)',
                                            color: currentPage === 1 ? 'var(--color-text-muted)' : 'var(--color-text)',
                                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'var(--transition-cinematic)',
                                            opacity: currentPage === 1 ? 0.3 : 1
                                        }}
                                    >
                                        <ChevronLeft size={24} />
                                    </button>

                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        {Array.from({ length: Math.ceil(bookings.length / ITEMS_PER_PAGE) }).map((_, idx) => {
                                            const pageNum = idx + 1;
                                            const isActive = currentPage === pageNum;
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    style={{
                                                        width: '50px', height: '50px',
                                                        borderRadius: '50%',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '0.85rem', fontWeight: 800,
                                                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                                        backgroundColor: isActive ? 'var(--color-accent)' : 'transparent',
                                                        border: `1px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border)'}`,
                                                        color: isActive ? 'white' : 'var(--color-text)',
                                                        cursor: 'pointer',
                                                        transform: isActive ? 'scale(1.1)' : 'scale(1)'
                                                    }}
                                                >
                                                    {pageNum.toString().padStart(2, '0')}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(Math.ceil(bookings.length / ITEMS_PER_PAGE), prev + 1))}
                                        disabled={currentPage === Math.ceil(bookings.length / ITEMS_PER_PAGE)}
                                        style={{
                                            width: '50px', height: '50px',
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--color-bg-secondary)',
                                            border: '1px solid var(--color-border)',
                                            color: currentPage === Math.ceil(bookings.length / ITEMS_PER_PAGE) ? 'var(--color-text-muted)' : 'var(--color-text)',
                                            cursor: currentPage === Math.ceil(bookings.length / ITEMS_PER_PAGE) ? 'not-allowed' : 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'var(--transition-cinematic)',
                                            opacity: currentPage === Math.ceil(bookings.length / ITEMS_PER_PAGE) ? 0.3 : 1
                                        }}
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Reschedule Modal */}
            <AnimatePresence>
                {rescheduleTarget && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                        padding: '1rem'
                    }}>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            style={{
                                backgroundColor: 'var(--color-bg)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '40px',
                                padding: '4rem',
                                maxWidth: '600px',
                                width: '100%',
                                position: 'relative',
                                boxShadow: '0 50px 100px rgba(0,0,0,0.5)'
                            }}
                        >
                            <button
                                onClick={() => { setRescheduleTarget(null); setSlotAvailable(null); }}
                                style={{
                                    position: 'absolute', right: '2rem', top: '2rem',
                                    background: 'rgba(255,255,255,0.05)', border: 'none',
                                    color: 'white', cursor: 'pointer',
                                    width: '40px', height: '40px', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            >
                                <X size={20} />
                            </button>

                            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', fontFamily: 'var(--font-display)', letterSpacing: 'var(--ls-tight)' }}>Đổi lịch dự án</h2>
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '3rem', lineHeight: 1.6 }}>
                                Bạn đang thực hiện thay đổi ngày chụp cho dự án <strong style={{ color: 'var(--color-text)' }}>{rescheduleTarget.name}</strong>. Vui lòng chọn một ngày còn trống bên dưới.
                            </p>

                            <div style={{ marginBottom: '3rem' }}>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '1rem', letterSpacing: '0.2em' }}>
                                    Chọn ngày mới
                                </label>
                                <input
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={newDate}
                                    onChange={(e) => {
                                        setNewDate(e.target.value);
                                        checkSlotAvailability(e.target.value);
                                    }}
                                    style={{
                                        width: '100%', padding: '1.5rem',
                                        backgroundColor: 'rgba(15, 15, 15, 0.03)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: '16px', color: 'var(--color-text)',
                                        outline: 'none', fontSize: '1.1rem',
                                        fontFamily: 'var(--font-sans)',
                                        transition: 'all 0.3s ease'
                                    }}
                                />

                                <div style={{ marginTop: '1.5rem', minHeight: '2rem' }}>
                                    {checkingSlot && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                            <Loader2 size={16} className="animate-spin" /> Đang kiểm tra hệ thống...
                                        </div>
                                    )}
                                    {slotAvailable === true && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            style={{ color: 'var(--color-neon)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
                                        >
                                            <CheckCircle2 size={16} /> Lịch chụp khả dụng. Bạn có thể tiếp tục.
                                        </motion.div>
                                    )}
                                    {slotAvailable === false && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            style={{ color: '#ef4444', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
                                        >
                                            <XCircle size={16} /> Rất tiếc, ngày này đã kín lịch. Vui lòng chọn ngày khác.
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <Button
                                    variant="outline"
                                    style={{ flex: 1, borderRadius: '0' }}
                                    onClick={() => { setRescheduleTarget(null); setSlotAvailable(null); }}
                                >
                                    Hủy bỏ
                                </Button>
                                <Button
                                    style={{ flex: 2, borderRadius: '0' }}
                                    disabled={!slotAvailable || rescheduling}
                                    onClick={handleReschedule}
                                >
                                    {rescheduling ? 'Đang cập nhật...' : 'Xác nhận thay đổi'}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                
                input[type="date"]::-webkit-calendar-picker-indicator {
                    filter: invert(var(--color-bg) === '#000' ? 1 : 0);
                    cursor: pointer;
                    opacity: 0.5;
                    transition: all 0.3s ease;
                }
                input[type="date"]::-webkit-calendar-picker-indicator:hover {
                    opacity: 1;
                }
            `}</style>
        </div>
    );
};

export default MyBookings;
