import { Search, Eye } from 'lucide-react';

const allProjects = [
    { id: 1, name: 'Brand Film: Nexus', staff: 'Marcus V.', client: 'Nexus Tech', revenue: '$5,000', status: 'In Production' },
    { id: 2, name: 'Editorial: Vogue Sub', staff: 'Elena R.', client: 'Vogue', revenue: '$2,500', status: 'Pre-Production' },
    { id: 3, name: 'CEO Portrait', staff: 'Marcus V.', client: 'Sarah Jenkins', revenue: '$1,200', status: 'Completed' },
    { id: 4, name: 'Social Campaign', staff: 'David L.', client: 'Z-Store', revenue: '$1,800', status: 'In Production' },
];

const AdminProjects: React.FC = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '2rem', color: '#fff' }}>Project Oversight</h1>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a', color: '#fff' }}
                    />
                </div>
            </header>

            <div style={{ backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #1a1a1a', color: 'rgba(255,255,255,0.3)' }}>
                            <th style={{ padding: '1.25rem' }}>Project Name</th>
                            <th style={{ padding: '1.25rem' }}>Assigned Staff</th>
                            <th style={{ padding: '1.25rem' }}>Client</th>
                            <th style={{ padding: '1.25rem' }}>Revenue</th>
                            <th style={{ padding: '1.25rem' }}>Status</th>
                            <th style={{ padding: '1.25rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allProjects.map(p => (
                            <tr key={p.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                                <td style={{ padding: '1.25rem', color: '#fff' }}>{p.name}</td>
                                <td style={{ padding: '1.25rem', color: 'rgba(255,255,255,0.7)' }}>{p.staff}</td>
                                <td style={{ padding: '1.25rem', color: 'rgba(255,255,255,0.7)' }}>{p.client}</td>
                                <td style={{ padding: '1.25rem', color: 'var(--color-accent)' }}>{p.revenue}</td>
                                <td style={{ padding: '1.25rem' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        fontSize: '0.7rem',
                                        backgroundColor: p.status === 'Completed' ? 'rgba(34,197,94,0.1)' : 'rgba(197,160,89,0.1)',
                                        color: p.status === 'Completed' ? '#22c55e' : 'var(--color-accent)',
                                        borderRadius: '4px',
                                        textTransform: 'uppercase'
                                    }}>
                                        {p.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <button style={{ color: 'rgba(255,255,255,0.5)' }}><Eye size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProjects;
