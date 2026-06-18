import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

export const SpecialtiesAccordion: React.FC = React.memo(() => {
    const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);

    return (
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
                                        scale: isHovered ? 1.08 : 1.0
                                    }}
                                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        filter: isHovered ? 'grayscale(0%) contrast(1.05)' : 'grayscale(100%) brightness(0.4)',
                                        transition: 'filter 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                                        willChange: 'transform'
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
                                bottom: '9rem',
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
                                            {/* Removed tags and Khám phá button */}
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
    );
});

SpecialtiesAccordion.displayName = 'SpecialtiesAccordion';
