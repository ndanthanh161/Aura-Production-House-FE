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
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200',
        link: '/services'
    },
    {
        id: 2,
        title: 'Sản phẩm',
        description: 'E-commerce, catalogue, pack-shot, mỹ phẩm — ảnh sản phẩm sắc nét, màu sắc trung thực chuẩn chỉnh, sẵn sàng dùng ngay cho web và quảng cáo.',
        subItems: ['Pack-shot', 'E-commerce', 'Mỹ phẩm', 'Lifestyle'],
        image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=1200',
        link: '/services'
    },
    {
        id: 3,
        title: 'Ẩm thực (F&B)',
        description: 'Menu nhà hàng, chiến dịch F&B, food styling chuyên nghiệp — hình ảnh kích thích vị giác mạnh mẽ, tôn vinh đặc trưng của từng món ăn.',
        subItems: ['Menu', 'F&B', 'Food Styling', 'Campaign'],
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200',
        link: '/services'
    },
    {
        id: 4,
        title: 'Thời trang & Editorial',
        description: 'Lookbook thời trang, chiến dịch thương hiệu, ảnh beauty, phong cách sống — bắt trọn thần thái cá tính, truyền tải thông điệp duy mỹ của bộ sưu tập.',
        subItems: ['Lookbook', 'Campaign', 'Beauty', 'Editorial'],
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200',
        link: '/services'
    },
    {
        id: 5,
        title: 'Profile & Branding',
        description: 'Ảnh chân dung doanh nhân, CEO, đội ngũ nhân sự, bộ nhận diện thương hiệu — xây dựng hình ảnh chuyên nghiệp, nhất quán và uy tín trên mọi nền tảng số.',
        subItems: ['CEO', 'Team', 'LinkedIn', 'Brand Identity'],
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200',
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
            <section style={{ padding: '8rem 0', background: 'linear-gradient(180deg, #070706 0%, #0F0E0C 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem' }}>
                    <div className="giothieu-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '6rem' }}>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                        >
                            <h2 style={{
                                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                                fontWeight: 900,
                                fontFamily: 'var(--font-display)',
                                textTransform: 'uppercase',
                                color: 'var(--color-text)',
                                margin: 0,
                                lineHeight: 1.1,
                                letterSpacing: '0',
                            }}>
                                GIỚI THIỆU
                            </h2>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}
                        >
                            <p style={{
                                fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                                lineHeight: 1.8,
                                color: 'rgba(255,255,255,0.85)',
                                fontWeight: 400,
                                margin: 0,
                                textAlign: 'justify'
                            }}>
                                Mỗi sản phẩm từ Aura không chỉ là một bộ ảnh hay video, mà là thành quả của quá trình thấu hiểu thương hiệu, sáng tạo không ngừng và sự cam kết mang lại chất lượng vượt trội. Chúng tôi mong muốn hình ảnh của mình sẽ là “vũ khí” lợi hại, giúp doanh nghiệp của bạn chinh phục những đỉnh cao mới trong kinh doanh.
                            </p>

                            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                                <Link to="/about" style={{
                                    border: '1px solid var(--color-text)',
                                    color: 'var(--color-text)',
                                    backgroundColor: 'transparent',
                                    padding: '0.9rem 2.2rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                    transition: 'all 0.3s ease',
                                }} className="intro-btn">
                                    Về chúng tôi
                                </Link>

                                <Link to="/services" style={{
                                    border: '1px solid var(--color-text)',
                                    color: 'var(--color-text)',
                                    backgroundColor: 'transparent',
                                    padding: '0.9rem 2.2rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                    transition: 'all 0.3s ease',
                                }} className="intro-btn">
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
                backgroundColor: 'var(--color-bg)',
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

            {/* 7. Strategic Partners Section (Các đối tác chiến lược) */}
            <section style={{
                padding: '6rem 0',
                background: 'linear-gradient(180deg, #090806 0%, #070706 100%)',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <span style={{
                            color: 'rgba(255,255,255,0.4)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.25em',
                            display: 'block',
                            marginBottom: '3rem'
                        }}>
                            ĐỐI TÁC CHIẾN LƯỢC
                        </span>

                        <div style={{ overflow: 'hidden' }}>
                            <motion.div
                                animate={{ x: [0, -1000] }}
                                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                                style={{ display: 'flex', gap: '6rem', width: 'fit-content' }}
                            >
                                {[...Array(3)].map((_, setIndex) => (
                                    <div key={setIndex} style={{ display: 'flex', gap: '6rem' }}>
                                        {['AURA RESORTS', 'VICHOMES', 'F&B GROUP', 'TEKCOM', 'AMAZING WATERBAY', 'VOGUE VN', 'LILO PARTNERS'].map((brand) => (
                                            <span
                                                key={`${setIndex}-${brand}`}
                                                style={{
                                                    fontSize: '1.25rem',
                                                    fontWeight: 800,
                                                    letterSpacing: '0.2em',
                                                    color: '#FFFFFF',
                                                    opacity: 0.3,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s',
                                                    fontFamily: 'var(--font-display)',
                                                    textTransform: 'uppercase'
                                                }}
                                                className="partner-brand"
                                            >
                                                {brand}
                                            </span>
                                        ))}
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>



            <style>{`
                .intro-btn:hover {
                    background-color: var(--color-text) !important;
                    color: var(--color-bg) !important;
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
