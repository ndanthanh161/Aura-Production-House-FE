import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
<<<<<<< Updated upstream
import { X, RefreshCw, Ban, Search, Loader2, CheckCircle, UserPlus, Edit3, ExternalLink } from 'lucide-react';
=======
import { X, RefreshCw, Ban, Search, Loader2, CheckCircle, UserPlus, Edit3, ExternalLink, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
>>>>>>> Stashed changes
import { projectApi } from '../../services/projectApi';
import { photographerApi } from '../../services/userApi';
import type { Project, ProjectStatus, UpdateProjectRequest } from '../../types/project.types';
import type { UserDTO } from '../../types/user.types';

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string }> = {
    Scheduled: { label: 'Đã lên lịch', color: '#3b82f6' },
    InProduction: { label: 'Đang thực hiện', color: '#f59e0b' },
    Completed: { label: 'Hoàn thành', color: '#22c55e' },
    Cancelled: { label: 'Đã hủy', color: '#ef4444' },
};

const AdminBookings: React.FC = () => {
    const pageSize = 5;
    const [bookings, setBookings] = useState<Project[]>([]);
    const [filtered, setFiltered] = useState<Project[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [rescheduleId, setRescheduleId] = useState<string | null>(null);
    const [assignId, setAssignId] = useState<string | null>(null);
    const [photographers, setPhotographers] = useState<UserDTO[]>([]);
    const [selectedPhotographer, setSelectedPhotographer] = useState('');
    const [newDate, setNewDate] = useState('');

    // Edit/Update state
    const [statusUpdateId, setStatusUpdateId] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>('InProduction');
    const [resultLink, setResultLink] = useState('');

    const [saving, setSaving] = useState(false);
    const [viewProject, setViewProject] = useState<Project | null>(null);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const [bRes, pRes] = await Promise.all([
                projectApi.getSchedules({ from: fromDate || undefined, to: toDate || undefined }),
                photographerApi.getAll()
            ]);
            setBookings(bRes.data || []);
            setFiltered(bRes.data || []);
            setPhotographers(pRes.data || []);
        } catch {
            setError('Không thể tải dữ liệu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBookings(); }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(bookings.filter(b =>
            b.name.toLowerCase().includes(q) ||
            (b.clientName || '').toLowerCase().includes(q) ||
            (b.staffName || '').toLowerCase().includes(q)
        ));
        setCurrentPage(1);
    }, [search, bookings]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const pagedBookings = filtered.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

    const handleReschedule = async () => {
        if (!rescheduleId || !newDate) return;
        setSaving(true);
        try {
            await projectApi.reschedule({ projectId: rescheduleId, newShootingDate: new Date(newDate).toISOString() });
            setRescheduleId(null);
            setNewDate('');
            fetchBookings();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Đổi lịch thất bại.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = async (id: string, name: string) => {
        if (!confirm(`Hủy dự án "${name}"?`)) return;
        try {
            await projectApi.cancel(id);
            fetchBookings();
        } catch {
            setError('Hủy booking thất bại.');
        }
    };

    const handleAssign = async () => {
        if (!assignId || !selectedPhotographer) return;
        setSaving(true);
        try {
            await projectApi.assignPhotographer(assignId, selectedPhotographer);
            setAssignId(null);
            setSelectedPhotographer('');
            fetchBookings();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Phân công thất bại.');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateProject = async () => {
        if (!statusUpdateId) return;
        const project = bookings.find(b => b.id === statusUpdateId);
        if (!project) return;

        setSaving(true);
        try {
            const updateReq: UpdateProjectRequest = {
                id: project.id,
                name: project.name,
                staffId: project.staffId,
                status: selectedStatus,
                revenue: project.revenue,

                deadline: project.deadline,
                description: project.description,
                resultLink: resultLink
            };
            await projectApi.update(updateReq);
            setStatusUpdateId(null);
            setResultLink('');
            fetchBookings();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Cập nhật thất bại.');
        } finally {
            setSaving(false);
        }
    };

    const openStatusModal = (project: Project) => {
        setStatusUpdateId(project.id);
        setSelectedStatus(project.status);
        setResultLink(project.resultLink || '');
    };

<<<<<<< Updated upstream
=======
    const getRequiredPaymentAmount = (project: Project) =>
        project.nextInstallmentAmount ?? project.remainingAmount ?? project.revenue;

    const getPaymentLabel = (project: Project) => {
        if ((project.remainingAmount ?? project.revenue) <= 0) return 'Da thanh toan du';
        if (project.totalInstallments > 1 && project.nextInstallmentNumber) {
            return `Dot ${project.nextInstallmentNumber}/${project.totalInstallments}`;
        }
        return 'Thanh toan 1 lan';
    };

    const openPaymentConfirmModal = (project: Project) => {
        setPaymentConfirmProject(project);
        setTxId('');
        setTxAmount(getRequiredPaymentAmount(project));
        setPaymentError('');
        setSuccess('');
    };

    const handleConfirmPayment = async () => {
        if (!paymentConfirmProject || !txId || txAmount <= 0) return;

        const remainingAmount = paymentConfirmProject.remainingAmount ?? paymentConfirmProject.revenue;
        if (txAmount > remainingAmount) {
            setPaymentError(`So tien nhap (${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(txAmount)}) lon hon so tien con lai cua du an (${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(remainingAmount)}).`);
            return;
        }

        setSaving(true);
        setPaymentError('');
        try {
            await paymentApi.manualConfirm({
                projectId: paymentConfirmProject.id,
                transferAmount: txAmount,
                transactionId: txId
            });
            setPaymentConfirmProject(null);
            setSuccess(`Phê duyệt thanh toán cho dự án "${paymentConfirmProject.name}" thành công!`);
            fetchBookings();
        } catch (err: any) {
            setPaymentError(err.message || 'Xác nhận thanh toán thất bại.');
        } finally {
            setSaving(false);
        }
    };

>>>>>>> Stashed changes
    const fmtDate = (d: string) => new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const fmtCurrency = (n?: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n ?? 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--color-text)' }}>Quản Lý Dự Án</h1>
                <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Lịch chụp ảnh và trạng thái các dự án</p>
            </header>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ position: 'relative', flex: '1 1 200px' }}>
                    <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input placeholder="Tìm tên dự án, khách hàng..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: '36px' }} />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} style={{ ...inputStyle, width: 'auto' }} />
                    <span style={{ color: 'var(--color-text-muted)' }}>→</span>
                    <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} style={{ ...inputStyle, width: 'auto' }} />
                    <button onClick={fetchBookings} style={btnSecondary}><RefreshCw size={15} /></button>
                </div>
            </div>

            {error && <div style={alertStyle}>{error} <button onClick={() => setError('')}><X size={14} /></button></div>}

            {loading ? (
                <div style={centerStyle}><Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-accent)' }} /></div>
            ) : (
                <div style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                                {['Dự án', 'Khách hàng', 'Photographer', 'Giá gói', 'Ngày hoàn thành', 'Trạng thái', 'Thao tác'].map(h => (
                                    <th key={h} style={{ padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {pagedBookings.map((b, i) => {
                                const cfg = STATUS_CONFIG[b.status] || STATUS_CONFIG.Scheduled;
                                const fmtMoney = (n?: number) => n ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n) : '—';
                                const paidAmount = b.paidAmount ?? 0;
                                const remainingAmount = b.remainingAmount ?? Math.max(0, b.revenue - paidAmount);
                                const progress = b.revenue > 0 ? Math.min(100, Math.round((paidAmount / b.revenue) * 100)) : 0;
                                const paymentLabel = getPaymentLabel(b);
                                const nextAmount = getRequiredPaymentAmount(b);
                                return (
                                    <motion.tr key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                                        style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div
                                                onClick={() => setViewProject(b)}
                                                style={{ fontWeight: 600, color: 'var(--color-accent)', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline' }}
                                            >
                                                {b.name}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{b.packageName}</div>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text)', fontSize: '0.875rem' }}>{b.clientName}</td>
                                        <td style={{ padding: '1rem 1.25rem', color: b.staffName ? 'var(--color-text)' : 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                            {b.staffName || '—'}
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text)', fontSize: '0.875rem', minWidth: '210px' }}>
                                            <div style={{ fontWeight: 700 }}>{fmtMoney(b.revenue)}</div>
                                            <div style={{ marginTop: '8px', height: '5px', width: '100%', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                                                <div style={{ width: `${progress}%`, height: '100%', backgroundColor: remainingAmount <= 0 ? '#22c55e' : 'var(--color-accent)' }} />
                                            </div>
                                            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.7rem', lineHeight: 1.35 }}>
                                                <span style={{ color: '#22c55e' }}>Da thanh toan: {fmtMoney(paidAmount)} ({b.paidInstallments ?? 0}/{b.totalInstallments || 1} dot)</span>
                                                <span style={{ color: remainingAmount > 0 ? '#f59e0b' : '#22c55e' }}>Con lai: {fmtMoney(remainingAmount)}</span>
                                                {remainingAmount > 0 && <span style={{ color: 'var(--color-text-muted)' }}>Tiep theo: {paymentLabel} - {fmtMoney(nextAmount)}</span>}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text)', fontSize: '0.875rem' }}>
                                                {fmtDate(b.deadline)}
                                            </div>
                                        </td>

                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 600, color: cfg.color }}>
                                                    {cfg.label}
                                                </span>
                                                {b.resultLink && (
                                                    <a href={b.resultLink} target="_blank" rel="noreferrer" style={{ fontSize: '0.7rem', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <ExternalLink size={10} /> Đã có link Drive
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {b.status !== 'Cancelled' && b.status !== 'Completed' && (
                                                    <>
<<<<<<< Updated upstream
=======
                                                        {remainingAmount > 0 && (
                                                            <button onClick={() => openPaymentConfirmModal(b)} style={btnIconSuccess} title="Xác nhận thanh toán thủ công">
                                                                <CreditCard size={15} />
                                                            </button>
                                                        )}
>>>>>>> Stashed changes
                                                        <button onClick={() => { setRescheduleId(b.id); setNewDate(''); }} style={btnIcon} title="Đổi lịch">
                                                            <RefreshCw size={15} />
                                                        </button>
                                                        <button onClick={() => { setAssignId(b.id); setSelectedPhotographer(b.staffId || ''); }} style={btnIcon} title="Phân công">
                                                            <UserPlus size={15} />
                                                        </button>
                                                        <button onClick={() => handleCancel(b.id, b.name)} style={btnIconDanger} title="Hủy">
                                                            <Ban size={15} />
                                                        </button>
                                                    </>
                                                )}
                                                {b.status !== 'Cancelled' && (
                                                    <button onClick={() => openStatusModal(b)} style={btnIcon} title="Cập nhật trạng thái & link Drive">
                                                        <Edit3 size={15} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                            {filtered.length === 0 && (
                                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Không có booking nào.</td></tr>
                            )}
                        </tbody>
                    </table>
                    {filtered.length > pageSize && (
                        <div style={paginationStyle}>
                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                                Trang {safeCurrentPage}/{totalPages} - hien thi {pagedBookings.length}/{filtered.length}
                            </span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={safeCurrentPage === 1}
                                    style={{ ...btnSecondary, opacity: safeCurrentPage === 1 ? 0.45 : 1 }}
                                >
                                    <ChevronLeft size={14} /> Truoc
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={safeCurrentPage === totalPages}
                                    style={{ ...btnSecondary, opacity: safeCurrentPage === totalPages ? 0.45 : 1 }}
                                >
                                    Sau <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    )}                </div>
            )}

            {/* Project Details Modal */}
            {viewProject && (
                <div style={overlayStyle} onClick={e => e.target === e.currentTarget && setViewProject(null)}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ ...modalStyle, maxWidth: '600px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                            <div>
                                <h2 style={{ fontWeight: 800, color: 'var(--color-accent)', fontSize: '1.5rem' }}>Chi tiết dự án</h2>
                                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Mã: {viewProject.id}</p>
                            </div>
                            <button onClick={() => setViewProject(null)} style={{ color: 'var(--color-text-muted)', height: 'fit-content', background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div>
                                <label style={labelStyle}>Tên dự án</label>
                                <p style={{ fontWeight: 600, color: 'var(--color-text)' }}>{viewProject.name}</p>
                            </div>
                            <div>
                                <label style={labelStyle}>Gói dịch vụ</label>
                                <p style={{ fontWeight: 600, color: 'var(--color-text)' }}>{viewProject.packageName}</p>
                            </div>
                            <div>
                                <label style={labelStyle}>Khách hàng</label>
                                <p style={{ color: 'var(--color-text)' }}>{viewProject.clientName}</p>
                            </div>
                            <div>
                                <label style={labelStyle}>Photographer</label>
                                <p style={{ color: 'var(--color-text)' }}>{viewProject.staffName || 'Chưa phân công'}</p>
                            </div>
                            <div>
                                <label style={labelStyle}>Ngày chụp dự kiến</label>
                                <p style={{ color: 'var(--color-text)' }}>{fmtDate(viewProject.deadline)}</p>
                            </div>
                            <div>
                                <label style={labelStyle}>Tổng doanh thu</label>
                                <p style={{ fontWeight: 700, color: 'var(--color-accent)' }}>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(viewProject.revenue)}
                                </p>
                            </div>
                        </div>

                        <div style={{ padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                            <label style={labelStyle}>Yêu cầu đặc biệt từ khách hàng</label>
                            <p style={{
                                whiteSpace: 'pre-wrap',
                                fontSize: '0.95rem',
                                color: 'var(--color-text)',
                                lineHeight: 1.6,
                                fontStyle: viewProject.description ? 'normal' : 'italic'
                            }}>
                                {viewProject.description || 'Không có ghi chú thêm.'}
                            </p>
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => setViewProject(null)} style={btnPrimary}>Đóng</button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Reschedule Modal */}
            {rescheduleId && (
                <div style={overlayStyle} onClick={e => e.target === e.currentTarget && setRescheduleId(null)}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={modalStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontWeight: 700, color: 'var(--color-text)' }}>Ngày Hoàn Thành</h2>
                            <button onClick={() => setRescheduleId(null)} style={{ color: 'var(--color-text-muted)' }}><X size={20} /></button>
                        </div>
                        <label style={labelStyle}>Ngày hoàn thành mới *</label>
                        <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} style={{ ...inputStyle, marginBottom: '1.25rem' }} />
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button onClick={handleReschedule} disabled={!newDate || saving} style={{ ...btnPrimary, flex: 1, justifyContent: 'center' }}>
                                {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <RefreshCw size={16} />} Xác Nhận
                            </button>
                            <button onClick={() => setRescheduleId(null)} style={btnSecondary}>Huỷ</button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Assign Photographer Modal */}
            {assignId && (
                <div style={overlayStyle} onClick={e => e.target === e.currentTarget && setAssignId(null)}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={modalStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontWeight: 700, color: 'var(--color-text)' }}>Phân Công Photographer</h2>
                            <button onClick={() => setAssignId(null)} style={{ color: 'var(--color-text-muted)' }}><X size={20} /></button>
                        </div>
                        <label style={labelStyle}>Chọn Photographer *</label>
                        <select
                            value={selectedPhotographer}
                            onChange={e => setSelectedPhotographer(e.target.value)}
                            style={{ ...inputStyle, marginBottom: '1.25rem', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
                        >
                            <option value="">-- Chọn Photographer --</option>
                            {photographers.map(p => (
                                <option key={p.id} value={p.id}>{p.fullName} ({p.email})</option>
                            ))}
                        </select>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button onClick={handleAssign} disabled={!selectedPhotographer || saving} style={{ ...btnPrimary, flex: 1, justifyContent: 'center' }}>
                                {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <UserPlus size={16} />} Xác Nhận
                            </button>
                            <button onClick={() => setAssignId(null)} style={btnSecondary}>Huỷ</button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Status & ResultLink Update Modal */}
            {statusUpdateId && (
                <div style={overlayStyle} onClick={e => e.target === e.currentTarget && setStatusUpdateId(null)}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={modalStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontWeight: 700, color: 'var(--color-text)' }}>Cập Nhật Dự Án</h2>
                            <button onClick={() => setStatusUpdateId(null)} style={{ color: 'var(--color-text-muted)' }}><X size={20} /></button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={labelStyle}>Trạng thái dự án</label>
                                <select
                                    value={selectedStatus}
                                    disabled={bookings.find(b => b.id === statusUpdateId)?.status === 'Completed'}
                                    onChange={e => setSelectedStatus(e.target.value as ProjectStatus)}
                                    style={{
                                        ...inputStyle,
                                        opacity: bookings.find(b => b.id === statusUpdateId)?.status === 'Completed' ? 0.6 : 1,
                                        cursor: bookings.find(b => b.id === statusUpdateId)?.status === 'Completed' ? 'not-allowed' : 'pointer',
                                        appearance: 'none',
                                        backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 1rem center',
                                        backgroundSize: '1em'
                                    }}
                                >
                                    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                                        <option key={key} value={key}>{cfg.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={labelStyle}>Link bàn giao (Google Drive)</label>
                                <input
                                    type="url"
                                    placeholder="https://drive.google.com/..."
                                    value={resultLink}
                                    onChange={e => setResultLink(e.target.value)}
                                    style={inputStyle}
                                />
                                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>Khách hàng sẽ thấy link này trong mục "Dự án của tôi"</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button onClick={handleUpdateProject} disabled={saving} style={{ ...btnPrimary, flex: 1, justifyContent: 'center' }}>
                                {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={16} />} Lưu Thay Đổi
                            </button>
                            <button onClick={() => setStatusUpdateId(null)} style={btnSecondary}>Huỷ</button>
                        </div>
                    </motion.div>
                </div>
            )}

<<<<<<< Updated upstream
=======
            {/* Payment Manual Confirmation Modal */}
            {paymentConfirmProject && (
                <div style={overlayStyle} onClick={e => e.target === e.currentTarget && setPaymentConfirmProject(null)}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={modalStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontWeight: 700, color: 'var(--color-text)' }}>Xác Nhận Thanh Toán</h2>
                            <button onClick={() => setPaymentConfirmProject(null)} style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                        </div>

                        {paymentError && (
                            <div style={{ ...alertStyle, marginBottom: '1.25rem' }}>
                                <span>{paymentError}</span>
                                <button onClick={() => setPaymentError('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}><X size={14} /></button>
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={labelStyle}>Dự án</label>
                                <p style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.95rem' }}>{paymentConfirmProject.name}</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Khách hàng: {paymentConfirmProject.clientName}</p>
                                <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.03)', display: 'grid', gap: '0.45rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                                        <span style={{ color: 'var(--color-text-muted)' }}>Trang thai thanh toan</span>
                                        <strong style={{ color: 'var(--color-accent)' }}>{getPaymentLabel(paymentConfirmProject)}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                                        <span style={{ color: 'var(--color-text-muted)' }}>Da thanh toan</span>
                                        <strong style={{ color: '#22c55e' }}>{fmtCurrency(paymentConfirmProject.paidAmount)}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                                        <span style={{ color: 'var(--color-text-muted)' }}>Con lai</span>
                                        <strong style={{ color: '#f59e0b' }}>{fmtCurrency(paymentConfirmProject.remainingAmount)}</strong>
                                    </div>
                                    {(paymentConfirmProject.remainingAmount ?? 0) > 0 && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                                            <span style={{ color: 'var(--color-text-muted)' }}>Can thu tiep</span>
                                            <strong style={{ color: 'var(--color-text)' }}>{fmtCurrency(getRequiredPaymentAmount(paymentConfirmProject))}</strong>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}>Mã giao dịch (Transaction ID) *</label>
                                <input
                                    type="text"
                                    placeholder="Ví dụ: FT2615482390 hoặc ID SePay"
                                    value={txId}
                                    onChange={e => setTxId(e.target.value)}
                                    style={inputStyle}
                                    required
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Số tiền thanh toán (VND) *</label>
                                <input
                                    type="number"
                                    placeholder="Nhập số tiền"
                                    value={txAmount || ''}
                                    onChange={e => setTxAmount(Number(e.target.value))}
                                    style={inputStyle}
                                    required
                                />
                                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
                                    Goi y thu dot hien tai: {fmtCurrency(getRequiredPaymentAmount(paymentConfirmProject))}. Co the thu mot phan, toi da: {fmtCurrency(paymentConfirmProject.remainingAmount)}
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button 
                                onClick={handleConfirmPayment} 
                                disabled={saving || !txId || txAmount <= 0} 
                                style={{ 
                                    ...btnPrimary, 
                                    flex: 1, 
                                    justifyContent: 'center', 
                                    opacity: (saving || !txId || txAmount <= 0) ? 0.6 : 1,
                                    cursor: (saving || !txId || txAmount <= 0) ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={16} />} Phê Duyệt
                            </button>
                            <button onClick={() => setPaymentConfirmProject(null)} style={btnSecondary}>Huỷ</button>
                        </div>
                    </motion.div>
                </div>
            )}

>>>>>>> Stashed changes
            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
    );
};

const btnPrimary: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)', padding: '0.6rem 1.25rem', fontSize: '0.875rem', fontWeight: 600, borderRadius: '6px', cursor: 'pointer', border: 'none' };
const btnSecondary: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'transparent', color: 'var(--color-text-muted)', padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500, borderRadius: '6px', cursor: 'pointer', border: '1px solid var(--color-border)' };
const btnIcon: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-muted)' };
const btnIconDanger: React.CSSProperties = { ...btnIcon, border: 'none', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' };
<<<<<<< Updated upstream
=======
const btnIconSuccess: React.CSSProperties = { ...btnIcon, border: 'none', backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e' };
const paginationStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderTop: '1px solid var(--color-border)', flexWrap: 'wrap' };
>>>>>>> Stashed changes
const alertStyle: React.CSSProperties = { backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const centerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem' };
const overlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalStyle: React.CSSProperties = { backgroundColor: 'var(--color-bg-secondary)', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '440px', border: '1px solid var(--color-border)' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.7rem 0.9rem', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text)', fontSize: '0.9rem', boxSizing: 'border-box' };

export default AdminBookings;
