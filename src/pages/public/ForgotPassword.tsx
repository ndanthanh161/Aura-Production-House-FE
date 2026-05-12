import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/authApi';
import { Button } from '../../components/ui/Button';
import { Loader2, ArrowLeft } from 'lucide-react';
import logoColor from '../../assets/LOGO COLOR.png';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Email không đúng định dạng.');
            return;
        }

        setLoading(true);

        try {
            const res = await authApi.forgotPassword(email);
            if (res.succeeded) {
                setSuccess(true);
                // Redirect to reset page after a short delay or immediately
                setTimeout(() => {
                    navigate('/reset-password', { state: { email } });
                }, 2000);
            } else {
                setError(res.message || 'Gửi yêu cầu thất bại.');
            }
        } catch (err) {
            setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            backgroundColor: '#FFFFFF',
            fontFamily: 'var(--font-sans)',
            color: '#1A1A1A',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Link to="/login">
                        <img src={logoColor} alt="AURA Logo" style={{ height: '35px', width: 'auto', marginBottom: '1.5rem' }} />
                    </Link>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Quên mật khẩu?</h1>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                        Nhập email của bạn để nhận mã xác thực (OTP) đặt lại mật khẩu.
                    </p>
                </div>

                {error && (
                    <div style={{
                        marginBottom: '1.5rem',
                        padding: '1rem',
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FCA5A5',
                        borderRadius: '12px',
                        color: '#B91C1C',
                        fontSize: '0.85rem'
                    }}>
                        {error}
                    </div>
                )}

                {success && (
                    <div style={{
                        marginBottom: '1.5rem',
                        padding: '1rem',
                        backgroundColor: '#F0FDF4',
                        border: '1px solid #BBF7D0',
                        borderRadius: '12px',
                        color: '#15803D',
                        fontSize: '0.85rem'
                    }}>
                        Mã OTP đã được gửi đến email của bạn. Đang chuyển hướng...
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Example@email.com"
                            required
                            disabled={loading || success}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                borderRadius: '10px',
                                border: '1px solid #E5E7EB',
                                backgroundColor: '#F9FAFB',
                                outline: 'none',
                                fontSize: '0.9rem'
                            }}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading || success}
                        style={{
                            padding: '0.875rem',
                            borderRadius: '10px',
                            backgroundColor: '#1E293B',
                            color: '#FFF',
                            fontWeight: 700,
                            marginTop: '0.5rem'
                        }}
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : "Gửi mã OTP"}
                    </Button>

                    <Link to="/login" style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        color: '#666',
                        fontSize: '0.9rem',
                        textDecoration: 'none',
                        marginTop: '1rem'
                    }}>
                        <ArrowLeft size={16} /> Quay lại đăng nhập
                    </Link>
                </form>
            </motion.div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default ForgotPassword;
