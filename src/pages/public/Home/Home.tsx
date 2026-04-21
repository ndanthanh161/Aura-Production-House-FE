import React from 'react';
import { Camera, Video, PenTool, Monitor, ArrowRight } from 'lucide-react';
import { Hero } from './Hero';
import { FeaturedProjects } from './FeaturedProjects';
import { StudioStats } from './StudioStats';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';

const Home: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Hero />

            {/* Brand Marquee Ticker */}
            <div style={{
                overflow: 'hidden', backgroundColor: 'var(--color-neon)',
                padding: '2.5rem 0',
            }}>
                <motion.div
                    animate={{ x: [0, -1600] }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    style={{ display: 'flex', gap: '4rem', whiteSpace: 'nowrap', width: 'fit-content' }}
                >
                    {[...Array(3)].map((_, setIndex) => (
                        <div key={setIndex} style={{ display: 'flex', gap: '4rem', alignItems: 'center' }}>
                            {['NHIẾP ẢNH', 'QUAY PHIM', 'THƯƠNG HIỆU', 'ĐẠO DIỄN SÁNG TẠO', 'SẢN XUẤT NỘI DUNG', 'HẬU KỲ', 'LÀM PHIM', 'ĐẠO DIỄN NGHỆ THUẬT'].map((text, i) => (
                                <span key={i} style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '2.5rem', color: '#0F0F0F', /* Hardcoded to always be black */
                                    textTransform: 'uppercase', fontWeight: 900,
                                    display: 'flex', alignItems: 'center', gap: '4rem',
                                }}>
                                    {text}
                                    <span style={{ width: '8px', height: '8px', borderRadius: '0', backgroundColor: 'var(--color-text)', display: 'inline-block' }} />
                                </span>
                            ))}
                        </div>
                    ))}
                </motion.div>
            </div>
            <FeaturedProjects />
            {/* Cinematic Quote / Vision Statement */}
            <section style={{
                backgroundColor: 'var(--color-bg)', padding: '10rem 0',
                position: 'relative', overflow: 'hidden', color: '#F8FFFF'
            }}>
                {/* Decorative: Film Grain Overlay */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1,
                    opacity: 0.04, pointerEvents: 'none',
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
                }} />

                {/* Floating Visual Element (Director's Viewfinder / Clapperboard abstract) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
                    style={{
                        position: 'relative',
                        width: 'min(90vw, 600px)',
                        height: 'min(50vw, 350px)',
                        margin: '0 auto 6rem auto',
                        zIndex: 2,
                        borderRadius: '2px',
                        overflow: 'hidden',
                        boxShadow: '0 30px 60px -15px rgba(0,0,0,0.8)',
                    }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&q=80&w=1200"
                        alt="Cinematic Behind the Scenes"
                        style={{
                            width: '100%', height: '100%', objectFit: 'cover',
                            filter: 'grayscale(30%) contrast(1.2)',
                        }}
                    />

                    {/* Viewfinder Overlay Frame */}
                    <div style={{
                        position: 'absolute', top: '10%', left: '5%', right: '5%', bottom: '10%',
                        border: '2px solid rgba(255,255,255,0.3)', pointerEvents: 'none',
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
                            <span style={{ color: 'var(--color-neon)', fontFamily: 'monospace', fontSize: '12px' }}>REC</span>
                            <span style={{ color: '#fff', fontFamily: 'monospace', fontSize: '12px' }}>00:00:24:12</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <div style={{ width: '40px', height: '40px', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <div style={{ width: '2px', height: '20px', backgroundColor: 'rgba(255,255,255,0.5)' }}></div>
                                <div style={{ width: '20px', height: '2px', backgroundColor: 'rgba(255,255,255,0.5)', position: 'absolute' }}></div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
                            <span style={{ color: '#fff', fontFamily: 'monospace', fontSize: '12px' }}>ISO 800</span>
                            <span style={{ color: '#fff', fontFamily: 'monospace', fontSize: '12px' }}>5600K</span>
                        </div>
                    </div>
                </motion.div>

                <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2 }}
                    >
                        <h2 className="text-gradient" style={{
                            fontSize: 'clamp(2rem, 4vw, 3.5rem)', maxWidth: '900px', margin: '0 auto',
                            fontWeight: 700, fontFamily: 'var(--font-display)', textTransform: 'uppercase',
                            lineHeight: 1.4, padding: '0.2em 0', display: 'block'
                        }}>
                            "MỖI KHUNG HÌNH CHÚNG TÔI TẠO RA TRỞ THÀNH MỘT PHẦN CỦA DI SẢN THỊ GIÁC VƯỢT THỜI GIAN."
                        </h2>
                    </motion.div>
                </div>
            </section>

            {/* Services Section - Home Page Redesign */}
            <section style={{ backgroundColor: '#FFFFFF', padding: '10rem 0' }}>
                <div className="container">
                    <header style={{ textAlign: 'center', marginBottom: '6rem' }}>
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            style={{
                                color: '#071FD9',
                                textTransform: 'uppercase',
                                letterSpacing: '0.2rem',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                display: 'block',
                                marginBottom: '1rem'
                            }}
                        >
                            AURA CÓ THỂ LÀM GÌ?
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            style={{
                                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                                color: '#0F0F0F',
                                fontFamily: 'var(--font-display)',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                marginBottom: '1.5rem'
                            }}
                        >
                            DỊCH VỤ
                        </motion.h2>
                        <p style={{ color: '#444444', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                            Hãy cùng chúng tôi biến ý tưởng của bạn trở thành hiện thực
                        </p>
                    </header>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '6rem' }}>
                        {[
                            {
                                icon: <Camera size={40} />,
                                title: 'Nhiếp Ảnh',
                                desc: 'Aura giúp bạn ghi lại hình ảnh chuyên nghiệp, nâng tầm thương hiệu cá nhân.',
                                features: ['Thương Hiệu Cá Nhân', 'Thời Trang Biên Tập', 'Sản Phẩm Thương Mại', 'Hồ Sơ Kiến Trúc'],
                                image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1000'
                            },
                            {
                                icon: <Video size={40} />,
                                title: 'Quay Phim',
                                desc: 'Aura giúp bạn sản xuất video sáng tạo, giúp bạn nổi bật trên nền tảng số.',
                                features: ['Phim Thương Hiệu', 'Phong Cách Tài Liệu', 'Quảng Cáo Thương Mại', 'Điểm Nhấn Sự Kiện'],
                                image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1000'
                            },
                            {
                                icon: <PenTool size={40} />,
                                title: 'Hậu Kì',
                                desc: 'Aura đảm bảo mỗi sản phẩm được chỉnh sửa chỉn chu. Từ màu sắc đến âm thanh.',
                                features: ['Hậu Kì Hình Ảnh', 'Hậu Kì Video', 'Thiết Kế Poster', 'Định Hướng Phong Cách'],
                                image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1000'
                            },
                            {
                                icon: <Monitor size={40} />,
                                title: 'Nội Dung Mạng Xã Hội',
                                desc: 'Aura hỗ trợ xây dựng nội dung thu hút, định hình phong cách cá nhân.',
                                features: ['Reels Mạng Xã Hội', 'Chiến Lược YouTube', 'Tài Sản Số', 'Đồ Họa Chuyợn Động'],
                                image: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&q=80&w=1000'
                            }
                        ].map((service, index) => (
                            <motion.div
                                key={index}
                                className="svc-home-card"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.15 }}
                                style={{
                                    position: 'relative',
                                    padding: '3.5rem 2rem',
                                    backgroundColor: '#FFFFFF',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    minHeight: '480px',
                                    overflow: 'hidden',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                } as React.CSSProperties}
                            >
                                {/* Hover Background Image Reveal */}
                                <div className="svc-home-bg" style={{
                                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                    backgroundImage: `url(${service.image})`, backgroundSize: 'cover', backgroundPosition: 'center',
                                    opacity: 0, transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)', zIndex: 0, transform: 'scale(1.05)',
                                    filter: 'grayscale(100%) brightness(0.7)'
                                }} />

                                {/* Theme Glow Overlay */}
                                <div className="svc-home-glow" style={{
                                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                                    opacity: 0, transition: 'opacity 0.6s ease', zIndex: 1
                                }} />

                                {/* Content */}
                                <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <div className="svc-home-icon" style={{
                                        color: '#071FD9', marginBottom: 'auto', transition: 'all 0.4s ease',
                                        padding: '0.5rem', width: 'fit-content',
                                    }}>
                                        {service.icon}
                                    </div>
                                    <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <h3 className="svc-home-title" style={{
                                            fontSize: '1.6rem', color: '#0F0F0F', textTransform: 'uppercase',
                                            fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: '1.2rem',
                                            transition: 'color 0.4s ease'
                                        }}>
                                            {service.title}
                                        </h3>
                                        <p className="svc-home-desc" style={{
                                            color: '#444444', fontSize: '0.9rem', lineHeight: 1.6,
                                            marginBottom: '2.5rem', transition: 'color 0.4s ease'
                                        }}>
                                            {service.desc}
                                        </p>
                                        <ul style={{
                                            listStyle: 'none', display: 'flex', flexDirection: 'column',
                                            gap: '0.9rem', borderTop: '1px solid rgba(0,0,0,0.05)',
                                            paddingTop: '1.8rem', transition: 'border-color 0.4s ease', marginTop: 'auto'
                                        }} className="svc-home-list-border">
                                            {service.features.map(f => (
                                                <li key={f} className="svc-home-feature" style={{
                                                    display: 'flex', alignItems: 'center', gap: '12px',
                                                    fontSize: '0.7rem', color: '#666666', textTransform: 'uppercase',
                                                    letterSpacing: '0.1em', transition: 'color 0.4s ease'
                                                }}>
                                                    <div className="svc-home-bullet" style={{
                                                        width: '4px', height: '4px', backgroundColor: '#071FD9',
                                                        flexShrink: 0, transition: 'background-color 0.4s ease'
                                                    }} /> {f}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <style>{`
                        .svc-home-card:hover .svc-home-bg {
                            opacity: 1 !important;
                            transform: scale(1) translateZ(0) !important;
                            filter: grayscale(20%) brightness(0.6) !important;
                        }
                        .svc-home-card:hover .svc-home-glow {
                            opacity: 0.8 !important;
                        }
                        .svc-home-card:hover .svc-home-icon {
                            color: #ADFF00 !important;
                            transform: translateY(-5px);
                        }
                        .svc-home-card:hover .svc-home-title,
                        .svc-home-card:hover .svc-home-desc,
                        .svc-home-card:hover .svc-home-feature {
                            color: #FFFFFF !important;
                        }
                        .svc-home-card:hover .svc-home-bullet {
                            background-color: #ADFF00 !important;
                            box-shadow: 0 0 10px #ADFF00;
                        }
                        .svc-home-card:hover .svc-home-list-border {
                            border-color: rgba(255,255,255,0.2) !important;
                        }
                    `}</style>

                    <div style={{ textAlign: 'center' }}>
                        <Link to="/services" style={{
                            color: '#071FD9',
                            textTransform: 'uppercase',
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            letterSpacing: '0.2rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            borderBottom: '1px solid #071FD9',
                            paddingBottom: '0.2rem'
                        }}>
                            TÌM HIỂU THÊM DỊCH VỤ <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>



            <StudioStats />

            {/* Clients / Trust Bar */}
            {/* <section style={{
                backgroundColor: 'var(--color-bg-secondary)', padding: '6rem 0',
                borderTop: '1px solid var(--color-border)', position: 'relative', overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '150px', height: '100%',
                    background: 'linear-gradient(90deg, var(--color-bg-secondary) 0%, transparent 100%)', zIndex: 2, pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute', top: 0, right: 0, width: '150px', height: '100%',
                    background: 'linear-gradient(-90deg, var(--color-bg-secondary) 0%, transparent 100%)', zIndex: 2, pointerEvents: 'none'
                }} />

                <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <span style={{
                            color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600,
                            textTransform: 'uppercase', letterSpacing: '0.25em', display: 'block', marginBottom: '3rem'
                        }}>
                            Được tin tưởng bởi các nhà lãnh đạo ngành
                        </span>

                        <div style={{ overflow: 'hidden' }}>
                            <motion.div style={{
                                display: 'flex', gap: '5rem', width: 'fit-content'
                            }}
                                animate={{ x: [0, -1000] }}
                                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                            >
                                {[...Array(3)].map((_, setIndex) => (
                                    <div key={setIndex} style={{ display: 'flex', gap: '5rem' }}>
                                        {['NIKE', 'ADIDAS', 'NETFLIX', 'SONY', 'APPLE', 'VOGUE', 'BMW'].map((brand) => (
                                            <span
                                                key={`${setIndex}-${brand}`}
                                                className="trust-brand"
                                                style={{
                                                    fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.2em',
                                                    color: 'var(--color-text)', opacity: 0.2, transition: 'all 0.3s', cursor: 'pointer'
                                                }}
                                            >
                                                {brand}
                                            </span>
                                        ))}
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
                <style>{`
                    .trust-brand:hover {
                        color: var(--color-text) !important;
                        text-shadow: 0 0 15px rgba(255,255,255,0.4);
                        transform: scale(1.05);
                    }
                `}</style>
            </section> */}

            {/* CTA Section - Home Page Redesign */}
            <section style={{
                backgroundColor: '#ADFF00',
                padding: '10rem 0',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <span style={{
                            color: '#071FD9',
                            letterSpacing: '0.2em',
                            fontSize: '0.8rem',
                            textTransform: 'uppercase',
                            fontWeight: 800,
                            display: 'block',
                            marginBottom: '2rem',
                        }}>
                            BẮT ĐẦU DỰ ÁN
                        </span>
                        <h2 style={{
                            fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
                            lineHeight: 1.1,
                            margin: '0 0 2rem',
                            color: '#0F0F0F',
                            textTransform: 'uppercase',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 900
                        }}>
                            SẴN SÀNG TẠO RA <br />
                            ĐIỀU KHÁC BIỆT?
                        </h2>
                        <p style={{
                            color: '#0F0F0F',
                            maxWidth: '600px',
                            margin: '0 auto 3.5rem',
                            fontSize: '1.2rem',
                            lineHeight: 1.6,
                            fontWeight: 500
                        }}>
                            Hãy cùng biến ý tưởng của bạn trở thành dấu ấn hình ảnh
                        </p>
                        <Link to="/contact">
                            <Button size="lg" style={{
                                padding: '1.4rem 4rem',
                                borderRadius: 0,
                                backgroundColor: '#071FD9',
                                color: '#FFFFFF',
                                fontSize: '0.9rem',
                                letterSpacing: '0.1em',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                border: 'none'
                            }}>
                                LIÊN HỆ NGAY
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </motion.div>
    );
};

export default Home;
