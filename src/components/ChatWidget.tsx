import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X } from 'lucide-react';
import { axiosInstance } from '../lib/axiosInstance';
import './ChatWidget.css';

const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<{ role: 'bot' | 'user'; text: string }[]>([
        { role: 'bot', text: 'Chào mừng bạn đến với AURA! Tôi là trợ lý AI, sẵn sàng giúp bạn chọn gói dịch vụ hoàn hảo nhất. Bạn cần tư vấn gì không?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [chatHistory, isOpen, isLoading]);

    const handleSend = async () => {
        if (!message.trim() || isLoading) return;

        const userMessage = message.trim();
        setMessage('');
        setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            // Dùng axiosInstance đã cấu hình baseURL là /api/v1/
            const response = await axiosInstance.post('Chat/message', { message: userMessage });
            // axiosInstance đã normalize response về camelCase và bóc tách data
            // data trả về là { succeeded: true, message: "...", data: { response: "..." } }
            // Do normalizeApiResponse trong axiosInstance.ts bóc ra response.data = normalized
            // Nên response.data chính là ApiResponse object.
            setChatHistory(prev => [...prev, { role: 'bot', text: response.data.data.response }]);
        } catch (error) {
            console.error('Chat error:', error);
            setChatHistory(prev => [...prev, { role: 'bot', text: 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau!' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-widget-container">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="chat-window"
                    >
                        {/* Header Section */}
                        <div className="chat-header">
                            <div className="chat-header-info">
                                <div className="chat-bot-icon">
                                    <Bot size={22} />
                                </div>
                                <div className="chat-header-text">
                                    <h3>AURA ASSISTANT</h3>
                                    <div className="chat-status">
                                        <div className="status-dot" />
                                        <span className="status-text">Live Support</span>
                                    </div>
                                </div>
                            </div>
                            <button className="close-button" onClick={() => setIsOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Section */}
                        <div className="chat-messages">
                            {chatHistory.map((chat, index) => (
                                <div key={index} className={`message-wrapper ${chat.role === 'user' ? 'message-user' : 'message-bot'}`}>
                                    <div className="message-content">
                                        {chat.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="message-wrapper message-bot">
                                    <div className="message-content">
                                        <div className="typing-indicator">
                                            <div className="typing-dot"></div>
                                            <div className="typing-dot"></div>
                                            <div className="typing-dot"></div>
                                        </div>
                                        <span style={{ fontSize: '10px', color: '#9ca3af' }}>Aura is thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Section */}
                        <div className="chat-input-container">
                            <div className="chat-input-wrapper">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask anything about AURA..."
                                    className="chat-input"
                                />
                                <button 
                                    className="send-button"
                                    onClick={handleSend}
                                    disabled={!message.trim() || isLoading}
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button - Only show when closed */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="chat-toggle-button"
                    >
                        <Bot size={32} />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatWidget;
