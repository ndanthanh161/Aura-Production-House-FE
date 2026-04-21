import { Search, Eye } from 'lucide-react';

const allProjects = [
    { id: 1, name: 'Phim Thương Hiệu: Nexus', staff: 'Marcus V.', client: 'Nexus Tech', revenue: '$5,000', status: 'Đang Sản Xuất' },
    { id: 2, name: 'Biên Tập: Vogue Sub', staff: 'Elena R.', client: 'Vogue', revenue: '$2,500', status: 'Tiền Sản Xuất' },
    { id: 3, name: 'Chân Dung CEO', staff: 'Marcus V.', client: 'Sarah Jenkins', revenue: '$1,200', status: 'Hoàn Thành' },
    { id: 4, name: 'Chiến Dịch MXH', staff: 'David L.', client: 'Z-Store', revenue: '$1,800', status: 'Đang Sản Xuất' },
];

const AdminProjects: React.FC = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--color-text)' }}>Giám Sát Dự Án</h1>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm dự án..."
                        style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                    />
                </div>
            </header>

            <div style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                            <th style={{ padding: '1.25rem' }}>Tên Dự Án</th>
                            <th style={{ padding: '1.25rem' }}>Nhân Viên Phụ Trách</th>
                            <th style={{ padding: '1.25rem' }}>Khách Hàng</th>
                            <th style={{ padding: '1.25rem' }}>Doanh Thu</th>
                            <th style={{ padding: '1.25rem' }}>Trạng Thái</th>
                            <th style={{ padding: '1.25rem' }}>Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allProjects.map(p => (
                            <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '1.25rem', color: 'var(--color-text)' }}>{p.name}</td>
                                <td style={{ padding: '1.25rem', color: 'var(--color-text)' }}>{p.staff}</td>
                                <td style={{ padding: '1.25rem', color: 'var(--color-text)' }}>{p.client}</td>
                                <td style={{ padding: '1.25rem', color: 'var(--color-accent)' }}>{p.revenue}</td>
                                <td style={{ padding: '1.25rem' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        fontSize: '0.7rem',
                                        backgroundColor: p.status === 'Hoàn Thành' ? 'rgba(34,197,94,0.1)' : 'rgba(197,160,89,0.1)',
                                        color: p.status === 'Hoàn Thành' ? '#22c55e' : 'var(--color-accent)',
                                        borderRadius: '4px',
                                        textTransform: 'uppercase'
                                    }}>
                                        {p.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <button style={{ color: 'var(--color-text-muted)' }}><Eye size={18} /></button>
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
