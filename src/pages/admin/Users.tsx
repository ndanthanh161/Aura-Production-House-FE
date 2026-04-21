import { User, Shield, MoreVertical } from 'lucide-react';

const users = [
    { id: 1, name: 'Marcus Valerius', email: 'marcus@auraproduction.com', role: 'Nhân viên', joined: 'Tháng 10 2023' },
    { id: 2, name: 'Elena Rossi', email: 'elena@auraproduction.com', role: 'Nhân viên', joined: 'Tháng 1 2024' },
    { id: 3, name: 'David Lee', email: 'david@auraproduction.com', role: 'Nhân viên', joined: 'Tháng 3 2024' },
    { id: 4, name: 'Sarah Jenkins', email: 'sarah@client.com', role: 'Người dùng', joined: 'Tháng 9 2024' },
];

const AdminUsers: React.FC = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header>
                <h1 style={{ fontSize: '2rem', color: 'var(--color-text)' }}>Quản Lý Người Dùng</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Quản lý vai trò và quyền truy cập cho khách hàng và nhân viên studio.</p>
            </header>

            <div style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                            <th style={{ padding: '1.25rem' }}>Họ và Tên</th>
                            <th style={{ padding: '1.25rem' }}>Email</th>
                            <th style={{ padding: '1.25rem' }}>Vai Trò</th>
                            <th style={{ padding: '1.25rem' }}>Đã Tham Gia</th>
                            <th style={{ padding: '1.25rem' }}>Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                                            <User size={16} />
                                        </div>
                                        <span style={{ color: 'var(--color-text)' }}>{u.name}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem', color: 'var(--color-text)' }}>{u.email}</td>
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: u.role === 'Nhân viên' ? 'var(--color-accent)' : 'var(--color-text)' }}>
                                        {u.role === 'Nhân viên' && <Shield size={14} />}
                                        <span style={{ fontSize: '0.875rem' }}>{u.role}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem', color: 'var(--color-text-muted)' }}>{u.joined}</td>
                                <td style={{ padding: '1.25rem' }}>
                                    <button style={{ color: 'var(--color-text-muted)' }}><MoreVertical size={18} /></button>
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
