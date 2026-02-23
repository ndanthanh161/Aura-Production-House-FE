import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MoreHorizontal, ExternalLink } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const projects = [
    { id: 1, name: 'Brand Film: Nexus', client: 'Nexus Tech', package: 'Executive', deadline: 'Oct 24, 2024', status: 'In Production' },
    { id: 2, name: 'Editorial: Vogue Sub', client: 'Vogue', package: 'Premium', deadline: 'Oct 28, 2024', status: 'Pre-Production' },
    { id: 3, name: 'CEO Portrait', client: 'Sarah Jenkins', package: 'Essential', deadline: 'Nov 02, 2024', status: 'Scheduled' },
    { id: 4, name: 'Cyberpunk Vision', client: 'Future Labs', package: 'Premium', deadline: 'Nov 15, 2024', status: 'In Production' },
];

const StaffProjects: React.FC = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Projects</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Manage and track your assigned production projects.</p>
                </div>
                <Button size="sm">Create New Project</Button>
            </header>

            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 3rem',
                            backgroundColor: 'var(--color-bg-secondary)',
                            border: '1px solid var(--color-border)',
                            color: '#fff',
                            fontSize: '0.875rem'
                        }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1rem', border: '1px solid var(--color-border)', fontSize: '0.875rem' }}>
                        <Filter size={16} /> Filter
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {projects.map((p, i) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        style={{
                            backgroundColor: 'var(--color-bg-secondary)',
                            border: '1px solid var(--color-border)',
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{p.package}</span>
                            <button style={{ color: 'var(--color-text-muted)' }}><MoreHorizontal size={18} /></button>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{p.name}</h3>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Client: {p.client}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                            <div style={{ fontSize: '0.75rem' }}>
                                <div style={{ color: 'var(--color-text-muted)' }}>Deadline</div>
                                <div style={{ color: '#fff' }}>{p.deadline}</div>
                            </div>
                            <button style={{ color: 'var(--color-accent)' }}><ExternalLink size={18} /></button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default StaffProjects;
