import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Project } from '../../types/project.types';
import { getStatusInfo, formatDate, formatMoney } from './helpers';
import { ProgressTracker } from './ProgressTracker';

interface BookingCardProps {
    booking: Project;
    index: number;
    onSelect: (booking: Project) => void;
    onPay: (packageId: string, projectId: string) => void;
}

export const BookingCard: React.FC<BookingCardProps> = React.memo(({ booking, index, onSelect, onPay }) => {
    const statusInfo = getStatusInfo(booking.status);
    const canPay = (booking.remainingAmount ?? 0) > 0 && booking.status !== 'Cancelled' && booking.status !== 'Completed';

    // Custom status dots
    let statusDotClass = 'status-dot-neutral';
    if (booking.status === 'Scheduled') statusDotClass = 'glow-pulse-amber';
    else if (booking.status === 'InProduction') statusDotClass = 'glow-pulse-blue';
    else if (booking.status === 'Completed') statusDotClass = 'glow-pulse-green';

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
                    {canPay && (
                        <Button
                            onClick={() => onPay(booking.packageId, booking.id)}
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
                            <CreditCard size={15} /> {booking.status === 'Scheduled' ? 'Thanh toán' : 'Thanh toán tiếp'}
                        </Button>
                    )}

                    <Button
                        variant="ghost"
                        onClick={() => onSelect(booking)}
                        style={{
                            gap: '8px',
                            fontSize: '0.85rem',
                            color: 'var(--color-text-muted)',
                            fontWeight: 700
                        }}
                    >
                        Chi tiết <ArrowRight size={15} />
                    </Button>
                </div>
            </div>

            {/* Stage progress timeline block */}
            <ProgressTracker status={booking.status} />

        </motion.div>
    );
});

BookingCard.displayName = 'BookingCard';
