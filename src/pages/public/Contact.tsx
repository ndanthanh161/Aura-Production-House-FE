import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact: React.FC = () => {
    return (
        <div style={{ paddingTop: '10px', backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
            {/* Header Section */}
            <header style={{ padding: '8rem 0 4rem', textAlign: 'center', backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEEEEE' }}>
                <div className="container">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            fontSize: 'clamp(3rem, 7vw, 6.5rem)',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            color: '#0F0F0F',
                            margin: 0
                        }}
                    >
                        HÃY ĐỂ AURA GIÚP BẠN
                    </motion.h1>
                </div>
            </header>

            {/* Info Cards Section - Black Background */}
            <section style={{ backgroundColor: '#FFFFFF', padding: '6rem 0' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                        {[
                            { icon: <Mail size={24} />, title: 'EMAIL', detail: 'hello@auraproduction.com', sub: 'Chúng tôi phản hồi trong 24 giờ' },
                            { icon: <Phone size={24} />, title: 'ĐIỆN THOẠI', detail: '+1 (555) 123-4567', sub: 'Thứ 2–Thứ 6, 9h–18h' },
                            { icon: <MapPin size={24} />, title: 'STUDIO', detail: 'Thành phố New York, NY', sub: 'Chỉ theo lịch hẹn' },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: i * 0.15 }}
                                style={{
                                    padding: '4rem 2.5rem',
                                    backgroundColor: '#FFFFFF',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1.5rem',
                                    textAlign: 'left',
                                    borderRight: i !== 2 ? '1px solid #EEEEEE' : 'none'
                                }}
                            >
                                <div style={{ color: '#071FD9' }}>{item.icon}</div>
                                <div>
                                    <h3 style={{ fontSize: '0.85rem', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 900, color: '#0F0F0F' }}>
                                        {item.title}
                                    </h3>
                                    <p style={{ color: '#0F0F0F', fontSize: '1rem', fontWeight: 500, marginBottom: '0.5rem' }}>{item.detail}</p>
                                    <p style={{ color: '#888', fontSize: '0.75rem', fontWeight: 400 }}>{item.sub}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Form Section - White Background */}
            <section style={{ padding: '8rem 0', backgroundColor: '#FFFFFF' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{
                            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            color: '#0F0F0F',
                            margin: 0
                        }}>
                            GỬI TIN NHẮN
                        </h2>
                    </div>

                    <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            <input type="text" placeholder="Họ và Tên" style={{
                                width: '100%', border: '1px solid #EEE', padding: '1.25rem',
                                color: '#0F0F0F', fontSize: '0.85rem', outline: 'none', backgroundColor: '#FFF'
                            }} />
                            <input type="email" placeholder="Email" style={{
                                width: '100%', border: '1px solid #EEE', padding: '1.25rem',
                                color: '#0F0F0F', fontSize: '0.85rem', outline: 'none', backgroundColor: '#FFF'
                            }} />
                        </div>
                        <input type="text" placeholder="Chủ đề" style={{
                            width: '100%', border: '1px solid #EEE', padding: '1.25rem',
                            color: '#0F0F0F', fontSize: '0.85rem', outline: 'none', backgroundColor: '#FFF'
                        }} />
                        <textarea placeholder="Hãy cho chúng tôi biết về dự án của bạn..." rows={8} style={{
                            width: '100%', border: '1px solid #EEE', padding: '1.25rem',
                            color: '#0F0F0F', fontSize: '0.85rem', outline: 'none', resize: 'vertical', backgroundColor: '#FFF'
                        }} />

                        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                            <button type="submit" style={{
                                backgroundColor: '#071FD9', color: '#FFFFFF', padding: '1.25rem 3rem',
                                fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 900,
                                cursor: 'pointer', border: 'none', minWidth: '220px', transition: 'all 0.3s ease'
                            }}>
                                GỬI TIN NHẮN
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Contact;
