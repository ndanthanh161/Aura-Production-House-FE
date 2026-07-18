import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, X, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { DocumentTemplate } from '../../types/documentTemplate.types';

interface TemplatePreviewPanelProps {
    selectedTemplate: DocumentTemplate;
    onClose: () => void;
}

const GOOGLE_VIEWER_URL = 'https://docs.google.com/viewer';
const OFFICE_VIEWER_URL = 'https://view.officeapps.live.com/op/embed.aspx';
const LOCKED_PREVIEW_URL = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

const getNormalizedFileType = (template: DocumentTemplate) => {
    const type = template.fileType?.trim().toLowerCase();
    if (type) return type.startsWith('.') ? type : `.${type}`;

    const urlWithoutQuery = template.fileUrl?.split(/[?#]/, 1)[0].toLowerCase() || '';
    const extensionMatch = urlWithoutQuery.match(/\.[a-z0-9]+$/);
    return extensionMatch?.[0] || '';
};

const getPreviewUrl = (template: DocumentTemplate, canViewOriginal: boolean) => {
    const fileUrl = canViewOriginal ? template.fileUrl : LOCKED_PREVIEW_URL;
    const fileType = canViewOriginal ? getNormalizedFileType(template) : '.pdf';
    const isSpreadsheet = ['.xls', '.xlsx', '.csv', '.ods'].includes(fileType);

    if (isSpreadsheet) {
        return `${OFFICE_VIEWER_URL}?src=${encodeURIComponent(fileUrl)}`;
    }

    return `${GOOGLE_VIEWER_URL}?url=${encodeURIComponent(fileUrl)}&embedded=true`;
};

export const TemplatePreviewPanel: React.FC<TemplatePreviewPanelProps> = React.memo(({
    selectedTemplate,
    onClose
}) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isDownloading, setIsDownloading] = useState(false);

    // Check VIP Access: users with active VIP status or Admins/Photographers
    const isVipOrStaff = user?.isVip === true || user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'photographer';
    const previewUrl = getPreviewUrl(selectedTemplate, isVipOrStaff);

    const handleDownload = async () => {
        if (!isVipOrStaff || !selectedTemplate.fileUrl || isDownloading) return;

        setIsDownloading(true);
        const fileUrl = selectedTemplate.fileUrl;
        
        // Auto-detect and sanitize extension
        let extension = selectedTemplate.fileType || '';
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

        const cleanTitle = selectedTemplate.title.trim().replace(/[^a-zA-Z0-9À-ỹ\s\-_]/g, '').replace(/\s+/g, '_');
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
            key={selectedTemplate.id}
            initial={{ opacity: 0, scale: 0.98, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.98, x: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="template-preview-panel"
            style={{
                backgroundColor: 'rgba(10, 10, 10, 0.75)',
                border: '1px solid rgba(192, 154, 90, 0.25)',
                borderRadius: '24px',
                height: '750px',
                position: 'sticky',
                top: '100px',
                boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                zIndex: 10
            }}
        >
            {/* Preview Header */}
            <div style={{
                padding: '1.25rem 2rem',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'rgba(15, 15, 15, 0.8)',
                backdropFilter: 'blur(12px)',
                zIndex: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '42px', height: '42px', borderRadius: '12px',
                        backgroundColor: selectedTemplate.fileType?.toLowerCase() === '.pdf' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(192, 154, 90, 0.08)',
                        border: `1px solid ${selectedTemplate.fileType?.toLowerCase() === '.pdf' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(192, 154, 90, 0.25)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: selectedTemplate.fileType?.toLowerCase() === '.pdf' ? '#ef4444' : '#C09A5A'
                    }}>
                        <FileText size={20} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0, color: 'var(--color-text)', textTransform: 'none' }}>
                            {selectedTemplate.title}
                        </h3>
                        <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                            SECURE_VIEWPORT // TYPE: {selectedTemplate.fileType?.toUpperCase()}
                        </span>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    style={{
                        background: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text)',
                        cursor: 'pointer',
                        width: '38px', height: '38px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-accent)';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.transform = 'rotate(90deg)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
                        e.currentTarget.style.color = 'var(--color-text)';
                        e.currentTarget.style.transform = 'rotate(0deg)';
                    }}
                >
                    <X size={18} />
                </button>
            </div>

            {/* Secure IFrame Embed with Blur Check */}
            <div style={{ flex: 1, backgroundColor: '#141414', position: 'relative', overflow: 'hidden' }}>
                <iframe
                    src={previewUrl}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        filter: !isVipOrStaff ? 'blur(12px) brightness(0.4)' : 'none',
                        pointerEvents: !isVipOrStaff ? 'none' : 'auto'
                    }}
                    title={selectedTemplate.title || 'Preview'}
                />

                {/* Overlaid Lock and Banner message if not VIP */}
                {!isVipOrStaff && (
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(7, 7, 6, 0.55)',
                        backdropFilter: 'blur(4px)',
                        padding: '2rem',
                        textAlign: 'center',
                        zIndex: 20
                    }}>
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '50%',
                            backgroundColor: 'rgba(15, 14, 12, 0.9)',
                            border: '1px solid rgba(192, 154, 90, 0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--color-accent)',
                            marginBottom: '1.5rem',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                        }}>
                            <Lock size={24} />
                        </div>

                        <h4 style={{
                            fontSize: '1.35rem',
                            fontWeight: 700,
                            fontFamily: 'var(--font-sans)',
                            color: '#FFFFFF',
                            marginBottom: '0.75rem'
                        }}>
                            {!user ? 'Yêu Cầu Đăng Nhập' : 'Tài Liệu Dành Cho Hội Viên'}
                        </h4>

                        <p style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.85rem',
                            maxWidth: '320px',
                            lineHeight: 1.5,
                            marginBottom: '2rem'
                        }}>
                            {!user 
                                ? 'Vui lòng đăng nhập tài khoản Aura để mở khóa và xem nội dung tài liệu bảo mật này.' 
                                : 'Nội dung tài liệu này chỉ dành riêng cho Hội Viên của Aura.'}
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '240px', gap: '10px' }}>
                            {!user ? (
                                <button
                                    onClick={() => navigate('/login')}
                                    style={{
                                        backgroundColor: 'var(--color-accent)',
                                        color: '#0F0F0F',
                                        padding: '0.65rem 1.5rem',
                                        fontSize: '0.82rem',
                                        fontWeight: 800,
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        border: 'none',
                                        textTransform: 'uppercase',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
                                >
                                    Đăng Nhập Ngay
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate('/packages?focus=membership')}
                                    style={{
                                        backgroundColor: 'var(--color-accent)',
                                        color: '#0F0F0F',
                                        padding: '0.65rem 1.5rem',
                                        fontSize: '0.82rem',
                                        fontWeight: 800,
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        border: 'none',
                                        textTransform: 'uppercase',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
                                >
                                    Nâng Cấp Hội Viên 🌟
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Preview Footer */}
            <div style={{
                padding: '1.25rem 2rem',
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem',
                backgroundColor: 'rgba(15, 15, 15, 0.8)',
                backdropFilter: 'blur(12px)',
                zIndex: 10
            }}>
                <button
                    disabled={!isVipOrStaff || isDownloading}
                    onClick={handleDownload}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: isVipOrStaff 
                            ? 'linear-gradient(135deg, #CF9F2E 0%, #D4AF37 50%, #F3E5AB 100%)'
                            : 'rgba(255, 255, 255, 0.05)',
                        color: isVipOrStaff ? 'black' : 'rgba(255, 255, 255, 0.3)',
                        padding: '0.65rem 1.5rem', fontSize: '0.82rem', fontWeight: 800,
                        borderRadius: '8px', 
                        cursor: (isVipOrStaff && !isDownloading) ? 'pointer' : 'not-allowed', 
                        border: isVipOrStaff ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                        textTransform: 'uppercase',
                        boxShadow: isVipOrStaff ? '0 6px 15px rgba(212,175,55,0.2)' : 'none',
                        transition: 'all 0.3s ease',
                        opacity: isDownloading ? 0.8 : 1
                    }}
                    onMouseEnter={(e) => {
                        if (isVipOrStaff && !isDownloading) {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 10px 20px rgba(212,175,55,0.3)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (isVipOrStaff && !isDownloading) {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 6px 15px rgba(212,175,55,0.2)';
                        }
                    }}
                >
                    {isDownloading ? (
                        <>
                            <Loader2 size={14} className="animate-spin" /> Đang tải xuống...
                        </>
                    ) : isVipOrStaff ? (
                        <>
                            <Download size={14} /> Tải tệp xuống
                        </>
                    ) : (
                        <>
                            <Lock size={14} /> Tải tệp xuống
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
});

TemplatePreviewPanel.displayName = 'TemplatePreviewPanel';
export default TemplatePreviewPanel;
