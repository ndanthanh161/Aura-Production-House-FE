import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts';
import { 
    TrendingUp, Loader2, Target, 
    Activity, Star, Zap
} from 'lucide-react';
import { statisticsApi } from '../../services/statisticsApi';
import type { DashboardStats, MonthlyRevenue, StaffPerformance } from '../../types/statistics.types';

const fmtMoney = (n: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const COLORS = ['#c5a059', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const AdminStatistics: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [revenue, setRevenue] = useState<MonthlyRevenue[]>([]);
    const [performance, setPerformance] = useState<StaffPerformance[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const [s, r, p] = await Promise.all([
                    statisticsApi.getDashboard(),
                    statisticsApi.getMonthlyRevenue(12),
                    statisticsApi.getStaffPerformance(),
                ]);
                setStats(s.data);
                setRevenue(r.data || []);
                setPerformance(p.data || []);
            } catch (err) {
                console.error('Failed to load stats:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
            <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-accent)' }} />
        </div>
    );

    const revenueByPackageData = stats?.revenueByPackage 
        ? Object.entries(stats.revenueByPackage).map(([name, value]) => ({ name, value }))
        : [];

    const funnelData = stats ? [
        { name: 'Tổng Booking', value: stats.totalBookings, fill: '#3b82f6', context: 'Nhu cầu thị trường' },
        { name: 'Đã Thanh Toán', value: stats.totalProjects - stats.projectsScheduled - stats.projectsCancelled, fill: '#f59e0b', context: 'Hiệu quả chuyển đổi' },
        { name: 'Hoàn Thành', value: stats.projectsCompleted, fill: '#22c55e', context: 'Năng lực triển khai' },
    ] : [];

    const analysisCards = [
        { 
            group: 'HIỆU QUẢ KINH DOANH',
            items: [
                { label: 'Doanh Thu Trung Bình (AOV)', value: fmtMoney(stats?.averageOrderValue || 0), desc: 'Độ lớn trung bình mỗi đơn hàng', icon: <Target size={18} />, color: 'var(--color-text-muted)' },
                { label: 'Tăng Trưởng Doanh Thu', value: `${stats?.revenueGrowth || 0}%`, desc: 'Tốc độ phát triển so với tháng trước', icon: <TrendingUp size={18} />, color: 'var(--color-text-muted)' }
            ]
        },
        { 
            group: 'HIỆU SUẤT VẬN HÀNH',
            items: [
                { label: 'Tỉ Lệ Chuyển Đổi (CR)', value: `${stats?.conversionRate || 0}%`, desc: 'Khả năng chốt đơn thành công', icon: <Zap size={18} />, color: 'var(--color-text-muted)' },
                { label: 'Tỉ Lệ Hoàn Thành', value: stats?.totalProjects ? `${((stats.projectsCompleted / stats.totalProjects) * 100).toFixed(1)}%` : '0%', desc: 'Tỉ lệ bàn giao dự án đúng hạn', icon: <Star size={18} />, color: 'var(--color-text-muted)' }
            ]
        }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <header>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>BÁO CÁO CHIẾN LƯỢC</h1>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', backgroundColor: 'rgba(255,255,255,0.03)', padding: '4px 12px', borderRadius: '20px', border: '1px solid var(--color-border)' }}>Dữ liệu sạch</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', backgroundColor: 'rgba(255,255,255,0.03)', padding: '4px 12px', borderRadius: '20px', border: '1px solid var(--color-border)' }}>Thời gian thực</div>
                    </div>
                </div>
                <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px' }}>Phân tích chuyên sâu về các chỉ số sức khỏe doanh nghiệp, hỗ trợ tối ưu hóa quy trình vận hành và chiến lược tăng trưởng.</p>
            </header>

            {/* Strategy KPIs grouped by story */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {analysisCards.map((group, gIdx) => (
                    <div key={group.group}>
                        <h4 style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                            {group.group}
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {group.items.map((item, i) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: (gIdx * 2 + i) * 0.1 }}
                                    style={{
                                        backgroundColor: 'var(--color-bg-secondary)',
                                        padding: '1.25rem',
                                        borderRadius: '12px',
                                        border: '1px solid var(--color-border)',
                                    }}
                                >
                                    <div style={{ color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>{item.icon}</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)' }}>{item.value}</div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text)', marginTop: '2px' }}>{item.label}</div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>{item.desc}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Trend Chart Section */}
            <section>
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>Phân Tích Xu Hướng & Tăng Trưởng</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Mối tương quan giữa doanh thu và khối lượng dự án qua các tháng.</p>
                </div>
                <div style={{ backgroundColor: 'var(--color-bg-secondary)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                    <ResponsiveContainer width="100%" height={320}>
                        <AreaChart data={revenue.map(r => ({ ...r, name: `T${r.month}/${r.year}` }))}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} strokeOpacity={0.5} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={11} tick={{ fill: 'var(--color-text-muted)' }} />
                            <YAxis axisLine={false} tickLine={false} fontSize={10} tickFormatter={v => `${(v/1000000).toFixed(0)}M`} tick={{ fill: 'var(--color-text-muted)' }} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                formatter={(v: any) => [fmtMoney(v), 'Doanh thu']}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="var(--color-accent)" strokeWidth={3} fill="url(#colorRev)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* Deep Dive Breakdown Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem' }}>
                {/* Revenue Composition */}
                <div style={{ backgroundColor: 'var(--color-bg-secondary)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Cơ Cấu Doanh Thu</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Phân bổ tỉ trọng theo gói dịch vụ.</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                            <Pie
                                data={revenueByPackageData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={85}
                                paddingAngle={8}
                                dataKey="value"
                            >
                                {revenueByPackageData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip formatter={(v: any) => fmtMoney(v)} />
                            <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '0.7rem', paddingTop: '20px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Conversion Funnel */}
                <div style={{ backgroundColor: 'var(--color-bg-secondary)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Hiệu Quả Phễu Chuyển Đổi</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Hành trình từ nhu cầu đến bàn giao thực tế.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                        {funnelData.map((item, idx) => {
                            const percent = ((item.value / (funnelData[0]?.value || 1)) * 100).toFixed(0);
                            return (
                                <div key={item.name} style={{ position: 'relative' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                                        <span style={{ color: 'var(--color-text)', fontWeight: 600 }}>{item.name}</span>
                                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{item.value} đơn vị — <span style={{ color: 'var(--color-text)', fontWeight: 700 }}>{percent}%</span></span>
                                    </div>
                                    <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percent}%` }}
                                            transition={{ duration: 1.2, delay: idx * 0.2 }}
                                            style={{ height: '100%', backgroundColor: 'var(--color-accent)', borderRadius: '4px', opacity: 0.8 }}
                                        />
                                    </div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginTop: '4px', fontStyle: 'italic' }}>{item.context}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* High Performance Leaderboard */}
            <section style={{ backgroundColor: 'var(--color-bg-secondary)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Xếp Hạng Nhân Sự Xuất Sắc</h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Top 5 Photographer đóng góp doanh thu lớn nhất.</p>
                    </div>
                    <button style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, padding: '6px 16px', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: 'transparent' }}>Xem tất cả</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                    {performance.slice(0, 5).map((p, idx) => (
                        <div key={p.staffId} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                            <div style={{ 
                                width: '40px', height: '40px', borderRadius: '12px', 
                                backgroundColor: 'rgba(255,255,255,0.05)', 
                                color: 'var(--color-text)', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem' 
                            }}>
                                {idx + 1}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)' }}>{p.staffName}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{p.completed} dự án • {((p.completed / (p.totalAssigned || 1)) * 100).toFixed(0)}% hiệu suất</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 800, color: 'var(--color-accent)', fontSize: '1rem' }}>{fmtMoney(p.totalRevenue)}</div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Đóng góp</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default AdminStatistics;
