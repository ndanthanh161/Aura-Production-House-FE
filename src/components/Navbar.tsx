import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

// Map routes to page titles for the inner-page header display
const pageTitleMap: Record<string, string> = {
    '/portfolio': 'PORTFOLIO',
    '/services': 'SERVICES',
    '/packages': 'PACKAGES',
    '/about': 'ABOUT',
    '/contact': 'CONTACT',
    '/payment': 'PAYMENT',
    '/login': 'LOGIN',
    '/register': 'REGISTER',
};

const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 50,
    padding: '1rem 0',
    background: 'rgba(5, 5, 5, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
};

const linkStyle = (active: boolean): React.CSSProperties => ({
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.25em',
    color: '#fff',
    opacity: active ? 1 : 0.5,
    fontWeight: active ? 800 : 500,
    transition: 'var(--transition-cinematic)',
});

const homeLinkStyle = (active: boolean): React.CSSProperties => ({
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.25em',
    color: active ? 'var(--color-accent)' : '#fff',
    opacity: active ? 1 : 0.6,
    fontWeight: 600,
    transition: 'var(--transition-cinematic)',
});

export const Navbar: React.FC = () => {
    const { role, logout } = useAuth();
    const location = useLocation();

    const isHome = location.pathname === '/';
    const pageTitle = pageTitleMap[location.pathname] || '';

    const leftLinks = [
        { name: 'Portfolio', path: '/portfolio' },
        { name: 'Services', path: '/services' },
        { name: 'Packages', path: '/packages' },
    ];

    const rightLinks = [
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    const isActive = (path: string) => location.pathname === path;

    const authSection = (
        <>
            {role && (role === 'staff' || role === 'admin') && (
                <Link to={role === 'admin' ? '/admin' : '/staff'} style={{ fontSize: '0.7rem', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                    {role === 'admin' ? 'Admin' : 'Workspace'}
                </Link>
            )}
            {!role ? (
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link to="/login" style={{
                        color: '#fff', fontSize: '0.7rem', letterSpacing: '0.2em',
                        textTransform: 'uppercase', fontWeight: 600, opacity: 0.5,
                    }} className="hover-link">
                        Login
                    </Link>
                    <Link to="/register" style={{
                        backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)',
                        padding: '0.6rem 1.2rem', fontSize: '0.65rem', letterSpacing: '0.15em',
                        textTransform: 'uppercase', fontWeight: 800,
                    }}>
                        Join
                    </Link>
                </div>
            ) : (
                <button onClick={logout} style={{ color: '#fff', opacity: 0.5, display: 'flex' }}>
                    <LogOut size={14} />
                </button>
            )}
        </>
    );

    const hoverStyles = (
        <style>{`
            .hover-link { position: relative; }
            .hover-link::after {
                content: ''; position: absolute; bottom: -8px; left: 50%;
                width: 0; height: 1px; background-color: var(--color-accent);
                transition: var(--transition-cinematic); transform: translateX(-50%);
            }
            .hover-link:hover { opacity: 1 !important; }
            .hover-link:hover::after { width: 100%; }
            @media (max-width: 1024px) {
                .nav-group { display: none !important; }
                .navbar-container { justify-content: center !important; }
            }
        `}</style>
    );

    // ─── INNER PAGE NAVBAR (logo left, page title center) ───
    if (!isHome) {
        return (
            <nav style={navStyle}>
                <div className="container navbar-container" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', position: 'relative', minHeight: '48px',
                }}>
                    <div className="nav-group left" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', flex: 1 }}>
                        <Link to="/" style={{
                            fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: '900',
                            letterSpacing: '0.15em', color: '#fff', whiteSpace: 'nowrap',
                        }}>
                            AURA
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
                            fontWeight: 300, letterSpacing: '0.3em', color: '#fff', textTransform: 'uppercase',
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

    // ─── HOME PAGE NAVBAR (centered logo, links split left/right) ───
    return (
        <nav style={navStyle}>
            <div className="container navbar-container" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', position: 'relative', minHeight: '48px',
            }}>
                <div className="nav-group left" style={{ flex: 1, display: 'flex', gap: '3rem', justifyContent: 'flex-start' }}>
                    {leftLinks.map((link) => (
                        <Link key={link.name} to={link.path} style={homeLinkStyle(isActive(link.path))} className="hover-link">
                            {link.name}
                        </Link>
                    ))}
                </div>

                <Link to="/" style={{
                    fontFamily: 'var(--font-sans)', fontSize: '1.5rem', fontWeight: '900',
                    letterSpacing: '0.1em', color: '#fff', textAlign: 'center',
                    position: 'absolute', left: '50%', transform: 'translateX(-50%)', zIndex: 2,
                }}>
                    AURA
                </Link>

                <div className="nav-group right" style={{ flex: 1, display: 'flex', gap: '3rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                    {rightLinks.map((link) => (
                        <Link key={link.name} to={link.path} style={homeLinkStyle(isActive(link.path))} className="hover-link">
                            {link.name}
                        </Link>
                    ))}
                    {authSection}
                </div>
            </div>
            {hoverStyles}
        </nav>
    );
};
