import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Mail, MapPin, Phone, Facebook } from 'lucide-react';
import logoColor from '../assets/LOGO COLOR.png';

export const Footer: React.FC = () => {
    return (
        <footer style={{
            background: 'linear-gradient(180deg, #080807 0%, #020202 100%)',
            padding: '6rem 0 3rem',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            color: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Subtle studio grid */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(180deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
                backgroundSize: '96px 96px',
                opacity: 0.22,
                pointerEvents: 'none',
                zIndex: 1
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', marginBottom: '5rem' }}>
                    {/* Brand Column */}
                    <div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
                                <img src={logoColor} alt="AURA Logo" style={{ display: 'block', height: '45px', maxWidth: '200px', objectFit: 'contain' }} />
                            </Link>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '300px', marginBottom: '2rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
                            Nhà sản xuất sáng tạo cao cấp chuyên về kể chuyện điện ảnh và xây dựng thương hiệu cá nhân.
                        </p>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <a href="#" className="social-icon" style={{ color: 'rgba(255,255,255,0.6)' }}><Facebook size={20} /></a>
                            <a href="#" className="social-icon" style={{ color: 'rgba(255,255,255,0.6)' }}><Instagram size={20} /></a>
                            <a href="#" className="social-icon" style={{ color: 'rgba(255,255,255,0.6)' }}><Youtube size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ marginBottom: '2rem', color: '#FFFFFF', letterSpacing: '0.15em', fontSize: '0.85rem', fontWeight: 800 }}>LIÊN KẾT NHANH</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Link to="/portfolio" className="footer-link">DỰ ÁN</Link>
                            <Link to="/services" className="footer-link">QUY TRÌNH</Link>
                            <Link to="/packages" className="footer-link">GÓI DỊCH VỤ</Link>
                            <Link to="/about" className="footer-link">VỀ CHÚNG TÔI</Link>
                        </div>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h4 style={{ marginBottom: '2rem', color: '#FFFFFF', letterSpacing: '0.15em', fontSize: '0.85rem', fontWeight: 800 }}>LIÊN HỆ</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                                <Mail size={18} strokeWidth={1.5} style={{ color: '#C09A5A' }} /> auraproduction2512@gmail.com
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                                <Phone size={18} strokeWidth={1.5} style={{ color: '#C09A5A' }} /> Mr. Hằng – 090 5655 944
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                                <MapPin size={18} strokeWidth={1.5} style={{ color: '#C09A5A', marginTop: '3px' }} />
                                <span>Lô E2a-7, Đường D1, Đ. Võ Chí Công,<br />Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí Minh</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', letterSpacing: '0.02em' }}>
                        © 2026 Aura Production House. Bảo lưu mọi quyền.
                    </p>
                    <div className="footer-bottom-links" style={{ display: 'flex', gap: '2.5rem' }}>
                        <Link to="/privacy" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', whiteSpace: 'nowrap' }} className="footer-bottom-link">Chính Sách Bảo Mật</Link>
                        <Link to="/terms" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', whiteSpace: 'nowrap' }} className="footer-bottom-link">Điều Khoản Dịch Vụ</Link>
                    </div>
                </div>
            </div>

            <style>{`
                .footer-link {
                    color: rgba(255,255,255,0.7);
                    font-size: 0.85rem;
                    font-weight: 600;
                    letter-spacing: 0.05em;
                    transition: all 0.3s ease;
                }
                .footer-link:hover {
                    color: #C09A5A;
                    transform: translateX(4px);
                }
                .footer-bottom-link {
                    transition: color 0.3s ease;
                }
                .footer-bottom-link:hover {
                    color: #C09A5A !important;
                }
                .social-icon {
                    transition: all 0.3s ease;
                }
                .social-icon:hover {
                    transform: translateY(-3px);
                    color: #C09A5A !important;
                }
                @media (max-width: 768px) {
                    footer {
                        padding: 3.5rem 0 2rem !important;
                    }
                    .footer-bottom {
                        flex-direction: column !important;
                        align-items: center !important;
                        text-align: center !important;
                        gap: 1rem !important;
                        padding-top: 1.5rem !important;
                    }
                    .footer-bottom-links {
                        gap: 1.5rem !important;
                    }
                }
            `}</style>
        </footer>
    );
};
