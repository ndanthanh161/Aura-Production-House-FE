import React from 'react';
import { 
    Clock, QrCode, Copy, RefreshCw, Loader2, ArrowLeft, AlertCircle, ShieldCheck 
} from 'lucide-react';
import type { Package } from '../../types/package.types';
import type { Project } from '../../types/project.types';
import type { SePayInfo } from '../../services/paymentApi';

interface Step3PaymentConfirmProps {
    pkg: Package;
    projectName: string;
    description: string;
    user: any;
    createdProject: Project | null;
    sepayInfo: SePayInfo | null;
    timeLeft: number;
    formatTime: (seconds: number) => string;
    formatPrice: (price: number) => string;
    getVietQRUrl: () => string;
    copyToClipboard: (text: string) => void;
    creating: boolean;
    createError: string;
    handleFinalize: () => void;
    setShowCancelModal: (val: boolean) => void;
    onPrev: () => void;
    btnPrimary: React.CSSProperties;
    btnOutline: React.CSSProperties;
    labelStyle: React.CSSProperties;
}

export const Step3PaymentConfirm: React.FC<Step3PaymentConfirmProps> = React.memo(({
    pkg,
    projectName,
    description,
    user,
    createdProject,
    sepayInfo,
    timeLeft,
    formatTime,
    formatPrice,
    getVietQRUrl,
    copyToClipboard,
    creating,
    createError,
    handleFinalize,
    setShowCancelModal,
    onPrev,
    btnPrimary,
    btnOutline,
    labelStyle
}) => {
    return (
        <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                Xác Nhận & Thanh Toán
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                Kiểm tra lại thông tin và thực hiện thanh toán qua VietQR.
            </p>

            <div style={{
                backgroundColor: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px', overflow: 'hidden', marginBottom: '1.5rem'
            }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-accent)', marginBottom: '1.5rem' }}>Tóm tắt đơn hàng</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Dự án:</span>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text)', textAlign: 'right' }}>{projectName || `Dự án ${pkg.name}`}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Gói dịch vụ:</span>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text)', textAlign: 'right' }}>{pkg.name}</span>
                        </div>
                        {description && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Yêu cầu:</span>
                                <span style={{ fontSize: '0.85rem', color: 'var(--color-text)', fontStyle: 'italic', backgroundColor: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '8px' }}>
                                    "{description}"
                                </span>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px dashed var(--color-border)' }}>
                            <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)' }}>Tổng thanh toán:</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-accent)' }}>{formatPrice(pkg.price)}</span>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '1rem 1.5rem', backgroundColor: 'rgba(255,255,255,0.01)', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '2rem' }}>
                    <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '2px' }}>Khách hàng</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.fullName || 'Khách hàng Aura'}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '2px' }}>Email liên hệ</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.email}</div>
                    </div>
                </div>

                {createdProject ? (
                    <div style={{ padding: '2rem', borderTop: '1px solid var(--color-border)', textAlign: 'center' }}>
                        {/* Step Guide */}
                        <div className="qr-steps" style={{ display: 'flex', gap: '10px', marginBottom: '2rem', textAlign: 'left' }}>
                            {[
                                { step: 1, text: 'Quét mã QR' },
                                { step: 2, text: 'Kiểm tra tiền' },
                                { step: 3, text: 'Xác nhận' }
                            ].map((s) => (
                                <div key={s.step} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                                    <div style={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: '0.7rem', marginBottom: '4px' }}>BƯỚC {s.step}</div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 500 }}>{s.text}</div>
                                </div>
                            ))}
                        </div>

                        <p style={{ ...labelStyle, color: timeLeft > 0 ? 'var(--color-accent)' : '#ef4444', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <QrCode size={16} /> 
                            {timeLeft > 0 ? `Mã QR hết hạn sau: ${formatTime(timeLeft)}` : 'Mã QR đã hết hạn'}
                        </p>
                        
                        <div style={{ 
                            backgroundColor: '#fff', padding: '15px', borderRadius: '12px', 
                            display: 'inline-block', border: '1px solid var(--color-border)',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.12)', marginBottom: '1.5rem',
                            position: 'relative',
                            opacity: timeLeft > 0 ? 1 : 0.3,
                            filter: timeLeft > 0 ? 'none' : 'grayscale(1)'
                        }}>
                            <img src={getVietQRUrl()} alt="VietQR" style={{ width: '220px', height: '220px', display: 'block' }} />
                            {timeLeft <= 0 && (
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 700, fontSize: '0.9rem', backgroundColor: 'rgba(255,255,255,0.6)' }}>
                                    Hết hạn
                                </div>
                            )}
                        </div>

                        {/* Payment Info Table */}
                        <div style={{ textAlign: 'left', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '1.5rem', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Ngân hàng:</div>
                                <div style={{ fontWeight: 700, color: 'var(--color-accent)', fontSize: '1.125rem' }}>TPBank</div>
                            </div>
                            
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Chủ tài khoản:</div>
                                <div style={{ fontWeight: 700, color: 'var(--color-text)', textTransform: 'uppercase', fontSize: '1rem' }}>{sepayInfo?.accountName}</div>
                            </div>
                            
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Số tài khoản:</div>
                                <div style={{ fontWeight: 700, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.125rem' }}>
                                    {sepayInfo?.accountNumber}
                                    <button 
                                        onClick={() => copyToClipboard(sepayInfo?.accountNumber || '')}
                                        style={{ background: 'rgba(173,255,0,0.1)', border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                    >
                                        <Copy size={14} style={{ color: 'var(--color-accent)' }} />
                                    </button>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Nội dung chuyển khoản:</div>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                    <div style={{ fontWeight: 700, color: 'var(--color-accent)', fontSize: '1rem', flex: 1, wordBreak: 'break-all', lineHeight: 1.4 }}>
                                        AURA {createdProject.id.toUpperCase()}
                                    </div>
                                    <button 
                                        onClick={() => copyToClipboard(`AURA ${createdProject.id.toUpperCase()}`)}
                                        style={{ background: 'rgba(173,255,0,0.1)', border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', marginTop: '2px' }}
                                    >
                                        <Copy size={14} style={{ color: 'var(--color-accent)' }} />
                                    </button>
                                </div>
                            </div>

                            <p style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: '#888', fontStyle: 'italic', lineHeight: 1.4 }}>
                                * Quan trọng: Vui lòng giữ nguyên nội dung chuyển khoản để hệ thống tự động xác nhận đơn hàng.
                            </p>
                        </div>

                        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                            {timeLeft > 0 ? (
                                <>
                                    <RefreshCw size={14} style={{ animation: 'spin 2s linear infinite' }} />
                                    Đang chờ hệ thống xác nhận thanh toán...
                                </>
                            ) : (
                                <span style={{ color: '#ef4444' }}>Vui lòng nhấn Hủy và tạo lại để lấy mã mới.</span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--color-border)' }}>
                        <Clock size={32} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                            Nhấn nút dưới đây để khởi tạo dự án và lấy mã QR thanh toán.
                        </p>
                    </div>
                )}
            </div>

            <div style={{
                display: 'flex', alignItems: 'flex-start', gap: '10px',
                backgroundColor: 'rgba(173,255,0,0.06)', borderRadius: '10px', padding: '1rem',
                marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)'
            }}>
                <ShieldCheck size={16} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                Hệ thống tự động xác nhận ngay sau khi bạn chuyển khoản thành công.
            </div>

            {createError && (
                <div style={{ color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                    <AlertCircle size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> {createError}
                </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
                {!createdProject && (
                    <button onClick={onPrev} disabled={creating} style={{ ...btnOutline, flex: '0 0 auto', padding: '1rem 1.5rem' }}>
                        <ArrowLeft size={16} />
                    </button>
                )}
                {!createdProject ? (
                    <button onClick={handleFinalize} disabled={creating} style={{ ...btnPrimary, flex: 1, justifyContent: 'center', padding: '1rem' }}>
                        {creating ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : 'Đặt lịch & Lấy mã QR'}
                    </button>
                ) : (
                    <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                        <button onClick={() => setShowCancelModal(true)} style={{ ...btnOutline, flex: 1, color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}>
                            Hủy thanh toán
                        </button>
                        <button onClick={() => window.location.reload()} style={{ ...btnOutline, flex: 1, justifyContent: 'center', padding: '1rem' }}>
                            <RefreshCw size={18} /> Kiểm tra lại
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
});

Step3PaymentConfirm.displayName = 'Step3PaymentConfirm';
