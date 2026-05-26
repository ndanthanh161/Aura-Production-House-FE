import React, { useRef } from 'react';
import {
    ArrowRight,
    CheckCircle2,
    Camera,
    Users,
    Download,
    Award,
    Film,
    Sparkles,
    PlayCircle,
    Eye,
    Zap,
    Star,
    Crown
} from 'lucide-react';
import { Button } from '../ui/Button';
import type { Package } from '../../types/package.types';
import {
    getCinematicSpecs,
    getCinematicPreviewImage,
    getTelemetryData,
    getStoryboardData
} from './helpers';

const tierIcons = [Zap, Star, Crown];

interface CineProjectorStageProps {
    packages: Package[];
    activeIdx: number;
    isFlipped: boolean;
    isFocusLocking: boolean;
    formatPrice: (price: number) => string;
    handleCheckout: (pkg: Package) => void;
}

export const CineProjectorStage: React.FC<CineProjectorStageProps> = React.memo(({
    packages,
    activeIdx,
    isFlipped,
    isFocusLocking,
    formatPrice,
    handleCheckout
}) => {
    // DOM Viewport refs for high-performance direct GPU spotlight updates
    const viewportRef = useRef<HTMLDivElement>(null);

    const activePkg = packages[activeIdx] || packages[0];
    if (!activePkg) return null;

    const activeSpecs = getCinematicSpecs(activePkg.name, activePkg.price);
    const activeTelemetry = getTelemetryData(activeIdx);
    const activeStoryboard = getStoryboardData(activePkg.name);
    const ActiveTierIcon = tierIcons[activeIdx % tierIcons.length];

    // ─── Direct DOM Mutation for High Performance 120 FPS Spotlight ───
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!viewportRef.current) return;
        const rect = viewportRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        // Mutate CSS variables directly to avoid triggering React re-renders!
        viewportRef.current.style.setProperty('--mouse-x', `${x}%`);
        viewportRef.current.style.setProperty('--mouse-y', `${y}%`);
        
        // Also update parent glow if element exists in DOM
        const parentGlow = document.getElementById('ambient-neon-glow');
        if (parentGlow) {
            parentGlow.style.setProperty('--mouse-x', `${x}%`);
            parentGlow.style.setProperty('--mouse-y', `${y}%`);
        }
    };

    const handleMouseLeave = () => {
        if (!viewportRef.current) return;
        viewportRef.current.style.setProperty('--mouse-x', '50%');
        viewportRef.current.style.setProperty('--mouse-y', '50%');
        
        const parentGlow = document.getElementById('ambient-neon-glow');
        if (parentGlow) {
            parentGlow.style.setProperty('--mouse-x', '50%');
            parentGlow.style.setProperty('--mouse-y', '50%');
        }
    };

    return (
        <div
            style={{
                perspective: '1200px',
                maxWidth: '1100px',
                margin: '0 auto',
                minHeight: '620px',
                position: 'relative'
            }}
        >
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    minHeight: '620px',
                    transformStyle: 'preserve-3d', // Necessary for children 3D layering
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
            >
                {/* ==============================================
                    SIDE A: TECHNICAL SPECIFICATIONS (CONFIG)
                    ============================================== */}
                <div
                    ref={viewportRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="cine-stage-viewport"
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        minHeight: '620px',
                        backgroundColor: '#0A0A0A',
                        border: '1px solid rgba(255,255,255,0.06)',
                        backfaceVisibility: 'hidden', // Hides when rotated
                        zIndex: isFlipped ? 1 : 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        overflow: 'hidden'
                    }}
                >
                    {/* Subtly Integrated Atmospheric Cinematic Frame Background */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${getCinematicPreviewImage(activeIdx)})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0.08,
                        mixBlendMode: 'luminosity',
                        filter: 'blur(1px) contrast(1.1) brightness(0.8)',
                        pointerEvents: 'none',
                        zIndex: 0,
                        transition: 'all 0.8s ease'
                    }} />

                    {/* Focus viewfinder corner overlays */}
                    <div style={{ position: 'absolute', inset: '1.5rem', pointerEvents: 'none', zIndex: 3 }}>
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '24px', height: '24px',
                            borderTop: `2px solid ${isFocusLocking ? '#22c55e' : 'rgba(192, 154, 90, 0.45)'}`,
                            borderLeft: `2px solid ${isFocusLocking ? '#22c55e' : 'rgba(192, 154, 90, 0.45)'}`,
                            transform: isFocusLocking ? 'scale(0.85) translate(8px, 8px)' : 'scale(1) translate(0px, 0px)',
                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                        }} />
                        <div style={{
                            position: 'absolute', top: 0, right: 0, width: '24px', height: '24px',
                            borderTop: `2px solid ${isFocusLocking ? '#22c55e' : 'rgba(192, 154, 90, 0.45)'}`,
                            borderRight: `2px solid ${isFocusLocking ? '#22c55e' : 'rgba(192, 154, 90, 0.45)'}`,
                            transform: isFocusLocking ? 'scale(0.85) translate(-8px, 8px)' : 'scale(1) translate(0px, 0px)',
                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                        }} />
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, width: '24px', height: '24px',
                            borderBottom: `2px solid ${isFocusLocking ? '#22c55e' : 'rgba(192, 154, 90, 0.45)'}`,
                            borderLeft: `2px solid ${isFocusLocking ? '#22c55e' : 'rgba(192, 154, 90, 0.45)'}`,
                            transform: isFocusLocking ? 'scale(0.85) translate(8px, -8px)' : 'scale(1) translate(0px, 0px)',
                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                        }} />
                        <div style={{
                            position: 'absolute', bottom: 0, right: 0, width: '24px', height: '24px',
                            borderBottom: `2px solid ${isFocusLocking ? '#22c55e' : 'rgba(192, 154, 90, 0.45)'}`,
                            borderRight: `2px solid ${isFocusLocking ? '#22c55e' : 'rgba(192, 154, 90, 0.45)'}`,
                            transform: isFocusLocking ? 'scale(0.85) translate(-8px, -8px)' : 'scale(1) translate(0px, 0px)',
                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                        }} />
                    </div>

                    {/* HUD Letterbox Top */}
                    <div style={{
                        height: '50px',
                        backgroundColor: '#000000',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0 2.5rem',
                        zIndex: 4,
                        position: 'relative'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="rec-blinking-dot" style={{
                                width: '8px',
                                height: '8px',
                                backgroundColor: isFocusLocking ? '#22c55e' : '#ef4444',
                                borderRadius: '50%',
                                boxShadow: isFocusLocking ? '0 0 8px #22c55e' : 'none',
                                transition: 'all 0.3s ease'
                            }} />
                            <span style={{
                                fontSize: '0.65rem',
                                color: isFocusLocking ? '#22c55e' : '#ef4444',
                                fontWeight: 900,
                                letterSpacing: '0.2em',
                                transition: 'all 0.3s ease'
                            }}>
                                {isFocusLocking ? 'LOCKING' : 'REC'}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#CCCCCC', fontFamily: 'monospace', marginLeft: '12px', letterSpacing: '0.05em' }}>
                                TC 00:0{activeIdx + 1}:18:24
                            </span>
                        </div>
                        <span style={{
                            fontSize: '0.6rem',
                            color: isFocusLocking ? '#22c55e' : 'rgba(255,255,255,0.3)',
                            letterSpacing: '0.25em',
                            fontWeight: 800,
                            transition: 'all 0.3s ease'
                        }} className="viewport-hud-title">
                            {isFocusLocking ? '[ FOCUS LOCKING... ]' : '[ FOCUS LOCK ON ]'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Film size={12} style={{ color: '#C09A5A' }} />
                            <span style={{ fontSize: '0.65rem', color: '#C09A5A', fontWeight: 800, fontFamily: 'monospace' }}>
                                {activeSpecs?.resolution.split(' ')[0]} RAW
                            </span>
                        </div>
                    </div>

                    {/* Viewport Core Content Grid */}
                    <div className="cine-stage-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: '1.25fr 1fr',
                        position: 'relative',
                        zIndex: 2,
                        flex: 1
                    }}>
                        {/* Left Side: Specs & Metadata */}
                        <div style={{
                            padding: '3rem 3rem 2rem',
                            borderRight: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        backgroundColor: 'rgba(192, 154, 90, 0.1)',
                                        border: '1px solid rgba(192, 154, 90, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <ActiveTierIcon size={16} style={{ color: '#C09A5A' }} />
                                    </div>
                                    <span style={{ fontSize: '0.7rem', color: '#C09A5A', letterSpacing: '0.2em', fontWeight: 800, textTransform: 'uppercase' }}>
                                        TECHNICAL HARDWARE SPECS
                                    </span>
                                </div>

                                <h2 style={{
                                    fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
                                    fontFamily: 'var(--font-display)',
                                    fontWeight: 900,
                                    color: '#FFFFFF',
                                    textTransform: 'uppercase',
                                    marginBottom: '1rem',
                                    letterSpacing: '0.02em',
                                    lineHeight: 1.15
                                }}>
                                    {activePkg.name}
                                </h2>

                                <p style={{
                                    fontSize: '0.9rem',
                                    color: 'rgba(255,255,255,0.5)',
                                    lineHeight: 1.6,
                                    marginBottom: '2rem',
                                    maxWidth: '500px'
                                }}>
                                    {activePkg.description}
                                </p>

                                {/* Tech Specs block */}
                                {activeSpecs && (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                        gap: '1.5rem',
                                        borderTop: '1px solid rgba(255,255,255,0.06)',
                                        paddingTop: '2rem',
                                        marginBottom: '2rem'
                                    }} className="tech-specs-grid">
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                            <Camera size={16} style={{ color: '#C09A5A', marginTop: '3px', flexShrink: 0 }} />
                                            <div>
                                                <span style={{ display: 'block', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em' }}>MÁY QUAY CHÍNH</span>
                                                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{activeSpecs.camera}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                            <Users size={16} style={{ color: '#C09A5A', marginTop: '3px', flexShrink: 0 }} />
                                            <div>
                                                <span style={{ display: 'block', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em' }}>ĐỘI NGŨ SẢN XUẤT</span>
                                                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{activeSpecs.crew}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                            <Download size={16} style={{ color: '#C09A5A', marginTop: '3px', flexShrink: 0 }} />
                                            <div>
                                                <span style={{ display: 'block', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em' }}>BÀN GIAO FILE</span>
                                                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{activeSpecs.rawFootage}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                            <Film size={16} style={{ color: '#C09A5A', marginTop: '3px', flexShrink: 0 }} />
                                            <div>
                                                <span style={{ display: 'block', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em' }}>CHẤT LƯỢNG HÌNH ẢNH</span>
                                                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{activeSpecs.resolution}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                            <Sparkles size={16} style={{ color: '#C09A5A', marginTop: '3px', flexShrink: 0 }} />
                                            <div>
                                                <span style={{ display: 'block', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em' }}>THIẾT BỊ CHIẾU SÁNG</span>
                                                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{activeSpecs.lighting}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                            <Award size={16} style={{ color: '#C09A5A', marginTop: '3px', flexShrink: 0 }} />
                                            <div>
                                                <span style={{ display: 'block', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em' }}>THỜI GIAN BÀN GIAO</span>
                                                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{activeSpecs.deliveryTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Price tag */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                borderTop: '1px solid rgba(255,255,255,0.06)',
                                paddingTop: '1.5rem'
                            }} className="viewport-price-section">
                                <span style={{ display: 'block', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.15em', marginBottom: '0.2rem' }}>
                                    CHI PHÍ HỢP ĐỒNG LIÊN KẾT
                                </span>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                    <span className="price-gradient" style={{
                                        fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                                        fontWeight: 900,
                                        fontFamily: 'monospace',
                                        lineHeight: 1
                                    }}>
                                        {formatPrice(activePkg.price)}
                                    </span>
                                    <span style={{
                                        fontSize: '0.7rem',
                                        color: 'rgba(255,255,255,0.3)',
                                        fontFamily: 'monospace',
                                        fontWeight: 600
                                    }}>
                                        VND
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Checklist & checkout */}
                        <div style={{
                            padding: '3rem 3rem 2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            backgroundColor: 'rgba(12,12,12,0.95)',
                            backdropFilter: 'blur(5px)',
                            zIndex: 2
                        }}>
                            <div>
                                <span style={{
                                    display: 'block',
                                    fontSize: '0.65rem',
                                    color: 'rgba(255,255,255,0.3)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.18em',
                                    fontWeight: 800,
                                    marginBottom: '1.8rem',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    paddingBottom: '0.8rem'
                                }}>
                                    PRODUCTION CHECKLIST
                                </span>

                                <ul style={{ listStyle: 'none', margin: '0 0 2.5rem', padding: 0 }}>
                                    {activePkg.benefits.map((benefit, i) => (
                                        <li key={i} style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '12px',
                                            marginBottom: '1rem',
                                            color: 'rgba(255,255,255,0.75)',
                                            fontSize: '0.82rem',
                                            lineHeight: 1.5
                                        }}>
                                            <CheckCircle2
                                                size={15}
                                                style={{
                                                    color: '#C09A5A',
                                                    flexShrink: 0,
                                                    marginTop: '2px'
                                                }}
                                            />
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div style={{ marginTop: '2rem' }}>
                                <Button
                                    onClick={() => handleCheckout(activePkg)}
                                    style={{
                                        width: '100%',
                                        padding: '1.4rem 2rem',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 0,
                                        backgroundColor: '#C09A5A',
                                        color: '#050505',
                                        border: 'none',
                                        fontSize: '0.85rem',
                                        fontWeight: 900,
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                        boxShadow: '0 10px 30px rgba(192, 154, 90, 0.25)'
                                    }}
                                    className="viewport-cta-btn"
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        KHỞI TẠO DỰ ÁN <ArrowRight size={16} className="viewport-cta-arrow" style={{ transition: 'transform 0.3s ease' }} />
                                    </div>
                                </Button>
                                <span style={{
                                    display: 'block',
                                    textAlign: 'center',
                                    fontSize: '0.6rem',
                                    color: 'rgba(255,255,255,0.25)',
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    marginTop: '1rem',
                                    fontWeight: 600
                                }}>
                                    * Tiến hành ký kết hợp đồng chuẩn hóa điện ảnh
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* HUD Letterbox Bottom */}
                    <div style={{
                        height: '40px',
                        backgroundColor: '#000000',
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0 2.5rem',
                        zIndex: 4,
                        position: 'relative'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                                LENS: {activeSpecs?.lenses.split('&')[0].split('or')[0].trim()}
                            </span>
                            <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                                FPS: 24.00
                            </span>
                        </div>
                        <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', fontFamily: 'monospace' }}>
                            ISO: {activeTelemetry?.iso} | SHUTTER: {activeTelemetry?.shutter} | FOCUS: {activeTelemetry?.focal}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Award size={10} style={{ color: '#C09A5A' }} />
                            <span style={{ fontSize: '0.55rem', color: '#C09A5A', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                                AURA OPTICS
                            </span>
                        </div>
                    </div>
                </div>

                {/* ==============================================
                    SIDE B: CREATIVE STORYBOARD (FLIPPED BACK)
                    ============================================== */}
                <div
                    className="cine-stage-viewport"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: '#070707',
                        border: '1px solid rgba(192,154,90,0.25)',
                        boxShadow: 'inset 0 0 45px rgba(192,154,90,0.03), 0 30px 60px rgba(0,0,0,0.9)',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)', // Pre-rotated back side
                        zIndex: isFlipped ? 2 : 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        overflow: 'hidden'
                    }}
                >
                    {/* Viewfinder focus locked corners on back side too */}
                    <div style={{ position: 'absolute', inset: '1.5rem', pointerEvents: 'none', zIndex: 3 }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '24px', height: '24px', borderTop: '2px solid rgba(192, 154, 90, 0.45)', borderLeft: '2px solid rgba(192, 154, 90, 0.45)' }} />
                        <div style={{ position: 'absolute', top: 0, right: 0, width: '24px', height: '24px', borderTop: '2px solid rgba(192, 154, 90, 0.45)', borderRight: '2px solid rgba(192, 154, 90, 0.45)' }} />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '24px', height: '24px', borderBottom: '2px solid rgba(192, 154, 90, 0.45)', borderLeft: '2px solid rgba(192, 154, 90, 0.45)' }} />
                        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '24px', height: '24px', borderBottom: '2px solid rgba(192, 154, 90, 0.45)', borderRight: '2px solid rgba(192, 154, 90, 0.45)' }} />
                    </div>

                    {/* HUD Letterbox Top */}
                    <div style={{
                        height: '50px',
                        backgroundColor: '#000000',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0 2.5rem',
                        zIndex: 4,
                        position: 'relative'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '8px', height: '8px', backgroundColor: '#22c55e', borderRadius: '50%', boxShadow: '0 0 8px #22c55e' }} />
                            <span style={{ fontSize: '0.65rem', color: '#22c55e', fontWeight: 900, letterSpacing: '0.2em' }}>STORYBOARD</span>
                            <span style={{ fontSize: '0.7rem', color: '#CCCCCC', fontFamily: 'monospace', marginLeft: '12px', letterSpacing: '0.05em' }}>
                                TC 00:0{activeIdx + 1}:45:00
                            </span>
                        </div>
                        <span style={{ fontSize: '0.6rem', color: '#C09A5A', letterSpacing: '0.25em', fontWeight: 800 }}>
                            CREATIVE STORYBOARD MOOD
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Sparkles size={12} style={{ color: '#C09A5A' }} />
                            <span style={{ fontSize: '0.65rem', color: '#C09A5A', fontWeight: 800, fontFamily: 'monospace' }}>
                                CONCEPT ACTIVE
                            </span>
                        </div>
                    </div>

                    {/* Viewport Core Flipped Grid */}
                    <div className="cine-stage-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: '1.25fr 1fr',
                        position: 'relative',
                        zIndex: 2,
                        flex: 1
                    }}>
                        {/* Left Column: Creative Moodboard Narrative */}
                        <div style={{
                            padding: '3rem 3rem 2rem',
                            borderRight: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <span style={{ display: 'block', fontSize: '0.7rem', color: '#C09A5A', letterSpacing: '0.2em', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.2rem' }}>
                                    🎬 PHÂN CẢNH KỊCH BẢN / STORYBOARD
                                </span>

                                <h3 style={{
                                    fontSize: '1.5rem',
                                    fontFamily: 'var(--font-display)',
                                    fontWeight: 900,
                                    color: '#FFFFFF',
                                    textTransform: 'uppercase',
                                    marginBottom: '1rem',
                                    letterSpacing: '0.02em',
                                    lineHeight: 1.25
                                }}>
                                    {activeStoryboard?.title}
                                </h3>

                                <p style={{
                                    fontSize: '0.88rem',
                                    color: 'rgba(255,255,255,0.5)',
                                    lineHeight: 1.6,
                                    marginBottom: '2rem',
                                    maxWidth: '500px'
                                }}>
                                    {activeStoryboard?.desc}
                                </p>

                                {/* Storyboard timeline scenes */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
                                    {activeStoryboard?.scenes.map((scene, sIdx) => (
                                        <div key={sIdx} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                             <div style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                backgroundColor: 'rgba(192, 154, 90, 0.1)',
                                                border: '1px solid rgba(192, 154, 90, 0.3)',
                                                color: '#C09A5A',
                                                fontSize: '0.65rem',
                                                fontFamily: 'monospace',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                                marginTop: '2px'
                                            }}>
                                                {sIdx + 1}
                                            </div>
                                            <div>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C09A5A', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{scene.label}</span>
                                                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4, display: 'block', marginTop: '2px' }}>{scene.detail}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Suitability and Checkout */}
                        <div style={{
                            padding: '3rem 3rem 2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            backgroundColor: 'rgba(10,10,10,0.98)',
                            zIndex: 2
                        }}>
                            <div>
                                <span style={{
                                    display: 'block',
                                    fontSize: '0.65rem',
                                    color: 'rgba(255,255,255,0.3)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.18em',
                                    fontWeight: 800,
                                    marginBottom: '1.8rem',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    paddingBottom: '0.8rem'
                                }}>
                                    PHÂN KHÚC PHÙ HỢP
                                </span>

                                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                    {activeStoryboard?.suitability.map((item, i) => (
                                        <li key={i} style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '12px',
                                            marginBottom: '1rem',
                                            color: 'rgba(255,255,255,0.75)',
                                            fontSize: '0.82rem',
                                            lineHeight: 1.5
                                        }}>
                                            <PlayCircle
                                                size={15}
                                                style={{
                                                    color: '#C09A5A',
                                                    flexShrink: 0,
                                                    marginTop: '2px'
                                                }}
                                            />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div style={{ marginTop: '2rem' }}>
                                <Button
                                    onClick={() => handleCheckout(activePkg)}
                                    style={{
                                        width: '100%',
                                        padding: '1.4rem 2rem',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 0,
                                        backgroundColor: 'transparent',
                                        color: '#FFFFFF',
                                        border: '1px solid rgba(192, 154, 90, 0.4)',
                                        fontSize: '0.85rem',
                                        fontWeight: 900,
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                    }}
                                    className="viewport-cta-btn-flipped"
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        BẮT ĐẦU KỊCH BẢN <ArrowRight size={16} className="viewport-cta-arrow" style={{ transition: 'transform 0.3s ease' }} />
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* HUD Letterbox Bottom */}
                    <div style={{
                        height: '40px',
                        backgroundColor: '#000000',
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0 2.5rem',
                        zIndex: 4,
                        position: 'relative'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                                LUT SPACE: {activeTelemetry?.color}
                            </span>
                            <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                                EXPOSURE: {activeTelemetry?.exposure}
                            </span>
                        </div>
                        <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', fontFamily: 'monospace' }}>
                            DIRECTOR EDIT STAGE // SCENARIO MOOD
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Eye size={10} style={{ color: '#C09A5A' }} />
                            <span style={{ fontSize: '0.55rem', color: '#C09A5A', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                                AURA CINE-LENS
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

CineProjectorStage.displayName = 'CineProjectorStage';
export default CineProjectorStage;
