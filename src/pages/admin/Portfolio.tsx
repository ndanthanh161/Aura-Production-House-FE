import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Check, Loader2, Eye, EyeOff, Upload, Image, Film, GripVertical, ExternalLink } from 'lucide-react';
import { portfolioApi, PORTFOLIO_CATEGORIES, getCategoryLabel } from '../../services/portfolioApi';
import type { PortfolioItem, CreatePortfolioRequest, PortfolioMedia } from '../../services/portfolioApi';

const emptyForm: CreatePortfolioRequest = {
    title: '', category: 0, content: '', clientName: '', displayOrder: 0, isHot: false,
};


const AdminPortfolio: React.FC = () => {
    const [items, setItems] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<PortfolioItem | null>(null);
    const [form, setForm] = useState<CreatePortfolioRequest>(emptyForm);
    const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
    const [previewItem, setPreviewItem] = useState<PortfolioItem | null>(null);
    const [activeFilter, setActiveFilter] = useState<number | null>(null);
    const [hoveredThumbnailId, setHoveredThumbnailId] = useState<string | null>(null);
    const [thumbnailUploading, setThumbnailUploading] = useState(false);
    const [zoomThumbnail, setZoomThumbnail] = useState<string | null>(null); // URL to zoom
    const fileInputRef = useRef<HTMLInputElement>(null);
    const thumbnailFileInputRef = useRef<HTMLInputElement>(null);
    const thumbnailUploadTargetId = useRef<string | null>(null);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const res = await portfolioApi.getAll();
            setItems(res.data || []);
        } catch {
            setError('Không thể tải danh sách portfolio.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchItems(); }, []);

    // Auto clear messages
    useEffect(() => {
        if (success) { const t = setTimeout(() => setSuccess(''), 3000); return () => clearTimeout(t); }
    }, [success]);
    useEffect(() => {
        if (error) { const t = setTimeout(() => setError(''), 5000); return () => clearTimeout(t); }
    }, [error]);

    const openCreate = () => {
        setEditItem(null);
        setForm(emptyForm);
        setShowModal(true);
    };

    const openEdit = (item: PortfolioItem) => {
        setEditItem(item);
        setForm({
            title: item.title,
            category: item.category as number,
            content: item.content || '',
            clientName: item.clientName || '',
            displayOrder: 0,
            isHot: item.isHot,
        });
        setShowModal(true);
    };

    // Sort by createdAt DESC + filter by category
    const displayItems = [...items]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .filter(item => activeFilter === null || Number(item.category) === activeFilter ||
            item.category === PORTFOLIO_CATEGORIES.find(c => c.value === activeFilter)?.enumName);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            if (editItem) {
                await portfolioApi.update({ ...form, id: editItem.id });
                setSuccess('Đã cập nhật portfolio.');
            } else {
                await portfolioApi.create(form);
                setSuccess('Đã tạo portfolio mới. Hãy thêm ảnh/video!');
            }
            setShowModal(false);
            fetchItems();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lưu thất bại.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Xóa portfolio này? Tất cả ảnh/video cũng sẽ bị xóa trên Cloudinary.')) return;
        try {
            await portfolioApi.delete(id);
            if (selectedItem?.id === id) setSelectedItem(null);
            setSuccess('Đã xóa portfolio.');
            fetchItems();
        } catch {
            setError('Xóa thất bại.');
        }
    };

    const handleTogglePublish = async (item: PortfolioItem) => {
        try {
            await portfolioApi.togglePublish(item.id);
            setSuccess(item.isPublished ? 'Đã ẩn khỏi trang chủ.' : 'Đã đăng lên trang chủ!');
            fetchItems();
        } catch {
            setError('Thao tác thất bại.');
        }
    };

    // ─── Media Upload ────────────────────────────────────────
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || !selectedItem) return;

        setUploading(true);
        setError('');
        try {
            for (let i = 0; i < files.length; i++) {
                await portfolioApi.uploadMedia(selectedItem.id, files[i]);
            }
            setSuccess(`Đã tải lên ${files.length} file thành công.`);
            fetchItems();
            // Update selectedItem with fresh data
            const res = await portfolioApi.getById(selectedItem.id);
            if (res.data) setSelectedItem(res.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload thất bại.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDeleteMedia = async (media: PortfolioMedia) => {
        if (!confirm('Xóa file này?')) return;
        try {
            await portfolioApi.deleteMedia(media.id);
            setSuccess('Đã xóa file.');
            fetchItems();
            if (selectedItem) {
                const res = await portfolioApi.getById(selectedItem.id);
                if (res.data) setSelectedItem(res.data);
            }
        } catch {
            setError('Xóa file thất bại.');
        }
    };

    const handleSetThumbnail = async (media: PortfolioMedia) => {
        if (!selectedItem) return;
        try {
            await portfolioApi.setThumbnail(selectedItem.id, media.url);
            setSuccess('Đã đặt ảnh bìa!');
            fetchItems();
            const res = await portfolioApi.getById(selectedItem.id);
            if (res.data) setSelectedItem(res.data);
        } catch {
            setError('Đặt ảnh bìa thất bại.');
        }
    };

    const triggerThumbnailUpload = (itemId: string) => {
        thumbnailUploadTargetId.current = itemId;
        thumbnailFileInputRef.current?.click();
    };

    const handleThumbnailFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const id = thumbnailUploadTargetId.current;
        if (!file || !id) return;
        setThumbnailUploading(true);
        setError('');
        try {
            await portfolioApi.uploadThumbnailFile(id, file);
            setSuccess('Đã cập nhật ảnh bìa!');
            fetchItems();
            if (selectedItem?.id === id) {
                const res = await portfolioApi.getById(id);
                if (res.data) setSelectedItem(res.data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload ảnh bìa thất bại.');
        } finally {
            setThumbnailUploading(false);
            if (thumbnailFileInputRef.current) thumbnailFileInputRef.current.value = '';
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Hidden input for thumbnail upload */}
            <input ref={thumbnailFileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleThumbnailFileChange} style={{ display: 'none' }} />

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--color-text)' }}>
                        Quản Lý Portfolio
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        Quản lý và đăng tải các dự án nổi bật lên trang chủ
                    </p>
                </div>
                <button onClick={openCreate} style={btnPrimary}>
                    <Plus size={18} /> Tạo Portfolio Mới
                </button>
            </header>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {[{ value: null, label: 'Tất Cả' }, ...PORTFOLIO_CATEGORIES.map(c => ({ value: c.value as number | null, label: c.label }))].map(cat => (
                    <button key={String(cat.value)} onClick={() => setActiveFilter(cat.value)}
                        style={{
                            padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600,
                            cursor: 'pointer', border: '1px solid var(--color-border)',
                            backgroundColor: activeFilter === cat.value ? 'var(--color-accent)' : 'transparent',
                            color: activeFilter === cat.value ? 'var(--color-bg)' : 'var(--color-text-muted)',
                            transition: 'all 0.2s',
                        }}>
                        {cat.label}
                    </button>
                ))}
                <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--color-text-muted)', alignSelf: 'center' }}>
                    {displayItems.length} / {items.length} dự án
                </span>
            </div>

            {/* Messages */}
            <AnimatePresence>
                {error && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={alertStyle}>
                        {error}
                        <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}><X size={14} /></button>
                    </motion.div>
                )}
                {success && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={successStyle}>
                        <Check size={14} /> {success}
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <div style={centerStyle}><Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-accent)' }} /></div>
            ) : (
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    {/* LEFT: Portfolio List */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        {displayItems.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                                <Image size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                                <p>Chưa có portfolio nào. Hãy tạo mới!</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {displayItems.map((item, i) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => setSelectedItem(item)}
                                        style={{
                                            backgroundColor: 'var(--color-bg-secondary)',
                                            border: `1px solid ${selectedItem?.id === item.id ? 'var(--color-accent)' : 'var(--color-border)'}`,
                                            borderRadius: '10px',
                                            padding: '1.25rem',
                                            display: 'flex',
                                            gap: '1rem',
                                            cursor: 'pointer',
                                            transition: 'border-color 0.2s',
                                        }}
                                    >
                                        {/* Thumbnail + Media strip */}
                                        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                                            {/* Thumbnail (ảnh bìa) - hoverable */}
                                            <div
                                                style={{ width: '90px', height: '68px', borderRadius: '6px', overflow: 'hidden', backgroundColor: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', border: '2px solid var(--color-accent)', cursor: 'pointer', flexShrink: 0 }}
                                                onMouseEnter={() => setHoveredThumbnailId(item.id)}
                                                onMouseLeave={() => setHoveredThumbnailId(null)}
                                                onClick={(e) => { e.stopPropagation(); }}
                                            >
                                                {thumbnailUploading && thumbnailUploadTargetId.current === item.id ? (
                                                    <Loader2 size={20} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-accent)' }} />
                                                ) : item.thumbnailUrl ? (
                                                    <img src={item.thumbnailUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <Image size={18} style={{ opacity: 0.2 }} />
                                                )}
                                                <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(173,255,0,0.85)', color: '#000', fontSize: '0.5rem', fontWeight: 700, textAlign: 'center', padding: '1px', textTransform: 'uppercase' }}>Bìa</span>
                                                {/* Hover overlay */}
                                                {hoveredThumbnailId === item.id && (
                                                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                                        <button onClick={(e) => { e.stopPropagation(); triggerThumbnailUpload(item.id); }}
                                                            style={{ background: 'var(--color-accent)', border: 'none', borderRadius: '4px', color: '#000', fontSize: '0.55rem', fontWeight: 700, padding: '3px 6px', cursor: 'pointer', width: '70px', textAlign: 'center' }}>
                                                            ↑ Đổi ảnh bìa
                                                        </button>
                                                        {item.thumbnailUrl && (
                                                            <button onClick={(e) => { e.stopPropagation(); setZoomThumbnail(item.thumbnailUrl); }}
                                                                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px', color: '#fff', fontSize: '0.55rem', fontWeight: 700, padding: '3px 6px', cursor: 'pointer', width: '70px', textAlign: 'center' }}>
                                                                🔍 Xem to
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            {/* Other media items (excluding thumbnail) */}
                                            {item.mediaItems
                                                .filter(m => m.url !== item.thumbnailUrl)
                                                .slice(0, 3)
                                                .map(m => (
                                                    <div key={m.id} style={{ width: '68px', height: '68px', borderRadius: '6px', overflow: 'hidden', backgroundColor: 'var(--color-bg)', flexShrink: 0, position: 'relative' }}>
                                                        {m.mediaType === 'video' ? (
                                                            <><video src={m.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                                                            <Film size={12} style={{ position: 'absolute', bottom: '3px', right: '3px', color: '#fff', filter: 'drop-shadow(0 0 2px #000)' }} /></>
                                                        ) : (
                                                            <img src={m.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        )}
                                                    </div>
                                                ))}
                                        </div>

                                        {/* Info */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                                                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {item.title}
                                                </h3>
                                                <span style={{
                                                    fontSize: '0.65rem', padding: '2px 8px', borderRadius: '20px', fontWeight: 600, flexShrink: 0, marginLeft: '8px',
                                                    backgroundColor: item.isPublished ? 'rgba(34,197,94,0.15)' : 'rgba(250,204,21,0.15)',
                                                    color: item.isPublished ? '#22c55e' : '#facc15',
                                                }}>
                                                    {item.isPublished ? 'Đã đăng' : 'Nháp'}
                                                </span>
                                                {item.isHot && (
                                                    <span style={{
                                                        fontSize: '0.65rem', padding: '2px 8px', borderRadius: '20px', fontWeight: 800, flexShrink: 0, marginLeft: '4px',
                                                        backgroundColor: 'rgba(239,68,68,0.15)',
                                                        color: '#ef4444',
                                                        border: '1px solid rgba(239,68,68,0.3)'
                                                    }}>
                                                        HOT
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.78rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
                                                <span style={badgeStyle}>{getCategoryLabel(item.category)}</span>
                                                {item.clientName && <span>• {item.clientName}</span>}
                                                <span>• {item.mediaItems.length} file</span>
                                                <span style={{ color: 'var(--color-text-muted)', opacity: 0.6 }}>
                                                    • {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                                            <button onClick={() => setPreviewItem(item)} title="Xem như khách hàng" style={{ ...btnIcon, color: 'var(--color-accent)' }}>
                                                <ExternalLink size={15} />
                                            </button>
                                            <button onClick={() => handleTogglePublish(item)} title={item.isPublished ? 'Ẩn' : 'Đăng'} style={{ ...btnIcon, color: item.isPublished ? '#22c55e' : 'var(--color-text-muted)' }}>
                                                {item.isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
                                            </button>
                                            <button onClick={() => openEdit(item)} title="Sửa" style={btnIcon}>
                                                <Edit2 size={15} />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} title="Xóa" style={{ ...btnIcon, color: '#ef4444' }}>
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Media Panel */}
                    <div style={{
                        width: '380px', flexShrink: 0,
                        backgroundColor: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        position: 'sticky', top: '90px', alignSelf: 'flex-start', maxHeight: 'calc(100vh - 140px)', overflowY: 'auto',
                    }}>
                        {selectedItem ? (
                            <>

                                {/* ─── SECTION 1: Ảnh Bìa ─── */}
                                <div style={{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--color-border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                        <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-accent)' }}>Ảnh Bìa</span>
                                        <button onClick={() => triggerThumbnailUpload(selectedItem.id)} disabled={thumbnailUploading}
                                            style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', background: 'none', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-muted)', padding: '3px 8px', cursor: 'pointer', fontWeight: 600 }}>
                                            {thumbnailUploading ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={12} />}
                                            Đổi ảnh bìa
                                        </button>
                                    </div>
                                    <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--color-accent)', cursor: selectedItem.thumbnailUrl ? 'zoom-in' : 'pointer', position: 'relative' }}
                                        onClick={() => selectedItem.thumbnailUrl ? setZoomThumbnail(selectedItem.thumbnailUrl) : triggerThumbnailUpload(selectedItem.id)}>
                                        {selectedItem.thumbnailUrl ? (
                                            <img src={selectedItem.thumbnailUrl} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                                <Image size={28} style={{ opacity: 0.2, marginBottom: '4px' }} />
                                                <p style={{ fontSize: '0.75rem' }}>Chưa có ảnh bìa<br /><span style={{ color: 'var(--color-accent)' }}>Click để tải lên</span></p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* ─── SECTION 2: Upload & Media Grid ─── */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                    <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)' }}>Ảnh & Video Dự Án</span>
                                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{selectedItem.mediaItems.filter(m => m.url !== selectedItem.thumbnailUrl).length} file</span>
                                </div>

                                <input ref={fileInputRef} type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm" onChange={handleFileSelect} style={{ display: 'none' }} />
                                <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                                    style={{ width: '100%', padding: '0.75rem', marginBottom: '0.75rem', border: '2px dashed var(--color-border)', borderRadius: '10px', backgroundColor: 'var(--color-bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
                                    {uploading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Đang tải lên...</> : <><Upload size={18} /> Tải ảnh / video lên</>}
                                </button>

                                {/* Media Grid - only non-thumbnail items */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                                    {selectedItem.mediaItems.filter(m => m.url !== selectedItem.thumbnailUrl).map(media => (
                                        <div key={media.id} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '1', backgroundColor: '#000' }}>
                                            {media.mediaType === 'video' ? (
                                                <video src={media.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                                            ) : (
                                                <img src={media.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            )}
                                            {/* Set thumbnail button (images only) */}
                                            {media.mediaType === 'image' && (
                                                <button onClick={() => handleSetThumbnail(media)} title="Đặt làm ảnh bìa"
                                                    style={{ position: 'absolute', bottom: '4px', left: '4px', backgroundColor: 'rgba(0,0,0,0.75)', color: 'var(--color-accent)', border: '1px solid var(--color-accent)', borderRadius: '4px', fontSize: '0.5rem', fontWeight: 700, padding: '2px 5px', cursor: 'pointer', textTransform: 'uppercase' }}>
                                                    Đặt làm bìa
                                                </button>
                                            )}
                                            {/* Type badge */}
                                            <span style={{ position: 'absolute', top: '4px', left: '4px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                {media.mediaType === 'video' ? <Film size={10} /> : <Image size={10} />}
                                                {media.mediaType === 'video' ? 'Video' : 'Ảnh'}
                                            </span>
                                            {/* Delete */}
                                            <button onClick={() => handleDeleteMedia(media)}
                                                style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: 'rgba(239,68,68,0.9)', color: '#fff', border: 'none', borderRadius: '4px', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {selectedItem.mediaItems.filter(m => m.url !== selectedItem.thumbnailUrl).length === 0 && (
                                    <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem', padding: '1.5rem 0' }}>
                                        Chưa có ảnh/video nào. Hãy tải lên!
                                    </p>
                                )}
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
                                <GripVertical size={32} style={{ marginBottom: '0.75rem', opacity: 0.2 }} />
                                <p style={{ fontSize: '0.85rem' }}>Chọn một portfolio bên trái<br />để quản lý ảnh/video</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal Create/Edit */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={overlayStyle}
                        onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            style={modalStyle}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>
                                    {editItem ? 'Chỉnh Sửa Portfolio' : 'Tạo Portfolio Mới'}
                                </h2>
                                <button onClick={() => setShowModal(false)} style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={labelStyle}>Tên dự án *</label>
                                    <input
                                        type="text" required
                                        value={form.title}
                                        onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                                        style={inputStyle}
                                        placeholder="VD: Bộ ảnh thời trang Thu Đông 2024"
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={labelStyle}>Danh mục *</label>
                                        <select
                                            value={form.category}
                                            onChange={e => setForm(prev => ({ ...prev, category: Number(e.target.value) }))}
                                            style={inputStyle}
                                        >
                                            {PORTFOLIO_CATEGORIES.map(c => (
                                                <option key={c.value} value={c.value}>{c.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Khách hàng</label>
                                        <input
                                            type="text"
                                            value={form.clientName || ''}
                                            onChange={e => setForm(prev => ({ ...prev, clientName: e.target.value }))}
                                            style={inputStyle}
                                            placeholder="VD: Tạp chí Elle"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={labelStyle}>Nội dung / Bài viết</label>
                                    <textarea
                                        rows={5}
                                        value={form.content || ''}
                                        onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
                                        style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }}
                                        placeholder="Mô tả chi tiết về dự án, câu chuyện đằng sau, quá trình thực hiện..."
                                    />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                                    <input 
                                        type="checkbox"
                                        id="isHot"
                                        checked={form.isHot}
                                        onChange={e => setForm(prev => ({ ...prev, isHot: e.target.checked }))}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    />
                                    <label htmlFor="isHot" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', cursor: 'pointer' }}>
                                        Đánh dấu là Dự án nổi bật (Hiển thị tại trang chủ)
                                    </label>
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                    <button type="submit" disabled={saving} style={{ ...btnPrimary, flex: 1, justifyContent: 'center' }}>
                                        {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={16} />}
                                        {editItem ? 'Lưu thay đổi' : 'Tạo portfolio'}
                                    </button>
                                    <button type="button" onClick={() => setShowModal(false)} style={btnSecondary}>Huỷ</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Preview Modal - xem như khách hàng */}
            <AnimatePresence>
                {previewItem && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(20px)' }}
                        onClick={() => setPreviewItem(null)}
                    >
                        {/* Preview badge */}
                        <div style={{ position: 'absolute', top: '1.5rem', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(173,255,0,0.15)', border: '1px solid var(--color-accent)', color: 'var(--color-accent)', padding: '4px 16px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', zIndex: 10 }}>
                            👁 Chế độ xem trước — Giao diện khách hàng
                        </div>
                        <button onClick={() => setPreviewItem(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#FFF', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
                            <X size={24} />
                        </button>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 40 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                            style={{ backgroundColor: '#000', width: 'min(90vw, 1000px)', maxHeight: '90vh', overflowY: 'auto', position: 'relative', scrollbarWidth: 'none', marginTop: '3rem' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Hero */}
                            {(previewItem.thumbnailUrl || previewItem.mediaItems.find(m => m.mediaType === 'image')?.url) && (
                                <div style={{ width: '100%', aspectRatio: '16/10', overflow: 'hidden' }}>
                                    <img src={previewItem.thumbnailUrl || previewItem.mediaItems.find(m => m.mediaType === 'image')!.url} alt={previewItem.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            )}
                            {/* Content */}
                            <div style={{ padding: '4rem 3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <span style={{ color: 'var(--color-accent)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.2em', marginBottom: '1rem' }}>
                                    {getCategoryLabel(previewItem.category)}
                                </span>
                                <h2 style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', color: '#FFF', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.1, letterSpacing: '0.05em', marginBottom: '1.5rem', maxWidth: '800px' }}>
                                    {previewItem.title}
                                </h2>
                                {previewItem.clientName && (
                                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                                        Khách hàng: <strong style={{ color: 'rgba(255,255,255,0.8)' }}>{previewItem.clientName}</strong>
                                    </p>
                                )}
                                {previewItem.content && (
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: '1.8', fontWeight: 300, maxWidth: '800px', whiteSpace: 'pre-wrap' }}>
                                        {previewItem.content}
                                    </p>
                                )}
                                {/* Media Grid - exclude thumbnail */}
                                {previewItem.mediaItems.filter(m => m.url !== previewItem.thumbnailUrl).length > 0 && (
                                    <div style={{ marginTop: '3rem', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                                        {previewItem.mediaItems
                                            .filter(m => m.url !== previewItem.thumbnailUrl)
                                            .map((media) => (
                                            <div key={media.id} style={{ aspectRatio: '4/3', overflow: 'hidden', borderRadius: '4px', position: 'relative' }}>
                                                {media.mediaType === 'video' ? (
                                                    <video src={media.url} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <img src={media.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Zoom Thumbnail Modal */}
            <AnimatePresence>
                {zoomThumbnail && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.92)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => setZoomThumbnail(null)}>
                        <button onClick={() => setZoomThumbnail(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
                            <X size={20} />
                        </button>
                        <motion.img initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
                            src={zoomThumbnail} alt="thumbnail preview"
                            style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 0 60px rgba(0,0,0,0.8)' }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

// ─── Shared styles (matching admin design system) ────────────────
const btnPrimary: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '8px',
    backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)',
    padding: '0.6rem 1.25rem', fontSize: '0.875rem', fontWeight: 600,
    borderRadius: '6px', cursor: 'pointer', border: 'none',
};
const btnSecondary: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '6px',
    backgroundColor: 'transparent', color: 'var(--color-text-muted)',
    padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500,
    borderRadius: '6px', cursor: 'pointer', border: '1px solid var(--color-border)',
};
const btnIcon: React.CSSProperties = {
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'var(--color-text-muted)', padding: '4px', borderRadius: '4px',
    display: 'flex', alignItems: 'center', transition: 'opacity 0.2s',
};
const alertStyle: React.CSSProperties = {
    backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444',
    padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.875rem',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
};
const successStyle: React.CSSProperties = {
    backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e',
    padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.875rem',
    display: 'flex', alignItems: 'center', gap: '8px',
};
const centerStyle: React.CSSProperties = {
    display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem',
};
const overlayStyle: React.CSSProperties = {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
};
const modalStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-bg-secondary)', borderRadius: '12px',
    padding: '2rem', width: '100%', maxWidth: '600px',
    border: '1px solid var(--color-border)', maxHeight: '90vh', overflowY: 'auto',
};
const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.78rem', color: 'var(--color-text-muted)',
    marginBottom: '0.4rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
};
const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.7rem 0.9rem',
    backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)',
    borderRadius: '6px', color: 'var(--color-text)', fontSize: '0.9rem', boxSizing: 'border-box',
};
const badgeStyle: React.CSSProperties = {
    padding: '1px 8px', backgroundColor: 'rgba(173,255,0,0.1)', color: 'var(--color-accent)',
    borderRadius: '10px', fontSize: '0.7rem', fontWeight: 600,
};

export default AdminPortfolio;
