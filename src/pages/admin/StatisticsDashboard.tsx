import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import {
    BarChart3, CheckCircle2, CircleDollarSign, Download, Loader2,
    Medal, RefreshCw, ShoppingBag, Target, TrendingDown, TrendingUp,
} from 'lucide-react';
import { analyticsApi } from '../../services/analyticsApi';
import type { AnalyticsDashboard, PackageRanking } from '../../types/analytics.types';
import './analytics-dashboard.css';
import PaginatedContent from '../../components/admin/PaginatedContent';

type RankingMode = 'orders' | 'revenue' | 'growth';

const formatMoney = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);

const formatCompactMoney = (value: number) => {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}T`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}Tr`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}N`;
    return value.toLocaleString('vi-VN');
};

const formatDate = (value: string) => new Date(value).toLocaleDateString('vi-VN');

const sortRanking = (rows: PackageRanking[], mode: RankingMode) => [...rows].sort((a, b) => {
    if (mode === 'revenue') return b.revenue - a.revenue || b.orderCount - a.orderCount;
    if (mode === 'growth') return b.growth - a.growth || b.revenue - a.revenue;
    return b.orderCount - a.orderCount || b.revenue - a.revenue;
});

const escapeCsv = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;

const StatisticsDashboard: React.FC = () => {
    const [months, setMonths] = useState(12);
    const [rankingMode, setRankingMode] = useState<RankingMode>('orders');
    const [data, setData] = useState<AnalyticsDashboard | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await analyticsApi.getDashboard(months, 20);
            if (!response.data) throw new Error(response.message || 'API không trả về dữ liệu.');
            setData(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu thống kê.');
        } finally {
            setLoading(false);
        }
    }, [months]);

    useEffect(() => { void load(); }, [load]);

    const ranking = useMemo(() => sortRanking(data?.packageRanking ?? [], rankingMode), [data, rankingMode]);
    const chartData = useMemo(() => (data?.monthlyRevenue ?? []).map(row => ({
        label: `T${row.month}/${String(row.year).slice(-2)}`,
        revenue: row.revenue,
        projects: row.projectCount,
    })), [data]);

    const exportCsv = () => {
        if (!data) return;
        const lines = [
            ['Hạng', 'Gói dịch vụ', 'Số đơn', 'Doanh thu', 'Tỷ trọng', 'Tăng trưởng'].map(escapeCsv).join(','),
            ...ranking.map((row, index) => [
                index + 1, row.packageName, row.orderCount, row.revenue, `${row.revenueShare}%`, `${row.growth}%`,
            ].map(escapeCsv).join(',')),
            '',
            ['Thời gian', 'Mã giao dịch', 'Dự án', 'Khách hàng', 'Gói dịch vụ', 'Số tiền', 'Trạng thái'].map(escapeCsv).join(','),
            ...data.recentPayments.map(payment => [
                formatDate(payment.paidAt), payment.transactionId, payment.projectName, payment.customerName,
                payment.packageName, payment.amount, payment.status,
            ].map(escapeCsv).join(',')),
        ];
        const blob = new Blob([`\uFEFF${lines.join('\n')}`], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `aura-thong-ke-${new Date().toISOString().slice(0, 10)}.csv`;
        anchor.click();
        URL.revokeObjectURL(url);
    };

    if (loading && !data) return <div className="analytics-loader"><Loader2 size={34} /></div>;
    if (!data) return <div className="analytics-error">{error || 'Không có dữ liệu.'}</div>;

    const stats = data.dashboard;
    const nonCancelledProjects = Math.max(0, stats.totalProjects - stats.projectsCancelled);
    const completionRate = nonCancelledProjects > 0 ? (stats.projectsCompleted / nonCancelledProjects * 100) : 0;
    const kpis = [
        { label: 'Doanh thu thực thu', value: formatMoney(stats.totalRevenue), note: `${stats.paidProjects} dự án đã thanh toán`, icon: CircleDollarSign },
        { label: 'Tăng trưởng tháng', value: `${stats.revenueGrowth > 0 ? '+' : ''}${stats.revenueGrowth}%`, note: `Kỳ trước ${formatMoney(stats.revenueLastMonth)}`, icon: stats.revenueGrowth >= 0 ? TrendingUp : TrendingDown },
        { label: 'Giá trị đơn trung bình', value: formatMoney(stats.averageOrderValue), note: 'Doanh thu / dự án đã thanh toán', icon: Target },
        { label: 'Tỷ lệ chuyển đổi', value: `${stats.conversionRate}%`, note: `${stats.paidProjects}/${stats.totalProjects} dự án`, icon: BarChart3 },
    ];

    const rankingModeLabel: Record<RankingMode, string> = {
        orders: 'Mua nhiều nhất', revenue: 'Doanh thu cao nhất', growth: 'Tăng trưởng tốt nhất',
    };

    return (
        <div className="analytics-page">
            <header className="analytics-header">
                <div>
                    <p className="analytics-eyebrow">Phân tích xu hướng • Đánh giá hiệu quả</p>
                    <h1 className="analytics-title">Thống kê kinh doanh</h1>
                    <p className="analytics-subtitle">
                        Dữ liệu thanh toán thành công từ {formatDate(data.periodStart)} đến {formatDate(data.periodEnd)}
                    </p>
                </div>
                <div className="analytics-controls">
                    <select className="analytics-select" value={months} onChange={event => setMonths(Number(event.target.value))}>
                        <option value={3}>3 tháng gần nhất</option>
                        <option value={6}>6 tháng gần nhất</option>
                        <option value={12}>12 tháng gần nhất</option>
                        <option value={24}>24 tháng gần nhất</option>
                    </select>
                    <select className="analytics-select" value={rankingMode} onChange={event => setRankingMode(event.target.value as RankingMode)}>
                        <option value="orders">Mua nhiều nhất</option>
                        <option value="revenue">Doanh thu cao nhất</option>
                        <option value="growth">Tăng trưởng tốt nhất</option>
                    </select>
                    <button className="analytics-button analytics-button--ghost" onClick={() => void load()} disabled={loading}>
                        <RefreshCw size={14} /> Làm mới
                    </button>
                    <button className="analytics-button analytics-button--gold" onClick={exportCsv}>
                        <Download size={14} /> Xuất báo cáo
                    </button>
                </div>
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
                            <div className={`analytics-card__value ${item.label === 'Tăng trưởng tháng' ? (stats.revenueGrowth >= 0 ? 'analytics-positive' : 'analytics-danger') : ''}`}>{item.value}</div>
                            <div className="analytics-card__note">{item.note}</div>
                        </motion.article>
                    );
                })}
            </section>

            <section className="analytics-grid-2">
                <article className="analytics-panel">
                    <div className="analytics-panel__header">
                        <div>
                            <h2 className="analytics-panel__title">Xu hướng doanh thu {months} tháng</h2>
                            <div className="analytics-panel__meta">Chỉ tính giao dịch có trạng thái Completed</div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={285}>
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="analyticsRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#d5ad64" stopOpacity={0.42} />
                                    <stop offset="95%" stopColor="#d5ad64" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.08)" vertical={false} />
                            <XAxis dataKey="label" tick={{ fill: '#898989', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tickFormatter={formatCompactMoney} tick={{ fill: '#898989', fontSize: 10 }} axisLine={false} tickLine={false} width={52} />
                            <Tooltip
                                contentStyle={{ background: '#101010', border: '1px solid #323232', borderRadius: 8 }}
                                labelStyle={{ color: '#d5ad64' }}
                                formatter={(value) => [formatMoney(Number(value ?? 0)), 'Doanh thu']}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#d5ad64" strokeWidth={2.5} fill="url(#analyticsRevenue)" dot={{ r: 3, fill: '#d5ad64' }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </article>

                <article className="analytics-panel">
                    <div className="analytics-panel__header">
                        <div>
                            <h2 className="analytics-panel__title">Top gói được mua nhiều nhất</h2>
                            <div className="analytics-panel__meta">{rankingModeLabel[rankingMode]}</div>
                        </div>
                        <Medal size={19} color="var(--color-accent)" />
                    </div>
                    <div className="analytics-top-packages">
                        {ranking.slice(0, 3).map((row, index) => (
                            <div className="analytics-top-package" key={row.packageId}>
                                <span className={`analytics-rank analytics-rank--${index + 1}`}>{String(index + 1).padStart(2, '0')}</span>
                                <div className="analytics-list-item__main">
                                    <div className="analytics-list-item__title">{row.packageName}</div>
                                    <div className="analytics-list-item__sub">{row.orderCount} đơn • {row.revenueShare}% doanh thu</div>
                                </div>
                                <strong style={{ fontSize: '0.76rem' }}>{formatMoney(row.revenue)}</strong>
                            </div>
                        ))}
                        {ranking.length === 0 && <div className="analytics-empty">Chưa có gói dịch vụ.</div>}
                    </div>
                </article>
            </section>

            <section className="analytics-panel">
                <div className="analytics-panel__header">
                    <div>
                        <h2 className="analytics-panel__title">Xếp hạng gói dịch vụ</h2>
                        <div className="analytics-panel__meta">Mỗi dự án có thanh toán thành công chỉ tính là một lượt mua</div>
                    </div>
                </div>
                <PaginatedContent items={ranking} pageSize={5}>
                    {({ items, startIndex, pagination }) => <>
                    <div className="analytics-table-wrap">
                    <table className="analytics-table">
                        <thead><tr><th>Hạng</th><th>Gói dịch vụ</th><th>Số đơn</th><th>Doanh thu</th><th>Tỷ trọng</th><th>Tăng trưởng</th></tr></thead>
                        <tbody>
                            {items.map((row, index) => (
                                <tr key={row.packageId}>
                                    <td><span className={`analytics-rank ${startIndex + index < 3 ? `analytics-rank--${startIndex + index + 1}` : ''}`}>{startIndex + index + 1}</span></td>
                                    <td><strong>{row.packageName}</strong></td>
                                    <td>{row.orderCount}</td>
                                    <td>{formatMoney(row.revenue)}</td>
                                    <td>{row.revenueShare}%</td>
                                    <td className={row.growth > 0 ? 'analytics-positive' : row.growth < 0 ? 'analytics-danger' : ''}>{row.growth > 0 ? '+' : ''}{row.growth}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                        {pagination}
                    </>}
                </PaginatedContent>

            </section>
            <section className="analytics-grid-equal">
                <article className="analytics-panel">
                    <div className="analytics-panel__header"><h2 className="analytics-panel__title">Phễu chuyển đổi</h2></div>
                    <div className="analytics-funnel">
                        <div className="analytics-funnel__step"><div className="analytics-funnel__label">Dự án tạo</div><div className="analytics-funnel__value">{stats.totalProjects}</div></div>
                        <div className="analytics-funnel__step"><div className="analytics-funnel__label">Đã thanh toán</div><div className="analytics-funnel__value">{stats.paidProjects}</div></div>
                        <div className="analytics-funnel__step"><div className="analytics-funnel__label">Hoàn thành</div><div className="analytics-funnel__value">{stats.projectsCompleted}</div></div>
                    </div>
                    <div className="analytics-panel__meta" style={{ marginTop: '0.7rem' }}>Tỷ lệ hoàn thành: {completionRate.toFixed(1)}%</div>
                </article>

                <article className="analytics-panel">
                    <div className="analytics-panel__header"><h2 className="analytics-panel__title">Hiệu suất Photographer</h2></div>
                    <PaginatedContent items={data.photographerPerformance} pageSize={4}>
                        {({ items, startIndex, pagination }) => <>
                            <div className="analytics-list">
                        {items.map((person, index) => (
                            <div className="analytics-list-item" key={person.photographerId}>
                                <div className="analytics-list-item__main">
                                    <div className="analytics-list-item__title">#{startIndex + index + 1} {person.photographerName}</div>
                                    <div className="analytics-list-item__sub">{person.completed}/{person.totalAssigned} dự án hoàn thành</div>
                                </div>
                                <strong>{formatMoney(person.totalRevenue)}</strong>
                            </div>
                        ))}
                        {data.photographerPerformance.length === 0 && <div className="analytics-empty">Chưa có Photographer.</div>}
                    </div>
                            {pagination}
                        </>}
                    </PaginatedContent>

                </article>
            </section>
            <section className="analytics-panel">
                <div className="analytics-panel__header">
                    <div>
                        <h2 className="analytics-panel__title">Chi tiết doanh thu</h2>
                        <div className="analytics-panel__meta">Các giao dịch thành công gần nhất</div>
                    </div>
                    <ShoppingBag size={18} color="var(--color-accent)" />
                </div>
                <PaginatedContent items={data.recentPayments} pageSize={5}>
                    {({ items, pagination }) => <>
                <div className="analytics-table-wrap">
                    <table className="analytics-table">
                        <thead><tr><th>Thời gian</th><th>Mã giao dịch</th><th>Dự án</th><th>Khách hàng</th><th>Gói dịch vụ</th><th>Số tiền</th><th>Trạng thái</th></tr></thead>
                        <tbody>
                            {items.map(payment => (
                                <tr key={payment.paymentId}>
                                    <td>{formatDate(payment.paidAt)}</td>
                                    <td>{payment.transactionId}</td>
                                    <td><strong>{payment.projectName}</strong></td>
                                    <td>{payment.customerName}</td>
                                    <td>{payment.packageName}</td>
                                    <td><strong>{formatMoney(payment.amount)}</strong></td>
                                    <td><span className="analytics-badge"><CheckCircle2 size={11} /> Thành công</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {data.recentPayments.length === 0 && <div className="analytics-empty">Chưa có giao dịch thành công.</div>}
                </div>
                        {pagination}
                    </>}
                </PaginatedContent>
            </section>
        </div>
    );
};

export default StatisticsDashboard;
