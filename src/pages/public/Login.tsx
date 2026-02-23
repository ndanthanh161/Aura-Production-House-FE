import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, type Role } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Determine role based on email for demo purposes
        let role: Role = 'user';
        if (email.includes('admin')) role = 'admin';
        else if (email.includes('staff')) role = 'staff';

        login(role);
        navigate(role === 'user' ? '/' : `/${role}`);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
            padding: '2rem'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    width: '100%',
                    maxWidth: '450px',
                    padding: '4rem',
                    backgroundColor: '#050505',
                    border: '1px solid var(--color-border)',
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <span style={{
                        color: 'var(--color-accent)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.3em',
                        fontSize: '0.75rem'
                    }}>
                        Welcome Back
                    </span>
                    <h1 style={{
                        fontSize: '2.5rem',
                        marginTop: '1rem',
                        textTransform: 'uppercase',
                        letterSpacing: 'var(--ls-tight)'
                    }}>
                        Login
                    </h1>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '1.25rem 0',
                                backgroundColor: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid var(--color-border)',
                                color: '#fff',
                                outline: 'none',
                                transition: 'var(--transition-cinematic)',
                                fontSize: '0.875rem'
                            }}
                            className="auth-input"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '1.25rem 0',
                                backgroundColor: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid var(--color-border)',
                                color: '#fff',
                                outline: 'none',
                                transition: 'var(--transition-cinematic)',
                                fontSize: '0.875rem'
                            }}
                            className="auth-input"
                        />
                    </div>

                    <Button type="submit" size="lg" style={{ borderRadius: '0', padding: '1.5rem', marginTop: '1rem' }}>
                        Continue <ArrowRight size={18} style={{ marginLeft: '12px' }} />
                    </Button>
                </form>

                <div style={{ marginTop: '3rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    Don't have an account? {' '}
                    <Link to="/register" style={{ color: '#fff', textDecoration: 'none', borderBottom: '1px solid #fff', paddingBottom: '2px' }}>
                        Register
                    </Link>
                </div>

                {/* Demo Helper */}
                <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#0a0a0a', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
                    <p style={{ marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Demo Access:</p>
                    <p>• admin@aura.com / any password</p>
                    <p>• staff@aura.com / any password</p>
                    <p>• user@aura.com / any password</p>
                </div>
            </motion.div>

            <style>{`
                .auth-input:focus {
                    border-bottom-color: var(--color-accent) !important;
                }
                .auth-input::placeholder {
                    color: rgba(255,255,255,0.2) !important;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    font-size: 0.7rem;
                }
            `}</style>
        </div>
    );
};

export default Login;
