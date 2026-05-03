import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MoreHorizontal, ExternalLink, Loader2, Calendar, User, Package as PackageIcon, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { projectApi } from '../../services/projectApi';
import type { Project, ProjectStatus } from '../../types/project.types';

const STATUS_LABELS: Record<ProjectStatus, string> = {
    Scheduled: 'Đã lên lịch',
    InProduction: 'Đang thực hiện',
    Completed: 'Hoàn thành',
    Cancelled: 'Đã hủy',
};

const STATUS_COLORS: Record<ProjectStatus, string> = {
    Scheduled: '#3b82f6',
    InProduction: '#f59e0b',
    Completed: '#22c55e',
    Cancelled: '#ef4444',
};

const PhotographerProjects: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [viewProject, setViewProject] = useState<Project | null>(null);
    const [updating, setUpdating] = useState(false);
    const [editForm, setEditForm] = useState({ status: '' as ProjectStatus, resultLink: '' });

    const fetchMyProjects = async () => {
        try {
            setLoading(true);
            const res = await projectApi.getSchedules();
            setProjects(res.data || []);
        } catch (err) {
            console.error('Failed to fetch staff projects', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyProjects();
    }, []);

    const handleOpenDetails = (p: Project) => {
        setViewProject(p);
        setEditForm({ status: p.status, resultLink: p.resultLink || '' });
    };

    const handleUpdate = async () => {
        if (!viewProject) return;
        try {
            setUpdating(true);
            await projectApi.update({
                id: viewProject.id,
                name: viewProject.name,
                status: editForm.status,
                resultLink: editForm.resultLink,
                deadline: viewProject.deadline,
                staffId: viewProject.staffId,
                revenue: viewProject.revenue
            });
            setViewProject(null);
            fetchMyProjects();
        } catch (err) {
            console.error('Update failed', err);
            alert('Cập nhật thất bại.');
        } finally {
            setUpdating(false);
        }
    };

    const filteredProjects = projects.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.clientName || '').toLowerCase().includes(search.toLowerCase())
    );

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Dự Án Của Tôi</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Quản lý và theo dõi các dự án sản xuất được giao cho bạn.</p>
                </div>
            </header>

            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm dự án hoặc khách hàng..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 3rem',
                            backgroundColor: 'var(--color-bg-secondary)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text)',
                            fontSize: '0.875rem'
                        }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Button variant="outline" size="sm" onClick={fetchMyProjects}>
                        Làm mới
                    </Button>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '4rem', textAlign: 'center' }}>
                    <Loader2 className="animate-spin" style={{ color: 'var(--color-accent)', margin: '0 auto' }} />
                    <style>{`
                        .animate-spin { animation: spin 1s linear infinite; }
                        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    `}</style>
                </div>
            ) : filteredProjects.length === 0 ? (
                <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: 'var(--color-bg-secondary)', border: '1px dashed var(--color-border)' }}>
                    <p style={{ color: 'var(--color-text-muted)' }}>Không tìm thấy dự án nào được giao.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {filteredProjects.map((p, i) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            style={{
                                backgroundColor: 'var(--color-bg-secondary)',
                                border: '1px solid var(--color-border)',
                                padding: '1.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.25rem',
                                position: 'relative'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <span style={{ 
                                    fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em',
                                    color: STATUS_COLORS[p.status] || 'var(--color-accent)'
                                }}>
                                    {STATUS_LABELS[p.status] || p.status}
                                </span>
                                <button style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>
                            
                            <div>
                                <h3 
                                    onClick={() => handleOpenDetails(p)}
                                    style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-accent)', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    {p.name}
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <User size={14} /> {p.clientName}
                                    </p>
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <PackageIcon size={14} /> {p.packageName}
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                                <div style={{ fontSize: '0.75rem' }}>
                                    <div style={{ color: 'var(--color-text-muted)', marginBottom: '2px' }}>Hạn chót / Ngày chụp</div>
                                    <div style={{ color: 'var(--color-text)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Calendar size={14} style={{ color: 'var(--color-accent)' }} />
                                        {formatDate(p.deadline)}
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" style={{ padding: '4px' }}>
                                    <ExternalLink size={18} />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Project Details Modal */}
            {viewProject && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem'
                }} onClick={e => e.target === e.currentTarget && setViewProject(null)}>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            backgroundColor: 'var(--color-bg-secondary)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '500px'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-accent)' }}>Chi tiết công việc</h2>
                            <button onClick={() => setViewProject(null)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            <div>
                                <label style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Tên dự án</label>
                                <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{viewProject.name}</p>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Khách hàng</label>
                                    <p>{viewProject.clientName}</p>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Gói dịch vụ</label>
                                    <p>{viewProject.packageName}</p>
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Ngày chụp / Hạn chót</label>
                                <p style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{formatDate(viewProject.deadline)}</p>
                            </div>
                            <div style={{ 
                                padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', 
                                borderRadius: '8px', border: '1px solid var(--color-border)' 
                            }}>
                                <label style={labelStyle}>Yêu cầu từ khách hàng</label>
                                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', fontStyle: 'italic', lineHeight: 1.5 }}>
                                    {viewProject.description || 'Không có yêu cầu đặc biệt.'}
                                </p>
                            </div>

                            <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '0.5rem 0' }} />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={labelStyle}>Trạng thái công việc</label>
                                    <select 
                                        value={editForm.status} 
                                        onChange={e => setEditForm(prev => ({ ...prev, status: e.target.value as ProjectStatus }))}
                                        style={inputStyle}
                                    >
                                        <option value="InProduction">Đang thực hiện</option>
                                        <option value="Completed">Hoàn thành</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Link bàn giao (Google Drive)</label>
                                    <input 
                                        type="url" 
                                        placeholder="https://drive.google.com/..."
                                        value={editForm.resultLink}
                                        onChange={e => setEditForm(prev => ({ ...prev, resultLink: e.target.value }))}
                                        style={inputStyle}
                                    />
                                    <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Khách hàng sẽ nhận được link này sau khi bạn nhấn Lưu.</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Button onClick={handleUpdate} disabled={updating} style={{ flex: 1 }}>
                                {updating ? <Loader2 size={16} className="animate-spin" /> : 'Lưu cập nhật'}
                            </Button>
                            <Button variant="outline" onClick={() => setViewProject(null)}>Đóng</Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

const labelStyle: React.CSSProperties = { fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.4rem', display: 'block' };
const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.75rem', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', 
    borderRadius: '8px', color: 'var(--color-text)', fontSize: '0.9rem', outline: 'none'
};

export default PhotographerProjects;
