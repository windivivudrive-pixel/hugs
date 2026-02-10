import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ChevronRight, TrendingUp, Clock, Flame, Headphones } from 'lucide-react';
import { fetchNewsArticles, fetchTopAuthors, NewsArticle, AdminAuthor } from '../lib/supabase';
import { PageNavbar } from './PageNavbar';
import { FooterSection } from './FooterSection';

// Primary navigation tabs
const primaryTabs = [
    { id: 'all', label: 'Sôi nổi', icon: TrendingUp },
    { id: 'hot', label: 'Đang hot', icon: Flame },
    { id: 'latest', label: 'Mới nhất', icon: Clock },
    { id: 'podcast', label: 'Podcast', icon: Headphones },
];

// Category sections
const categorySections = [
    { id: 'TIN MARKETING', label: 'Tin Marketing', color: '#E91E63' },
    { id: 'GÓC NHÌN', label: 'Góc nhìn', color: '#9C27B0' },
    { id: 'KIẾN THỨC', label: 'Kiến thức', color: '#2196F3' },
    { id: 'CASE STUDY', label: 'Case study', color: '#FF9800' },
    { id: 'TOP LIST', label: 'Top List', color: '#00BCD4' },
    { id: 'TIN HUGS', label: 'Tin HUGs', color: '#eb2166' },
];

const INITIAL_ITEMS_PER_SECTION = 3;

export const NewsPage: React.FC = () => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [topAuthors, setTopAuthors] = useState<AdminAuthor[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const loadArticles = async () => {
            try {
                const data = await fetchNewsArticles(100);
                setArticles(data);
            } catch (error) {
                console.error('Error loading news articles:', error);
            } finally {
                setLoading(false);
            }
        };
        loadArticles();
    }, []);

    // Get featured articles for hero grid
    const featuredArticles = useMemo(() => {
        let result = [...articles];
        if (activeTab === 'hot') {
            result = result.filter(a => a.category === 'ĐANG HOT' || a.category?.includes('HOT'));
        } else if (activeTab === 'latest') {
            result = result.sort((a, b) =>
                new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
            );
        } else if (activeTab === 'podcast') {
            result = result.filter(a => a.category === 'PODCAST');
        }
        return result.slice(0, 5); // Top 5 for hero grid
    }, [articles, activeTab]);

    // Get articles by category
    const getArticlesByCategory = (categoryId: string) => {
        return articles.filter(a => a.category === categoryId);
    };

    const handleArticleClick = (article: NewsArticle) => {
        window.location.href = `/article?id=${article.id}`;
    };

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
    };

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => {
            const next = new Set(prev);
            if (next.has(sectionId)) {
                next.delete(sectionId);
            } else {
                next.add(sectionId);
            }
            return next;
        });
    };

    // Fetch top authors
    useEffect(() => {
        fetchTopAuthors(5).then(setTopAuthors);
    }, []);

    // Get hot articles for sidebar
    const hotArticles = articles.slice(0, 5);

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <title>Tin tức Marketing & Xu hướng | HUGs Agency</title>
            <PageNavbar activePage="news" />

            {/* Primary Navigation */}
            <section className="pt-8 pb-2 bg-white border-b border-gray-100 sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="flex gap-1 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                        {primaryTabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabClick(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all ${activeTab === tab.id
                                        ? 'bg-brand-pink text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    <Icon size={16} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="pt-24 pb-8">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    {loading ? (
                        <div className="flex items-center justify-center min-h-[400px]">
                            <Loader2 className="animate-spin text-brand-pink" size={40} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Main Content Area */}
                            <div className="lg:col-span-8">
                                {/* Hero Grid - Featured Articles */}
                                {featuredArticles.length > 0 && (
                                    <div className="mb-12">
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                            {/* Large featured article (left) - 8 cols = 2/3 width */}
                                            <div className="md:col-span-8">
                                                <motion.article
                                                    className="cursor-pointer group h-full"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    onClick={() => handleArticleClick(featuredArticles[0])}
                                                >
                                                    <div className="relative h-full min-h-[300px] md:min-h-[400px] overflow-hidden bg-gray-100">
                                                        <img
                                                            src={featuredArticles[0].thumbnail || 'https://picsum.photos/800/600?random=1'}
                                                            alt={featuredArticles[0].title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                                            <span className="inline-block px-3 py-1 bg-brand-pink text-white text-xs font-bold uppercase rounded mb-3">
                                                                {featuredArticles[0].category}
                                                            </span>
                                                            <h2 className="text-xl md:text-2xl font-bold leading-tight mb-2 group-hover:text-brand-pink transition-colors">
                                                                {featuredArticles[0].title}
                                                            </h2>
                                                            <p className="text-sm text-white/80 line-clamp-2 mb-3">
                                                                {featuredArticles[0].excerpt}
                                                            </p>
                                                            <div className="flex items-center gap-2 text-xs text-white/70">
                                                                <span className="font-medium">{featuredArticles[0].author_details?.name || featuredArticles[0].author || 'Tác giả'}</span>
                                                                <span>•</span>
                                                                <span>{new Date(featuredArticles[0].created_at || '').toLocaleDateString('vi-VN')}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.article>
                                            </div>

                                            {/* Right side article - 4 cols = 1/3 width */}
                                            {featuredArticles[1] && (
                                                <div className="md:col-span-4">
                                                    <motion.article
                                                        className="cursor-pointer group"
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.1 }}
                                                        onClick={() => handleArticleClick(featuredArticles[1])}
                                                    >
                                                        <div className="aspect-video overflow-hidden bg-gray-100 mb-3">
                                                            <img
                                                                src={featuredArticles[1].thumbnail || 'https://picsum.photos/600/400?random=2'}
                                                                alt={featuredArticles[1].title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        </div>
                                                        <span
                                                            className="text-xs font-bold uppercase tracking-wide"
                                                            style={{ color: featuredArticles[1].category_color || '#E91E63' }}
                                                        >
                                                            {featuredArticles[1].category}
                                                        </span>
                                                        <h3 className="text-lg font-bold text-gray-900 leading-snug mt-2 mb-2 line-clamp-2 group-hover:text-brand-pink transition-colors">
                                                            {featuredArticles[1].title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                                            {featuredArticles[1].excerpt}
                                                        </p>
                                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                                            <span className="font-medium">{featuredArticles[1].author_details?.name || featuredArticles[1].author || 'Tác giả'}</span>
                                                            <span>•</span>
                                                            <span>{new Date(featuredArticles[1].created_at || '').toLocaleDateString('vi-VN')}</span>
                                                        </div>
                                                    </motion.article>
                                                </div>
                                            )}
                                        </div>

                                        {/* Bottom row - 3 smaller articles */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                            {featuredArticles.slice(2, 5).map((article, index) => (
                                                <motion.article
                                                    key={article.id}
                                                    className="cursor-pointer group"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 + index * 0.1 }}
                                                    onClick={() => handleArticleClick(article)}
                                                >
                                                    <div className="aspect-video overflow-hidden bg-gray-100 mb-3">
                                                        <img
                                                            src={article.thumbnail || `https://picsum.photos/400/300?random=${index + 3}`}
                                                            alt={article.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    </div>
                                                    <span
                                                        className="text-xs font-bold uppercase tracking-wide"
                                                        style={{ color: article.category_color || '#E91E63' }}
                                                    >
                                                        {article.category}
                                                    </span>
                                                    <h3 className="text-base font-bold text-gray-900 leading-snug mt-1 line-clamp-2 group-hover:text-brand-pink transition-colors">
                                                        {article.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                                                        <span className="font-medium">{article.author_details?.name || article.author || 'Tác giả'}</span>
                                                        <span>•</span>
                                                        <span>{new Date(article.created_at || '').toLocaleDateString('vi-VN')}</span>
                                                    </div>
                                                </motion.article>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Hot & Podcast Section */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                                    {/* Column 1: Tin Hot */}
                                    <div className="bg-gray-50 flex flex-col border border-gray-200 shadow-sm">
                                        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-brand-pink/10">
                                            <h3 className="font-bold text-brand-pink text-lg flex items-center gap-2">
                                                <Flame size={20} className="fill-brand-pink" />
                                                Tin Hot
                                            </h3>
                                        </div>

                                        <div className="p-4 flex-1 flex flex-col gap-4">
                                            {/* Filter hot news */}
                                            {(() => {
                                                const hotNews = articles.filter(a => a.category === 'ĐANG HOT' || a.category?.includes('HOT') || a.category?.includes('TIN')).slice(0, 3);
                                                const mainHot = hotNews[0];
                                                const subHot = hotNews.slice(1, 3);

                                                if (!mainHot) return <div className="text-gray-400 text-sm p-4">Chưa có tin hot nào.</div>;

                                                return (
                                                    <>
                                                        <div onClick={() => handleArticleClick(mainHot)} className="group cursor-pointer">
                                                            <div className="aspect-video rounded-none overflow-hidden mb-3 relative">
                                                                <img
                                                                    src={mainHot.thumbnail || `https://picsum.photos/600/400?random=${mainHot.id}`}
                                                                    alt={mainHot.title}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                                />
                                                                <span className="absolute bottom-2 left-2 px-2 py-1 bg-brand-pink text-white text-[10px] font-bold uppercase rounded">
                                                                    {mainHot.category}
                                                                </span>
                                                            </div>
                                                            <h3 className="text-gray-900 font-bold text-lg leading-snug group-hover:text-brand-pink transition-colors">
                                                                {mainHot.title}
                                                            </h3>
                                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                                                                <span>{mainHot.author_details?.name || mainHot.author || 'HUGs Team'}</span>
                                                                <span>•</span>
                                                                <span>{new Date(mainHot.created_at || '').toLocaleDateString('vi-VN')}</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col gap-3 mt-2 border-t border-gray-200 pt-4">
                                                            {subHot.map(sub => (
                                                                <div key={sub.id} onClick={() => handleArticleClick(sub)} className="group cursor-pointer flex gap-3 items-start">
                                                                    <div className="flex-1">
                                                                        <h4 className="text-gray-700 text-base font-medium line-clamp-2 group-hover:text-brand-pink transition-colors">
                                                                            {sub.title}
                                                                        </h4>
                                                                        <p className="text-xs text-gray-400 mt-1">{new Date(sub.created_at || '').toLocaleDateString('vi-VN')}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    {/* Column 2: Podcast */}
                                    <div className="bg-gray-50 flex flex-col border border-gray-200 shadow-sm">
                                        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-purple-500/20 to-indigo-500/20">
                                            <h3 className="font-bold text-purple-700 text-lg flex items-center gap-2">
                                                <Headphones size={20} />
                                                Podcast
                                            </h3>
                                        </div>

                                        <div className="p-4 flex-1 flex flex-col gap-4">
                                            {/* Filter podcast */}
                                            {(() => {
                                                const podcasts = articles.filter(a => a.category === 'PODCAST').slice(0, 3);
                                                const mainPod = podcasts[0];
                                                const subPod = podcasts.slice(1, 3);

                                                if (!mainPod) return <div className="text-gray-400 text-sm p-4">Chưa có podcast nào.</div>;

                                                return (
                                                    <>
                                                        <div onClick={() => handleArticleClick(mainPod)} className="group cursor-pointer">
                                                            <div className="aspect-video rounded-xl overflow-hidden mb-3 relative">
                                                                <img
                                                                    src={mainPod.thumbnail || `https://picsum.photos/600/400?random=${mainPod.id}`}
                                                                    alt={mainPod.title}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                                />
                                                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                                                                        <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
                                                                    </div>
                                                                </div>
                                                                <span className="absolute bottom-2 left-2 px-2 py-1 bg-purple-600 text-white text-[10px] font-bold uppercase rounded">
                                                                    New Episode
                                                                </span>
                                                            </div>
                                                            <h3 className="text-gray-900 font-bold text-lg leading-snug group-hover:text-purple-600 transition-colors">
                                                                {mainPod.title}
                                                            </h3>
                                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                                                                <span>{mainPod.author_details?.name || mainPod.author || 'HUGs Team'}</span>
                                                                <span>•</span>
                                                                <span>{new Date(mainPod.created_at || '').toLocaleDateString('vi-VN')}</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col gap-3 mt-2 border-t border-gray-200 pt-4">
                                                            {subPod.map(sub => (
                                                                <div key={sub.id} onClick={() => handleArticleClick(sub)} className="group cursor-pointer flex gap-3 items-start">
                                                                    <div className="flex-1">
                                                                        <h4 className="text-gray-700 text-base font-medium line-clamp-2 group-hover:text-purple-600 transition-colors">
                                                                            {sub.title}
                                                                        </h4>
                                                                        <p className="text-xs text-gray-400 mt-1">{new Date(sub.created_at || '').toLocaleDateString('vi-VN')}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>

                                {/* Category Sections */}
                                {categorySections.map((section) => {
                                    const sectionArticles = getArticlesByCategory(section.id);
                                    if (sectionArticles.length === 0) return null;

                                    const isExpanded = expandedSections.has(section.id);
                                    const displayedArticles = isExpanded ? sectionArticles : sectionArticles.slice(0, INITIAL_ITEMS_PER_SECTION);
                                    const hasMore = sectionArticles.length > INITIAL_ITEMS_PER_SECTION;

                                    return (
                                        <div key={section.id} className="mb-12">
                                            {/* Section Header */}
                                            <div className="flex items-center justify-between mb-6 pb-3 border-b-2" style={{ borderColor: section.color }}>
                                                <h2 className="text-2xl font-bold text-gray-900">
                                                    {section.label}
                                                </h2>
                                                {hasMore && (
                                                    <button
                                                        onClick={() => toggleSection(section.id)}
                                                        className="flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all"
                                                        style={{ color: section.color }}
                                                    >
                                                        {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                                                        <ChevronRight size={16} />
                                                    </button>
                                                )}
                                            </div>

                                            {/* Section Articles Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {displayedArticles.map((article, index) => (
                                                    <motion.article
                                                        key={article.id}
                                                        className="cursor-pointer group"
                                                        initial={{ opacity: 0, y: 20 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                                        viewport={{ once: true }}
                                                        onClick={() => handleArticleClick(article)}
                                                    >
                                                        <div className="aspect-video overflow-hidden bg-gray-100 mb-3">
                                                            <img
                                                                src={article.thumbnail || `https://picsum.photos/400/300?random=${article.id}`}
                                                                alt={article.title}
                                                                loading="lazy"
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        </div>
                                                        <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-brand-pink transition-colors">
                                                            {article.title}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                                                            <span className="font-medium">{article.author_details?.name || article.author || 'Tác giả'}</span>
                                                            <span>•</span>
                                                            <span>{new Date(article.created_at || '').toLocaleDateString('vi-VN')}</span>
                                                        </div>
                                                    </motion.article>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Sidebar */}
                            <aside className="lg:col-span-4">
                                {/* Top Authors */}
                                <div className="mb-10">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-brand-pink">
                                        🏆 Top Tác giả
                                    </h3>
                                    <div className="space-y-3">
                                        {topAuthors.map((author, index) => {
                                            const rankColors = [
                                                'bg-gradient-to-r from-yellow-400 to-amber-500 text-white',
                                                'bg-gradient-to-r from-gray-300 to-gray-400 text-white',
                                                'bg-gradient-to-r from-amber-600 to-amber-700 text-white',
                                                'bg-gray-100 text-gray-600',
                                                'bg-gray-100 text-gray-600',
                                            ];
                                            return (
                                                <div
                                                    key={author.id}
                                                    className={`flex items-center gap-3 p-3 rounded-xl transition-all hover:shadow-md ${index === 0 ? 'bg-gradient-to-r from-pink-50 to-amber-50 border border-pink-200' : 'bg-gray-50 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {/* Rank Badge */}
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${rankColors[index]}`}>
                                                        {index + 1}
                                                    </div>

                                                    {/* Avatar */}
                                                    {author.avatar_url ? (
                                                        <img
                                                            src={author.avatar_url}
                                                            alt={author.name || author.username}
                                                            className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-sm"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-brand-pink/10 flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
                                                            <span className="text-sm font-bold text-brand-pink uppercase">
                                                                {(author.name || author.username).charAt(0)}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-semibold truncate ${index === 0 ? 'text-brand-pink' : 'text-gray-900'
                                                            }`}>
                                                            {author.name || author.username}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {author.article_count} bài viết
                                                        </p>
                                                    </div>

                                                    {/* View Count */}
                                                    <div className="text-right flex-shrink-0">
                                                        <p className="text-sm font-bold text-brand-pink">
                                                            {author.total_views.toLocaleString()}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">views</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {topAuthors.length === 0 && (
                                            <p className="text-sm text-gray-400 text-center py-4">Chưa có dữ liệu</p>
                                        )}
                                    </div>
                                </div>

                                {/* Hot Articles */}
                                <div className="bg-gray-50 p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                                        Bài hot trong tuần
                                    </h3>
                                    <div className="space-y-4">
                                        {hotArticles.map((article, index) => (
                                            <div
                                                key={article.id}
                                                className="flex gap-4 cursor-pointer group"
                                                onClick={() => handleArticleClick(article)}
                                            >
                                                <span className="text-3xl font-black text-brand-pink w-8">
                                                    #{index + 1}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-brand-pink transition-colors">
                                                        {article.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {article.author_details?.name || article.author || 'Tác giả'} • {new Date(article.created_at || '').toLocaleDateString('vi-VN')}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </aside>
                        </div>
                    )}
                </div>
            </section>

            <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <FooterSection />
        </div>
    );
};
