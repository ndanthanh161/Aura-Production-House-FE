import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Video, PenTool, Monitor, ArrowRight, Lightbulb, Clapperboard, Film, Scissors } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';

const services = [
    {
        icon: <Camera size={40} />,
        title: 'Nhiếp Ảnh',
        desc: 'Aura giúp bạn ghi lại hình ảnh chuyên nghiệp, nâng tầm thương hiệu cá nhân.',
        features: ['Thương Hiệu Cá Nhân', 'Thời Trang Biên Tập', 'Sản Phẩm Thương Mại', 'Hồ Sơ Kiến Trúc'],
        image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1000',
        colorTheme: '#071FD9'
    },
    {
        icon: <Video size={40} />,
        title: 'Quay Phim',
        desc: 'Aura giúp bạn sản xuất video sáng tạo, giúp bạn nổi bật trên nền tảng số.',
        features: ['Phim Thương Hiệu', 'Phong Cách Tài Liệu', 'Quảng Cáo Thương Mại', 'Điểm Nhấn Sự Kiện'],
        image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1000',
        colorTheme: '#071FD9'
    },
    {
        icon: <PenTool size={40} />,
        title: 'Hậu Kì',
        desc: 'Aura đảm bảo mỗi sản phẩm được chỉnh sửa chỉn chu. Từ màu sắc đến âm thanh, mang lại chất lượng hoàn thiện cao nhất.',
        features: ['Hậu Kì Hình Ảnh', 'Hậu Kì Video', 'Thiết Kế Poster', 'Định Hướng Phong Cách'],
        image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1000',
        colorTheme: '#071FD9'
    },
    {
        icon: <Monitor size={40} />,
        title: 'Nội Dung Mạng Xã Hội',
        desc: 'Aura hỗ trợ xây dựng nội dung thu hút, định hình phong cách cá nhân.',
        features: ['Reels Mạng Xã Hội', 'Chiến Lược YouTube', 'Tài Sản Số', 'Đồ Họa Chuyển Động'],
        image: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&q=80&w=1000',
        colorTheme: '#071FD9'
    }
];

const workflow = [
    {
        step: '01',
        title: 'Tư Vấn & Ý Tưởng',
        desc: 'Chúng tôi bắt đầu bằng việc lắng nghe câu chuyện của bạn. Qua các buổi brainstorm chuyên sâu, Aura sẽ cùng bạn định hình concept, phong cách và thông điệp cốt lõi cần truyền tải.',
        icon: <Lightbulb size={32} />
    },
    {
        step: '02',
        title: 'Kế Hoạch Tiền Kỳ',
        desc: 'Mọi sự hoàn hảo đều đến từ khâu chuẩn bị tỉ mỉ. Aura thực hiện khảo sát địa điểm, casting, vẽ storyboard và lập bảng phân cảnh chi tiết để đảm bảo mọi khung hình đều có chủ ý.',
        icon: <Clapperboard size={32} />
    },
    {
        step: '03',
        title: 'SẢN XUẤT',
        desc: 'Đội ngũ chuyên nghiệp cùng thiết bị điện ảnh tối tân sẽ hiện thực hóa bản vẽ. Chúng tôi tối ưu hóa ánh sáng, âm thanh và diễn xuất để bắt trọn những khoảnh khắc đắt giá nhất.',
        icon: <Film size={32} />
    },
    {
        step: '04',
        title: 'HẬU KỲ',
        desc: 'Đây là nơi ma thuật thực sự diễn ra. Chúng tôi tinh chỉnh màu sắc, dựng phim nhịp điệu, thiết kế âm thanh vòm và thêm các hiệu ứng kỹ xảo để tạo nên một kiệt tác hoàn chỉnh.',
        icon: <Scissors size={32} />
    }
];

const Services: React.FC = () => {
    return (
        <div style={{ paddingTop: '100px', backgroundColor: '#071FD9' }}>
            <section className="container" style={{ padding: '4rem 0 8rem' }}>
                <header style={{ maxWidth: '1000px', marginBottom: '5rem', textAlign: 'center', margin: '0 auto 5rem' }}>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
                            color: '#FFFFFF',
                            textTransform: 'uppercase',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 900
                        }}
                    >
                        AURA CÓ THỂ LÀM GÌ?
                    </motion.h1>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
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
                                backgroundColor: '#FFFFFF',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                                border: 'none',
                                '--svc-accent': '#071FD9',
                            } as React.CSSProperties}
                        >
                            {/* Hover Background Image Reveal - Preserving Effect */}
                            <div className="svc-page-bg" style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                backgroundImage: `url(${service.image})`, backgroundSize: 'cover', backgroundPosition: 'center',
                                opacity: 0, transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)', zIndex: 0, transform: 'scale(1.05)',
                                filter: 'grayscale(100%) brightness(0.7)'
                            }} />

                            {/* Theme Glow Overlay */}
                            <div className="svc-page-glow" style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                                opacity: 0, transition: 'opacity 0.6s ease', zIndex: 1
                            }} />

                            {/* Content */}
                            <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div className="svc-page-icon" style={{
                                    color: '#071FD9', marginBottom: 'auto', transition: 'all 0.4s ease',
                                    padding: '0.5rem', width: 'fit-content',
                                }}>
                                    {service.icon}
                                </div>
                                <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <h3 className="svc-page-title" style={{
                                        fontSize: '1.6rem', color: '#0F0F0F', textTransform: 'uppercase',
                                        fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: '1.2rem',
                                        transition: 'color 0.4s ease'
                                    }}>
                                        {service.title}
                                    </h3>
                                    <p className="svc-page-desc" style={{
                                        color: '#444444', fontSize: '0.9rem', lineHeight: 1.6,
                                        marginBottom: '2.5rem', transition: 'color 0.4s ease'
                                    }}>
                                        {service.desc}
                                    </p>
                                    <ul style={{
                                        listStyle: 'none', display: 'flex', flexDirection: 'column',
                                        gap: '0.9rem', borderTop: '1px solid rgba(0,0,0,0.05)',
                                        paddingTop: '1.8rem', transition: 'border-color 0.4s ease', marginTop: 'auto'
                                    }} className="svc-page-list-border">
                                        {service.features.map(f => (
                                            <li key={f} className="svc-page-feature" style={{
                                                display: 'flex', alignItems: 'center', gap: '12px',
                                                fontSize: '0.7rem', color: '#666666', textTransform: 'uppercase',
                                                letterSpacing: '0.1em', transition: 'color 0.4s ease'
                                            }}>
                                                <div className="svc-page-bullet" style={{
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
                    .svc-page-card:hover .svc-page-bg {
                        opacity: 1 !important;
                        transform: scale(1) translateZ(0) !important;
                        filter: grayscale(20%) brightness(0.6) !important;
                    }
                    .svc-page-card:hover .svc-page-glow {
                        opacity: 0.8 !important;
                    }
                    .svc-page-card:hover .svc-page-icon {
                        color: #ADFF00 !important;
                        transform: translateY(-5px);
                    }
                    .svc-page-card:hover .svc-page-title,
                    .svc-page-card:hover .svc-page-desc,
                    .svc-page-card:hover .svc-page-feature {
                        color: #FFFFFF !important;
                    }
                    .svc-page-card:hover .svc-page-bullet {
                        background-color: #ADFF00 !important;
                        box-shadow: 0 0 10px #ADFF00;
                    }
                    .svc-page-card:hover .svc-page-list-border {
                        border-color: rgba(255,255,255,0.2) !important;
                    }
                `}</style>
            </section>

            {/* Workflow Section - Green background with dark text */}
            <section style={{ backgroundColor: '#ADFF00', padding: '10rem 0' }}>
                <div className="container">
                    <div style={{ display: 'flex', gap: '8rem', alignItems: 'flex-start' }} className="bts-flex-container">

                        {/* Sticky Header Side */}
                        <div style={{ flex: '0.8', position: 'sticky', top: '150px' }}>
                            <h2 style={{
                                fontSize: 'clamp(3rem, 6vw, 4.4rem)',
                                color: '#0F0F0F',
                                fontFamily: 'var(--font-display)',
                                lineHeight: 1.1,
                                textTransform: 'uppercase',
                                fontWeight: 900,
                                marginBottom: '3rem'
                            }}>
                                Quy Trình Làm Việc
                            </h2>
                            <p style={{ color: '#1A1A1A', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '350px' }}>
                                Chúng tôi tuân thủ các quy chuẩn điện ảnh khắt khe nhất để đảm bảo mỗi sản phẩm ra đời đều mang tầm vóc của một tác phẩm nghệ thuật.
                            </p>
                        </div>

                        {/* Steps Grid */}
                        <div style={{ flex: '1.2' }}>
                            {workflow.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ margin: "-50px", once: true }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}
                                    style={{
                                        position: 'relative',
                                        padding: '4rem 0',
                                        borderBottom: '1px solid rgba(0,0,0,0.1)',
                                        display: 'flex',
                                        gap: '3rem',
                                        alignItems: 'flex-start'
                                    }}
                                >
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        backgroundColor: '#FFFFFF',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#071FD9',
                                        flexShrink: 0,
                                        zIndex: 1,
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                                    }}>
                                        {item.icon}
                                    </div>

                                    <div style={{ zIndex: 1, position: 'relative' }}>
                                        <h3 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#0F0F0F' }}>
                                            {item.title}
                                        </h3>
                                        <p style={{ color: '#1A1A1A', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: '500px' }}>
                                            {item.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section - Black background with lime top border */}
            <section style={{
                backgroundColor: '#000000',
                borderTop: '1px solid #ADFF00',
                padding: '8rem 0',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                        marginBottom: '3rem',
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 900,
                        color: '#FFFFFF',
                        letterSpacing: '0.02em'
                    }}>
                        SẴN SÀNG NÂNG TẦM HÌNH ẢNH?
                    </h2>
                    <Link to="/packages">
                        <Button
                            size="lg"
                            style={{
                                borderRadius: '0',
                                padding: '1.2rem 3rem',
                                backgroundColor: '#071FD9',
                                color: '#FFFFFF',
                                fontSize: '0.8rem',
                                letterSpacing: '0.1em',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                border: 'none'
                            }}
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
