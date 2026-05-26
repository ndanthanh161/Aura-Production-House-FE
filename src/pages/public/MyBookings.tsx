import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight, ChevronLeft, CalendarDays, Loader2, X,
    ArrowRight, CreditCard, AlertCircle,
    Lock, Eye, Download, FileText, ShieldAlert, ShieldCheck, Layers,
    Clock, Unlock, FileDown
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

    // Reschedule states removed

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



    const getStatusInfo = (status: ProjectStatus) => {
        switch (status) {
            case 'Scheduled': return { color: '#C09A5A', label: 'Chờ thanh toán', desc: 'Đã lên lịch, vui lòng hoàn tất thanh toán để triển khai.' };
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

    const renderProgressTracker = (status: ProjectStatus) => {
        let fillWidth = '0%';
        let activeStep = 0;
        const isCancelled = status === 'Cancelled';

        if (status === 'Scheduled') {
            fillWidth = '15%';
            activeStep = 1;
        } else if (status === 'InProduction') {
            fillWidth = '55%';
            activeStep = 2;
        } else if (status === 'Completed') {
            fillWidth = '100%';
            activeStep = 3;
        }

        const steps = [
            { label: 'LÊN LỊCH', desc: 'Secure Booking', icon: Clock },
            { label: 'SẢN XUẤT', desc: 'Shooting & Editorial', icon: Layers },
            { label: 'BÀN GIAO', desc: 'Assets Delivered', icon: ShieldCheck }
        ];

        return (
            <div style={{ position: 'relative', marginTop: '2.5rem', marginBottom: '2rem', padding: '0 10px' }}>
                {/* Progress line */}
                <div style={{
                    position: 'absolute',
                    top: '18px',
                    left: '20px',
                    right: '20px',
                    height: '2px',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    zIndex: 1
                }}>
                    <div style={{
                        width: fillWidth,
                        height: '100%',
                        background: isCancelled ? '#ef4444' : 'linear-gradient(90deg, var(--color-accent) 0%, #F3E5AB 100%)',
                        boxShadow: isCancelled ? '0 0 10px rgba(239, 68, 68, 0.5)' : '0 0 15px rgba(192, 154, 90, 0.4)',
                        transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }} />
                </div>

                {/* Steps container */}
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                    {steps.map((step, idx) => {
                        const stepNum = idx + 1;
                        const isDone = activeStep >= stepNum && !isCancelled;
                        const isActive = activeStep === stepNum && !isCancelled;
                        const StepIcon = step.icon;

                        return (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90px' }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    backgroundColor: isDone ? 'rgba(15, 15, 15, 0.95)' : 'rgba(10, 10, 10, 0.95)',
                                    border: `2px solid ${isDone ? 'var(--color-accent)' : 'rgba(255,255,255,0.08)'}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: isDone ? 'var(--color-accent)' : 'rgba(255,255,255,0.25)',
                                    boxShadow: isActive ? '0 0 20px rgba(192, 154, 90, 0.4)' : 'none',
                                    transition: 'all 0.5s ease',
                                    transform: isActive ? 'scale(1.2)' : 'scale(1)'
                                }}>
                                    <StepIcon size={15} className={isActive ? 'animate-pulse' : ''} />
                                </div>
                                <span style={{
                                    fontSize: '0.62rem',
                                    fontWeight: 800,
                                    color: isDone ? 'var(--color-text)' : 'rgba(255,255,255,0.25)',
                                    marginTop: '8px',
                                    letterSpacing: '0.05em',
                                    textAlign: 'center',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {step.label}
                                </span>
                                <span style={{
                                    fontSize: '0.52rem',
                                    color: isDone ? 'var(--color-accent)' : 'rgba(255,255,255,0.15)',
                                    marginTop: '2px',
                                    letterSpacing: '0.02em',
                                    textAlign: 'center',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {step.desc}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderShutterIris = (status: ProjectStatus) => {
        const info = getStatusInfo(status);
        return (
            <div style={{
                width: '130px',
                height: '130px',
                borderRadius: '50%',
                border: '2px solid rgba(192, 154, 90, 0.35)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                backgroundImage: 'radial-gradient(circle, rgba(192,154,90,0.05) 0%, transparent 70%)',
                overflow: 'hidden'
            }}>
                <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ position: 'absolute', transform: 'rotate(25deg)', opacity: 0.3 }}>
                    <path d="M50 0 L100 30 L60 40 Z" fill="var(--color-accent)" />
                    <path d="M100 50 L70 100 L60 60 Z" fill="var(--color-accent)" />
                    <path d="M50 100 L0 70 L40 60 Z" fill="var(--color-accent)" />
                    <path d="M0 50 L30 0 L40 40 Z" fill="var(--color-accent)" />
                </svg>
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                }}>
                    <span style={{ fontSize: '0.52rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-text-muted)' }}>PRODUCTION</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 900, color: info.color, marginTop: '4px', letterSpacing: '0.05em' }}>{info.label.toUpperCase()}</span>
                </div>
            </div>
        );
    };

    return (
        <div style={{
            paddingTop: '160px',
            paddingBottom: '100px',
            minHeight: '100vh',
            backgroundColor: 'var(--color-bg)',
            backgroundImage: 'radial-gradient(circle at top right, rgba(192, 154, 90, 0.05), transparent), radial-gradient(circle at bottom left, rgba(7, 31, 217, 0.02), transparent)',
            position: 'relative',
            overflow: 'hidden'
        }} className="container">
            {/* Cinematic Background Grid Lines */}
            <div style={{
                position: 'absolute',
                top: 0, bottom: 0, left: '5%', right: '5%',
                borderLeft: '1px solid rgba(255, 255, 255, 0.02)',
                borderRight: '1px solid rgba(255, 255, 255, 0.02)',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

                {/* HUD Header */}
                <header style={{ marginBottom: '2.5rem', position: 'relative' }}>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span style={{
                            display: 'block',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            letterSpacing: '0.35em',
                            textTransform: 'uppercase',
                            color: 'var(--color-accent)',
                            marginBottom: '1rem'
                        }}>
                            Hội Viên — Dashboard
                        </span>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
                            <h1 style={{
                                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
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
                                    <>Kho <span style={{ fontWeight: 900 }}>tài liệu</span></>
                                )}
                            </h1>

                            <div style={{
                                fontSize: '0.7rem',
                                fontFamily: 'monospace',
                                color: 'var(--color-text-muted)',
                                padding: '6px 14px',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'rgba(255,255,255,0.01)',
                                borderRadius: '8px',
                                letterSpacing: '0.05em'
                            }}>
                                {activeTab === 'bookings' ? (
                                    `[ SYS_SECURE // PROJECTS_COUNT: ${bookings.length} ]`
                                ) : (
                                    `[ VAULT_SECURE // VIP_VAULT: ${templates.length} ]`
                                )}
                            </div>
                        </div>
                    </motion.div>
                </header>

                {/* Telemetry Clock HUD */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 20px',
                    backgroundColor: 'rgba(10, 10, 10, 0.4)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                    fontSize: '0.68rem',
                    fontFamily: 'monospace',
                    color: 'var(--color-text-muted)',
                    marginBottom: '3rem',
                    backdropFilter: 'blur(8px)',
                    letterSpacing: '0.05em',
                    position: 'relative'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span className="telemetry-record-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#C09A5A', display: 'inline-block' }} />
                            AURA [LIVE]
                        </span>
                        <span className="hidden-xs">STU_MODE: MONITOR</span>
                        <span className="hidden-xs">FPS: 24.00</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span>CODEC: PRORES 422 HQ</span>
                        <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>SECURE_LOCK: ESTABLISHED</span>
                    </div>
                </div>

                {/* Cinematic Tab Switcher */}
                <div style={{
                    display: 'flex',
                    borderBottom: '1px solid var(--color-border)',
                    marginBottom: '3rem',
                    gap: '2.5rem',
                    paddingBottom: '2px',
                    position: 'relative'
                }}>
                    <button
                        onClick={() => setActiveTab('bookings')}
                        style={{
                            padding: '1rem 0',
                            fontSize: '1.05rem',
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: activeTab === 'bookings' ? 'var(--color-text)' : 'var(--color-text-muted)',
                            cursor: 'pointer',
                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                            fontFamily: 'var(--font-sans)',
                            position: 'relative',
                            textTransform: 'uppercase'
                        }}
                    >
                        Dự Án Của Tôi
                        {activeTab === 'bookings' && (
                            <motion.div layoutId="activeTabUnderline" style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 3, backgroundColor: 'var(--color-accent)', boxShadow: '0 0 10px rgba(192,154,90,0.5)' }} />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('templates')}
                        style={{
                            padding: '1rem 0',
                            fontSize: '1.05rem',
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: activeTab === 'templates' ? 'var(--color-text)' : 'var(--color-text-muted)',
                            cursor: 'pointer',
                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                            fontFamily: 'var(--font-sans)',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            textTransform: 'uppercase'
                        }}
                    >
                        {isVipOrStaff ? <Unlock size={14} style={{ color: 'var(--color-accent)' }} /> : <Lock size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />}
                        Kho Tài Liệu
                        {activeTab === 'templates' && (
                            <motion.div layoutId="activeTabUnderline" style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 3, backgroundColor: 'var(--color-accent)', boxShadow: '0 0 10px rgba(192,154,90,0.5)' }} />
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
                                <Loader2 size={40} className="animate-spin" style={{ color: 'var(--color-accent)', margin: '0 auto' }} />
                            </motion.div>
                        ) : error ? (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    padding: '4rem',
                                    backgroundColor: 'rgba(239, 68, 68, 0.01)',
                                    borderRadius: '32px',
                                    textAlign: 'center',
                                    border: '1px solid rgba(239, 68, 68, 0.08)',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                <AlertCircle size={48} style={{ color: '#ef4444', marginBottom: '1.5rem', opacity: 0.6 }} />
                                <p style={{ color: '#ef4444', fontSize: '1.1rem', marginBottom: '2rem', fontFamily: 'monospace' }}>{error}</p>
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
                                    position: 'relative'
                                }}
                            >
                                <div className="viewfinder-corner top-left" />
                                <div className="viewfinder-corner top-right" />
                                <div className="viewfinder-corner bottom-left" />
                                <div className="viewfinder-corner bottom-right" />

                                <div style={{
                                    width: '80px', height: '80px', borderRadius: '50%',
                                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                    border: '1px solid var(--color-border)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 2rem'
                                }}>
                                    <ShieldAlert size={32} style={{ color: 'var(--color-text-muted)' }} />
                                </div>
                                <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-display)', fontWeight: 900 }}>Truy cập bị hạn chế</h2>
                                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem', maxWidth: '400px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
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
                                    position: 'relative'
                                }}
                            >
                                <div className="viewfinder-corner top-left" />
                                <div className="viewfinder-corner top-right" />
                                <div className="viewfinder-corner bottom-left" />
                                <div className="viewfinder-corner bottom-right" />

                                <CalendarDays size={64} style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', opacity: 0.15 }} />
                                <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-display)', fontWeight: 900 }}>Chưa có dự án nào</h2>
                                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem', maxWidth: '450px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
                                    Hãy bắt đầu hành trình sáng tạo của bạn bằng cách lựa chọn một gói dịch vụ phù hợp từ Aura.
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

                                    // Custom status dots
                                    let statusDotClass = 'status-dot-neutral';
                                    if (booking.status === 'Scheduled') statusDotClass = 'glow-pulse-amber';
                                    else if (booking.status === 'InProduction') statusDotClass = 'glow-pulse-blue';
                                    else if (booking.status === 'Completed') statusDotClass = 'glow-pulse-green';

                                    return (
                                        <motion.div
                                            key={booking.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                            className="booking-card"
                                            style={{
                                                backgroundColor: 'var(--color-bg-secondary)',
                                                border: '1px solid var(--color-border)',
                                                borderRadius: '32px',
                                                padding: '2.25rem 2.75rem',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                transition: 'var(--transition-cinematic)'
                                            }}
                                            whileHover={{
                                                borderColor: 'rgba(192, 154, 90, 0.5)',
                                                boxShadow: '0 25px 50px rgba(192, 154, 90, 0.03)',
                                                y: -6
                                            }}
                                        >
                                            <div className="viewfinder-corner top-left" />
                                            <div className="viewfinder-corner top-right" />
                                            <div className="viewfinder-corner bottom-left" />
                                            <div className="viewfinder-corner bottom-right" />

                                            <div style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: '2rem'
                                            }}>
                                                <div style={{ flex: '1', minWidth: '280px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
                                                        <span style={{
                                                            fontSize: '0.62rem',
                                                            fontWeight: 800,
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.15em',
                                                            color: statusInfo.color,
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            backgroundColor: `${statusInfo.color}10`,
                                                            border: `1px solid ${statusInfo.color}25`,
                                                            padding: '4px 12px',
                                                            borderRadius: '100px'
                                                        }}>
                                                            <span className={statusDotClass} style={{ width: '6px', height: '6px', borderRadius: '50%', display: 'inline-block' }} />
                                                            {statusInfo.label}
                                                        </span>
                                                        <div style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, fontFamily: 'monospace' }}>
                                                            REG_DATE: {formatDate(booking.createdAt)}
                                                        </span>
                                                    </div>

                                                    <h3 style={{
                                                        fontSize: '1.6rem',
                                                        fontFamily: 'var(--font-sans)',
                                                        fontWeight: 800,
                                                        marginBottom: '1rem',
                                                        letterSpacing: 'var(--ls-tight)',
                                                        textTransform: 'none',
                                                        color: 'var(--color-text)'
                                                    }}>
                                                        {booking.name}
                                                    </h3>

                                                    {/* Monospace telemetry fields */}
                                                    <div style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                                                        gap: '1.5rem',
                                                        marginTop: '1.5rem',
                                                        padding: '12px 18px',
                                                        backgroundColor: 'rgba(0,0,0,0.12)',
                                                        border: '1px solid rgba(255,255,255,0.02)',
                                                        borderRadius: '16px'
                                                    }}>
                                                        <div>
                                                            <span style={{ display: 'block', fontSize: '0.58rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--color-text-muted)', letterSpacing: '0.12em', marginBottom: '4px' }}>Dự kiến bàn giao</span>
                                                            <span style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.85rem', fontFamily: 'monospace' }}>{formatDate(booking.deadline)}</span>
                                                        </div>
                                                        <div>
                                                            <span style={{ display: 'block', fontSize: '0.58rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--color-text-muted)', letterSpacing: '0.12em', marginBottom: '4px' }}>Gói thiết kế</span>
                                                            <span style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.85rem' }}>{booking.packageName}</span>
                                                        </div>
                                                        <div>
                                                            <span style={{ display: 'block', fontSize: '0.58rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--color-text-muted)', letterSpacing: '0.12em', marginBottom: '4px' }}>Ngân sách đầu tư</span>
                                                            <span style={{ fontWeight: 800, color: 'var(--color-accent)', fontSize: '0.92rem', fontFamily: 'monospace' }}>{formatMoney(booking.revenue)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="booking-card-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexShrink: 0 }}>
                                                    {booking.status === 'Scheduled' && (
                                                        <Button
                                                            onClick={() => navigate(`/purchase/${booking.packageId}?projectId=${booking.id}`)}
                                                            style={{
                                                                background: 'linear-gradient(135deg, #CF9F2E 0%, #D4AF37 50%, #F3E5AB 100%)',
                                                                color: 'black',
                                                                fontWeight: 800,
                                                                gap: '8px',
                                                                border: 'none',
                                                                boxShadow: '0 8px 20px rgba(212,175,55,0.15)',
                                                                textTransform: 'uppercase',
                                                                fontSize: '0.82rem',
                                                                letterSpacing: '0.05em'
                                                            }}
                                                        >
                                                            <CreditCard size={15} /> Thanh toán
                                                        </Button>
                                                    )}
                                                    {/* Removed Reschedule Button */}

                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => setSelectedProject(booking)}
                                                        style={{
                                                            gap: '8px',
                                                            fontSize: '0.85rem',
                                                            color: 'var(--color-text-muted)',
                                                            fontWeight: 700
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                                                    >
                                                        Chi tiết <ArrowRight size={15} />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Stage progress timeline block */}
                                            {renderProgressTracker(booking.status)}

                                        </motion.div>
                                    );
                                })}

                                {/* Pagination Controls */}
                                {bookings.length > ITEMS_PER_PAGE && (
                                    <div style={{
                                        marginTop: '4rem',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: '1rem'
                                    }}>
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                            style={{
                                                width: '46px', height: '46px',
                                                borderRadius: '50%',
                                                backgroundColor: 'var(--color-bg-secondary)',
                                                border: '1px solid var(--color-border)',
                                                color: currentPage === 1 ? 'var(--color-text-muted)' : 'var(--color-text)',
                                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                transition: 'var(--transition-cinematic)',
                                                opacity: currentPage === 1 ? 0.25 : 1
                                            }}
                                        >
                                            <ChevronLeft size={20} />
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
                                                            width: '46px', height: '46px',
                                                            borderRadius: '50%',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontSize: '0.8rem', fontWeight: 800,
                                                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                                            backgroundColor: isActive ? 'var(--color-accent)' : 'transparent',
                                                            border: `1px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border)'}`,
                                                            color: isActive ? 'white' : 'var(--color-text)',
                                                            cursor: 'pointer',
                                                            transform: isActive ? 'scale(1.08)' : 'scale(1)'
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
                                                width: '46px', height: '46px',
                                                borderRadius: '50%',
                                                backgroundColor: 'var(--color-bg-secondary)',
                                                border: '1px solid var(--color-border)',
                                                color: currentPage === Math.ceil(bookings.length / ITEMS_PER_PAGE) ? 'var(--color-text-muted)' : 'var(--color-text)',
                                                cursor: currentPage === Math.ceil(bookings.length / ITEMS_PER_PAGE) ? 'not-allowed' : 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                transition: 'var(--transition-cinematic)',
                                                opacity: currentPage === Math.ceil(bookings.length / ITEMS_PER_PAGE) ? 0.25 : 1
                                            }}
                                        >
                                            <ChevronRight size={20} />
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
                                <Loader2 size={40} className="animate-spin" style={{ color: 'var(--color-accent)', margin: '0 auto' }} />
                            </motion.div>
                        ) : templatesError ? (
                            <motion.div
                                key="templates-error"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    padding: '4rem',
                                    backgroundColor: 'rgba(239, 68, 68, 0.01)',
                                    borderRadius: '32px',
                                    textAlign: 'center',
                                    border: '1px solid rgba(239, 68, 68, 0.08)',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                <AlertCircle size={48} style={{ color: '#ef4444', marginBottom: '1.5rem', opacity: 0.6 }} />
                                <p style={{ color: '#ef4444', fontSize: '1.1rem', marginBottom: '2rem', fontFamily: 'monospace' }}>{templatesError}</p>
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
                                    borderRadius: '40px',
                                    border: '1px solid var(--color-border)',
                                    textAlign: 'center',
                                    maxWidth: '800px',
                                    margin: '2rem auto',
                                    backgroundImage: 'radial-gradient(circle at center, rgba(192, 154, 90, 0.05), transparent)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <div className="viewfinder-corner top-left" />
                                <div className="viewfinder-corner top-right" />
                                <div className="viewfinder-corner bottom-left" />
                                <div className="viewfinder-corner bottom-right" />

                                <div style={{
                                    position: 'absolute',
                                    width: '300px',
                                    height: '300px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(192, 154, 90, 0.02)',
                                    filter: 'blur(60px)',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 1
                                }} />

                                <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                                    <motion.div
                                        style={{
                                            marginBottom: '2.5rem',
                                            cursor: 'pointer'
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        onClick={() => navigate('/packages')}
                                    >
                                        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="100" cy="100" r="85" stroke="#C09A5A" strokeWidth="2" strokeDasharray="6 6" opacity="0.3" />
                                            <circle cx="100" cy="100" r="75" stroke="#C09A5A" strokeWidth="1" opacity="0.5" />
                                            <circle cx="100" cy="100" r="65" stroke="#C09A5A" strokeWidth="4" strokeDasharray="40 10 20 10" className="vault-dial" />
                                            <circle cx="100" cy="100" r="45" fill="rgba(20, 20, 20, 0.95)" stroke="#C09A5A" strokeWidth="3" />
                                            <path d="M100 20 V35 M100 165 V180 M20 100 H35 M165 100 H180" stroke="#C09A5A" strokeWidth="2" />
                                            <g transform="translate(85, 82) scale(1.2)">
                                                <path d="M18 11V7C18 3.7 15.3 1 12 1C8.7 1 6 3.7 6 7V11" stroke="#C09A5A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <rect x="2" y="11" width="20" height="14" rx="4" fill="rgba(20, 20, 20, 0.95)" stroke="#C09A5A" strokeWidth="2" />
                                                <circle cx="12" cy="18" r="2" fill="#C09A5A" />
                                            </g>
                                        </svg>
                                    </motion.div>

                                    <span style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 800,
                                        letterSpacing: '0.3em',
                                        color: 'var(--color-accent)',
                                        textTransform: 'uppercase',
                                        marginBottom: '0.5rem'
                                    }}>
                                        VIP Access Required
                                    </span>
                                    <h2 style={{
                                        fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                                        fontFamily: 'var(--font-display)',
                                        fontWeight: 900,
                                        color: '#C09A5A',
                                        marginBottom: '1rem',
                                        letterSpacing: '0.05em',
                                        textTransform: 'uppercase'
                                    }}>
                                        Kho Tài Liệu Bảo Mật
                                    </h2>

                                    <p style={{
                                        color: 'var(--color-text-muted)',
                                        fontSize: '1rem',
                                        lineHeight: 1.7,
                                        maxWidth: '520px',
                                        marginBottom: '2.5rem'
                                    }}>
                                        Kho kịch bản concept độc quyền, hợp đồng dịch vụ chuẩn studio AURA và các tài nguyên biểu mẫu cao cấp chỉ dành riêng cho hội viên VIP.
                                    </p>

                                    {/* Perks comparison grid inside locked screen */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                        gap: '1.25rem',
                                        width: '100%',
                                        maxWidth: '700px',
                                        marginBottom: '3rem',
                                        textAlign: 'left'
                                    }}>
                                        <div style={{
                                            backgroundColor: 'rgba(255,255,255,0.01)',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            borderRadius: '20px',
                                            padding: '1.25rem',
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '12px'
                                        }}>
                                            <Lock size={16} style={{ color: 'var(--color-accent)', marginTop: '3px' }} />
                                            <div>
                                                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text)', margin: '0 0 4px 0' }}>CONCEPT SCRIPTS</h4>
                                                <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', margin: 0 }}>Kịch bản phân cảnh độc quyền thiết kế riêng.</p>
                                            </div>
                                        </div>
                                        <div style={{
                                            backgroundColor: 'rgba(255,255,255,0.01)',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            borderRadius: '20px',
                                            padding: '1.25rem',
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '12px'
                                        }}>
                                            <Lock size={16} style={{ color: 'var(--color-accent)', marginTop: '3px' }} />
                                            <div>
                                                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text)', margin: '0 0 4px 0' }}>STUDIO CONTRACTS</h4>
                                                <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', margin: 0 }}>Hợp đồng pháp lý mẫu chuẩn sản xuất sáng tạo.</p>
                                            </div>
                                        </div>
                                        <div style={{
                                            backgroundColor: 'rgba(255,255,255,0.01)',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            borderRadius: '20px',
                                            padding: '1.25rem',
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '12px'
                                        }}>
                                            <Lock size={16} style={{ color: 'var(--color-accent)', marginTop: '3px' }} />
                                            <div>
                                                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text)', margin: '0 0 4px 0' }}>VIP PRODUCTION TOOLS</h4>
                                                <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', margin: 0 }}>Moodboard, storyboard sơ đồ chiếu sáng cao cấp.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate('/packages')}
                                        className="shimmer-btn"
                                        style={{
                                            padding: '1.1rem 3rem',
                                            background: 'linear-gradient(135deg, #CF9F2E 0%, #D4AF37 50%, #F3E5AB 100%)',
                                            color: 'black',
                                            fontWeight: 800,
                                            fontSize: '0.88rem',
                                            letterSpacing: '0.08em',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            borderRadius: '8px',
                                            boxShadow: '0 12px 30px rgba(212,175,55,0.3)',
                                            border: 'none',
                                            cursor: 'pointer',
                                            textTransform: 'uppercase',
                                            transition: 'all 0.3s ease',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <Unlock size={16} /> Mở Khóa Kho Tài Liệu Ngay
                                    </button>
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
                                    position: 'relative'
                                }}
                            >
                                <div className="viewfinder-corner top-left" />
                                <div className="viewfinder-corner top-right" />
                                <div className="viewfinder-corner bottom-left" />
                                <div className="viewfinder-corner bottom-right" />

                                <FileText size={64} style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', opacity: 0.15 }} />
                                <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-display)', fontWeight: 900 }}>Thư viện trống</h2>
                                <p style={{ color: 'var(--color-text-muted)', maxWidth: '450px', margin: '0 auto', lineHeight: 1.6 }}>
                                    Hệ thống chưa đăng tải tài liệu VIP nào. Vui lòng quay lại sau!
                                </p>
                            </motion.div>
                        ) : (
                            <div className={`templates-split-container ${selectedTemplate ? 'split-active' : ''}`} style={{
                                display: 'grid',
                                gridTemplateColumns: selectedTemplate ? '260px 1fr' : '1fr',
                                gap: '2.5rem',
                                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                                alignItems: 'start'
                            }}>
                                {/* Left Column: Templates Grid / List */}
                                <motion.div
                                    key="templates-list"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: selectedTemplate ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
                                        gap: '2rem',
                                        maxHeight: selectedTemplate ? '700px' : 'auto',
                                        overflowY: selectedTemplate ? 'auto' : 'visible',
                                        paddingRight: selectedTemplate ? '12px' : '0',
                                        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                                    }}
                                    className="custom-scrollbar"
                                >
                                    {selectedTemplate && (
                                        <button
                                            onClick={() => setSelectedTemplate(null)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                background: 'rgba(255,255,255,0.02)',
                                                border: '1px solid rgba(192, 154, 90, 0.25)',
                                                borderRadius: '10px',
                                                color: 'var(--color-accent)',
                                                padding: '10px 16px',
                                                fontSize: '0.8rem',
                                                fontFamily: 'monospace',
                                                letterSpacing: '0.08em',
                                                textTransform: 'uppercase',
                                                cursor: 'pointer',
                                                width: '100%',
                                                justifyContent: 'center',
                                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                                marginBottom: '0.5rem'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(192, 154, 90, 0.08)';
                                                e.currentTarget.style.borderColor = 'var(--color-accent)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                                                e.currentTarget.style.borderColor = 'rgba(192, 154, 90, 0.25)';
                                            }}
                                        >
                                            <ChevronLeft size={15} /> QUAY LẠI DANH SÁCH
                                        </button>
                                    )}

                                    {(selectedTemplate ? templates.filter(t => t.id === selectedTemplate.id) : templates).map((tmpl, index) => {
                                        const isPdf = tmpl.fileType?.toLowerCase() === '.pdf';
                                        const simulatedSize = `${(tmpl.title.length * 0.3 + 8.5).toFixed(1)} KB`;
                                        const isSelected = selectedTemplate?.id === tmpl.id;
                                        
                                        return (
                                            <motion.div
                                                key={tmpl.id}
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.04, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                                className={`template-card ${isSelected ? 'active-template-card' : ''}`}
                                                onClick={() => setSelectedTemplate(isSelected ? null : tmpl)}
                                                style={{ cursor: 'pointer' }}
                                            >


                                                {/* Top technical band */}
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    fontSize: '0.58rem',
                                                    fontFamily: 'monospace',
                                                    color: isSelected ? 'var(--color-accent)' : 'rgba(255,255,255,0.25)',
                                                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                                                    paddingBottom: '0.5rem',
                                                    letterSpacing: '0.1em',
                                                    transition: 'color 0.3s ease'
                                                }}>
                                                    <span>AURA SECURITY PROTOCOL // DECRYPTED</span>
                                                    <span>{isSelected ? 'ACTIVE_VIEWPORT' : 'LEVEL_4_CLEARANCE'}</span>
                                                </div>

                                                {/* Header */}
                                                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                                                    <div 
                                                        className="file-icon-box"
                                                        style={{
                                                            backgroundColor: isPdf ? 'rgba(239, 68, 68, 0.06)' : 'rgba(192, 154, 90, 0.06)',
                                                            border: `1px solid ${isPdf ? 'rgba(239, 68, 68, 0.15)' : 'rgba(192, 154, 90, 0.25)'}`,
                                                            color: isPdf ? '#ef4444' : '#C09A5A',
                                                            boxShadow: isPdf ? '0 0 15px rgba(239, 68, 68, 0.1)' : '0 0 15px rgba(192, 154, 90, 0.1)'
                                                        }}
                                                    >
                                                        <FileText size={20} />
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                            <span className="template-badge">
                                                                {isPdf ? 'PDF' : 'WORD'}
                                                            </span>
                                                            <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)' }}>
                                                                REF // AU-T0{index + 1}
                                                            </span>
                                                        </div>
                                                        <h3 style={{
                                                            fontSize: '1.2rem',
                                                            fontWeight: 900,
                                                            margin: 0,
                                                            color: 'var(--color-text)',
                                                            letterSpacing: '-0.01em',
                                                            textTransform: 'uppercase',
                                                            lineHeight: 1.3,
                                                            fontFamily: 'var(--font-sans)'
                                                        }}>
                                                            {tmpl.title}
                                                        </h3>
                                                    </div>
                                                </div>

                                                {/* Technical Telemetry Grid */}
                                                <div style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: '1fr 1fr',
                                                    gap: '0.75rem',
                                                    fontSize: '0.65rem',
                                                    fontFamily: 'monospace',
                                                    color: 'rgba(255, 255, 255, 0.35)',
                                                    backgroundColor: 'rgba(0,0,0,0.25)',
                                                    padding: '10px 14px',
                                                    borderRadius: '10px',
                                                    border: '1px solid rgba(255,255,255,0.02)',
                                                    letterSpacing: '0.05em'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <span style={{ color: 'rgba(255, 255, 255, 0.15)' }}>SIZE:</span>
                                                        <span style={{ color: 'var(--color-accent)', fontWeight: 800 }}>{simulatedSize}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                                                        <span style={{ color: 'rgba(255, 255, 255, 0.15)' }}>INTEGRITY:</span>
                                                        <span style={{ color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }} />
                                                            PASS
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Description Panel */}
                                                <div className="template-desc-container">
                                                    <p style={{
                                                        fontSize: '0.85rem',
                                                        color: 'var(--color-text-muted)',
                                                        lineHeight: 1.6,
                                                        margin: 0,
                                                        fontStyle: tmpl.description ? 'normal' : 'italic'
                                                    }}>
                                                        {tmpl.description ? (
                                                            tmpl.description
                                                        ) : (
                                                            <span style={{ opacity: 0.5 }}>
                                                                // SYSTEM TELEMETRY BRIEFING // <br />
                                                                Kịch bản concept độc quyền thiết kế riêng chuẩn studio sản xuất sáng tạo AURA.
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>

                                                {/* Divider */}
                                                <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.03)', width: '100%' }} />

                                                {/* Actions */}
                                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', zIndex: 3 }} onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => setSelectedTemplate(isSelected ? null : tmpl)}
                                                        className="template-view-btn"
                                                        style={{
                                                            background: isSelected ? 'linear-gradient(135deg, #CF9F2E 0%, #D4AF37 50%, #F3E5AB 100%)' : 'rgba(192, 154, 90, 0.03)',
                                                            color: isSelected ? 'black' : 'var(--color-accent)'
                                                        }}
                                                    >
                                                        <Eye size={15} /> {isSelected ? 'Đang Xem' : 'Xem Trực Tuyến'}
                                                    </button>
                                                    
                                                    <button
                                                        onClick={() => { if (tmpl.fileUrl) window.open(tmpl.fileUrl, '_blank'); }}
                                                        className="template-download-btn"
                                                        title="Tải xuống tệp tin"
                                                    >
                                                        <FileDown size={16} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>

                                {/* Right Column: Live Console Viewport Preview */}
                                <AnimatePresence mode="wait">
                                    {selectedTemplate && (
                                        <motion.div
                                            key={selectedTemplate.id}
                                            initial={{ opacity: 0, scale: 0.98, x: 30 }}
                                            animate={{ opacity: 1, scale: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.98, x: 30 }}
                                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                            className="template-preview-panel"
                                            style={{
                                                backgroundColor: 'rgba(10, 10, 10, 0.75)',
                                                border: '1px solid rgba(192, 154, 90, 0.25)',
                                                borderRadius: '24px',
                                                height: '750px',
                                                position: 'sticky',
                                                top: '100px',
                                                boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                overflow: 'hidden',
                                                zIndex: 10
                                            }}
                                        >


                                            {/* Preview Header */}
                                            <div style={{
                                                padding: '1.25rem 2rem',
                                                borderBottom: '1px solid var(--color-border)',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                backgroundColor: 'rgba(15, 15, 15, 0.8)',
                                                backdropFilter: 'blur(12px)',
                                                zIndex: 10
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{
                                                        width: '42px', height: '42px', borderRadius: '12px',
                                                        backgroundColor: selectedTemplate.fileType?.toLowerCase() === '.pdf' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(192, 154, 90, 0.08)',
                                                        border: `1px solid ${selectedTemplate.fileType?.toLowerCase() === '.pdf' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(192, 154, 90, 0.25)'}`,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        color: selectedTemplate.fileType?.toLowerCase() === '.pdf' ? '#ef4444' : '#C09A5A'
                                                    }}>
                                                        <FileText size={20} />
                                                    </div>
                                                    <div>
                                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0, color: 'var(--color-text)', textTransform: 'none' }}>
                                                            {selectedTemplate.title}
                                                        </h3>
                                                        <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                                                            SECURE_VIEWPORT // TYPE: {selectedTemplate.fileType?.toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => setSelectedTemplate(null)}
                                                    style={{
                                                        background: 'var(--color-bg-secondary)',
                                                        border: '1px solid var(--color-border)',
                                                        color: 'var(--color-text)',
                                                        cursor: 'pointer',
                                                        width: '38px', height: '38px', borderRadius: '50%',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'var(--color-accent)';
                                                        e.currentTarget.style.color = 'white';
                                                        e.currentTarget.style.transform = 'rotate(90deg)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
                                                        e.currentTarget.style.color = 'var(--color-text)';
                                                        e.currentTarget.style.transform = 'rotate(0deg)';
                                                    }}
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>

                                            {/* Secure IFrame Embed */}
                                            <div style={{ flex: 1, backgroundColor: '#141414', position: 'relative' }}>
                                                <iframe
                                                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedTemplate.fileUrl || '')}&embedded=true`}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        border: 'none',
                                                    }}
                                                    title={selectedTemplate.title || 'Preview'}
                                                />
                                            </div>

                                            {/* Preview Footer */}
                                            <div style={{
                                                padding: '1.25rem 2rem',
                                                borderTop: '1px solid var(--color-border)',
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                gap: '1rem',
                                                backgroundColor: 'rgba(15, 15, 15, 0.8)',
                                                backdropFilter: 'blur(12px)',
                                                zIndex: 10
                                            }}>
                                                <button
                                                    onClick={() => { if (selectedTemplate.fileUrl) window.open(selectedTemplate.fileUrl, '_blank'); }}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: '8px',
                                                        background: 'linear-gradient(135deg, #CF9F2E 0%, #D4AF37 50%, #F3E5AB 100%)',
                                                        color: 'black',
                                                        padding: '0.65rem 1.5rem', fontSize: '0.82rem', fontWeight: 800,
                                                        borderRadius: '8px', cursor: 'pointer', border: 'none',
                                                        textTransform: 'uppercase',
                                                        boxShadow: '0 6px 15px rgba(212,175,55,0.2)',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(212,175,55,0.3)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.boxShadow = '0 6px 15px rgba(212,175,55,0.2)';
                                                    }}
                                                >
                                                    <Download size={14} /> Tải tệp xuống
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
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
                            backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(15px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                            padding: '1.5rem'
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 20 }}
                            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
                            style={{
                                backgroundColor: 'rgba(10, 10, 10, 0.9)',
                                border: '1px solid rgba(192, 154, 90, 0.25)',
                                borderRadius: '40px',
                                maxWidth: '800px',
                                width: '100%',
                                maxHeight: '90vh',
                                position: 'relative',
                                boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden'
                            }}
                        >
                            <div className="viewfinder-corner top-left" />
                            <div className="viewfinder-corner top-right" />
                            <div className="viewfinder-corner bottom-left" />
                            <div className="viewfinder-corner bottom-right" />

                            {/* Fixed Close Button */}
                            <button
                                onClick={() => setSelectedProject(null)}
                                style={{
                                    position: 'absolute', right: '1.5rem', top: '1.5rem',
                                    background: 'var(--color-bg-secondary)',
                                    border: '1px solid var(--color-border)',
                                    color: 'var(--color-text)',
                                    cursor: 'pointer',
                                    width: '42px', height: '42px', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                    zIndex: 100,
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--color-accent)';
                                    e.currentTarget.style.color = 'white';
                                    e.currentTarget.style.transform = 'rotate(90deg) scale(1.08)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--color-bg-secondary)';
                                    e.currentTarget.style.color = 'var(--color-text)';
                                    e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
                                }}
                            >
                                <X size={20} />
                            </button>

                            {/* Scrollable Content */}
                            <div className="booking-modal-body" style={{
                                padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 5vw, 3.5rem) 2.5rem',
                                overflowY: 'auto',
                                width: '100%'
                            }}>
                                <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>

                                    {/* Shutter Iris Status Graphic */}
                                    {renderShutterIris(selectedProject.status)}

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontFamily: 'monospace' }}>REF_ID: {selectedProject.id.toUpperCase()}</span>
                                    </div>
                                    <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.75rem', fontFamily: 'var(--font-display)', letterSpacing: 'var(--ls-tight)' }}>
                                        {selectedProject.name}
                                    </h2>
                                    <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, fontSize: '1rem', maxWidth: '520px', margin: '0 auto' }}>
                                        {getStatusInfo(selectedProject.status).desc}
                                    </p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                                    <div style={{ backgroundColor: 'rgba(255,255,255,0.01)', padding: '1.25rem 1.5rem', borderRadius: '20px', border: '1px solid var(--color-border)' }}>
                                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.08em' }}>Ngày đăng ký</div>
                                        <div style={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: 'monospace' }}>{formatDate(selectedProject.createdAt)}</div>
                                    </div>
                                    <div style={{ backgroundColor: 'rgba(255,255,255,0.01)', padding: '1.25rem 1.5rem', borderRadius: '20px', border: '1px solid var(--color-border)' }}>
                                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.08em' }}>Hạn hoàn thành</div>
                                        <div style={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: 'monospace' }}>{formatDate(selectedProject.deadline)}</div>
                                    </div>
                                    <div style={{ backgroundColor: 'rgba(255,255,255,0.01)', padding: '1.25rem 1.5rem', borderRadius: '20px', border: '1px solid var(--color-border)' }}>
                                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.08em' }}>Tổng ngân sách</div>
                                        <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--color-accent)', fontFamily: 'monospace' }}>{formatMoney(selectedProject.revenue)}</div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '2.5rem', padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--color-border)', borderRadius: '24px' }}>
                                    <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1.25rem', letterSpacing: '0.08em', color: 'var(--color-accent)' }}>
                                        Chi tiết gói: {selectedProject.packageName}
                                    </h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
                                        {selectedProject.benefits?.map((benefit, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                                                <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', flexShrink: 0 }} />
                                                <span>{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {selectedProject.description && (
                                    <div style={{ marginBottom: '2.5rem', padding: '1.5rem', backgroundColor: 'rgba(192, 154, 90, 0.02)', borderRadius: '20px', borderLeft: '4px solid var(--color-accent)', borderRight: '1px solid rgba(192, 154, 90, 0.05)', borderTop: '1px solid rgba(192, 154, 90, 0.05)', borderBottom: '1px solid rgba(192, 154, 90, 0.05)' }}>
                                        <h4 style={{ fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em', color: 'var(--color-accent)' }}>Ghi chú từ đối tác:</h4>
                                        <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--color-text)', fontStyle: 'italic', lineHeight: 1.6 }}>"{selectedProject.description}"</p>
                                    </div>
                                )}

                                <div className="booking-modal-actions" style={{ display: 'flex', gap: '1.5rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
                                    {selectedProject.status === 'Scheduled' && (
                                        <>
                                            <Button
                                                onClick={() => navigate(`/purchase/${selectedProject.packageId}?projectId=${selectedProject.id}`)}
                                                style={{
                                                    flex: 1,
                                                    height: '56px',
                                                    background: 'linear-gradient(135deg, #CF9F2E 0%, #D4AF37 50%, #F3E5AB 100%)',
                                                    color: 'black',
                                                    fontWeight: 800,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em'
                                                }}
                                            >
                                                <CreditCard size={18} style={{ marginRight: '8px' }} /> Tiến hành thanh toán
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setCancelModal({ isOpen: true, projectId: selectedProject.id })}
                                                style={{ borderColor: '#ef4444', color: '#ef4444', height: '56px', fontWeight: 800, textTransform: 'uppercase' }}
                                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                            >
                                                Hủy dự án
                                            </Button>
                                        </>
                                    )}
                                    {selectedProject.resultLink && (
                                        <Button
                                            onClick={() => window.open(selectedProject.resultLink, '_blank')}
                                            style={{ flex: 1, height: '56px', fontWeight: 800, textTransform: 'uppercase' }}
                                        >
                                            Xem sản phẩm bàn giao <ChevronRight size={18} style={{ marginLeft: '8px' }} />
                                        </Button>
                                    )}
                                    {selectedProject.status === 'InProduction' && !selectedProject.resultLink && (
                                        <div style={{
                                            flex: 1,
                                            textAlign: 'center',
                                            color: 'var(--color-text-muted)',
                                            fontSize: '0.9rem',
                                            padding: '1rem',
                                            backgroundColor: 'rgba(255,255,255,0.01)',
                                            border: '1px dashed var(--color-border)',
                                            borderRadius: '12px',
                                            fontStyle: 'italic'
                                        }}>
                                            Dự án đang trong guồng sản xuất. Đội ngũ AURA sẽ cập nhật bản thảo sản phẩm sớm nhất.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Reschedule Modal Removed */}



            <ConfirmModal
                isOpen={cancelModal.isOpen}
                title="Hủy lịch hẹn dự án"
                message="Bạn có chắc chắn muốn hủy bỏ dự án này? Sau khi hủy, mọi tiến trình và thông tin thanh toán cho lịch hẹn sẽ bị khóa hoàn toàn."
                confirmText="Xác nhận hủy lịch"
                onConfirm={handleCancel}
                onCancel={() => setCancelModal({ isOpen: false, projectId: null })}
                type="danger"
            />

            <ToastContainer />

            <style>{`
                .template-card {
                    background: linear-gradient(135deg, rgba(12, 12, 12, 0.9) 0%, rgba(6, 6, 6, 0.95) 100%);
                    background-image: 
                        linear-gradient(rgba(192, 154, 90, 0.01) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(192, 154, 90, 0.01) 1px, transparent 1px),
                        linear-gradient(135deg, rgba(20, 20, 20, 0.45) 0%, rgba(10, 10, 10, 0.7) 100%);
                    background-size: 20px 20px, 20px 20px, auto;
                    border: 1px solid rgba(192, 154, 90, 0.12) !important;
                    border-radius: 20px !important;
                    padding: 2.25rem !important;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem !important;
                    position: relative;
                    overflow: hidden;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.8), inset 0 0 25px rgba(255,255,255,0.01);
                    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
                }
                .template-card:hover {
                    border-color: rgba(192, 154, 90, 0.5) !important;
                    box-shadow: 
                        0 30px 60px rgba(192, 154, 90, 0.08), 
                        0 0 40px rgba(192, 154, 90, 0.03), 
                        inset 0 0 35px rgba(192, 154, 90, 0.05) !important;
                    transform: translateY(-8px);
                }
                
                /* Pseudo-glow background inside card */
                .template-card::before {
                    content: '';
                    position: absolute;
                    top: -30%;
                    right: -30%;
                    width: 60%;
                    height: 60%;
                    background: radial-gradient(circle, rgba(192, 154, 90, 0.08) 0%, transparent 70%);
                    filter: blur(40px);
                    pointer-events: none;
                    z-index: 0;
                    transition: all 0.6s ease;
                }
                .template-card:hover::before {
                    background: radial-gradient(circle, rgba(192, 154, 90, 0.15) 0%, transparent 70%);
                    top: -20%;
                    right: -20%;
                    width: 80%;
                    height: 80%;
                }
                
                /* Precise viewfinder corner positioning */
                .template-card .viewfinder-corner {
                    top: 12px;
                    left: 12px;
                    border-color: rgba(192, 154, 90, 0.18) !important;
                }
                .template-card .viewfinder-corner.top-right { top: 12px; right: 12px; }
                .template-card .viewfinder-corner.bottom-left { bottom: 12px; left: 12px; }
                .template-card .viewfinder-corner.bottom-right { bottom: 12px; right: 12px; }

                .template-card:hover .viewfinder-corner {
                    border-color: var(--color-accent) !important;
                    width: 22px !important;
                    height: 22px !important;
                    top: 8px !important;
                    left: 8px !important;
                }
                .template-card:hover .viewfinder-corner.top-right { right: 8px !important; }
                .template-card:hover .viewfinder-corner.bottom-left { bottom: 8px !important; }
                .template-card:hover .viewfinder-corner.bottom-right { right: 8px !important; bottom: 8px !important; }

                .file-icon-box {
                    width: 52px;
                    height: 52px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                    background: rgba(10, 10, 10, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    position: relative;
                    overflow: hidden;
                }
                .file-icon-box::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: inherit;
                    padding: 1px;
                    background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.01));
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    pointer-events: none;
                }
                .template-card:hover .file-icon-box {
                    transform: scale(1.08) rotate(3deg);
                    border-color: rgba(192, 154, 90, 0.3);
                }

                .template-badge {
                    font-family: monospace;
                    font-size: 0.6rem;
                    font-weight: 800;
                    letter-spacing: 0.12em;
                    color: var(--color-accent);
                    background: rgba(192, 154, 90, 0.08);
                    border: 1px solid rgba(192, 154, 90, 0.2);
                    padding: 2px 8px;
                    border-radius: 4px;
                    text-transform: uppercase;
                    display: inline-block;
                }

                .template-desc-container {
                    background: rgba(0, 0, 0, 0.25);
                    border: 1px solid rgba(255, 255, 255, 0.02);
                    border-left: 3px solid rgba(192, 154, 90, 0.4);
                    border-radius: 8px;
                    padding: 1.1rem 1.3rem !important;
                    min-height: 5.5rem;
                    display: flex;
                    align-items: center;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.4s ease;
                }
                .template-card:hover .template-desc-container {
                    border-left-color: var(--color-accent);
                    background: rgba(192, 154, 90, 0.02);
                    border-color: rgba(192, 154, 90, 0.1);
                }

                .template-view-btn {
                    flex: 1;
                    height: 48px;
                    border-radius: 10px !important;
                    border: 1px solid rgba(192, 154, 90, 0.3) !important;
                    background: rgba(192, 154, 90, 0.03) !important;
                    color: var(--color-accent) !important;
                    font-size: 0.82rem !important;
                    font-weight: 800 !important;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
                }
                .template-view-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
                    transition: all 0.6s ease;
                }
                .template-view-btn:hover::before {
                    left: 100%;
                }
                .template-view-btn:hover {
                    background: linear-gradient(135deg, #CF9F2E 0%, #D4AF37 50%, #F3E5AB 100%) !important;
                    color: black !important;
                    border-color: var(--color-accent) !important;
                    box-shadow: 0 10px 25px rgba(192, 154, 90, 0.25);
                    transform: translateY(-2px);
                }

                .template-download-btn {
                    width: 48px;
                    height: 48px;
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    background: rgba(255, 255, 255, 0.02);
                    color: var(--color-text-muted);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .template-download-btn:hover {
                    border-color: var(--color-accent);
                    color: var(--color-accent);
                    background: rgba(192, 154, 90, 0.05);
                    box-shadow: 0 0 15px rgba(192, 154, 90, 0.15);
                    transform: translateY(-2px) rotate(360deg);
                }

                .animate-spin { animation: spin 1.5s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                
                @keyframes telemetry-blink {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.3; transform: scale(0.9); }
                }
                .telemetry-record-dot {
                    animation: telemetry-blink 1.5s infinite ease-in-out;
                }

                @keyframes spin-dial {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .vault-dial {
                    transform-origin: center;
                    animation: spin-dial 35s linear infinite;
                }
                .vault-dial:hover {
                    animation-duration: 8s;
                }

                @keyframes shimmer-shine {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
                .shimmer-btn::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 50%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
                    transform: skewX(-25deg);
                    animation: shimmer-shine 4s infinite ease-in-out;
                }

                .viewfinder-corner {
                    position: absolute;
                    width: 14px;
                    height: 14px;
                    border-color: rgba(192, 154, 90, 0.2);
                    border-style: solid;
                    pointer-events: none;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .viewfinder-corner.top-left { top: 12px; left: 12px; border-width: 1.5px 0 0 1.5px; }
                .viewfinder-corner.top-right { top: 12px; right: 12px; border-width: 1.5px 1.5px 0 0; }
                .viewfinder-corner.bottom-left { bottom: 12px; left: 12px; border-width: 0 0 1.5px 1.5px; }
                .viewfinder-corner.bottom-right { bottom: 12px; right: 12px; border-width: 0 1.5px 1.5px 0; }

                .booking-card:hover .viewfinder-corner {
                    border-color: var(--color-accent);
                    width: 22px;
                    height: 22px;
                }

                @keyframes pulse-glow-amber {
                    0%, 100% { box-shadow: 0 0 4px #C09A5A; background-color: #C09A5A; }
                    50% { box-shadow: 0 0 12px #C09A5A; background-color: #e3b874; }
                }
                .glow-pulse-amber {
                    animation: pulse-glow-amber 2s infinite ease-in-out;
                }

                @keyframes pulse-glow-blue {
                    0%, 100% { box-shadow: 0 0 4px #3b82f6; background-color: #3b82f6; }
                    50% { box-shadow: 0 0 12px #3b82f6; background-color: #60a5fa; }
                }
                .glow-pulse-blue {
                    animation: pulse-glow-blue 2s infinite ease-in-out;
                }

                @keyframes pulse-glow-green {
                    0%, 100% { box-shadow: 0 0 4px #10b981; background-color: #10b981; }
                    50% { box-shadow: 0 0 12px #10b981; background-color: #34d399; }
                }
                .glow-pulse-green {
                    animation: pulse-glow-green 2s infinite ease-in-out;
                }

                /* Active Template Card styling */
                .template-card.active-template-card {
                    border-color: var(--color-accent) !important;
                    background: radial-gradient(circle at 100% 0%, rgba(192, 154, 90, 0.12) 0%, rgba(15, 15, 15, 0.95) 75%) !important;
                    box-shadow: 0 15px 35px rgba(192, 154, 90, 0.08), inset 0 0 25px rgba(192, 154, 90, 0.04) !important;
                }
                .template-card.active-template-card .viewfinder-corner {
                    border-color: var(--color-accent) !important;
                    width: 22px !important;
                    height: 22px !important;
                    top: 8px !important;
                    left: 8px !important;
                }
                .template-card.active-template-card .viewfinder-corner.top-right { right: 8px !important; }
                .template-card.active-template-card .viewfinder-corner.bottom-left { bottom: 8px !important; }
                .template-card.active-template-card .viewfinder-corner.bottom-right { right: 8px !important; bottom: 8px !important; }

                /* Custom Scrollbar for list container */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.01);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(192, 154, 90, 0.15);
                    border-radius: 10px;
                    transition: all 0.3s ease;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(192, 154, 90, 0.35);
                }

                /* Split active state card overrides to make them elegant, compact sidebar items */
                .templates-split-container.split-active .template-card {
                    padding: 1rem 1.15rem !important;
                    gap: 0.75rem !important;
                    border-radius: 14px !important;
                }
                .templates-split-container.split-active .template-card h3 {
                    font-size: 0.88rem !important;
                    line-height: 1.3 !important;
                }
                .templates-split-container.split-active .file-icon-box {
                    width: 36px !important;
                    height: 36px !important;
                    border-radius: 10px !important;
                }
                .templates-split-container.split-active .file-icon-box svg {
                    width: 15px !important;
                    height: 15px !important;
                }
                .templates-split-container.split-active .template-desc-container {
                    min-height: 2.5rem !important;
                    padding: 0.6rem 0.8rem !important;
                    display: none !important;
                }
                .templates-split-container.split-active .template-desc-container p {
                    font-size: 0.72rem !important;
                }
                .templates-split-container.split-active .template-badge {
                    font-size: 0.5rem !important;
                    padding: 1px 5px !important;
                }
                .templates-split-container.split-active .template-view-btn {
                    height: 36px !important;
                    font-size: 0.72rem !important;
                }
                .templates-split-container.split-active .template-download-btn {
                    width: 36px !important;
                    height: 36px !important;
                }
                /* Hide telemetry grid in compact sidebar mode */
                .templates-split-container.split-active .template-card > div:nth-child(5) {
                    display: none !important;
                }
                /* Hide top technical band text in compact mode */
                .templates-split-container.split-active .template-card > div:first-child {
                    font-size: 0.5rem !important;
                    padding-bottom: 0.35rem !important;
                }
                /* Hide viewfinder corners in compact sidebar mode */
                .templates-split-container.split-active .template-card .viewfinder-corner {
                    display: none !important;
                }

                /* Responsive split screen rules */
                @media (max-width: 1024px) {
                    .templates-split-container {
                        grid-template-columns: 1fr !important;
                        gap: 2rem !important;
                    }
                    .template-preview-panel {
                        position: relative !important;
                        top: 0 !important;
                        height: 600px !important;
                        margin-top: 1rem;
                    }
                    .custom-scrollbar {
                        max-height: none !important;
                        overflow-y: visible !important;
                        padding-right: 0 !important;
                    }
                }

                @media (max-width: 768px) {
                    .hidden-xs {
                        display: none !important;
                    }
                }

                @media (max-width: 640px) {
                    .booking-card {
                        padding: 1.75rem 1.5rem !important;
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
