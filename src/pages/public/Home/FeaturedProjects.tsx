import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { ProjectDetailModal } from '../../../components/ProjectDetailModal';
import { portfolioApi, getCategoryLabel } from '../../../services/portfolioApi';
import type { PortfolioItem } from '../../../services/portfolioApi';

export const FeaturedProjects: React.FC = () => {
    const listRef = useRef<HTMLDivElement>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState<any | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await portfolioApi.getPublished();
                const data = res.data || [];
                
                // Lọc các dự án HOT và sắp xếp theo ngày tạo mới nhất
                const hotProjects = data
                    .filter((p: PortfolioItem) => p.isHot)
                    .sort((a: PortfolioItem, b: PortfolioItem) => 
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    )
                    .map((p: PortfolioItem) => ({
                        id: p.id,
                        title: p.title,
                        category: getCategoryLabel(p.category),
                        year: new Date(p.createdAt).getFullYear().toString(),
                        client: p.clientName || 'Aura Client',
                        image: p.thumbnailUrl || (p.mediaItems.find(m => m.mediaType === 'image')?.url) || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1200',
                        description: p.content || '',
                    }));
                setProjects(hotProjects);
            } catch (error) {
                console.error('Failed to fetch featured projects:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    // Duplicating projects to create a robust infinite loop effect
    const SETS = projects.length > 0 ? 11 : 0;
    const MIDDLE_SET = 5;
    const extendedProjects = projects.length > 0 ? Array(SETS).fill(projects).flat() : [];

    const targetIndexRef = useRef<number>(MIDDLE_SET * projects.length);
    const isScrollingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Initial scroll to the middle set of projects
        if (listRef.current && projects.length > 0) {
            setTimeout(() => {
                if (!listRef.current) return;
                const targetElement = listRef.current.children[targetIndexRef.current] as HTMLElement;
                if (targetElement) {
                    listRef.current.scrollLeft = targetElement.offsetLeft;
                }
            }, 500);
        }
    }, [projects.length]);

    const handleScroll = () => {
        if (!listRef.current || projects.length === 0) return;

        const scrollContainer = listRef.current;
        if (isScrollingTimeout.current) clearTimeout(isScrollingTimeout.current);

        isScrollingTimeout.current = setTimeout(() => {
            const scrollLeft = scrollContainer.scrollLeft;
            const children = Array.from(scrollContainer.children) as HTMLElement[];

            let closestIndex = 0;
            let minDiff = Infinity;
            children.forEach((child, index) => {
                const diff = Math.abs(child.offsetLeft - scrollLeft);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestIndex = index;
                }
            });

            if (closestIndex < projects.length * 2 || closestIndex > projects.length * (SETS - 2)) {
                scrollContainer.style.scrollSnapType = 'none';
                const offsetWithinSet = closestIndex % projects.length;
                const newIndex = (MIDDLE_SET * projects.length) + offsetWithinSet;
                const targetElement = children[newIndex];
                if (targetElement) {
                    scrollContainer.scrollLeft = targetElement.offsetLeft;
                    targetIndexRef.current = newIndex;
                }
                void scrollContainer.offsetWidth;
                scrollContainer.style.scrollSnapType = 'x mandatory';
            } else {
                targetIndexRef.current = closestIndex;
            }
        }, 150);
    };

    const scrollLeftBtn = () => {
        if (!listRef.current || projects.length === 0) return;
        targetIndexRef.current -= 1;
        const targetElement = listRef.current.children[targetIndexRef.current] as HTMLElement;
        if (targetElement) {
            listRef.current.scrollTo({ left: targetElement.offsetLeft, behavior: 'smooth' });
        } else {
            targetIndexRef.current += 1;
        }
    };

    const scrollRightBtn = () => {
        if (!listRef.current || projects.length === 0) return;
        targetIndexRef.current += 1;
        const targetElement = listRef.current.children[targetIndexRef.current] as HTMLElement;
        if (targetElement) {
            listRef.current.scrollTo({ left: targetElement.offsetLeft, behavior: 'smooth' });
        } else {
            targetIndexRef.current -= 1;
        }
    };

    if (loading) {
        return (
            <div style={{ backgroundColor: 'var(--color-bg)', padding: '8rem 0', display: 'flex', justifyContent: 'center' }}>
                <Loader2 size={40} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
            </div>
        );
    }

    if (projects.length === 0) return null;

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
                        scrollbarWidth: 'none',
                        WebkitOverflowScrolling: 'touch',
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
                    display: none;
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
                    padding-bottom: 3.5rem !important;
                }
                .project-card-v3:hover .project-arrow-v3 {
                    transform: scale(1) rotate(0deg) !important;
                    opacity: 1 !important;
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
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
            `}</style>
        </section>
    );
};
