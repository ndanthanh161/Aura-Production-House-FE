import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProjectDetailModal } from '../../../components/ProjectDetailModal';
import { portfolioApi, getCategoryLabel } from '../../../services/portfolioApi';
import type { PortfolioItem } from '../../../services/portfolioApi';

export const FeaturedProjects: React.FC = () => {
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

    if (loading) {
        return (
            <div style={{ backgroundColor: 'var(--color-bg)', padding: '8rem 0', display: 'flex', justifyContent: 'center' }}>
                <Loader2 size={40} className="animate-spin" style={{ color: 'var(--color-text)' }} />
            </div>
        );
    }

    if (projects.length === 0) return null;

    return (
        <section style={{ backgroundColor: 'var(--color-bg)', padding: '8rem 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="container">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    style={{ textAlign: 'center', marginBottom: '6rem' }}
                >
                    <span style={{
                        color: 'rgba(255,255,255,0.4)',
                        letterSpacing: '0.2rem',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '1rem',
                        fontWeight: 800,
                    }}>
                        Dự án TIÊU BIỂU
                    </span>
                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        margin: 0,
                        lineHeight: 1.15,
                        fontFamily: 'var(--font-display)',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        color: 'var(--color-text)'
                    }}>
                        TÁC PHẨM NỔI BẬT
                    </h2>
                </motion.div>

                {/* Editorial Minimal Grid of Cards */}
                <div className="featured-projects-editorial-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 480px), 1fr))',
                    gap: '4rem 3rem',
                    marginBottom: '6rem',
                }}>
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: (index % 3) * 0.15 }}
                            className="project-card-editorial"
                            style={{
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.5rem',
                                borderBottom: '1px solid rgba(255,255,255,0.08)',
                                paddingBottom: '2.5rem',
                            }}
                            onClick={() => setSelectedProject(project)}
                        >
                            {/* Card Image Wrapper with 16:10 Ratio */}
                            <div style={{
                                width: '100%',
                                aspectRatio: '16/10',
                                position: 'relative',
                                overflow: 'hidden',
                                backgroundColor: '#1A1A1A',
                                border: '1px solid rgba(255,255,255,0.08)'
                            }} className="editorial-img-container">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                                    }}
                                    className="editorial-project-img"
                                />
                                {/* Tiny Hover Overlay */}
                                <div style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: '#FFFFFF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: 0,
                                    transform: 'scale(0.8) translate(5px, -5px)',
                                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                }} className="editorial-arrow-icon">
                                    <ArrowUpRight size={18} style={{ color: '#000000' }} />
                                </div>
                            </div>

                            {/* Card Meta Content */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{
                                        fontSize: '0.7rem',
                                        color: 'rgba(255,255,255,0.5)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        fontWeight: 700
                                    }}>
                                        {project.category} &bull; {project.year}
                                    </span>
                                    <span style={{
                                        fontSize: '0.7rem',
                                        color: 'rgba(255,255,255,0.4)',
                                        textTransform: 'uppercase',
                                        fontWeight: 500
                                    }}>
                                        KH: {project.client}
                                    </span>
                                </div>

                                <h3 style={{
                                    fontSize: 'clamp(1.3rem, 2vw, 1.8rem)',
                                    fontFamily: 'var(--font-display)',
                                    fontWeight: 800,
                                    margin: 0,
                                    textTransform: 'uppercase',
                                    color: 'var(--color-text)',
                                    lineHeight: 1.25,
                                    transition: 'color 0.3s ease'
                                }} className="editorial-project-title">
                                    {project.title}
                                </h3>

                                <p style={{
                                    fontSize: '0.9rem',
                                    color: 'rgba(255,255,255,0.7)',
                                    lineHeight: 1.6,
                                    margin: '0.5rem 0 0 0',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}>
                                    {project.description.replace(/<[^>]*>/g, '') || 'Nhấp để xem chi tiết các hình ảnh dự án và tìm hiểu về các concept thiết kế sáng tạo của Aura.'}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom View All CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center' }}
                >
                    <Link to="/portfolio" style={{
                        border: '1px solid var(--color-text)',
                        backgroundColor: 'transparent',
                        color: 'var(--color-text)',
                        padding: '1.1rem 3.5rem',
                        fontSize: '0.8rem',
                        letterSpacing: '0.2rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        transition: 'all 0.3s ease',
                    }} className="view-all-projects-btn">
                        Xem tất cả dự án <ArrowRight size={16} />
                    </Link>
                </motion.div>
            </div>

            {/* Reusable Project Detail Modal */}
            <ProjectDetailModal 
                project={selectedProject} 
                onClose={() => setSelectedProject(null)} 
            />

            <style>{`
                .project-card-editorial:hover .editorial-project-img {
                    transform: scale(1.04);
                }
                .project-card-editorial:hover .editorial-arrow-icon {
                    opacity: 1 !important;
                    transform: scale(1) translate(0) !important;
                }
                .project-card-editorial:hover .editorial-project-title {
                    color: rgba(255,255,255,0.6) !important;
                }
                .view-all-projects-btn:hover {
                    background-color: var(--color-text) !important;
                    color: var(--color-bg) !important;
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </section>
    );
};
