import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import logoColor from '../assets/LOGO COLOR.png';

// Map routes to page titles for the inner-page header display
const pageTitleMap: Record<string, string> = {
    '/portfolio': 'DỰ ÁN',
    '/services': 'QUY TRÌNH',
    '/packages': 'GÓI DỊCH VỤ',
    '/about': 'GIỚI THIỆU',
    '/contact': 'LIÊN HỆ',
    '/payment': 'THANH TOÁN',
    '/login': 'ĐĂNG NHẬP',
    '/register': 'ĐĂNG KÝ',
};

const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 50,
    padding: '0.5rem 0',
    background: 'var(--glass-bg)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--glass-border)',
};

const linkStyle = (active: boolean): React.CSSProperties => ({
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.25em',
    color: 'var(--color-text)',
    opacity: active ? 1 : 0.5,
    fontWeight: active ? 800 : 500,
    transition: 'var(--transition-cinematic)',
});

const homeLinkStyle = (active: boolean): React.CSSProperties => ({
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: active ? '#071FD9' : '#0F0F0F',
    opacity: active ? 1 : 0.8,
    fontWeight: 600,
    transition: 'var(--transition-cinematic)',
});

export const Navbar: React.FC = () => {
    const { role, logout } = useAuth();
    const location = useLocation();

    const isHome = location.pathname === '/';
    const pageTitle = pageTitleMap[location.pathname] || '';

    const leftLinks = [
        { name: 'Giới Thiệu', path: '/about' },
        { name: 'Dự Án', path: '/portfolio' },
        { name: 'Quy Trình', path: '/services' },
    ];

    const rightLinks = [
        { name: 'Gói Dịch Vụ', path: '/packages' },
        { name: 'Liên Hệ', path: '/contact' },
    ];

    const homeLinks = [
        { name: 'Giới Thiệu', path: '/about' },
        { name: 'Dự Án', path: '/portfolio' },
        { name: 'QUY TRÌNH', path: '/services' },
        { name: 'Gói Dịch Vụ', path: '/packages' },
        { name: 'Liên Hệ', path: '/contact' },
    ];

    const isActive = (path: string) => location.pathname === path;

    const authSection = (
        <>
            {role === 'staff' && (
                <Link
                    to="/staff"
                    style={linkStyle(location.pathname.startsWith('/staff'))}
                    className="hover-link"
                >
                    Thống Kê
                </Link>
            )}
            {role === 'photographer' && (
                <Link
                    to="/photographer"
                    style={linkStyle(location.pathname.startsWith('/photographer'))}
                    className="hover-link"
                >
                    Workspace
                </Link>
            )}
            {role === 'admin' && (
                <Link to="/admin" style={{ fontSize: '0.7rem', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                    Quản trị
                </Link>
            )}
            {!role ? (
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link to="/login" style={{
                        color: 'var(--color-text)', fontSize: '0.7rem', letterSpacing: '0.2em',
                        textTransform: 'uppercase', fontWeight: 600, opacity: 0.5,
                    }} className="hover-link">
                        Đăng Nhập
                    </Link>
                    <Link to="/register" style={{
                        backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)',
                        padding: '0.6rem 1.2rem', fontSize: '0.65rem', letterSpacing: '0.15em',
                        textTransform: 'uppercase', fontWeight: 800,
                        transition: 'var(--transition-cinematic)',
                    }} className="btn-join">
                        Tham Gia
                    </Link>
                </div>
            ) : (
                <button onClick={logout} style={{ color: 'var(--color-text)', opacity: 0.5, display: 'flex' }}>
                    <LogOut size={14} />
                </button>
            )}
        </>
    );

    const hoverStyles = (
        <style>{`
            .hover-link { position: relative; }
            .hover-link::after {
                content: ''; position: absolute; bottom: -8px; left: 0;
                width: 0; height: 1px; background-color: var(--color-accent);
                transition: var(--transition-cinematic); transform: scaleX(0);
                transform-origin: bottom left;
            }
            .hover-link:hover {
                opacity: 1 !important;
                color: var(--color-neon) !important;
            }
            .hover-link:hover::after,
            .hover-link.active::after {
                transform: scaleX(1);
                background-color: var(--color-neon);
            }
            .btn-join:hover {
                background-color: var(--color-neon) !important;
                color: #0F0F0F !important;
                box-shadow: 0 0 15px rgba(173, 255, 0, 0.4);
            }
            @media (max-width: 1024px) {
                .nav-group { display: none !important; }
                .navbar-container { justify-content: center !important; }
            }
        `}</style>
    );

    // ─── BOTTOM RENDER SELECTION ───
    if (!isHome) {
        return (
            <nav style={navStyle}>
                <div className="container navbar-container" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', position: 'relative', minHeight: '56px',
                }}>
                    <div className="nav-group left" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', flex: 1 }}>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={logoColor} alt="AURA Logo Color" style={{ display: 'block', height: '24px', maxWidth: '140px', objectFit: 'contain' }} />
                        </Link>
                        {leftLinks.map((link) => (
                            <Link key={link.name} to={link.path} style={linkStyle(isActive(link.path))} className="hover-link">
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div style={{
                        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
                        zIndex: 2, pointerEvents: 'none',
                    }}>
                        <span style={{
                            fontFamily: 'var(--font-sans)', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                            fontWeight: 300, letterSpacing: '0.3em', color: 'var(--color-text)', textTransform: 'uppercase',
                        }}>
                            {pageTitle}
                        </span>
                    </div>

                    <div className="nav-group right" style={{ display: 'flex', gap: '2.5rem', justifyContent: 'flex-end', alignItems: 'center', flex: 1 }}>
                        {rightLinks.map((link) => (
                            <Link key={link.name} to={link.path} style={linkStyle(isActive(link.path))} className="hover-link">
                                {link.name}
                            </Link>
                        ))}
                        {authSection}
                    </div>
                </div>
                {hoverStyles}
            </nav>
        );
    }

    // ─── HOME PAGE NAVBAR (logo far left, links centered, auth far right) ───
    return (
        <nav style={{
            ...navStyle,
            background: '#FFFFFF',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
            <div className="container navbar-container" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '100%', position: 'relative', minHeight: '64px',
                gap: '3rem'
            }}>
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', marginRight: '2.5rem' }}>
                    <img src={logoColor} alt="AURA Logo" style={{ height: '32px', maxWidth: '140px', objectFit: 'contain' }} />
                </Link>

                {/* Main Links */}
                <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                    {homeLinks.map((link) => (
                        <Link key={link.name} to={link.path} style={homeLinkStyle(isActive(link.path))} className="hover-link-dark">
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Auth links */}
                <div className="nav-group right-auth" style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginLeft: '2.5rem' }}>
                    {role === 'staff' && (
                        <Link
                            to="/staff"
                            style={homeLinkStyle(location.pathname.startsWith('/staff'))}
                            className="hover-link-dark"
                        >
                            Thống Kê
                        </Link>
                    )}
                    {role === 'photographer' && (
                        <Link
                            to="/photographer"
                            style={homeLinkStyle(location.pathname.startsWith('/photographer'))}
                            className="hover-link-dark"
                        >
                            Workspace
                        </Link>
                    )}
                    {role === 'admin' && (
                        <Link to="/admin" style={{
                            color: '#071FD9', fontSize: '0.75rem', letterSpacing: '0.15em',
                            textTransform: 'uppercase', fontWeight: 700, opacity: 0.9,
                        }} className="hover-link-dark">
                            Quản trị
                        </Link>
                    )}
                    {!role ? (
                        <>
                            <Link to="/login" style={{
                                color: '#0F0F0F', fontSize: '0.75rem', letterSpacing: '0.15em',
                                textTransform: 'uppercase', fontWeight: 600, opacity: 0.8,
                            }} className="hover-link-dark">
                                Đăng Nhập
                            </Link>
                            <Link to="/register" style={{
                                backgroundColor: '#071FD9', color: '#FFFFFF',
                                padding: '0.7rem 1.8rem', fontSize: '0.7rem', letterSpacing: '0.15em',
                                textTransform: 'uppercase', fontWeight: 800,
                                borderRadius: '0',
                                transition: 'var(--transition-cinematic)',
                            }} className="btn-join-home">
                                Tham Gia
                            </Link>
                        </>
                    ) : (
                        <button onClick={logout} style={{ color: '#0F0F0F', opacity: 0.8, display: 'flex' }}>
                            <LogOut size={16} />
                        </button>
                    )}
                </div>
            </div>
            <style>{`
                .hover-link-dark { position: relative; }
                .hover-link-dark::after {
                    content: ''; position: absolute; bottom: -4px; left: 0;
                    width: 0; height: 1px; background-color: #071FD9;
                    transition: var(--transition-cinematic); transform: scaleX(0);
                    transform-origin: bottom left;
                }
                .hover-link-dark:hover { opacity: 1 !important; color: #071FD9 !important; }
                .hover-link-dark:hover::after, .hover-link-dark.active::after { transform: scaleX(1); }
                .btn-join-home:hover {
                    background-color: #0516A0 !important;
                    box-shadow: 0 4px 15px rgba(7, 31, 217, 0.2);
                    transform: translateY(-1px);
                }
            `}</style>
            {hoverStyles}
        </nav>
    );
};
