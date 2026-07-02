import React, { useEffect, useState, useCallback, useMemo } from 'react';
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

const INSTALLMENT_THRESHOLD = 10_000_000;

const getPaymentPlan = (total: number) => {
    if (total < INSTALLMENT_THRESHOLD) {
        return [{ installmentNumber: 1, percentage: 100, amount: total }];
    }

    const firstAmount = Math.round(total * 0.5);
    const secondAmount = Math.round(total * 0.25);

    return [
        { installmentNumber: 1, percentage: 50, amount: firstAmount },
        { installmentNumber: 2, percentage: 25, amount: secondAmount },
        { installmentNumber: 3, percentage: 25, amount: total - firstAmount - secondAmount },
    ];
};

const buildPaymentOptions = (project: Project | null, pkg: Package | null) => {
    if (!pkg) return [];

    const plan = getPaymentPlan(pkg.price);
    const fallbackNextAmount = plan[0].amount;
    const totalInstallments = project?.totalInstallments || plan.length;
    const paidAmount = project?.paidAmount ?? 0;
    const remainingAmount = Math.max(0, project?.remainingAmount ?? pkg.price);
    const nextInstallmentNumber = project?.nextInstallmentNumber ?? 1;
    const nextAmount = Math.min(
        remainingAmount,
        Math.max(0, project?.nextInstallmentAmount ?? fallbackNextAmount)
    );

    const options = nextAmount > 0
        ? [{
            id: 'next',
            label: totalInstallments > 1 ? `Thanh toán đợt ${nextInstallmentNumber}/${totalInstallments}` : 'Thanh toán 1 lần',
            description: totalInstallments > 1 ? 'Thanh toán theo lịch đợt tiếp theo.' : 'Thanh toán toàn bộ gói dịch vụ.',
            amount: nextAmount,
        }]
        : [];

    if (remainingAmount > nextAmount) {
        options.push({
            id: 'full',
            label: paidAmount > 0 ? 'Thanh toán toàn bộ còn lại' : 'Thanh toán 100%',
            description: 'Hoàn tất toàn bộ số tiền còn lại của dự án.',
            amount: remainingAmount,
        });
    }

    return options;
};

const getDefaultPaymentAmount = (project: Project | null, pkg: Package | null) =>
    buildPaymentOptions(project, pkg)[0]?.amount ?? 0;
const PurchasePackage: React.FC = () => {
    const { showToast, ToastContainer } = useToast();
    const { packageId } = useParams<{ packageId: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const existingProjectId = searchParams.get('projectId');
    const { user, isLoading: authLoading } = useAuth();

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
    const [paymentBaselinePaidAmount, setPaymentBaselinePaidAmount] = useState(0);
    const [selectedPaymentAmount, setSelectedPaymentAmount] = useState(0);
    const [timeLeft, setTimeLeft] = useState<number>(15 * 60); // 15 minutes in seconds

    // Cancellation modal state
    const [showCancelModal, setShowCancelModal] = useState(false);

    // Redirect nếu chưa đăng nhập
    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login', { state: { from: `/purchase/${packageId}` } });
        }
    }, [authLoading, user, packageId, navigate]);

    // Load package detail first so the purchase screen can render quickly.
    useEffect(() => {
        if (!packageId) return;
        setLoadingPkg(true);

        packageApi.getById(packageId)
            .then((pkgRes) => {
                if (pkgRes.data) setPkg(pkgRes.data);
                else setPkgError('Không tìm thấy gói dịch vụ.');
            })
            .catch(() => setPkgError('Không thể tải thông tin gói dịch vụ.'))
            .finally(() => setLoadingPkg(false));
    }, [packageId]);

    // Load payment/project data without blocking package preview.
    useEffect(() => {
        const tasks: Promise<any>[] = [paymentApi.getSePayInfo()];

        if (existingProjectId) {
            tasks.push(projectApi.getById(existingProjectId));
        }

        Promise.all(tasks).then(([payRes, projectRes]) => {
            if (payRes.data) setSepayInfo(payRes.data);

            if (projectRes && projectRes.data) {
                setCreatedProject(projectRes.data);
                setPaymentBaselinePaidAmount(projectRes.data.paidAmount ?? 0);
                setSelectedPaymentAmount(getDefaultPaymentAmount(projectRes.data, pkg));
                setProjectName(projectRes.data.name);
                setDescription(projectRes.data.description || '');
                setStep(3); // Nhảy thẳng đến bước QR
                setPaymentPolling(true);
            }
        }).catch(() => {
            if (existingProjectId) {
                setPkgError('Không thể tải thông tin dự án.');
            }
        });
    }, [existingProjectId, pkg]);

    // Polling payment status
    useEffect(() => {
        let interval: any;
        let timerInterval: any;

        if (paymentPolling && createdProject) {
            // Polling API
            interval = setInterval(async () => {
                try {
                    const res = await projectApi.getById(createdProject.id);
                    if (res.data && (res.data.paidAmount ?? 0) > paymentBaselinePaidAmount) {
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
    }, [paymentPolling, createdProject, paymentBaselinePaidAmount]);

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
                setPaymentBaselinePaidAmount(res.data.paidAmount ?? 0);
                setSelectedPaymentAmount((current) => current || getDefaultPaymentAmount(res.data, pkg));
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

    const handleCancelPayment = useCallback(() => {
        setPaymentPolling(false);
        setShowCancelModal(false);
        setTimeLeft(15 * 60);

        if (existingProjectId) {
            navigate('/projects');
            return;
        }

        setCreatedProject(null);
        setPaymentBaselinePaidAmount(0);
        setSelectedPaymentAmount(0);
        setStep(2);
    }, [existingProjectId, navigate]);

    const getVietQRUrl = useCallback(() => {
        if (!sepayInfo || !pkg || !createdProject) return '';
        const bank = sepayInfo.bankId;
        const account = sepayInfo.accountNumber;
        const amount = selectedPaymentAmount || getDefaultPaymentAmount(createdProject, pkg);
        const addInfo = `AURA ${createdProject.id.toUpperCase()}`;
        const name = encodeURIComponent(sepayInfo.accountName);
        
        return `https://img.vietqr.io/image/${bank}-${account}-qr_only.png?amount=${amount}&addInfo=${addInfo}&accountName=${name}`;
    }, [sepayInfo, pkg, createdProject, selectedPaymentAmount]);

    const copyToClipboard = useCallback((text: string) => {
        navigator.clipboard.writeText(text);
        showToast('Đã sao chép vào bộ nhớ tạm!', 'success');
    }, [showToast]);

    const handleGoHome = useCallback(() => navigate('/'), [navigate]);
    const handleGoProjects = useCallback(() => navigate('/projects'), [navigate]);
    const handlePrevStep = useCallback(() => setStep(prev => prev - 1), []);
    const handleNextStep = useCallback(() => setStep(prev => prev + 1), []);

    // ─── Loading / Error ────────────────────────────────────────
    const paymentOptions = useMemo(
        () => buildPaymentOptions(createdProject, pkg),
        [createdProject, pkg]
    );
    if (authLoading || loadingPkg) return (
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
                            paymentPlan={getPaymentPlan(pkg.price)}
                            paymentOptions={paymentOptions}
                            selectedPaymentAmount={selectedPaymentAmount || getDefaultPaymentAmount(createdProject, pkg)}
                            setSelectedPaymentAmount={setSelectedPaymentAmount}
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
                    message="Ban co chac chan muon huy phien thanh toan hien tai khong? Du an van duoc giu lai va ban co the thanh toan tiep sau."
                    confirmText="Huy phien thanh toan"
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
