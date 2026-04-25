import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2, ArrowRight, ArrowLeft, Loader2,
    AlertCircle, ShieldCheck, Sparkles, FileText, User
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { packageApi } from '../../services/packageApi';
import { projectApi } from '../../services/projectApi';
import { useAuth } from '../../context/AuthContext';
import type { Package } from '../../types/package.types';
import type { Project } from '../../types/project.types';

// ─── Step indicators ─────────────────────────────────────────────
const STEPS = [
    { label: 'Xem lại gói', icon: FileText },
    { label: 'Thông tin dự án', icon: User },
    { label: 'Xác nhận', icon: ShieldCheck },
];

const PurchasePackage: React.FC = () => {
    const { packageId } = useParams<{ packageId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [step, setStep] = useState(1);
    const [pkg, setPkg] = useState<Package | null>(null);
    const [loadingPkg, setLoadingPkg] = useState(true);
    const [pkgError, setPkgError] = useState('');

    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');

    const [creating, setCreating] = useState(false);
    const [createdProject, setCreatedProject] = useState<Project | null>(null);
    const [createError, setCreateError] = useState('');
    const [paymentOption, setPaymentOption] = useState<'deposit' | 'full'>('deposit');
    const [isPaying, setIsPaying] = useState(false);

    // Redirect nếu chưa đăng nhập
    useEffect(() => {
        if (!user) navigate('/login', { state: { from: `/purchase/${packageId}` } });
    }, [user, packageId, navigate]);

    // Load package detail
    useEffect(() => {
        if (!packageId) return;
        setLoadingPkg(true);
        packageApi.getById(packageId)
            .then(res => {
                if (res.data) setPkg(res.data);
                else setPkgError('Không tìm thấy gói dịch vụ.');
            })
            .catch(() => setPkgError('Không thể tải thông tin gói.'))
            .finally(() => setLoadingPkg(false));
    }, [packageId]);

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const handleFinalize = async () => {
        if (!pkg || !user) return;

        setIsPaying(true);
        // Simulate payment delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsPaying(false);

        setCreating(true);
        setCreateError('');
        try {
            const res = await projectApi.create({
                name: projectName.trim() || `Dự án ${pkg.name}`,
                clientId: user.userId,
                packageId: pkg.id,
                deposit: paymentOption === 'full' ? pkg.price : pkg.price * 0.3,
                description: description.trim() || undefined,
            });
            if (res.data) {
                setCreatedProject(res.data);
                setStep(4); // success screen
            } else {
                setCreateError(res.message || 'Tạo dự án thất bại.');
            }
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Tạo dự án thất bại.';
            setCreateError(msg);
        } finally {
            setCreating(false);
        }
    };

    // ─── Loading / Error ────────────────────────────────────────
    if (loadingPkg) return (
        <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-accent)' }} />
            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    if (pkgError || !pkg) return (
        <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <AlertCircle size={40} style={{ color: '#ef4444' }} />
            <p style={{ color: '#ef4444' }}>{pkgError || 'Gói dịch vụ không tồn tại.'}</p>
            <button onClick={() => navigate('/packages')} style={btnOutline}>← Quay lại</button>
        </div>
    );

    // ─── Success Screen ─────────────────────────────────────────
    if (step === 4 && createdProject) return (
        <div style={{ paddingTop: '120px', minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="container">
            <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', maxWidth: '520px', width: '100%' }}
            >
                {/* Big checkmark */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    style={{
                        width: '96px', height: '96px', borderRadius: '50%',
                        backgroundColor: 'rgba(173,255,0,0.15)', border: '2px solid #ADFF00',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 2rem'
                    }}
                >
                    <CheckCircle2 size={52} style={{ color: '#ADFF00' }} />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
                        Đã Tạo Dự Án!
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                        Dự án <strong style={{ color: 'var(--color-text)' }}>"{createdProject.name}"</strong> đã được khởi tạo và khoản thanh toán <strong style={{ color: 'var(--color-accent)' }}>{paymentOption === 'deposit' ? '30%' : '100%'}</strong> đã được xác nhận.<br />
                        Đội ngũ AURA sẽ liên hệ với bạn qua email để bắt đầu triển khai sản xuất dự án ngay lập tức.
                    </p>

                    {/* Benefits summary */}
                    <div style={{
                        backgroundColor: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '12px', padding: '1.5rem',
                        textAlign: 'left', marginBottom: '2rem'
                    }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
                            Quyền lợi của bạn
                        </p>
                        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {createdProject.benefits.map((b, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.875rem', color: 'var(--color-text)' }}>
                                    <Sparkles size={14} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }} />
                                    {b}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={() => navigate('/')} style={btnOutline}>Về Trang Chủ</button>
                        <button onClick={() => navigate('/projects')} style={btnPrimary}>
                            Xem Dự Án <ArrowRight size={18} />
                        </button>
                    </div>
                </motion.div>
            </motion.div>
            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    // ─── Main Purchase Flow ─────────────────────────────────────
    return (
        <div style={{ paddingTop: '100px', minHeight: '90vh', backgroundColor: 'var(--color-bg)' }} className="container">
            <div style={{ maxWidth: '680px', margin: '0 auto', paddingBottom: '5rem' }}>

                {/* Back button */}
                <button onClick={() => navigate('/packages')} style={{ ...btnGhost, marginBottom: '2rem' }}>
                    <ArrowLeft size={16} /> Quay lại gói dịch vụ
                </button>

                {/* Step Progress */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '3rem' }}>
                    {STEPS.map((s, i) => {
                        const n = i + 1;
                        const active = step === n;
                        const done = step > n;
                        return (
                            <React.Fragment key={s.label}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: '0 0 auto' }}>
                                    <div style={{
                                        width: '38px', height: '38px', borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        backgroundColor: done ? 'var(--color-accent)' : active ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                                        border: `2px solid ${done || active ? 'var(--color-accent)' : 'var(--color-border)'}`,
                                        transition: 'all 0.3s ease',
                                        color: done || active ? 'var(--color-bg)' : 'var(--color-text-muted)',
                                        fontSize: '0.8rem', fontWeight: 700
                                    }}>
                                        {done ? <CheckCircle2 size={18} /> : n}
                                    </div>
                                    <span style={{ fontSize: '0.7rem', color: active ? 'var(--color-text)' : 'var(--color-text-muted)', fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>
                                        {s.label}
                                    </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div style={{ flex: 1, height: '2px', backgroundColor: step > n ? 'var(--color-accent)' : 'var(--color-border)', margin: '0 8px', marginBottom: '22px', transition: 'background-color 0.3s ease' }} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                <AnimatePresence mode="wait">
                    {/* ── Step 1: Package Preview ──────────────────────── */}
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                                Xem Lại Gói Dịch Vụ
                            </h2>
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                                Xác nhận đây là gói bạn muốn đăng ký.
                            </p>

                            <div style={{
                                backgroundColor: 'var(--color-bg-secondary)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '16px', padding: '2rem',
                                marginBottom: '2rem'
                            }}>
                                {pkg.isPopular && (
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                                        backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)',
                                        fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
                                        padding: '4px 12px', borderRadius: '20px',
                                        textTransform: 'uppercase', marginBottom: '1.25rem'
                                    }}>
                                        <Sparkles size={11} /> Phổ biến nhất
                                    </span>
                                )}

                                <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.35rem' }}>
                                    {pkg.name}
                                </h3>
                                {pkg.description && (
                                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                                        {pkg.description}
                                    </p>
                                )}

                                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--color-accent)', lineHeight: 1, marginBottom: '0.5rem' }}>
                                    {formatPrice(pkg.price)}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    VNĐ / Tháng
                                </div>

                                <div style={{ height: '1px', backgroundColor: 'var(--color-border)', marginBottom: '1.5rem' }} />

                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
                                    Quyền lợi bao gồm
                                </p>
                                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                    {pkg.benefits.map((b, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.9rem', color: 'var(--color-text)' }}>
                                            <CheckCircle2 size={16} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }} />
                                            {b}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button onClick={() => setStep(2)} style={{ ...btnPrimary, width: '100%', justifyContent: 'center', padding: '1rem' }}>
                                Tiếp tục <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    )}

                    {/* ── Step 2: Project Info ─────────────────────────── */}
                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                                Thông Tin Dự Án
                            </h2>
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                                Đặt tên cho dự án của bạn để AURA chuẩn bị tốt nhất.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                                <div>
                                    <label style={labelStyle}>Tên Dự Án *</label>
                                    <input
                                        type="text"
                                        placeholder={`Dự án ${pkg.name}`}
                                        value={projectName}
                                        onChange={e => setProjectName(e.target.value)}
                                        style={inputStyle}
                                    />
                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
                                        Để trống sẽ tự đặt tên theo gói dịch vụ
                                    </p>
                                </div>
                                <div>
                                    <label style={labelStyle}>Mô Tả / Yêu Cầu Đặc Biệt</label>
                                    <textarea
                                        placeholder="Mô tả ngắn về sản phẩm, phong cách, hay yêu cầu đặc biệt..."
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        rows={4}
                                        style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button onClick={() => setStep(1)} style={{ ...btnOutline, flex: '0 0 auto', padding: '1rem 1.5rem' }}>
                                    <ArrowLeft size={16} />
                                </button>
                                <button onClick={() => setStep(3)} style={{ ...btnPrimary, flex: 1, justifyContent: 'center', padding: '1rem' }}>
                                    Tiếp tục <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ── Step 3: Confirm ──────────────────────────────── */}
                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                                Xác Nhận & Đăng Ký
                            </h2>
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                                Kiểm tra lại thông tin trước khi xác nhận.
                            </p>

                            {/* Summary card */}
                            <div style={{
                                backgroundColor: 'var(--color-bg-secondary)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '16px', overflow: 'hidden', marginBottom: '1.5rem'
                            }}>
                                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Gói dịch vụ</span>
                                    <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>{pkg.name}</span>
                                </div>
                                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tên dự án</span>
                                    <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>{projectName.trim() || `Dự án ${pkg.name}`}</span>
                                </div>
                                {description.trim() && (
                                    <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.4rem' }}>Mô tả</span>
                                        <span style={{ fontSize: '0.875rem', color: 'var(--color-text)', lineHeight: 1.6 }}>{description}</span>
                                    </div>
                                )}
                                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                                    <label style={{ ...labelStyle, marginBottom: '1rem' }}>Chọn phương thức thanh toán</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <div
                                            onClick={() => setPaymentOption('deposit')}
                                            style={{
                                                padding: '1rem', borderRadius: '10px', border: `1px solid ${paymentOption === 'deposit' ? 'var(--color-accent)' : 'var(--color-border)'}`,
                                                backgroundColor: paymentOption === 'deposit' ? 'rgba(173,255,0,0.05)' : 'transparent',
                                                cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text)' }}>Đặt cọc 30%</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Thanh toán 70% còn lại sau khi hoàn thành</div>
                                            </div>
                                            {paymentOption === 'deposit' && <CheckCircle2 size={18} style={{ color: 'var(--color-accent)' }} />}
                                        </div>
                                        <div
                                            onClick={() => setPaymentOption('full')}
                                            style={{
                                                padding: '1rem', borderRadius: '10px', border: `1px solid ${paymentOption === 'full' ? 'var(--color-accent)' : 'var(--color-border)'}`,
                                                backgroundColor: paymentOption === 'full' ? 'rgba(173,255,0,0.05)' : 'transparent',
                                                cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text)' }}>Thanh toán 100%</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Ưu tiên xử lý nhanh dự án</div>
                                            </div>
                                            {paymentOption === 'full' && <CheckCircle2 size={18} style={{ color: 'var(--color-accent)' }} />}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text)', fontWeight: 600 }}>Tổng giá trị dự án</span>
                                    <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{formatPrice(pkg.price)}</span>
                                </div>
                                <div style={{ padding: '1.25rem 1.5rem', backgroundColor: 'rgba(173,255,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <span style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '1rem', display: 'block' }}>
                                            {paymentOption === 'deposit' ? 'Tiền đặt cọc (30%)' : 'Thanh toán ngay (100%)'}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Cần thanh toán để bắt đầu</span>
                                    </div>
                                    <span style={{ fontWeight: 900, color: 'var(--color-accent)', fontSize: '1.5rem' }}>
                                        {formatPrice(paymentOption === 'deposit' ? pkg.price * 0.3 : pkg.price)}
                                    </span>
                                </div>

                                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
                                    <label style={{ ...labelStyle, marginBottom: '1rem' }}>Thông tin thanh toán (Giả lập)</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                                            <input type="text" placeholder="Số thẻ (16 chữ số)" style={inputStyle} defaultValue="4242 4242 4242 4242" />
                                            <input type="text" placeholder="MM/YY" style={inputStyle} defaultValue="12/26" />
                                        </div>
                                        <input type="password" placeholder="Mã CVC" style={inputStyle} defaultValue="***" />
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                display: 'flex', alignItems: 'flex-start', gap: '10px',
                                backgroundColor: 'rgba(173,255,0,0.06)',
                                border: '1px solid rgba(173,255,0,0.3)',
                                borderRadius: '10px', padding: '1rem',
                                marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)'
                            }}>
                                <ShieldCheck size={16} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '1px' }} />
                                Bạn đang thực hiện thanh toán an toàn qua cổng AURA Pay. Toàn bộ thông tin được mã hóa.
                            </div>

                            {createError && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', padding: '0.875rem 1rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                                    <AlertCircle size={16} /> {createError}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button onClick={() => setStep(2)} disabled={creating || isPaying} style={{ ...btnOutline, flex: '0 0 auto', padding: '1rem 1.5rem' }}>
                                    <ArrowLeft size={16} />
                                </button>
                                <button onClick={handleFinalize} disabled={creating || isPaying} style={{ ...btnPrimary, flex: 1, justifyContent: 'center', padding: '1rem', opacity: (creating || isPaying) ? 0.7 : 1 }}>
                                    {isPaying ? (
                                        <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Đang xử lý thanh toán...</>
                                    ) : creating ? (
                                        <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Đang hoàn tất dự án...</>
                                    ) : (
                                        <><CheckCircle2 size={18} /> Xác Nhận & Thanh Toán</>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
    );
};

// ─── Shared styles ─────────────────────────────────────────────────
const btnPrimary: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '8px',
    backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)',
    padding: '0.7rem 1.5rem', fontSize: '0.9rem', fontWeight: 700,
    borderRadius: '8px', cursor: 'pointer', border: 'none', transition: 'opacity 0.2s',
};
const btnOutline: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '8px',
    backgroundColor: 'transparent', color: 'var(--color-text-muted)',
    padding: '0.7rem 1.25rem', fontSize: '0.875rem', fontWeight: 500,
    borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--color-border)',
};
const btnGhost: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '6px',
    backgroundColor: 'transparent', color: 'var(--color-text-muted)',
    padding: '0.4rem 0', fontSize: '0.875rem', fontWeight: 500,
    border: 'none', cursor: 'pointer',
};
const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.78rem', color: 'var(--color-text-muted)',
    marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
};
const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.85rem 1rem',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px', color: 'var(--color-text)',
    fontSize: '0.925rem', boxSizing: 'border-box',
    outline: 'none',
};

export default PurchasePackage;
