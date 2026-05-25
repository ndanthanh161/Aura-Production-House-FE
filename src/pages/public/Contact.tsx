import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';
import { contactApi } from '../../services/contactApi';

const Contact: React.FC = () => {
    return (
        <div style={{ paddingTop: '80px', backgroundColor: '#0A0A0A', minHeight: '100vh', color: '#FFFFFF' }}>
            {/* Header Section */}
            <header style={{ padding: 'var(--spacing-xl) 0 clamp(2rem, 5vw, 4rem)', textAlign: 'center', backgroundColor: '#0F0F0F', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="container">
                    <span style={{ color: '#C09A5A', textTransform: 'uppercase', letterSpacing: '0.4em', fontSize: '0.75rem', fontWeight: 800, display: 'block', marginBottom: '1.5rem' }}>
                        KẾT NỐI VỚI AURA
                    </span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            fontSize: 'clamp(3rem, 7vw, 6.5rem)',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            color: '#FFFFFF',
                            margin: 0
                        }}
                    >
                        HÃY ĐỂ AURA GIÚP BẠN
                    </motion.h1>
                </div>
            </header>

            {/* Form Section */}
            <section style={{ padding: 'var(--spacing-xl) 0', backgroundColor: '#0A0A0A', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{
                            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            color: '#FFFFFF',
                            margin: 0
                        }}>
                            GỬI TIN NHẮN
                        </h2>
                    </div>

                    <form 
                        onSubmit={async (e) => {
                            e.preventDefault();
                            const target = e.target as any;
                            const data = {
                                name: target[0].value,
                                email: target[1].value,
                                phoneNumber: target[2].value,
                                subject: target[3].value,
                                message: target[4].value
                            };
                            
                            try {
                                const btn = document.getElementById('submit-btn');
                                if (btn) btn.innerText = 'ĐANG GỬI...';
                                
                                await contactApi.sendMessage(data);
                                alert('Cảm ơn bạn! Tin nhắn đã được gửi thành công.');
                                target.reset();
                            } catch (error) {
                                alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
                            } finally {
                                const btn = document.getElementById('submit-btn');
                                if (btn) btn.innerText = 'GỬI TIN NHẮN';
                            }
                        }} 
                        style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                    >
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                            <input required type="text" placeholder="Họ và Tên" style={{
                                width: '100%', border: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem',
                                color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', backgroundColor: '#121212'
                            }} className="contact-input" />
                            <input required type="email" placeholder="Email" style={{
                                width: '100%', border: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem',
                                color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', backgroundColor: '#121212'
                            }} className="contact-input" />
                            <input required type="tel" placeholder="Số điện thoại" style={{
                                width: '100%', border: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem',
                                color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', backgroundColor: '#121212'
                            }} className="contact-input" />
                        </div>
                        <input required type="text" placeholder="Chủ đề" style={{
                            width: '100%', border: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem',
                            color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', backgroundColor: '#121212'
                        }} className="contact-input" />
                        <textarea required placeholder="Hãy cho chúng tôi biết về dự án của bạn..." rows={8} style={{
                            width: '100%', border: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem',
                            color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', resize: 'vertical', backgroundColor: '#121212'
                        }} className="contact-input" />
 
                        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                            <button id="submit-btn" type="submit" style={{
                                backgroundColor: '#C09A5A', color: '#0F0F0F', padding: '1.25rem 3rem',
                                fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 900,
                                cursor: 'pointer', border: 'none', minWidth: '220px', transition: 'all 0.3s ease'
                            }} className="contact-submit-btn">
                                GỬI TIN NHẮN
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Info Cards Section */}
            <section style={{ backgroundColor: '#0A0A0A', padding: 'clamp(2rem, 5vw, 4rem) 0' }}>
                <div className="container">
                    <div className="contact-info-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                        {[
                            { icon: <Mail size={24} />, title: 'EMAIL', detail: 'auraproduction21@gmail.com', sub: 'Chúng tôi phản hồi trong 24 giờ' },
                            { icon: <Phone size={24} />, title: 'ĐIỆN THOẠI', detail: '0941676736', sub: 'Thứ 2–Thứ 6, 9h–18h' },
                            { icon: <MapPin size={24} />, title: 'STUDIO', detail: 'Lô E2a-7, Đường D1, Đ. Võ Chí Công, Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí Minh', sub: 'Chỉ theo lịch hẹn' },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: i * 0.15 }}
                                className="contact-info-card"
                                style={{
                                    padding: '4rem 2.5rem',
                                    backgroundColor: '#121212',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1.5rem',
                                    textAlign: 'left'
                                }}
                            >
                                <div style={{ color: '#C09A5A' }}>{item.icon}</div>
                                <div>
                                    <h3 style={{ fontSize: '0.85rem', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 900, color: '#C09A5A' }}>
                                        {item.title}
                                    </h3>
                                    <p style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 500, marginBottom: '0.5rem' }}>{item.detail}</p>
                                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 400 }}>{item.sub}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            <style>{`
                .contact-info-card {
                    border-right: 1px solid rgba(255,255,255,0.05);
                    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .contact-info-card:hover {
                    background-color: #161616 !important;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.5), inset 0 0 15px rgba(192, 154, 90, 0.05);
                    border-color: rgba(192, 154, 90, 0.3) !important;
                }
                .contact-info-card:last-child {
                    border-right: none;
                }
                .contact-input {
                    border-radius: 0px !important;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
                }
                .contact-input:focus {
                    border-color: #C09A5A !important;
                    background-color: #161616 !important;
                    box-shadow: 0 0 15px rgba(192, 154, 90, 0.15);
                }
                .contact-submit-btn {
                    border-radius: 0px !important;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
                }
                .contact-submit-btn:hover {
                    background-color: #FFFFFF !important;
                    color: #0F0F0F !important;
                    transform: translateY(-3px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.4);
                }
                @media (max-width: 900px) {
                    .contact-info-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .contact-info-card {
                        border-right: none !important;
                        border-bottom: 1px solid rgba(255,255,255,0.05);
                        padding: 2.5rem 1.5rem !important;
                    }
                    .contact-info-card:last-child {
                        border-bottom: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default Contact;
