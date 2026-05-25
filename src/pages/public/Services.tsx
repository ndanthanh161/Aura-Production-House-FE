import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Video, PenTool, Monitor, ArrowRight, Lightbulb, Clapperboard, Film, Scissors } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';

const services = [
    {
        icon: <Camera size={40} />,
        title: 'Nhiếp Ảnh',
        desc: 'Aura giúp bạn ghi lại hình ảnh chuyên nghiệp, nâng tầm thương hiệu cá nhân với phong cách tối giản đầy chiều sâu.',
        features: ['Thương Hiệu Cá Nhân', 'Thời Trang Editorial', 'Sản Phẩm Thương Mại', 'Kiến Trúc & Nội Thất'],
        image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1000',
        colorTheme: '#C09A5A'
    },
    {
        icon: <Video size={40} />,
        title: 'Quay Phim',
        desc: 'Sản xuất các thước phim thương hiệu đỉnh cao, kết hợp nghệ thuật kể chuyện cinematic và góc quay sắc sảo.',
        features: ['Phim Thương Hiệu', 'Phong Cách Tài Liệu', 'Quảng Cáo Commercial', 'Lookbook & Fashion Film'],
        image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1000',
        colorTheme: '#C09A5A'
    },
    {
        icon: <PenTool size={40} />,
        title: 'Hậu Kỳ',
        desc: 'Đảm bảo mỗi khung hình, nhịp cắt cảnh và thiết kế âm thanh vòm được hoàn thiện ở tiêu chuẩn điện ảnh khắt khe nhất.',
        features: ['Hậu Kỳ Hình Ảnh', 'Dựng Phim Cinematic', 'Color Grading Chuyên Nghiệp', 'Sound Design & Kỹ Xảo'],
        image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1000',
        colorTheme: '#C09A5A'
    },
    {
        icon: <Monitor size={40} />,
        title: 'Nội Dung Mạng Xã Hội',
        desc: 'Xây dựng giải pháp nội dung video ngắn thu hút, định hình phong cách độc bản cho kênh xã hội của doanh nghiệp.',
        features: ['Reels / TikTok Mạng Xã Hội', 'Chiến Lược YouTube', 'Đồ Họa Chuyển Động', 'Content Creator Kit'],
        image: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&q=80&w=1000',
        colorTheme: '#C09A5A'
    }
];

const workflow = [
    {
        step: '01',
        title: 'Tư Vấn & Ý Tưởng',
        desc: 'Chúng tôi bắt đầu bằng việc lắng nghe câu chuyện của bạn. Qua các buổi brainstorm chuyên sâu, Aura sẽ cùng bạn định hình concept, phong cách và thông điệp cốt lõi cần truyền tải.',
        icon: <Lightbulb size={28} />
    },
    {
        step: '02',
        title: 'Kế Hoạch Tiền Kỳ',
        desc: 'Mọi sự hoàn hảo đều đến từ khâu chuẩn bị tỉ mỉ. Aura thực hiện khảo sát địa điểm, casting, vẽ storyboard và lập bảng phân cảnh chi tiết để đảm bảo mọi khung hình đều có chủ ý.',
        icon: <Clapperboard size={28} />
    },
    {
        step: '03',
        title: 'SẢN XUẤT',
        desc: 'Đội ngũ chuyên nghiệp cùng thiết bị điện ảnh tối tân sẽ hiện thực hóa bản vẽ. Chúng tôi tối ưu hóa ánh sáng, âm thanh và diễn xuất để bắt trọn những khoảnh khắc đắt giá nhất.',
        icon: <Film size={28} />
    },
    {
        step: '04',
        title: 'HẬU KỲ',
        desc: 'Đây là nơi ma thuật thực sự diễn ra. Chúng tôi tinh chỉnh màu sắc, dựng phim nhịp điệu, thiết kế âm thanh vòm và thêm các hiệu ứng kỹ xảo để tạo nên một kiệt tác hoàn chỉnh.',
        icon: <Scissors size={28} />
    }
];

const Services: React.FC = () => {
    return (
        <div style={{ paddingTop: '100px', backgroundColor: '#050505', color: '#FFFFFF' }}>
            {/* Ambient Background Glow */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '-10%',
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(192,154,90,0.03) 0%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            <section className="container" style={{ padding: '4rem 0 8rem', position: 'relative', zIndex: 2 }}>
                <header style={{ maxWidth: '1000px', marginBottom: '5rem', textAlign: 'center', margin: '0 auto 5rem' }}>
                    <span style={{ color: '#C09A5A', textTransform: 'uppercase', letterSpacing: '0.4em', fontSize: '0.75rem', fontWeight: 800, display: 'block', marginBottom: '1.5rem' }}>
                        DỊCH VỤ CỦA CHÚNG TÔI
                    </span>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                            color: '#FFFFFF',
                            textTransform: 'uppercase',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 900,
                            lineHeight: 1.15
                        }}
                    >
                        AURA CÓ THỂ LÀM GÌ?
                    </motion.h1>
                </header>

                <div className="services-page-grid">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            className="svc-page-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.15 }}
                            style={{
                                position: 'relative',
                                minHeight: '520px',
                                padding: '3.5rem 2rem',
                                backgroundColor: '#0F0F0F',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: '0px',
                                '--svc-accent': '#C09A5A',
                            } as React.CSSProperties}
                        >
                            {/* Hover Background Image Reveal - Preserving Effect */}
                            <div className="svc-page-bg" style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                backgroundImage: `url(${service.image})`, backgroundSize: 'cover', backgroundPosition: 'center',
                                opacity: 0, transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)', zIndex: 0, transform: 'scale(1.05)',
                                filter: 'grayscale(100%) brightness(0.6)'
                            }} />

                            {/* Theme Glow Overlay */}
                            <div className="svc-page-glow" style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                                opacity: 0, transition: 'opacity 0.6s ease', zIndex: 1
                            }} />

                            {/* Content */}
                            <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%', flex: 1 }}>
                                <div className="svc-page-icon" style={{
                                    color: '#C09A5A', marginBottom: 'auto', transition: 'all 0.4s ease',
                                    padding: '0.5rem', width: 'fit-content',
                                }}>
                                    {service.icon}
                                </div>
                                <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <h3 className="svc-page-title" style={{
                                        fontSize: '1.5rem', color: '#FFFFFF', textTransform: 'uppercase',
                                        fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: '1.2rem',
                                        transition: 'color 0.4s ease', letterSpacing: '0.05em'
                                    }}>
                                        {service.title}
                                    </h3>
                                    <p className="svc-page-desc" style={{
                                        color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6,
                                        marginBottom: '2.5rem', transition: 'color 0.4s ease'
                                    }}>
                                        {service.desc}
                                    </p>
                                    <ul style={{
                                        listStyle: 'none', display: 'flex', flexDirection: 'column',
                                        gap: '0.9rem', borderTop: '1px solid rgba(255,255,255,0.08)',
                                        paddingTop: '1.8rem', transition: 'border-color 0.4s ease', marginTop: 'auto',
                                        paddingLeft: 0
                                    }} className="svc-page-list-border">
                                        {service.features.map(f => (
                                            <li key={f} className="svc-page-feature" style={{
                                                display: 'flex', alignItems: 'center', gap: '12px',
                                                fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase',
                                                letterSpacing: '0.12em', transition: 'color 0.4s ease'
                                            }}>
                                                <div className="svc-page-bullet" style={{
                                                    width: '4px', height: '4px', backgroundColor: '#C09A5A',
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
                    .services-page-grid {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 1.5rem;
                    }
                    @media (max-width: 1024px) {
                        .services-page-grid {
                            grid-template-columns: repeat(2, 1fr);
                        }
                    }
                    @media (max-width: 640px) {
                        .services-page-grid {
                            grid-template-columns: 1fr;
                            gap: 1rem;
                        }
                        .svc-page-card {
                            min-height: 400px !important;
                            padding: 2.5rem 1.5rem !important;
                        }
                    }
                    .svc-page-card {
                        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                    }
                    .svc-page-card:hover {
                        border-color: rgba(192, 154, 90, 0.3) !important;
                        box-shadow: 0 20px 40px rgba(0,0,0,0.6), inset 0 0 20px rgba(192, 154, 90, 0.05);
                        transform: translateY(-4px);
                    }
                    .svc-page-card:hover .svc-page-bg {
                        opacity: 1 !important;
                        transform: scale(1) translateZ(0) !important;
                        filter: grayscale(0%) contrast(1.05) brightness(0.5) !important;
                    }
                    .svc-page-card:hover .svc-page-glow {
                        opacity: 0.9 !important;
                    }
                    .svc-page-card:hover .svc-page-icon {
                        color: #FFFFFF !important;
                        transform: translateY(-5px);
                    }
                    .svc-page-card:hover .svc-page-title,
                    .svc-page-card:hover .svc-page-desc,
                    .svc-page-card:hover .svc-page-feature {
                        color: #FFFFFF !important;
                    }
                    .svc-page-card:hover .svc-page-bullet {
                        background-color: #C09A5A !important;
                        box-shadow: 0 0 10px #C09A5A;
                    }
                    .svc-page-card:hover .svc-page-list-border {
                        border-color: rgba(255,255,255,0.2) !important;
                    }
                    .bts-flex-container {
                        display: flex;
                        gap: 8rem;
                        align-items: flex-start;
                    }
                    @media (max-width: 1024px) {
                        .bts-flex-container {
                            flex-direction: column;
                            gap: 4rem;
                        }
                        .bts-flex-container > div {
                            position: static !important;
                            flex: none !important;
                            width: 100% !important;
                        }
                    }
                    .workflow-item {
                        display: flex;
                        gap: 3rem;
                        align-items: flex-start;
                        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    }
                    .workflow-item:hover {
                        background-color: rgba(255,255,255,0.01);
                        padding-left: 1.5rem !important;
                        border-bottom-color: rgba(192, 154, 90, 0.25) !important;
                    }
                    .workflow-item:hover .workflow-circle {
                        border-color: #C09A5A !important;
                        background-color: #121212 !important;
                        box-shadow: 0 0 20px rgba(192, 154, 90, 0.25);
                        transform: scale(1.08);
                    }
                    .workflow-circle {
                        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    }
                    @media (max-width: 640px) {
                        .workflow-item {
                            flex-direction: column !important;
                            gap: 1.5rem !important;
                            padding: 2.5rem 0 !important;
                        }
                        .workflow-line {
                            display: none !important;
                        }
                    }
                `}</style>
            </section>

            {/* Workflow Section - Dark background with gold/white accents */}
            <section style={{ backgroundColor: '#090909', padding: '8rem 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="container">
                    <div className="bts-flex-container">

                        {/* Sticky Header Side */}
                        <div style={{ flex: '0.8', position: 'sticky', top: '150px' }}>
                            <span style={{ color: '#C09A5A', textTransform: 'uppercase', letterSpacing: '0.4em', fontSize: '0.75rem', fontWeight: 800, display: 'block', marginBottom: '1.5rem' }}>
                                QUY TRÌNH LÀM VIỆC
                            </span>
                            <h2 style={{
                                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                                color: '#FFFFFF',
                                fontFamily: 'var(--font-display)',
                                lineHeight: 1.15,
                                textTransform: 'uppercase',
                                fontWeight: 900,
                                marginBottom: '3rem'
                            }}>
                                Hành Trình Kiến Tạo
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: '350px' }}>
                                Chúng tôi tuân thủ các quy chuẩn sản xuất khắt khe nhất để đảm bảo mỗi sản phẩm ra đời đều mang tầm vóc của một tác phẩm nghệ thuật duy mỹ.
                            </p>
                        </div>

                        {/* Steps Grid */}
                        <div style={{ flex: '1.2', position: 'relative' }}>
                            {/* Vertical Line Connector */}
                            <div style={{
                                position: 'absolute',
                                left: '32px',
                                top: '4rem',
                                bottom: '8rem',
                                width: '1px',
                                background: 'linear-gradient(to bottom, rgba(192, 154, 90, 0.4) 0%, rgba(192, 154, 90, 0.15) 50%, transparent 100%)',
                                zIndex: 0
                            }} className="workflow-line" />

                            {workflow.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ margin: "-50px", once: true }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}
                                    className="workflow-item"
                                    style={{
                                        position: 'relative',
                                        padding: '4rem 0',
                                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                                        display: 'flex',
                                        gap: '3rem',
                                        alignItems: 'flex-start'
                                    }}
                                >
                                    <div 
                                        className="workflow-circle"
                                        style={{
                                            width: '64px',
                                            height: '64px',
                                            backgroundColor: '#090909',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#C09A5A',
                                            flexShrink: 0,
                                            zIndex: 1,
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                                        }}
                                    >
                                        {item.icon}
                                    </div>

                                    <div style={{ zIndex: 1, position: 'relative' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#C09A5A', letterSpacing: '0.25em', fontWeight: 800, display: 'block', marginBottom: '0.5rem' }}>BƯỚC {item.step}</span>
                                        <h3 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.05em' }}>
                                            {item.title}
                                        </h3>
                                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: '500px' }}>
                                            {item.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section - Black background with luxury border */}
            <section style={{
                backgroundColor: '#000000',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                padding: '8rem 0',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h2 style={{
                        fontSize: 'clamp(2rem, 5vw, 4rem)',
                        marginBottom: '3rem',
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 900,
                        color: '#FFFFFF',
                        letterSpacing: '0.02em',
                        lineHeight: 1.2
                    }}>
                        SẴN SÀNG NÂNG TẦM HÌNH ẢNH?
                    </h2>
                    <Link to="/packages">
                        <Button
                            size="lg"
                            style={{
                                borderRadius: '0',
                                padding: '1.2rem 3.5rem',
                                backgroundColor: '#C09A5A',
                                color: '#FFFFFF',
                                fontSize: '0.8rem',
                                letterSpacing: '0.15em',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                border: 'none',
                                transition: 'background-color 0.3s ease'
                            }}
                            className="cta-button-hover"
                        >
                            BẮT ĐẦU DỰ ÁN <ArrowRight size={18} style={{ marginLeft: '12px' }} />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Services;
