import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X, ChevronDown, Calendar, Settings, Sparkles } from 'lucide-react';
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
    padding: '0.55rem 0',
    background: 'rgba(7, 7, 6, 0.72)',
    backdropFilter: 'blur(22px) saturate(1.18)',
    WebkitBackdropFilter: 'blur(22px) saturate(1.18)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 16px 42px rgba(0, 0, 0, 0.26)',
};

const linkStyle = (active: boolean): React.CSSProperties => ({
    fontSize: '0.72rem',
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    color: '#FFFFFF',
    opacity: active ? 1 : 0.68,
    fontWeight: active ? 700 : 400,
    transition: 'var(--transition-cinematic)',
});

const homeLinkStyle = (active: boolean): React.CSSProperties => ({
    fontSize: '0.72rem',
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    color: '#FFFFFF',
    opacity: active ? 1 : 0.68,
    fontWeight: active ? 700 : 400,
    transition: 'var(--transition-cinematic)',
});

const dropdownItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'none',
    border: 'none',
    padding: '0.6rem 0.75rem',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#E5E7EB',
    fontSize: '0.825rem',
    fontWeight: 600,
    textAlign: 'left',
    width: '100%',
    transition: 'all 0.2s ease',
};

const UserMenu: React.FC = () => {
    const { user, role, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    // Lấy ký tự đầu làm Avatar đại diện nếu không có ảnh
    const initial = user.fullName ? user.fullName.charAt(0).toUpperCase() : '?';

    return (
        <div ref={dropdownRef} className="user-profile-menu-container" style={{ position: 'relative' }}>
            {/* Button kích hoạt Dropdown */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="user-profile-trigger-btn"
                style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    outline: 'none',
                }}
            >
                {/* Khung avatar hình tròn */}
                <div
                    className={`user-avatar-circle ${user.isVip ? 'vip-avatar-glow' : ''}`}
                    style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: user.isVip ? '#FFD700' : 'var(--color-bg-secondary, #F3F4F6)',
                        border: user.isVip ? '2px solid #FFD700' : '1px solid rgba(0,0,0,0.1)',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: user.isVip ? '#0F0F0F' : 'var(--color-text)',
                        background: user.isVip ? 'linear-gradient(135deg, #FFE066 0%, #F5B041 100%)' : undefined,
                        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                >
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.fullName}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <span>{initial}</span>
                    )}
                </div>

                {/* Huy hiệu Chevron Down góc dưới bên phải tròn tối */}
                <div
                    className="avatar-chevron-badge"
                    style={{
                        position: 'absolute',
                        bottom: '-2px',
                        right: '-2px',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: '#1F2937',
                        border: '1px solid #FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                >
                    <ChevronDown size={10} strokeWidth={3} />
                </div>
            </button>

            {/* Dropdown Menu với Glassmorphism */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="user-profile-dropdown-menu"
                        style={{
                            position: 'absolute',
                            right: 0,
                            marginTop: '0.75rem',
                            width: '280px',
                            backgroundColor: 'rgba(18, 18, 18, 0.98)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            zIndex: 100,
                            padding: '1.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                        }}
                    >
                        {/* 1. Header: User Info */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#FFFFFF', letterSpacing: '0.01em' }}>
                                {user.fullName}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user.email}
                            </div>
                        </div>

                        {/* 2. Thẻ Trạng thái VIP (chỉ hiện cho tài khoản khách hàng 'user') */}
                        {role === 'user' && (
                            user.isVip ? (
                                <div
                                    className="vip-member-card"
                                    style={{
                                        background: 'linear-gradient(135deg, #111 0%, #222 100%)',
                                        border: '1px solid #FFD700',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '10px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 10px rgba(255,215,0,0.15)',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFD700', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                        <Sparkles size={12} className="gold-sparkle-icon" />
                                        AURA VIP MEMBER
                                    </div>
                                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
                                        Hạn dùng: {user.vipExpireAt ? new Date(user.vipExpireAt).toLocaleDateString('vi-VN') : '1 tháng'}
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="basic-member-card"
                                    style={{
                                        backgroundColor: '#F3F4F6',
                                        border: '1px solid rgba(0,0,0,0.05)',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '6px',
                                    }}
                                >
                                    <div style={{ fontSize: '0.72rem', color: '#4B5563', fontWeight: 600 }}>
                                        Thành viên Thường
                                    </div>
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            navigate('/packages');
                                        }}
                                        className="upgrade-vip-btn"
                                        style={{
                                            backgroundColor: '#C09A5A',
                                            color: '#FFFFFF',
                                            border: 'none',
                                            borderRadius: '6px',
                                            padding: '0.45rem',
                                            fontSize: '0.65rem',
                                            fontWeight: 800,
                                            cursor: 'pointer',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.08em',
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        Nâng Cấp HỘI VIÊN 🌟
                                    </button>
                                </div>
                            )
                        )}

                        <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.06)' }} />

                        {/* 3. Navigation Links */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {role === 'photographer' && (
                                <button
                                    onClick={() => { setIsOpen(false); navigate('/photographer'); }}
                                    style={dropdownItemStyle}
                                >
                                    <Settings size={14} />
                                    <span>Photographer Workspace</span>
                                </button>
                            )}
                            {role === 'admin' && (
                                <button
                                    onClick={() => { setIsOpen(false); navigate('/admin'); }}
                                    style={dropdownItemStyle}
                                >
                                    <Settings size={14} />
                                    <span>Trang Quản Trị</span>
                                </button>
                            )}
                            {role === 'user' && (
                                <button
                                    onClick={() => { setIsOpen(false); navigate('/projects'); }}
                                    style={dropdownItemStyle}
                                >
                                    <Calendar size={14} />
                                    <span>Dự án của tôi</span>
                                </button>
                            )}
                        </div>

                        <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.06)' }} />

                        {/* 4. Logout Action */}
                        <button
                            onClick={() => { setIsOpen(false); logout(); }}
                            style={{
                                ...dropdownItemStyle,
                                color: '#EF4444',
                                fontWeight: 700,
                            }}
                        >
                            <LogOut size={14} />
                            <span>Đăng xuất</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const Navbar: React.FC = () => {
    const { role, user, logout } = useAuth();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isHome = location.pathname === '/';

    const dynamicNavStyle: React.CSSProperties = {
        ...navStyle,
        background: isHome ? (isScrolled ? 'rgba(7, 7, 6, 0.84)' : 'linear-gradient(180deg, rgba(0,0,0,0.56), transparent)') : 'rgba(7, 7, 6, 0.86)',
        borderBottom: isHome ? (isScrolled ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent') : '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: isHome ? (isScrolled ? '0 16px 42px rgba(0, 0, 0, 0.28)' : 'none') : '0 16px 42px rgba(0, 0, 0, 0.28)',
    };

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
            {!role ? (
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link to="/login" style={{
                        color: '#FFFFFF', fontSize: '0.72rem', letterSpacing: '0.15em',
                        textTransform: 'uppercase', fontWeight: 600, opacity: 0.6,
                    }} className="hover-link">
                        Đăng Nhập
                    </Link>
                    <Link to="/register" style={{
                        border: '1px solid rgba(255,255,255,0.42)',
                        backgroundColor: 'transparent',
                        color: '#FFFFFF',
                        padding: '0.55rem 1.5rem',
                        fontSize: '0.7rem',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        borderRadius: '999px',
                        transition: 'all 0.3s ease',
                    }} className="btn-join">
                        Tham Gia
                    </Link>
                </div>
            ) : (
                <UserMenu />
            )}
        </>
    );

    const hoverStyles = (
        <style>{`
            .hover-link { position: relative; }
            .hover-link::after {
                content: ''; position: absolute; bottom: -6px; left: 0;
                width: 100%; height: 1px; background-color: #FFFFFF;
                transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                transform: scaleX(0);
                transform-origin: bottom left;
            }
            .hover-link:hover {
                opacity: 1 !important;
                color: #FFFFFF !important;
            }
            .hover-link:hover::after,
            .hover-link.active::after {
                transform: scaleX(1);
            }
            .btn-join:hover {
                background-color: #FFFFFF !important;
                color: #000000 !important;
                box-shadow: none !important;
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
                            backgroundColor: '#0F0E0C',
                            boxShadow: '-20px 0 60px rgba(0,0,0,0.45)',
                            borderLeft: '1px solid rgba(255,255,255,0.1)',
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
                            <button onClick={() => setIsOpen(false)} style={{ color: '#FFFFFF', cursor: 'pointer', padding: '0.25rem' }}>
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
                                        color: isActive(link.path) ? '#D0A968' : '#FFFFFF',
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
                            {role && user && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', marginBottom: '0.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: user.isVip ? 'linear-gradient(135deg, #FFE066 0%, #F5B041 100%)' : '#E5E7EB',
                                            fontWeight: 700,
                                            fontSize: '0.85rem',
                                            color: user.isVip ? '#0F0F0F' : '#4B5563',
                                            overflow: 'hidden'
                                        }}>
                                            {user.avatar ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user.fullName.charAt(0).toUpperCase()}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>{user.fullName}</span>
                                            {user.isVip ? (
                                                <span style={{ fontSize: '0.65rem', color: '#D4AF37', fontWeight: 800 }}>AURA VIP MEMBER</span>
                                            ) : (
                                                <span style={{ fontSize: '0.65rem', color: '#6B7280' }}>Thành viên thường</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {role === 'photographer' && (
                                <Link to="/photographer" onClick={() => setIsOpen(false)} style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    Workspace
                                </Link>
                            )}
                            {role === 'user' && (
                                <Link to="/projects" onClick={() => setIsOpen(false)} style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    Dự Án Của Tôi
                                </Link>
                            )}
                            {role === 'admin' && (
                                <Link to="/admin" onClick={() => setIsOpen(false)} style={{ fontSize: '0.9rem', fontWeight: 700, color: '#C09A5A', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    Quản trị
                                </Link>
                            )}
                            {!role ? (
                                <>
                                <Link to="/login" onClick={() => setIsOpen(false)} style={{
                                        fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8
                                    }}>
                                        Đăng Nhập
                                    </Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)} style={{
                                        backgroundColor: '#D0A968', color: '#0F0F0F', padding: '0.9rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: '999px'
                                    }}>
                                        Tham Gia
                                    </Link>
                                </>
                            ) : (
                                <button onClick={() => { logout(); setIsOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#FF3B30', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>
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
            <nav style={dynamicNavStyle}>
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
        <nav style={dynamicNavStyle}>
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
                    {!role ? (
                        <>
                            <Link to="/login" style={{
                                color: '#FFFFFF', fontSize: '0.72rem', letterSpacing: '0.15em',
                                textTransform: 'uppercase', fontWeight: 600, opacity: 0.6,
                            }} className="hover-link-dark">
                                Đăng Nhập
                            </Link>
                            <Link to="/register" style={{
                                border: '1px solid rgba(255,255,255,0.42)',
                                backgroundColor: 'transparent',
                                color: '#FFFFFF',
                                padding: '0.55rem 1.5rem',
                                fontSize: '0.7rem',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                fontWeight: 700,
                                borderRadius: '999px',
                                transition: 'all 0.3s ease',
                            }} className="btn-join-home">
                                Tham Gia
                            </Link>
                        </>
                    ) : (
                        <UserMenu />
                    )}
                </div>

                {/* Hamburger Button */}
                <button className="mobile-menu-toggle" onClick={() => setIsOpen(true)} style={{ color: '#FFFFFF' }}>
                    <Menu size={24} />
                </button>
            </div>
            <style>{`
                .hover-link-dark { position: relative; }
                .hover-link-dark::after {
                    content: ''; position: absolute; bottom: -6px; left: 0;
                    width: 100%; height: 1px; background-color: #FFFFFF;
                    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    transform: scaleX(0);
                    transform-origin: bottom left;
                }
                .hover-link-dark:hover { opacity: 1 !important; color: #FFFFFF !important; }
                .hover-link-dark:hover::after, .hover-link-dark.active::after { transform: scaleX(1); }
                .btn-join-home:hover {
                    background-color: #FFFFFF !important;
                    color: #000000 !important;
                    box-shadow: none !important;
                }
                
                /* Custom Profile Dropdown Styles & Animations */
                .upgrade-vip-btn:hover {
                    background-color: #FFFFFF !important;
                    color: #000000 !important;
                    box-shadow: none !important;
                }
                .user-avatar-circle {
                    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
                }
                .user-profile-trigger-btn:hover .user-avatar-circle {
                    transform: scale(1.04);
                }
                .vip-avatar-glow {
                    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
                    animation: goldGlow 2s infinite alternate;
                }
                @keyframes goldGlow {
                    from { box-shadow: 0 0 4px rgba(255, 215, 0, 0.3); }
                    to { box-shadow: 0 0 12px rgba(255, 215, 0, 0.7); }
                }
                .user-profile-dropdown-menu button {
                    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .user-profile-dropdown-menu button:hover {
                    background-color: rgba(255, 255, 255, 0.08) !important;
                    color: #FFFFFF !important;
                    padding-left: 0.9rem !important;
                }
                .user-profile-dropdown-menu button:last-child:hover {
                    background-color: rgba(239, 68, 68, 0.08) !important;
                    color: #EF4444 !important;
                    padding-left: 0.9rem !important;
                }
                
                /* Shimmer effect for VIP card */
                .vip-member-card::after {
                    content: '';
                    position: absolute;
                    top: 0; right: 0; bottom: 0; left: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 60%, transparent);
                    transform: translateX(-100%);
                    animation: vipShimmer 3s infinite;
                }
                @keyframes vipShimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
            {hoverStyles}
            {mobileMenuDrawer}
        </nav>
    );
};

export default Navbar;
