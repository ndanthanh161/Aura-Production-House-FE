import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Users, LogOut, Camera, CalendarCheck, BarChart3, Bot, Image } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout: React.FC = () => {
    const { logout, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/', { replace: true });
    };

    const navItems = [
        { name: 'Tổng Quan', path: '/admin', icon: <LayoutDashboard size={20} />, exact: true },
        { name: 'Dịch Vụ', path: '/admin/packages', icon: <Package size={20} /> },
        { name: 'AI Trí Tuệ', path: '/admin/ai', icon: <Bot size={20} /> },
        { name: 'Photographer', path: '/admin/photographers', icon: <Camera size={20} /> },
        { name: 'Dự Án', path: '/admin/projects', icon: <CalendarCheck size={20} /> },
        { name: 'Portfolio', path: '/admin/portfolio', icon: <Image size={20} /> },
        { name: 'Khách Hàng', path: '/admin/customers', icon: <Users size={20} /> },
        { name: 'Thống Kê', path: '/admin/statistics', icon: <BarChart3 size={20} /> },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
            {/* Admin Sidebar */}
            <aside style={{
                width: '260px',
                backgroundColor: 'var(--color-bg-secondary)',
                borderRight: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                padding: '2rem 1rem',
                position: 'fixed',
                height: '100vh',
                zIndex: 100
            }}>
                <div style={{ marginBottom: '3rem', padding: '0 1rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', letterSpacing: '0.2em', color: 'var(--color-accent)', fontSize: '1.5rem' }}>AURA</h2>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.5, letterSpacing: '0.1em' }}>Quản Trị</span>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '0.75rem 1rem',
                                borderRadius: '6px',
                                color: (item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)) ? 'var(--color-bg)' : 'var(--color-text-muted)',
                                backgroundColor: (item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)) ? 'var(--color-accent)' : 'transparent',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <span style={{ color: (item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)) ? 'var(--color-bg)' : 'inherit' }}>{item.icon}</span>
                            <span style={{ fontWeight: (item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)) ? '600' : '400', color: (item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)) ? 'var(--color-bg)' : 'inherit' }}>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '0.75rem 1rem',
                            color: 'var(--color-text-muted)',
                            textAlign: 'left',
                            borderRadius: '6px',
                            transition: 'all 0.3s ease'
                        }}
                        className="logout-btn"
                    >
                        <LogOut size={20} /> <span>Đăng Xuất</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{ marginLeft: '260px', flex: 1, backgroundColor: 'var(--color-bg)' }}>
                <header style={{
                    height: '70px',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    padding: '0 2rem',
                    backgroundColor: 'var(--color-bg-secondary)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text)' }}>{user?.fullName || 'Admin'}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user?.role || 'Admin'}</div>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-bg)', fontWeight: '700' }}>{user?.fullName?.charAt(0)?.toUpperCase() || 'A'}</div>
                    </div>
                </header>
                <div style={{ padding: '2.5rem' }}>
                    <Outlet />
                </div>
            </main>
            <style>{`
        .logout-btn:hover {
            background-color: rgba(255,0,0,0.1);
            color: #ff4d4d !important;
        }
      `}</style>
        </div>
    );
};
