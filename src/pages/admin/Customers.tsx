import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Edit2, X, Check, Loader2, Mail, Phone, Calendar, Lock } from 'lucide-react';
import { customerApi } from '../../services/userApi';
import type { UserDTO, UpdateUserRequest } from '../../types/user.types';

const AdminCustomers: React.FC = () => {
    const [customers, setCustomers] = useState<UserDTO[]>([]);
    const [filtered, setFiltered] = useState<UserDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<UserDTO | null>(null);
    const [form, setForm] = useState<UpdateUserRequest>({ id: '', fullName: '', phone: '' });

    const fetch = async () => {
        try {
            setLoading(true);
            const res = await customerApi.getAll();
            setCustomers(res.data || []);
            setFiltered(res.data || []);
        } catch {
            setError('Không thể tải danh sách khách hàng.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetch(); }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(customers.filter(c =>
            c.fullName.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            (c.phone || '').includes(q)
        ));
    }, [search, customers]);

    const openEdit = (c: UserDTO) => {
        setEditItem(c);
        setForm({ id: c.id, fullName: c.fullName, phone: c.phone || '' });
        setShowModal(true);
    };

    const handleDeactivate = async (id: string, name: string) => {
        if (!confirm(`Bạn có chắc muốn KHÓA tài khoản của khách hàng "${name}"?`)) return;
        try {
            await customerApi.deactivate(id);
            fetch();
        } catch {
            setError('Khóa tài khoản thất bại.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await customerApi.update(form);
            setShowModal(false);
            fetch();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi cập nhật.');
        } finally {
            setSaving(false);
        }
    };

    const fmtDate = (d: string) => new Date(d).toLocaleDateString('vi-VN');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--color-text)' }}>Quản Lý Khách Hàng</h1>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        {customers.length} khách hàng đã đăng ký
                    </p>
                </div>
                <div style={{ position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input placeholder="Tìm tên, email, số điện thoại..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: '36px', width: '260px' }} />
                </div>
            </header>

            {error && <div style={alertStyle}>{error} <button onClick={() => setError('')}><X size={14} /></button></div>}

            {loading ? (
                <div style={centerStyle}><Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-accent)' }} /></div>
            ) : (
                <>
                    {/* Summary cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                        {[
                            { label: 'Tổng khách hàng', value: customers.length, color: 'var(--color-accent)' },
                            { label: 'Có số điện thoại', value: customers.filter(c => c.phone).length, color: '#3b82f6' },
                            { label: 'Tham gia tháng này', value: customers.filter(c => new Date(c.createdAt).getMonth() === new Date().getMonth()).length, color: '#22c55e' },
                        ].map(s => (
                            <div key={s.label} style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1.25rem' }}>
                                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                                    {['Khách hàng', 'Liên hệ', 'Tham gia', 'Thao tác'].map(h => (
                                        <th key={h} style={{ padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((c, i) => (
                                    <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                                        style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-bg)', fontWeight: 700, flexShrink: 0 }}>
                                                    {c.fullName.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.9rem' }}>{c.fullName}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{c.id.slice(0, 8)}…</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text)', fontSize: '0.875rem' }}>
                                                <Mail size={13} style={{ color: 'var(--color-text-muted)' }} /> {c.email}
                                            </div>
                                            {c.phone && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: '3px' }}>
                                                    <Phone size={12} /> {c.phone}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                                <Calendar size={13} /> {fmtDate(c.createdAt)}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => openEdit(c)} style={btnSecondary}>
                                                    <Edit2 size={14} /> Sửa
                                                </button>
                                                <button onClick={() => handleDeactivate(c.id, c.fullName)} style={btnDanger} title="Khóa tài khoản">
                                                    <Lock size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                                        <Users size={32} style={{ margin: '0 auto 1rem', opacity: 0.3, display: 'block' }} />
                                        Không tìm thấy khách hàng nào.
                                    </td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            <AnimatePresence>
                {showModal && editItem && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={overlayStyle} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={modalStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontWeight: 700, color: 'var(--color-text)' }}>Cập Nhật Khách Hàng</h2>
                                <button onClick={() => setShowModal(false)} style={{ color: 'var(--color-text-muted)' }}><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={labelStyle}>Họ và Tên *</label>
                                    <input required value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} style={inputStyle} />
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

            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
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

export default AdminCustomers;
