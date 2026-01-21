import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchNewsArticles, NewsArticle } from '../lib/supabase';

export const NewsSection: React.FC = () => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadArticles = async () => {
            try {
                const data = await fetchNewsArticles(4);
                setArticles(data);
            } catch (error) {
                console.error('Error loading news articles:', error);
            } finally {
                setLoading(false);
            }
        };

        loadArticles();
    }, []);

    const handleArticleClick = (article: NewsArticle) => {
        window.location.href = `/article?id=${article.id}`;
    };

    if (loading) {
        return (
            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-12">
                        <h2 className="text-2xl lg:text-3xl font-black text-gray-900 flex items-center gap-2">
                            <span className="text-brand-pink">*</span>
                            <span>E-Magazine</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[4/3] rounded-xl bg-gray-200 mb-4"></div>
                                <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (articles.length === 0) {
        return null;
    }

    return (
        <section className="py-24 bg-white overflow-hidden relative">
            {/* Logo marker - bottom right */}
            <img
                src="/logo-hugs-only.png"
                alt=""
                className="absolute bottom-8 right-8 w-14 h-14 opacity-10 pointer-events-none"
            />
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-2xl lg:text-3xl font-black text-gray-900 flex items-center gap-2">
                        <span className="text-brand-pink">*</span>
                        <span>E-Magazine</span>
                    </h2>
                </motion.div>

                {/* Articles Grid - 4 columns on desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {articles.map((article, index) => (
                        <motion.article
                            key={article.id}
                            className="group cursor-pointer"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            onClick={() => handleArticleClick(article)}
                        >
                            {/* Image Container */}
                            <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4">
                                <img
                                    src={article.thumbnail || `https://picsum.photos/600/400?random=${index}`}
                                    alt={article.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://picsum.photos/600/400?random=${index}`;
                                    }}
                                />
                            </div>

                            {/* Category Tag */}
                            <div className="mb-2">
                                <span
                                    className="text-xs font-bold uppercase tracking-wide"
                                    style={{ color: article.category_color || '#E91E63' }}
                                >
                                    {article.category}
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-3 group-hover:text-brand-pink transition-colors">
                                {article.title}
                            </h3>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
};