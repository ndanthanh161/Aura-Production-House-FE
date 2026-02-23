import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, Settings, LogOut, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout: React.FC = () => {
    const { logout } = useAuth();
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
        { name: 'Projects', path: '/admin/projects', icon: <Briefcase size={20} /> },
        { name: 'Packages', path: '/admin/packages', icon: <Package size={20} /> },
        { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
        { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#050505' }}>
            {/* Admin Sidebar */}
            <aside style={{
                width: '260px',
                backgroundColor: '#0a0a0a',
                borderRight: '1px solid #1a1a1a',
                display: 'flex',
                flexDirection: 'column',
                padding: '2rem 1rem',
                position: 'fixed',
                height: '100vh',
                zIndex: 100
            }}>
                <div style={{ marginBottom: '3rem', padding: '0 1rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', letterSpacing: '0.2em', color: 'var(--color-accent)', fontSize: '1.5rem' }}>AURA</h2>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.5, letterSpacing: '0.1em' }}>Admin Control</span>
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
                                color: location.pathname === item.path ? '#fff' : 'rgba(255,255,255,0.5)',
                                backgroundColor: location.pathname === item.path ? 'var(--color-accent)' : 'transparent',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <span style={{ color: location.pathname === item.path ? '#000' : 'inherit' }}>{item.icon}</span>
                            <span style={{ fontWeight: location.pathname === item.path ? '600' : '400', color: location.pathname === item.path ? '#000' : 'inherit' }}>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid #1a1a1a' }}>
                    <button
                        onClick={logout}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '0.75rem 1rem',
                            color: 'rgba(255,255,255,0.5)',
                            textAlign: 'left',
                            borderRadius: '6px',
                            transition: 'all 0.3s ease'
                        }}
                        className="logout-btn"
                    >
                        <LogOut size={20} /> <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{ marginLeft: '260px', flex: 1, backgroundColor: '#050505' }}>
                <header style={{
                    height: '70px',
                    borderBottom: '1px solid #1a1a1a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    padding: '0 2rem',
                    backgroundColor: '#0a0a0a'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#fff' }}>Admin User</div>
                            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Super Admin</div>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: '700' }}>AD</div>
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
