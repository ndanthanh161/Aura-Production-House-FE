import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, X } from 'lucide-react';
import type { DocumentTemplate } from '../../types/documentTemplate.types';

interface TemplatePreviewPanelProps {
    selectedTemplate: DocumentTemplate;
    onClose: () => void;
}

export const TemplatePreviewPanel: React.FC<TemplatePreviewPanelProps> = React.memo(({
    selectedTemplate,
    onClose
}) => {
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

            {/* Secure IFrame Embed */}
            <div style={{ flex: 1, backgroundColor: '#141414', position: 'relative' }}>
                <iframe
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedTemplate.fileUrl || '')}&embedded=true`}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                    }}
                    title={selectedTemplate.title || 'Preview'}
                />
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
                    onClick={() => { if (selectedTemplate.fileUrl) window.open(selectedTemplate.fileUrl, '_blank'); }}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: 'linear-gradient(135deg, #CF9F2E 0%, #D4AF37 50%, #F3E5AB 100%)',
                        color: 'black',
                        padding: '0.65rem 1.5rem', fontSize: '0.82rem', fontWeight: 800,
                        borderRadius: '8px', cursor: 'pointer', border: 'none',
                        textTransform: 'uppercase',
                        boxShadow: '0 6px 15px rgba(212,175,55,0.2)',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(212,175,55,0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 6px 15px rgba(212,175,55,0.2)';
                    }}
                >
                    <Download size={14} /> Tải tệp xuống
                </button>
            </div>
        </motion.div>
    );
});

TemplatePreviewPanel.displayName = 'TemplatePreviewPanel';
export default TemplatePreviewPanel;
