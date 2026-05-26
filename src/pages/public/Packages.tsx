import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Loader2,
    AlertCircle,
    Film
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { packageApi } from '../../services/packageApi';
import type { Package } from '../../types/package.types';

// ─── SUB-COMPONENTS IMPORTS ──────────────────────────────────────
import { getAmbientGlowColor } from '../../components/packages/helpers';
import { LensControlDial } from '../../components/packages/LensControlDial';
import { CineProjectorStage } from '../../components/packages/CineProjectorStage';
import { SpecsMatrixTable } from '../../components/packages/SpecsMatrixTable';
import { TrustSection } from '../../components/packages/TrustSection';

const Packages: React.FC = () => {
    const navigate = useNavigate();
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeIdx, setActiveIdx] = useState(0);

    // Interactive theater stage flips
    const [isFocusLocking, setIsFocusLocking] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        packageApi.getAll(true)
            .then(res => {
                const pkgs = res.data || [];
                setPackages(pkgs);
                const popIdx = pkgs.findIndex(p => p.isPopular);
                if (popIdx !== -1) {
                    setActiveIdx(popIdx);
                }
            })
            .catch(() => setError('Không thể tải danh sách gói dịch vụ.'))
            .finally(() => setLoading(false));
    }, []);

    // Focus Lock indicator animations
    useEffect(() => {
        if (packages.length > 0) {
            setIsFocusLocking(true);
            const timer = setTimeout(() => {
                setIsFocusLocking(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [activeIdx, packages]);

    const formatPrice = useCallback((price: number) => {
        return price.toLocaleString('vi-VN');
    }, []);

    const handleCheckout = useCallback((pkg: Package) => {
        navigate(`/purchase/${pkg.id}`);
    }, [navigate]);

    return (
        <div style={{ paddingTop: '80px', backgroundColor: '#050505', minHeight: '100vh', color: '#FFFFFF', position: 'relative', overflowX: 'hidden' }}>

            {/* Film Grain atmospheric overlay */}
            <div style={{
                position: 'fixed',
                inset: 0,
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.012\'/%3E%3C/svg%3E")',
                pointerEvents: 'none',
                zIndex: 99
            }} />

            {/* Neon Bleed / Ambient Glow behind theater viewport */}
            <div 
                id="ambient-neon-glow"
                style={{
                    position: 'absolute',
                    top: '38%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '1200px',
                    height: '900px',
                    background: getAmbientGlowColor(activeIdx),
                    transition: 'background 0.5s ease',
                    pointerEvents: 'none',
                    zIndex: 0
                }} 
            />

            {/* Hero Header */}
            <section style={{
                position: 'relative',
                padding: 'clamp(4rem, 8vw, 6rem) 0 1rem',
                textAlign: 'center',
                overflow: 'hidden',
                zIndex: 1
            }}>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span style={{
                            color: '#C09A5A',
                            textTransform: 'uppercase',
                            letterSpacing: '0.4em',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            display: 'block',
                            marginBottom: '1.5rem'
                        }}>
                            THE CINE-THEATRE EXPERIENCE
                        </span>
                        <h1 style={{
                            fontSize: 'clamp(2.2rem, 5vw, 4rem)',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            color: '#FFFFFF',
                            margin: '0 0 1.5rem',
                            lineHeight: 1.1,
                            letterSpacing: '0.02em'
                        }}>
                            BẢNG GIÁ DỊCH VỤ SẢN XUẤT AURA
                        </h1>
                        <p style={{
                            color: 'rgba(255,255,255,0.45)',
                            fontSize: '0.95rem',
                            maxWidth: '650px',
                            margin: '0 auto',
                            lineHeight: 1.7
                        }}>
                            Hệ thống màn chiếu điện ảnh tương tác thông minh. Hãy xoay vòng ống kính tiêu cự phía dưới để khám phá cấu hình phần cứng và kịch bản thiết kế.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Interactive Stage Section */}
            <section style={{ padding: '1rem 0 6rem', position: 'relative', zIndex: 2 }}>
                <div className="container">

                    {loading && (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '8rem 0' }}>
                            <Loader2 size={36} style={{ animation: 'spin 1.5s linear infinite', color: '#C09A5A' }} />
                        </div>
                    )}

                    {error && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', padding: '5rem 0', color: '#ef4444' }}>
                            <AlertCircle size={20} /> {error}
                        </div>
                    )}

                    {!loading && !error && packages.length > 0 && (
                        <>
                            {/* --- THE LENS CONTROL CENTER / FOCUS SCALE CONTROLLER --- */}
                            <LensControlDial
                                packages={packages}
                                activeIdx={activeIdx}
                                setActiveIdx={setActiveIdx}
                            />

                            {/* --- CLAPPERBOARD 3D FLIP SWITCH TRIGGER --- */}
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem', zIndex: 10, position: 'relative' }}>
                                <button
                                    onClick={() => setIsFlipped(!isFlipped)}
                                    style={{
                                        background: 'none',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        backgroundColor: '#121212',
                                        border: '1px solid rgba(192, 154, 90, 0.3)',
                                        padding: '0.8rem 1.6rem',
                                        color: '#C09A5A',
                                        fontSize: '0.75rem',
                                        fontWeight: 800,
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                    }}
                                    className="clapper-btn"
                                >
                                    <Film size={14} style={{ transform: isFlipped ? 'rotate(15deg)' : 'rotate(0deg)', transition: 'transform 0.4s ease' }} />
                                    {isFlipped ? 'XEM CẤU HÌNH THIẾT BỊ (TECH SPECS)' : 'XEM KỊCH BẢN CẢM HỨNG (STORYBOARD)'}
                                </button>
                            </div>

                            {/* --- 21:9 WIDESCREEN PROJECTOR VIEWPORT SCREEN --- */}
                            <CineProjectorStage
                                packages={packages}
                                activeIdx={activeIdx}
                                isFlipped={isFlipped}
                                isFocusLocking={isFocusLocking}
                                formatPrice={formatPrice}
                                handleCheckout={handleCheckout}
                            />

                            {/* --- INTERACTIVE COMPARISON SPEC MATRIX --- */}
                            <SpecsMatrixTable
                                packages={packages}
                                activeIdx={activeIdx}
                                handleCheckout={handleCheckout}
                                formatPrice={formatPrice}
                            />
                        </>
                    )}
                </div>
            </section>

            {/* Bottom Trust Section */}
            <TrustSection />

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                
                @keyframes blinking {
                    0% { opacity: 0.2; }
                    50% { opacity: 1; }
                    100% { opacity: 0.2; }
                }

                .rec-blinking-dot {
                    animation: blinking 1.5s infinite;
                }

                .price-gradient {
                    background: linear-gradient(135deg, #FFFFFF 30%, #C09A5A 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .cine-stage-viewport {
                    box-shadow: 0 40px 100px rgba(0,0,0,0.95);
                    transition: border-color 0.5s ease, box-shadow 0.5s ease;
                }

                .clapper-btn:hover {
                    background-color: #C09A5A !important;
                    color: #000000 !important;
                    border-color: #C09A5A !important;
                    box-shadow: 0 0 20px rgba(192, 154, 90, 0.4) !important;
                }

                .viewport-cta-btn:hover {
                    background-color: #FFFFFF !important;
                    color: #000000 !important;
                    box-shadow: 0 15px 40px rgba(255, 255, 255, 0.15) !important;
                }

                .viewport-cta-btn:hover .viewport-cta-arrow {
                    transform: translateX(6px);
                }

                .viewport-cta-btn-flipped:hover {
                    background-color: #C09A5A !important;
                    color: #000000 !important;
                    border-color: #C09A5A !important;
                    box-shadow: 0 10px 30px rgba(192, 154, 90, 0.3) !important;
                }

                .viewport-cta-btn-flipped:hover .viewport-cta-arrow {
                    transform: translateX(6px);
                }

                .matrix-row-hover:hover {
                    background-color: rgba(192, 154, 90, 0.02) !important;
                }

                .matrix-row-hover:hover td {
                    color: #FFFFFF !important;
                }

                /* Mobile/Responsive styling */
                @media (max-width: 900px) {
                    .cine-stage-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .cine-stage-viewport {
                        border-radius: 0;
                    }
                    .tech-specs-grid {
                        grid-template-columns: 1fr !important;
                        gap: 1.2rem !important;
                    }
                    .viewport-hud-title {
                        display: none !important;
                    }
                    .viewport-price-section {
                        margin-top: 1.5rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Packages;
