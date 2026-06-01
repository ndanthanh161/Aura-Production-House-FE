import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Unlock } from 'lucide-react';

export const VaultLockedScreen: React.FC = React.memo(() => {
    const navigate = useNavigate();

    return (
        <motion.div
            key="templates-locked"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '5rem 2rem',
                backgroundColor: 'var(--color-bg-secondary)',
                borderRadius: '40px',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
                maxWidth: '800px',
                margin: '2rem auto',
                backgroundImage: 'radial-gradient(circle at center, rgba(192, 154, 90, 0.05), transparent)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div className="viewfinder-corner top-left" />
            <div className="viewfinder-corner top-right" />
            <div className="viewfinder-corner bottom-left" />
            <div className="viewfinder-corner bottom-right" />

            <div style={{
                position: 'absolute',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                backgroundColor: 'rgba(192, 154, 90, 0.02)',
                filter: 'blur(60px)',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1
            }} />

            <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <motion.div
                    style={{
                        marginBottom: '2.5rem',
                        cursor: 'pointer'
                    }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate('/packages')}
                >
                    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="100" cy="100" r="85" stroke="#C09A5A" strokeWidth="2" strokeDasharray="6 6" opacity="0.3" />
                        <circle cx="100" cy="100" r="75" stroke="#C09A5A" strokeWidth="1" opacity="0.5" />
                        <circle cx="100" cy="100" r="65" stroke="#C09A5A" strokeWidth="4" strokeDasharray="40 10 20 10" className="vault-dial" />
                        <circle cx="100" cy="100" r="45" fill="rgba(20, 20, 20, 0.95)" stroke="#C09A5A" strokeWidth="3" />
                        <path d="M100 20 V35 M100 165 V180 M20 100 H35 M165 100 H180" stroke="#C09A5A" strokeWidth="2" />
                        <g transform="translate(85, 82) scale(1.2)">
                            <path d="M18 11V7C18 3.7 15.3 1 12 1C8.7 1 6 3.7 6 7V11" stroke="#C09A5A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <rect x="2" y="11" width="20" height="14" rx="4" fill="rgba(20, 20, 20, 0.95)" stroke="#C09A5A" strokeWidth="2" />
                            <circle cx="12" cy="18" r="2" fill="#C09A5A" />
                        </g>
                    </svg>
                </motion.div>

                <span style={{
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    letterSpacing: '0.3em',
                    color: 'var(--color-accent)',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem'
                }}>
                    VIP Access Required
                </span>
                <h2 style={{
                    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    color: '#C09A5A',
                    marginBottom: '1rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                }}>
                    Kho Tài Liệu Bảo Mật
                </h2>

                <p style={{
                    color: 'var(--color-text-muted)',
                    fontSize: '1rem',
                    lineHeight: 1.7,
                    maxWidth: '520px',
                    marginBottom: '2.5rem'
                }}>
                    Kho kịch bản concept độc quyền, hợp đồng dịch vụ chuẩn studio AURA và các tài nguyên biểu mẫu cao cấp chỉ dành riêng cho hội viên VIP.
                </p>

                {/* Perks comparison grid inside locked screen */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.25rem',
                    width: '100%',
                    maxWidth: '700px',
                    marginBottom: '3rem',
                    textAlign: 'left'
                }}>
                    <div style={{
                        backgroundColor: 'rgba(255,255,255,0.01)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '20px',
                        padding: '1.25rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px'
                    }}>
                        <Lock size={16} style={{ color: 'var(--color-accent)', marginTop: '3px' }} />
                        <div>
                            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text)', margin: '0 0 4px 0' }}>MULTIPLATFORM TEMPLATES</h4>
                            <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', margin: 0 }}>Kho thư viện mẫu (Templates) thiết kế cho đa nền tảng (Facebook, Instagram, TikTok).</p>
                        </div>
                    </div>
                    <div style={{
                        backgroundColor: 'rgba(255,255,255,0.01)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '20px',
                        padding: '1.25rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px'
                    }}>
                        <Lock size={16} style={{ color: 'var(--color-accent)', marginTop: '3px' }} />
                        <div>
                            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text)', margin: '0 0 4px 0' }}>CONTENT PLAN TEMPLATES</h4>
                            <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', margin: 0 }}>Mẫu kế hoạch nội dung (Content Plan) theo ngách (Bất động sản, Mỹ phẩm, F&B...).</p>
                        </div>
                    </div>
                    <div style={{
                        backgroundColor: 'rgba(255,255,255,0.01)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '20px',
                        padding: '1.25rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px'
                    }}>
                        <Lock size={16} style={{ color: 'var(--color-accent)', marginTop: '3px' }} />
                        <div>
                            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text)', margin: '0 0 4px 0' }}>SCRIPTING TEMPLATES</h4>
                            <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', margin: 0 }}>Kịch bản quay dựng (Scripting templates) có sẵn khung sườn.</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/packages')}
                    className="shimmer-btn"
                    style={{
                        padding: '1.1rem 3rem',
                        background: 'linear-gradient(135deg, #CF9F2E 0%, #D4AF37 50%, #F3E5AB 100%)',
                        color: 'black',
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        letterSpacing: '0.08em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        borderRadius: '8px',
                        boxShadow: '0 12px 30px rgba(212,175,55,0.3)',
                        border: 'none',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Unlock size={16} /> Mở Khóa Kho Tài Liệu Ngay
                </button>
            </div>
        </motion.div>
    );
});

VaultLockedScreen.displayName = 'VaultLockedScreen';
export default VaultLockedScreen;
