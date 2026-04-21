import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Loader2 } from 'lucide-react';
import logoColor from '../../assets/LOGO COLOR.png';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/', { replace: true });
        } catch (err) {
            console.error('Login error:', err);
            setError(err instanceof Error ? err.message : 'Đăng nhập thất bại. Vui lòng thử lại.');
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
            overflow: 'hidden'
        }}>
            {/* Left Side: Form Container */}
            <div style={{
                flex: '0 0 45%',
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                position: 'relative',
                zIndex: 10,
                overflowY: 'auto'
            }}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ width: '100%', maxWidth: '400px' }}
                >
                    {/* Home Link Logo */}
                    <Link to="/" style={{
                        display: 'inline-block',
                        marginBottom: '2rem',
                        textDecoration: 'none',
                        transition: 'all 0.2s'
                    }} className="home-logo-link">
                        <img src={logoColor} alt="AURA Logo" style={{ height: '30px', width: 'auto' }} />
                    </Link>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>
                            Chào mừng quay trở lại
                        </h1>
                        <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                            Hôm nay là một ngày mới. Đây là ngày của bạn. Hãy kiến tạo nó.<br />
                            Đăng nhập để bắt đầu quản lý các dự án của bạn.
                        </p>
                    </div>

                    {error && (
                        <div style={{
                            marginBottom: '2rem',
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

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Example@email.com"
                                required
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '10px',
                                    border: '1px solid #E5E7EB',
                                    backgroundColor: '#F9FAFB',
                                    outline: 'none',
                                    fontSize: '0.9rem',
                                    transition: 'border-color 0.2s'
                                }}
                                className="login-input"
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Mật khẩu</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Ít nhất 8 ký tự"
                                required
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '10px',
                                    border: '1px solid #E5E7EB',
                                    backgroundColor: '#F9FAFB',
                                    outline: 'none',
                                    fontSize: '0.9rem',
                                    transition: 'border-color 0.2s'
                                }}
                                className="login-input"
                            />
                            <div style={{ textAlign: 'right', marginTop: '0.4rem' }}>
                                <Link to="#" style={{ fontSize: '0.8rem', color: '#3182CE', textDecoration: 'none', fontWeight: 500 }}>
                                    Quên mật khẩu?
                                </Link>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '0.875rem',
                                borderRadius: '10px',
                                backgroundColor: '#1E293B',
                                color: '#FFF',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                marginTop: '0.5rem'
                            }}
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : "Đăng nhập"}
                        </Button>

                        <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
                            <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
                            <span style={{ padding: '0 1rem', color: '#999', fontSize: '0.8rem' }}>Hoặc</span>
                            <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <button type="button" style={socialButtonStyle}>
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '18px', height: '18px' }} />
                                Đăng nhập với Google
                            </button>
                            <button type="button" style={socialButtonStyle}>
                                <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" style={{ width: '18px', height: '18px' }} />
                                Đăng nhập với Facebook
                            </button>
                        </div>

                        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#666' }}>
                            Bạn chưa có tài khoản?{' '}
                            <Link to="/register" style={{ color: '#3182CE', fontWeight: 600, textDecoration: 'none' }}>
                                Đăng ký
                            </Link>
                        </div>
                    </form>

                    <div style={{ marginTop: '3rem', textAlign: 'center', color: '#999', fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                        © 2024 Aura Studio. TẤT CẢ QUYỀN ĐƯỢC BẢO LƯU
                    </div>
                </motion.div>
            </div>

            {/* Right Side: Visual Image Area */}
            <div style={{
                flex: '1',
                height: '100vh',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2 }}
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '32px',
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)'
                    }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&q=80&w=2000"
                        alt="Aura Studio Production"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.05)'
                    }} />
                </motion.div>
            </div>

            <style>{`
                .home-logo-link:hover {
                    color: #1A1A1A !important;
                    transform: translateY(-1px);
                    opacity: 1;
                }
                .login-input:focus {
                    border-color: #3182CE !important;
                    background-color: #FFF !important;
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

const socialButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.6rem',
    width: '100%',
    padding: '0.75rem',
    borderRadius: '10px',
    border: '1px solid #E5E7EB',
    backgroundColor: '#F9FAFB',
    color: '#4B5563',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s'
};

export default Login;