import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Step2ProjectInfoProps {
    pkgName: string;
    projectName: string;
    setProjectName: (val: string) => void;
    description: string;
    setDescription: (val: string) => void;
    onPrev: () => void;
    onNext: () => void;
    btnPrimary: React.CSSProperties;
    btnOutline: React.CSSProperties;
    labelStyle: React.CSSProperties;
    inputStyle: React.CSSProperties;
}

export const Step2ProjectInfo: React.FC<Step2ProjectInfoProps> = React.memo(({
    pkgName,
    projectName,
    setProjectName,
    description,
    setDescription,
    onPrev,
    onNext,
    btnPrimary,
    btnOutline,
    labelStyle,
    inputStyle
}) => {
    return (
        <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                Thông Tin Dự Án
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                Đặt tên cho dự án của bạn để AURA chuẩn bị tốt nhất.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                <div>
                    <label style={labelStyle}>Tên Dự Án *</label>
                    <input
                        type="text"
                        placeholder={`Dự án ${pkgName}`}
                        value={projectName}
                        onChange={e => setProjectName(e.target.value)}
                        style={inputStyle}
                    />
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
                        Để trống sẽ tự đặt tên theo gói dịch vụ
                    </p>
                </div>
                <div>
                    <label style={labelStyle}>Mô Tả / Yêu Cầu Đặc Biệt</label>
                    <textarea
                        placeholder="Mô tả ngắn về sản phẩm, phong cách, hay yêu cầu đặc biệt..."
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={4}
                        style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={onPrev} style={{ ...btnOutline, flex: '0 0 auto', padding: '1rem 1.5rem' }}>
                    <ArrowLeft size={16} />
                </button>
                <button onClick={onNext} style={{ ...btnPrimary, flex: 1, justifyContent: 'center', padding: '1rem' }}>
                    Tiếp tục <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
});

Step2ProjectInfo.displayName = 'Step2ProjectInfo';
