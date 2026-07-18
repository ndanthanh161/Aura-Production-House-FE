import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, FileText, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { documentTemplateApi } from '../../services/documentTemplateApi';
import type { DocumentTemplate } from '../../types/documentTemplate.types';
import { Button } from '../../components/ui/Button';
import { TemplateCard } from '../../components/bookings/TemplateCard';
import { TemplatePreviewPanel } from '../../components/bookings/TemplatePreviewPanel';
import '../public/MyBookings.css'; // Reusing HUD / grid animations from MyBookings

const Vault: React.FC = () => {
    const { isLoading: authLoading } = useAuth();
    const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
    const [templatesLoading, setTemplatesLoading] = useState(false);
    const [templatesError, setTemplatesError] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);

    useEffect(() => {
        if (!authLoading) {
            fetchTemplates();
        }
    }, [authLoading]);

    const fetchTemplates = async () => {
        setTemplatesLoading(true);
        setTemplatesError('');
        try {
            const res = await documentTemplateApi.getAll();
            if (res.succeeded && res.data) {
                setTemplates(res.data);
            } else {
                setTemplatesError(res.message || 'Không thể tải danh sách tài liệu.');
            }
        } catch {
            setTemplatesError('Đã xảy ra lỗi kết nối đến máy chủ.');
        } finally {
            setTemplatesLoading(false);
        }
    };

    // Handle template card selection (always open, authorization check is delegated inside the preview panel)
    const handleSelectTemplate = (template: DocumentTemplate) => {
        setSelectedTemplate(selectedTemplate?.id === template.id ? null : template);
    };

    return (
        <div style={{
            paddingTop: '160px',
            paddingBottom: '100px',
            minHeight: '100vh',
            backgroundColor: 'var(--color-bg)',
            backgroundImage: 'radial-gradient(circle at top right, rgba(192, 154, 90, 0.05), transparent), radial-gradient(circle at bottom left, rgba(7, 31, 217, 0.02), transparent)',
            position: 'relative',
            overflowX: 'hidden',
            overflowY: 'visible'
        }} className="container">
            {/* Cinematic Background Grid Lines */}
            <div style={{
                position: 'absolute',
                top: 0, bottom: 0, left: '5%', right: '5%',
                borderLeft: '1px solid rgba(255, 255, 255, 0.02)',
                borderRight: '1px solid rgba(255, 255, 255, 0.02)',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

                {/* HUD Header */}
                <header style={{ marginBottom: '2.5rem', position: 'relative' }}>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span style={{
                            display: 'block',
                            fontSize: '1.2rem',
                            fontWeight: 700,
                            letterSpacing: '0.35em',
                            textTransform: 'uppercase',
                            color: 'var(--color-accent)',
                            marginBottom: '1rem'
                        }}>
                            Hội Viên — Tài Liệu Bảo Mật
                        </span>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
                            <h1 style={{
                                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                                lineHeight: 1,
                                margin: 0,
                                fontFamily: 'var(--font-display)',
                                textTransform: 'none',
                                letterSpacing: 'var(--ls-tight)',
                                fontWeight: 200
                            }}>
                                Kho <span style={{ fontWeight: 900 }}>tài liệu</span>
                            </h1>


                        </div>
                    </motion.div>
                </header>



                <AnimatePresence mode="wait">
                    {authLoading || templatesLoading ? (
                        <motion.div
                            key="templates-loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ padding: '8rem', textAlign: 'center' }}
                        >
                            <Loader2 size={40} className="animate-spin" style={{ color: 'var(--color-accent)', margin: '0 auto' }} />
                        </motion.div>
                    ) : templatesError ? (
                        <motion.div
                            key="templates-error"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                padding: '4rem',
                                backgroundColor: 'rgba(239, 68, 68, 0.01)',
                                borderRadius: '32px',
                                textAlign: 'center',
                                border: '1px solid rgba(239, 68, 68, 0.08)',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            <AlertCircle size={48} style={{ color: '#ef4444', marginBottom: '1.5rem', opacity: 0.6 }} />
                            <p style={{ color: '#ef4444', fontSize: '1.1rem', marginBottom: '2rem', fontFamily: 'monospace' }}>{templatesError}</p>
                            <Button onClick={fetchTemplates} variant="outline">Thử lại</Button>
                        </motion.div>
                    ) : templates.length === 0 ? (
                        <motion.div
                            key="templates-empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                padding: '6rem 2rem',
                                backgroundColor: 'var(--color-bg-secondary)',
                                borderRadius: '40px',
                                textAlign: 'center',
                                border: '1px dashed var(--color-border)',
                                position: 'relative'
                            }}
                        >
                            <div className="viewfinder-corner top-left" />
                            <div className="viewfinder-corner top-right" />
                            <div className="viewfinder-corner bottom-left" />
                            <div className="viewfinder-corner bottom-right" />

                            <FileText size={64} style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', opacity: 0.15 }} />
                            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-display)', fontWeight: 900 }}>Thư viện trống</h2>
                            <p style={{ color: 'var(--color-text-muted)', maxWidth: '450px', margin: '0 auto', lineHeight: 1.6 }}>
                                Hệ thống chưa đăng tải tài liệu VIP nào. Vui lòng quay lại sau!
                            </p>
                        </motion.div>
                    ) : (
                        <div className={`templates-split-container ${selectedTemplate ? 'split-active' : ''}`} style={{
                            display: 'grid',
                            gridTemplateColumns: selectedTemplate ? '260px 1fr' : '1fr',
                            gap: '2.5rem',
                            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                            alignItems: 'start'
                        }}>
                            {/* Left Column: Templates Grid / List */}
                            <motion.div
                                key="templates-list"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: selectedTemplate ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
                                    gap: '2rem',
                                    maxHeight: selectedTemplate ? '700px' : 'auto',
                                    overflowY: selectedTemplate ? 'auto' : 'visible',
                                    paddingRight: selectedTemplate ? '12px' : '0',
                                    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                                className="custom-scrollbar"
                            >
                                {selectedTemplate && (
                                    <button
                                        onClick={() => setSelectedTemplate(null)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            background: 'rgba(255,255,255,0.02)',
                                            border: '1px solid rgba(192, 154, 90, 0.25)',
                                            borderRadius: '10px',
                                            color: 'var(--color-accent)',
                                            padding: '10px 16px',
                                            fontSize: '0.8rem',
                                            fontFamily: 'monospace',
                                            letterSpacing: '0.08em',
                                            textTransform: 'uppercase',
                                            cursor: 'pointer',
                                            width: '100%',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                            marginBottom: '0.5rem'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(192, 154, 90, 0.08)';
                                            e.currentTarget.style.borderColor = 'var(--color-accent)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                                            e.currentTarget.style.borderColor = 'rgba(192, 154, 90, 0.25)';
                                        }}
                                    >
                                        <ChevronLeft size={15} /> QUAY LẠI DANH SÁCH
                                    </button>
                                )}

                                {(selectedTemplate ? templates.filter(t => t.id === selectedTemplate.id) : templates).map((tmpl, index) => {
                                    const isSelected = selectedTemplate?.id === tmpl.id;
                                    return (
                                        <TemplateCard
                                            key={tmpl.id}
                                            tmpl={tmpl}
                                            index={index}
                                            isSelected={isSelected}
                                            onSelect={handleSelectTemplate}
                                        />
                                    );
                                })}
                            </motion.div>

                            {/* Right Column: Live Console Viewport Preview */}
                            {selectedTemplate && (
                                <TemplatePreviewPanel
                                    selectedTemplate={selectedTemplate}
                                    onClose={() => setSelectedTemplate(null)}
                                />
                            )}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Vault;
