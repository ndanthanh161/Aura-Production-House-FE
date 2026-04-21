import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, CreditCard, User, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const Payment: React.FC = () => {
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const navigate = useNavigate();

    const handleNext = () => setStep(s => s + 1);
    const handlePrev = () => setStep(s => s - 1);

    const handlePayment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsComplete(true);
        }, 2000);
    };

    if (isComplete) {
        return (
            <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="container">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ textAlign: 'center', backgroundColor: 'var(--color-bg-secondary)', padding: 'var(--spacing-xl)', border: '1px solid var(--color-accent)' }}
                >
                    <CheckCircle2 size={80} style={{ color: 'var(--color-accent)', marginBottom: '2rem' }} />
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Thanh Toán Thành Công</h1>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '3rem' }}>Cảm ơn bạn đã chọn AURA. Một nhà sản xuất sáng tạo sẽ liên hệ bạn trong vòng 24 giờ.</p>
                    <Button onClick={() => navigate('/')}>Về Trang Chủ</Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div style={{ paddingTop: '120px', minHeight: '90vh' }} className="container">
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <header style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <h1 style={{ fontSize: '2.5rem' }}>Thanh Toán</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Hoàn tất đặt lịch sản xuất của bạn</p>
                </header>

                {/* Progress Bar */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: 'var(--spacing-lg)' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{
                            flex: 1,
                            height: '4px',
                            backgroundColor: step >= i ? 'var(--color-accent)' : 'var(--color-border)',
                            transition: 'var(--transition-smooth)'
                        }} />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                        >
                            <h2 style={{ fontSize: '1.5rem' }}>Thông Tin Liên Hệ</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-accent)' }}>Họ và Tên</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                                    <input type="text" placeholder="John Doe" style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-accent)' }}>Địa Chỉ Email</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                                    <input type="email" placeholder="john@example.com" style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
                                </div>
                            </div>
                            <Button onClick={handleNext} style={{ marginTop: '1rem' }}>Tiếp Tục <ArrowRight size={18} style={{ marginLeft: '10px' }} /></Button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                        >
                            <h2 style={{ fontSize: '1.5rem' }}>Phương Thức Thanh Toán</h2>
                            <div style={{
                                padding: '1.5rem',
                                border: '1px solid var(--color-accent)',
                                backgroundColor: 'rgba(197, 160, 89, 0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <CreditCard style={{ color: 'var(--color-accent)' }} />
                                <div>
                                    <div style={{ color: 'var(--color-text)', fontSize: '1rem' }}>Thẻ Tín Dụng</div>
                                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Visa, Mastercard, Amex</div>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <Button variant="outline" onClick={handlePrev}><ArrowLeft size={18} style={{ marginRight: '10px' }} /> Quay Lại</Button>
                                <Button onClick={handleNext}>Tiếp Tục <ArrowRight size={18} style={{ marginLeft: '10px' }} /></Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                        >
                            <h2 style={{ fontSize: '1.5rem' }}>Xem Lại & Thanh Toán</h2>
                            <div style={{ backgroundColor: 'var(--color-bg-secondary)', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span>Gói Premium</span>
                                    <span style={{ color: 'var(--color-accent)' }}>$2,500</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.5, fontSize: '0.875rem', marginBottom: '1rem' }}>
                                    <span>Thuế</span>
                                    <span>$0.00</span>
                                </div>
                                <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '1rem 0' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem' }}>
                                    <span>Tổng Cộng</span>
                                    <span style={{ color: 'var(--color-accent)' }}>$2,500</span>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <Button variant="outline" onClick={handlePrev} disabled={isProcessing}>Quay Lại</Button>
                                <Button onClick={handlePayment} disabled={isProcessing}>
                                    {isProcessing ? 'Đang xử lý...' : 'Thanh Toán'}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Payment;
