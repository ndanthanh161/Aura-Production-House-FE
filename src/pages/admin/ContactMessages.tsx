import React, { useEffect, useState } from 'react';
import { contactApi } from '../../services/contactApi';
import type { ContactMessage } from '../../services/contactApi';
import { Mail, Trash2, Clock, User, Phone } from 'lucide-react';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { useToast } from '../../components/ui/Toast';

const AdminContactMessages: React.FC = () => {
    const { showToast, ToastContainer } = useToast();
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
        isOpen: false,
        id: null
    });

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const res = await contactApi.getAll();
            if (res && res.data) {
                setMessages(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch messages', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleMarkAsRead = async (id: string) => {
        try {
            await contactApi.markAsRead(id);
            setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
            if (selectedMessage?.id === id) {
                setSelectedMessage({ ...selectedMessage, isRead: true });
            }
        } catch (error) {
            console.error('Error marking as read', error);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.id) return;
        const id = deleteModal.id;
        try {
            await contactApi.delete(id);
            setMessages(prev => prev.filter(m => m.id !== id));
            if (selectedMessage?.id === id) {
                setSelectedMessage(null);
            }
            setDeleteModal({ isOpen: false, id: null });
            showToast('Đã xóa tin nhắn thành công', 'success');
        } catch (error) {
            showToast('Lỗi khi xóa tin nhắn', 'error');
        }
    };

    const renderEmpty = () => (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#666' }}>
            <Mail size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <p>Không có tin nhắn nào.</p>
        </div>
    );

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Tin nhắn liên hệ</h1>
                <div style={{ backgroundColor: '#071FD9', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
                    {messages.filter(m => !m.isRead).length} MỚI
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: selectedMessage ? '350px 1fr' : '1fr', gap: '20px' }}>
                {/* List Column */}
                <div style={{ backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</div>
                    ) : messages.length === 0 ? renderEmpty() : (
                        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            {messages.map(msg => (
                                <div 
                                    key={msg.id}
                                    onClick={() => {
                                        setSelectedMessage(msg);
                                        if (!msg.isRead) handleMarkAsRead(msg.id);
                                    }}
                                    style={{
                                        padding: '15px 20px',
                                        borderBottom: '1px solid #eee',
                                        cursor: 'pointer',
                                        backgroundColor: selectedMessage?.id === msg.id ? '#f0f4ff' : '#fff',
                                        borderLeft: !msg.isRead ? '4px solid #071FD9' : '4px solid transparent'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <span style={{ fontWeight: !msg.isRead ? 700 : 500, fontSize: '14px' }}>{msg.name}</span>
                                        <span style={{ fontSize: '11px', color: '#999' }}>{new Date(msg.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {msg.subject}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Detail Column */}
                {selectedMessage ? (
                    <div style={{ backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', padding: '30px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 10px 0' }}>{selectedMessage.subject}</h2>
                                <div style={{ display: 'flex', gap: '15px', fontSize: '13px', color: '#666' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><User size={14} /> {selectedMessage.name}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Mail size={14} /> {selectedMessage.email}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Phone size={14} /> {selectedMessage.phoneNumber}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14} /> {new Date(selectedMessage.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setDeleteModal({ isOpen: true, id: selectedMessage.id })}
                                style={{ color: '#ff4d4d', background: 'none', border: 'none', cursor: 'pointer', padding: '10px' }}
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', lineHeight: 1.6, color: '#333', whiteSpace: 'pre-wrap' }}>
                            {selectedMessage.message}
                        </div>
                    </div>
                ) : !loading && messages.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', height: '100%' }}>
                        Chọn một tin nhắn để xem chi tiết
                    </div>
                )}
            </div>

            <ConfirmModal 
                isOpen={deleteModal.isOpen}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn xóa tin nhắn này? Hành động này không thể hoàn tác."
                confirmText="Xóa tin nhắn"
                onConfirm={handleDelete}
                onCancel={() => setDeleteModal({ isOpen: false, id: null })}
                type="danger"
            />

            <ToastContainer />
        </div>
    );
};

export default AdminContactMessages;
