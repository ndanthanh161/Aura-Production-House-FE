import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { packageApi } from '../../services/packageApi';
import type { Package } from '../../types/package.types';

const Packages: React.FC = () => {
    const navigate = useNavigate();
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        packageApi.getAll(true)
            .then(res => setPackages(res.data || []))
            .catch(() => setError('Không thể tải danh sách gói dịch vụ.'))
            .finally(() => setLoading(false));
    }, []);

    const formatPrice = (price: number) => {
        if (price >= 1_000_000) return `${(price / 1_000_000).toLocaleString('vi-VN')} Triệu`;
        if (price >= 1_000) return `${(price / 1_000).toLocaleString('vi-VN')}K`;
        return price.toLocaleString('vi-VN');
    };

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
                    {loading && (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
                            <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: '#0F0F0F' }} />
                        </div>
                    )}

                    {error && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', padding: '3rem', color: '#ef4444' }}>
                            <AlertCircle size={20} /> {error}
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="pkg-grid">
                            {packages.map((pkg, index) => (
                                <motion.div
                                    key={pkg.id}
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
                                        background: pkg.isPopular
                                            ? 'radial-gradient(circle at top, rgba(7,31,217,0.1) 0%, transparent 70%)'
                                            : 'radial-gradient(circle at top, rgba(173,255,0,0.1) 0%, transparent 70%)',
                                        opacity: 0, transition: 'opacity 0.4s ease', pointerEvents: 'none', zIndex: 0
                                    }} />

                                    {pkg.isPopular && (
                                        <div style={{
                                            position: 'absolute', top: '2.2rem', right: '-2.8rem',
                                            backgroundColor: '#071FD9', color: '#FFF',
                                            padding: '8px 65px', fontSize: '0.75rem', fontWeight: 900,
                                            textTransform: 'uppercase', letterSpacing: '0.15em',
                                            transform: 'rotate(45deg)', boxShadow: '0 4px 15px rgba(7,31,217,0.3)',
                                            zIndex: 10, textAlign: 'center'
                                        }}>
                                            ĐẶC BIỆT
                                        </div>
                                    )}

                                    <div style={{ marginBottom: '2.5rem', position: 'relative', zIndex: 1 }}>
                                        <h3 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666', fontWeight: 700 }}>
                                            {pkg.name}
                                        </h3>
                                        <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '1.5rem', minHeight: '2.4rem' }}>
                                            {pkg.description}
                                        </p>
                                        <div style={{ marginBottom: '0.5rem' }}>
                                            <div style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#0F0F0F', lineHeight: 1 }}>
                                                {formatPrice(pkg.price)}
                                            </div>
                                            <div style={{ fontSize: '0.65rem', color: '#888', marginTop: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                                                VNĐ / THÁNG
                                            </div>
                                        </div>
                                        <div style={{ height: '1px', backgroundColor: '#EEE', marginTop: '2rem' }} />
                                    </div>

                                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, flex: 1, position: 'relative', zIndex: 1 }}>
                                        {pkg.benefits.map((benefit, i) => (
                                            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '1.25rem', color: '#444', fontSize: '0.85rem' }}>
                                                <CheckCircle2 size={16} style={{ color: pkg.isPopular ? '#071FD9' : '#CCC', flexShrink: 0, marginTop: '2px' }} />
                                                <span>{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div style={{ marginTop: 'auto', paddingTop: '3rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                                        <Button
                                            onClick={() => navigate(`/purchase/${pkg.id}`)}
                                            style={{
                                                width: '100%', padding: '1.25rem',
                                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                                borderRadius: 0,
                                                backgroundColor: pkg.isPopular ? '#071FD9' : '#FFFFFF',
                                                color: pkg.isPopular ? '#FFFFFF' : '#0F0F0F',
                                                border: pkg.isPopular ? 'none' : '1px solid #CCC',
                                                fontSize: '0.85rem', fontWeight: 800,
                                                letterSpacing: '0.15em', textTransform: 'uppercase',
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
                    )}
                </div>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .pkg-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.5rem;
                }
                @media (max-width: 1024px) { .pkg-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 768px)  { .pkg-grid { grid-template-columns: 1fr; } }
                .pkg-card:hover {
                    transform: translateY(-12px) scale(1.02);
                    box-shadow: 0 30px 60px rgba(0,0,0,0.12);
                    border-color: rgba(7,31,217,0.2) !important;
                }
                .pkg-card:hover .pkg-glow { opacity: 1 !important; }
                .pkg-card:hover .pkg-btn-arrow { transform: translateX(5px); }
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
