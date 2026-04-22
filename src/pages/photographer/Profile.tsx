import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Save, Loader2, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { photographerApi } from '../../services/userApi';
import type { UpdateUserRequest } from '../../types/user.types';

const PhotographerProfile: React.FC = () => {
    const { user } = useAuth();
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState<UpdateUserRequest>({
        id: '',
        fullName: '',
        phone: '',
    });

    useEffect(() => {
        if (user) {
            setForm({
                id: user.userId,
                fullName: user.fullName,
                phone: '',
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess(false);
        try {
            await photographerApi.update(form);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lưu thất bại.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '720px' }}>
            <header>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.4rem' }}>Hồ Sơ</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Quản lý thông tin cá nhân của bạn.</p>
            </header>

            <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    padding: '2rem',
                    display: 'flex', flexDirection: 'column', gap: '2rem',
                }}
            >
                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            width: '88px', height: '88px', borderRadius: '50%',
                            backgroundColor: 'var(--color-accent)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--color-bg)', fontWeight: 800, fontSize: '2rem',
                        }}>
                            {(user?.fullName || 'P').charAt(0).toUpperCase()}
                        </div>
                        <div style={{
                            position: 'absolute', bottom: 0, right: 0,
                            padding: '6px', backgroundColor: 'var(--color-accent)',
                            borderRadius: '50%', color: 'var(--color-bg)',
                        }}>
                            <Camera size={13} />
                        </div>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{user?.fullName}</h3>
                        <p style={{ color: 'var(--color-accent)', fontSize: '0.875rem', marginTop: '2px' }}>Photographer</p>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>{user?.email}</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={labelStyle}>Họ và Tên *</label>
                            <input
                                type="text"
                                required
                                value={form.fullName}
                                onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={labelStyle}>Email</label>
                            <input
                                type="email"
                                disabled
                                value={user?.email || ''}
                                style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }}
                            />
                        </div>
                        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={labelStyle}>Số Điện Thoại</label>
                            <input
                                type="tel"
                                value={form.phone || ''}
                                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                                placeholder="Nhập số điện thoại..."
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {error && (
                        <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                            {error} <button type="button" onClick={() => setError('')}><X size={14} /></button>
                        </div>
                    )}
                    {success && (
                        <div style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e', padding: '0.75rem 1rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}>
                            <Check size={14} /> Lưu thành công!
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={saving}
                        style={{
                            alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px',
                            backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)',
                            padding: '0.7rem 1.5rem', borderRadius: '6px', fontWeight: 600,
                            fontSize: '0.875rem', cursor: saving ? 'not-allowed' : 'pointer',
                            border: 'none', opacity: saving ? 0.7 : 1,
                        }}
                    >
                        {saving
                            ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                            : <Save size={16} />
                        }
                        Lưu Thay Đổi
                    </button>
                </form>
            </motion.section>

            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
    );
};

const labelStyle: React.CSSProperties = {
    fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em',
    color: 'var(--color-text-muted)', fontWeight: 600,
};
const inputStyle: React.CSSProperties = {
    padding: '0.75rem 1rem', backgroundColor: 'var(--color-bg)',
    border: '1px solid var(--color-border)', borderRadius: '6px',
    color: 'var(--color-text)', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box',
};

export default PhotographerProfile;
