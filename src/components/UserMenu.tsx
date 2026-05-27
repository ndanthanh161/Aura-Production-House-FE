import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, ChevronDown, Calendar, Settings, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

export const UserMenu: React.FC = () => {
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
