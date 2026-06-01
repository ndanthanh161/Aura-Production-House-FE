import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';
import { portfolioApi, getCategoryLabel } from '../../../services/portfolioApi';
import type { PortfolioItem } from '../../../services/portfolioApi';

const DEFAULT_PROJECTS = [
    {
        id: 1,
        category: "Sự kiện",
        title: "LOS LANCES GALA NIGHT",
        desc: "Ghi hình toàn bộ đêm Gala từ khai mạc đến trao giải. Multi-camera, livestream và highlight reel bàn giao trong vòng 24h.",
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1600",
    },
    {
        id: 2,
        category: "Kiến trúc",
        title: "DANANG RESORT",
        desc: "Bộ ảnh kiến trúc và nội thất nghỉ dưỡng đẳng cấp quốc tế, khai thác trọn vẹn góc máy rộng và ánh sáng tự nhiên tuyệt mỹ.",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1600",
    },
    {
        id: 3,
        category: "Kiến trúc - nội thất",
        title: "SKY VILLA",
        desc: "Concept thiết kế hiện đại, truyền tải trọn vẹn không gian sang trọng và tầm nhìn panorama tuyệt đỉnh từ tầng cao.",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600",
    },
    {
        id: 4,
        category: "Video",
        title: "NANGANO BRAND FILM",
        desc: "Thước phim thương hiệu đỉnh cao, kết hợp nghệ thuật kể chuyện cinematic và hậu kỳ chuyên nghiệp đỉnh cao.",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1600",
    },
    {
        id: 5,
        category: "Ẩm thực",
        title: "MARRAKECH FOODIE",
        desc: "Food styling và hình ảnh kích thích thị giác, tôn vinh những nét tinh hoa ẩm thực đường phố và menu F&B cao cấp.",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=1600",
    }
];

export const Hero: React.FC = () => {
    const [projects, setProjects] = useState<any[]>(DEFAULT_PROJECTS);
    const [activeIndex, setActiveIndex] = useState(0);

    // Fetch projects from the backend API
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                console.log("[AURA DEBUG] Bắt đầu gọi API lấy danh sách dự án...");
                const res = await portfolioApi.getPublished();
                const data = res.data || [];
                console.log("[AURA DEBUG] Dữ liệu gốc nhận được từ BE:", data);

                // Lọc các dự án HOT (isHot === true), sắp xếp mới nhất, lấy tối đa 5 cái và map dữ liệu
                const hotProjects = data
                    .filter((p: PortfolioItem) => p.isHot)
                    .sort((a: PortfolioItem, b: PortfolioItem) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    )
                    .slice(0, 5) // Chỉ lấy tối đa 5 dự án mới nhất từ BE
                    .map((p: PortfolioItem) => {
                        const plainTextDesc = (p.content || '').replace(/<[^>]*>/g, '');
                        const truncatedDesc = plainTextDesc.length > 150
                            ? plainTextDesc.substring(0, 150) + '...'
                            : plainTextDesc || 'Nhấp để xem chi tiết dự án sản xuất hình ảnh/video chất lượng cao của Aura.';

                        return {
                            id: p.id,
                            category: getCategoryLabel(p.category),
                            title: p.title,
                            desc: truncatedDesc,
                            image: p.thumbnailUrl || (p.mediaItems.find(m => m.mediaType === 'image')?.url) || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1600',
                        };
                    });

                console.log("[AURA DEBUG] Số lượng dự án được tích Hot (isHot: true):", hotProjects.length);

                if (hotProjects.length > 0) {
                    console.log("[AURA DEBUG] Thành công! Áp dụng dữ liệu thực tế từ BE.");
                    
                    // Preload high-resolution backend images in background browser cache
                    hotProjects.forEach((p: any) => {
                        const img = new Image();
                        img.src = p.image;
                    });
                    
                    setProjects(hotProjects);
                } else {
                    console.warn("[AURA DEBUG] Không tìm thấy dự án nào có tích 'Hot' (isHot: true) hoặc DB trống. Tự động dùng Mock Data để tránh giao diện bị lỗi.");
                    
                    // Preload mock images
                    DEFAULT_PROJECTS.forEach((p: any) => {
                        const img = new Image();
                        img.src = p.image;
                    });
                    
                    setProjects(DEFAULT_PROJECTS);
                }
            } catch (error) {
                console.error('[AURA DEBUG] Lỗi kết nối hoặc gọi API thất bại:', error);
                
                // Preload mock images on failure
                DEFAULT_PROJECTS.forEach((p: any) => {
                    const img = new Image();
                    img.src = p.image;
                });
                
                setProjects(DEFAULT_PROJECTS);
            }
        };
        fetchProjects();
    }, []);

    // Auto-advance slider every 3 seconds - Balanced rhythm to prevent constant busy loading
    useEffect(() => {
        if (projects.length === 0) return;
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % projects.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [projects.length]);

    const nextSlide = () => {
        if (projects.length === 0) return;
        setActiveIndex((prev) => (prev + 1) % projects.length);
    };

    const prevSlide = () => {
        if (projects.length === 0) return;
        setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
    };



    if (projects.length === 0) return null;

    const currentProject = projects[activeIndex];

    return (
        <section style={{
            minHeight: '760px',
            height: '100vh',
            width: '100vw',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#000000',
        }}>
            {/* 1. Cinematic Zoom-In Background with Parallel Cross-fade (Instant cached loading) */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
                <AnimatePresence>
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, scale: 1.0 }}
                        animate={{ opacity: 1, scale: 1.08 }}
                        exit={{ opacity: 0, scale: 1.12 }}
                        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                        style={{ position: 'absolute', inset: 0 }}
                    >
                        {/* High-end linear gradient overlay for 50/50 layout readability */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            background: 'linear-gradient(90deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.62) 34%, rgba(0,0,0,0.16) 64%, rgba(0,0,0,0.5) 100%)',
                            zIndex: 2,
                        }} />
                        <img
                            src={currentProject.image}
                            alt={currentProject.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* 2. Main Layout Container - Immersive Full Width */}
            <div style={{
                position: 'relative',
                zIndex: 4,
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                paddingTop: '80px',
            }}>
                <div className="hero-horizon-grid">

                    {/* Left Column: Active Project Details - Exactly 50% width */}
                    <div className="hero-left-column">
                        {/* Slide Category Header */}
                        <motion.div
                            key={`cat-${activeIndex}`}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}
                        >
                            {/* Gold line above category */}
                            <div style={{ width: '32px', height: '2px', backgroundColor: '#C09A5A' }} />
                            <span style={{
                                color: '#C09A5A',
                                fontSize: '1.1rem',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                fontWeight: 800,
                            }}>
                                {currentProject.category}
                            </span>
                        </motion.div>

                        {/* Slide Title */}
                        <div style={{ overflow: 'hidden', marginBottom: '1.5rem' }}>
                            <motion.h1
                                key={`title-${activeIndex}`}
                                initial={{ y: '110%' }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                    fontSize: 'clamp(2.2rem, 4.5vw, 4.2rem)',
                                    lineHeight: 1.15,
                                    margin: 0,
                                    fontWeight: '900',
                                    fontFamily: 'var(--font-display)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0',
                                    color: '#FFFFFF',
                                    textShadow: '0 18px 42px rgba(0,0,0,0.62)',
                                }}
                            >
                                {currentProject.title}
                            </motion.h1>
                        </div>

                        {/* Slide Description Excerpt */}
                        <motion.p
                            key={`desc-${activeIndex}`}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            style={{
                                color: 'rgba(255,255,255,0.85)',
                                fontSize: 'clamp(0.9rem, 1.1vw, 1.05rem)',
                                lineHeight: '1.8',
                                margin: '0 0 3.5rem 0',
                                maxWidth: '540px',
                                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                            }}
                        >
                            {currentProject.desc}
                        </motion.p>

                        {/* CTA Controls */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}
                        >
                            {/* Round Gold Bookmark style button */}
                            <button style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                backgroundColor: '#C09A5A',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#FFFFFF',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                            }} className="bookmark-gold-btn">
                                <Bookmark size={18} fill="#FFFFFF" />
                            </button>

                            {/* Pill outline button: XEM DỰ ÁN */}
                            <Link to={`/portfolio?id=${currentProject.id}`} style={{
                                border: '1px solid rgba(255,255,255,0.4)',
                                backgroundColor: 'transparent',
                                color: '#FFFFFF',
                                padding: '0.85rem 2.5rem',
                                fontSize: '0.75rem',
                                letterSpacing: '0.2em',
                                fontWeight: 800,
                                borderRadius: '50px',
                                textTransform: 'uppercase',
                                transition: 'all 0.3s ease',
                                display: 'inline-block',
                            }} className="pill-outline-btn">
                                Xem dự án
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right Column: Carousel Horizon Cards - Exactly 50% width */}
                    <div className="carousel-horizon-cards-container">
                        {/* Horizontal Cards corridor (Mask Viewport) with rich vertical padding to prevent border cut-off */}
                        <div style={{
                            width: '100%',
                            overflow: 'hidden',
                            position: 'relative',
                            padding: '2.5rem 0.75rem'
                        }} className="cards-corridor-viewport">
                            <motion.div
                                animate={{ x: -activeIndex * 224 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                    display: 'flex',
                                    gap: '1.5rem',
                                    width: 'max-content',
                                    willChange: 'transform'
                                }}
                            >
                                {projects.map((project, index) => {
                                    const isActive = activeIndex === index;
                                    return (
                                        <motion.div
                                            key={project.id}
                                            onClick={() => setActiveIndex(index)}
                                            style={{
                                                flex: '0 0 auto',
                                                width: '200px',
                                                height: '280px',
                                                position: 'relative',
                                                borderRadius: '12px',
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                boxShadow: isActive
                                                    ? '0 24px 56px rgba(208, 169, 104, 0.24), 0 0 0 1px rgba(255,255,255,0.08) inset'
                                                    : '0 18px 44px rgba(0,0,0,0.42), 0 0 0 1px rgba(255,255,255,0.08) inset',
                                                border: isActive ? '2px solid #D0A968' : '1px solid rgba(255,255,255,0.12)',
                                                transformOrigin: 'bottom',
                                                boxSizing: 'border-box',
                                            }}
                                            whileHover={{ scale: 1.04 }}
                                            animate={{ scale: isActive ? 1.06 : 1.0 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            {/* Card background Image */}
                                            <div style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'hidden' }}>
                                                <div style={{
                                                    position: 'absolute', inset: 0,
                                                    background: 'linear-gradient(to top, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.35) 54%, rgba(0,0,0,0.04) 100%)',
                                                    zIndex: 2
                                                }} />
                                                <motion.img
                                                    src={project.image}
                                                    alt={project.title}
                                                    animate={{ scale: isActive ? 1.15 : 1.0 }}
                                                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            </div>

                                            {/* Card content overlaid */}
                                            <div style={{
                                                position: 'absolute',
                                                bottom: 0, left: 0, right: 0,
                                                padding: '1.25rem',
                                                zIndex: 3,
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '4px' }}>
                                                    <div style={{ width: '16px', height: '1.5px', backgroundColor: '#C09A5A' }} />
                                                    <span style={{ color: '#C09A5A', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800 }}>
                                                        {project.category}
                                                    </span>
                                                </div>
                                                <h4 style={{ color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 900, fontFamily: 'var(--font-display)', margin: 0, textTransform: 'uppercase', lineHeight: 1.2 }}>
                                                    {project.title.substring(0, 22) + (project.title.length > 22 ? '...' : '')}
                                                </h4>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        </div>

                        {/* Bottom Slide Navigation Control */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', marginTop: '1rem' }} className="carousel-nav-control">
                            {/* Arrows wrapper */}
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={prevSlide} style={{
                                    width: '42px',
                                    height: '42px',
                                    borderRadius: '50%',
                                    border: '1px solid rgba(255,255,255,0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#FFFFFF',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    backgroundColor: 'rgba(0,0,0,0.16)',
                                    backdropFilter: 'blur(12px)',
                                }} className="carousel-arrow-btn">
                                    <ChevronLeft size={20} />
                                </button>
                                <button onClick={nextSlide} style={{
                                    width: '42px',
                                    height: '42px',
                                    borderRadius: '50%',
                                    border: '1px solid rgba(255,255,255,0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#FFFFFF',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    backgroundColor: 'rgba(0,0,0,0.16)',
                                    backdropFilter: 'blur(12px)',
                                }} className="carousel-arrow-btn">
                                    <ChevronRight size={20} />
                                </button>
                            </div>

                            {/* Progress bar line indicator */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
                                <div style={{ height: '2px', backgroundColor: 'rgba(255,255,255,0.15)', flex: 1, position: 'relative' }}>
                                    <motion.div
                                        animate={{ width: `${((activeIndex + 1) / projects.length) * 100}%` }}
                                        transition={{ duration: 0.4 }}
                                        style={{ height: '100%', backgroundColor: '#C09A5A', position: 'absolute', top: 0, left: 0 }}
                                    />
                                </div>
                                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 700, fontFamily: 'monospace' }}>
                                    {projects.length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .hero-horizon-grid {
                    display: flex;
                    flex-direction: row;
                    width: 100%;
                    height: 100%;
                    align-items: center;
                }
                .hero-left-column {
                    width: 50%;
                    display: flex;
                    flex-direction: column;
                    color: #FFFFFF;
                    padding-left: clamp(3rem, 8vw, 8rem);
                    padding-right: 6%;
                    box-sizing: border-box;
                }
                .carousel-horizon-cards-container {
                    width: 50%;
                    display: flex;
                    flex-direction: column;
                    gap: 2.5rem;
                    padding-left: 2rem;
                    padding-right: 8%;
                    box-sizing: border-box;
                    position: relative;
                    overflow: hidden;
                }
                .bookmark-gold-btn:hover {
                    background-color: #A37F46 !important;
                    transform: translateY(-2px);
                }
                .pill-outline-btn:hover {
                    border-color: #FFFFFF !important;
                    background-color: rgba(255, 255, 255, 0.1) !important;
                    transform: translateY(-2px);
                }
                .carousel-arrow-btn:hover {
                    border-color: #C09A5A !important;
                    color: #C09A5A !important;
                    background-color: rgba(192, 154, 90, 0.1) !important;
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @media (max-width: 1024px) {
                    .hero-horizon-grid {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        justify-content: center !important;
                        gap: 3rem !important;
                        height: auto !important;
                        padding: 7rem 1.5rem 2rem 1.5rem !important;
                    }
                    .hero-left-column {
                        width: 100% !important;
                        padding-left: 0 !important;
                        padding-right: 0 !important;
                    }
                    .carousel-horizon-cards-container {
                        width: 100% !important;
                        padding-left: 0 !important;
                        padding-right: 0 !important;
                        gap: 1.5rem !important;
                    }
                    .cards-corridor-viewport {
                        overflow-x: auto !important;
                    }
                    .cards-corridor-viewport::-webkit-scrollbar {
                        display: none;
                    }
                }
            `}</style>
        </section>
    );
};

export default Hero;
