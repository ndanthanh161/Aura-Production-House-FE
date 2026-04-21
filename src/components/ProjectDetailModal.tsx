import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface Credit {
    role: string;
    name: string;
}

interface Project {
    id: number | string;
    title: string;
    category: string;
    image: string;
    description?: string;
    year?: string;
    client?: string;
    credits?: Credit[];
}

interface ProjectDetailModalProps {
    project: Project | null;
    onClose: () => void;
}

const defaultCredits: Credit[] = [
    { role: 'Director', name: 'Hoàng Anh' },
    { role: 'DOP', name: 'Minh Trần' },
    { role: 'Editor', name: 'Thanh Sơn' },
    { role: 'Stylist', name: 'Lê Vy' }
];

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
    const credits = project?.credits || defaultCredits;

    return (
        <AnimatePresence>
            {project && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(20px)',
                    }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 40 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                        style={{
                            backgroundColor: '#000',
                            width: 'min(90vw, 1000px)',
                            maxHeight: '95vh',
                            overflowY: 'auto',
                            borderRadius: '0',
                            position: 'relative',
                            scrollbarWidth: 'none',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            style={{
                                position: 'absolute',
                                top: '1.5rem',
                                right: '1.5rem',
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                color: '#FFF',
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                zIndex: 10,
                                transition: 'all 0.3s ease',
                            }}
                            className="modal-close-hover"
                        >
                            <X size={24} />
                        </button>

                        {/* Image Section - Full Width Top */}
                        <div style={{ width: '100%', aspectRatio: '16/10', overflow: 'hidden' }}>
                            <img
                                src={project.image}
                                alt={project.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        </div>

                        {/* Content Section - Centered */}
                        <div style={{ padding: '5rem 3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <h2 style={{ 
                                fontSize: 'clamp(2rem, 4vw, 3.5rem)', 
                                color: '#FFF', 
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                lineHeight: 1.1,
                                fontFamily: 'var(--font-display)',
                                letterSpacing: '0.05em',
                                marginBottom: '2.5rem',
                                maxWidth: '800px'
                            }}>
                                {project.title}
                            </h2>

                            <div style={{ maxWidth: '800px' }}>
                                <p style={{ 
                                    color: 'rgba(255,255,255,0.7)', 
                                    fontSize: '1rem', 
                                    lineHeight: '1.8',
                                    marginBottom: '1.5rem',
                                    fontWeight: 300,
                                    letterSpacing: '0.02em',
                                }}>
                                    {project.description || 'Dự án này ghi lại những khoảnh khắc đời thường giản dị nhưng đầy cảm xúc của con người trong nhịp sống hiện đại.'}
                                </p>
                                <p style={{ 
                                    color: 'rgba(255,255,255,0.7)', 
                                    fontSize: '1rem', 
                                    lineHeight: '1.8',
                                    fontWeight: 300,
                                    letterSpacing: '0.02em',
                                }}>
                                    Bộ ảnh được thực hiện trong suốt 6 tháng tại nhiều địa điểm khác nhau, từ thành thị nhộn nhịp đến những vùng quê yên bình. Mỗi bức ảnh không chỉ là một khung hình, mà còn là một câu chuyện nơi cảm xúc, ánh sáng và con người hòa quyện với nhau một cách tự nhiên nhất.
                                </p>
                            </div>

                            {/* Credits Section */}
                            <div style={{ 
                                marginTop: '5rem',
                                borderTop: '1px solid rgba(255,255,255,0.1)',
                                paddingTop: '3rem',
                                width: '100%',
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                gap: '3rem',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    CREDIT
                                </div>
                                
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
                                    {credits.map((item, idx) => (
                                        <div key={idx} style={{ textAlign: 'left' }}>
                                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>
                                                {item.role}:
                                            </span>
                                            <span style={{ color: '#FFF', fontSize: '0.85rem', fontWeight: 500 }}>
                                                {item.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
            <style>{`
                .modal-close-hover:hover {
                    background: #FFF !important;
                    color: #000 !important;
                    transform: scale(1.1);
                }
                ::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </AnimatePresence>
    );
};
