import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Newspaper, FileText, Plus, Edit, Trash2, Save, X, Eye, EyeOff, Users, Upload, Loader2, Star } from 'lucide-react';
import { supabase, NewsArticle, uploadThumbnail, deleteThumbnail, ProjectCategory, fetchProjectCategories, fetchServiceCategories, ServiceCategory } from '../lib/supabase';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

type UserRole = 'admin' | 'agent' | 'member';

interface AdminUser {
    id: string;
    username: string;
    name: string | null;
    role: UserRole;
    avatar_url: string | null;
}

interface ServiceArticle {
    id: string;
    service_id: string;
    title: string;
    content: string | null;
    thumbnail: string | null;
    logo: string | null;
    published: boolean;
    featured: boolean;
    display_order: number;
    created_at: string;
    author_id: string | null;
    project_category_id: string | null; // Legacy
    project_category_ids: string[] | null; // New array field
}

interface Service {
    id: string;
    name: string;
    slug: string;
    category_id: string;
}

export const AdminPage: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [activeTab, setActiveTab] = useState<'news' | 'service' | 'users'>('news');

    // News articles state
    const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
    const [serviceArticles, setServiceArticles] = useState<ServiceArticle[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
    const [projectCategories, setProjectCategories] = useState<ProjectCategory[]>([]);
    const [loading, setLoading] = useState(false);

    // Edit/Add modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<NewsArticle | ServiceArticle | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        thumbnail: '',
        logo: '',
        category: 'NEWS',
        category_color: '#E91E63',
        published: false,
        featured: false,
        display_order: 0,

        service_id: '',
        category_id: '', // Helper for UI filtering
        project_category_id: '', // Legacy
        project_category_ids: [] as string[] // New array field
    });
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Check login state on mount and refresh role
    useEffect(() => {
        const checkUser = async () => {
            const savedUserStr = localStorage.getItem('admin_user');
            if (savedUserStr) {
                const savedUser = JSON.parse(savedUserStr);
                // Optimistically set from local storage first
                setCurrentUser(savedUser);
                setIsLoggedIn(true);

                // Verify and refresh from DB
                try {
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
                        console.log('Refreshed user from DB:', freshUser);
                        // Update local storage and state if changed
                        if (JSON.stringify(freshUser) !== savedUserStr) {
                            localStorage.setItem('admin_user', JSON.stringify(freshUser));
                            setCurrentUser(freshUser);
                        }
                    } else {
                        // User might be deleted or error
                        console.error('Error refreshing user:', error);
                        if (error?.code === 'PGRST116') { // No rows found
                            handleLogout();
                        }
                    }
                } catch (err) {
                    console.error('Error verifying user:', err);
                }
            }
        };

        checkUser();
    }, []);

    // Fetch data when logged in
    useEffect(() => {
        if (isLoggedIn) {
            fetchData();
            fetchServices();
            fetchCategoriesList();
        }
    }, [isLoggedIn, activeTab]);

    const fetchCategoriesList = async () => {
        const cats = await fetchServiceCategories();
        setCategories(cats);
    };

    const fetchServices = async () => {
        const { data, error } = await supabase
            .from('services')
            .select('id, name, slug, category_id')
            .order('display_order');
        if (!error && data) setServices(data);
    };

    const fetchAdminUsers = async () => {
        const { data, error } = await supabase
            .from('admin_users')
            .select('id, username, name, role, avatar_url')
            .order('created_at');
        if (!error && data) setAdminUsers(data as AdminUser[]);
    };

    const fetchCategories = async (serviceId: string) => {
        if (!serviceId) {
            setProjectCategories([]);
            return;
        }
        const cats = await fetchProjectCategories(serviceId);
        setProjectCategories(cats);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'news') {
                const { data, error } = await supabase
                    .from('news_articles')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (!error && data) setNewsArticles(data);
            } else if (activeTab === 'service') {
                const { data, error } = await supabase
                    .from('service_articles')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (!error && data) setServiceArticles(data);
            } else if (activeTab === 'users' && currentUser?.role === 'admin') {
                await fetchAdminUsers();
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');

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
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_user');
        setCurrentUser(null);
        setIsLoggedIn(false);
        setUsername('');
        setPassword('');
    };

    // Permission helpers
    const canEdit = (article?: NewsArticle | ServiceArticle) => {
        if (!article) return true; // Can always create new
        if (currentUser?.role === 'admin' || currentUser?.role === 'agent') return true;

        // Member can edit their own articles
        if (currentUser?.role === 'member') {
            return article.author_id === currentUser.id;
        }
        return false;
    };
    const canDelete = () => currentUser?.role === 'admin' || currentUser?.role === 'agent';
    const canManageUsers = () => currentUser?.role === 'admin';

    const openAddModal = () => {
        setEditingArticle(null);
        setThumbnailFile(null);
        setLogoFile(null);
        setFormData({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            thumbnail: '',
            logo: '',
            category: 'NEWS',
            category_color: '#E91E63',
            published: false,
            featured: false,
            display_order: 0,

            service_id: '',
            category_id: '',
            project_category_id: '',
            project_category_ids: []
        });
        // No default service/category selected initially to force user choice or keep clean
        setIsModalOpen(true);
    };

    const openEditModal = (article: NewsArticle | ServiceArticle) => {
        setEditingArticle(article);
        setThumbnailFile(null);
        setLogoFile(null);

        const currentService = services.find(s => s.id === (article as ServiceArticle).service_id);

        setFormData({
            title: article.title,
            slug: (article as NewsArticle).slug || '',
            excerpt: (article as NewsArticle).excerpt || '',
            content: article.content || '',
            thumbnail: article.thumbnail || '',
            logo: (article as ServiceArticle).logo || '',
            category: (article as NewsArticle).category || 'NEWS',
            category_color: (article as NewsArticle).category_color || '#E91E63',
            published: article.published,
            featured: (article as ServiceArticle).featured || false,
            display_order: article.display_order,

            service_id: (article as ServiceArticle).service_id || '',
            category_id: currentService?.category_id || '',
            project_category_id: (article as ServiceArticle).project_category_id || '',
            project_category_ids: (article as ServiceArticle).project_category_ids || []
        });

        if ((article as ServiceArticle).service_id) {
            fetchCategories((article as ServiceArticle).service_id);
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        try {
            setIsUploading(true);

            // Validation
            if (activeTab === 'service' && !formData.service_id) {
                alert('Vui lòng chọn Dịch vụ cho dự án');
                setIsUploading(false);
                return;
            }

            let uploadedThumbnailUrl = formData.thumbnail;
            let uploadedLogoUrl = formData.logo;

            // Upload thumbnail if file selected
            if (thumbnailFile) {
                const folder = activeTab === 'news' ? 'news' : 'service';
                const { url, error } = await uploadThumbnail(thumbnailFile, folder);
                if (url) {
                    uploadedThumbnailUrl = url;
                } else {
                    console.error('Upload error details:', error);
                    alert(`Lỗi khi upload ảnh thumbnail: ${error?.message || 'Unknown error'}`);
                    setIsUploading(false);
                    return;
                }
            }

            // Upload logo if file selected (service articles only)
            if (logoFile && activeTab === 'service') {
                const { url, error } = await uploadThumbnail(logoFile, 'logo');
                if (url) {
                    uploadedLogoUrl = url;
                } else {
                    console.error('Logo upload error details:', error);
                    alert(`Lỗi khi upload logo: ${error?.message || 'Unknown error'}`);
                    setIsUploading(false);
                    return;
                }
            }

            if (activeTab === 'news') {
                const articleData = {
                    title: formData.title,
                    slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
                    excerpt: formData.excerpt,
                    content: formData.content,
                    thumbnail: uploadedThumbnailUrl,
                    category: formData.category,
                    category_color: formData.category_color,
                    published: formData.published,
                    display_order: formData.display_order
                };

                if (editingArticle) {
                    if (!canEdit(editingArticle)) {
                        alert('Bạn không có quyền chỉnh sửa bài viết này');
                        return;
                    }
                    await supabase
                        .from('news_articles')
                        .update(articleData)
                        .eq('id', editingArticle.id);
                } else {
                    await supabase
                        .from('news_articles')
                        .insert([{ ...articleData, author_id: currentUser?.id }]);
                }
            } else {
                const articleData = {
                    title: formData.title,
                    content: formData.content,
                    thumbnail: uploadedThumbnailUrl,
                    logo: uploadedLogoUrl,
                    category: formData.category,
                    published: formData.published,
                    featured: formData.featured,
                    display_order: formData.display_order,

                    service_id: formData.service_id,
                    project_category_id: formData.project_category_id || null,
                    project_category_ids: formData.project_category_ids.length > 0 ? formData.project_category_ids : null
                };

                if (editingArticle) {
                    if (!canEdit(editingArticle)) {
                        alert('Bạn không có quyền chỉnh sửa bài viết này');
                        return;
                    }
                    await supabase
                        .from('service_articles')
                        .update(articleData)
                        .eq('id', editingArticle.id);
                } else {
                    await supabase
                        .from('service_articles')
                        .insert([{ ...articleData, author_id: currentUser?.id }]);
                }
            }

            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            console.error('Error saving:', err);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!canDelete()) {
            alert('Bạn không có quyền xóa bài viết');
            return;
        }
        if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return;

        try {
            const table = activeTab === 'news' ? 'news_articles' : 'service_articles';

            // Get article to find thumbnail URL
            const { data: article } = await supabase
                .from(table)
                .select('thumbnail')
                .eq('id', id)
                .single();

            if (article?.thumbnail) {
                await deleteThumbnail(article.thumbnail);
            }

            await supabase.from(table).delete().eq('id', id);
            fetchData();
        } catch (err) {
            console.error('Error deleting:', err);
        }
    };

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
                        <p className="text-gray-500 text-sm mt-1">Đăng nhập để quản lý nội dung</p>
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
                        <span className="text-sm text-gray-500">Xin chào, {currentUser?.username}</span>
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
                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('news')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'news'
                            ? 'bg-brand-pink text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Newspaper size={18} />
                        Tin Tức
                    </button>
                    <button
                        onClick={() => setActiveTab('service')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'service'
                            ? 'bg-brand-pink text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <FileText size={18} />
                        Dự Án
                    </button>
                    {canManageUsers() && (
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'users'
                                ? 'bg-brand-pink text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Users size={18} />
                            Quản lý Users
                        </button>
                    )}
                </div>

                {/* Add Button - Hide on users tab */}
                {activeTab !== 'users' && (
                    <div className="mb-6">
                        <button
                            onClick={openAddModal}
                            className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                        >
                            <Plus size={18} />
                            Thêm bài viết
                        </button>
                    </div>
                )}

                {/* Data Table - Hide on users tab */}
                {activeTab !== 'users' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Đang tải...</div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Tiêu đề</th>
                                        {activeTab === 'news' && (
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Category</th>
                                        )}
                                        {activeTab === 'service' && (
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Dịch vụ</th>
                                        )}
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Trạng thái</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {(activeTab === 'news' ? newsArticles : serviceArticles).map((article) => (
                                        <tr key={article.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {article.thumbnail && (
                                                        <img
                                                            src={article.thumbnail}
                                                            alt=""
                                                            className="w-12 h-12 rounded-lg object-cover"
                                                        />
                                                    )}
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium text-gray-900 line-clamp-1">
                                                                {article.title}
                                                            </p>
                                                            {activeTab === 'service' && (article as ServiceArticle).featured && (
                                                                <span title="Hiển thị trên trang chủ" className="text-yellow-400">
                                                                    <Star size={16} fill="currentColor" />
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {activeTab === 'news' && (
                                                <td className="px-6 py-4">
                                                    <span
                                                        className="text-xs font-bold uppercase"
                                                        style={{ color: (article as NewsArticle).category_color || '#E91E63' }}
                                                    >
                                                        {(article as NewsArticle).category}
                                                    </span>
                                                </td>
                                            )}
                                            {activeTab === 'service' && (
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-700">
                                                        {services.find(s => s.id === (article as ServiceArticle).service_id)?.name || '-'}
                                                    </span>
                                                </td>
                                            )}
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${article.published
                                                    ? 'bg-green-100 text-green-600'
                                                    : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {article.published ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {canEdit(article) && (
                                                        <button
                                                            onClick={() => openEditModal(article)}
                                                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                    )}
                                                    {canDelete() && (
                                                        <button
                                                            onClick={() => handleDelete(article.id)}
                                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* Users Management - Only for admin */}
                {activeTab === 'users' && canManageUsers() && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b">
                            <h2 className="text-lg font-bold text-gray-900">Quản lý tài khoản</h2>
                        </div>

                        {/* Add User Form */}
                        <div className="p-6 border-b bg-gray-50">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Thêm tài khoản mới</h3>
                            <div className="text-xs text-gray-500 mb-4 space-y-1">
                                <p><span className="font-semibold text-blue-600">Agent:</span> Thêm, sửa, xóa tất cả bài viết</p>
                                <p><span className="font-semibold text-gray-600">Member:</span> Chỉ thêm và sửa bài viết của mình</p>
                            </div>
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                const form = e.target as HTMLFormElement;
                                const newUsername = (form.elements.namedItem('newUsername') as HTMLInputElement).value;
                                const newPassword = (form.elements.namedItem('newPassword') as HTMLInputElement).value;
                                const newRole = (form.elements.namedItem('newRole') as HTMLSelectElement).value;

                                const { error } = await supabase
                                    .from('admin_users')
                                    .insert([{ username: newUsername, password: newPassword, role: newRole }]);

                                if (!error) {
                                    form.reset();
                                    fetchAdminUsers();
                                } else {
                                    alert('Lỗi: ' + error.message);
                                }
                            }} className="flex gap-4 items-end flex-wrap">
                                <div className="flex-1 min-w-[150px]">
                                    <label className="block text-xs text-gray-500 mb-1">Display Name</label>
                                    <input
                                        name="newName"
                                        type="text"
                                        placeholder="Tên hiển thị"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-pink outline-none"
                                    />
                                </div>
                                <div className="flex-1 min-w-[150px]">
                                    <label className="block text-xs text-gray-500 mb-1">Username</label>
                                    <input
                                        name="newUsername"
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-pink outline-none"
                                    />
                                </div>
                                <div className="flex-1 min-w-[150px]">
                                    <label className="block text-xs text-gray-500 mb-1">Password</label>
                                    <input
                                        name="newPassword"
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-pink outline-none"
                                    />
                                </div>
                                <div className="w-32">
                                    <label className="block text-xs text-gray-500 mb-1">Role</label>
                                    <select
                                        name="newRole"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-pink outline-none"
                                    >
                                        <option value="agent">Agent</option>
                                        <option value="member">Member</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
                                >
                                    <Plus size={18} className="inline mr-1" />
                                    Thêm
                                </button>
                            </form>
                        </div>

                        {/* Users Table */}
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Username</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Role</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {adminUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            <div className="flex items-center gap-3">
                                                {/* Avatar */}
                                                <div className="relative group/avatar">
                                                    {user.avatar_url ? (
                                                        <img src={user.avatar_url} alt={user.username} className="w-10 h-10 rounded-full object-cover border-2 border-gray-200" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-brand-pink/10 flex items-center justify-center border-2 border-gray-200">
                                                            <span className="text-sm font-bold text-brand-pink uppercase">{user.username.charAt(0)}</span>
                                                        </div>
                                                    )}
                                                    <label className="absolute inset-0 rounded-full cursor-pointer opacity-0 group-hover/avatar:opacity-100 bg-black/40 flex items-center justify-center transition-opacity">
                                                        <Upload size={14} className="text-white" />
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={async (e) => {
                                                                const file = e.target.files?.[0];
                                                                if (!file) return;
                                                                const { url, error } = await uploadThumbnail(file, 'avatars');
                                                                if (url && !error) {
                                                                    await supabase.from('admin_users').update({ avatar_url: url }).eq('id', user.id);
                                                                    fetchAdminUsers();
                                                                } else {
                                                                    alert('Lỗi upload avatar: ' + (error?.message || 'Unknown'));
                                                                }
                                                            }}
                                                        />
                                                    </label>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{user.name || user.username}</div>
                                                    <div className="text-xs text-gray-500">
                                                        @{user.username}
                                                        {user.username === 'admin' && (
                                                            <span className="ml-1 text-purple-600 font-semibold">(Super Admin)</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' :
                                                user.role === 'agent' ? 'bg-blue-100 text-blue-600' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {user.username !== 'admin' && (
                                                <button
                                                    onClick={async () => {
                                                        if (!confirm(`Xóa tài khoản ${user.username}?`)) return;
                                                        await supabase.from('admin_users').delete().eq('id', user.id);
                                                        fetchAdminUsers();
                                                    }}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="p-6 border-b flex items-center justify-between">
                            <h2 className="text-xl font-bold">
                                {editingArticle ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tiêu đề *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink outline-none"
                                />
                            </div>



                            {activeTab === 'news' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Category
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-pink outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Excerpt
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.excerpt}
                                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-pink outline-none"
                                        />
                                    </div>
                                </>
                            )}

                            {activeTab === 'service' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Dịch vụ *
                                        </label>
                                        <select
                                            value={formData.service_id}
                                            onChange={(e) => {
                                                const newServiceId = e.target.value;
                                                setFormData({ ...formData, service_id: newServiceId, project_category_id: '' });
                                                fetchCategories(newServiceId);
                                            }}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-pink outline-none"
                                        >
                                            <option value="">-- Chọn dịch vụ --</option>
                                            {services.map((service) => (
                                                <option key={service.id} value={service.id}>
                                                    {service.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {projectCategories.length > 0 && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Danh mục dự án (chọn nhiều)
                                            </label>
                                            <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-gray-50 max-h-40 overflow-y-auto">
                                                {projectCategories.map((cat) => {
                                                    const isChecked = formData.project_category_ids.includes(cat.id);
                                                    return (
                                                        <label
                                                            key={cat.id}
                                                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded border cursor-pointer transition-all text-sm ${isChecked
                                                                ? 'bg-brand-pink text-white border-brand-pink'
                                                                : 'bg-white text-gray-700 border-gray-300 hover:border-brand-pink'
                                                                }`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setFormData({
                                                                            ...formData,
                                                                            project_category_ids: [...formData.project_category_ids, cat.id]
                                                                        });
                                                                    } else {
                                                                        setFormData({
                                                                            ...formData,
                                                                            project_category_ids: formData.project_category_ids.filter(id => id !== cat.id)
                                                                        });
                                                                    }
                                                                }}
                                                                className="sr-only"
                                                            />
                                                            {cat.name}
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                            {formData.project_category_ids.length > 0 && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Đã chọn: {formData.project_category_ids.length} danh mục
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Thumbnail *
                                </label>
                                <div className="space-y-3">
                                    {/* Preview */}
                                    {(thumbnailFile || formData.thumbnail) && (
                                        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100 border">
                                            <img
                                                src={thumbnailFile ? URL.createObjectURL(thumbnailFile) : formData.thumbnail}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                onClick={() => {
                                                    setThumbnailFile(null);
                                                    setFormData({ ...formData, thumbnail: '' });
                                                }}
                                                className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:bg-red-100 text-red-500"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}

                                    {/* File Input */}
                                    <div className="flex items-center gap-3">
                                        <label className="flex-1 cursor-pointer">
                                            <div className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-brand-pink hover:bg-brand-pink/5 transition-colors group">
                                                <div className="flex items-center gap-2 text-gray-500 group-hover:text-brand-pink">
                                                    <Upload size={20} />
                                                    <span className="text-sm font-medium">
                                                        {thumbnailFile ? thumbnailFile.name : 'Upload ảnh từ máy'}
                                                    </span>
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) setThumbnailFile(file);
                                                    }}
                                                />
                                            </div>
                                        </label>
                                        <span className="text-sm text-gray-400">hoặc</span>
                                        <input
                                            type="text"
                                            value={formData.thumbnail}
                                            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                            className="w-1/3 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-pink outline-none text-sm"
                                            placeholder="Paste URL..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Logo Upload - Service Articles Only */}
                            {activeTab === 'service' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Logo (hiển thị trên card dự án)
                                    </label>
                                    <div className="space-y-3">
                                        {/* Logo Preview */}
                                        {(logoFile || formData.logo) && (
                                            <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100 border">
                                                <img
                                                    src={logoFile ? URL.createObjectURL(logoFile) : formData.logo}
                                                    alt="Logo Preview"
                                                    className="w-full h-full object-contain p-2"
                                                />
                                                <button
                                                    onClick={() => {
                                                        setLogoFile(null);
                                                        setFormData({ ...formData, logo: '' });
                                                    }}
                                                    className="absolute top-1 right-1 p-1 bg-white/80 rounded-full hover:bg-red-100 text-red-500"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        )}

                                        {/* Logo File Input */}
                                        <div className="flex items-center gap-3">
                                            <label className="flex-1 cursor-pointer">
                                                <div className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-brand-pink hover:bg-brand-pink/5 transition-colors group">
                                                    <div className="flex items-center gap-2 text-gray-500 group-hover:text-brand-pink">
                                                        <Upload size={20} />
                                                        <span className="text-sm font-medium">
                                                            {logoFile ? logoFile.name : 'Upload logo từ máy'}
                                                        </span>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) setLogoFile(file);
                                                        }}
                                                    />
                                                </div>
                                            </label>
                                            <span className="text-sm text-gray-400">hoặc</span>
                                            <input
                                                type="text"
                                                value={formData.logo}
                                                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                                className="w-1/3 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-pink outline-none text-sm"
                                                placeholder="Paste URL..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nội dung
                                </label>
                                <div className="border rounded-lg overflow-hidden">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.content}
                                        onChange={(value) => setFormData({ ...formData, content: value })}
                                        modules={{
                                            toolbar: [
                                                [{ 'header': [1, 2, 3, false] }],
                                                ['bold', 'italic', 'underline', 'strike'],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                [{ 'align': [] }],
                                                ['link', 'image'],
                                                ['clean']
                                            ],
                                        }}
                                        formats={[
                                            'header',
                                            'bold', 'italic', 'underline', 'strike',
                                            'list', 'bullet',
                                            'align',
                                            'link', 'image'
                                        ]}
                                        placeholder="Nhập nội dung bài viết..."
                                        style={{ minHeight: '250px' }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-4">
                                <input
                                    type="checkbox"
                                    id="published"
                                    checked={formData.published}
                                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                    className="w-5 h-5 accent-brand-pink"
                                />
                                <label htmlFor="published" className="text-sm font-medium text-gray-700">
                                    Published
                                </label>
                            </div>

                            {/* Featured checkbox - Service Articles Only */}
                            {activeTab === 'service' && (
                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="featured"
                                        checked={formData.featured}
                                        disabled={(() => {
                                            const otherFeatured = serviceArticles.filter(a =>
                                                (a as ServiceArticle).featured &&
                                                a.id !== editingArticle?.id
                                            ).length;
                                            return !formData.featured && otherFeatured >= 6;
                                        })()}
                                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                        className="w-5 h-5 accent-brand-pink disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                    <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                                        ⭐ Hiển thị ở trang chủ (tối đa 6 bài)
                                    </label>
                                    {(() => {
                                        const otherFeatured = serviceArticles.filter(a =>
                                            (a as ServiceArticle).featured &&
                                            a.id !== editingArticle?.id
                                        ).length;
                                        if (!formData.featured && otherFeatured >= 6) {
                                            return <span className="text-xs text-red-500 font-medium ml-2">(Đã đủ 6 bài)</span>;
                                        }
                                        return null;
                                    })()}
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isUploading || loading}
                                className="flex items-center gap-2 px-6 py-2 bg-brand-pink text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                {isUploading ? 'Đang tải...' : 'Lưu'}
                            </button>
                        </div>
                    </motion.div >
                </div >
            )}
        </div >
    );
};
