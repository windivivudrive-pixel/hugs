import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { fetchNewsArticles, NewsArticle } from '../lib/supabase';
import { PageNavbar } from './PageNavbar';
import { FooterSection } from './FooterSection';

export const NewsPage: React.FC = () => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const loadArticles = async () => {
            try {
                const data = await fetchNewsArticles(20); // Load more articles for full page
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

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Navbar */}
            <PageNavbar activePage="news" />

            {/* Hero Section */}
            <section className="pt-32 pb-16 bg-gradient-to-b from-brand-pink/5 to-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-2 bg-brand-pink/10 text-brand-pink rounded-full text-sm font-semibold mb-6">
                            MỚI
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black mb-6">
                            Tin tức &<br />
                            <span className="text-brand-pink">Xu hướng</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Cập nhật những thông tin mới nhất về marketing, social media và các xu hướng truyền thông số.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Articles Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    {loading ? (
                        <div className="flex items-center justify-center min-h-[400px]">
                            <Loader2 className="animate-spin text-brand-pink" size={40} />
                        </div>
                    ) : articles.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">Chưa có bài viết nào.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {articles.map((article, index) => (
                                <motion.article
                                    key={article.id}
                                    className="group cursor-pointer"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                    viewport={{ once: true }}
                                    onClick={() => handleArticleClick(article)}
                                >
                                    {/* Image Container */}
                                    <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-gray-100">
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

                                    {/* Date */}
                                    {article.created_at && (
                                        <p className="text-sm text-gray-400 mt-2">
                                            {new Date(article.created_at).toLocaleDateString('vi-VN')}
                                        </p>
                                    )}
                                </motion.article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <FooterSection />
        </div>
    );
};
