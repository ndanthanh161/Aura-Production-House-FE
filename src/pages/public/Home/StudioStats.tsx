import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const tunnelData = [
    {
        id: 1,
        title: "KHỞI NGUỒN",
        desc: "Mọi hành trình vĩ đại đều bắt đầu từ những bước chân đầu tiên đầy đam mê.",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200",
        stats: "10+ DỰ ÁN ĐẦU TAY"
    },
    {
        id: 2,
        title: "ĐỒNG HÀNH",
        desc: "Sự tin tưởng của những đối tác tiên phong là động lực để Aura vươn xa.",
        image: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=1200",
        stats: "05+ ĐỐI TÁC TIN CẬY"
    },
    {
        id: 3,
        title: "TỈ MỈ",
        desc: "Chất lượng không nằm ở số lượng, mà ở sự tử tế trong từng khung hình.",
        image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1200",
        stats: "100+ GIỜ HẬU KỲ"
    },
    {
        id: 4,
        title: "SÁNG TẠO",
        desc: "Phá bỏ các giới hạn cũ để tìm kiếm những ngôn ngữ hình ảnh mới mẻ.",
        image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=1200",
        stats: "24/7 TƯ DUY MỚI"
    },
    {
        id: 5,
        title: "TÂM HUYẾT",
        desc: "Aura cam kết mang lại giá trị thực chất và sự hài lòng tuyệt đối cho bạn.",
        image: "https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&q=80&w=1200",
        stats: "5.0 ĐÁNH GIÁ CHUẨN"
    }
];

const TunnelItem = ({ item, index, total, scrollYProgress }: { item: any, index: number, total: number, scrollYProgress: any }) => {
    // Each item has a specific range of the total scroll
    const start = index / total;
    const end = (index + 1) / total;

    // Z-axis movement (Scale and Opacity) - cinematic zoom effect
    // Cross-fade logic: The item stays 100% visible until the next one is ready
    // For the first item, we delay the fade-in to let the intro clear out completely
    const actualStart = index === 0 ? start + 0.1 : start;
    const opacity = useTransform(
        scrollYProgress,
        [actualStart - 0.05, actualStart, end, end + 0.05],
        [0, 1, 1, 0]
    );
    const scale = useTransform(
        scrollYProgress,
        [start, start + 0.1, end - 0.1, end],
        [1.05, 1, 1, 0.95]
    );

    // Parallax for internal elements
    const yOffset = useTransform(scrollYProgress, [start, end], [30, -30]);

    return (
        <motion.div
            style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                scale,
                opacity,
                zIndex: total - index
            }}
        >
            <div style={{ position: 'relative', width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Background Image - Full Scenes Ngang */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    overflow: 'hidden'
                }}>
                    <motion.img
                        src={item.image}
                        style={{ width: '100%', height: '110%', objectFit: 'cover', y: yOffset }}
                    />
                    {/* Shadow overlays for depth and readability */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.6) 100%)' }} />
                </div>

                {/* Content Overlay */}
                <div style={{
                    position: 'relative',
                    textAlign: 'center',
                    color: '#fff',
                    zIndex: 10,
                    padding: '0 10vw',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.5rem'
                }}>
                    <motion.span
                        style={{
                            display: 'inline-block',
                            fontSize: '0.75rem',
                            letterSpacing: '0.5em',
                            color: '#fff',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)',
                            padding: '0.5rem 1.5rem',
                            borderRadius: '100px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                        }}
                    >
                        {item.stats}
                    </motion.span>

                    <h2 style={{
                        fontSize: 'clamp(3rem, 10vw, 8rem)',
                        fontWeight: 900,
                        fontFamily: 'var(--font-display)',
                        lineHeight: 1.1,
                        textShadow: '0 20px 40px rgba(0,0,0,0.4)',
                        textTransform: 'uppercase',
                        margin: '0.5rem 0',
                    }}>
                        {item.title}
                    </h2>

                    <p style={{
                        fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                        maxWidth: '650px',
                        margin: '0 auto',
                        opacity: 0.9,
                        fontWeight: 500,
                        lineHeight: 1.6,
                        textShadow: '0 2px 15px rgba(0,0,0,0.3)',
                        letterSpacing: '0.01em',
                        fontStyle: 'italic'
                    }}>
                        "{item.desc}"
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export const StudioStats: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Smooth scroll physics
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div ref={containerRef} style={{ height: '400vh', position: 'relative', backgroundColor: 'var(--color-bg)' }}>
            {/* The Sticky Canvas */}
            <div style={{
                position: 'sticky',
                top: 0,
                height: '100vh',
                width: '100%',
                overflow: 'hidden',
                backgroundColor: 'var(--color-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {/* Visual Background Noise / Grain */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.05,
                    pointerEvents: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }} />

                {/* Introductory Message in the Tunnel */}
                <motion.div
                    style={{
                        position: 'absolute',
                        zIndex: 20,
                        textAlign: 'center',
                        opacity: useTransform(smoothProgress, [0, 0.07], [1, 0]),
                        scale: useTransform(smoothProgress, [0, 0.07], [1, 0.8])
                    }}
                >
                    <motion.span
                        style={{ color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.4em', fontSize: '0.7rem', fontWeight: 800, display: 'block', marginBottom: '2rem' }}
                    >
                        Khám Phá Aura
                    </motion.span>
                    <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--color-text)', textTransform: 'uppercase', lineHeight: 1.15 }}>
                        Dấn Thân Vào <br /> <span className="text-gradient">Không Gian Số</span>
                    </h2>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '2rem', letterSpacing: '0.3em', fontWeight: 600 }}>SCROLL TO EXPLORE</p>
                </motion.div>

                {/* The "Tunnel" Items */}
                {tunnelData.map((item, index) => (
                    <TunnelItem
                        key={item.id}
                        item={item}
                        index={index}
                        total={tunnelData.length}
                        scrollYProgress={smoothProgress}
                    />
                ))}

                {/* Scroll Indicator */}
                <div style={{
                    position: 'absolute',
                    bottom: '40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 30
                }}>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{ width: '1px', height: '60px', backgroundColor: 'var(--color-border)', position: 'relative' }}
                    >
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '40%', backgroundColor: 'var(--color-accent)' }} />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
