import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Sparkles, Film } from 'lucide-react';

const About: React.FC = () => {
    return (
        <div style={{ paddingTop: '80px', backgroundColor: '#050505', minHeight: '100vh', color: '#FFFFFF', position: 'relative', overflowX: 'hidden' }}>
            
            {/* Cinematic background film grain overlay */}
            <div style={{
                position: 'fixed',
                inset: 0,
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.012\'/%3E%3C/svg%3E")',
                pointerEvents: 'none',
                zIndex: 99
            }} />

            {/* Glowing gold ambient neon bleed */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '1000px',
                height: '800px',
                background: 'radial-gradient(circle, rgba(192, 154, 90, 0.04) 0%, transparent 70%)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            {/* Header / Hero Section */}
            <header className="container" style={{ paddingTop: '5rem', paddingBottom: '3rem', position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                <span style={{
                    color: '#C09A5A',
                    textTransform: 'uppercase',
                    letterSpacing: '0.4em',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    display: 'block',
                    marginBottom: '1.5rem'
                }}>
                    MANIFESTO / THE ART OF VISUAL NARRATIVE
                </span>
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        fontSize: 'clamp(2.2rem, 6vw, 4.5rem)',
                        lineHeight: 1.15,
                        fontFamily: 'var(--font-display)',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        color: '#FFFFFF',
                        margin: 0,
                        letterSpacing: '0.01em'
                    }}
                >
                    KIẾN TẠO DI SẢN HÌNH ẢNH <br />
                    ĐẠT CHUẨN ĐIỆN ẢNH DUY MỸ
                </motion.h1>
                <div style={{ width: '80px', height: '2px', backgroundColor: '#C09A5A', marginTop: '2rem' }} />
            </header>

            {/* Split Manifesto Section */}
            <section className="container" style={{ paddingBottom: '5rem', position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                <div className="about-split-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.25fr', gap: '5rem', alignItems: 'start' }}>
                    
                    {/* Left Column: Styled Cine-Viewport Image Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        style={{
                            position: 'relative',
                            width: '100%',
                            aspectRatio: '16/11',
                            overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.08)',
                            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
                            backgroundColor: '#000000'
                        }}
                        className="about-viewport"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&q=80&w=1000"
                            alt="Photographer at work"
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                display: 'block', 
                                objectFit: 'cover',
                                filter: 'contrast(1.08) brightness(0.7) grayscale(20%)',
                                transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}
                            className="about-viewport-image"
                        />
                        {/* Vignette Overlay */}
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)', pointerEvents: 'none' }} />

                        {/* Viewfinder corner overlays */}
                        <div style={{ position: 'absolute', inset: '1rem', pointerEvents: 'none', opacity: 0.4 }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '12px', height: '12px', borderTop: '2px solid #C09A5A', borderLeft: '2px solid #C09A5A' }} />
                            <div style={{ position: 'absolute', top: 0, right: 0, width: '12px', height: '12px', borderTop: '2px solid #C09A5A', borderRight: '2px solid #C09A5A' }} />
                            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '12px', height: '12px', borderBottom: '2px solid #C09A5A', borderLeft: '2px solid #C09A5A' }} />
                            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', borderBottom: '2px solid #C09A5A', borderRight: '2px solid #C09A5A' }} />
                        </div>
                    </motion.div>

                    {/* Right Column: The Manifesto Description */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        style={{ display: 'flex', flexDirection: 'column' }}
                    >
                        <span style={{ fontSize: '0.6rem', color: '#C09A5A', letterSpacing: '0.2em', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem' }}>
                            02 / MISSION & VISION STATEMENT
                        </span>
                        
                        <h2 style={{
                            fontSize: '2rem',
                            color: '#FFFFFF',
                            marginBottom: '2rem',
                            fontWeight: 800,
                            fontFamily: 'var(--font-display)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em',
                            lineHeight: 1.25
                        }}>
                            ĐỊNH HÌNH PHONG CÁCH ĐIỆN ẢNH ĐỘC BẢN
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.98rem', lineHeight: '1.75', textAlign: 'justify' }}>
                                Thành lập từ năm 2026 tại Thành Phố Hồ Chí Minh, Aura Production House ra đời với khát vọng phá vỡ các giới hạn hình ảnh thông thường để kiến tạo nên những tác phẩm đạt chuẩn điện ảnh thực thụ. Chúng tôi tin rằng mỗi doanh nghiệp và thương hiệu cá nhân đều có một câu chuyện mang tần số nghệ thuật riêng biệt — nhiệm vụ của Aura là lắng nghe, thiết kế concept và phát sóng câu chuyện đó một cách duy mỹ nhất.
                            </p>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.98rem', lineHeight: '1.75', textAlign: 'justify', borderLeft: '2px solid #C09A5A', paddingLeft: '1.5rem', fontStyle: 'italic', margin: '0.5rem 0' }}>
                                "Chúng tôi không chỉ chụp những bức ảnh tĩnh hay quay những đoạn phim ngắn; chúng tôi tạo ra di sản thương hiệu vượt thời gian."
                            </p>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.98rem', lineHeight: '1.75', textAlign: 'justify' }}>
                                Vận hành quy trình sản xuất khắt khe cùng đội ngũ đạo diễn hình ảnh (DP), giám đốc nghệ thuật (Art Director) và các nhà thiết kế kịch bản đầy tâm huyết, Aura cam kết mang lại sự tử tế và chất lượng vượt trội trong từng pixel khung hình.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Core Philosophy Section */}
            <section style={{ 
                borderTop: '1px solid rgba(255,255,255,0.06)', 
                borderBottom: '1px solid rgba(255,255,255,0.06)', 
                padding: '6rem 0',
                backgroundColor: 'rgba(10,10,10,0.4)',
                position: 'relative',
                zIndex: 2 
            }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <span style={{ color: '#C09A5A', textTransform: 'uppercase', letterSpacing: '0.3em', fontSize: '0.7rem', fontWeight: 800, display: 'block', marginBottom: '0.8rem' }}>
                            AURA CORE PHILOSOPHY
                        </span>
                        <h3 style={{
                            fontSize: '1.8rem',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 900,
                            color: '#FFFFFF',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            BA TRỤ CỘT SẢN XUẤT CỦA AURA
                        </h3>
                    </div>

                    <div className="philosophy-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                        {[
                            {
                                num: '01',
                                icon: <Compass size={22} />,
                                title: 'TẦN SỐ ĐỘC BẢN',
                                subtitle: 'AUTHENTIC FREQUENCY',
                                desc: 'Mỗi thương hiệu là độc bản. Chúng tôi đào sâu nghiên cứu kịch bản, định vị phong cách nghệ thuật cá nhân hóa để tạo ra sản phẩm không trùng lặp.'
                            },
                            {
                                num: '02',
                                icon: <Film size={22} />,
                                title: 'THIẾT BỊ ĐIỆN ẢNH',
                                subtitle: 'CINE HARDWARE SYSTEM',
                                desc: 'Vận hành hoàn toàn các dòng máy quay chuẩn Hollywood (ARRI Alexa, RED, Sony FX3) kết hợp hệ kính Cine prime đặc thù để đảm bảo độ sâu quang học xuất sắc.'
                            },
                            {
                                num: '03',
                                icon: <Sparkles size={22} />,
                                title: 'HẬU KỲ DUY MỸ',
                                subtitle: 'ESTHETIC POST-PRODUCTION',
                                desc: 'Quy trình chỉnh màu HDR chuyên sâu trên DaVinci Studio, thiết kế âm thanh vòm điện ảnh Dolby Atmos và làm mịn chi tiết thủ công tỉ mỉ từng frame hình.'
                            }
                        ].map((item, idx) => (
                            <div 
                                key={idx}
                                style={{
                                    backgroundColor: '#0F0F0F',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    padding: '3rem 2.2rem',
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1.5rem',
                                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                                className="philosophy-card-hover"
                            >
                                <span style={{
                                    fontSize: '3.5rem',
                                    fontWeight: 900,
                                    fontFamily: 'monospace',
                                    color: 'rgba(192, 154, 90, 0.08)',
                                    position: 'absolute',
                                    top: '1.5rem',
                                    right: '2.2rem',
                                    lineHeight: 1
                                }}>
                                    {item.num}
                                </span>

                                <div style={{ color: '#C09A5A', width: 'fit-content' }}>
                                    {item.icon}
                                </div>

                                <div>
                                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {item.title}
                                    </h4>
                                    <span style={{ display: 'block', fontSize: '0.6rem', color: '#C09A5A', fontWeight: 700, letterSpacing: '0.1em', marginTop: '0.2rem', textTransform: 'uppercase' }}>
                                        {item.subtitle}
                                    </span>
                                </div>

                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            <style>{`
                .about-viewport:hover .about-viewport-image {
                    transform: scale(1.04) !important;
                }
                
                .philosophy-card-hover {
                    border-radius: 0px;
                    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
                }
                
                .philosophy-card-hover:hover {
                    background-color: #121212 !important;
                    border-color: rgba(192, 154, 90, 0.25) !important;
                    transform: translateY(-4px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.6), inset 0 0 20px rgba(192, 154, 90, 0.03);
                }

                .philosophy-card-hover:hover h4 {
                    color: #C09A5A !important;
                }

                @media (max-width: 1024px) {
                    .about-split-grid {
                        grid-template-columns: 1fr !important;
                        gap: 3.5rem !important;
                    }
                    .philosophy-grid {
                        grid-template-columns: 1fr !important;
                    }
                }

                @keyframes blinking {
                    0% { opacity: 0.3; }
                    50% { opacity: 1; }
                    100% { opacity: 0.3; }
                }
            `}</style>
        </div>
    );
};

export default About;
