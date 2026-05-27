import React, { useEffect, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, ArrowLeft, FileText, User, ShieldCheck } from 'lucide-react';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { packageApi } from '../../services/packageApi';
import { projectApi } from '../../services/projectApi';
import { paymentApi, type SePayInfo } from '../../services/paymentApi';
import { useAuth } from '../../context/AuthContext';
import type { Package } from '../../types/package.types';
import type { Project } from '../../types/project.types';
import { useToast } from '../../components/ui/Toast';

// ─── Sub-components imports ──────────────────────────────────────
import { StepProgress } from '../../components/purchase/StepProgress';
import { Step1PackagePreview } from '../../components/purchase/Step1PackagePreview';
import { Step2ProjectInfo } from '../../components/purchase/Step2ProjectInfo';
import { Step3PaymentConfirm } from '../../components/purchase/Step3PaymentConfirm';
import { PaymentSuccessScreen } from '../../components/purchase/PaymentSuccessScreen';

// ─── Step indicators ─────────────────────────────────────────────
const STEPS = [
    { label: 'Xem lại gói', icon: FileText },
    { label: 'Thông tin dự án', icon: User },
    { label: 'Xác nhận', icon: ShieldCheck },
];

const PurchasePackage: React.FC = () => {
    const { showToast, ToastContainer } = useToast();
    const { packageId } = useParams<{ packageId: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const existingProjectId = searchParams.get('projectId');
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

    const [sepayInfo, setSepayInfo] = useState<SePayInfo | null>(null);
    const [paymentPolling, setPaymentPolling] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number>(15 * 60); // 15 minutes in seconds

    // Cancellation modal state
    const [showCancelModal, setShowCancelModal] = useState(false);

    // Redirect nếu chưa đăng nhập
    useEffect(() => {
        if (!user) navigate('/login', { state: { from: `/purchase/${packageId}` } });
    }, [user, packageId, navigate]);

    // Load package detail & SePay info
    useEffect(() => {
        if (!packageId) return;
        setLoadingPkg(true);
        
        const tasks: Promise<any>[] = [
            packageApi.getById(packageId),
            paymentApi.getSePayInfo()
        ];

        // Nếu có projectId, tải thêm thông tin dự án đó
        if (existingProjectId) {
            tasks.push(projectApi.getById(existingProjectId));
        }

        Promise.all(tasks).then(([pkgRes, payRes, projectRes]) => {
            if (pkgRes.data) setPkg(pkgRes.data);
            else setPkgError('Không tìm thấy gói dịch vụ.');
            
            if (payRes.data) setSepayInfo(payRes.data);

            if (projectRes && projectRes.data) {
                setCreatedProject(projectRes.data);
                setProjectName(projectRes.data.name);
                setDescription(projectRes.data.description || '');
                setStep(3); // Nhảy thẳng đến bước QR
                setPaymentPolling(true);
            }
        }).catch(() => setPkgError('Không thể tải thông tin.'))
          .finally(() => setLoadingPkg(false));
    }, [packageId, existingProjectId]);

    // Polling payment status
    useEffect(() => {
        let interval: any;
        let timerInterval: any;

        if (paymentPolling && createdProject) {
            // Polling API
            interval = setInterval(async () => {
                try {
                    const res = await projectApi.getById(createdProject.id);
                    if (res.data && res.data.status === 'InProduction') {
                        setCreatedProject(res.data);
                        setStep(4);
                        setPaymentPolling(false);
                        clearInterval(interval);
                        clearInterval(timerInterval);
                    }
                } catch (e) {
                    console.error("Polling error:", e);
                }
            }, 3000);

            // Countdown Timer
            timerInterval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerInterval);
                        clearInterval(interval);
                        setPaymentPolling(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            clearInterval(interval);
            clearInterval(timerInterval);
        };
    }, [paymentPolling, createdProject]);

    // ─── Callbacks & Handlers ─────────────────────────────────────
    const formatTime = useCallback((seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }, []);

    const formatPrice = useCallback((price: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price), []);

    const handleFinalize = useCallback(async () => {
        if (!pkg || !user) return;

        setCreating(true);
        setCreateError('');
        try {
            const res = await projectApi.create({
                name: projectName.trim() || `Dự án ${pkg.name}`,
                clientId: user.userId,
                packageId: pkg.id,
                description: description.trim() || undefined,
            });
            if (res.data) {
                setCreatedProject(res.data);
                setTimeLeft(15 * 60); // Reset 15 mins
                setPaymentPolling(true); // Bắt đầu đợi thanh toán
            } else {
                setCreateError(res.message || 'Tạo dự án thất bại.');
            }
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Tạo dự án thất bại.';
            setCreateError(msg);
        } finally {
            setCreating(false);
        }
    }, [pkg, user, projectName, description]);

    const handleCancelPayment = useCallback(async () => {
        if (!createdProject) return;
        
        try {
            await projectApi.cancel(createdProject.id);
            setCreatedProject(null);
            setPaymentPolling(false);
            setShowCancelModal(false);
            setStep(2); // Quay lại bước nhập thông tin
        } catch (e) {
            showToast('Không thể hủy dự án lúc này.', 'error');
        }
    }, [createdProject, showToast]);

    const getVietQRUrl = useCallback(() => {
        if (!sepayInfo || !pkg || !createdProject) return '';
        const bank = sepayInfo.bankId;
        const account = sepayInfo.accountNumber;
        const amount = pkg.price;
        const addInfo = `AURA ${createdProject.id.toUpperCase()}`;
        const name = encodeURIComponent(sepayInfo.accountName);
        
        return `https://img.vietqr.io/image/${bank}-${account}-qr_only.png?amount=${amount}&addInfo=${addInfo}&accountName=${name}`;
    }, [sepayInfo, pkg, createdProject]);

    const copyToClipboard = useCallback((text: string) => {
        navigator.clipboard.writeText(text);
        showToast('Đã sao chép vào bộ nhớ tạm!', 'success');
    }, [showToast]);

    const handleGoHome = useCallback(() => navigate('/'), [navigate]);
    const handleGoProjects = useCallback(() => navigate('/projects'), [navigate]);
    const handlePrevStep = useCallback(() => setStep(prev => prev - 1), []);
    const handleNextStep = useCallback(() => setStep(prev => prev + 1), []);

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
        <PaymentSuccessScreen 
            createdProject={createdProject}
            onGoHome={handleGoHome}
            onGoProjects={handleGoProjects}
            btnPrimary={btnPrimary}
            btnOutline={btnOutline}
        />
    );

    // ─── Main Purchase Flow ─────────────────────────────────────
    return (
        <div style={{ paddingTop: '100px', minHeight: '90vh', backgroundColor: 'var(--color-bg)' }} className="container">
            <div style={{ maxWidth: '680px', margin: '0 auto', paddingBottom: '5rem' }}>

                {/* Back button */}
                <button onClick={() => navigate('/packages')} style={{ ...btnGhost, marginBottom: '2rem' }}>
                    <ArrowLeft size={16} /> Quay lại gói dịch vụ
                </button>

                {/* Step Progress Bar (Memoized) */}
                <StepProgress step={step} steps={STEPS} />

                <AnimatePresence mode="wait">
                    {/* Step 1: Package Preview */}
                    {step === 1 && (
                        <Step1PackagePreview 
                            pkg={pkg}
                            formatPrice={formatPrice}
                            onNext={handleNextStep}
                            btnPrimary={btnPrimary}
                        />
                    )}

                    {/* Step 2: Project Info */}
                    {step === 2 && (
                        <Step2ProjectInfo 
                            pkgName={pkg.name}
                            projectName={projectName}
                            setProjectName={setProjectName}
                            description={description}
                            setDescription={setDescription}
                            onPrev={handlePrevStep}
                            onNext={handleNextStep}
                            btnPrimary={btnPrimary}
                            btnOutline={btnOutline}
                            labelStyle={labelStyle}
                            inputStyle={inputStyle}
                        />
                    )}

                    {/* Step 3: Confirm & QR Payment */}
                    {step === 3 && (
                        <Step3PaymentConfirm 
                            pkg={pkg}
                            projectName={projectName}
                            description={description}
                            user={user}
                            createdProject={createdProject}
                            sepayInfo={sepayInfo}
                            timeLeft={timeLeft}
                            formatTime={formatTime}
                            formatPrice={formatPrice}
                            getVietQRUrl={getVietQRUrl}
                            copyToClipboard={copyToClipboard}
                            creating={creating}
                            createError={createError}
                            handleFinalize={handleFinalize}
                            setShowCancelModal={setShowCancelModal}
                            onPrev={handlePrevStep}
                            btnPrimary={btnPrimary}
                            btnOutline={btnOutline}
                            labelStyle={labelStyle}
                        />
                    )}
                </AnimatePresence>

                <ConfirmModal 
                    isOpen={showCancelModal}
                    title="Hủy thanh toán"
                    message="Bạn có chắc chắn muốn hủy thanh toán và dự án này không? Thông tin dự án sẽ không được lưu lại."
                    confirmText="Xác nhận hủy"
                    onConfirm={handleCancelPayment}
                    onCancel={() => setShowCancelModal(false)}
                    type="danger"
                />

                <ToastContainer />
            </div>

            <style>{`
                @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
                @media (max-width: 480px) {
                    .purchase-steps span {
                        font-size: 0.6rem !important;
                    }
                    .purchase-steps .step-circle {
                        width: 30px !important;
                        height: 30px !important;
                        font-size: 0.75rem !important;
                    }
                    .qr-steps {
                        flex-direction: column !important;
                        gap: 0.5rem !important;
                    }
                    .qr-steps > div {
                        width: 100% !important;
                        box-sizing: border-box !important;
                    }
                }
            `}</style>
        </div>
    );
};

// ─── Shared styles ─────────────────────────────────────────────────
const btnPrimary: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '8px',
    backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)',
    padding: '0.7rem 1.5rem', fontSize: '0.9rem', fontWeight: 700,
    borderRadius: '8px', cursor: 'pointer', border: 'none',
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
    fontSize: '0.925rem', outline: 'none', boxSizing: 'border-box'
};

export default PurchasePackage;
