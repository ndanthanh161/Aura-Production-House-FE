import { User, Shield, MoreVertical } from 'lucide-react';

const users = [
    { id: 1, name: 'Marcus Valerius', email: 'marcus@auraproduction.com', role: 'Staff', joined: 'Oct 2023' },
    { id: 2, name: 'Elena Rossi', email: 'elena@auraproduction.com', role: 'Staff', joined: 'Jan 2024' },
    { id: 3, name: 'David Lee', email: 'david@auraproduction.com', role: 'Staff', joined: 'Mar 2024' },
    { id: 4, name: 'Sarah Jenkins', email: 'sarah@client.com', role: 'User', joined: 'Sep 2024' },
];

const AdminUsers: React.FC = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header>
                <h1 style={{ fontSize: '2rem', color: '#fff' }}>User Management</h1>
                <p style={{ color: 'rgba(255,255,255,0.5)' }}>Manage roles and access for both clients and studio staff.</p>
            </header>

            <div style={{ backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #1a1a1a', color: 'rgba(255,255,255,0.3)' }}>
                            <th style={{ padding: '1.25rem' }}>Full Name</th>
                            <th style={{ padding: '1.25rem' }}>Email</th>
                            <th style={{ padding: '1.25rem' }}>Role</th>
                            <th style={{ padding: '1.25rem' }}>Joined</th>
                            <th style={{ padding: '1.25rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}>
                                            <User size={16} />
                                        </div>
                                        <span style={{ color: '#fff' }}>{u.name}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem', color: 'rgba(255,255,255,0.7)' }}>{u.email}</td>
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: u.role === 'Staff' ? 'var(--color-accent)' : '#fff' }}>
                                        {u.role === 'Staff' && <Shield size={14} />}
                                        <span style={{ fontSize: '0.875rem' }}>{u.role}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem', color: 'rgba(255,255,255,0.5)' }}>{u.joined}</td>
                                <td style={{ padding: '1.25rem' }}>
                                    <button style={{ color: 'rgba(255,255,255,0.5)' }}><MoreVertical size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;
