import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, Check, Loader2, Bot, BookOpen, MessageCircle, ChevronLeft, ChevronRight, Star, PlusCircle } from 'lucide-react';
import { chatApi } from '../../services/chatApi';

interface Knowledge {
    id: string;
    content: string;
    category: string;
    createdAt: string;
}

interface ChatLog {
    id: string;
    userMessage: string;
    botResponse: string;
    isPinned: boolean;
    createdAt: string;
}

const AdminAIKnowledge: React.FC = () => {
    const [knowledge, setKnowledge] = useState<Knowledge[]>([]);
    const [logs, setLogs] = useState<ChatLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'knowledge' | 'logs'>('knowledge');
    const [form, setForm] = useState({ content: '', category: 'General' });
    
    // Pagination for Logs
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchData = async () => {
        try {
            setLoading(true);
            const [kRes, lRes] = await Promise.all([
                chatApi.getKnowledge(),
                chatApi.getLogs()
            ]);
            setKnowledge(kRes.data.data || []);
            setLogs(lRes.data.data || []);
        } catch {
            setError('Không thể tải dữ liệu AI.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleIngest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.content.trim()) return;
        
        setSaving(true);
        setError('');
        try {
            await chatApi.ingest(form);
            setShowModal(false);
            setForm({ content: '', category: 'General' });
            fetchData();
        } catch {
            setError('Nạp kiến thức thất bại.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa kiến thức này? AI sẽ không còn nhớ thông tin này nữa.')) return;
        try {
            await chatApi.deleteKnowledge(id);
            fetchData();
        } catch {
            setError('Xóa thất bại.');
        }
    };

    const handleAddToKnowledge = (message: string, response: string) => {
        setForm({
            content: `Q: ${message}\nA: ${response}`,
            category: 'FAQ'
        });
        setShowModal(true);
    };

    const handleTogglePin = async (id: string) => {
        try {
            await chatApi.togglePin(id);
            // Cập nhật state local để mượt hơn
            setLogs(prev => prev.map(log => 
                log.id === id ? { ...log, isPinned: !log.isPinned } : log
            ).sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } catch {
            setError('Không thể ghim tin nhắn.');
        }
    };

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLogs = logs.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(logs.length / itemsPerPage);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--color-text)' }}>
                        Quản Lý Trí Tuệ Nhân Tạo (AI)
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        Nạp kiến thức và theo dõi lịch sử chat của trợ lý ảo Aura
                    </p>
                </div>
                <button onClick={() => setShowModal(true)} style={btnPrimary}>
                    <Plus size={18} /> Nạp Kiến Thức Mới
                </button>
            </header>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                <button 
                    onClick={() => { setActiveTab('knowledge'); setCurrentPage(1); }}
                    style={activeTab === 'knowledge' ? tabActive : tabInactive}
                >
                    <BookOpen size={18} /> Kho Kiến Thức ({knowledge.length})
                </button>
                <button 
                    onClick={() => { setActiveTab('logs'); setCurrentPage(1); }}
                    style={activeTab === 'logs' ? tabActive : tabInactive}
                >
                    <MessageCircle size={18} /> Lịch Sử Chat ({logs.length})
                </button>
            </div>

            {error && (
                <div style={alertStyle}>
                    {error}
                    <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}><X size={14} /></button>
                </div>
            )}

            {loading ? (
                <div style={centerStyle}><Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-accent)' }} /></div>
            ) : (
                <div style={{ backgroundColor: 'var(--color-bg-secondary)', borderRadius: '12px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                    {activeTab === 'knowledge' ? (
                        <div style={{ padding: '1rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                                        <th style={thStyle}>Nội dung kiến thức</th>
                                        <th style={thStyle}>Phân loại</th>
                                        <th style={thStyle}>Ngày tạo</th>
                                        <th style={thStyle}>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {knowledge.map((k) => (
                                        <tr key={k.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                            <td style={tdStyle}>
                                                <div style={{ maxWidth: '500px', whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>{k.content}</div>
                                            </td>
                                            <td style={tdStyle}>
                                                <span style={badgeStyle}>{k.category}</span>
                                            </td>
                                            <td style={tdStyle}>{new Date(k.createdAt).toLocaleDateString('vi-VN')}</td>
                                            <td style={tdStyle}>
                                                <button onClick={() => handleDelete(k.id)} style={btnDanger}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {knowledge.length === 0 && (
                                        <tr>
                                            <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                                                Chưa có kiến thức nào được nạp.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {currentLogs.map((log) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={log.id} 
                                    style={{ 
                                        border: log.isPinned ? '2px solid var(--color-accent)' : '1px solid var(--color-border)', 
                                        borderRadius: '12px', 
                                        padding: '1.25rem', 
                                        backgroundColor: log.isPinned ? 'rgba(173, 255, 0, 0.05)' : 'var(--color-bg)', 
                                        position: 'relative' 
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                                            🕒 {new Date(log.createdAt).toLocaleString('vi-VN')}
                                        </span>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button 
                                                title="Nạp vào FAQ"
                                                onClick={() => handleAddToKnowledge(log.userMessage, log.botResponse)}
                                                style={{ ...btnSecondary, padding: '4px 8px', fontSize: '0.75rem', color: 'var(--color-accent)' }}
                                            >
                                                <PlusCircle size={14} /> Nạp vào FAQ
                                            </button>
                                            <button 
                                                title={log.isPinned ? "Bỏ ghim" : "Ghim câu hỏi thường gặp"}
                                                onClick={() => handleTogglePin(log.id)}
                                                style={{ 
                                                    ...btnSecondary, 
                                                    padding: '4px 8px', 
                                                    border: 'none',
                                                    color: log.isPinned ? '#facc15' : 'var(--color-text-muted)'
                                                }}
                                            >
                                                <Star size={16} fill={log.isPinned ? "#facc15" : "none"} />
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #e5e7eb' }}>
                                                <span style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280' }}>USER</span>
                                            </div>
                                            <div style={{ backgroundColor: '#f9fafb', padding: '12px 16px', borderRadius: '0 16px 16px 16px', fontSize: '0.9rem', color: '#111827', border: '1px solid #f3f4f6', flex: 1 }}>
                                                {log.userMessage}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#000', color: '#ADFF00', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <Bot size={18} />
                                            </div>
                                            <div style={{ border: '1px solid rgba(0,0,0,0.05)', padding: '12px 16px', borderRadius: '0 16px 16px 16px', fontSize: '0.9rem', backgroundColor: '#fff', color: '#111827', flex: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                                {log.botResponse}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Pagination Controls */}
                            {logs.length > itemsPerPage && (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                                    <button 
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        style={currentPage === 1 ? btnPageDisabled : btnPage}
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                                        Trang {currentPage} / {totalPages}
                                    </span>
                                    <button 
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        style={currentPage === totalPages ? btnPageDisabled : btnPage}
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            )}

                            {logs.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                                    Chưa có lịch sử chat nào.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Modal Ingest */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={overlayStyle}
                        onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            style={modalStyle}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>Nạp Kiến Thức Mới cho AI</h2>
                                <button onClick={() => setShowModal(false)} style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleIngest} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={labelStyle}>Phân loại</label>
                                    <select 
                                        value={form.category}
                                        onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                                        style={inputStyle}
                                    >
                                        <option value="General">Chung</option>
                                        <option value="Package">Gói dịch vụ</option>
                                        <option value="FAQ">Câu hỏi thường gặp (FAQ)</option>
                                        <option value="Policy">Chính sách</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Nội dung kiến thức *</label>
                                    <textarea
                                        required
                                        rows={6}
                                        value={form.content}
                                        onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
                                        style={inputStyle}
                                        placeholder="Nhập nội dung bạn muốn AI ghi nhớ... (Ví dụ: Địa chỉ văn phòng, Quy trình đặt lịch, v.v.)"
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                    <button type="submit" disabled={saving} style={{ ...btnPrimary, flex: 1, justifyContent: 'center' }}>
                                        {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={16} />}
                                        Nạp vào AI
                                    </button>
                                    <button type="button" onClick={() => setShowModal(false)} style={btnSecondary}>Huỷ</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

// Styles
const btnPrimary: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '8px',
    backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)',
    padding: '0.6rem 1.25rem', fontSize: '0.875rem', fontWeight: 600,
    borderRadius: '6px', cursor: 'pointer', border: 'none',
};
const btnSecondary: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '6px',
    backgroundColor: 'transparent', color: 'var(--color-text-muted)',
    padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500,
    borderRadius: '6px', cursor: 'pointer', border: '1px solid var(--color-border)',
};
const btnDanger: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '6px',
    backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444',
    padding: '0.5rem 0.75rem', borderRadius: '6px', cursor: 'pointer', border: 'none',
};
const btnPage: React.CSSProperties = {
    padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg)', cursor: 'pointer', display: 'flex', alignItems: 'center'
};
const btnPageDisabled: React.CSSProperties = {
    ...btnPage, opacity: 0.5, cursor: 'not-allowed'
};
const alertStyle: React.CSSProperties = {
    backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444',
    padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.875rem',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
};
const centerStyle: React.CSSProperties = {
    display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem',
};
const overlayStyle: React.CSSProperties = {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
};
const modalStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-bg-secondary)', borderRadius: '12px',
    padding: '2rem', width: '100%', maxWidth: '600px',
    border: '1px solid var(--color-border)', maxHeight: '90vh', overflowY: 'auto',
};
const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.78rem', color: 'var(--color-text-muted)',
    marginBottom: '0.4rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
};
const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.7rem 0.9rem',
    backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)',
    borderRadius: '6px', color: 'var(--color-text)', fontSize: '0.9rem', boxSizing: 'border-box',
    fontFamily: 'inherit'
};
const thStyle: React.CSSProperties = { padding: '12px', fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 };
const tdStyle: React.CSSProperties = { padding: '12px', fontSize: '0.85rem' };
const badgeStyle: React.CSSProperties = { padding: '2px 8px', backgroundColor: 'rgba(7, 31, 217, 0.1)', color: 'var(--color-accent)', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 600 };

const tabActive: React.CSSProperties = {
    padding: '1rem', border: 'none', borderBottom: '2px solid var(--color-accent)',
    backgroundColor: 'transparent', color: 'var(--color-accent)', fontWeight: 600,
    display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
};
const tabInactive: React.CSSProperties = {
    padding: '1rem', border: 'none', borderBottom: '2px solid transparent',
    backgroundColor: 'transparent', color: 'var(--color-text-muted)', fontWeight: 500,
    display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
};

export default AdminAIKnowledge;
