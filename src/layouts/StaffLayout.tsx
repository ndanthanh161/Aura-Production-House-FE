import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, User as UserIcon, LogOut, ChevronRight, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PhotographerLayout: React.FC = () => {
    const { logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/', { replace: true });
    };

    const navItems = [
        { name: 'Tổng Quan', path: '/photographer', icon: <LayoutDashboard size={20} /> },
        { name: 'Dự Án', path: '/photographer/projects', icon: <Briefcase size={20} /> },
        { name: 'Hồ Sơ', path: '/photographer/profile', icon: <UserIcon size={20} /> },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
            {/* Sidebar */}
            <aside style={{
                width: '280px',
                borderRight: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                padding: '2rem 1.5rem',
                position: 'fixed',
                height: '100vh'
            }}>
                <div style={{ marginBottom: '3rem', padding: '0 0.5rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', letterSpacing: '0.2em', color: 'var(--color-accent)' }}>AURA</h2>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.5 }}>Không Gian Làm Việc</span>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '0.875rem 1rem',
                                borderRadius: '8px',
                                color: location.pathname === item.path ? 'var(--color-accent)' : 'var(--color-text-muted)',
                                backgroundColor: location.pathname === item.path ? 'rgba(197, 160, 89, 0.1)' : 'transparent',
                                transition: 'var(--transition-smooth)'
                            }}
                        >
                            {item.icon}
                            <span style={{ fontWeight: location.pathname === item.path ? '600' : '400' }}>{item.name}</span>
                            {location.pathname === item.path && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
                        </Link>
                    ))}
                </nav>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0.875rem 1rem', color: 'var(--color-text-muted)' }}>
                        <Home size={20} /> <span>Trang Chủ</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0.875rem 1rem', color: 'var(--color-text-muted)', textAlign: 'left' }}
                    >
                        <LogOut size={20} /> <span>Đăng Xuất</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ marginLeft: '280px', flex: 1, padding: '2rem 3rem' }}>
                <Outlet />
            </main>
        </div>
    );
};
