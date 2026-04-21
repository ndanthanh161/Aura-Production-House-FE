import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
    return (
        <div style={{ paddingTop: '80px', backgroundColor: '#000000', minHeight: '100vh' }}>
            {/* Header Section */}
            <header className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem', textAlign: 'left' }}>
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        fontSize: 'clamp(3rem, 7vw, 6rem)',
                        lineHeight: 1.35,
                        fontFamily: 'var(--font-display)',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        color: '#FFFFFF',
                        margin: 0,
                        maxWidth: '1200px'
                    }}
                >
                    AURA GIÚP BẠN NỔI BẬT <br />
                    VÀ GHI DẤU ẤN RIÊNG
                </motion.h1>
            </header>

            {/* Content Section */}
            <section className="container" style={{ paddingBottom: '10rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '5rem', alignItems: 'start' }}>
                    {/* Left Column - Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <div style={{ position: 'relative', overflow: 'hidden' }}>
                            <img
                                src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&q=80&w=1000"
                                alt="Photographer at work"
                                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                            />
                            {/* Decorative overlay if needed */}
                        </div>
                    </motion.div>

                    {/* Right Column - Text & Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        style={{ display: 'flex', flexDirection: 'column' }}
                    >
                        <h2 style={{
                            fontSize: '1.8rem',
                            color: '#FFFFFF',
                            marginBottom: '2.5rem',
                            fontWeight: 700,
                            fontFamily: 'var(--font-display)'
                        }}>
                            Giới thiệu về Aura
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', lineHeight: '1.8' }}>
                                Thành lập năm 2020, Aura Production House ra đời từ mong muốn kết nối giữa sự tinh tế thương mại và câu chuyện đích thực. Chúng tôi tin rằng mỗi cá nhân và thương hiệu đều có một tần số điện ảnh riêng—sứ mệnh của chúng tôi là tìm và phát sóng nó.
                            </p>
                            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', lineHeight: '1.8', marginBottom: '3rem' }}>
                                Đặt trụ sở tại New York nhưng hoạt động toàn cầu, đội ngũ đạo diễn, nhiếp ảnh gia và chiến lược gia sáng tạo của chúng tôi phối hợp để tạo ra di sản hình ảnh vượt thời gian.
                            </p>
                        </div>

                        {/* Stats Grid */}
                        {/* <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: 'auto' }}>
                            <div>
                                <div style={{ color: '#ADFF00', fontSize: '3.5rem', fontWeight: 900, fontFamily: 'var(--font-sans)', lineHeight: 1 }}>500+</div>
                                <div style={{ color: '#ADFF00', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '1.5rem' }}>DỰ ÁN HOÀN THÀNH</div>
                            </div>
                            <div>
                                <div style={{ color: '#ADFF00', fontSize: '3.5rem', fontWeight: 900, fontFamily: 'var(--font-sans)', lineHeight: 1 }}>15+</div>
                                <div style={{ color: '#ADFF00', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '1.5rem' }}>THÀNH TỰU</div>
                            </div>
                            <div>
                                <div style={{ color: '#ADFF00', fontSize: '3.5rem', fontWeight: 900, fontFamily: 'var(--font-sans)', lineHeight: 1 }}>15+</div>
                                <div style={{ color: '#ADFF00', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '1.5rem' }}>KHÁCH HÀNG</div>
                            </div>
                        </div> */}
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default About;
