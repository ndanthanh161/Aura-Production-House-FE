import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoColor from '../assets/LOGO COLOR.png';

// Map routes to page titles for the inner-page header display
const pageTitleMap: Record<string, string> = {
    '/portfolio': 'DỰ ÁN',
    '/services': 'QUY TRÌNH',
    '/packages': 'GÓI DỊCH VỤ',
    '/about': 'GIỚI THIỆU',
    '/contact': 'LIÊN HỆ',
    '/projects': 'DỰ ÁN CỦA TÔI',
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
    const [isOpen, setIsOpen] = useState(false);

    const isHome = location.pathname === '/';

    // Logic lấy tiêu đề hiển thị ở giữa Navbar
    let pageTitle = pageTitleMap[location.pathname] || '';
    if (!pageTitle && location.pathname.startsWith('/purchase/')) {
        pageTitle = 'THANH TOÁN';
    }

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
        { name: 'Quy Trình', path: '/services' },
        { name: 'Gói Dịch Vụ', path: '/packages' },
        { name: 'Liên Hệ', path: '/contact' },
    ];

    const isActive = (path: string) => location.pathname === path;

    const authSection = (
        <>
            {role === 'photographer' && (
                <Link
                    to="/photographer"
                    style={linkStyle(location.pathname.startsWith('/photographer'))}
                    className="hover-link"
                >
                    Workspace
                </Link>
            )}
            {role === 'user' && (
                <Link
                    to="/projects"
                    style={linkStyle(isActive('/projects'))}
                    className="hover-link"
                >
                    DỰ ÁN CỦA TÔI
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
            .mobile-menu-toggle {
                display: none;
                background: none;
                border: none;
                cursor: pointer;
                align-items: center;
                justify-content: center;
                padding: 0.5rem;
            }
            @media (max-width: 1024px) {
                .nav-group, .nav-desktop-links, .right-auth, .nav-title-middle { display: none !important; }
                .navbar-container { justify-content: space-between !important; padding: 0 1.5rem !important; }
                .mobile-menu-toggle { display: flex !important; }
                .mobile-logo-btn { display: flex !important; }
            }
        `}</style>
    );

    const mobileMenuDrawer = (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            backgroundColor: '#000000',
                            zIndex: 99,
                        }}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            width: '100%',
                            maxWidth: '360px',
                            height: '100vh',
                            backgroundColor: '#FFFFFF',
                            boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
                            zIndex: 100,
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '2rem 1.5rem',
                            overflowY: 'auto'
                        }}
                    >
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
                            <Link to="/" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center' }}>
                                <img src={logoColor} alt="AURA Logo" style={{ height: '24px', objectFit: 'contain' }} />
                            </Link>
                            <button onClick={() => setIsOpen(false)} style={{ color: '#0F0F0F', cursor: 'pointer', padding: '0.25rem' }}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: 'auto' }}>
                            {homeLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    style={{
                                        fontSize: '1.1rem',
                                        fontWeight: isActive(link.path) ? '800' : '500',
                                        color: isActive(link.path) ? '#071FD9' : '#0F0F0F',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.15em',
                                        transition: 'color 0.3s'
                                    }}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Auth actions at bottom */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '1px solid #EEE', paddingTop: '2rem', marginTop: '2rem' }}>
                            {role === 'photographer' && (
                                <Link to="/photographer" onClick={() => setIsOpen(false)} style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F0F0F', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    Workspace
                                </Link>
                            )}
                            {role === 'user' && (
                                <Link to="/projects" onClick={() => setIsOpen(false)} style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F0F0F', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    Dự Án Của Tôi
                                </Link>
                            )}
                            {role === 'admin' && (
                                <Link to="/admin" onClick={() => setIsOpen(false)} style={{ fontSize: '0.9rem', fontWeight: 700, color: '#071FD9', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    Quản trị
                                </Link>
                            )}
                            {!role ? (
                                <>
                                    <Link to="/login" onClick={() => setIsOpen(false)} style={{
                                        fontSize: '0.9rem', fontWeight: 600, color: '#0F0F0F', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8
                                    }}>
                                        Đăng Nhập
                                    </Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)} style={{
                                        backgroundColor: '#071FD9', color: '#FFFFFF', padding: '0.9rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em'
                                    }}>
                                        Tham Gia
                                    </Link>
                                </>
                            ) : (
                                <button onClick={() => { logout(); setIsOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#FF3B30', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}>
                                    <LogOut size={16} /> Đăng Xuất
                                </button>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );

    // ─── BOTTOM RENDER SELECTION ───
    if (!isHome) {
        return (
            <nav style={navStyle}>
                <div className="container navbar-container" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', position: 'relative', minHeight: '56px',
                }}>
                    {/* Mobile Logo */}
                    <Link to="/" className="mobile-logo-btn" style={{ display: 'none', alignItems: 'center', zIndex: 10 }}>
                        <img src={logoColor} alt="AURA Logo Mobile" style={{ display: 'block', height: '24px', maxWidth: '140px', objectFit: 'contain' }} />
                    </Link>

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

                    <div className="nav-title-middle" style={{
                        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
                        zIndex: 2, pointerEvents: 'none',
                    }}>
                        <span style={{
                            fontFamily: 'var(--font-sans)', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                            fontWeight: 300, letterSpacing: '0.05em', color: 'var(--color-text)', textTransform: 'uppercase',
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

                    {/* Hamburger Button */}
                    <button className="mobile-menu-toggle" onClick={() => setIsOpen(true)} style={{ color: 'var(--color-text)' }}>
                        <Menu size={24} />
                    </button>
                </div>
                {hoverStyles}
                {mobileMenuDrawer}
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
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', position: 'relative', minHeight: '64px',
            }}>
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={logoColor} alt="AURA Logo" style={{ height: '32px', maxWidth: '140px', objectFit: 'contain' }} />
                </Link>

                {/* Main Links */}
                <div className="nav-desktop-links" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', margin: '0 auto' }}>
                    {homeLinks.map((link) => (
                        <Link key={link.name} to={link.path} style={homeLinkStyle(isActive(link.path))} className="hover-link-dark">
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Auth links */}
                <div className="nav-group right-auth" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    {role === 'photographer' && (
                        <Link
                            to="/photographer"
                            style={homeLinkStyle(location.pathname.startsWith('/photographer'))}
                            className="hover-link-dark"
                        >
                            Workspace
                        </Link>
                    )}
                    {role === 'user' && (
                        <Link
                            to="/projects"
                            style={homeLinkStyle(isActive('/projects'))}
                            className="hover-link-dark"
                        >
                            Dự Án Của Tôi
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

                {/* Hamburger Button */}
                <button className="mobile-menu-toggle" onClick={() => setIsOpen(true)} style={{ color: '#0F0F0F' }}>
                    <Menu size={24} />
                </button>
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
            {mobileMenuDrawer}
        </nav>
    );
};

export default Navbar;
