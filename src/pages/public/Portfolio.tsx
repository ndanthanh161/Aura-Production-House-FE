import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = ['All', 'Photography', 'Videography', 'Personal Branding', 'Commercial', 'Social Content'];

const allProjects = [
    { id: 1, title: 'Ethereal Shadows', category: 'Photography', image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1000' },
    { id: 2, title: 'Urban Pulse', category: 'Videography', image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1000' },
    { id: 3, title: 'CEO Portrait Series', category: 'Personal Branding', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000' },
    { id: 4, title: 'Cyberpunk Vision', category: 'Commercial', image: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&q=80&w=1000' },
    { id: 5, title: 'Lifestyle Beats', category: 'Social Content', image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=1000' },
    { id: 6, title: 'The Architect', category: 'Photography', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000' },
];

const Portfolio: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredProjects = activeCategory === 'All'
        ? allProjects
        : allProjects.filter(p => p.category === activeCategory);

    return (
        <div style={{ paddingTop: '100px', backgroundColor: '#000' }}>
            <header className="container" style={{ marginBottom: 'var(--spacing-lg)', textAlign: 'left' }}>
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', margin: 0 }}
                >
                    Portfolio
                </motion.h1>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        display: 'flex',
                        gap: '2.5rem',
                        marginTop: '2rem',
                        overflowX: 'auto',
                        paddingBottom: '1rem'
                    }}
                >
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={{
                                fontSize: '0.75rem',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                color: activeCategory === cat ? 'var(--color-accent)' : 'var(--color-text-muted)',
                                borderBottom: `1px solid ${activeCategory === cat ? 'var(--color-accent)' : 'transparent'}`,
                                paddingBottom: '8px',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>
            </header>

            {/* Cinematic Gutterless Grid */}
            <motion.div
                layout
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)', // 2 columns for dramatic scale
                    gap: '4px', // Minimal gap
                    backgroundColor: '#000'
                }}
            >
                <AnimatePresence mode='popLayout'>
                    {filteredProjects.map((project) => (
                        <motion.div
                            key={project.id}
                            layout
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="portfolio-item-cinematic"
                            style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                        >
                            <div style={{ aspectRatio: '21/9', overflow: 'hidden' }}>
                                <motion.img
                                    src={project.image}
                                    alt={project.title}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <div className="portfolio-overlay-cinematic" style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%)',
                                display: 'flex',
                                alignItems: 'flex-end',
                                padding: '3rem',
                                opacity: 0,
                                transition: 'opacity 0.6s var(--transition-cinematic)'
                            }}>
                                <motion.div>
                                    <span style={{ color: 'var(--color-accent)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.2em' }}>{project.category}</span>
                                    <h3 style={{ fontSize: '2rem', color: '#fff', marginTop: '0.5rem', textTransform: 'none' }}>{project.title}</h3>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            <style>{`
        .portfolio-item-cinematic:hover .portfolio-overlay-cinematic {
          opacity: 1;
        }
        @media (max-width: 1024px) {
           div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </div>
    );
};

export default Portfolio;
