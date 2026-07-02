import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import type { Project } from '../../types/project.types';

interface PaymentSuccessScreenProps {
    createdProject: Project;
    onGoHome: () => void;
    onGoProjects: () => void;
    btnPrimary: React.CSSProperties;
    btnOutline: React.CSSProperties;
}

export const PaymentSuccessScreen: React.FC<PaymentSuccessScreenProps> = React.memo(({
    createdProject,
    onGoHome,
    onGoProjects,
    btnPrimary,
    btnOutline
}) => {
    const isInstallmentPlan = createdProject.revenue >= 10_000_000;
    return (
        <div style={{ paddingTop: '120px', minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="container">
            <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', maxWidth: '520px', width: '100%' }}
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    style={{
                        width: '96px', height: '96px', borderRadius: '50%',
                        backgroundColor: 'rgba(173,255,0,0.15)', border: '2px solid #C09A5A',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 2rem'
                    }}
                >
                    <CheckCircle2 size={52} style={{ color: '#C09A5A' }} />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
                        Thanh Toán Thành Công!
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                        Dự án <strong style={{ color: 'var(--color-text)' }}>"{createdProject.name}"</strong> đã được chuyển sang trạng thái sản xuất.<br />
                        {isInstallmentPlan
                            ? 'AURA đã nhận thanh toán đợt 1 (50%). Hai đợt tiếp theo mỗi đợt 25% sẽ được đội ngũ liên hệ/xác nhận sau.'
                            : 'AURA đã nhận khoản thanh toán của bạn. Chúng tôi sẽ liên hệ sớm nhất.'}
                    </p>

                    <div style={{
                        backgroundColor: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '12px', padding: '1.5rem',
                        textAlign: 'left', marginBottom: '2rem'
                    }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
                            Quyền lợi của bạn
                        </p>
                        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {createdProject.benefits.map((b: string, i: number) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.875rem', color: 'var(--color-text)' }}>
                                    <Sparkles size={14} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }} />
                                    {b}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={onGoHome} style={btnOutline}>Về Trang Chủ</button>
                        <button onClick={onGoProjects} style={btnPrimary}>
                            Xem Dự Án <ArrowRight size={18} />
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
});

PaymentSuccessScreen.displayName = 'PaymentSuccessScreen';
