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
        icon: <Lightbulb size={28} />,
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600'
    },
    {
        step: '02',
        title: 'Kế Hoạch Tiền Kỳ',
        desc: 'Mọi sự hoàn hảo đều đến từ khâu chuẩn bị tỉ mỉ. Aura thực hiện khảo sát địa điểm, casting, vẽ storyboard và lập bảng phân cảnh chi tiết để đảm bảo mọi khung hình đều có chủ ý.',
        icon: <Clapperboard size={28} />,
        image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=600'
    },
    {
        step: '03',
        title: 'SẢN XUẤT',
        desc: 'Đội ngũ chuyên nghiệp cùng thiết bị điện ảnh tối tân sẽ hiện thực hóa bản vẽ. Chúng tôi tối ưu hóa ánh sáng, âm thanh và diễn xuất để bắt trọn những khoảnh khắc đắt giá nhất.',
        icon: <Film size={28} />,
        image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=600'
    },
    {
        step: '04',
        title: 'HẬU KỲ',
        desc: 'Đây là nơi ma thuật thực sự diễn ra. Chúng tôi tinh chỉnh màu sắc, dựng phim nhịp điệu, thiết kế âm thanh vòm và thêm các hiệu ứng kỹ xảo để tạo nên một kiệt tác hoàn chỉnh.',
        icon: <Scissors size={28} />,
        image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&q=80&w=600'
    }
];

const workflowStandards = [
    {
        step: '01',
        title: 'THIẾT BỊ ĐIỆN ẢNH CAO CẤP',
        desc: 'Vận hành hệ thống máy quay phim chuẩn Hollywood (RED, ARRI, Sony Cinema) kết hợp hệ kính cine cao cấp để thu lại độ phân giải sắc nét cùng dải màu trung thực đỉnh cao.',
        image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&q=80&w=800'
    },
    {
        step: '02',
        title: 'HẬU KỲ CHUẨN ĐIỆN ẢNH',
        desc: 'Cân màu chuyên nghiệp trên DaVinci Resolve Studio kết hợp hạt grain phim analog mô phỏng chất phim nhựa cổ điển đầy chiều sâu cảm xúc.',
        image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800'
    },
    {
        step: '03',
        title: 'TINH CHỈNH CHI TIẾT DUY MỸ',
        desc: 'Tối ưu hóa ánh sáng, khử nhiễu, cân bằng trắng và loại bỏ mọi tì vết thừa vùng biên thủ công trên từng khung hình đạt tiêu chuẩn khắt khe.',
        image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800'
    },
    {
        step: '04',
        title: 'HÀI LÒNG TUYỆT ĐỐI',
        desc: 'Aura cam kết đồng hành và liên tục bổ sung hoàn thiện theo ý kiến của bạn, đảm bảo sự ăn khớp hoàn hảo nhất với chiến dịch của doanh nghiệp.',
        image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=800'
    }
];

const Services: React.FC = () => {
    return (
        <div style={{ paddingTop: '100px', background: 'linear-gradient(180deg, #080807 0%, #050505 100%)', color: '#FFFFFF' }}>
            {/* Subtle background texture */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
                backgroundSize: '96px 96px',
                opacity: 0.3,
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
                        gap: 4rem;
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
                    .workflow-item:hover .workflow-step-image {
                        transform: scale(1.03);
                        filter: grayscale(0%);
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
                    @media (max-width: 1024px) {
                        .manifesto-grid {
                            grid-template-columns: 1fr !important;
                            gap: 2rem !important;
                        }
                    }

                    /* Cinematic Film Strip Styles */
                    .film-strip-card {
                        transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1) !important;
                    }
                    .film-strip-card:hover {
                        border-color: rgba(192, 154, 90, 0.3) !important;
                        box-shadow: 0 30px 60px rgba(0,0,0,0.8), inset 0 0 20px rgba(192, 154, 90, 0.05);
                        transform: translateY(-8px);
                    }
                    .film-strip-card:hover .film-strip-bg {
                        filter: grayscale(0%) contrast(1.05) brightness(0.45) scale(1.05) !important;
                    }
                    .film-strip-card:hover .film-strip-number {
                        color: rgba(192, 154, 90, 0.8) !important;
                        transform: translateY(-8px);
                    }
                    .film-strip-card:hover .film-strip-content {
                        transform: translateY(0) !important;
                    }
                    .film-strip-card:hover .film-strip-title {
                        color: #C09A5A !important;
                    }
                    .film-strip-card:hover .film-strip-desc {
                        opacity: 1 !important;
                        height: auto !important;
                        margin-top: 0.5rem !important;
                    }
                    @media (max-width: 1024px) {
                        .film-strip-grid {
                            grid-template-columns: repeat(2, 1fr) !important;
                        }
                        .film-strip-card {
                            aspectRatio: '9/12' !important;
                        }
                    }
                    @media (max-width: 640px) {
                        .film-strip-grid {
                            grid-template-columns: 1fr !important;
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
                                fontSize: 'clamp(1.6rem, 3.2vw, 2.4rem)',
                                color: '#FFFFFF',
                                fontFamily: 'var(--font-display)',
                                lineHeight: 1.15,
                                textTransform: 'uppercase',
                                fontWeight: 900,
                                marginBottom: '3rem',
                                whiteSpace: 'nowrap'
                            }}>
                                Hành Trình Kiến Tạo
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: '350px' }}>
                                Chúng tôi tuân thủ các quy chuẩn sản xuất khắt khe nhất để đảm bảo mỗi sản phẩm ra đời đều mang tầm vóc của một tác phẩm nghệ thuật duy mỹ.
                            </p>
                        </div>

                        {/* Steps Grid */}
                        <div style={{ flex: '1.2', position: 'relative' }}>
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
                                         padding: '6rem 0',
                                         borderBottom: index === workflow.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.08)',
                                         marginBottom: index === workflow.length - 1 ? '0' : '6rem',
                                     }}
                                >
                                    <div style={{ 
                                        zIndex: 1, 
                                        position: 'relative', 
                                        display: 'flex', 
                                        gap: '3rem', 
                                        flex: 1, 
                                        flexWrap: 'wrap', 
                                        alignItems: 'center',
                                        flexDirection: index % 2 === 0 ? 'row' : 'row-reverse'
                                    }}>
                                        {/* Text Section */}
                                        <div style={{ flex: '1.2', minWidth: '280px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                                <span style={{ 
                                                    fontSize: '0.85rem', 
                                                    color: '#C09A5A', 
                                                    letterSpacing: '0.2em', 
                                                    fontWeight: 800 
                                                }}>
                                                    BƯỚC {item.step}
                                                </span>
                                                <div style={{ width: '24px', height: '1px', backgroundColor: 'rgba(192, 154, 90, 0.4)' }} />
                                            </div>
                                            <h3 style={{ 
                                                fontSize: '1.8rem', 
                                                marginBottom: '1.2rem', 
                                                fontFamily: 'var(--font-display)', 
                                                fontWeight: 800, 
                                                color: '#FFFFFF', 
                                                letterSpacing: '0.05em' 
                                            }}>
                                                {item.title}
                                            </h3>
                                            <p style={{ 
                                                color: 'rgba(255,255,255,0.65)', 
                                                fontSize: '0.95rem', 
                                                lineHeight: 1.75 
                                            }}>
                                                {item.desc}
                                            </p>
                                        </div>

                                        {/* Image Section */}
                                        {item.image && (
                                            <div style={{
                                                flex: '0.8',
                                                minWidth: '240px',
                                                aspectRatio: '16/10',
                                                borderRadius: '6px',
                                                overflow: 'hidden',
                                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                                                position: 'relative'
                                            }}>
                                                <img 
                                                    src={item.image} 
                                                    alt={item.title} 
                                                    className="workflow-step-image"
                                                    style={{ 
                                                        width: '100%', 
                                                        height: '100%', 
                                                        objectFit: 'cover', 
                                                        filter: 'grayscale(20%) brightness(0.9)', 
                                                        transition: 'all 0.5s ease' 
                                                    }} 
                                                />
                                                <div style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)',
                                                    pointerEvents: 'none'
                                                }} />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Cinematic Filmstrip Storyboard Section */}
            <section style={{
                backgroundColor: '#050505',
                padding: '10rem 0 8rem',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background Ambient Radial Glow */}
                <div style={{
                    position: 'absolute',
                    top: '30%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '900px',
                    height: '900px',
                    background: 'radial-gradient(circle, rgba(192, 154, 90, 0.03) 0%, transparent 70%)',
                    zIndex: 0,
                    pointerEvents: 'none'
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <header style={{ marginBottom: '6rem', textAlign: 'center' }}>
                        <span style={{ color: '#C09A5A', textTransform: 'uppercase', letterSpacing: '0.4em', fontSize: '0.75rem', fontWeight: 800, display: 'block', marginBottom: '1rem' }}>
                            CHẤT LƯỢNG ĐỘC BẢN CỦA AURA
                        </span>
                        <h2 style={{
                            fontSize: 'clamp(2.2rem, 5vw, 4rem)',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 900,
                            color: '#FFFFFF',
                            textTransform: 'uppercase',
                            lineHeight: 1.1,
                            margin: 0
                        }}>
                            TIÊU CHUẨN KỸ THUẬT CINE
                        </h2>
                    </header>

                    {/* Widescreen Storyboard Roll - Vertical Cinema Frames */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5rem',
                        maxWidth: '1100px',
                        margin: '0 auto'
                    }}>
                        {[
                            {
                                ...workflowStandards[0],
                                metadata: { tc: '00:14:02:18', lens: 'HAWK ANAMORPHIC 50MM T2.2', shutter: '172.8°', iso: '800', lut: 'AURA_GOLD_CINE' }
                            },
                            {
                                ...workflowStandards[1],
                                metadata: { tc: '00:28:45:02', lens: 'COOKE S7/i 32MM T2.0', shutter: '180°', iso: '400', lut: 'ANA_GRAIN_V3' }
                            },
                            {
                                ...workflowStandards[2],
                                metadata: { tc: '00:42:15:10', lens: 'ZEISS SUPREME 85MM T1.5', shutter: '180°', iso: '640', lut: 'FIN_SHARP_10' }
                            },
                            {
                                ...workflowStandards[3],
                                metadata: { tc: '01:05:32:00', lens: 'ANGENIEUX OPTIMO ULTRA', shutter: '180°', iso: '800', lut: 'EXPORT_REC709' }
                            }
                        ].map((std, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-100px' }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                style={{
                                    width: '100%',
                                    position: 'relative'
                                }}
                            >
                                {/* Widescreen 2.39:1 Cinema Viewport Frame */}
                                <div style={{
                                    width: '100%',
                                    aspectRatio: '2.39/1',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
                                    backgroundColor: '#000',
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }} className="cinema-viewport-hover">
                                    
                                    {/* Top Letterbox Bar */}
                                    <div style={{
                                        height: '14%',
                                        backgroundColor: '#000000',
                                        zIndex: 3,
                                        position: 'relative',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '0 2.5%'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '6px', height: '6px', backgroundColor: '#FF3B30', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
                                            <span style={{ fontSize: '0.6rem', color: '#FF3B30', letterSpacing: '0.2em', fontWeight: 800 }}>REC</span>
                                            <span style={{ fontSize: '0.65rem', color: '#CCCCCC', fontFamily: 'monospace', letterSpacing: '0.1em' }}>{std.metadata.tc}</span>
                                        </div>
                                        <span style={{ fontSize: '0.6rem', color: 'rgba(255, 255, 255, 0.4)', letterSpacing: '0.25em', fontWeight: 800 }}>
                                            CAMERA {std.step} // AURA SYSTEM
                                        </span>
                                        <span style={{ fontSize: '0.65rem', color: '#C09A5A', letterSpacing: '0.1em', fontWeight: 800 }}>
                                            LUT: {std.metadata.lut}
                                        </span>
                                    </div>

                                    {/* Center Image Area */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '14%',
                                        bottom: '22%',
                                        left: 0,
                                        right: 0,
                                        overflow: 'hidden',
                                        zIndex: 1
                                    }}>
                                        <img 
                                            src={std.image} 
                                            alt={std.title}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                filter: 'contrast(1.1) brightness(0.85)',
                                                transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
                                            }}
                                            className="cinema-bg-image"
                                        />
                                        
                                        {/* Cinematic Ambient Overlays */}
                                        <div style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.5) 100%)',
                                            pointerEvents: 'none'
                                        }} />
                                        <div style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'radial-gradient(circle, transparent 50%, rgba(0,0,0,0.6) 100%)',
                                            pointerEvents: 'none'
                                        }} />
                                    </div>

                                    {/* Bottom Letterbox Bar */}
                                    <div style={{
                                        height: '22%',
                                        backgroundColor: '#000000',
                                        zIndex: 3,
                                        position: 'relative',
                                        borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: '0.5rem 10%',
                                        textAlign: 'center'
                                    }}>
                                        {/* Subtitle Accent */}
                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: '#C09A5A',
                                            fontWeight: 800,
                                            letterSpacing: '0.25em',
                                            textTransform: 'uppercase',
                                            marginBottom: '0.35rem'
                                        }}>
                                            {std.step} // {std.title}
                                        </div>
                                        {/* Movie Subtitles Style Description */}
                                        <div style={{
                                            fontSize: 'clamp(0.75rem, 1.8vw, 0.95rem)',
                                            color: '#FFFFFF',
                                            lineHeight: 1.5,
                                            fontWeight: 500,
                                            letterSpacing: '0.02em',
                                            maxWidth: '800px',
                                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
                                        }}>
                                            {std.desc}
                                        </div>
                                    </div>

                                    {/* Floating Lens / Camera Settings overlay inside image (Bottom Left & Bottom Right) */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '25%',
                                        left: '20px',
                                        zIndex: 2,
                                        backgroundColor: 'rgba(0,0,0,0.65)',
                                        backdropFilter: 'blur(4px)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        padding: '5px 10px',
                                        borderRadius: '2px',
                                        fontSize: '0.55rem',
                                        color: '#AAAAAA',
                                        fontFamily: 'monospace',
                                        pointerEvents: 'none',
                                        letterSpacing: '0.1em'
                                    }}>
                                        LENS: {std.metadata.lens}
                                    </div>

                                    <div style={{
                                        position: 'absolute',
                                        bottom: '25%',
                                        right: '20px',
                                        zIndex: 2,
                                        backgroundColor: 'rgba(0,0,0,0.65)',
                                        backdropFilter: 'blur(4px)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        padding: '5px 10px',
                                        borderRadius: '2px',
                                        fontSize: '0.55rem',
                                        color: '#AAAAAA',
                                        fontFamily: 'monospace',
                                        pointerEvents: 'none',
                                        letterSpacing: '0.1em'
                                    }}>
                                        SHUTTER: {std.metadata.shutter} | ISO: {std.metadata.iso}
                                    </div>

                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <style>{`
                    .cinema-viewport-hover {
                        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                    }
                    .cinema-viewport-hover:hover {
                        border-color: rgba(192, 154, 90, 0.3) !important;
                        box-shadow: 0 35px 80px rgba(0, 0, 0, 0.95) !important;
                        transform: translateY(-4px);
                    }
                    .cinema-viewport-hover:hover .cinema-bg-image {
                        transform: scale(1.05);
                    }
                    @keyframes pulse {
                        0% { opacity: 0.4; }
                        50% { opacity: 1; }
                        100% { opacity: 0.4; }
                    }
                `}</style>
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
