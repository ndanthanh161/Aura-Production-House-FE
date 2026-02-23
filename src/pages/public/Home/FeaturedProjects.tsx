import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const projects = [
    {
        id: 1,
        title: 'Modern Minimalist',
        category: 'Photography',
        year: '2024',
        image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1200',
    },
    {
        id: 2,
        title: "The Director's Cut",
        category: 'Videography',
        year: '2024',
        image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200',
    },
    {
        id: 3,
        title: 'Brand Identity 2024',
        category: 'Personal Branding',
        year: '2023',
        image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1200',
    },
    {
        id: 4,
        title: 'Lumière Collection',
        category: 'Editorial',
        year: '2023',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=1200',
    },
];

export const FeaturedProjects: React.FC = () => {
    return (
        <section style={{ backgroundColor: '#000', paddingTop: '8rem', paddingBottom: '8rem' }}>
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
                            Selected Work
                        </span>
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', margin: 0, lineHeight: 1 }}>
                            Featured <br />
                            <span style={{
                                fontFamily: 'var(--font-serif)', fontWeight: 200, fontStyle: 'italic',
                                textTransform: 'none',
                            }}>
                                Projects
                            </span>
                        </h2>
                    </div>
                    <button style={{
                        color: 'var(--color-accent)', fontSize: '0.75rem', letterSpacing: '0.2em',
                        textTransform: 'uppercase', borderBottom: '1px solid var(--color-accent)',
                        paddingBottom: '6px', background: 'none', border: 'none', cursor: 'pointer',
                        borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: 'var(--color-accent)',
                    }}>
                        View All Work
                    </button>
                </motion.div>

                {/* Projects List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="project-row"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 2fr 1fr 1fr auto',
                                alignItems: 'center',
                                gap: '2rem',
                                padding: '2.5rem 2rem',
                                backgroundColor: '#000',
                                cursor: 'pointer',
                                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Number */}
                            <span style={{
                                fontSize: '0.8rem', color: 'var(--color-accent)',
                                fontFamily: 'var(--font-sans)', fontWeight: 300, letterSpacing: '0.1em',
                            }}>
                                0{index + 1}
                            </span>

                            {/* Title */}
                            <h3 style={{
                                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', margin: 0,
                                textTransform: 'none', fontWeight: 600, letterSpacing: '-0.02em',
                                transition: 'color 0.5s ease',
                            }} className="project-title">
                                {project.title}
                            </h3>

                            {/* Category */}
                            <span style={{
                                fontSize: '0.75rem', color: 'var(--color-text-muted)',
                                textTransform: 'uppercase', letterSpacing: '0.15em',
                            }}>
                                {project.category}
                            </span>

                            {/* Year */}
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                {project.year}
                            </span>

                            {/* Arrow */}
                            <div className="project-arrow" style={{
                                width: '48px', height: '48px', borderRadius: '50%',
                                border: '1px solid rgba(255,255,255,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.5s ease',
                            }}>
                                <ArrowUpRight size={18} style={{ color: '#fff' }} />
                            </div>

                            {/* Hover Image Preview */}
                            <div className="project-preview" style={{
                                position: 'absolute', right: '200px', top: '50%', transform: 'translateY(-50%)',
                                width: '300px', height: '200px', overflow: 'hidden',
                                opacity: 0, pointerEvents: 'none',
                                transition: 'opacity 0.5s ease',
                                zIndex: 10,
                            }}>
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <style>{`
                .project-row:hover {
                    background-color: #0a0a0a !important;
                }
                .project-row:hover .project-title {
                    color: var(--color-accent) !important;
                }
                .project-row:hover .project-arrow {
                    background-color: var(--color-accent) !important;
                    border-color: var(--color-accent) !important;
                    transform: rotate(45deg);
                }
                .project-row:hover .project-preview {
                    opacity: 1 !important;
                }
                @media (max-width: 768px) {
                    .project-row {
                        grid-template-columns: auto 1fr auto !important;
                    }
                    .project-row span:nth-child(3),
                    .project-row span:nth-child(4),
                    .project-preview {
                        display: none !important;
                    }
                }
            `}</style>
        </section>
    );
};
