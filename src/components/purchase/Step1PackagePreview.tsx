import React from 'react';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import type { Package } from '../../types/package.types';

interface Step1PackagePreviewProps {
    pkg: Package;
    formatPrice: (price: number) => string;
    onNext: () => void;
    btnPrimary: React.CSSProperties;
}

export const Step1PackagePreview: React.FC<Step1PackagePreviewProps> = React.memo(({
    pkg,
    formatPrice,
    onNext,
    btnPrimary
}) => {
    return (
        <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                Xem Lại Gói Dịch Vụ
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                Xác nhận đây là gói bạn muốn đăng ký.
            </p>

            <div style={{
                backgroundColor: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px', padding: '2rem',
                marginBottom: '2rem'
            }}>
                {pkg.isPopular && (
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)',
                        fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
                        padding: '4px 12px', borderRadius: '20px',
                        textTransform: 'uppercase', marginBottom: '1.25rem'
                    }}>
                        <Sparkles size={11} /> Phổ biến nhất
                    </span>
                )}

                <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.35rem' }}>
                    {pkg.name}
                </h3>
                {pkg.description && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                        {pkg.description}
                    </p>
                )}

                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--color-accent)', lineHeight: 1, marginBottom: '0.5rem' }}>
                    {formatPrice(pkg.price)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    VNĐ / Tháng
                </div>

                <div style={{ height: '1px', backgroundColor: 'var(--color-border)', marginBottom: '1.5rem' }} />

                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
                    Quyền lợi bao gồm
                </p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    {pkg.benefits.map((b: string, i: number) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.9rem', color: 'var(--color-text)' }}>
                            <CheckCircle2 size={16} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }} />
                            {b}
                        </li>
                    ))}
                </ul>
            </div>

            <button onClick={onNext} style={{ ...btnPrimary, width: '100%', justifyContent: 'center', padding: '1rem' }}>
                Tiếp tục <ArrowRight size={18} />
            </button>
        </div>
    );
});

Step1PackagePreview.displayName = 'Step1PackagePreview';
