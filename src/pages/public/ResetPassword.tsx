import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../services/authApi';
import { Button } from '../../components/ui/Button';
import { Loader2, KeyRound } from 'lucide-react';
import logoColor from '../../assets/LOGO COLOR.png';

const ResetPassword: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (location.state && location.state.email) {
            setEmail(location.state.email);
        }
    }, [location]);

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtpValues = [...otpValues];
        newOtpValues[index] = value.slice(-1); // Only take last character
        setOtpValues(newOtpValues);

        // Move focus to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
        const newOtpValues = [...otpValues];
        pastedData.forEach((char, i) => {
            if (/^\d$/.test(char)) {
                newOtpValues[i] = char;
            }
        });
        setOtpValues(newOtpValues);
        
        // Focus the last filled input or the next empty one
        const lastIndex = Math.min(pastedData.length, 5);
        inputRefs.current[lastIndex]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const otp = otpValues.join('');
        if (otp.length !== 6) {
            setError('Vui lòng nhập đủ 6 chữ số mã OTP.');
            return;
        }

        if (newPassword.length < 6) {
            setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }

        setLoading(true);

        try {
            const res = await authApi.resetPassword({ email, otp, newPassword });
            if (res.succeeded) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(res.message || 'Đặt lại mật khẩu thất bại.');
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
                style={{ width: '100%', maxWidth: '450px', padding: '2rem' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Link to="/login">
                        <img src={logoColor} alt="AURA Logo" style={{ height: '35px', width: 'auto', marginBottom: '1.5rem' }} />
                    </Link>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Đặt lại mật khẩu</h1>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                        Nhập mã OTP đã nhận qua email và mật khẩu mới của bạn.
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
                        Mật khẩu đã được đặt lại thành công! Đang chuyển hướng về trang đăng nhập...
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={true}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                borderRadius: '10px',
                                border: '1px solid #E5E7EB',
                                backgroundColor: '#F3F4F6',
                                outline: 'none',
                                fontSize: '0.9rem',
                                color: '#6B7280'
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.8rem' }}>Mã xác thực OTP</label>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }} onPaste={handlePaste}>
                            {otpValues.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={(el) => { inputRefs.current[i] = el; }}
                                    type="text"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                    maxLength={1}
                                    disabled={loading || success}
                                    style={{
                                        width: '45px',
                                        height: '55px',
                                        textAlign: 'center',
                                        fontSize: '1.25rem',
                                        fontWeight: '700',
                                        borderRadius: '10px',
                                        border: '1px solid #E5E7EB',
                                        backgroundColor: '#F9FAFB',
                                        outline: 'none',
                                        transition: 'all 0.2s'
                                    }}
                                    className="otp-input"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Mật khẩu mới</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Ít nhất 6 ký tự"
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

                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Nhập lại mật khẩu"
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
                            marginTop: '0.5rem',
                            gap: '0.5rem'
                        }}
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <><KeyRound size={18} /> Đặt lại mật khẩu</>}
                    </Button>
                </form>
            </motion.div>

            <style>{`
                .otp-input:focus {
                    border-color: #3182CE !important;
                    background-color: #FFF !important;
                    box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.1);
                }
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

export default ResetPassword;
