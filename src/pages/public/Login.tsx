import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Loader2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import logoColor from '../../assets/LOGO COLOR.png';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Basic validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Email không đúng định dạng.');
            return;
        }

        setLoading(true);

        try {
            const role = await login(email, password);
            if (role === 'admin') {
                navigate('/admin', { replace: true });
            } else if (role === 'photographer') {
                navigate('/photographer', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err instanceof Error ? err.message : 'Đăng nhập thất bại. Vui lòng thử lại.');
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
        if (!credentialResponse.credential) {
            setError('Google login failed: No credential received.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const role = await googleLogin(credentialResponse.credential);
            if (role === 'admin') {
                navigate('/admin', { replace: true });
            } else if (role === 'photographer') {
                navigate('/photographer', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        } catch (err) {
            console.error('Google login error:', err);
            setError(err instanceof Error ? err.message : 'Đăng nhập Google thất bại.');
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            backgroundColor: '#0A0A0A',
            fontFamily: 'var(--font-sans)',
            color: '#FFFFFF',
            overflow: 'hidden'
        }}>
            {/* Left Side: Form Container */}
            <div className="auth-form-container" style={{
                flex: '0 0 45%',
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem 2rem',
                position: 'relative',
                zIndex: 10,
                backgroundColor: '#0A0A0A',
                borderRight: '1px solid rgba(255,255,255,0.05)',
                overflowY: 'auto'
            }}>
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ width: '100%', maxWidth: '400px' }}
                >
                    {/* Home Link Logo */}
                    <Link to="/" style={{
                        display: 'inline-block',
                        marginBottom: '3rem',
                        textDecoration: 'none',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }} className="home-logo-link">
                        <img src={logoColor} alt="AURA Logo" style={{ height: '28px', width: 'auto' }} />
                    </Link>

                    <div style={{ marginBottom: '2.5rem' }}>
                        <span style={{
                            color: '#C09A5A',
                            fontSize: '0.72rem',
                            letterSpacing: '0.25em',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            display: 'block',
                            marginBottom: '0.75rem'
                        }}>
                            Chào Mừng Trở Lại
                        </span>
                        <h1 style={{
                            fontSize: '2rem',
                            fontWeight: 900,
                            margin: '0 0 0.75rem 0',
                            fontFamily: 'var(--font-display)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em',
                            color: '#FFFFFF'
                        }}>
                            ĐĂNG NHẬP HỘI VIÊN
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                            Đăng nhập tài khoản của bạn để truy cập Workspace và quản lý các dự án sản xuất hình ảnh.
                        </p>
                    </div>

                    {error && (
                        <div style={{
                            marginBottom: '2rem',
                            padding: '1rem 1.25rem',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '0px',
                            color: '#EF4444',
                            fontSize: '0.85rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.5)' }}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@domain.com"
                                required
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '0.9rem 1.1rem',
                                    borderRadius: '0px',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    backgroundColor: '#121212',
                                    color: '#FFFFFF',
                                    outline: 'none',
                                    fontSize: '0.85rem',
                                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                                className="login-input"
                            />
                        </div>

                        <div className="form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Mật khẩu</label>
                                <Link to="/forgot-password" style={{ fontSize: '0.75rem', color: '#C09A5A', textDecoration: 'none', fontWeight: 700, letterSpacing: '0.02em' }} className="auth-gold-link">
                                    Quên mật khẩu?
                                </Link>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mật khẩu của bạn"
                                required
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '0.9rem 1.1rem',
                                    borderRadius: '0px',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    backgroundColor: '#121212',
                                    color: '#FFFFFF',
                                    outline: 'none',
                                    fontSize: '0.85rem',
                                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                                className="login-input"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '1.1rem',
                                borderRadius: '0px',
                                backgroundColor: '#C09A5A',
                                color: '#0F0F0F',
                                fontWeight: 900,
                                fontSize: '0.8rem',
                                letterSpacing: '0.2rem',
                                textTransform: 'uppercase',
                                marginTop: '1rem',
                                border: 'none',
                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}
                            className="login-submit-btn"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} style={{ color: '#0F0F0F' }} /> : "Đăng nhập"}
                        </Button>

                        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
                            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
                            <span style={{ padding: '0 1.25rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>Hoặc đăng nhập với</span>
                            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', alignItems: 'center' }}>
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }} className="google-btn-wrapper">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => setError('Đăng nhập Google thất bại.')}
                                    size="large"
                                    width="400"
                                    text="signin_with"
                                    shape="rectangular"
                                    theme="filled_dark"
                                    logo_alignment="center"
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                            Bạn chưa có tài khoản?{' '}
                            <Link to="/register" style={{ color: '#C09A5A', fontWeight: 800, textDecoration: 'none', letterSpacing: '0.05em' }} className="auth-gold-link">
                                ĐĂNG KÝ NGAY
                            </Link>
                        </div>
                    </form>

                    <div style={{ marginTop: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase' }}>
                        © 2024 Aura Studio. TẤT CẢ QUYỀN ĐƯỢC BẢO LƯU
                    </div>
                </motion.div>
            </div>

            {/* Right Side: Visual Image Area */}
            <div className="auth-visual-container" style={{
                flex: '1',
                height: '100vh',
                padding: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#0F0F0F',
                position: 'relative'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '0px',
                        overflow: 'hidden',
                        position: 'relative',
                        border: '1px solid rgba(255,255,255,0.05)',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.6)'
                    }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&q=80&w=2000"
                        alt="Aura Studio Production"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'brightness(0.7) contrast(1.1)'
                        }}
                    />
                    {/* Dark gradient overlay blending with left side */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(to right, #0F0F0F 0%, rgba(15,15,15,0.4) 60%, transparent 100%)',
                        zIndex: 2
                    }} />
                    {/* Inner gold frame overlay */}
                    <div style={{
                        position: 'absolute',
                        inset: '2rem',
                        border: '1px solid rgba(192,154,90,0.15)',
                        zIndex: 3,
                        pointerEvents: 'none'
                    }} />
                </motion.div>
            </div>

            <style>{`
                .home-logo-link:hover {
                    opacity: 0.8;
                }
                .login-input:focus {
                    border-color: #C09A5A !important;
                    background-color: #1A1A1A !important;
                    box-shadow: 0 0 15px rgba(192, 154, 90, 0.15);
                }
                .login-submit-btn:hover {
                    background-color: #D4B275 !important;
                    color: #0F0F0F !important;
                }
                .auth-gold-link {
                    transition: color 0.3s ease;
                }
                .auth-gold-link:hover {
                    color: #FFFFFF !important;
                }
                .google-btn-wrapper iframe {
                    background-color: #121212 !important;
                    border: 1px solid rgba(255,255,255,0.08) !important;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @media (max-width: 1024px) {
                    .auth-form-container {
                        flex: 0 0 100% !important;
                        padding: 2.5rem 1.5rem !important;
                        border-right: none !important;
                    }
                    .auth-visual-container {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
};


export default Login;
