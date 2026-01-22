import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Building2, Share2, Facebook, Linkedin, Link2 } from 'lucide-react';
import { FooterSection } from './FooterSection';
import { supabase, ServiceArticle, NewsArticle } from '../lib/supabase';
import { marked } from 'marked';
import { Link } from 'react-router-dom';

// Combined article type for display
type DisplayArticle = (ServiceArticle & { category?: string }) | (NewsArticle & { service?: { name: string } });

export const ArticlePage: React.FC = () => {
    const [article, setArticle] = useState<DisplayArticle | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            const params = new URLSearchParams(window.location.search);
            const articleId = params.get('id');

            if (!articleId) {
                setLoading(false);
                return;
            }

            try {
                // First try service_articles table
                const { data: serviceArticle, error: serviceError } = await supabase
                    .from('service_articles')
                    .select('*, service:services(*)')
                    .eq('id', articleId)
                    .single();

                if (serviceArticle && !serviceError) {
                    setArticle(serviceArticle);
                    return;
                }

                // If not found, try news_articles table
                const { data: newsArticle, error: newsError } = await supabase
                    .from('news_articles')
                    .select('*')
                    .eq('id', articleId)
                    .single();

                if (newsArticle && !newsError) {
                    // Add service-like structure for compatibility
                    setArticle({
                        ...newsArticle,
                        service: { name: newsArticle.category }
                    });
                }
            } catch (err) {
                console.error('Error fetching article:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, []);

    // Sample article content for demo
    const sampleContent = `
Một "điểm đau" khi mua sắm của khách hàng mà một doanh nghiệp nên biết đó là sản phẩm thực tế khi nhận được không giống với những gì được giới thiệu trên website hay kỳ vọng của họ. Để tăng trải nghiệm của khách hàng và chiếm ưu thế hơn so với đối thủ cạnh tranh, việc sở hữu một showroom 3D sẽ giúp cho doanh nghiệp bạn nổi bật, tạo điểm khác biệt trong ngành hàng kinh doanh, vừa quảng bá thương hiệu hiệu quả mà vừa đem lại những giá trị riêng cho khách hàng.

## Showroom 3D là gì?

Gian hàng 3D (Showroom 3D) là nơi mà doanh nghiệp trưng bày và giới thiệu sản phẩm của mình đến khách hàng. Ở những gian hàng truyền thống, khách hàng phải đến tận nơi mới có thể trực tiếp kiểm tra và trải nghiệm sản phẩm. Nhưng với công nghệ gian hàng 3D, khách hàng có thể nhìn thấy được tổng quan gian hàng cũng như sản phẩm ở nhiều chiều khác nhau, kiểm tra từng chi tiết nhỏ như kích thước, màu sắc và tương tác với dịch vụ bán hàng của doanh nghiệp một cách dễ dàng.

Hãy thử tưởng tượng, giữa một không gian triển lãm với nhiều gian hàng, quầy sản phẩm của bạn nổi bật lên với một concept thú vị và khác biệt: có thể là một khu vườn bi ẩn, xanh mát hoặc một thành phố tương lai rực sáng như phim khoa học viễn tưởng... Làm sao kỳ vị khi ngang qua cũng phải dừng lại để xuýt xoa, trầm trồ.

## Lợi ích của Showroom 3D

- **Tăng tương tác**: Khách hàng có thể khám phá sản phẩm 360 độ
- **Tiết kiệm chi phí**: Không cần thuê mặt bằng vật lý
- **Tiếp cận rộng**: Khách hàng từ mọi nơi đều có thể ghé thăm
- **Ấn tượng chuyên nghiệp**: Thể hiện sự đầu tư và đẳng cấp thương hiệu

Chắc chắn lúc đó, nhãn hàng của bạn sẽ đạt được những giá trị mong muốn: Nâng cao nhận diện thương hiệu & Thúc đẩy doanh số trực tiếp.
    `;

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-pink border-t-transparent"></div>
            </div>
        );
    }

    const displayArticle = article || {
        id: 'demo',
        title: 'Thu hút khách hàng, nâng cao sự chuyên nghiệp khi sở hữu gian hàng trưng bày 3D cho riêng mình',
        content: sampleContent,
        thumbnail: '/projects/design-project.jpg',
        created_at: '2024-07-15',
        service: { name: 'Thiết kế' }
    };

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 h-20 flex items-center">
                <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/logo-hugs.png" alt="HUGs Agency" className="h-12 object-contain" />
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase text-gray-700">
                        <Link to="/" className="hover:text-brand-pink transition-colors">Trang chủ</Link>
                        <Link to="/about" className="hover:text-brand-pink transition-colors">Giới thiệu</Link>
                        <Link to="/service" className="hover:text-brand-pink transition-colors">Dịch vụ</Link>
                        <Link to="/projects" className="hover:text-brand-pink transition-colors">Dự án</Link>
                        <Link to="/careers" className="hover:text-brand-pink transition-colors">Tuyển dụng</Link>
                        <Link to="/news" className="text-brand-pink">Tin tức</Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-xs font-bold text-gray-500 cursor-pointer hover:border-brand-pink hover:text-brand-pink">
                            VN
                        </div>
                        <button className="bg-brand-dark text-white px-5 py-2 rounded-full text-xs font-bold uppercase hover:bg-brand-pink transition-colors">
                            Đăng ký tư vấn
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section with Gradient */}
            <div className="pt-20 bg-gradient-to-b from-pink-50 to-white">
                <div className="max-w-4xl mx-auto px-6 py-16">
                    {/* Back button */}


                    {/* Category Tag */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <span className="inline-block px-4 py-1.5 bg-brand-pink/10 text-brand-pink text-sm font-bold rounded-full border border-brand-pink/20">
                            {(displayArticle as any).service?.name || 'Thiết kế'}
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
                            <span>15/07/2024</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User size={16} className="text-brand-pink" />
                            <span>HUGs Team</span>
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                            <span className="text-gray-400">Khách hàng:</span>
                            <div className="flex items-center gap-2">
                                <Building2 size={16} className="text-brand-pink" />
                                <span className="font-semibold text-brand-pink">Ahamove</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Share Buttons */}
                    <motion.div
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <span className="text-sm text-gray-500">Chia sẻ:</span>
                        <button className="w-9 h-9 rounded-full bg-brand-pink/10 text-brand-pink hover:bg-brand-pink hover:text-white transition-colors flex items-center justify-center">
                            <Facebook size={16} />
                        </button>
                        <button className="w-9 h-9 rounded-full bg-brand-pink/10 text-brand-pink hover:bg-brand-pink hover:text-white transition-colors flex items-center justify-center">
                            <Linkedin size={16} />
                        </button>
                        <button className="w-9 h-9 rounded-full bg-brand-pink/10 text-brand-pink hover:bg-brand-pink hover:text-white transition-colors flex items-center justify-center">
                            <Link2 size={16} />
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Featured Image */}
            <motion.div
                className="max-w-5xl mx-auto px-6 -mt-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
            >
                <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                    <img
                        src={displayArticle.thumbnail || '/projects/design-project.jpg'}
                        alt={displayArticle.title}
                        className="w-full aspect-video object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://picsum.photos/1200/600?random=1';
                        }}
                    />
                </div>
            </motion.div>

            {/* Article Content */}
            <div className="max-w-4xl mx-auto px-6 py-16">
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
                                const content = displayArticle.content || (displayArticle as any).excerpt || sampleContent;
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
                                <div className="aspect-[16/10] overflow-hidden">
                                    <img
                                        src={`https://picsum.photos/400/250?random=${i + 10}`}
                                        alt="Related article"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-5">
                                    <span className="text-xs text-brand-pink font-medium">Thiết kế</span>
                                    <h4 className="text-lg font-bold text-gray-900 mt-2 line-clamp-2 group-hover:text-brand-pink transition-colors">
                                        Bài viết liên quan #{i}
                                    </h4>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div> */}

            {/* Footer */}
            <FooterSection />
        </div>
    );
};
