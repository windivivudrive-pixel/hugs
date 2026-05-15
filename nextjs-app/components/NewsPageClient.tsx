'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ChevronRight, TrendingUp, Clock, Flame, Headphones } from 'lucide-react';
import { NewsArticle } from '@/lib/types';
import { PageNavbar } from '@/components/ui/PageNavbar';
import { FooterSection } from '@/components/ui/FooterSection';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDocumentHead } from '@/lib/useDocumentHead';

const INITIAL_ITEMS_PER_SECTION = 3;

// ─── Types ───────────────────────────────────────────────────

interface CategoryFeedState {
    articles: NewsArticle[];
    cursor: string | null;
    hasMore: boolean;
    loading: boolean;
}

interface CategorySectionConfig {
    id: string;        // category slug (keyed in feeds)
    label: string;     // display name
    color: string;
}

// ─── Skeleton Components ─────────────────────────────────────

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

// ─── Main Component ──────────────────────────────────────────

export const NewsPageClient: React.FC<{
    initialFeeds: Record<string, {
        articles: NewsArticle[];
        cursor: string | null;
        hasMore: boolean;
    }>;
    categories: any[];
}> = ({ initialFeeds, categories }) => {
    const { t } = useLanguage();

    // ─── Per-category feed state ───
    const [feeds, setFeeds] = useState<Record<string, CategoryFeedState>>(() => {
        const state: Record<string, CategoryFeedState> = {};
        for (const [slug, feed] of Object.entries(initialFeeds)) {
            state[slug] = { ...feed, loading: false };
        }
        return state;
    });

    const [activeTab, setActiveTab] = useState('all');
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

    // Category section configs
    const categorySections: CategorySectionConfig[] = useMemo(() => [
        { id: 'tin-marketing', label: t('news.categories.marketing'), color: '#E91E63' },
        { id: 'xu-huong', label: t('news.categories.viewpoint'), color: '#9C27B0' },
        { id: 'gioi-tre', label: t('news.categories.knowledge'), color: '#2196F3' },
        { id: 'su-kien', label: t('news.categories.casestudy'), color: '#FF9800' },
        { id: 'tin-hugs-agency', label: t('news.categories.hugs'), color: '#eb2166' },
    ], [t]);

    // Primary navigation tabs
    const primaryTabs = useMemo(() => [
        { id: 'all', label: t('news.tabs.all'), icon: TrendingUp },
        { id: 'tin-marketing', label: t('news.categories.marketing'), icon: TrendingUp },
        { id: 'xu-huong', label: t('news.categories.viewpoint'), icon: Clock },
        { id: 'gioi-tre', label: t('news.categories.knowledge'), icon: Flame },
        { id: 'su-kien', label: t('news.categories.casestudy'), icon: Flame },
        { id: 'tin-hugs-agency', label: t('news.categories.hugs'), icon: Headphones },
    ], [t]);

    // ─── All articles flat (for hero & sidebar) ───
    const allArticles = useMemo(() => {
        const all: NewsArticle[] = [];
        for (const feed of Object.values(feeds)) {
            all.push(...feed.articles);
        }
        return all.sort((a, b) =>
            new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        );
    }, [feeds]);

    // ─── Featured articles for hero grid ───
    const featuredArticles = useMemo(() => {
        if (activeTab === 'all') {
            return allArticles.slice(0, 5);
        }
        const feed = feeds[activeTab];
        return feed ? feed.articles.slice(0, 5) : [];
    }, [allArticles, feeds, activeTab]);

    // ─── Load more for a specific category (cursor-based) ───
    const loadMoreByCategory = useCallback(async (categorySlug: string) => {
        const feed = feeds[categorySlug];
        if (!feed || !feed.hasMore || feed.loading) return;

        setFeeds(prev => ({
            ...prev,
            [categorySlug]: { ...prev[categorySlug], loading: true }
        }));

        try {
            const params = new URLSearchParams({
                mode: 'category',
                cat: categorySlug,
                limit: '10',
            });
            if (feed.cursor) params.set('cursor', feed.cursor);

            const res = await fetch(`/api/news?${params}`);
            const data = await res.json();

            setFeeds(prev => {
                const existing = prev[categorySlug];
                const existingIds = new Set(existing.articles.map(a => a.id));
                const newArticles = (data.articles || []).filter(
                    (a: NewsArticle) => !existingIds.has(a.id)
                );
                return {
                    ...prev,
                    [categorySlug]: {
                        articles: [...existing.articles, ...newArticles],
                        cursor: data.cursor || null,
                        hasMore: data.hasMore || false,
                        loading: false,
                    }
                };
            });
        } catch (error) {
            console.error(`Error loading more for ${categorySlug}:`, error);
            setFeeds(prev => ({
                ...prev,
                [categorySlug]: { ...prev[categorySlug], loading: false }
            }));
        }
    }, [feeds]);

    // ─── Handlers ───
    const handleArticleClick = (article: NewsArticle) => {
        window.location.href = `/${article.slug}`;
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

    const hotArticles = allArticles.slice(0, 5);
    const initialLoading = allArticles.length === 0;

    useDocumentHead({
        title: 'Tin tức Marketing & Xu hướng',
        description: 'Cập nhật tin tức marketing, xu hướng digital mới nhất, case study và kiến thức ngành từ HUGs Agency.',
        keywords: 'tin tức marketing, xu hướng digital, case study, HUGs Agency, social media',
    });

    // ─── Article Card Component ───
    const ArticleCard: React.FC<{
        article: NewsArticle;
        index: number;
    }> = ({ article, index }) => (
        <motion.article
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
    );

    // ─── Category Section Component ───
    const CategorySection: React.FC<{
        section: CategorySectionConfig;
    }> = ({ section }) => {
        const feed = feeds[section.id];
        if (!feed || feed.articles.length === 0) return null;

        const isExpanded = expandedSections.has(section.id);
        const displayedArticles = isExpanded
            ? feed.articles
            : feed.articles.slice(0, INITIAL_ITEMS_PER_SECTION);
        const hasMoreCollapsed = feed.articles.length > INITIAL_ITEMS_PER_SECTION;

        return (
            <div className="mb-12">
                <div className="flex items-center justify-between mb-6 pb-3 border-b-2" style={{ borderColor: section.color }}>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {section.label}
                    </h2>
                    {hasMoreCollapsed && !isExpanded && (
                        <button
                            onClick={() => toggleSection(section.id)}
                            className="flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all"
                            style={{ color: section.color }}
                        >
                            {t('news.viewMore')}
                            <ChevronRight size={16} />
                        </button>
                    )}
                    {isExpanded && hasMoreCollapsed && (
                        <button
                            onClick={() => toggleSection(section.id)}
                            className="flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all"
                            style={{ color: section.color }}
                        >
                            {t('news.collapse')}
                            <ChevronRight size={16} className="rotate-90" />
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {displayedArticles.map((article, index) => (
                        <ArticleCard key={article.id} article={article} index={index} />
                    ))}
                </div>

                {/* Load more button — only visible when expanded and server has more */}
                {isExpanded && feed.hasMore && (
                    <div className="flex justify-center pt-6">
                        <button
                            onClick={() => loadMoreByCategory(section.id)}
                            disabled={feed.loading}
                            className="px-6 py-2 border-2 rounded-full font-semibold transition-all hover:shadow-md disabled:opacity-50"
                            style={{
                                borderColor: section.color,
                                color: feed.loading ? '#999' : section.color,
                            }}
                        >
                            {feed.loading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="animate-spin" size={16} />
                                    Đang tải...
                                </span>
                            ) : (
                                'Tải thêm bài viết'
                            )}
                        </button>
                    </div>
                )}
            </div>
        );
    };

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
                                    onClick={() => setActiveTab(tab.id)}
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
                                <div className="mb-12">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                        <div className="md:col-span-8"><ArticleSkeleton featured /></div>
                                        <div className="md:col-span-4"><ArticleSkeleton /></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                        {[0, 1, 2].map((i) => <ArticleSkeleton key={i} />)}
                                    </div>
                                </div>
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
                                        {/* Category Sections — each with its own data */}
                                        {categorySections.map((section) => (
                                            <CategorySection key={section.id} section={section} />
                                        ))}
                                    </>
                                ) : (
                                    /* Single category view */
                                    (() => {
                                        const feed = feeds[activeTab];
                                        const section = categorySections.find(s => s.id === activeTab);
                                        if (!feed || !section) return null;

                                        // Show articles beyond hero (first 5)
                                        const remainingArticles = feed.articles.slice(5);

                                        return (
                                            <div className="mb-12">
                                                <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-brand-pink">
                                                    <h2 className="text-2xl font-bold text-gray-900 uppercase">
                                                        {section.label}
                                                    </h2>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    {remainingArticles.map((article, index) => (
                                                        <ArticleCard key={article.id} article={article} index={index} />
                                                    ))}
                                                </div>

                                                {feed.hasMore && (
                                                    <div className="flex justify-center py-8">
                                                        <button
                                                            onClick={() => loadMoreByCategory(activeTab)}
                                                            disabled={feed.loading}
                                                            className="px-6 py-2 border-2 border-brand-pink rounded-full text-brand-pink font-semibold hover:bg-brand-pink hover:text-white transition-all hover:shadow-md disabled:opacity-50"
                                                        >
                                                            {feed.loading ? (
                                                                <span className="flex items-center gap-2">
                                                                    <Loader2 className="animate-spin" size={16} />
                                                                    Đang tải...
                                                                </span>
                                                            ) : (
                                                                'Tải thêm tin tức'
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()
                                )}
                            </div>

                            {/* Sidebar */}
                            <aside className="lg:col-span-4">
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
