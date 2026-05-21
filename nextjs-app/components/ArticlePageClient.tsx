'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Building2, Share2, Facebook, Linkedin, Link2, Check } from 'lucide-react';
import { FooterSection } from '@/components/ui/FooterSection';
import { PageNavbar } from '@/components/ui/PageNavbar';
import { ServiceArticle, NewsArticle } from '@/lib/types';
import { recordArticleView } from '@/lib/viewTracker';
import { marked } from 'marked';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDocumentHead } from '@/lib/useDocumentHead';

// Combined article type for display
type DisplayArticle = (ServiceArticle & { category?: string }) | (NewsArticle & { service?: { name: string } });

export const ArticlePageClient: React.FC<{ article: DisplayArticle }> = ({ article }) => {
    const { t } = useLanguage();
    const [isNewsArticle, setIsNewsArticle] = useState(true);
    const [copied, setCopied] = useState(false);

    const handleFacebookShare = () => {
        const url = window.location.href;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        // The article data is pre-fetched on the server
        setIsNewsArticle(true);
    }, [article]);

    // Record view for news articles (with anti-cheat)
    useEffect(() => {
        if (isNewsArticle && article?.id) {
            recordArticleView(article.id);
        }
    }, [isNewsArticle, article?.id]);

    // Format all internal/external links in the article content to open in a new tab
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const container = document.querySelector('.article-content');
            if (container) {
                const links = container.querySelectorAll('a');
                links.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href) {
                        const hashIndex = href.indexOf('#');
                        if (hashIndex !== -1) {
                            const pathPart = href.substring(0, hashIndex);
                            const currentPath = window.location.pathname;
                            const cleanPathPart = pathPart.replace(window.location.origin, '');

                            const isCurrentPage = 
                                cleanPathPart === '' || 
                                cleanPathPart === currentPath || 
                                cleanPathPart === currentPath + '/' || 
                                currentPath === cleanPathPart + '/';

                            if (isCurrentPage) {
                                // Skip local Table of Contents / Hash anchors
                                return;
                            }
                        }
                        // Set attributes to open all other links (internal/external) in a new tab
                        link.setAttribute('target', '_blank');
                        link.setAttribute('rel', 'noopener noreferrer');
                    }
                });
            }
        }, 200);

        return () => clearTimeout(timeoutId);
    }, [article]);

    // SEO Head handled dynamically by Next.js Server Component
    useDocumentHead({
        title: article?.title || 'Bài viết',
        description: (article as NewsArticle)?.excerpt || article?.title || 'Đọc bài viết chi tiết trên HUGs Agency',
    });

    const displayArticle = article;

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Navbar */}
            <PageNavbar activePage="news" />

            {/* Hero Section with white background */}
            <div className="pt-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Back button */}


                    {/* Category Tag */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <span className="inline-block px-4 py-1.5 bg-brand-pink/10 text-brand-pink text-sm font-bold border border-brand-pink/20">
                            {displayArticle.category || (displayArticle as any).service?.name || 'Tin tức'}
                        </span>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        {displayArticle.title}
                    </motion.h1>

                    {/* Meta Info */}
                    <motion.div
                        className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-brand-pink" />
                            <span>{displayArticle.created_at ? new Date(displayArticle.created_at).toLocaleDateString('vi-VN') : '15/07/2024'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {((displayArticle as NewsArticle).author_details?.avatar_url) ? (
                                <img
                                    src={(displayArticle as NewsArticle).author_details?.avatar_url}
                                    alt={(displayArticle as NewsArticle).author_details?.name || (displayArticle as NewsArticle).author || 'Author'}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                    <User size={14} className="text-gray-500" />
                                </div>
                            )}
                            <span className="text-gray-900 font-medium">
                                {((displayArticle as NewsArticle).author_details?.name) || ((displayArticle as NewsArticle).author) || 'HUGS Agency'}
                            </span>
                        </div>
                    </motion.div>

                    {/* Share Buttons */}
                    <motion.div
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <span className="text-sm text-gray-500">{t('article.share')}:</span>
                        <button
                            onClick={handleFacebookShare}
                            className="w-9 h-9 bg-brand-pink/10 text-brand-pink hover:bg-brand-pink hover:text-white transition-colors flex items-center justify-center"
                            title="Share on Facebook"
                        >
                            <Facebook size={16} />
                        </button>
                        <button
                            onClick={handleCopyLink}
                            className="w-9 h-9 bg-brand-pink/10 text-brand-pink hover:bg-brand-pink hover:text-white transition-colors flex items-center justify-center relative"
                            title="Copy Link"
                        >
                            {copied ? <Check size={16} className="text-green-500" /> : <Link2 size={16} />}
                            {copied && (
                                <motion.span
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap"
                                >
                                    Copied!
                                </motion.span>
                            )}
                        </button>
                    </motion.div>
                </div>
            </div>



            {/* Article Content */}
            <div className="max-w-4xl mx-auto px-6">
                <motion.article
                    className="prose prose-lg prose-pink max-w-none"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    {/* Render content - supports both HTML (from Quill) and markdown */}
                    <div
                        className="article-content text-gray-700"
                        dangerouslySetInnerHTML={{
                            __html: (() => {
                                const content = displayArticle.content || (displayArticle as any).excerpt || '';
                                // If content already starts with HTML tags, render directly
                                if (content.trim().startsWith('<')) {
                                    return content;
                                }
                                // Otherwise, parse as markdown
                                return marked.parse(content) as string;
                            })()
                        }}
                    />
                </motion.article>

                {/* Inline Image */}
                {/* <motion.div
                    className="my-12 rounded-2xl overflow-hidden shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="bg-gradient-to-br from-brand-pink/20 to-pink-100 p-8">
                        <img
                            src="/culture2.png"
                            alt="Showroom 3D"
                            className="w-full rounded-xl shadow-xl"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://picsum.photos/800/500?random=2';
                            }}
                        />
                        <p className="text-center text-sm text-gray-500 mt-4">
                            Dịch vụ thiết kế gian hàng trưng bày sản phẩm của HUGs Agency
                        </p>
                    </div>
                </motion.div> */}

                {/* CTA Section */}
                {/* <motion.div
                    className="bg-gradient-to-r from-brand-pink to-pink-400 rounded-2xl p-8 text-white text-center my-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <h3 className="text-2xl font-bold mb-4">Bạn cần tư vấn về dịch vụ này?</h3>
                    <p className="text-white/80 mb-6">Liên hệ ngay với HUGs để được hỗ trợ</p>
                    <button className="bg-white text-brand-pink px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
                        Đăng ký tư vấn miễn phí
                    </button>
                </motion.div> */}
            </div>

            {/* Related Articles */}
            {/* <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Bài viết liên quan</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                                whileHover={{ y: -5 }}
                            >
                                <div className="aspect-[900/598] overflow-hidden">
                                    <img
                                        src={`https://picsum.photos/400/250?random=${i + 10}`}
alt = "Related article"
className = "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
                                </div >
    <div className="p-5">
        <span className="text-xs text-brand-pink font-medium">Thiết kế</span>
        <h4 className="text-lg font-bold text-gray-900 mt-2 line-clamp-2 group-hover:text-brand-pink transition-colors">
            Bài viết liên quan #{i}
        </h4>
    </div>
                            </motion.div >
                        ))}
                    </div >
                </div >
            </div > */}

            {/* Footer */}
            <FooterSection />
        </div >
    );
};
