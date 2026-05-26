import React from 'react';
import { motion } from 'framer-motion';
import { X, ChevronRight, CreditCard } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Project } from '../../types/project.types';
import { getStatusInfo, formatDate, formatMoney } from './helpers';
import { ShutterIris } from './ShutterIris';

interface BookingDetailsModalProps {
    project: Project;
    onClose: () => void;
    onPay: (packageId: string, projectId: string) => void;
    onCancelClick: (projectId: string) => void;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = React.memo(({ project, onClose, onPay, onCancelClick }) => {
    return (
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
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
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
                    onClick={onClose}
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
                        <ShutterIris status={project.status} />

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontFamily: 'monospace' }}>REF_ID: {project.id.toUpperCase()}</span>
                        </div>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.75rem', fontFamily: 'var(--font-display)', letterSpacing: 'var(--ls-tight)' }}>
                            {project.name}
                        </h2>
                        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, fontSize: '1rem', maxWidth: '520px', margin: '0 auto' }}>
                            {getStatusInfo(project.status).desc}
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.01)', padding: '1.25rem 1.5rem', borderRadius: '20px', border: '1px solid var(--color-border)' }}>
                            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.08em' }}>Ngày đăng ký</div>
                            <div style={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: 'monospace' }}>{formatDate(project.createdAt)}</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.01)', padding: '1.25rem 1.5rem', borderRadius: '20px', border: '1px solid var(--color-border)' }}>
                            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.08em' }}>Hạn hoàn thành</div>
                            <div style={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: 'monospace' }}>{formatDate(project.deadline)}</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.01)', padding: '1.25rem 1.5rem', borderRadius: '20px', border: '1px solid var(--color-border)' }}>
                            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.08em' }}>Tổng ngân sách</div>
                            <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--color-accent)', fontFamily: 'monospace' }}>{formatMoney(project.revenue)}</div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '2.5rem', padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--color-border)', borderRadius: '24px' }}>
                        <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1.25rem', letterSpacing: '0.08em', color: 'var(--color-accent)' }}>
                            Chi tiết gói: {project.packageName}
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
                            {project.benefits?.map((benefit, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', flexShrink: 0 }} />
                                    <span>{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {project.description && (
                        <div style={{ marginBottom: '2.5rem', padding: '1.5rem', backgroundColor: 'rgba(192, 154, 90, 0.02)', borderRadius: '20px', borderLeft: '4px solid var(--color-accent)', borderRight: '1px solid rgba(192, 154, 90, 0.05)', borderTop: '1px solid rgba(192, 154, 90, 0.05)', borderBottom: '1px solid rgba(192, 154, 90, 0.05)' }}>
                            <h4 style={{ fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em', color: 'var(--color-accent)' }}>Ghi chú từ đối tác:</h4>
                            <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--color-text)', fontStyle: 'italic', lineHeight: 1.6 }}>"{project.description}"</p>
                        </div>
                    )}

                    <div className="booking-modal-actions" style={{ display: 'flex', gap: '1.5rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
                        {project.status === 'Scheduled' && (
                            <>
                                <Button
                                    onClick={() => onPay(project.packageId, project.id)}
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
                                    onClick={() => onCancelClick(project.id)}
                                    style={{ borderColor: '#ef4444', color: '#ef4444', height: '56px', fontWeight: 800, textTransform: 'uppercase' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                >
                                    Hủy dự án
                                </Button>
                            </>
                        )}
                        {project.resultLink && (
                            <Button
                                onClick={() => window.open(project.resultLink, '_blank')}
                                style={{ flex: 1, height: '56px', fontWeight: 800, textTransform: 'uppercase' }}
                            >
                                Xem sản phẩm bàn giao <ChevronRight size={18} style={{ marginLeft: '8px' }} />
                            </Button>
                        )}
                        {project.status === 'InProduction' && !project.resultLink && (
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
    );
});

BookingDetailsModal.displayName = 'BookingDetailsModal';
