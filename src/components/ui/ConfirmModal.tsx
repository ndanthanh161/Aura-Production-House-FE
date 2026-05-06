import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'Xác nhận',
    cancelText = 'Hủy bỏ',
    onConfirm,
    onCancel,
    type = 'danger'
}) => {
    const getAccentColor = () => {
        switch (type) {
            case 'danger': return '#FF3B30';
            case 'warning': return '#FFCC00';
            default: return 'var(--color-neon)';
        }
    };

    const accentColor = getAccentColor();

    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '1.5rem'
                }}>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        style={{
                            position: 'absolute', inset: 0,
                            background: 'rgba(0, 0, 0, 0.7)',
                            backdropFilter: 'blur(8px)',
                        }}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        style={{
                            width: '100%', maxWidth: '440px',
                            background: 'rgba(20, 20, 20, 0.85)',
                            border: `1px solid rgba(255, 255, 255, 0.1)`,
                            borderRadius: '16px',
                            padding: '2.5rem',
                            position: 'relative',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            textAlign: 'center',
                        }}
                    >
                        {/* Close Icon */}
                        <button 
                            onClick={onCancel}
                            style={{
                                position: 'absolute', top: '1rem', right: '1rem',
                                background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)',
                                cursor: 'pointer', padding: '0.5rem', transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                        >
                            <X size={20} />
                        </button>

                        {/* Icon Header */}
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '50%',
                            background: `linear-gradient(135deg, ${accentColor}22 0%, ${accentColor}11 100%)`,
                            border: `1px solid ${accentColor}33`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1.5rem auto',
                            color: accentColor
                        }}>
                            <AlertTriangle size={32} />
                        </div>

                        <h3 style={{
                            fontSize: '1.5rem', fontWeight: 700, color: '#fff',
                            marginBottom: '1rem', fontFamily: 'var(--font-display)',
                            textTransform: 'uppercase', letterSpacing: '0.05em'
                        }}>
                            {title}
                        </h3>

                        <p style={{
                            fontSize: '1rem', color: 'rgba(255,255,255,0.6)',
                            lineHeight: 1.6, marginBottom: '2.5rem'
                        }}>
                            {message}
                        </p>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={onCancel}
                                style={{
                                    flex: 1, padding: '1rem', borderRadius: '8px',
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#fff', fontWeight: 600, cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                }}
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={onConfirm}
                                style={{
                                    flex: 1, padding: '1rem', borderRadius: '8px',
                                    background: accentColor, border: 'none',
                                    color: type === 'danger' || type === 'warning' ? '#fff' : '#000', 
                                    fontWeight: 700, cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                    boxShadow: `0 8px 20px ${accentColor}44`
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = `0 12px 25px ${accentColor}66`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = `0 8px 20px ${accentColor}44`;
                                }}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
