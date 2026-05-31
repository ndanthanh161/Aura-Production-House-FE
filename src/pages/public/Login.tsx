import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { ArrowRight, Loader2, LockKeyhole, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

const inputStyle: React.CSSProperties = {
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
            setError(err instanceof Error ? err.message : 'Đăng nhập Google thất bại.');
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <section className="container login-shell">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="login-panel"
                >
                    <span className="login-eyebrow">
                        <LockKeyhole size={14} />
                        Member Access
                    </span>
                    <h1>Đăng Nhập Hội Viên</h1>
                    <p className="login-intro">
                        Truy cập workspace để theo dõi dự án, lịch chụp và các nội dung đang được Aura sản xuất cho bạn.
                    </p>

                    {error && <div className="login-alert">{error}</div>}

                    <form onSubmit={handleSubmit} className="login-form">
                        <div>
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@domain.com"
                                required
                                disabled={loading}
                                style={inputStyle}
                                className="login-input"
                            />
                        </div>

                        <div>
                            <div className="login-label-row">
                                <label>Mật khẩu</label>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mật khẩu của bạn"
                                required
                                disabled={loading}
                                style={inputStyle}
                                className="login-input"
                            />
                            <div className="login-forgot-row">
                                <Link to="/forgot-password">Quên mật khẩu?</Link>
                            </div>
                        </div>

                        <Button type="submit" disabled={loading} className="login-submit-btn">
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <>Đăng nhập <ArrowRight size={17} /></>}
                        </Button>

                        <div className="login-divider">
                            <span />
                            <p>Hoặc đăng nhập với</p>
                            <span />
                        </div>

                        <div className="login-google">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('Đăng nhập Google thất bại.')}
                                size="large"
                                width="360"
                                text="signin_with"
                                shape="rectangular"
                                theme="outline"
                                logo_alignment="center"
                            />
                        </div>

                        <p className="login-register-link">
                            Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                        </p>
                    </form>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="login-visual"
                >
                    <img
                        src="https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&q=80&w=2000"
                        alt="Aura production workspace"
                    />
                    <div className="login-visual-caption">
                        <Sparkles size={15} />
                        <span>Creative production, tracked from brief to final delivery.</span>
                    </div>
                </motion.div>
            </section>

            <style>{`
                .login-page {
                    height: 100vh;
                    padding-top: 80px;
                    box-sizing: border-box;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background:
                        linear-gradient(180deg, rgba(7,7,6,0.12), #070706 94%),
                        radial-gradient(circle at 20% 10%, rgba(173, 255, 0,0.12), transparent 28rem),
                        #070706;
                    color: #FFFFFF;
                    overflow: hidden;
                }
                .login-shell {
                    display: grid;
                    grid-template-columns: minmax(360px, 0.72fr) minmax(0, 1fr);
                    gap: clamp(2rem, 5vw, 5rem);
                    align-items: center;
                    width: 100%;
                }
                .login-panel {
                    width: 100%;
                    max-width: 460px;
                    margin: 0 auto;
                    padding: clamp(1.2rem, 2.5vw, 2rem);
                    border: 1px solid rgba(255,255,255,0.13);
                    background: rgba(13, 12, 10, 0.78);
                    box-shadow: 0 28px 80px rgba(0,0,0,0.42), 0 1px 0 rgba(255,255,255,0.06) inset;
                    backdrop-filter: blur(22px);
                    border-radius: 8px;
                }
                .login-eyebrow {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.55rem;
                    color: var(--color-accent);
                    font-size: 0.76rem;
                    font-weight: 800;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    margin-bottom: 1rem;
                }
                .login-panel h1 {
                    font-size: clamp(1.75rem, 3vw, 2.5rem);
                    line-height: 1.2;
                    margin: 0;
                }
                .login-intro {
                    color: rgba(255,255,255,0.66);
                    line-height: 1.75;
                    margin: 1rem 0 2rem;
                }
                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .login-form label,
                .login-label-row label {
                    display: block;
                    font-size: 0.72rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.14em;
                    margin-bottom: 0.55rem;
                    color: rgba(255,255,255,0.58);
                }
                .login-label-row {
                    display: flex;
                    justify-content: space-between;
                    gap: 1rem;
                    align-items: center;
                }
                .login-label-row a {
                    color: var(--color-accent);
                    font-size: 0.78rem;
                    font-weight: 700;
                    margin-bottom: 0.55rem;
                    white-space: nowrap;
                }
                .login-forgot-row {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 0.5rem;
                }
                .login-forgot-row a {
                    color: var(--color-accent);
                    font-size: 0.78rem;
                    font-weight: 700;
                    white-space: nowrap;
                }
                .login-input:focus {
                    border-color: rgba(173, 255, 0, 0.72) !important;
                    background: rgba(255,255,255,0.07) !important;
                    box-shadow: 0 0 0 3px rgba(173, 255, 0,0.1);
                }
                .login-input:-webkit-autofill,
                .login-input:-webkit-autofill:hover, 
                .login-input:-webkit-autofill:focus, 
                .login-input:-webkit-autofill:active {
                    -webkit-box-shadow: 0 0 0 30px #13120a inset !important;
                    -webkit-text-fill-color: #FFFFFF !important;
                    transition: background-color 5000s ease-in-out 0s;
                }
                .login-submit-btn {
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
                .login-submit-btn:hover {
                    background: var(--color-accent-hover) !important;
                    box-shadow: var(--shadow-accent);
                }
                .login-alert {
                    color: #fecaca;
                    background: rgba(239, 68, 68, 0.11);
                    border: 1px solid rgba(239, 68, 68, 0.32);
                    padding: 0.9rem 1rem;
                    border-radius: 8px;
                    font-size: 0.86rem;
                    margin-bottom: 1.25rem;
                }
                .login-divider {
                    display: grid;
                    grid-template-columns: 1fr auto 1fr;
                    align-items: center;
                    gap: 1rem;
                    margin: 0.75rem 0 0.25rem;
                }
                .login-divider span {
                    height: 1px;
                    background: rgba(255,255,255,0.1);
                }
                .login-divider p {
                    color: rgba(255,255,255,0.42);
                    font-size: 0.72rem;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    margin: 0;
                    text-transform: uppercase;
                }
                .login-google {
                    display: flex;
                    justify-content: center;
                    min-height: 44px;
                }
                .login-register-link {
                    color: rgba(255,255,255,0.66);
                    font-size: 0.88rem;
                    text-align: center;
                    margin: 0.75rem 0 0;
                }
                .login-register-link a {
                    color: var(--color-accent);
                    font-weight: 800;
                }
                .login-visual {
                    height: 100%;
                    min-height: 480px;
                    max-height: calc(100vh - 160px);
                    position: relative;
                    border-radius: 8px;
                    overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.1);
                    box-shadow: 0 28px 80px rgba(0,0,0,0.45);
                }
                .login-visual img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    filter: brightness(0.78) contrast(1.05);
                }
                .login-visual::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(180deg, transparent 42%, rgba(0,0,0,0.72));
                }
                .login-visual-caption {
                    position: absolute;
                    left: 2rem;
                    right: 2rem;
                    bottom: 2rem;
                    z-index: 2;
                    display: flex;
                    gap: 0.75rem;
                    align-items: center;
                    color: rgba(255,255,255,0.82);
                    font-weight: 700;
                    letter-spacing: 0.03em;
                }
                .login-visual-caption svg {
                    color: var(--color-accent);
                    flex-shrink: 0;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @media (max-width: 1024px) {
                    .login-page {
                        padding: 7rem 0 4rem;
                    }
                    .login-shell {
                        grid-template-columns: 1fr;
                    }
                    .login-visual {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default Login;
