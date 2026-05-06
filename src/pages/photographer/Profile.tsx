import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, Check, X, User as UserIcon, Briefcase, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { photographerApi } from '../../services/userApi';
import type { UpdateUserRequest } from '../../types/user.types';

const PhotographerProfile: React.FC = () => {
    const { user } = useAuth();
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState<UpdateUserRequest>({
        id: '',
        fullName: '',
        phone: '',
        bio: '',
        specialization: '',
        avatar: ''
    });

    useEffect(() => {
        const loadProfile = async () => {
            const userId = user?.userId;
            if (userId) {
                try {
                    setLoading(true);
                    const res = await photographerApi.getById(userId);
                    const d = res.data;
                    if (d) {
                        setForm({
                            id: d.id,
                            fullName: d.fullName,
                            phone: d.phone || '',
                            bio: d.bio || '',
                            specialization: d.specialization || '',
                            avatar: d.avatar || ''
                        });
                    }
                } catch (err) {
                    console.error('Failed to load profile:', err);
                    setError('Không thể tải thông tin hồ sơ.');
                } finally {
                    setLoading(false);
                }
            }
        };
        loadProfile();
    }, [user?.userId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess(false);
        try {
            await photographerApi.update(form);
            setSuccess(true);
            // Optional: You could trigger a context refresh here if needed
            setTimeout(() => setSuccess(false), 5000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Lưu hồ sơ thất bại. Vui lòng thử lại.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <Loader2 className="animate-spin" size={32} color="var(--color-accent)" />
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '800px' }}>
            <header>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>HỒ SƠ CÁ NHÂN</h1>
                <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Quản lý thông tin định danh và chuyên môn của bạn tại Aura.</p>
            </header>

            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '16px',
                    padding: '2.5rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ padding: '12px', backgroundColor: 'rgba(197,160,89,0.1)', borderRadius: '12px', color: 'var(--color-accent)' }}>
                        <UserIcon size={24} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{form.fullName}</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Cập nhật thông tin nhận diện chuyên nghiệp của bạn.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        {/* Full Name */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <label style={labelStyle}><UserIcon size={14} /> Họ và Tên</label>
                            <input
                                type="text"
                                required
                                value={form.fullName}
                                onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                                style={inputStyle}
                                placeholder="Nguyễn Văn A"
                            />
                        </div>

                        {/* Phone */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <label style={labelStyle}>Số Điện Thoại</label>
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                                style={inputStyle}
                                placeholder="090x xxx xxx"
                            />
                        </div>

                        {/* Specialization */}
                        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <label style={labelStyle}><Briefcase size={14} /> Lĩnh vực chuyên môn</label>
                            <input
                                type="text"
                                value={form.specialization}
                                onChange={e => setForm(p => ({ ...p, specialization: e.target.value }))}
                                style={inputStyle}
                                placeholder="Ví dụ: Chụp ảnh cưới Cinematic, Quay phim sự kiện, Lookbook thời trang..."
                            />
                        </div>

                        {/* Bio */}
                        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <label style={labelStyle}><FileText size={14} /> Giới thiệu bản thân</label>
                            <textarea
                                value={form.bio}
                                onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                                style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                                placeholder="Chia sẻ đôi chút về kinh nghiệm và phong cách làm việc của bạn..."
                            />
                        </div>
                    </div>

                    {/* Feedback Messages */}
                    {error && (
                        <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                            {error} <button type="button" onClick={() => setError('')}><X size={16} /></button>
                        </div>
                    )}
                    {success && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600 }}
                        >
                            <Check size={18} /> Cập nhật hồ sơ thành công!
                        </motion.div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)',
                                padding: '0.875rem 2rem', borderRadius: '12px', fontWeight: 700,
                                fontSize: '0.95rem', cursor: saving ? 'not-allowed' : 'pointer',
                                border: 'none', transition: 'all 0.2s ease',
                                boxShadow: '0 4px 12px rgba(197,160,89,0.3)'
                            }}
                        >
                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            Lưu hồ sơ chuyên nghiệp
                        </button>
                    </div>
                </form>
            </motion.section>

            <style>{`
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

const labelStyle: React.CSSProperties = {
    fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em',
    color: 'var(--color-text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px'
};
const inputStyle: React.CSSProperties = {
    padding: '1rem 1.25rem', backgroundColor: 'var(--color-bg)',
    border: '1px solid var(--color-border)', borderRadius: '12px',
    color: 'var(--color-text)', fontSize: '0.95rem', width: '100%', boxSizing: 'border-box',
    transition: 'border-color 0.2s ease', outline: 'none'
};

export default PhotographerProfile;
