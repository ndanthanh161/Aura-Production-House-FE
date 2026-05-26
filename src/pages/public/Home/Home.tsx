import React, { useState } from 'react';
import { Hero } from './Hero';
import { FeaturedProjects } from './FeaturedProjects';
import { StudioStats } from './StudioStats';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface ServiceCategory {
    id: number;
    title: string;
    description: string;
    subItems: string[];
    image: string;
    link: string;
}

const serviceCategories: ServiceCategory[] = [
    {
        id: 1,
        title: 'Kiến trúc & Nội thất',
        description: 'Toà nhà, căn hộ, biệt thự, resort, showroom nội thất — góc máy chuẩn nghệ thuật, ánh sáng tự nhiên, truyền tải đúng tinh thần không gian.',
        subItems: ['Biệt thự', 'Căn hộ', 'Resort', 'Nội thất'],
        image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200',
        link: '/services'
    },
    {
        id: 2,
        title: 'Sản phẩm',
        description: 'E-commerce, catalogue, pack-shot, mỹ phẩm — ảnh sản phẩm sắc nét, màu sắc trung thực chuẩn chỉnh, sẵn sàng dùng ngay cho web và quảng cáo.',
        subItems: ['Pack-shot', 'E-commerce', 'Mỹ phẩm', 'Lifestyle'],
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=1200',
        link: '/services'
    },
    {
        id: 3,
        title: 'Ẩm thực (F&B)',
        description: 'Menu nhà hàng, chiến dịch F&B, food styling chuyên nghiệp — hình ảnh kích thích vị giác mạnh mẽ, tôn vinh đặc trưng của từng món ăn.',
        subItems: ['Menu', 'F&B', 'Food Styling', 'Campaign'],
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200',
        link: '/services'
    },
    {
        id: 4,
        title: 'Thời trang & Editorial',
        description: 'Lookbook thời trang, chiến dịch thương hiệu, ảnh beauty, phong cách sống — bắt trọn thần thái cá tính, truyền tải thông điệp duy mỹ của bộ sưu tập.',
        subItems: ['Lookbook', 'Campaign', 'Beauty', 'Editorial'],
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200',
        link: '/services'
    },
    {
        id: 5,
        title: 'Profile & Branding',
        description: 'Ảnh chân dung doanh nhân, CEO, đội ngũ nhân sự, bộ nhận diện thương hiệu — xây dựng hình ảnh chuyên nghiệp, nhất quán và uy tín trên mọi nền tảng số.',
        subItems: ['CEO', 'Team', 'LinkedIn', 'Brand Identity'],
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200',
        link: '/services'
    }
];

const Home: React.FC = () => {
    const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
        >
            {/* 1. Hero Section */}
            <Hero />

            {/* 2. Brand Marquee Ticker */}
            <div style={{
                overflow: 'hidden',
                background: 'linear-gradient(90deg, #080807, #12100d, #080807)',
                padding: '2rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
                <motion.div
                    animate={{ x: [0, -1600] }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                    style={{ display: 'flex', gap: '5rem', whiteSpace: 'nowrap', width: 'fit-content' }}
                >
                    {[...Array(3)].map((_, setIndex) => (
                        <div key={setIndex} style={{ display: 'flex', gap: '5rem', alignItems: 'center' }}>
                            {['NHIẾP ẢNH', 'QUAY PHIM', 'THƯƠNG HIỆU', 'ĐẠO DIỄN SÁNG TẠO', 'SẢN XUẤT NỘI DUNG', 'HẬU KỲ', 'LÀM PHIM', 'ĐẠO DIỄN NGHỆ THUẬT'].map((text, i) => (
                                <span key={i} style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '2rem', color: '#FFFFFF',
                                    textTransform: 'uppercase', fontWeight: 900,
                                    display: 'flex', alignItems: 'center', gap: '5rem',
                                    letterSpacing: '0.1em'
                                }}>
                                    {text}
                                    <span style={{ width: '6px', height: '6px', backgroundColor: '#FFFFFF', display: 'inline-block' }} />
                                </span>
                            ))}
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* 3. Giới thiệu Section (Editorial 2 columns) */}
            <section style={{ padding: '8rem 0', background: 'radial-gradient(circle at 10% 20%, rgba(208, 169, 104, 0.05) 0%, transparent 60%), linear-gradient(180deg, #070706 0%, #0F0E0C 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
                    <div className="giothieu-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                        
                        {/* Left Column: Interactive Cinematic Viewfinder Viewport */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            style={{
                                width: '100%',
                                aspectRatio: '16/10',
                                position: 'relative',
                                overflow: 'hidden',
                                border: '1px solid rgba(255,255,255,0.08)',
                                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
                                backgroundColor: '#000000'
                            }}
                            className="intro-viewport"
                        >
                            {/* Cinematic Image of director at work */}
                            <img 
                                src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&q=80&w=800" 
                                alt="Director at work" 
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    filter: 'contrast(1.05) brightness(0.7) grayscale(20%)',
                                    transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                                className="intro-viewport-image"
                            />

                            {/* Vignette & overlays */}
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)', pointerEvents: 'none' }} />

                            {/* Corner viewfinders */}
                            <div style={{ position: 'absolute', inset: '1rem', pointerEvents: 'none' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '12px', height: '12px', borderTop: '2px solid #C09A5A', borderLeft: '2px solid #C09A5A' }} />
                                <div style={{ position: 'absolute', top: 0, right: 0, width: '12px', height: '12px', borderTop: '2px solid #C09A5A', borderRight: '2px solid #C09A5A' }} />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '12px', height: '12px', borderBottom: '2px solid #C09A5A', borderLeft: '2px solid #C09A5A' }} />
                                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', borderBottom: '2px solid #C09A5A', borderRight: '2px solid #C09A5A' }} />
                            </div>

                            {/* HUD telemetry text */}
                            <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', display: 'flex', alignItems: 'center', gap: '6px', pointerEvents: 'none' }}>
                                <div style={{ width: '6px', height: '6px', backgroundColor: '#FF3B30', borderRadius: '50%', animation: 'blinking 1.5s infinite' }} />
                                <span style={{ fontSize: '0.55rem', color: '#FF3B30', letterSpacing: '0.15em', fontWeight: 900 }}>REC</span>
                            </div>
                            <span style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', pointerEvents: 'none' }}>
                                FOCAL: 50MM | T2.2
                            </span>
                            <span style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', pointerEvents: 'none' }}>
                                ISO: 800 | 24 FPS
                            </span>
                            <span style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', fontSize: '0.6rem', color: '#C09A5A', fontWeight: 800, fontFamily: 'monospace', pointerEvents: 'none' }}>
                                AURA OPTICS
                            </span>
                        </motion.div>

                        {/* Right Column: Dynamic storytelling content */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                        >
                            <span style={{
                                color: '#C09A5A',
                                textTransform: 'uppercase',
                                letterSpacing: '0.3em',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                display: 'block',
                                marginBottom: '1rem'
                            }}>
                                01 / STORYTELLING STUDIO
                            </span>
                            <h2 style={{
                                fontSize: 'clamp(2rem, 4.5vw, 3rem)',
                                fontWeight: 900,
                                fontFamily: 'var(--font-display)',
                                textTransform: 'uppercase',
                                color: 'var(--color-text)',
                                margin: '0 0 1.5rem 0',
                                lineHeight: 1.15,
                                letterSpacing: '0.02em',
                            }}>
                                AURA PRODUCTION HOUSE
                            </h2>
                            <p style={{
                                fontSize: '0.98rem',
                                lineHeight: 1.8,
                                color: 'rgba(255,255,255,0.7)',
                                fontWeight: 400,
                                margin: '0 0 2.5rem 0',
                                textAlign: 'justify'
                            }}>
                                Mỗi sản phẩm từ Aura không chỉ là một bộ ảnh hay video, mà là thành quả của quá trình thấu hiểu thương hiệu, sáng tạo không ngừng và sự cam kết mang lại chất lượng vượt trội. Chúng tôi mong muốn hình ảnh của mình sẽ là “vũ khí” lợi hại, giúp doanh nghiệp của bạn chinh phục những đỉnh cao mới trong kinh doanh.
                            </p>

                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                                <Link to="/about" style={{
                                    border: '1px solid #C09A5A',
                                    color: '#050505',
                                    backgroundColor: '#C09A5A',
                                    padding: '1rem 2.2rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 900,
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                }} className="intro-btn-luxury">
                                    Về chúng tôi
                                </Link>

                                <Link to="/services" style={{
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    color: '#FFFFFF',
                                    backgroundColor: 'transparent',
                                    padding: '1rem 2.2rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 900,
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                }} className="intro-btn-outline">
                                    Dịch vụ
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 4. Dịch vụ & Thể loại Section (Interactive Category Showcase) - Specialties Vertical Accordion */}
            <section style={{
                width: '100%',
                background: 'radial-gradient(circle at 90% 10%, rgba(208, 169, 104, 0.05) 0%, transparent 55%), var(--color-bg)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                position: 'relative'
            }}>
                <div className="container" style={{ paddingTop: '6rem', paddingBottom: '3rem' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span style={{
                            color: 'rgba(255,255,255,0.4)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            display: 'block',
                            marginBottom: '1rem'
                        }}>
                            DỊCH VỤ CỦA CHÚNG TÔI
                        </span>
                        <h2 style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                            color: 'var(--color-text)',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            margin: 0,
                            lineHeight: 1.1
                        }}>
                            THỂ LOẠI SẢN XUẤT
                        </h2>
                    </motion.div>
                </div>

                {/* Vertical Accordion Wrapper */}
                <div style={{
                    width: '100%',
                    height: '600px',
                    display: 'flex',
                    flexDirection: 'row',
                    backgroundColor: '#090806',
                    overflow: 'hidden',
                    position: 'relative',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                }} className="specialties-accordion-wrapper">

                    {serviceCategories.map((cat, idx) => {
                        const isHovered = activeAccordionIndex === idx;
                        const numStr = `0${idx + 1}`;
                        const shortLabels = ['KIẾN TRÚC', 'SẢN PHẨM', 'ẨM THỰC', 'THỜI TRANG', 'PROFILE'];
                        const label = shortLabels[idx];

                        return (
                            <div
                                key={cat.id}
                                onMouseEnter={() => setActiveAccordionIndex(idx)}
                                style={{
                                    flex: isHovered ? '2.5' : '1',
                                    height: '100%',
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    padding: '3rem 2.5rem',
                                    boxSizing: 'border-box',
                                    transition: 'flex 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                                    borderRight: idx < serviceCategories.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                                    overflow: 'hidden',
                                    cursor: 'default'
                                }}
                                className="accordion-strip"
                            >
                                {/* Background Image with Grayscale & Zoom Transitions */}
                                <div style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'hidden' }}>
                                    {/* Vignette Overlay for dark readability */}
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.58) 46%, rgba(0,0,0,0.16) 100%)',
                                        zIndex: 2,
                                    }} className="accordion-overlay" />

                                    <motion.img
                                        src={cat.image}
                                        alt={cat.title}
                                        animate={{
                                            scale: isHovered ? 1.08 : 1.0,
                                            filter: isHovered ? 'grayscale(0%) contrast(1.05)' : 'grayscale(100%) brightness(0.4)'
                                        }}
                                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>

                                {/* Vertical Category Name on the Left */}
                                <div className="accordion-vertical-title" style={{
                                    zIndex: 3,
                                    position: 'absolute',
                                    left: '2rem',
                                    top: '3rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    transform: 'rotate(-90deg) translateX(-100%)',
                                    transformOrigin: 'top left',
                                    whiteSpace: 'nowrap',
                                }}>
                                    <span style={{
                                        color: isHovered ? '#C09A5A' : 'rgba(255,255,255,0.4)',
                                        fontSize: '0.85rem',
                                        fontWeight: 800,
                                        letterSpacing: '0.25em',
                                        textTransform: 'uppercase',
                                        fontFamily: 'var(--font-display)',
                                        transition: 'color 0.3s ease'
                                    }}>
                                        {label}
                                    </span>
                                </div>

                                {/* Expanded Content Area */}
                                <div style={{
                                    zIndex: 3,
                                    position: 'absolute',
                                    bottom: '6.5rem',
                                    left: '2.5rem',
                                    right: '2.5rem',
                                    pointerEvents: isHovered ? 'auto' : 'none',
                                    maxWidth: '420px',
                                }}>
                                    <AnimatePresence>
                                        {isHovered && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 20 }}
                                                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                                                style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                                            >
                                                <h3 style={{
                                                    fontSize: '2rem',
                                                    color: '#FFFFFF',
                                                    margin: 0,
                                                    fontFamily: 'var(--font-display)',
                                                    fontWeight: 900,
                                                    lineHeight: 1.15,
                                                    textShadow: '0 4px 10px rgba(0,0,0,0.6)'
                                                }}>
                                                    {cat.title}
                                                </h3>
                                                <p style={{
                                                    fontSize: '0.85rem',
                                                    color: 'rgba(255,255,255,0.85)',
                                                    margin: 0,
                                                    lineHeight: 1.6,
                                                    textShadow: '0 2px 4px rgba(0,0,0,0.6)'
                                                }}>
                                                    {cat.description}
                                                </p>
                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                                                    {cat.subItems.map((sub, sIdx) => (
                                                        <span key={sIdx} style={{
                                                            fontSize: '0.65rem',
                                                            color: '#C09A5A',
                                                            border: '1px solid rgba(192, 154, 90, 0.3)',
                                                            padding: '2px 8px',
                                                            borderRadius: '2px',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.05em',
                                                            fontWeight: 600,
                                                            backgroundColor: 'rgba(10, 10, 10, 0.4)'
                                                        }}>
                                                            {sub}
                                                        </span>
                                                    ))}
                                                </div>
                                                <Link to={cat.link} style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    color: '#C09A5A',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 800,
                                                    letterSpacing: '0.15em',
                                                    textTransform: 'uppercase',
                                                    marginTop: '0.5rem',
                                                    width: 'fit-content'
                                                }} className="accordion-link">
                                                    Khám phá <ArrowRight size={14} className="accordion-link-arrow" />
                                                </Link>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Bottom Info block (Large Number) */}
                                <div style={{
                                    zIndex: 3,
                                    marginTop: 'auto',
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    justifyContent: 'space-between',
                                    boxSizing: 'border-box',
                                }} className="accordion-bottom-info">
                                    {/* Large Serif Number */}
                                    <span style={{
                                        fontSize: 'clamp(2.5rem, 5vw, 5.5rem)',
                                        color: isHovered ? '#C09A5A' : 'rgba(255,255,255,0.15)',
                                        fontWeight: '900',
                                        lineHeight: '0.8',
                                        fontFamily: 'var(--font-display), Georgia, serif',
                                        letterSpacing: '0',
                                        transition: 'color 0.4s ease'
                                    }}>
                                        {numStr}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 5. Featured Projects Section */}
            <div id="featured-projects">
                <FeaturedProjects />
            </div>

            {/* 6. Studio Stats */}
            <StudioStats />

            {/* 7. Call To Action & Contact Info Section */}
            <section style={{
                padding: '8rem 0',
                background: 'radial-gradient(circle at 50% 50%, rgba(208, 169, 104, 0.08) 0%, transparent 70%), linear-gradient(180deg, #090806 0%, #060605 100%)',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                position: 'relative',
            }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '6rem' }} className="cta-grid">
                        
                        {/* Call to Action */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                        >
                            <span style={{
                                color: '#C09A5A',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '0.25em',
                                display: 'block',
                                marginBottom: '1.5rem'
                            }}>
                                HỢP TÁC CÙNG AURA
                            </span>
                            <h2 style={{
                                fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
                                fontWeight: 900,
                                fontFamily: 'var(--font-display)',
                                textTransform: 'uppercase',
                                color: '#FFFFFF',
                                margin: '0 0 2rem 0',
                                lineHeight: 1.15,
                            }}>
                                Hãy để chúng tôi nâng tầm <br />
                                câu chuyện thương hiệu của bạn
                            </h2>
                            <p style={{
                                fontSize: '1rem',
                                lineHeight: 1.75,
                                color: 'rgba(255,255,255,0.7)',
                                marginBottom: '3rem',
                                maxWidth: '520px'
                            }}>
                                Bạn đã sẵn sàng tạo ra những thước phim, bộ ảnh mang đậm dấu ấn duy mỹ của doanh nghiệp mình? Hãy kết nối với Aura để được tư vấn miễn phí giải pháp tối ưu nhất.
                            </p>
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <Link to="/contact" style={{
                                    backgroundColor: '#C09A5A',
                                    color: '#FFFFFF',
                                    padding: '1.1rem 2.8rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    transition: 'all 0.3s ease',
                                    border: 'none'
                                }} className="btn-join-home">
                                    LIÊN HỆ NGAY
                                </Link>
                                <Link to="/packages" style={{
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    color: '#FFFFFF',
                                    backgroundColor: 'transparent',
                                    padding: '1.1rem 2.8rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    transition: 'all 0.3s ease',
                                }} className="intro-btn">
                                    XEM BẢNG GIÁ
                                </Link>
                            </div>
                        </motion.div>

                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: '2.5rem',
                                padding: '3.5rem 3rem',
                                backgroundColor: '#11100E',
                                border: '1px solid rgba(255,255,255,0.06)'
                            }}
                            className="cta-contact-box"
                        >
                            <h3 style={{
                                fontSize: '1.4rem',
                                fontWeight: 800,
                                fontFamily: 'var(--font-display)',
                                textTransform: 'uppercase',
                                color: '#FFFFFF',
                                margin: 0,
                                letterSpacing: '0.05em',
                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                                paddingBottom: '1.2rem'
                            }}>
                                THÔNG TIN LIÊN HỆ
                            </h3>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                                <div>
                                    <span style={{ fontSize: '0.7rem', color: '#C09A5A', letterSpacing: '0.15em', fontWeight: 700, display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Địa Chỉ Trụ Sở</span>
                                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>Toà nhà Aura Production, 128 Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh</p>
                                </div>
                                
                                <div>
                                    <span style={{ fontSize: '0.7rem', color: '#C09A5A', letterSpacing: '0.15em', fontWeight: 700, display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Đường Dây Nóng</span>
                                    <p style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>0909 123 456</p>
                                </div>

                                <div>
                                    <span style={{ fontSize: '0.7rem', color: '#C09A5A', letterSpacing: '0.15em', fontWeight: 700, display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Hòm Thư Điện Tử</span>
                                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', margin: 0 }}>contact@auraproduction.com</p>
                                </div>

                                <div>
                                    <span style={{ fontSize: '0.7rem', color: '#C09A5A', letterSpacing: '0.15em', fontWeight: 700, display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Giờ Làm Việc</span>
                                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', margin: 0 }}>Thứ 2 - Thứ 7: 09:00 - 18:00</p>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </section>



            <style>{`
                .intro-btn:hover {
                    background-color: var(--color-text) !important;
                    color: var(--color-bg) !important;
                }
                .intro-btn-luxury:hover {
                    background-color: #FFFFFF !important;
                    color: #050505 !important;
                    border-color: #FFFFFF !important;
                    box-shadow: 0 10px 25px rgba(192, 154, 90, 0.2) !important;
                }
                .intro-btn-outline:hover {
                    border-color: #C09A5A !important;
                    color: #C09A5A !important;
                }
                .intro-viewport:hover .intro-viewport-image {
                    transform: scale(1.05) !important;
                }
                @keyframes blinking {
                    0% { opacity: 0.3; }
                    50% { opacity: 1; }
                    100% { opacity: 0.3; }
                }
                .accordion-link {
                    transition: color 0.3s ease;
                }
                .accordion-link:hover {
                    color: #FFFFFF !important;
                }
                .accordion-link:hover .accordion-link-arrow {
                    transform: translateX(4px);
                }
                .accordion-link-arrow {
                    transition: transform 0.3s ease;
                }
                .partner-brand:hover {
                    opacity: 0.8 !important;
                }
                .contact-link {
                    transition: color 0.3s;
                }
                .contact-link:hover {
                    color: rgba(255,255,255,0.7) !important;
                }
                .social-link {
                    transition: color 0.3s;
                }
                .social-link:hover {
                    color: #FFFFFF !important;
                }
                
                /* Accordion Hover overlays */
                .specialties-accordion-wrapper .accordion-strip:hover .accordion-overlay {
                    background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.15) 100%) !important;
                }
                
                @media (max-width: 1024px) {
                    .giothieu-grid, .cta-grid {
                        grid-template-columns: 1fr !important;
                        gap: 3rem !important;
                    }
                    .specialties-accordion-wrapper {
                        flex-direction: column !important;
                        height: auto !important;
                    }
                    .accordion-strip {
                        flex: none !important;
                        width: 100% !important;
                        height: 200px !important;
                        border-right: none !important;
                        border-bottom: 1px solid rgba(255,255,255,0.08) !important;
                        padding: 2rem 1.5rem !important;
                    }
                    .accordion-vertical-title {
                        transform: none !important;
                        position: relative !important;
                        left: 0 !important;
                        top: 0 !important;
                        margin-bottom: 1.5rem !important;
                    }
                    .accordion-bottom-info {
                        margin-top: auto !important;
                    }
                }
            `}</style>
        </motion.div>
    );
};

export default Home;
