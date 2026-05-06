import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
    id: string;
    message: string;
    type: ToastType;
    onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, 5000);
        return () => clearTimeout(timer);
    }, [id, onClose]);

    const getStyles = () => {
        switch (type) {
            case 'success':
                return {
                    icon: <CheckCircle2 size={20} />,
                    color: '#ADFF00',
                    bg: 'rgba(173, 255, 0, 0.1)',
                    border: 'rgba(173, 255, 0, 0.2)'
                };
            case 'error':
                return {
                    icon: <XCircle size={20} />,
                    color: '#FF3B30',
                    bg: 'rgba(255, 59, 48, 0.1)',
                    border: 'rgba(255, 59, 48, 0.2)'
                };
            case 'warning':
                return {
                    icon: <AlertCircle size={20} />,
                    color: '#FFCC00',
                    bg: 'rgba(255, 204, 0, 0.1)',
                    border: 'rgba(255, 204, 0, 0.2)'
                };
            default:
                return {
                    icon: <Info size={20} />,
                    color: '#007AFF',
                    bg: 'rgba(0, 122, 255, 0.1)',
                    border: 'rgba(0, 122, 255, 0.2)'
                };
        }
    };

    const styles = getStyles();

    return (
        <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '1rem 1.25rem',
                backgroundColor: 'rgba(20, 20, 20, 0.85)',
                backdropFilter: 'blur(12px)',
                border: `1px solid ${styles.border}`,
                borderRadius: '12px',
                color: '#fff',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                width: '100%', maxWidth: '350px',
                pointerEvents: 'auto',
                marginBottom: '10px'
            }}
        >
            <div style={{ color: styles.color, flexShrink: 0 }}>
                {styles.icon}
            </div>
            <div style={{ flex: 1, fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.4 }}>
                {message}
            </div>
            <button 
                onClick={() => onClose(id)}
                style={{ 
                    background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', 
                    cursor: 'pointer', padding: '4px', display: 'flex'
                }}
            >
                <X size={16} />
            </button>
        </motion.div>
    );
};

// Simple Hook for managing toasts
export const useToast = () => {
    const [toasts, setToasts] = React.useState<{id: string, message: string, type: ToastType}[]>([]);

    const showToast = (message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const ToastContainer = () => (
        <div style={{
            position: 'fixed', top: '24px', right: '24px', zIndex: 10000,
            display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
            pointerEvents: 'none', width: '100%', maxWidth: '400px'
        }}>
            <AnimatePresence>
                {toasts.map(toast => (
                    <Toast 
                        key={toast.id}
                        id={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={removeToast}
                    />
                ))}
            </AnimatePresence>
        </div>
    );

    return { showToast, ToastContainer };
};
