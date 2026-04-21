import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronRight, ChevronLeft } from 'lucide-react';
import { ProjectDetailModal } from '../../../components/ProjectDetailModal';

const projects = [
    {
        id: 1,
        title: 'Hiện Đại Tối Giản',
        category: 'Nhiếp Ảnh',
        year: '2024',
        client: 'Modern Living',
        image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1200',
        description: 'Dự án nhiếp ảnh kiến trúc tập trung vào sự tối giản, sử dụng ánh sáng tự nhiên để làm nổi bật những đường nét tinh tế của không gian sống hiện đại.',
        credits: [
            { role: 'Director', name: 'Hoàng Anh' },
            { role: 'DOP', name: 'Minh Trần' },
            { role: 'Editor', name: 'Thanh Sơn' },
            { role: 'Stylist', name: 'Lê Vy' }
        ]
    },
    {
        id: 2,
        title: 'Bản Đạo Diễn',
        category: 'Quay Phim',
        year: '2024',
        client: 'Indie Film Fest',
        image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200',
        description: 'Tác phẩm phim ngắn mang đậm dấu ấn cá nhân, kết hợp giữa kỹ thuật quay phim truyền thống và phong cách biên tập hiện đại để kể một câu chuyện đầy cảm xúc.',
        credits: [
            { role: 'Director', name: 'Tuấn Nguyễn' },
            { role: 'DOP', name: 'Huy Phạm' },
            { role: 'Music', name: 'Đức Phúc' },
            { role: 'Colorist', name: 'Nam Lê' }
        ]
    },
    {
        id: 3,
        title: 'Nhận Diện Thương Hiệu 2024',
        category: 'Thương Hiệu Cá Nhân',
        year: '2023',
        client: 'Creative Leaders',
        image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1200',
        description: 'Chiến dịch xây dựng hình ảnh thương hiệu toàn diện cho các chuyên gia sáng tạo, giúp họ khẳng định vị thế và ghi dấu ấn riêng trong ngành.',
        credits: [
            { role: 'Director', name: 'Lan Hương' },
            { role: 'Lighting', name: 'Quốc Bảo' },
            { role: 'MUA', name: 'Kim Chi' },
            { role: 'Agency', name: 'Aura House' }
        ]
    },
    {
        id: 4,
        title: 'Bộ Sưu Tập Lumière',
        category: 'Biên Tập',
        year: '2023',
        client: 'Lumière Gallery',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=1200',
        description: 'Loạt hình ảnh và video được biên tập tỉ mỉ, lấy cảm hứng từ sự chuyển động của ánh sáng và màu sắc để tạo ra trải nghiệm thị giác ấn tượng.',
        credits: [
            { role: 'Director', name: 'Việt Anh' },
            { role: 'VFX', name: 'Quang Huy' },
            { role: 'DOP', name: 'Hải Đăng' },
            { role: 'Concept', name: 'Neo Seoul' }
        ]
    },
];

export const FeaturedProjects: React.FC = () => {
    const listRef = useRef<HTMLDivElement>(null);
    const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

    // Duplicating projects 11 times to create a robust infinite loop effect that survives rapid clicking
    const SETS = 11;
    const MIDDLE_SET = 5;
    const extendedProjects = Array(SETS).fill(projects).flat();

    const targetIndexRef = useRef<number>(MIDDLE_SET * projects.length);
    const isScrollingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Initial scroll to the middle set of projects
        if (listRef.current) {
            setTimeout(() => {
                if (!listRef.current) return;
                const targetElement = listRef.current.children[targetIndexRef.current] as HTMLElement;
                if (targetElement) {
                    listRef.current.scrollLeft = targetElement.offsetLeft;
                }
            }, 100);
        }
    }, []);

    const handleScroll = () => {
        if (!listRef.current) return;

        const scrollContainer = listRef.current;
        if (isScrollingTimeout.current) clearTimeout(isScrollingTimeout.current);

        // Only trigger the snap loop when the user has stopped scrolling
        isScrollingTimeout.current = setTimeout(() => {
            const scrollLeft = scrollContainer.scrollLeft;
            const children = Array.from(scrollContainer.children) as HTMLElement[];

            // Find the index of the child closest to the current scrollLeft
            let closestIndex = 0;
            let minDiff = Infinity;
            children.forEach((child, index) => {
                const diff = Math.abs(child.offsetLeft - scrollLeft);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestIndex = index;
                }
            });

            // If scrolled near the edges (less than 2 sets remaining), jump back to middle silently
            if (closestIndex < projects.length * 2 || closestIndex > projects.length * (SETS - 2)) {
                scrollContainer.style.scrollSnapType = 'none'; // Disable snap to avoid jitter

                const offsetWithinSet = closestIndex % projects.length;
                const newIndex = (MIDDLE_SET * projects.length) + offsetWithinSet;

                const targetElement = children[newIndex];
                if (targetElement) {
                    scrollContainer.scrollLeft = targetElement.offsetLeft;
                    targetIndexRef.current = newIndex;
                }

                void scrollContainer.offsetWidth; // Force CSS reflow
                scrollContainer.style.scrollSnapType = 'x mandatory';
            } else {
                targetIndexRef.current = closestIndex; // Sync target ref with actual rest position
            }
        }, 150);
    };

    const scrollLeftBtn = () => {
        if (!listRef.current) return;
        targetIndexRef.current -= 1;
        const targetElement = listRef.current.children[targetIndexRef.current] as HTMLElement;
        if (targetElement) {
            listRef.current.scrollTo({ left: targetElement.offsetLeft, behavior: 'smooth' });
        } else {
            targetIndexRef.current += 1; // Fallback bound
        }
    };

    const scrollRightBtn = () => {
        if (!listRef.current) return;
        targetIndexRef.current += 1;
        const targetElement = listRef.current.children[targetIndexRef.current] as HTMLElement;
        if (targetElement) {
            listRef.current.scrollTo({ left: targetElement.offsetLeft, behavior: 'smooth' });
        } else {
            targetIndexRef.current -= 1; // Fallback bound
        }
    };

    return (
        <section style={{ backgroundColor: 'var(--color-bg)', paddingTop: '8rem', paddingBottom: '8rem' }}>
            <div className="container">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    style={{ textAlign: 'center', marginBottom: '5rem' }}
                >
                    <div>
                        <span style={{
                            color: 'var(--color-accent)', letterSpacing: 'var(--ls-wide)',
                            fontSize: '0.7rem', textTransform: 'uppercase', display: 'block', marginBottom: '1.5rem',
                        }}>
                            Dự Án Tiêu Biểu
                        </span>
                        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', margin: 0, lineHeight: 1.15, fontFamily: 'var(--font-display)', fontWeight: 900, textTransform: 'uppercase' }}>
                            DỰ ÁN NỔI BẬT
                        </h2>
                    </div>
                </motion.div>

                {/* Cinematic Film-Strip Gallery */}
                <div
                    ref={listRef}
                    className="projects-slider"
                    onScroll={handleScroll}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        overflowX: 'auto',
                        gap: '2rem',
                        padding: '1rem 0 3rem 0',
                        scrollSnapType: 'x mandatory',
                        scrollbarWidth: 'none', /* Firefox */
                        WebkitOverflowScrolling: 'touch', /* iOS */
                    }}
                >
                    {extendedProjects.map((project, index) => (
                        <motion.div
                            key={`${project.id}-${index}`}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: (index % projects.length) * 0.1 }}
                            className="project-card-v3"
                            style={{
                                flex: '0 0 auto',
                                width: 'min(85vw, 650px)',
                                height: 'min(55vw, 420px)',
                                position: 'relative',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                borderRadius: '4px',
                                scrollSnapAlign: 'start',
                                backgroundColor: '#111',
                            }}
                            onClick={() => setSelectedProject(project)}
                        >
                            <img
                                src={project.image}
                                alt={project.title}
                                className="project-img"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                                }}
                            />

                            {/* Overlay Gradient */}
                            <div className="project-overlay" style={{
                                position: 'absolute',
                                bottom: 0, left: 0, right: 0,
                                height: '70%',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0) 100%)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                padding: '2.5rem',
                                transition: 'all 0.5s ease',
                            }}>
                                <span style={{
                                    fontSize: '0.8rem', color: 'var(--color-neon)',
                                    fontFamily: 'var(--font-sans)', fontWeight: 500, letterSpacing: '0.1em',
                                    marginBottom: '0.75rem',
                                    display: 'block',
                                    textTransform: 'uppercase'
                                }}>
                                    0{(index % projects.length) + 1} // {project.category}
                                </span>
                                <h3 className="project-title" style={{
                                    fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', margin: '0 0 1rem 0',
                                    textTransform: 'none', fontWeight: 600, letterSpacing: '-0.02em',
                                    color: '#fff',
                                    transition: 'color 0.4s ease',
                                }}>
                                    {project.title}
                                </h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
                                        {project.year}
                                    </span>
                                    <div className="project-arrow-v3" style={{
                                        width: '48px', height: '48px', borderRadius: '50%',
                                        backgroundColor: 'var(--color-neon)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                                        transform: 'scale(0.5) rotate(-45deg)',
                                        opacity: 0,
                                    }}>
                                        <ArrowUpRight size={20} style={{ color: '#0F0F0F' }} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Navigation Buttons placed BELOW slider */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}
                >
                    <button onClick={scrollLeftBtn} style={{
                        width: '50px', height: '50px', borderRadius: '50%', border: '1px solid var(--color-border)',
                        background: 'transparent', color: 'var(--color-text)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s'
                    }} className="slider-nav-btn">
                        <ChevronLeft size={24} />
                    </button>
                    <button onClick={scrollRightBtn} style={{
                        width: '50px', height: '50px', borderRadius: '50%', border: '1px solid var(--color-border)',
                        background: 'transparent', color: 'var(--color-text)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s'
                    }} className="slider-nav-btn">
                        <ChevronRight size={24} />
                    </button>
                </motion.div>
            </div>

            {/* Reusable Project Detail Modal */}
            <ProjectDetailModal 
                project={selectedProject} 
                onClose={() => setSelectedProject(null)} 
            />

            <style>{`
                .projects-slider::-webkit-scrollbar {
                    display: none; /* Hide scrollbar for Chrome, Safari and Opera */
                }
                .slider-nav-btn:hover {
                    background-color: var(--color-neon) !important;
                    color: #0F0F0F !important;
                    border-color: var(--color-neon) !important;
                }
                .project-card-v3:hover .project-img {
                    transform: scale(1.05);
                }
                .project-card-v3:hover .project-overlay {
                    padding-bottom: 3.5rem !important; /* Push up content slightly */
                }
                .project-card-v3:hover .project-arrow-v3 {
                    transform: scale(1) rotate(0deg) !important;
                    opacity: 1 !important;
                }
                @media (max-width: 768px) {
                    .projects-slider {
                        padding-left: 1rem;
                        padding-right: 1rem;
                        gap: 1rem !important;
                    }
                    .project-card-v3 {
                        width: 85vw !important;
                        height: 60vw !important;
                    }
                    .project-arrow-v3 {
                        transform: scale(1) rotate(0deg) !important;
                        opacity: 1 !important;
                        background-color: rgba(255,255,255,0.1) !important;
                    }
                    .project-arrow-v3 svg {
                        color: #fff !important;
                    }
                }
                .modal-close-btn:hover {
                    background: var(--color-neon) !important;
                    color: #0F0F0F !important;
                    transform: scale(1.1);
                }
            `}</style>
        </section>
    );
};
