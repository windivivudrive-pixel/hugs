'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Eye, EyeOff, MessageSquare, User, Phone, Clock, ChevronDown, ChevronUp, Search, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

type UserRole = 'admin' | 'agent' | 'member';

interface AdminUser {
    id: string;
    username: string;
    name: string | null;
    role: UserRole;
    avatar_url: string | null;
}

interface CustomerLead {
    id: string;
    session_id: string | null;
    name: string | null;
    phone: string | null;
    status: string | null;
    message_history: { role: string; content: string }[] | null;
    created_at: string;
}

export const AdminPage: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState('');

    // Conversations state
    const [leads, setLeads] = useState<CustomerLead[]>([]);
    const [loading, setLoading] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Check login state on mount
    useEffect(() => {
        const checkUser = async () => {
            const savedUserStr = localStorage.getItem('admin_user');
            if (savedUserStr) {
                try {
                    const savedUser = JSON.parse(savedUserStr);
                    setCurrentUser(savedUser);
                    setIsLoggedIn(true);

                    // Verify user still exists in DB
                    const { data, error } = await supabase
                        .from('admin_users')
                        .select('id, username, name, role, avatar_url')
                        .eq('id', savedUser.id)
                        .single();

                    if (!error && data) {
                        const freshUser: AdminUser = {
                            id: data.id,
                            username: data.username,
                            name: data.name || null,
                            role: data.role as UserRole,
                            avatar_url: data.avatar_url || null
                        };
                        localStorage.setItem('admin_user', JSON.stringify(freshUser));
                        setCurrentUser(freshUser);
                    } else if (error?.code === 'PGRST116') {
                        handleLogout();
                    }
                } catch {
                    handleLogout();
                }
            }
        };
        checkUser();
    }, []);

    // Fetch leads when logged in
    useEffect(() => {
        if (isLoggedIn) {
            fetchLeads();
        }
    }, [isLoggedIn]);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('customer_leads')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data) {
                setLeads(data);
            }
        } catch (err) {
            console.error('Error fetching leads:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');

        try {
            const { data, error } = await supabase
                .from('admin_users')
                .select('id, username, name, role, avatar_url')
                .eq('username', username)
                .eq('password', password)
                .single();

            if (error || !data) {
                setLoginError('Sai tên đăng nhập hoặc mật khẩu');
                return;
            }

            const user: AdminUser = {
                id: data.id,
                username: data.username,
                name: data.name || null,
                role: data.role as UserRole,
                avatar_url: data.avatar_url || null
            };
            localStorage.setItem('admin_user', JSON.stringify(user));
            setCurrentUser(user);
            setIsLoggedIn(true);
        } catch {
            setLoginError('Có lỗi xảy ra, vui lòng thử lại');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_user');
        setCurrentUser(null);
        setIsLoggedIn(false);
        setUsername('');
        setPassword('');
    };

    const updateLeadStatus = async (id: string, newStatus: string) => {
        const { error } = await supabase
            .from('customer_leads')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getStatusColor = (status: string | null) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-700';
            case 'contacted': return 'bg-green-100 text-green-700';
            case 'converted': return 'bg-purple-100 text-purple-700';
            case 'closed': return 'bg-gray-100 text-gray-500';
            default: return 'bg-blue-100 text-blue-700';
        }
    };

    const getStatusLabel = (status: string | null) => {
        switch (status) {
            case 'new': return 'Mới';
            case 'contacted': return 'Đã liên hệ';
            case 'converted': return 'Đã chuyển đổi';
            case 'closed': return 'Đã đóng';
            default: return 'Mới';
        }
    };

    // Filter leads
    const filteredLeads = leads.filter(lead => {
        const matchesSearch = !searchTerm ||
            (lead.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (lead.phone?.includes(searchTerm)) ||
            (lead.session_id?.includes(searchTerm));
        const matchesStatus = statusFilter === 'all' || (lead.status || 'new') === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Login Screen
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
                <motion.div
                    className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="text-center mb-8">
                        <img src="/logo-hugs.png" alt="HUGs" className="h-16 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-500 text-sm mt-1">Đăng nhập để quản lý</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tên đăng nhập
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none"
                                placeholder="Nhập username"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none pr-12"
                                    placeholder="Nhập password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {loginError && (
                            <p className="text-red-500 text-sm text-center">{loginError}</p>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-brand-pink text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
                        >
                            Đăng nhập
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    // Admin Dashboard
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img src="/logo-hugs.png" alt="HUGs" className="h-10" />
                        <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-pink/10 text-brand-pink uppercase">
                            {currentUser?.role}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">Xin chào, {currentUser?.name || currentUser?.username}</span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                        >
                            <LogOut size={18} />
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <MessageSquare className="text-brand-pink" size={24} />
                        <h2 className="text-2xl font-bold text-gray-900">Lịch sử hội thoại</h2>
                        <span className="bg-brand-pink/10 text-brand-pink text-sm font-semibold px-3 py-1 rounded-full">
                            {leads.length} cuộc hội thoại
                        </span>
                    </div>
                    <button
                        onClick={fetchLeads}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Làm mới
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm theo tên, SĐT hoặc session..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none bg-white"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'new', 'contacted', 'converted', 'closed'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${statusFilter === status
                                    ? 'bg-brand-pink text-white'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {status === 'all' ? 'Tất cả' : getStatusLabel(status)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Leads Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center">
                            <RefreshCw className="animate-spin mx-auto mb-3 text-brand-pink" size={32} />
                            <p className="text-gray-500">Đang tải dữ liệu...</p>
                        </div>
                    ) : filteredLeads.length === 0 ? (
                        <div className="p-12 text-center">
                            <MessageSquare className="mx-auto mb-3 text-gray-300" size={48} />
                            <p className="text-gray-500">Không tìm thấy cuộc hội thoại nào</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredLeads.map((lead) => (
                                <div key={lead.id}>
                                    {/* Lead Row */}
                                    <div
                                        className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                                    >
                                        {/* Avatar */}
                                        <div className="w-10 h-10 rounded-full bg-brand-pink/10 flex items-center justify-center flex-shrink-0">
                                            <User size={18} className="text-brand-pink" />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-gray-900 truncate">
                                                    {lead.name || 'Khách ẩn danh'}
                                                </p>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                                                    {getStatusLabel(lead.status)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                                {lead.phone && (
                                                    <span className="flex items-center gap-1">
                                                        <Phone size={12} />
                                                        {lead.phone}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {formatDate(lead.created_at)}
                                                </span>
                                                <span className="text-gray-400">
                                                    {lead.message_history?.length || 0} tin nhắn
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status Dropdown */}
                                        <select
                                            value={lead.status || 'new'}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                updateLeadStatus(lead.id, e.target.value);
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-brand-pink outline-none"
                                        >
                                            <option value="new">Mới</option>
                                            <option value="contacted">Đã liên hệ</option>
                                            <option value="converted">Đã chuyển đổi</option>
                                            <option value="closed">Đã đóng</option>
                                        </select>

                                        {/* Expand Icon */}
                                        {expandedId === lead.id ? (
                                            <ChevronUp size={20} className="text-gray-400 flex-shrink-0" />
                                        ) : (
                                            <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />
                                        )}
                                    </div>

                                    {/* Expanded Message History */}
                                    <AnimatePresence>
                                        {expandedId === lead.id && lead.message_history && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-6 pb-6 pt-2">
                                                    <div className="bg-gray-50 rounded-xl p-4 max-h-[400px] overflow-y-auto space-y-3">
                                                        {lead.message_history.map((msg, idx) => (
                                                            <div
                                                                key={idx}
                                                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                                            >
                                                                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === 'user'
                                                                    ? 'bg-brand-pink text-white rounded-tr-sm'
                                                                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'
                                                                    }`}>
                                                                    {msg.content.split('\n').map((line, i) => (
                                                                        <p key={i} className="leading-relaxed">{line}</p>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
