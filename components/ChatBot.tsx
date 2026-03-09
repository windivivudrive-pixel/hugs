import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    role: 'user' | 'model';
    content: string;
}

interface ChatBotProps {
    onOpenChange?: (isOpen: boolean) => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({ onOpenChange }) => {
    const initialMessage: Message = { role: 'model', content: 'Chào Anh/Chị! Em là trợ lý ảo của HUGs Agency. Anh/Chị cần tư vấn về dịch vụ quay phim, chụp ảnh, quản lý kênh hay thiết kế?' };

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('hugs_chat_history');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch (e) {
                    console.error('Lỗi đọc lịch sử chat', e);
                }
            }
        }
        return [initialMessage];
    });
    const [input, setInput] = useState('');
    const [sessionId, setSessionId] = useState<string | null>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('hugs_chat_session') || null;
        }
        return null;
    });
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isLoading]);

    useEffect(() => {
        if (onOpenChange) {
            onOpenChange(isOpen);
        }
    }, [isOpen, onOpenChange]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('hugs_chat_history', JSON.stringify(messages));
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input.trim() };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            // Gọi lên Edge Function của Supabase 
            // Hàm này đã bao gồm model AI và tự động trigger function save_customer_info nếu khách gửi Tên và SĐT
            const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
            const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

            const functionUrl = `${supabaseUrl}/functions/v1/vertex-chat`;

            const response = await fetch(functionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${supabaseAnonKey}`
                },
                body: JSON.stringify({ messages: newMessages, sessionId: sessionId })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            if (data.sessionId) {
                setSessionId(data.sessionId);
                localStorage.setItem('hugs_chat_session', data.sessionId);
            }

            setMessages([...newMessages, { role: 'model', content: data.response }]);

        } catch (error) {
            console.error('Error sending message:', error);
            setMessages([...newMessages, { role: 'model', content: 'Xin lỗi, hệ thống đang bảo trì. Bạn vui lòng liên hệ hotline 0924.392.222 để được tư vấn trực tiếp nhé!' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-[130px] md:bottom-[100px] right-4 md:right-6 w-[calc(100vw-2rem)] md:w-[380px] bg-white rounded-2xl shadow-2xl overflow-hidden z-[100] border border-gray-100 flex flex-col max-h-[calc(100vh-160px)] md:max-h-[600px]"
                    >
                        {/* Header */}
                        <div className="bg-brand-pink text-white p-4 flex justify-between items-center shrink-0 shadow-sm relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                                    <motion.img
                                        src="/chatbot icon.png"
                                        alt="Bot Assistant"
                                        className="w-full h-full object-contain"
                                        animate={{ rotate: [-12, 12, -12] }}
                                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base leading-tight">Trợ lý Hugs</h3>
                                    <p className="text-white/80 text-xs mt-0.5">Sẵn sàng chốt đơn 24/7</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => {
                                        if (window.confirm('Bạn có chắc chắn muốn xóa lịch sử trò chuyện này?')) {
                                            setMessages([initialMessage]);
                                            setSessionId(null);
                                            localStorage.removeItem('hugs_chat_history');
                                            localStorage.removeItem('hugs_chat_session');
                                        }
                                    }}
                                    className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                                    title="Xóa cuộc trò chuyện"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${msg.role === 'user'
                                        ? 'bg-brand-pink text-white rounded-tr-sm'
                                        : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                                        }`}>
                                        {msg.content.split('\n').map((line, i) => (
                                            <p key={i} className="text-[14px] md:text-[15px] leading-relaxed break-words">
                                                {line}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-3 rounded-tl-sm text-gray-400 flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="text-sm">Đang trả lời...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} className="h-1" />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white border-t border-gray-100 shrink-0">
                            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full pr-2 focus-within:ring-2 focus-within:ring-brand-pink/20 focus-within:border-brand-pink/50 transition-all overflow-hidden">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Nhập tin nhắn..."
                                    className="flex-1 bg-transparent py-3 pl-5 outline-none text-[15px] text-gray-700 placeholder-gray-400"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="bg-brand-pink text-white p-2.5 rounded-full hover:bg-brand-pink/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 flex items-center justify-center shadow-sm"
                                >
                                    <Send className="w-4 h-4 md:w-5 md:h-5 ml-0.5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.div className="fixed bottom-[144px] md:bottom-[152px] right-4 md:right-6 z-[90]">
                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center text-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="bg-black w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-xl shadow-black/20 text-white hover:bg-gray-800 border-2 border-white/10"
                            >
                                <X className="w-5 h-5 md:w-6 md:h-6" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="chat"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="w-full h-full flex items-center justify-center p-1.5"
                            >
                                <motion.img
                                    src="/chatbot icon.png"
                                    alt="Chat"
                                    className="w-full h-full object-contain drop-shadow-lg"
                                    animate={{ rotate: [-12, 12, -12] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 2.5,
                                        ease: "easeInOut"
                                    }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Notification Dot */}
                    {!isOpen && (
                        <span className="absolute top-0 right-0 w-3 h-3 md:w-3.5 md:h-3.5 bg-brand-pink rounded-full border-2 border-white animate-pulse" />
                    )}
                </motion.button>
            </motion.div>
        </>
    );
};
