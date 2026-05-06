import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import logoColor from '../assets/LOGO BW.png';

export const Footer: React.FC = () => {
    return (
        <footer style={{
            backgroundColor: '#FFFFFF',
            padding: '6rem 0 3rem',
            borderTop: '1px solid #EEE'
        }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', marginBottom: '5rem' }}>
                    {/* Brand Column */}
                    <div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
                                <img src={logoColor} alt="AURA Logo" style={{ display: 'block', height: '45px', maxWidth: '200px', objectFit: 'contain' }} />
                            </Link>
                        </div>
                        <p style={{ color: '#444', maxWidth: '300px', marginBottom: '2rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
                            Nhà sản xuất sáng tạo cao cấp chuyên về kể chuyện điện ảnh và xây dựng thương hiệu cá nhân.
                        </p>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <a href="#" className="social-icon" style={{ color: '#0F0F0F' }}><Instagram size={20} /></a>
                            <a href="#" className="social-icon" style={{ color: '#0F0F0F' }}><Twitter size={20} /></a>
                            <a href="#" className="social-icon" style={{ color: '#0F0F0F' }}><Youtube size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ marginBottom: '2rem', color: '#0F0F0F', letterSpacing: '0.1em', fontSize: '0.85rem', fontWeight: 800 }}>LIÊN KẾT NHANH</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Link to="/portfolio" className="footer-link">Dự Án</Link>
                            <Link to="/services" className="footer-link">Quy Trình</Link>
                            <Link to="/packages" className="footer-link">Gói Dịch Vụ</Link>
                            <Link to="/about" className="footer-link">Về Chúng Tôi</Link>
                        </div>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h4 style={{ marginBottom: '2rem', color: '#0F0F0F', letterSpacing: '0.1em', fontSize: '0.85rem', fontWeight: 800 }}>LIÊN HỆ</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#444', fontSize: '0.9rem' }}>
                                <Mail size={18} strokeWidth={1.5} /> auraproduction21@gmail.com
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#444', fontSize: '0.9rem' }}>
                                <Phone size={18} strokeWidth={1.5} /> 0941676736
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#444', fontSize: '0.9rem' }}>
                                <MapPin size={18} strokeWidth={1.5} /> Lô E2a-7, Đường D1, Long Thạnh Mỹ, TP. Thủ Đức, HCM
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{ borderTop: '1px solid #EEE', paddingTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <p style={{ color: '#888', fontSize: '0.8rem', letterSpacing: '0.02em' }}>
                        © 2026 Aura Production House. Bảo lưu mọi quyền.
                    </p>
                    <div style={{ display: 'flex', gap: '2.5rem' }}>
                        <Link to="/privacy" style={{ color: '#888', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>Chính Sách Bảo Mật</Link>
                        <Link to="/terms" style={{ color: '#888', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>Điều Khoản Dịch Vụ</Link>
                    </div>
                </div>
            </div>

            <style>{`
                .footer-link {
                    color: #444;
                    font-size: 0.9rem;
                    transition: all 0.3s ease;
                }
                .footer-link:hover {
                    color: #071FD9;
                    transform: translateX(4px);
                }
                .social-icon {
                    transition: transform 0.3s ease;
                }
                .social-icon:hover {
                    transform: translateY(-3px);
                    color: #071FD9 !important;
                }
            `}</style>
        </footer>
    );
};
