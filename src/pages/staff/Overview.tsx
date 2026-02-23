import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle2, Clock, Bell } from 'lucide-react';

const stats = [
    { label: 'Active Projects', value: '12', icon: <Briefcase size={20} />, color: 'var(--color-accent)' },
    { label: 'In Progress', value: '8', icon: <Clock size={20} />, color: '#3b82f6' },
    { label: 'Completed', value: '45', icon: <CheckCircle2 size={20} />, color: '#22c55e' },
];

const activeProjects = [
    { id: 1, name: 'Brand Film: Nexus', client: 'Nexus Tech', deadline: 'Oct 24, 2024', status: 'In Production' },
    { id: 2, name: 'Editorial: Vogue Sub', client: 'Vogue', deadline: 'Oct 28, 2024', status: 'Pre-Production' },
    { id: 3, name: 'CEO Portrait', client: 'Sarah Jenkins', deadline: 'Nov 02, 2024', status: 'Scheduled' },
];

const StaffOverview: React.FC = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Overview</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Welcome back, Creative Director.</p>
                </div>
                <button style={{ position: 'relative', color: 'var(--color-text-muted)' }}>
                    <Bell size={24} />
                    <span style={{ position: 'absolute', top: -2, right: -2, width: '10px', height: '10px', backgroundColor: 'var(--color-accent)', borderRadius: '50%', border: '2px solid var(--color-bg)' }} />
                </button>
            </header>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        style={{
                            padding: '1.5rem',
                            backgroundColor: 'var(--color-bg-secondary)',
                            border: '1px solid var(--color-border)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.5rem'
                        }}
                    >
                        <div style={{ padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stat.value}</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{stat.label}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Active Projects Table */}
            <section style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Active Projects</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                                <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Project Name</th>
                                <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Client</th>
                                <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Deadline</th>
                                <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeProjects.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '1rem', color: '#fff' }}>{p.name}</td>
                                    <td style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>{p.client}</td>
                                    <td style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>{p.deadline}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            backgroundColor: 'rgba(197,160,89,0.1)',
                                            color: 'var(--color-accent)',
                                            fontSize: '0.75rem',
                                            borderRadius: '4px'
                                        }}>
                                            {p.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default StaffOverview;
