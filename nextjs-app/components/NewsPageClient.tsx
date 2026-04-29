'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ChevronRight, TrendingUp, Clock, Flame, Headphones } from 'lucide-react';
import { NewsArticle, AdminAuthor } from '@/lib/types';
import { PageNavbar } from '@/components/ui/PageNavbar';
import { FooterSection } from '@/components/ui/FooterSection';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDocumentHead } from '@/lib/useDocumentHead';

const INITIAL_ITEMS_PER_SECTION = 3;
const BATCH_SIZE = 30;

// Skeleton component for loading states
const ArticleSkeleton: React.FC<{ featured?: boolean }> = ({ featured }) => (
    <div className={`animate-pulse ${featured ? 'h-full min-h-[300px] md:min-h-[400px]' : ''}`}>
        <div className={`bg-gray-200 mb-3 ${featured ? 'aspect-[900/598]' : 'aspect-[900/598]'}`} />
        {!featured && (
            <>
                <div className="h-3 bg-gray-200 rounded w-20 mb-2" />
                <div className="h-5 bg-gray-200 rounded w-full mb-2" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-32 mt-2" />
            </>
        )}
    </div>
);

const SectionSkeleton: React.FC = () => (
    <div className="mb-12">
        <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-gray-200">
            <div className="h-7 bg-gray-200 rounded w-40 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
                <ArticleSkeleton key={i} />
            ))}
        </div>
    </div>
);

export const NewsPageClient: React.FC<{
    initialArticles: NewsArticle[];
    categories: any[];
    totalCount?: number;
}> = ({ initialArticles, categories, totalCount = 0 }) => {
    const { t } = useLanguage();
    const [articles, setArticles] = useState<NewsArticle[]>(initialArticles);
    const [topAuthors, setTopAuthors] = useState<AdminAuthor[]>([]);
    const [activeTab, setActiveTab] = useState('all');
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(initialArticles.length < totalCount);
    const [initialLoading] = useState(initialArticles.length === 0);

    // Primary navigation tabs
    const primaryTabs = [
        { id: 'all', label: t('news.tabs.all'), icon: TrendingUp },
        { id: 'Tin marketing', label: t('news.categories.marketing'), icon: TrendingUp },
        { id: 'Xu hướng', label: t('news.categories.viewpoint'), icon: Clock },
        { id: 'Giới trẻ', label: t('news.categories.knowledge'), icon: Flame },
        { id: 'Sự kiện', label: t('news.categories.casestudy'), icon: Flame },
        { id: 'Tin Hugs Agency', label: t('news.categories.hugs'), icon: Headphones },
    ];

    // Category sections
    const categorySections = [
        { id: 'Tin marketing', label: t('news.categories.marketing'), color: '#E91E63' },
        { id: 'Xu hướng', label: t('news.categories.viewpoint'), color: '#9C27B0' },
        { id: 'Giới trẻ', label: t('news.categories.knowledge'), color: '#2196F3' },
        { id: 'Sự kiện', label: t('news.categories.casestudy'), color: '#FF9800' },
        { id: 'Tin Hugs Agency', label: t('news.categories.hugs'), color: '#eb2166' },
    ];

    useEffect(() => {
        window.scrollTo(0, 0);

        let mounted = true;

        const autoLoadAll = async () => {
            setLoadingMore(true);
            let currentOffset = initialArticles.length;
            let keepFetching = true;
            const fetchLimit = 30; // Reduced to avoid overwhelming WP

            while (keepFetching && mounted) {
                try {
                    const res = await fetch(`/api/news?limit=${fetchLimit}&offset=${currentOffset}`);
                    const data = await res.json();

                    if (data.articles && data.articles.length > 0) {
                        setArticles(prev => {
                            const existingIds = new Set(prev.map((a: NewsArticle) => a.id));
                            const newArticles = data.articles.filter((a: NewsArticle) => !existingIds.has(a.id));
                            return [...prev, ...newArticles];
                        });
                        currentOffset += data.articles.length;
                    }

                    if (!data.hasMore || !data.articles || data.articles.length === 0) {
                        keepFetching = false;
                        if (mounted) setHasMore(false);
                    } else {
                        // Add a delay to avoid overwhelming the server
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                } catch (error) {
                    console.error('Error auto-loading articles:', error);
                    keepFetching = false;
                }
            }

            if (mounted) {
                setLoadingMore(false);
            }
        };

        // Start auto-loading if there are more articles to fetch
        if (initialArticles.length > 0 && initialArticles.length < totalCount) {
            const timer = setTimeout(() => {
                autoLoadAll();
            }, 1000); // 1s delay to prioritize initial page render

            return () => {
                mounted = false;
                clearTimeout(timer);
            };
        }

        return () => {
            mounted = false;
        };
    }, [initialArticles.length, totalCount]);

    // Load remaining articles in background after initial render
    const loadMoreArticles = async () => {
        if (!hasMore || loadingMore) return;

        try {
            setLoadingMore(true);
            const offset = articles.length;

            const res = await fetch(`/api/news?limit=${BATCH_SIZE}&offset=${offset}`);
            const data = await res.json();

            if (data.articles && data.articles.length > 0) {
                setArticles(prev => {
                    // Deduplicate by ID
                    const existingIds = new Set(prev.map((a: NewsArticle) => a.id));
                    const newArticles = data.articles.filter((a: NewsArticle) => !existingIds.has(a.id));
                    return [...prev, ...newArticles];
                });
            }

            if (!data.hasMore || !data.articles || data.articles.length === 0) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error loading more articles:', error);
        } finally {
            setLoadingMore(false);
        }
    };


    // Get featured articles for hero grid
    const featuredArticles = useMemo(() => {
        let result = [...articles].sort((a, b) =>
            new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        );

        if (activeTab !== 'all') {
            result = result.filter(a => a.category?.toLowerCase() === activeTab.toLowerCase());
        }

        return result.slice(0, 5);
    }, [articles, activeTab]);

    // Get articles by category
    const getArticlesByCategory = (categoryId: string) => {
        return articles.filter(a => a.category?.toLowerCase() === categoryId.toLowerCase());
    };

    const handleArticleClick = (article: NewsArticle) => {
        window.location.href = `/${article.slug}`;
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
        setTopAuthors([
            {
                id: 'admin',
                username: 'admin',
                name: 'Admin',
                avatar_url: '',
                role: 'admin',
                article_count: articles.length,
                total_views: articles.reduce((sum, a) => sum + (a.views || 0), 0)
            }
        ]);
    }, [articles]);

    const hotArticles = articles.slice(0, 5);

    useDocumentHead({
        title: 'Tin tức Marketing & Xu hướng',
        description: 'Cập nhật tin tức marketing, xu hướng digital mới nhất, case study và kiến thức ngành từ HUGs Agency.',
        keywords: 'tin tức marketing, xu hướng digital, case study, HUGs Agency, social media',
    });

    return (
        <div className="min-h-screen bg-white text-gray-900">
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
                    {initialLoading ? (
                        /* Full skeleton loading state */
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-8">
                                {/* Hero skeleton */}
                                <div className="mb-12">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                        <div className="md:col-span-8">
                                            <ArticleSkeleton featured />
                                        </div>
                                        <div className="md:col-span-4">
                                            <ArticleSkeleton />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                        {[0, 1, 2].map((i) => <ArticleSkeleton key={i} />)}
                                    </div>
                                </div>
                                {/* Section skeletons */}
                                <SectionSkeleton />
                                <SectionSkeleton />
                            </div>
                            <aside className="lg:col-span-4">
                                <div className="space-y-4 animate-pulse">
                                    {[0, 1, 2, 3, 4].map((i) => (
                                        <div key={i} className="h-16 bg-gray-200 rounded-xl" />
                                    ))}
                                </div>
                            </aside>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Main Content Area */}
                            <div className="lg:col-span-8">
                                {/* Hero Grid - Featured Articles */}
                                {featuredArticles.length > 0 && (
                                    <div className="mb-12">
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                            {/* Large featured article */}
                                            <div className="md:col-span-8">
                                                <motion.article
                                                    className="cursor-pointer group h-full"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    onClick={() => handleArticleClick(featuredArticles[0])}
                                                >
                                                    <div className="relative aspect-[900/598] overflow-hidden bg-gray-100">
                                                        <img
                                                            src={featuredArticles[0].thumbnail || 'https://picsum.photos/800/600?random=1'}
                                                            alt={featuredArticles[0].title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            loading="eager"
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
                                                                <span className="font-medium">{featuredArticles[0].author_details?.name || featuredArticles[0].author || t('news.author')}</span>
                                                                <span>•</span>
                                                                <span>{new Date(featuredArticles[0].created_at || '').toLocaleDateString('vi-VN')}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.article>
                                            </div>

                                            {/* Right side article */}
                                            {featuredArticles[1] && (
                                                <div className="md:col-span-4">
                                                    <motion.article
                                                        className="cursor-pointer group"
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.1 }}
                                                        onClick={() => handleArticleClick(featuredArticles[1])}
                                                    >
                                                        <div className="aspect-[900/598] overflow-hidden bg-gray-100 mb-3">
                                                            <img
                                                                src={featuredArticles[1].thumbnail || 'https://picsum.photos/600/400?random=2'}
                                                                alt={featuredArticles[1].title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                                loading="eager"
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
                                                            <span className="font-medium">{featuredArticles[1].author_details?.name || featuredArticles[1].author || t('news.author')}</span>
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
                                                    <div className="aspect-[900/598] overflow-hidden bg-gray-100 mb-3">
                                                        <img
                                                            src={article.thumbnail || `https://picsum.photos/400/300?random=${index + 3}`}
                                                            alt={article.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            loading="lazy"
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
                                                        <span className="font-medium">{article.author_details?.name || article.author || t('news.author')}</span>
                                                        <span>•</span>
                                                        <span>{new Date(article.created_at || '').toLocaleDateString('vi-VN')}</span>
                                                    </div>
                                                </motion.article>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Content Grid based on activeTab */}
                                {activeTab === 'all' ? (
                                    <>
                                        {/* Category Sections */}
                                        {categorySections.map((section) => {
                                            const sectionArticles = getArticlesByCategory(section.id);
                                            if (sectionArticles.length === 0 && !loadingMore) return null;

                                            const isExpanded = expandedSections.has(section.id);
                                            const displayedArticles = isExpanded ? sectionArticles : sectionArticles.slice(0, INITIAL_ITEMS_PER_SECTION);
                                            const hasMoreItems = sectionArticles.length > INITIAL_ITEMS_PER_SECTION;

                                            return (
                                                <div key={section.id} className="mb-12">
                                                    <div className="flex items-center justify-between mb-6 pb-3 border-b-2" style={{ borderColor: section.color }}>
                                                        <h2 className="text-2xl font-bold text-gray-900">
                                                            {section.label}
                                                        </h2>
                                                        {hasMoreItems && (
                                                            <button
                                                                onClick={() => toggleSection(section.id)}
                                                                className="flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all"
                                                                style={{ color: section.color }}
                                                            >
                                                                {isExpanded ? t('news.collapse') : t('news.viewMore')}
                                                                <ChevronRight size={16} />
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        {displayedArticles.length > 0 ? (
                                                            displayedArticles.map((article, index) => (
                                                                <motion.article
                                                                    key={article.id}
                                                                    className="cursor-pointer group"
                                                                    initial={{ opacity: 0, y: 20 }}
                                                                    whileInView={{ opacity: 1, y: 0 }}
                                                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                                                    viewport={{ once: true }}
                                                                    onClick={() => handleArticleClick(article)}
                                                                >
                                                                    <div className="aspect-[900/598] overflow-hidden bg-gray-100 mb-3">
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
                                                                        <span className="font-medium">{article.author_details?.name || article.author || t('news.author')}</span>
                                                                        <span>•</span>
                                                                        <span>{new Date(article.created_at || '').toLocaleDateString('vi-VN')}</span>
                                                                    </div>
                                                                </motion.article>
                                                            ))
                                                        ) : (
                                                            /* Show skeletons while background loading if no articles found yet */
                                                            <>
                                                                <ArticleSkeleton />
                                                                <ArticleSkeleton />
                                                                <ArticleSkeleton />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Load More Indicator/Button */}
                                        {hasMore && !loadingMore && (
                                            <div className="flex justify-center py-8">
                                                <button
                                                    onClick={loadMoreArticles}
                                                    className="px-6 py-2 border-2 border-brand-pink rounded-full text-brand-pink font-semibold hover:bg-brand-pink hover:text-white transition-all hover:shadow-md"
                                                >
                                                    Tải thêm tin tức
                                                </button>
                                            </div>
                                        )}
                                        {loadingMore && (
                                            <div className="flex items-center justify-center gap-3 py-8 text-gray-500">
                                                <Loader2 className="animate-spin text-brand-pink" size={20} />
                                                <span className="text-sm">Đang tải thêm bài viết...</span>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="mb-12">
                                        <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-brand-pink">
                                            <h2 className="text-2xl font-bold text-gray-900 uppercase">
                                                {activeTab}
                                            </h2>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {articles
                                                .filter(a => a.category?.toLowerCase() === activeTab.toLowerCase())
                                                .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
                                                .slice(5)
                                                .map((article, index) => (
                                                    <motion.article
                                                        key={article.id}
                                                        className="cursor-pointer group"
                                                        initial={{ opacity: 0, y: 20 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                                        viewport={{ once: true }}
                                                        onClick={() => handleArticleClick(article)}
                                                    >
                                                        <div className="aspect-[900/598] overflow-hidden bg-gray-100 mb-3">
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
                                                            <span className="font-medium">{article.author_details?.name || article.author || t('news.author')}</span>
                                                            <span>•</span>
                                                            <span>{new Date(article.created_at || '').toLocaleDateString('vi-VN')}</span>
                                                        </div>
                                                    </motion.article>
                                                ))}
                                        </div>

                                        {hasMore && !loadingMore && (
                                            <div className="flex justify-center py-8">
                                                <button
                                                    onClick={loadMoreArticles}
                                                    className="px-6 py-2 border-2 border-brand-pink rounded-full text-brand-pink font-semibold hover:bg-brand-pink hover:text-white transition-all hover:shadow-md"
                                                >
                                                    Tải thêm tin tức
                                                </button>
                                            </div>
                                        )}
                                        {loadingMore && (
                                            <div className="flex items-center justify-center gap-3 py-8 text-gray-500">
                                                <Loader2 className="animate-spin text-brand-pink" size={20} />
                                                <span className="text-sm">Đang tải thêm bài viết...</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Sidebar */}
                            <aside className="lg:col-span-4">
                                {/* Top Authors */}
                                <div className="mb-10">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-brand-pink">
                                        {t('news.topAuthors')}
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
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${rankColors[index]}`}>
                                                        {index + 1}
                                                    </div>
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
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-semibold truncate ${index === 0 ? 'text-brand-pink' : 'text-gray-900'
                                                            }`}>
                                                            {author.name || author.username}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {author.article_count} {t('news.articles')}
                                                        </p>
                                                    </div>
                                                    <div className="text-right flex-shrink-0">
                                                        <p className="text-sm font-bold text-brand-pink">
                                                            {author.total_views?.toLocaleString()}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">{t('news.views')}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {topAuthors.length === 0 && (
                                            <p className="text-sm text-gray-400 text-center py-4">{t('news.empty.data')}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Hot Articles */}
                                <div className="bg-gray-50 p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                                        {t('news.hotThisWeek')}
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
                                                        {article.author_details?.name || article.author || t('news.author')} • {new Date(article.created_at || '').toLocaleDateString('vi-VN')}
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
