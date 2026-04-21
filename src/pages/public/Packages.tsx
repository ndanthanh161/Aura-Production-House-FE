import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const packages = [
    {
        name: 'MEMBERSHIP (SAAS)',
        title: 'Mô hình SaaS - Tự động hóa nội dung',
        displayPrice: '150K',
        priceNote: 'VNĐ / THÁNG',
        features: [
            "Kho thư viện mẫu (Templates) thiết kế cho đa nền tảng (Facebook, Instagram, TikTok).",
            "Mẫu kế hoạch nội dung (Content Plan) theo ngành (Bất động sản, Mỹ phẩm, F&B...).",
            "Kịch bản quay dựng (Scripting templates) có sẵn khung sườn."
        ],
        popular: false
    },
    {
        name: 'CƠ BẢN',
        title: 'Dành cho cá nhân mới bắt đầu làm hình ảnh.',
        displayPrice: '2 Triệu',
        priceNote: 'VNĐ / THÁNG',
        features: [
            "1 buổi chụp (Profile hoặc sản phẩm)",
            "2 video (short video)."
        ],
        popular: false
    },
    {
        name: 'NÂNG CAO',
        title: 'Dành cho người muốn xây dựng thương hiệu bài bản.',
        displayPrice: '5 Triệu',
        priceNote: 'VNĐ / THÁNG',
        features: [
            'Lên kế hoạch chi tiết',
            '01 buổi chụp',
            '5 video',
            'Hỗ trợ chỉnh sửa kịch bản cá nhân hóa.'
        ],
        popular: true
    },
    {
        name: 'TĂNG TỐC',
        title: 'Dành cho shop bán hàng hoặc KOLs đang lên.',
        displayPrice: '8 Triệu',
        priceNote: 'VNĐ / THÁNG',
        features: [
            'Lên kế hoạch chi tiết',
            '01 Concept chụp sáng tạo.',
            '8 Video + hỗ trợ chỉnh sửa kịch bản cá nhân hóa.',
            'Quản trị trang (Post bài/Set quảng cáo cơ bản)'
        ],
        popular: false
    },
    {
        name: 'ĐỘT PHÁ',
        title: 'Bứt phá doanh thu và định vị thương hiệu.',
        displayPrice: '10 Triệu',
        priceNote: 'VNĐ / THÁNG',
        features: [
            'Lên kế hoạch chi tiết',
            '1 Concept chụp sáng tạo',
            '12 video/tháng + hỗ trợ chỉnh sửa kịch bản cá nhân hóa.',
            'Quản trị trang (Post bài/Set quảng cáo cơ bản)',
            'Tư vấn định vị thương hiệu'
        ],
        popular: false
    }
];

const Packages: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={{ paddingTop: '80px', backgroundColor: '#FFFFFF' }}>
            {/* Header Banner */}
            <section style={{ backgroundColor: '#ADFF00', padding: '6rem 0', textAlign: 'center' }}>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        color: '#0F0F0F',
                        margin: 0
                    }}
                >
                    HÃY CHỌN ĐÚNG VỚI NHU CẦU
                </motion.h1>
            </section>

            {/* Pricing Section */}
            <div style={{ backgroundColor: '#ADFF00', paddingBottom: '10rem' }}>
                <div className="container">
                    <div className="pkg-grid">
                        {packages.map((pkg, index) => (
                            <motion.div
                                key={pkg.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                style={{
                                    padding: '3rem 2rem',
                                    backgroundColor: '#FFFFFF',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    minHeight: '700px',
                                    transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                                    overflow: 'hidden',
                                    border: '1px solid rgba(0,0,0,0.05)'
                                }}
                                className="pkg-card"
                            >
                                {/* Ambient Glow */}
                                <div className="pkg-glow" style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, height: '100%',
                                    background: pkg.popular ? 'radial-gradient(circle at top, rgba(7,31,217,0.1) 0%, transparent 70%)' : 'radial-gradient(circle at top, rgba(173,255,0,0.1) 0%, transparent 70%)',
                                    opacity: 0, transition: 'opacity 0.4s ease', pointerEvents: 'none', zIndex: 0
                                }} />

                                {pkg.popular && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '2.2rem',
                                        right: '-2.8rem',
                                        backgroundColor: '#071FD9',
                                        color: '#FFF',
                                        padding: '8px 50px',
                                        fontSize: '0.65rem',
                                        fontWeight: '900',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.15em',
                                        transform: 'rotate(45deg)',
                                        boxShadow: '0 4px 15px rgba(7,31,217,0.3)',
                                        zIndex: 10,
                                        textAlign: 'center'
                                    }}>
                                        ĐẶC BIỆT
                                    </div>
                                )}

                                <div style={{ marginBottom: '2.5rem', position: 'relative', zIndex: 1 }}>
                                    <h3 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666', fontWeight: 700 }}>
                                        {pkg.name}
                                    </h3>
                                    <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '1.5rem', minHeight: '2.4rem' }}>
                                        {pkg.title}
                                    </p>
                                    <div style={{ marginBottom: '0.5rem' }}>
                                        <div style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#0F0F0F', lineHeight: 1 }}>
                                            {pkg.displayPrice}
                                        </div>
                                        <div style={{ fontSize: '0.65rem', color: '#888', marginTop: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                                            {pkg.priceNote}
                                        </div>
                                    </div>
                                    <div style={{ height: '1px', backgroundColor: '#EEE', marginTop: '2rem' }} />
                                </div>

                                <ul style={{ listStyle: 'none', margin: 0, padding: 0, flex: 1, position: 'relative', zIndex: 1 }}>
                                    {pkg.features.map((f, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '1.25rem', color: '#444', fontSize: '0.85rem' }}>
                                            <CheckCircle2 size={16} style={{ color: pkg.popular ? '#071FD9' : '#CCC', flexShrink: 0, marginTop: '2px' }} />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div style={{ marginTop: 'auto', paddingTop: '3rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                                    <Button
                                        onClick={() => navigate('/payment')}
                                        style={{
                                            width: '100%',
                                            padding: '1.25rem',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 0,
                                            backgroundColor: pkg.popular ? '#071FD9' : '#FFFFFF',
                                            color: pkg.popular ? '#FFFFFF' : '#0F0F0F',
                                            border: pkg.popular ? 'none' : '1px solid #CCC',
                                            fontSize: '0.85rem',
                                            fontWeight: 800,
                                            letterSpacing: '0.15em',
                                            textTransform: 'uppercase',
                                            transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)'
                                        }}
                                        className="pkg-btn"
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            BẮT ĐẦU <ArrowRight size={18} className="pkg-btn-arrow" />
                                        </div>
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .pkg-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.5rem;
                }
                @media (max-width: 1024px) {
                    .pkg-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                @media (max-width: 768px) {
                    .pkg-grid {
                        grid-template-columns: 1fr;
                    }
                }
                .pkg-card:hover {
                    transform: translateY(-12px) scale(1.02);
                    box-shadow: 0 30px 60px rgba(0,0,0,0.12);
                    border-color: rgba(7,31,217,0.2) !important;
                }
                .pkg-card:hover .pkg-glow {
                    opacity: 1 !important;
                }
                .pkg-card:hover .pkg-btn-arrow {
                    transform: translateX(5px);
                }
                .pkg-card:not(.popular):hover .pkg-btn {
                    background-color: #0F0F0F !important;
                    color: #FFFFFF !important;
                    border-color: #0F0F0F !important;
                }
            `}</style>
        </div>
    );
};

export default Packages;
