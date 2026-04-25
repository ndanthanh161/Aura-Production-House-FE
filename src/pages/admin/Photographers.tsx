import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Edit2, UserX, Briefcase, X, Check, Loader2, Search, Phone, Mail } from 'lucide-react';
import { photographerApi } from '../../services/userApi';
import type { UserDTO, UpdateUserRequest, CreatePhotographerRequest } from '../../types/user.types';

const AdminPhotographers: React.FC = () => {
    const [photographers, setPhotographers] = useState<UserDTO[]>([]);
    const [filtered, setFiltered] = useState<UserDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<UserDTO | null>(null);
    const [form, setForm] = useState<CreatePhotographerRequest & { id?: string, role: string }>({ 
        fullName: '', email: '', password: '', phone: '', role: 'Photographer' 
    });

    const fetch = async () => {
        try {
            setLoading(true);
            const res = await photographerApi.getAll();
            setPhotographers(res.data || []);
            setFiltered(res.data || []);
        } catch {
            setError('Không thể tải danh sách photographer.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetch(); }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(photographers.filter(p =>
            p.fullName.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)
        ));
    }, [search, photographers]);

    const openAdd = () => {
        setEditItem(null);
        setForm({ fullName: '', email: '', password: '', phone: '', role: 'Photographer' });
        setShowModal(true);
    };

    const openEdit = (p: UserDTO) => {
        setEditItem(p);
        setForm({ id: p.id, fullName: p.fullName, email: p.email, phone: p.phone || '', role: p.role });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            if (editItem) {
                await photographerApi.update(form as any);
            } else {
                await photographerApi.create(form);
            }
            setShowModal(false);
            fetch();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi hệ thống.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeactivate = async (id: string, name: string) => {
        if (!confirm(`Vô hiệu hóa photographer "${name}"?`)) return;
        try {
            await photographerApi.deactivate(id);
            fetch();
        } catch {
            setError('Vô hiệu hóa thất bại.');
        }
    };

    const isDeactivated = (name: string) => name.startsWith('[Đã nghỉ]');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--color-text)' }}>
                        Quản Lý Photographer
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        {photographers.length} photographer trong hệ thống
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input
                            placeholder="Tìm kiếm..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ ...inputStyle, paddingLeft: '36px', width: '240px' }}
                        />
                    </div>
                    <button onClick={openAdd} style={btnPrimary}>
                        <Camera size={16} /> Thêm Photographer
                    </button>
                </div>
            </header>

            {error && (
                <div style={alertStyle}>
                    {error} <button onClick={() => setError('')}><X size={14} /></button>
                </div>
            )}

            {loading ? (
                <div style={centerStyle}>
                    <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-accent)' }} />
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                    {filtered.map((p, i) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            style={{
                                backgroundColor: 'var(--color-bg-secondary)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '8px',
                                padding: '1.5rem',
                                opacity: isDeactivated(p.fullName) ? 0.55 : 1,
                                display: 'flex', flexDirection: 'column', gap: '1rem'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                <div style={{
                                    width: '52px', height: '52px', borderRadius: '50%',
                                    backgroundColor: 'var(--color-accent)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--color-bg)', fontWeight: 700, fontSize: '1.25rem', flexShrink: 0
                                }}>
                                    {p.fullName.charAt(0).toUpperCase()}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                        <h3 style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '1rem' }}>{p.fullName}</h3>
                                        {isDeactivated(p.fullName) && (
                                            <span style={{ fontSize: '0.65rem', padding: '2px 8px', backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444', borderRadius: '20px' }}>
                                                Đã nghỉ
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                                        <Mail size={12} /> {p.email}
                                    </div>
                                    {p.phone && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                                            <Phone size={12} /> {p.phone}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                                <Briefcase size={13} />
                                <span>Tham gia: {new Date(p.createdAt).toLocaleDateString('vi-VN')}</span>
                            </div>

                            {!isDeactivated(p.fullName) && (
                                <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                                    <button onClick={() => openEdit(p)} style={{ ...btnSecondary, flex: 1, justifyContent: 'center' }}>
                                        <Edit2 size={14} /> Chỉnh sửa
                                    </button>
                                    <button onClick={() => handleDeactivate(p.id, p.fullName)} style={btnDanger}>
                                        <UserX size={14} />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    ))}

                    {filtered.length === 0 && !loading && (
                        <div style={{ gridColumn: '1/-1', ...centerStyle, flexDirection: 'column', gap: '1rem', color: 'var(--color-text-muted)' }}>
                            <Camera size={40} style={{ opacity: 0.3 }} />
                            <p>Không tìm thấy photographer nào.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={overlayStyle} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} style={modalStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontWeight: 700, color: 'var(--color-text)' }}>
                                    {editItem ? 'Cập Nhật Photographer' : 'Thêm Photographer Mới'}
                                </h2>
                                <button onClick={() => setShowModal(false)} style={{ color: 'var(--color-text-muted)' }}><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={labelStyle}>Họ và Tên *</label>
                                    <input required value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} style={inputStyle} />
                                </div>
                                {!editItem && (
                                    <>
                                        <div>
                                            <label style={labelStyle}>Email *</label>
                                            <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} style={inputStyle} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Mật khẩu *</label>
                                            <input required type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} style={inputStyle} />
                                        </div>
                                    </>
                                )}
                                <div>
                                    <label style={labelStyle}>Vai trò</label>
                                    <input 
                                        disabled
                                        value="Photographer"
                                        style={{ ...inputStyle, backgroundColor: 'rgba(255,255,255,0.05)', cursor: 'not-allowed' }}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Số điện thoại</label>
                                    <input value={form.phone || ''} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} style={inputStyle} />
                                </div>
                                {error && <div style={alertStyle}>{error}</div>}
                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                    <button type="submit" disabled={saving} style={{ ...btnPrimary, flex: 1, justifyContent: 'center' }}>
                                        {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={16} />} Lưu
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

const btnPrimary: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)', padding: '0.6rem 1.25rem', fontSize: '0.875rem', fontWeight: 600, borderRadius: '6px', cursor: 'pointer', border: 'none' };
const btnSecondary: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'transparent', color: 'var(--color-text-muted)', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500, borderRadius: '6px', cursor: 'pointer', border: '1px solid var(--color-border)' };
const btnDanger: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '0.5rem 0.75rem', borderRadius: '6px', cursor: 'pointer', border: 'none' };
const alertStyle: React.CSSProperties = { backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const centerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem' };
const overlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalStyle: React.CSSProperties = { backgroundColor: 'var(--color-bg-secondary)', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '440px', border: '1px solid var(--color-border)' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.7rem 0.9rem', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text)', fontSize: '0.9rem', boxSizing: 'border-box' };

export default AdminPhotographers;
