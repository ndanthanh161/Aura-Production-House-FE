import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRight, BriefcaseBusiness, CalendarDays, CheckCircle2,
    CircleDollarSign, Clock3, Loader2, Mail, RefreshCw, UserRoundPlus,
} from 'lucide-react';
import { analyticsApi } from '../../services/analyticsApi';
import type { AnalyticsDashboard, OverviewProject } from '../../types/analytics.types';
import './analytics-dashboard.css';
import PaginatedContent from '../../components/admin/PaginatedContent';

const formatMoney = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);

const formatDateTime = (value: string) =>
    new Date(value).toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });

const isMembershipProject = (project: OverviewProject) =>
    /membership|hội viên/i.test(`${project.projectName} ${project.packageName}`);

const OverviewDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<AnalyticsDashboard | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await analyticsApi.getDashboard(1, 50);
            if (!response.data) throw new Error(response.message || 'API không trả về dữ liệu.');
            setData({
                ...response.data,
                overview: {
                    ...response.data.overview,
                    unassignedProjects: response.data.overview.unassignedProjects.filter(project => !isMembershipProject(project)),
                    upcomingProjects: response.data.overview.upcomingProjects.filter(project => !isMembershipProject(project)),
                },
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu tổng quan.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { void load(); }, [load]);

    if (loading) return <div className="analytics-loader"><Loader2 size={34} className="spin" /></div>;
    if (!data) return <div className="analytics-error">{error || 'Không có dữ liệu.'}</div>;

    const overview = data.overview;
    const kpis = [
        {
            label: 'Doanh thu tháng này', value: formatMoney(overview.revenueThisMonth),
            note: `${data.dashboard.paidProjects} dự án đã phát sinh thanh toán`, icon: CircleDollarSign,
        },
        {
            label: 'Dự án đang thực hiện', value: overview.projectsInProduction.toString(),
            note: `${data.dashboard.projectsScheduled} dự án đã lên lịch`, icon: BriefcaseBusiness,
        },
        {
            label: 'Tin nhắn chưa đọc', value: overview.unreadMessages.toString(),
            note: overview.unreadMessages > 0 ? 'Cần phản hồi khách hàng' : 'Đã xử lý toàn bộ', icon: Mail,
        },
    ];

    return (
        <div className="analytics-page">
            <header className="analytics-header">
                <div>
                    <p className="analytics-eyebrow">Tình hình hiện tại • Việc cần xử lý</p>
                    <h1 className="analytics-title">Tổng quan</h1>
                    <p className="analytics-subtitle">
                        Dữ liệu thực tế cập nhật lúc {new Date(data.generatedAt).toLocaleTimeString('vi-VN')}
                    </p>
                </div>
                <button className="analytics-button analytics-button--ghost" onClick={() => void load()}>
                    <RefreshCw size={15} /> Làm mới
                </button>
            </header>

            {error && <div className="analytics-error">{error}</div>}

            <section className="analytics-kpis">
                {kpis.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <motion.article key={item.label} className="analytics-card"
                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
                            <div className="analytics-card__top"><Icon size={20} /></div>
                            <div className="analytics-card__label">{item.label}</div>
                            <div className="analytics-card__value">{item.value}</div>
                            <div className="analytics-card__note">{item.note}</div>
                        </motion.article>
                    );
                })}
            </section>

            <section className="analytics-grid-2">
                <article className="analytics-panel">
                    <div className="analytics-panel__header">
                        <div>
                            <h2 className="analytics-panel__title">Việc cần xử lý hôm nay</h2>
                            <div className="analytics-panel__meta">Ưu tiên theo dữ liệu vận hành</div>
                        </div>
                    </div>
                    <PaginatedContent items={overview.unassignedProjects} pageSize={3}>
                        {({ items, pagination }) => <>
                            <div className="analytics-list">
                                {items.map(project => (
                                    <div className="analytics-list-item" key={project.projectId}>
                                        <div className="analytics-list-item__main">
                                            <div className="analytics-list-item__title">
                                                <UserRoundPlus size={15} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--color-accent)' }} />
                                                {project.projectName} chưa phân công Photographer
                                            </div>
                                            <div className="analytics-list-item__sub">{project.customerName} • {project.packageName}</div>
                                        </div>
                                        <button className="analytics-button analytics-button--ghost" onClick={() => navigate('/admin/projects')}>
                                            Phân công <ArrowRight size={13} />
                                        </button>
                                    </div>
                                ))}
                                {overview.unreadMessages > 0 && (
                                    <div className="analytics-list-item">
                                        <div className="analytics-list-item__main">
                                            <div className="analytics-list-item__title"><Mail size={15} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--color-accent)' }} />{overview.unreadMessages} tin nhắn khách hàng chưa đọc</div>
                                            <div className="analytics-list-item__sub">Kiểm tra và phản hồi khách hàng sớm nhất có thể</div>
                                        </div>
                                        <button className="analytics-button analytics-button--ghost" onClick={() => navigate('/admin/contacts')}>
                                            Xem tin nhắn <ArrowRight size={13} />
                                        </button>
                                    </div>
                                )}
                                {overview.unassignedProjects.length === 0 && overview.unreadMessages === 0 && (
                                    <div className="analytics-empty"><div><CheckCircle2 size={28} className="analytics-positive" /><br />Không có công việc tồn đọng.</div></div>
                                )}
                            </div>
                            {pagination}
                        </>}
                    </PaginatedContent>
                </article>

                <article className="analytics-panel">
                    <div className="analytics-panel__header">
                        <div>
                            <h2 className="analytics-panel__title">Lịch sắp tới</h2>
                            <div className="analytics-panel__meta">Các dự án sản xuất sắp tới</div>
                        </div>
                        <CalendarDays size={18} color="var(--color-accent)" />
                    </div>
                    <PaginatedContent items={overview.upcomingProjects} pageSize={3}>
                        {({ items, pagination }) => <>
                            <div className="analytics-list">
                                {items.map(project => (
                                    <div className="analytics-list-item" key={project.projectId}>
                                        <div className="analytics-list-item__main">
                                            <div className="analytics-list-item__title">{project.projectName}</div>
                                            <div className="analytics-list-item__sub">
                                                <Clock3 size={12} style={{ verticalAlign: 'middle', marginRight: 5 }} />
                                                {formatDateTime(project.deadline)} • {project.photographerName || 'Chưa phân công'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {overview.upcomingProjects.length === 0 && <div className="analytics-empty">Chưa có dự án sắp tới.</div>}
                            </div>
                            {pagination}
                        </>}
                    </PaginatedContent>
                </article>
            </section>

            <section className="analytics-panel">
                <div className="analytics-panel__header">
                    <div>
                        <h2 className="analytics-panel__title">Hoạt động gần đây</h2>
                        <div className="analytics-panel__meta">Các khoản thanh toán đã được backend xác nhận</div>
                    </div>
                </div>
                <PaginatedContent items={overview.recentPayments} pageSize={5}>
                    {({ items, pagination }) => <>
                    <div className="analytics-list">
                    {items.map(payment => (
                        <div className="analytics-list-item" key={payment.paymentId}>
                            <div className="analytics-list-item__main">
                                <div className="analytics-list-item__title">{payment.projectName} vừa thanh toán {formatMoney(payment.amount)}</div>
                                <div className="analytics-list-item__sub">{formatDateTime(payment.paidAt)} • {payment.customerName} • {payment.packageName} • {payment.transactionId}</div>
                            </div>
                            <span className="analytics-badge"><CheckCircle2 size={12} /> Thành công</span>
                        </div>
                    ))}
                    {overview.recentPayments.length === 0 && <div className="analytics-empty">Chưa có giao dịch thành công.</div>}
                    </div>
                    {pagination}
                    </>}
                </PaginatedContent>
            </section>
        </div>
    );
};

export default OverviewDashboard;
