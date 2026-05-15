import React from 'react';
import logo from '../assets/LOGO COLOR.png';

import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, User as UserIcon, LogOut, ChevronRight, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PhotographerLayout: React.FC = () => {
    const { logout, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/', { replace: true });
    };

    const navItems = [
        { name: 'Tổng Quan',  path: '/photographer',          icon: <LayoutDashboard size={20} /> },
        { name: 'Dự Án',      path: '/photographer/projects',  icon: <Briefcase size={20} /> },
        { name: 'Hồ Sơ',      path: '/photographer/profile',   icon: <UserIcon size={20} /> },
    ];

    const isActive = (path: string) =>
        path === '/photographer'
            ? location.pathname === '/photographer'
            : location.pathname.startsWith(path);

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
                height: '100vh',
            }}>

                <div style={{ marginBottom: '2.5rem', padding: '0 0.5rem' }}>
                    <Link to="/" style={{ textDecoration: 'none', display: 'block', marginBottom: '0.5rem' }}>
                        <img 
                            src={logo} 
                            alt="Aura Logo" 
                            style={{ height: '28px', display: 'block' }} 
                        />
                    </Link>
                    <span style={{ 
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.75rem', 
                        textTransform: 'uppercase', 
                        color: 'var(--color-accent)',
                        opacity: 0.8, 
                        letterSpacing: '0.15em',
                        fontWeight: 700
                    }}>
                        Photographer Portal
                    </span>
                    {user && (
                        <div style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: 600 }}>
                            {user.fullName}
                        </div>
                    )}
                </div>


                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
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
                                color: isActive(item.path) ? 'var(--color-accent)' : 'var(--color-text-muted)',
                                backgroundColor: isActive(item.path) ? 'rgba(197, 160, 89, 0.1)' : 'transparent',
                                transition: 'var(--transition-smooth)',
                                textDecoration: 'none',
                            }}
                        >
                            {item.icon}
                            <span style={{ fontWeight: isActive(item.path) ? 600 : 400 }}>{item.name}</span>
                            {isActive(item.path) && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
                        </Link>
                    ))}
                </nav>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.35rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0.875rem 1rem', color: 'var(--color-text-muted)', textDecoration: 'none', borderRadius: '8px' }}>
                        <Home size={20} /> <span>Trang Chủ</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0.875rem 1rem', color: 'var(--color-text-muted)', textAlign: 'left', borderRadius: '8px', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}
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
