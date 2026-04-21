import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectDetailModal } from '../../components/ProjectDetailModal';

const categories = ['Tất Cả', 'Nhiếp Ảnh', 'Quay Phim', 'Thương Hiệu Cá Nhân', 'Thương Mại', 'Nội Dung Mạng Xã Hội'];

const allProjects = [
    {
        id: 1,
        title: 'Bóng Tối Thanh Thoát',
        category: 'Nhiếp Ảnh',
        image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1000',
        year: '2024',
        client: 'Tạp Chí Vogue',
        description: 'Một bộ sưu tập nhiếp ảnh chân dung khám phá sự tương tác giữa ánh sáng rực rỡ và bóng tối sâu thẳm, tôn vinh nét đẹp thanh tao và bí ẩn.',
        credits: [
            { role: 'Director', name: 'Hoàng Anh' },
            { role: 'DOP', name: 'Minh Trần' },
            { role: 'Editor', name: 'Thanh Sơn' },
            { role: 'Stylist', name: 'Lê Vy' }
        ]
    },
    {
        id: 2,
        title: 'Nhịp Đô Thị',
        category: 'Quay Phim',
        image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1000',
        year: '2023',
        client: 'Metropolitan Life',
        description: 'Phim ngắn ghi lại nhịp sống hối hả của thành phố về đêm thông qua những góc quay nghệ thuật và kỹ thuật chỉnh màu điện ảnh.',
        credits: [
            { role: 'Director', name: 'Tuấn Nguyễn' },
            { role: 'DOP', name: 'Huy Phạm' },
            { role: 'Music', name: 'Đức Phúc' },
            { role: 'Colorist', name: 'Nam Lê' }
        ]
    },
    {
        id: 3,
        title: 'Loạt Chân Dung CEO',
        category: 'Thương Hiệu Cá Nhân',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000',
        year: '2024',
        client: 'Forbes Việt Nam',
        description: 'Xây dựng hình ảnh chuyên nghiệp và quyền lực cho các nhà lãnh đạo thông qua những khung hình chân dung được chiếu sáng tỉ mỉ.',
        credits: [
            { role: 'Director', name: 'Lan Hương' },
            { role: 'Lighting', name: 'Quốc Bảo' },
            { role: 'MUA', name: 'Kim Chi' },
            { role: 'Agency', name: 'Aura House' }
        ]
    },
    {
        id: 4,
        title: 'Tầm Nhìn Cyberpunk',
        category: 'Thương Mại',
        image: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&q=80&w=1000',
        year: '2023',
        client: 'Sony Electronics',
        description: 'Chiến dịch quảng cáo mang phong cách tương lai, sử dụng ánh sáng neon và kỹ xảo hình ảnh để làm nổi bật tính đột phá của sản phẩm.',
        credits: [
            { role: 'Director', name: 'Việt Anh' },
            { role: 'VFX', name: 'Quang Huy' },
            { role: 'DOP', name: 'Hải Đăng' },
            { role: 'Concept', name: 'Neo Seoul' }
        ]
    },
    {
        id: 5,
        title: 'Phong Cách Sống',
        category: 'Nội Dung Mạng Xã Hội',
        image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=1000',
        year: '2024',
        client: 'Oatberry India',
        description: 'Content video và hình ảnh tập trung vào trải nghiệm người dùng, kết nối thương hiệu với phong cách sống năng động của Gen Z.',
        credits: [
            { role: 'Director', name: 'Bảo Thy' },
            { role: 'Talent', name: 'Gen Z Crew' },
            { role: 'Editor', name: 'Ngọc Mai' },
            { role: 'Camera', name: 'Sony A7SIII' }
        ]
    },
    {
        id: 6,
        title: 'Kiến Trúc Sư',
        category: 'Nhiếp Ảnh',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000',
        year: '2023',
        client: 'Architectural Digest',
        description: 'Ghi lại vẻ đẹp của các công trình kiến trúc hiện đại qua những góc nhìn hình học và sự đối lập của vật liệu xây dựng.',
        credits: [
            { role: 'Director', name: 'Nhật Minh' },
            { role: 'DOP', name: 'Thế Vinh' },
            { role: 'Drone', name: 'Flycam VN' },
            { role: 'Architect', name: 'AD Group' }
        ]
    },
];

const Portfolio: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('Tất Cả');
    const [selectedProject, setSelectedProject] = useState<typeof allProjects[0] | null>(null);

    const filteredProjects = activeCategory === 'Tất Cả'
        ? allProjects
        : allProjects.filter(p => p.category === activeCategory);

    return (
        <div style={{ paddingTop: '100px', backgroundColor: 'var(--color-bg)' }}>
            <header className="container" style={{ marginBottom: 'var(--spacing-lg)', textAlign: 'left' }}>
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
                    backgroundColor: 'var(--color-bg)'
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
                            onClick={() => setSelectedProject(project)}
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

            {/* Reusable Project Detail Modal */}
            <ProjectDetailModal
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
            />

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
