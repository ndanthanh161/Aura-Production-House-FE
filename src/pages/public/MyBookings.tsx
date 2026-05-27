import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, CalendarDays, Loader2,
    AlertCircle, Lock, ShieldAlert, Unlock, FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { projectApi } from '../../services/projectApi';
import { documentTemplateApi } from '../../services/documentTemplateApi';
import { useAuth } from '../../context/AuthContext';
import type { Project } from '../../types/project.types';
import type { DocumentTemplate } from '../../types/documentTemplate.types';
import { Button } from '../../components/ui/Button';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { useToast } from '../../components/ui/Toast';
import { BookingDetailsModal } from '../../components/bookings/BookingDetailsModal';
import { TemplateCard } from '../../components/bookings/TemplateCard';

// ─── SUB-COMPONENTS IMPORTS ──────────────────────────────────────
import { BookingsList } from '../../components/bookings/BookingsList';
import { VaultLockedScreen } from '../../components/bookings/VaultLockedScreen';
import { TemplatePreviewPanel } from '../../components/bookings/TemplatePreviewPanel';

// ─── CSS STYLES IMPORT ───────────────────────────────────────────
import './MyBookings.css';

const MyBookings: React.FC = () => {
    const { showToast, ToastContainer } = useToast();
    const { user, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();

    // Active Tab State
    const [activeTab, setActiveTab] = useState<'bookings' | 'templates'>('bookings');

    // Bookings State
    const [bookings, setBookings] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    // Templates State
    const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
    const [templatesLoading, setTemplatesLoading] = useState(false);
    const [templatesError, setTemplatesError] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);

    // Check VIP Access: users with active VIP status or Admins/Photographers
    const isVipOrStaff = user?.isVip === true || user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'photographer';

    // Fetch Data
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
        } catch {
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

    // Memoized Click Callbacks (Ensures props changes don't trigger children re-render)
    const handleSelectProject = useCallback((project: Project) => {
        setSelectedProject(project);
    }, []);

    const handleCloseDetailsModal = useCallback(() => {
        setSelectedProject(null);
    }, []);

    const handlePay = useCallback((packageId: string, projectId: string) => {
        navigate(`/purchase/${packageId}?projectId=${projectId}`);
    }, [navigate]);

    const handleCancelClick = useCallback((projectId: string) => {
        setCancelModal({ isOpen: true, projectId });
    }, []);

    // Bookings Logic
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
        } catch {
            showToast('Đã có lỗi xảy ra.', 'error');
        }
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
                        <span className="hidden-xs">FPS: 60.00</span>
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
                            <BookingsList
                                bookings={bookings}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                                onSelectProject={handleSelectProject}
                                onPay={handlePay}
                            />
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
                            <VaultLockedScreen />
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
                                        const isSelected = selectedTemplate?.id === tmpl.id;
                                        return (
                                            <TemplateCard
                                                key={tmpl.id}
                                                tmpl={tmpl}
                                                index={index}
                                                isSelected={isSelected}
                                                onSelect={(t) => setSelectedTemplate(isSelected ? null : t)}
                                            />
                                        );
                                    })}
                                </motion.div>

                                {/* Right Column: Live Console Viewport Preview */}
                                <AnimatePresence mode="wait">
                                    {selectedTemplate && (
                                        <TemplatePreviewPanel
                                            selectedTemplate={selectedTemplate}
                                            onClose={() => setSelectedTemplate(null)}
                                        />
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
                    <BookingDetailsModal
                        project={selectedProject}
                        onClose={handleCloseDetailsModal}
                        onPay={handlePay}
                        onCancelClick={handleCancelClick}
                    />
                )}
            </AnimatePresence>

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
        </div>
    );
};

export default MyBookings;
