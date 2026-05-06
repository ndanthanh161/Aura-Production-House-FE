import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, X, Play, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { portfolioApi, getCategoryLabel, PORTFOLIO_CATEGORIES } from '../../services/portfolioApi';
import type { PortfolioItem, PortfolioMedia } from '../../services/portfolioApi';

const Portfolio: React.FC = () => {
    const [items, setItems] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<number | null>(null); // null = Tất Cả
    const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
    const [lightboxMedia, setLightboxMedia] = useState<{ media: PortfolioMedia[]; index: number } | null>(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await portfolioApi.getPublished();
                setItems(res.data || []);
            } catch {
                console.error('Failed to load portfolio');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const filteredItems = activeCategory === null
        ? items
        : items.filter(p => Number(p.category) === activeCategory || p.category === PORTFOLIO_CATEGORIES.find(c => c.value === activeCategory)?.enumName);

    const categories = [{ value: null as number | null, label: 'Tất Cả' }, ...PORTFOLIO_CATEGORIES.map(c => ({ value: c.value as number | null, label: c.label }))];

    // Lightbox navigation
    const goLightbox = (dir: 1 | -1) => {
        if (!lightboxMedia) return;
        const next = lightboxMedia.index + dir;
        if (next >= 0 && next < lightboxMedia.media.length) {
            setLightboxMedia({ ...lightboxMedia, index: next });
        }
    };

    return (
        <div style={{ paddingTop: '100px', backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
            {/* Header + Filter */}
            <header className="container" style={{ marginBottom: '2rem', textAlign: 'left' }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{ display: 'flex', gap: '2.5rem', marginTop: '2rem', overflowX: 'auto', paddingBottom: '1rem' }}
                >
                    {categories.map((cat) => (
                        <button
                            key={String(cat.value)}
                            onClick={() => setActiveCategory(cat.value)}
                            style={{
                                fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                                color: activeCategory === cat.value ? 'var(--color-accent)' : 'var(--color-text-muted)',
                                borderBottom: `1px solid ${activeCategory === cat.value ? 'var(--color-accent)' : 'transparent'}`,
                                paddingBottom: '8px', whiteSpace: 'nowrap', background: 'none', border: 'none',
                                cursor: 'pointer', transition: 'color 0.3s',
                            }}
                        >
                            {cat.label}
                        </button>
                    ))}
                </motion.div>
            </header>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem' }}>
                    <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-accent)' }} />
                </div>
            ) : filteredItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--color-text-muted)' }}>
                    <ImageIcon size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                    <p>Chưa có dự án nào trong danh mục này.</p>
                </div>
            ) : (
                /* Cinematic Grid */
                <motion.div
                    layout
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', backgroundColor: 'var(--color-bg)' }}
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredItems.map((item) => {
                            const thumbnail = item.thumbnailUrl || item.mediaItems.find(m => m.mediaType === 'image')?.url;
                            return (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8 }}
                                    className="portfolio-item-cinematic"
                                    style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                                    onClick={() => setSelectedItem(item)}
                                >
                                    <div style={{ aspectRatio: '21/9', overflow: 'hidden', backgroundColor: '#111' }}>
                                        {(() => {
                                            const video = item.mediaItems.find(m => m.mediaType === 'video');
                                            if (video) {
                                                return (
                                                    <video
                                                        src={video.url}
                                                        autoPlay
                                                        muted
                                                        loop
                                                        playsInline
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                );
                                            }
                                            const thumbnail = item.thumbnailUrl || item.mediaItems.find(m => m.mediaType === 'image')?.url;
                                            return thumbnail ? (
                                                <motion.img
                                                    src={thumbnail}
                                                    alt={item.title}
                                                    whileHover={{ scale: 1.05 }}
                                                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <ImageIcon size={48} style={{ opacity: 0.1, color: '#fff' }} />
                                                </div>
                                            );
                                        })()}
                                    </div>
                                    <div className="portfolio-overlay-cinematic" style={{
                                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                        background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%)',
                                        display: 'flex', alignItems: 'flex-end', padding: '3rem',
                                        opacity: 0, transition: 'opacity 0.6s ease',
                                    }}>
                                        <div>
                                            <span style={{ color: 'var(--color-accent)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.2em' }}>
                                                {getCategoryLabel(item.category)}
                                            </span>
                                            <h3 style={{ fontSize: '2rem', color: '#fff', marginTop: '0.5rem', textTransform: 'none' }}>
                                                {item.title}
                                            </h3>
                                            {item.clientName && (
                                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                                                    {item.clientName}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {/* Video indicator */}
                                    {item.mediaItems.some(m => m.mediaType === 'video') && (
                                        <div style={{
                                            position: 'absolute', top: '1rem', right: '1rem',
                                            backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff',
                                            padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem',
                                            display: 'flex', alignItems: 'center', gap: '4px',
                                        }}>
                                            <Play size={10} fill="#fff" /> Video
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                            backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 1000,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backdropFilter: 'blur(20px)',
                        }}
                        onClick={() => setSelectedItem(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 40 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                            style={{
                                backgroundColor: '#000', width: 'min(90vw, 1000px)',
                                maxHeight: '95vh', overflowY: 'auto', position: 'relative', scrollbarWidth: 'none',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close */}
                            <button
                                onClick={() => setSelectedItem(null)}
                                style={{
                                    position: 'absolute', top: '1.5rem', right: '1.5rem',
                                    background: 'rgba(255,255,255,0.1)', border: 'none', color: '#FFF',
                                    width: '44px', height: '44px', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', zIndex: 10, transition: 'all 0.3s ease',
                                }}
                                className="modal-close-hover"
                            >
                                <X size={24} />
                            </button>

                            {/* Hero Media */}
                            {(() => {
                                const video = selectedItem.mediaItems.find(m => m.mediaType === 'video');
                                if (video) {
                                    return (
                                        <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#000' }}>
                                            <video 
                                                src={video.url} 
                                                controls 
                                                autoPlay 
                                                style={{ width: '100%', height: '100%' }} 
                                            />
                                        </div>
                                    );
                                }
                                const hero = selectedItem.thumbnailUrl || selectedItem.mediaItems.find(m => m.mediaType === 'image')?.url;
                                return hero ? (
                                    <div style={{ width: '100%', aspectRatio: '16/10', overflow: 'hidden' }}>
                                        <img src={hero} alt={selectedItem.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ) : null;
                            })()}

                            {/* Content */}
                            <div style={{ padding: '4rem 3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <span style={{ color: 'var(--color-accent)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.2em', marginBottom: '1rem' }}>
                                    {getCategoryLabel(selectedItem.category)}
                                </span>
                                <h2 style={{
                                    fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#FFF', fontWeight: 900,
                                    textTransform: 'uppercase', lineHeight: 1.1, fontFamily: 'var(--font-display)',
                                    letterSpacing: '0.05em', marginBottom: '1.5rem', maxWidth: '800px',
                                }}>
                                    {selectedItem.title}
                                </h2>

                                {selectedItem.clientName && (
                                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                                        Khách hàng: <strong style={{ color: 'rgba(255,255,255,0.8)' }}>{selectedItem.clientName}</strong>
                                    </p>
                                )}

                                {selectedItem.content && (
                                    <div style={{ maxWidth: '800px' }}>
                                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: '1.8', fontWeight: 300, letterSpacing: '0.02em', whiteSpace: 'pre-wrap' }}>
                                            {selectedItem.content}
                                        </p>
                                    </div>
                                )}

                                {/* Media Gallery - exclude hero media and thumbnail */}
                                {(() => {
                                    const heroVideo = selectedItem.mediaItems.find(m => m.mediaType === 'video');
                                    const galleryMedia = selectedItem.mediaItems.filter(m => 
                                        m.url !== selectedItem.thumbnailUrl && 
                                        m.id !== heroVideo?.id
                                    );
                                    return galleryMedia.length > 0 ? (
                                        <div style={{ marginTop: '3rem', width: '100%' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                                                {galleryMedia.map((media, idx) => (
                                                    <div
                                                        key={media.id}
                                                        style={{ aspectRatio: '16/10', overflow: 'hidden', borderRadius: '8px', cursor: 'pointer', position: 'relative', border: '1px solid rgba(255,255,255,0.05)' }}
                                                        onClick={() => setLightboxMedia({ media: galleryMedia, index: idx })}
                                                    >
                                                        {media.mediaType === 'video' ? (
                                                            <>
                                                                <video src={media.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                                                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
                                                                    <Play size={24} fill="#fff" style={{ opacity: 0.8 }} />
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <img 
                                                                src={media.url} 
                                                                alt="" 
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} 
                                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null;
                                })()}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxMedia && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.97)', zIndex: 2000,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                        onClick={() => setLightboxMedia(null)}
                    >
                        <button onClick={() => setLightboxMedia(null)} style={{
                            position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.1)',
                            border: 'none', color: '#fff', width: '44px', height: '44px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10,
                        }}><X size={24} /></button>

                        {lightboxMedia.index > 0 && (
                            <button onClick={(e) => { e.stopPropagation(); goLightbox(-1); }} style={navBtnStyle}>
                                <ChevronLeft size={28} />
                            </button>
                        )}

                        <div onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '90vh' }}>
                            {lightboxMedia.media[lightboxMedia.index].mediaType === 'video' ? (
                                <video
                                    src={lightboxMedia.media[lightboxMedia.index].url}
                                    controls autoPlay
                                    style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: '4px' }}
                                />
                            ) : (
                                <img
                                    src={lightboxMedia.media[lightboxMedia.index].url}
                                    alt=""
                                    style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '4px' }}
                                />
                            )}
                        </div>

                        {lightboxMedia.index < lightboxMedia.media.length - 1 && (
                            <button onClick={(e) => { e.stopPropagation(); goLightbox(1); }} style={{ ...navBtnStyle, left: 'auto', right: '1.5rem' }}>
                                <ChevronRight size={28} />
                            </button>
                        )}

                        <span style={{ position: 'absolute', bottom: '1.5rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                            {lightboxMedia.index + 1} / {lightboxMedia.media.length}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .portfolio-item-cinematic:hover .portfolio-overlay-cinematic { opacity: 1; }
                .modal-close-hover:hover { background: #FFF !important; color: #000 !important; transform: scale(1.1); }
                @media (max-width: 1024px) { div[style*="gridTemplateColumns: repeat(2"] { grid-template-columns: 1fr !important; } }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                ::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
};

const navBtnStyle: React.CSSProperties = {
    position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)',
    background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
    width: '48px', height: '48px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
};

export default Portfolio;
