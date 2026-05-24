import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight, ChevronLeft, CalendarDays, Loader2, X,
    ArrowRight, CreditCard, AlertCircle, CheckCircle2, XCircle,
    Lock, Eye, Download, FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { projectApi } from '../../services/projectApi';
import { documentTemplateApi } from '../../services/documentTemplateApi';
import { useAuth } from '../../context/AuthContext';
import type { Project, ProjectStatus } from '../../types/project.types';
import type { DocumentTemplate } from '../../types/documentTemplate.types';
import { Button } from '../../components/ui/Button';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { useToast } from '../../components/ui/Toast';

const MyBookings: React.FC = () => {
    const { showToast, ToastContainer } = useToast();
    const { user, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();

    // ─── Active Tab State ──────────────────────────────────────────
    const [activeTab, setActiveTab] = useState<'bookings' | 'templates'>('bookings');

    // ─── Bookings State ────────────────────────────────────────────
    const [bookings, setBookings] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Reschedule state
    const [rescheduleTarget, setRescheduleTarget] = useState<Project | null>(null);
    const [newDate, setNewDate] = useState('');
    const [checkingSlot, setCheckingSlot] = useState(false);
    const [slotAvailable, setSlotAvailable] = useState<boolean | null>(null);
    const [rescheduling, setRescheduling] = useState(false);

    // Details Modal state
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    // Cancellation state
    const [cancelModal, setCancelModal] = useState<{ isOpen: boolean; projectId: string | null }>({
        isOpen: false,
        projectId: null
    });

    // ─── Templates State ───────────────────────────────────────────
    const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
    const [templatesLoading, setTemplatesLoading] = useState(false);
    const [templatesError, setTemplatesError] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);

    // Check VIP Access: users with active VIP status or Admins/Photographers
    const isVipOrStaff = user?.isVip === true || user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'photographer';

    // ─── Fetch Data ────────────────────────────────────────────────
    useEffect(() => {
        if (user) {
            if (activeTab === 'bookings') {
                fetchBookings();
            } else {
                fetchTemplates();
            }
        } else if (!authLoading) {
            setLoading(false);
        }
    }, [user, authLoading, activeTab]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await projectApi.getSchedules();
            if (res.succeeded && res.data) {
                // Sort by creation date descending
                setBookings(res.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
            } else if (!res.succeeded) {
                setError(res.message || 'Không thể tải danh sách lịch hẹn.');
            }
        } catch (err) {
            setError('Đã có lỗi kết nối đến máy chủ.');
        } finally {
            setLoading(false);
        }
    };

    const fetchTemplates = async () => {
        setTemplatesLoading(true);
        setTemplatesError('');
        try {
            const res = await documentTemplateApi.getAll();
            if (res.succeeded && res.data) {
                setTemplates(res.data);
            } else {
                setTemplatesError(res.message || 'Không thể tải danh sách tài liệu.');
            }
        } catch {
            setTemplatesError('Đã xảy ra lỗi kết nối đến máy chủ.');
        } finally {
            setTemplatesLoading(false);
        }
    };

    // ─── Bookings Logic ────────────────────────────────────────────
    const handleCancel = async () => {
        if (!cancelModal.projectId) return;
        const projectId = cancelModal.projectId;
        try {
            const res = await projectApi.cancel(projectId);
            if (res.succeeded) {
                showToast('Hủy lịch thành công.', 'success');
                setCancelModal({ isOpen: false, projectId: null });
                fetchBookings();
                setSelectedProject(null);
            } else {
                showToast(res.message || 'Hủy lịch thất bại.', 'error');
            }
        } catch (err) {
            showToast('Đã có lỗi xảy ra.', 'error');
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
                showToast('Đổi lịch thành công.', 'success');
                setRescheduleTarget(null);
                setNewDate('');
                setSlotAvailable(null);
                fetchBookings();
            } else {
                showToast(res.message || 'Đổi lịch thất bại.', 'error');
            }
        } catch (err) {
            showToast('Đã có lỗi xảy ra.', 'error');
        } finally {
            setRescheduling(false);
        }
    };

    const getStatusInfo = (status: ProjectStatus) => {
        switch (status) {
            case 'Scheduled': return { color: '#ADFF00', label: 'Chờ thanh toán', desc: 'Đã lên lịch, vui lòng hoàn tất thanh toán để triển khai.' };
            case 'InProduction': return { color: '#3b82f6', label: 'Đang sản xuất', desc: 'Đội ngũ AURA đang trong quá trình ghi hình và hậu kỳ.' };
            case 'Completed': return { color: '#10b981', label: 'Hoàn thành', desc: 'Dự án đã kết thúc và bàn giao sản phẩm thành công.' };
            case 'Cancelled': return { color: '#ef4444', label: 'Đã hủy', desc: 'Dự án đã được hủy theo yêu cầu hoặc quá hạn.' };
            default: return { color: '#94a3b8', label: status, desc: '' };
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
                <header style={{ marginBottom: '3rem', position: 'relative' }}>
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
                            Thành viên — Dashboard
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
                            {activeTab === 'bookings' ? (
                                <>Dự án <span style={{ fontWeight: 900 }}>của tôi</span></>
                            ) : (
                                <>Kho tài liệu</>
                            )}
                        </h1>
                    </motion.div>
                </header>

                {/* Cinematic Tab Switcher */}
                <div style={{
                    display: 'flex',
                    borderBottom: '1px solid var(--color-border)',
                    marginBottom: '3rem',
                    gap: '2.5rem',
                    paddingBottom: '2px'
                }}>
                    <button
                        onClick={() => setActiveTab('bookings')}
                        style={{
                            padding: '1rem 0',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            letterSpacing: '0.05em',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: activeTab === 'bookings' ? 'var(--color-text)' : 'var(--color-text-muted)',
                            cursor: 'pointer',
                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                            fontFamily: 'var(--font-sans)',
                            position: 'relative'
                        }}
                    >
                        Dự Án Của Tôi
                        {activeTab === 'bookings' && (
                            <motion.div layoutId="activeTabUnderline" style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 3, backgroundColor: 'var(--color-accent)' }} />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('templates')}
                        style={{
                            padding: '1rem 0',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            letterSpacing: '0.05em',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: activeTab === 'templates' ? 'var(--color-text)' : 'var(--color-text-muted)',
                            cursor: 'pointer',
                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                            fontFamily: 'var(--font-sans)',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        Kho Tài Liệu
                        {activeTab === 'templates' && (
                            <motion.div layoutId="activeTabUnderline" style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 3, backgroundColor: 'var(--color-accent)' }} />
                        )}
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'bookings' ? (
                        /* ==================== 1. BOOKINGS LIST ==================== */
                        loading ? (
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
                                    const statusInfo = getStatusInfo(booking.status);
                                    return (
                                        <motion.div
                                            key={booking.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                            className="booking-card"
                                            style={{
                                                backgroundColor: 'var(--color-bg-secondary)',
                                                border: '1px solid var(--color-border)',
                                                borderRadius: '32px',
                                                padding: '2rem 2.5rem',
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
                                                        color: statusInfo.color,
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        backgroundColor: `${statusInfo.color}15`,
                                                        padding: '4px 12px',
                                                        borderRadius: '100px'
                                                    }}>
                                                        {statusInfo.label}
                                                    </span>
                                                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--color-border)' }} />
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                                                        {formatDate(booking.createdAt)}
                                                    </span>
                                                </div>

                                                <h3 style={{
                                                    fontSize: '1.75rem',
                                                    fontFamily: 'var(--font-sans)',
                                                    fontWeight: 800,
                                                    marginBottom: '1rem',
                                                    letterSpacing: 'var(--ls-tight)',
                                                    textTransform: 'none'
                                                }}>
                                                    {booking.name}
                                                </h3>

                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                                                    <div>
                                                        <span style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, opacity: 0.5, letterSpacing: '0.1em', marginBottom: '4px' }}>Dự kiến</span>
                                                        <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{formatDate(booking.deadline)}</span>
                                                    </div>
                                                    <div>
                                                        <span style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, opacity: 0.5, letterSpacing: '0.1em', marginBottom: '4px' }}>Gói dịch vụ</span>
                                                        <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{booking.packageName}</span>
                                                    </div>
                                                    <div>
                                                        <span style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, opacity: 0.5, letterSpacing: '0.1em', marginBottom: '4px' }}>Ngân sách</span>
                                                        <span style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{formatMoney(booking.revenue)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="booking-card-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                {booking.status === 'Scheduled' && (
                                                    <Button
                                                        onClick={() => navigate(`/purchase/${booking.packageId}?projectId=${booking.id}`)}
                                                        style={{
                                                            backgroundColor: 'var(--color-accent)',
                                                            color: 'var(--color-bg)',
                                                            fontWeight: 800,
                                                            gap: '8px'
                                                        }}
                                                    >
                                                        <CreditCard size={18} /> Thanh toán
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => setSelectedProject(booking)}
                                                    style={{ gap: '10px' }}
                                                >
                                                    Chi tiết <ArrowRight size={18} />
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
                        )
                    ) : (
                        /* ==================== 2. VIP DOCUMENTS LIBRARY ==================== */
                        templatesLoading ? (
                            <motion.div
                                key="templates-loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{ padding: '8rem', textAlign: 'center' }}
                            >
                                <Loader2 size={48} className="animate-spin" style={{ color: 'var(--color-accent)', margin: '0 auto' }} />
                            </motion.div>
                        ) : templatesError ? (
                            <motion.div
                                key="templates-error"
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
                                <p style={{ color: '#ef4444', fontSize: '1.1rem', marginBottom: '2rem' }}>{templatesError}</p>
                                <Button onClick={fetchTemplates} variant="outline">Thử lại</Button>
                            </motion.div>
                        ) : !isVipOrStaff ? (
                            <motion.div
                                key="templates-locked"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '5rem 2rem',
                                    backgroundColor: 'var(--color-bg-secondary)',
                                    borderRadius: '32px',
                                    border: '1px solid var(--color-border)',
                                    textAlign: 'center',
                                    maxWidth: '680px',
                                    margin: '2rem auto',
                                    backgroundImage: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.04), transparent)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <div style={{
                                    position: 'absolute',
                                    width: '250px',
                                    height: '250px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(212, 175, 55, 0.02)',
                                    filter: 'blur(50px)',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 1
                                }} />

                                <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <motion.div
                                        style={{
                                            width: '80px', height: '80px', borderRadius: '50%',
                                            backgroundColor: 'rgba(212, 175, 55, 0.12)',
                                            border: '1px solid rgba(212, 175, 55, 0.4)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: '#D4AF37', marginBottom: '2rem',
                                            boxShadow: '0 0 30px rgba(212, 175, 55, 0.2)',
                                            cursor: 'pointer'
                                        }}
                                        whileHover={{ scale: 1.15, rotate: [0, -10, 10, -10, 10, 0] }}
                                        transition={{ duration: 0.5 }}
                                        onClick={() => navigate('/packages')}
                                    >
                                        <Lock size={36} />
                                    </motion.div>

                                    <h2 style={{
                                        fontSize: '1.85rem',
                                        fontFamily: 'var(--font-display)',
                                        fontWeight: 900,
                                        color: '#D4AF37',
                                        marginBottom: '1rem',
                                        letterSpacing: '0.05em',
                                        textTransform: 'uppercase'
                                    }}>
                                        ĐẶC QUYỀN HỘI VIÊN
                                    </h2>

                                    <p style={{
                                        color: 'var(--color-text-muted)',
                                        fontSize: '1rem',
                                        lineHeight: 1.7,
                                        maxWidth: '480px',
                                        marginBottom: '2.75rem',
                                        margin: '0 auto 2.75rem'
                                    }}>
                                        Kho kịch bản concept độc quyền, hợp đồng dịch vụ chuẩn studio AURA và các tài nguyên biểu mẫu cao cấp chỉ dành riêng cho hội viên.
                                    </p>

                                    <Button
                                        onClick={() => navigate('/packages')}
                                        style={{
                                            padding: '0 3rem',
                                            height: '54px',
                                            background: 'linear-gradient(135deg, #CF9F2E 0%, #D4AF37 50%, #F3E5AB 100%)',
                                            color: 'black',
                                            fontWeight: 800,
                                            fontSize: '0.9rem',
                                            letterSpacing: '0.05em',
                                            gap: '8px',
                                            borderRadius: '8px',
                                            boxShadow: '0 8px 24px rgba(212,175,55,0.25)',
                                            border: 'none',
                                        }}
                                    >
                                        <Lock size={16} /> THANH TOÁN 1 GÓI BẤT KỲ ĐỂ TRỞ THÀNH HỘI VIÊN
                                    </Button>
                                </div>
                            </motion.div>
                        ) : templates.length === 0 ? (
                            <motion.div
                                key="templates-empty"
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
                                <FileText size={64} style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', opacity: 0.2 }} />
                                <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-display)', fontWeight: 900 }}>Thư viện trống</h2>
                                <p style={{ color: 'var(--color-text-muted)', maxWidth: '450px', margin: '0 auto' }}>
                                    Hệ thống chưa đăng tải tài liệu VIP nào. Vui lòng quay lại sau!
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="templates-list"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}
                            >
                                {templates.map((tmpl, index) => {
                                    const isPdf = tmpl.fileType?.toLowerCase() === '.pdf';
                                    return (
                                        <motion.div
                                            key={tmpl.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                            style={{
                                                backgroundColor: 'var(--color-bg-secondary)',
                                                border: '1px solid var(--color-border)',
                                                borderRadius: '32px',
                                                padding: '2.25rem',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '1.25rem',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                            }}
                                            whileHover={{
                                                borderColor: 'var(--color-accent)',
                                                boxShadow: '0 30px 60px rgba(7, 31, 217, 0.05)',
                                                y: -8
                                            }}
                                        >
                                            {/* Header */}
                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                <div style={{
                                                    width: '48px',
                                                    height: '48px',
                                                    borderRadius: '16px',
                                                    backgroundColor: isPdf ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: isPdf ? '#ef4444' : '#3b82f6',
                                                    flexShrink: 0
                                                }}>
                                                    <FileText size={24} />
                                                </div>
                                                <div>
                                                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
                                                        {tmpl.title}
                                                    </h3>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                                                        {isPdf ? 'Tài liệu PDF' : 'Biểu mẫu Word'}
                                                    </span>
                                                </div>
                                            </div>

                                            {tmpl.description && (
                                                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6, minHeight: '3.5rem', margin: 0 }}>
                                                    {tmpl.description}
                                                </p>
                                            )}

                                            {/* Actions */}
                                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', zIndex: 3 }}>
                                                <Button
                                                    onClick={() => setSelectedTemplate(tmpl)}
                                                    style={{ flex: 1, height: '48px', fontSize: '0.85rem', fontWeight: 800, gap: '6px' }}
                                                >
                                                    <Eye size={16} /> Xem trực tuyến
                                                </Button>
                                                <button
                                                    onClick={() => window.open(tmpl.fileUrl, '_blank')}
                                                    style={{
                                                        width: '48px', height: '48px', borderRadius: '12px',
                                                        border: '1px solid var(--color-border)',
                                                        backgroundColor: 'rgba(255,255,255,0.02)',
                                                        color: 'var(--color-text)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        cursor: 'pointer', transition: 'all 0.3s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'var(--color-accent)';
                                                        e.currentTarget.style.color = 'white';
                                                        e.currentTarget.style.borderColor = 'var(--color-accent)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                                                        e.currentTarget.style.color = 'var(--color-text)';
                                                        e.currentTarget.style.borderColor = 'var(--color-border)';
                                                    }}
                                                >
                                                    <Download size={18} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )
                    )}
                </AnimatePresence>
            </div>

            {/* Project Details Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                            padding: '1.5rem'
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            style={{
                                backgroundColor: 'var(--color-bg)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '40px',
                                maxWidth: '800px',
                                width: '100%',
                                maxHeight: '90vh',
                                position: 'relative',
                                boxShadow: '0 50px 100px rgba(0,0,0,0.5)',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden' // Clip the inner scroll
                            }}
                        >
                            {/* Fixed Close Button */}
                            <button
                                onClick={() => setSelectedProject(null)}
                                style={{
                                    position: 'absolute', right: '1.5rem', top: '1.5rem',
                                    background: 'var(--color-bg-secondary)',
                                    border: '1px solid var(--color-border)',
                                    color: 'var(--color-text)',
                                    cursor: 'pointer',
                                    width: '44px', height: '44px', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                    zIndex: 100,
                                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--color-accent)';
                                    e.currentTarget.style.color = 'white';
                                    e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--color-bg-secondary)';
                                    e.currentTarget.style.color = 'var(--color-text)';
                                    e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
                                }}
                            >
                                <X size={24} />
                            </button>

                            {/* Scrollable Content */}
                            <div className="booking-modal-body" style={{
                                padding: 'clamp(2rem, 5vw, 4rem) clamp(1.25rem, 5vw, 3.5rem) 2.5rem',
                                overflowY: 'auto',
                                width: '100%'
                            }}>
                                <div style={{ marginBottom: '3rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                                        <span style={{
                                            color: getStatusInfo(selectedProject.status).color,
                                            fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em'
                                        }}>
                                            {getStatusInfo(selectedProject.status).label}
                                        </span>
                                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>•</span>
                                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>REF: {selectedProject.id.toUpperCase()}</span>
                                    </div>
                                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', fontFamily: 'var(--font-display)', letterSpacing: 'var(--ls-tight)' }}>
                                        {selectedProject.name}
                                    </h2>
                                    <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, fontSize: '1.1rem' }}>
                                        {getStatusInfo(selectedProject.status).desc}
                                    </p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                                    <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--color-border)' }}>
                                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem', opacity: 0.5 }}>Ngày đăng ký</div>
                                        <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{formatDate(selectedProject.createdAt)}</div>
                                    </div>
                                    <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--color-border)' }}>
                                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem', opacity: 0.5 }}>Hạn hoàn thành</div>
                                        <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{formatDate(selectedProject.deadline)}</div>
                                    </div>
                                    <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--color-border)' }}>
                                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem', opacity: 0.5 }}>Tổng ngân sách</div>
                                        <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-accent)' }}>{formatMoney(selectedProject.revenue)}</div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '3rem' }}>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>Chi tiết gói: {selectedProject.packageName}</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        {selectedProject.benefits?.map((benefit, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-accent)' }} />
                                                {benefit}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {selectedProject.description && (
                                    <div style={{ marginBottom: '3rem', padding: '1.5rem', backgroundColor: 'rgba(173, 255, 0, 0.03)', borderRadius: '20px', borderLeft: '4px solid var(--color-accent)' }}>
                                        <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Ghi chú từ khách hàng:</h4>
                                        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-text)', fontStyle: 'italic' }}>"{selectedProject.description}"</p>
                                    </div>
                                )}

                                <div className="booking-modal-actions" style={{ display: 'flex', gap: '1.5rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
                                    {selectedProject.status === 'Scheduled' && (
                                        <>
                                            <Button
                                                onClick={() => navigate(`/purchase/${selectedProject.packageId}?projectId=${selectedProject.id}`)}
                                                style={{ flex: 1, height: '60px' }}
                                            >
                                                <CreditCard size={18} style={{ marginRight: '8px' }} /> Tiến hành thanh toán
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setCancelModal({ isOpen: true, projectId: selectedProject.id })}
                                                style={{ borderColor: '#ef4444', color: '#ef4444', height: '60px' }}
                                            >
                                                Hủy dự án
                                            </Button>
                                        </>
                                    )}
                                    {selectedProject.resultLink && (
                                        <Button
                                            onClick={() => window.open(selectedProject.resultLink, '_blank')}
                                            style={{ flex: 1, height: '60px' }}
                                        >
                                            Xem thành phẩm <ChevronRight size={18} style={{ marginLeft: '8px' }} />
                                        </Button>
                                    )}
                                    {selectedProject.status === 'InProduction' && !selectedProject.resultLink && (
                                        <div style={{ flex: 1, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                            Dự án đang trong quá trình thực hiện. Chúng tôi sẽ cập nhật sản phẩm sớm nhất.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Reschedule Modal */}
            <AnimatePresence>
                {rescheduleTarget && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                            padding: '1rem'
                        }}
                    >
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
                                    position: 'absolute', right: '1.5rem', top: '1.5rem',
                                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white', cursor: 'pointer',
                                    width: '44px', height: '44px', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                    zIndex: 10
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--color-accent)';
                                    e.currentTarget.style.transform = 'rotate(90deg)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                    e.currentTarget.style.transform = 'rotate(0deg)';
                                }}
                            >
                                <X size={24} />
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
                                            style={{ color: '#ADFF00', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
                                        >
                                            <CheckCircle2 size={16} /> Ngày này hiện còn trống! Bạn có thể đặt lịch.
                                        </motion.div>
                                    )}
                                    {slotAvailable === false && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            style={{ color: '#ef4444', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
                                        >
                                            <XCircle size={16} /> Studio đã kín lịch vào ngày này. Vui lòng chọn một ngày khác!
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <Button
                                    disabled={!slotAvailable || rescheduling}
                                    onClick={handleReschedule}
                                    style={{ flex: 1, height: '60px' }}
                                >
                                    {rescheduling ? 'Đang cập nhật...' : 'Xác nhận thay đổi'}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Template Online Viewer Modal */}
            <AnimatePresence>
                {selectedTemplate && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
                            padding: '1rem'
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            style={{
                                backgroundColor: 'var(--color-bg)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '32px',
                                maxWidth: '1000px',
                                width: '100%',
                                height: '90vh',
                                position: 'relative',
                                boxShadow: '0 50px 100px rgba(0,0,0,0.8)',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Modal Header */}
                            <div style={{
                                padding: '1.5rem 2.25rem',
                                borderBottom: '1px solid var(--color-border)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: 'var(--color-bg-secondary)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '12px',
                                        backgroundColor: selectedTemplate.fileType?.toLowerCase() === '.pdf' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: selectedTemplate.fileType?.toLowerCase() === '.pdf' ? '#ef4444' : '#3b82f6'
                                    }}>
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
                                            {selectedTemplate.title}
                                        </h3>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                            Xem tài liệu trực tuyến — {selectedTemplate.fileType?.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedTemplate(null)}
                                    style={{
                                        background: 'var(--color-bg)',
                                        border: '1px solid var(--color-border)',
                                        color: 'var(--color-text)',
                                        cursor: 'pointer',
                                        width: '44px', height: '44px', borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'var(--color-accent)';
                                        e.currentTarget.style.color = 'white';
                                        e.currentTarget.style.transform = 'rotate(90deg)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'var(--color-bg)';
                                        e.currentTarget.style.color = 'var(--color-text)';
                                        e.currentTarget.style.transform = 'rotate(0deg)';
                                    }}
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            {/* Secure IFrame Embed */}
                            <div style={{ flex: 1, backgroundColor: '#f5f5f5', position: 'relative' }}>
                                <iframe
                                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedTemplate.fileUrl)}&embedded=true`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        border: 'none',
                                    }}
                                    title={selectedTemplate.title}
                                />
                            </div>

                            {/* Modal Footer */}
                            <div style={{
                                padding: '1.25rem 2.25rem',
                                borderTop: '1px solid var(--color-border)',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '1rem',
                                backgroundColor: 'var(--color-bg-secondary)'
                            }}>
                                <button
                                    onClick={() => window.open(selectedTemplate.fileUrl, '_blank')}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)',
                                        padding: '0.65rem 1.5rem', fontSize: '0.875rem', fontWeight: 800,
                                        borderRadius: '8px', cursor: 'pointer', border: 'none',
                                    }}
                                >
                                    <Download size={16} /> Tải tệp xuống
                                </button>
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedTemplate(null)}
                                    style={{ height: '42px', padding: '0 1.5rem', borderRadius: '8px' }}
                                >
                                    Đóng
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ConfirmModal
                isOpen={cancelModal.isOpen}
                title="Hủy lịch hẹn"
                message="Bạn có chắc chắn muốn hủy dự án này? Sau khi hủy, bạn sẽ không thể thực hiện thanh toán hoặc tiếp tục dự án."
                confirmText="Hủy lịch ngay"
                onConfirm={handleCancel}
                onCancel={() => setCancelModal({ isOpen: false, projectId: null })}
                type="danger"
            />

            <ToastContainer />

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
                
                @media (max-width: 640px) {
                    .booking-card {
                        padding: 1.5rem !important;
                        gap: 1.5rem !important;
                    }
                    .booking-card-actions {
                        width: 100% !important;
                        flex-direction: column !important;
                        align-items: stretch !important;
                    }
                    .booking-card-actions button {
                        width: 100% !important;
                    }
                    .booking-modal-actions {
                        flex-direction: column !important;
                        gap: 1rem !important;
                    }
                    .booking-modal-actions button {
                        width: 100% !important;
                        height: 50px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default MyBookings;
