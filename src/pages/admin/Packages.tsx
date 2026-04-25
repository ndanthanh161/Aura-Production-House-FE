import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Star, X, Check, Loader2, Package, CheckCircle2, PlusCircle, MinusCircle } from 'lucide-react';
import { packageApi } from '../../services/packageApi';
import type { Package as PkgType, CreatePackageRequest, UpdatePackageRequest } from '../../types/package.types';

const emptyForm: CreatePackageRequest = {
    name: '',
    price: 0,
    description: '',
    benefits: [],
    isPopular: false,
};

const AdminPackages: React.FC = () => {
    const [packages, setPackages] = useState<PkgType[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<PkgType | null>(null);
    const [form, setForm] = useState<CreatePackageRequest>(emptyForm);
    const [benefitInput, setBenefitInput] = useState('');

    const fetchPackages = async () => {
        try {
            setLoading(true);
            const res = await packageApi.getAll(true);
            setPackages(res.data || []);
        } catch {
            setError('Không thể tải danh sách gói dịch vụ.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPackages(); }, []);

    const openCreate = () => {
        setEditItem(null);
        setForm(emptyForm);
        setBenefitInput('');
        setShowModal(true);
    };

    const openEdit = (pkg: PkgType) => {
        setEditItem(pkg);
        setForm({
            name: pkg.name,
            price: pkg.price,
            description: pkg.description || '',
            benefits: [...pkg.benefits],
            isPopular: pkg.isPopular,
        });
        setBenefitInput('');
        setShowModal(true);
    };

    // ── Benefits helpers ─────────────────────────────────────────
    const addBenefit = () => {
        const trimmed = benefitInput.trim();
        if (!trimmed) return;
        setForm(prev => ({ ...prev, benefits: [...prev.benefits, trimmed] }));
        setBenefitInput('');
    };

    const removeBenefit = (index: number) => {
        setForm(prev => ({ ...prev, benefits: prev.benefits.filter((_, i) => i !== index) }));
    };

    const handleBenefitKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') { e.preventDefault(); addBenefit(); }
    };

    // ── Submit ───────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.benefits.length === 0) {
            setError('Vui lòng thêm ít nhất 1 lợi ích cho gói.');
            return;
        }
        setSaving(true);
        setError('');
        try {
            if (editItem) {
                const updateReq: UpdatePackageRequest = { ...form, id: editItem.id, isActive: editItem.isActive };
                await packageApi.update(updateReq);
            } else {
                await packageApi.create(form);
            }
            setShowModal(false);
            fetchPackages();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lưu thất bại.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa gói dịch vụ này?')) return;
        try {
            await packageApi.delete(id);
            fetchPackages();
        } catch {
            setError('Xóa thất bại.');
        }
    };

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--color-text)' }}>
                        Quản Lý Gói Dịch Vụ
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        Tạo và quản lý các gói chụp ảnh của studio
                    </p>
                </div>
                <button onClick={openCreate} style={btnPrimary}>
                    <Plus size={18} /> Tạo Gói Mới
                </button>
            </header>

            {error && (
                <div style={alertStyle}>
                    {error}
                    <button onClick={() => setError('')}><X size={14} /></button>
                </div>
            )}

            {loading ? (
                <div style={centerStyle}><Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-accent)' }} /></div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {packages.map((pkg, i) => (
                        <motion.div
                            key={pkg.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                            style={{
                                backgroundColor: 'var(--color-bg-secondary)',
                                border: `1px solid ${pkg.isPopular ? 'var(--color-accent)' : 'var(--color-border)'}`,
                                borderRadius: '8px', padding: '1.75rem',
                                position: 'relative', display: 'flex', flexDirection: 'column', gap: '1rem',
                            }}
                        >
                            {pkg.isPopular && (
                                <span style={{
                                    position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                                    backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)',
                                    fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
                                    padding: '3px 12px', borderRadius: '20px', textTransform: 'uppercase',
                                    display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap'
                                }}>
                                    <Star size={10} fill="currentColor" /> Phổ biến
                                </span>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Package size={18} style={{ color: 'var(--color-accent)' }} />
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text)' }}>{pkg.name}</h3>
                                    </div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-accent)', marginTop: '0.5rem' }}>
                                        {formatPrice(pkg.price)}
                                    </div>
                                </div>
                                <span style={{
                                    fontSize: '0.7rem', padding: '3px 10px',
                                    backgroundColor: pkg.isActive ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                                    color: pkg.isActive ? '#22c55e' : '#ef4444',
                                    borderRadius: '20px', fontWeight: 600,
                                }}>
                                    {pkg.isActive ? 'Hoạt động' : 'Ẩn'}
                                </span>
                            </div>

                            {pkg.description && (
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                                    {pkg.description}
                                </p>
                            )}

                            {/* Benefits list */}
                            {pkg.benefits.length > 0 && (
                                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                                        Lợi ích ({pkg.benefits.length})
                                    </p>
                                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {pkg.benefits.map((b, bi) => (
                                            <li key={bi} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8rem', color: 'var(--color-text)' }}>
                                                <CheckCircle2 size={13} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }} />
                                                <span style={{ lineHeight: 1.5 }}>{b}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                <button onClick={() => openEdit(pkg)} style={btnSecondary}>
                                    <Edit2 size={14} /> Chỉnh sửa
                                </button>
                                <button onClick={() => handleDelete(pkg.id)} style={btnDanger}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
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
                                    {editItem ? 'Chỉnh Sửa Gói' : 'Tạo Gói Mới'}
                                </h2>
                                <button onClick={() => setShowModal(false)} style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {/* Name */}
                                <div>
                                    <label style={labelStyle}>Tên gói *</label>
                                    <input
                                        type="text" required
                                        value={form.name}
                                        onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                                        style={inputStyle}
                                        placeholder="VD: Gói Nâng Cao"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label style={labelStyle}>Mô tả ngắn</label>
                                    <input
                                        type="text"
                                        value={form.description || ''}
                                        onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                                        style={inputStyle}
                                        placeholder="VD: Dành cho thương hiệu đang phát triển"
                                    />
                                </div>

                                {/* Price */}
                                <div>
                                    <label style={labelStyle}>Giá (VNĐ) *</label>
                                    <input
                                        type="number" min={0} required
                                        value={form.price}
                                        onChange={e => setForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                                        style={inputStyle}
                                    />
                                </div>

                                {/* Benefits */}
                                <div>
                                    <label style={labelStyle}>Lợi ích *</label>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                        <input
                                            type="text"
                                            placeholder="Nhập lợi ích rồi nhấn Enter hoặc dấu +"
                                            value={benefitInput}
                                            onChange={e => setBenefitInput(e.target.value)}
                                            onKeyDown={handleBenefitKeyDown}
                                            style={{ ...inputStyle, flex: 1 }}
                                        />
                                        <button
                                            type="button"
                                            onClick={addBenefit}
                                            style={{ ...btnPrimary, padding: '0.7rem 0.9rem', flexShrink: 0 }}
                                        >
                                            <PlusCircle size={18} />
                                        </button>
                                    </div>
                                    {form.benefits.length === 0 ? (
                                        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Chưa có lợi ích nào. Thêm ít nhất 1 lợi ích.</p>
                                    ) : (
                                        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {form.benefits.map((b, i) => (
                                                <li key={i} style={{
                                                    display: 'flex', alignItems: 'center', gap: '8px',
                                                    backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)',
                                                    borderRadius: '6px', padding: '0.5rem 0.75rem',
                                                    fontSize: '0.85rem', color: 'var(--color-text)'
                                                }}>
                                                    <CheckCircle2 size={13} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                                                    <span style={{ flex: 1, lineHeight: 1.4 }}>{b}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeBenefit(i)}
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '2px', display: 'flex', alignItems: 'center' }}
                                                    >
                                                        <MinusCircle size={15} />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                {/* Toggles */}
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    {[
                                        { key: 'isPopular', label: 'Đánh dấu Phổ biến' },
                                        ...(editItem ? [{ key: 'isActive', label: 'Kích hoạt' }] : []),
                                    ].map(toggle => (
                                        <label key={toggle.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                            <input
                                                type="checkbox"
                                                checked={(form as unknown as Record<string, unknown>)[toggle.key] as boolean ?? (editItem?.isActive ?? true)}
                                                onChange={e => setForm(prev => ({ ...prev, [toggle.key]: e.target.checked }))}
                                            />
                                            {toggle.label}
                                        </label>
                                    ))}
                                </div>

                                {error && <div style={{ ...alertStyle, marginTop: 0 }}>{error}</div>}

                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                    <button type="submit" disabled={saving} style={{ ...btnPrimary, flex: 1, justifyContent: 'center' }}>
                                        {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={16} />}
                                        {editItem ? 'Lưu thay đổi' : 'Tạo gói'}
                                    </button>
                                    <button type="button" onClick={() => setShowModal(false)} style={btnSecondary}>Huỷ</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

// ─── Shared styles ─────────────────────────────────────────────────
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
const btnDanger: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '6px',
    backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444',
    padding: '0.5rem 0.75rem', borderRadius: '6px', cursor: 'pointer', border: 'none',
};
const alertStyle: React.CSSProperties = {
    backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444',
    padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.875rem',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
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
    padding: '2rem', width: '100%', maxWidth: '520px',
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

export default AdminPackages;
