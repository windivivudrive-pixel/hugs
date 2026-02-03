import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ChevronRight, TrendingUp, Clock, Flame, Headphones } from 'lucide-react';
import { fetchNewsArticles, NewsArticle } from '../lib/supabase';
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

    // Get hot articles for sidebar
    const hotArticles = articles.slice(0, 5);
    const editorPicks = articles.slice(0, 4);

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
                                                                <span className="font-medium">{featuredArticles[0].author || 'HUGs Team'}</span>
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
                                                            <span className="font-medium">{featuredArticles[1].author || 'HUGs Team'}</span>
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
                                                        <span className="font-medium">{article.author || 'HUGs Team'}</span>
                                                        <span>•</span>
                                                        <span>{new Date(article.created_at || '').toLocaleDateString('vi-VN')}</span>
                                                    </div>
                                                </motion.article>
                                            ))}
                                        </div>
                                    </div>
                                )}

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
                                                            <span className="font-medium">{article.author || 'HUGs Team'}</span>
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
                                {/* Editor's Picks */}
                                <div className="mb-10">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-brand-pink">
                                        Editor's Picks
                                    </h3>
                                    <div className="space-y-4">
                                        {editorPicks.map((article) => (
                                            <div
                                                key={article.id}
                                                className="flex gap-4 cursor-pointer group"
                                                onClick={() => handleArticleClick(article)}
                                            >
                                                <div className="w-20 h-20 flex-shrink-0 overflow-hidden bg-gray-100">
                                                    <img
                                                        src={article.thumbnail || 'https://picsum.photos/100/100'}
                                                        alt={article.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-brand-pink transition-colors">
                                                        {article.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(article.created_at || '').toLocaleDateString('vi-VN')}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
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
                                                        {article.author || 'HUGs Team'} • {new Date(article.created_at || '').toLocaleDateString('vi-VN')}
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
