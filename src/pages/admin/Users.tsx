import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, Phone, Calendar, User, Loader2, X, ShieldCheck } from 'lucide-react';
import { customerApi } from '../../services/userApi';
import type { UserDTO } from '../../types/user.types';

const AdminUsers: React.FC = () => {
    const [customers, setCustomers] = useState<UserDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const res = await customerApi.getAll();
                setCustomers(res.data || []);
            } catch {
                setError('Không thể tải danh sách người dùng.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const list = customers;
    const q = search.toLowerCase();
    const filtered = list.filter(u =>
        u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );

    const fmtDate = (d: string) => new Date(d).toLocaleDateString('vi-VN');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--color-text)' }}>Quản Lý Khách Hàng</h1>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        {customers.length} khách hàng trong hệ thống
                    </p>
                </div>
                <div style={{ position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                        placeholder="Tìm tên, email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ padding: '0.65rem 0.9rem 0.65rem 36px', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text)', fontSize: '0.875rem', width: '240px', boxSizing: 'border-box' }}
                    />
                </div>
            </header>

            {error && (
                <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                    {error} <button onClick={() => setError('')}><X size={14} /></button>
                </div>
            )}

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-accent)' }} />
                </div>
            ) : (
                <div style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                                {['Người dùng', 'Email', 'Số điện thoại', 'Vai trò', 'Tham gia'].map(h => (
                                    <th key={h} style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((u, i) => (
                                <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                                    style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '1rem 1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-bg)', fontWeight: 700, flexShrink: 0 }}>
                                                {u.fullName.charAt(0).toUpperCase()}
                                            </div>
                                            <span style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.9rem' }}>{u.fullName}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text)', fontSize: '0.875rem' }}>
                                            <Mail size={12} style={{ color: 'var(--color-text-muted)' }} /> {u.email}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 1.25rem' }}>
                                        {u.phone
                                            ? <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text)', fontSize: '0.875rem' }}><Phone size={12} style={{ color: 'var(--color-text-muted)' }} /> {u.phone}</div>
                                            : <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>—</span>
                                        }
                                    </td>
                                    <td style={{ padding: '1rem 1.25rem' }}>
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                                            padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                                            backgroundColor: 'rgba(59,130,246,0.12)',
                                            color: '#3b82f6',
                                        }}>
                                            <User size={11} />
                                            Khách hàng
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                            <Calendar size={12} /> {fmtDate(u.createdAt)}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                            {filtered.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                                        Không tìm thấy người dùng nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
    );
};

export default AdminUsers;
