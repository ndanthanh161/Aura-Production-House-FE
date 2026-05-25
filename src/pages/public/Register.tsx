import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { ArrowRight, Camera, CheckCircle2, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

const fieldStyle: React.CSSProperties = {
    width: '100%',
    padding: '1rem 1.1rem',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.045)',
    color: '#FFFFFF',
    outline: 'none',
    fontSize: '0.9rem',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
};

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.72rem',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    marginBottom: '0.55rem',
    color: 'rgba(255,255,255,0.58)',
};

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password.length < 8) {
            setError('Mật khẩu phải có ít nhất 8 ký tự.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Mật khẩu nhập lại không khớp.');
            return;
        }

        setLoading(true);

        try {
            await register({ fullName: name, email, password, confirmPassword });
            setSuccess('Tạo tài khoản thành công. Đang chuyển hướng đến trang đăng nhập...');
            setTimeout(() => {
                navigate('/login', { replace: true });
            }, 1000);
        } catch (err) {
            console.error('Register error:', err);
            setError(err instanceof Error ? err.message : 'Đăng ký thất bại. Vui lòng thử lại.');
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
        if (!credentialResponse.credential) {
            setError('Không nhận được thông tin xác thực từ Google.');
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
            setError(err instanceof Error ? err.message : 'Đăng ký Google thất bại.');
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <section className="container register-shell">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="register-copy"
                >
                    <span className="register-eyebrow">
                        <Sparkles size={14} />
                        Aura Membership
                    </span>
                    <h1>Tạo Tài Khoản Aura</h1>
                    <p>
                        Bắt đầu quản lý dự án, đặt lịch sản xuất và theo dõi toàn bộ hành trình hình ảnh của bạn trong một không gian riêng.
                    </p>

                    <div className="register-benefits">
                        {[
                            { icon: <Camera size={18} />, text: 'Lưu lịch chụp và dự án của bạn' },
                            { icon: <ShieldCheck size={18} />, text: 'Theo dõi trạng thái bàn giao rõ ràng' },
                            { icon: <CheckCircle2 size={18} />, text: 'Nhận ưu đãi và quyền lợi thành viên' },
                        ].map((item) => (
                            <div key={item.text}>
                                {item.icon}
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="register-panel"
                >
                    <div className="register-panel-header">
                        <span>Đăng ký</span>
                        <h2>Thông Tin Tài Khoản</h2>
                    </div>

                    {error && <div className="register-alert error">{error}</div>}
                    {success && <div className="register-alert success">{success}</div>}

                    <form onSubmit={handleSubmit} className="register-form">
                        <div>
                            <label style={labelStyle}>Họ và tên</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nhập họ và tên"
                                required
                                disabled={loading}
                                style={fieldStyle}
                                className="register-input"
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@domain.com"
                                required
                                disabled={loading}
                                style={fieldStyle}
                                className="register-input"
                            />
                        </div>

                        <div className="register-field-grid">
                            <div>
                                <label style={labelStyle}>Mật khẩu</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Ít nhất 8 ký tự"
                                    required
                                    disabled={loading}
                                    style={fieldStyle}
                                    className="register-input"
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Nhập lại mật khẩu</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Xác nhận mật khẩu"
                                    required
                                    disabled={loading}
                                    style={fieldStyle}
                                    className="register-input"
                                />
                            </div>
                        </div>

                        <Button type="submit" disabled={loading} className="register-submit">
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <>Tạo tài khoản <ArrowRight size={17} /></>}
                        </Button>

                        <div className="register-divider">
                            <span />
                            <p>Hoặc đăng ký với</p>
                            <span />
                        </div>

                        <div className="register-google">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('Đăng ký qua Google thất bại.')}
                                size="large"
                                width="420"
                                text="signup_with"
                                shape="rectangular"
                                theme="filled_black"
                                logo_alignment="center"
                            />
                        </div>

                        <p className="register-login-link">
                            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                        </p>
                    </form>
                </motion.div>
            </section>

            <style>{`
                .register-page {
                    min-height: calc(100vh - 80px);
                    padding: 8rem 0 5rem;
                    background:
                        linear-gradient(90deg, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.48) 48%, rgba(0,0,0,0.82) 100%),
                        url("https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?auto=format&fit=crop&q=80&w=2200") center/cover fixed,
                        #070706;
                    color: #FFFFFF;
                    position: relative;
                    overflow: hidden;
                }
                .register-page::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(180deg, rgba(7,7,6,0.2), #070706 96%);
                    pointer-events: none;
                }
                .register-shell {
                    position: relative;
                    z-index: 1;
                    display: grid;
                    grid-template-columns: minmax(0, 0.95fr) minmax(420px, 0.75fr);
                    gap: clamp(2rem, 5vw, 5rem);
                    align-items: center;
                }
                .register-copy {
                    max-width: 680px;
                }
                .register-eyebrow {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.55rem;
                    color: var(--color-accent);
                    font-size: 0.78rem;
                    font-weight: 800;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    margin-bottom: 1.5rem;
                }
                .register-copy h1 {
                    font-size: clamp(3rem, 7vw, 6.5rem);
                    line-height: 0.95;
                    margin: 0;
                    max-width: 760px;
                    text-shadow: 0 24px 60px rgba(0,0,0,0.5);
                }
                .register-copy p {
                    color: rgba(255,255,255,0.74);
                    font-size: clamp(1rem, 1.5vw, 1.15rem);
                    line-height: 1.8;
                    max-width: 560px;
                    margin: 1.5rem 0 0;
                }
                .register-benefits {
                    display: grid;
                    gap: 0.85rem;
                    margin-top: 2.5rem;
                    max-width: 520px;
                }
                .register-benefits div {
                    display: flex;
                    align-items: center;
                    gap: 0.85rem;
                    color: rgba(255,255,255,0.82);
                    padding: 0.9rem 1rem;
                    border: 1px solid rgba(255,255,255,0.1);
                    background: rgba(255,255,255,0.045);
                    backdrop-filter: blur(16px);
                    border-radius: 8px;
                }
                .register-benefits svg {
                    color: var(--color-accent);
                    flex-shrink: 0;
                }
                .register-panel {
                    padding: clamp(1.5rem, 3vw, 2.25rem);
                    border: 1px solid rgba(255,255,255,0.13);
                    background: rgba(13, 12, 10, 0.76);
                    box-shadow: 0 28px 80px rgba(0,0,0,0.46), 0 1px 0 rgba(255,255,255,0.06) inset;
                    backdrop-filter: blur(24px) saturate(1.1);
                    border-radius: 8px;
                }
                .register-panel-header {
                    margin-bottom: 1.75rem;
                }
                .register-panel-header span {
                    display: block;
                    color: var(--color-accent);
                    font-size: 0.72rem;
                    font-weight: 800;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    margin-bottom: 0.6rem;
                }
                .register-panel-header h2 {
                    font-family: var(--font-display);
                    font-size: clamp(1.9rem, 4vw, 2.8rem);
                    line-height: 1;
                    margin: 0;
                }
                .register-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .register-field-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                .register-input:focus {
                    border-color: rgba(208, 169, 104, 0.72) !important;
                    background: rgba(255,255,255,0.07) !important;
                    box-shadow: 0 0 0 3px rgba(208,169,104,0.1);
                }
                .register-alert {
                    padding: 0.9rem 1rem;
                    border-radius: 8px;
                    font-size: 0.86rem;
                    margin-bottom: 1rem;
                }
                .register-alert.error {
                    color: #fecaca;
                    background: rgba(239, 68, 68, 0.11);
                    border: 1px solid rgba(239, 68, 68, 0.32);
                }
                .register-alert.success {
                    color: #bbf7d0;
                    background: rgba(34, 197, 94, 0.11);
                    border: 1px solid rgba(34, 197, 94, 0.32);
                }
                .register-submit {
                    width: 100%;
                    gap: 0.7rem;
                    padding: 1rem 1.2rem !important;
                    border-radius: 999px !important;
                    background: var(--color-accent) !important;
                    color: #0F0F0F !important;
                    font-weight: 900 !important;
                    font-size: 0.8rem !important;
                    letter-spacing: 0.15em !important;
                    margin-top: 0.5rem;
                }
                .register-submit:hover {
                    background: var(--color-accent-hover) !important;
                    box-shadow: var(--shadow-accent);
                }
                .register-divider {
                    display: grid;
                    grid-template-columns: 1fr auto 1fr;
                    align-items: center;
                    gap: 1rem;
                    margin: 0.75rem 0 0.25rem;
                }
                .register-divider span {
                    height: 1px;
                    background: rgba(255,255,255,0.1);
                }
                .register-divider p {
                    color: rgba(255,255,255,0.42);
                    font-size: 0.72rem;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    margin: 0;
                    text-transform: uppercase;
                }
                .register-google {
                    display: flex;
                    justify-content: center;
                    min-height: 44px;
                }
                .register-login-link {
                    color: rgba(255,255,255,0.66);
                    font-size: 0.88rem;
                    text-align: center;
                    margin: 0.75rem 0 0;
                }
                .register-login-link a {
                    color: var(--color-accent);
                    font-weight: 800;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @media (max-width: 1024px) {
                    .register-page {
                        padding: 7rem 0 4rem;
                        background-attachment: scroll;
                    }
                    .register-shell {
                        grid-template-columns: 1fr;
                    }
                    .register-copy {
                        max-width: 100%;
                    }
                    .register-benefits {
                        display: none;
                    }
                    .register-panel {
                        width: 100%;
                    }
                }
                @media (max-width: 640px) {
                    .register-field-grid {
                        grid-template-columns: 1fr;
                    }
                    .register-copy h1 {
                        font-size: 3rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Register;
