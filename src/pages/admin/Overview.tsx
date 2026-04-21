import { motion } from 'framer-motion';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { DollarSign, ShoppingCart, Users, Briefcase } from 'lucide-react';

const data = [
    { name: 'Jan', revenue: 4000, orders: 24 },
    { name: 'Feb', revenue: 3000, orders: 18 },
    { name: 'Mar', revenue: 5000, orders: 29 },
    { name: 'Apr', revenue: 4500, orders: 22 },
    { name: 'May', revenue: 6000, orders: 35 },
    { name: 'Jun', revenue: 8000, orders: 48 },
];

const pieData = [
    { name: 'Photography', value: 400 },
    { name: 'Videography', value: 300 },
    { name: 'Branding', value: 300 },
];

const COLORS = ['#c5a059', '#1a1a1a', '#3a3a3a'];

const AdminOverview: React.FC = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header>
                <h1 style={{ fontSize: '2rem', color: 'var(--color-text)' }}>Tổng Quan Bảng Điều Khiển</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Quản lý hiệu suất kinh doanh và chỉ số của bạn.</p>
            </header>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {[
                    { label: 'Tổng Doanh Thu', value: '$45,231', icon: <DollarSign size={20} />, trend: '+12.5%' },
                    { label: 'Tổng Đơn Hàng', value: '124', icon: <ShoppingCart size={20} />, trend: '+8.2%' },
                    { label: 'Tổng Khách Hàng', value: '89', icon: <Users size={20} />, trend: '+5.4%' },
                    { label: 'Dự Án Đang Triển Khai', value: '18', icon: <Briefcase size={20} />, trend: '+2' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        style={{ backgroundColor: 'var(--color-bg-secondary)', padding: '1.5rem', border: '1px solid var(--color-border)' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ color: 'var(--color-accent)' }}>{stat.icon}</div>
                            <div style={{ color: '#22c55e', fontSize: '0.75rem', fontWeight: '600' }}>{stat.trend}</div>
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-text)' }}>{stat.value}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Charts row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div style={{ backgroundColor: 'var(--color-bg-secondary)', padding: '1.5rem', border: '1px solid var(--color-border)', minHeight: '400px' }}>
                    <h3 style={{ fontSize: '1.125rem', color: 'var(--color-text)', marginBottom: '2rem' }}>Phân Tích Doanh Thu</h3>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#c5a059" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#c5a059" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
                                    itemStyle={{ color: '#c5a059' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#c5a059" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div style={{ backgroundColor: 'var(--color-bg-secondary)', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
                    <h3 style={{ fontSize: '1.125rem', color: 'var(--color-text)', marginBottom: '2rem' }}>Phân Loại Dịch Vụ</h3>
                    <div style={{ width: '100%', height: '240px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                        {pieData.map((d, i) => (
                            <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS[i] }} />
                                    <span style={{ color: 'var(--color-text-muted)' }}>{d.name}</span>
                                </div>
                                <span style={{ color: 'var(--color-text)' }}>{d.value} đơn</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
