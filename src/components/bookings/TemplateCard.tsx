import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Eye, FileDown, Lock, Loader2 } from 'lucide-react';
import type { DocumentTemplate } from '../../types/documentTemplate.types';

interface TemplateCardProps {
    tmpl: DocumentTemplate;
    index: number;
    isSelected: boolean;
    onSelect: (tmpl: DocumentTemplate) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = React.memo(({ tmpl, index, isSelected, onSelect }) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const isPdf = tmpl.fileType?.toLowerCase() === '.pdf';

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!tmpl.fileUrl || isDownloading) return;

        setIsDownloading(true);
        const fileUrl = tmpl.fileUrl;
        
        // Auto-detect and sanitize extension
        let extension = tmpl.fileType || '';
        if (!extension) {
            const lowerUrl = fileUrl.toLowerCase();
            if (lowerUrl.includes('.pdf')) {
                extension = '.pdf';
            } else if (lowerUrl.includes('.docx')) {
                extension = '.docx';
            } else if (lowerUrl.includes('.doc')) {
                extension = '.doc';
            } else {
                extension = '.docx';
            }
        }
        if (!extension.startsWith('.')) {
            extension = `.${extension}`;
        }

        const cleanTitle = tmpl.title.trim().replace(/[^a-zA-Z0-9À-ỹ\s\-_]/g, '').replace(/\s+/g, '_');
        const filename = `${cleanTitle}${extension}`;

        try {
            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error('Network response was not ok');
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        } catch (err) {
            console.error('Download via fetch failed, falling back to window.open:', err);
            window.open(fileUrl, '_blank');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`template-card ${isSelected ? 'active-template-card' : ''}`}
            onClick={() => onSelect(tmpl)}
            style={{ cursor: 'pointer' }}
        >
            {/* Top technical band */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.58rem',
                fontFamily: 'monospace',
                color: isSelected ? 'var(--color-accent)' : 'rgba(255,255,255,0.25)',
                borderBottom: '1px solid rgba(255,255,255,0.03)',
                paddingBottom: '0.5rem',
                letterSpacing: '0.1em',
                transition: 'color 0.3s ease'
            }}>
                <span>AURA SECURITY PROTOCOL // DECRYPTED</span>
                <span>{isSelected ? 'ACTIVE_VIEWPORT' : 'LEVEL_4_CLEARANCE'}</span>
            </div>

            {/* Header */}
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <div 
                    className="file-icon-box"
                    style={{
                        backgroundColor: isPdf ? 'rgba(239, 68, 68, 0.06)' : 'rgba(192, 154, 90, 0.06)',
                        border: `1px solid ${isPdf ? 'rgba(239, 68, 68, 0.15)' : 'rgba(192, 154, 90, 0.25)'}`,
                        color: isPdf ? '#ef4444' : '#C09A5A',
                        boxShadow: isPdf ? '0 0 15px rgba(239, 68, 68, 0.1)' : '0 0 15px rgba(192, 154, 90, 0.1)'
                    }}
                >
                    <FileText size={20} />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="template-badge">
                            {isPdf ? 'PDF' : 'WORD'}
                        </span>
                        <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)' }}>
                            REF // AU-T0{index + 1}
                        </span>
                    </div>
                    <h3 style={{
                        fontSize: '1.2rem',
                        fontWeight: 900,
                        margin: 0,
                        color: 'var(--color-text)',
                        letterSpacing: '-0.01em',
                        textTransform: 'uppercase',
                        lineHeight: 1.3,
                        fontFamily: 'var(--font-sans)'
                    }}>
                        {tmpl.title}
                    </h3>
                </div>
            </div>

            {/* Technical Telemetry Grid */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                fontSize: '0.65rem',
                fontFamily: 'monospace',
                color: 'rgba(255, 255, 255, 0.35)',
                backgroundColor: 'rgba(0,0,0,0.25)',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.02)',
                letterSpacing: '0.05em'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.15)' }}>INTEGRITY:</span>
                    <span style={{ color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }} />
                        PASS
                    </span>
                </div>
            </div>

            {/* Description Panel */}
            <div className="template-desc-container">
                <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.6,
                    margin: 0,
                    fontStyle: tmpl.description ? 'normal' : 'italic'
                }}>
                    {tmpl.description ? (
                        tmpl.description
                    ) : (
                        <span style={{ opacity: 0.5 }}>
                            // SYSTEM TELEMETRY BRIEFING // <br />
                            Kịch bản concept độc quyền thiết kế riêng chuẩn studio sản xuất sáng tạo AURA.
                        </span>
                    )}
                </p>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.03)', width: '100%' }} />

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', zIndex: 3 }} onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={() => onSelect(tmpl)}
                    className="template-view-btn"
                    style={{
                        background: isSelected ? 'linear-gradient(135deg, #CF9F2E 0%, #D4AF37 50%, #F3E5AB 100%)' : 'rgba(192, 154, 90, 0.03)',
                        color: isSelected ? 'black' : 'var(--color-accent)'
                    }}
                >
                    <Eye size={15} /> {isSelected ? 'Đang Xem' : 'Xem Trực Tuyến'}
                </button>
                
                {tmpl.fileUrl ? (
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="template-download-btn"
                        title="Tải xuống tệp tin"
                        style={{
                            cursor: isDownloading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isDownloading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <FileDown size={16} />
                        )}
                    </button>
                ) : (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect(tmpl);
                        }}
                        className="template-download-btn locked-btn"
                        title="Nâng cấp hội viên để tải xuống"
                        style={{
                            borderColor: 'rgba(255, 255, 255, 0.05)',
                            background: 'rgba(255, 255, 255, 0.01)',
                            color: 'rgba(255, 255, 255, 0.15)',
                            cursor: 'pointer'
                        }}
                    >
                        <Lock size={15} />
                    </button>
                )}
            </div>
        </motion.div>
    );
});

TemplateCard.displayName = 'TemplateCard';
