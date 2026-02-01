import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowRight, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { FooterSection } from './FooterSection';
import { PageNavbar } from './PageNavbar';
import { supabase, Service, ServiceArticle, ProjectCategory, fetchProjectCategories } from '../lib/supabase';

// Helper to strip HTML tags and entities for preview
const stripHtml = (html: string | null): string => {
    if (!html) return '';
    // Remove HTML tags
    let text = html.replace(/<[^>]*>/g, '');
    // Decode common HTML entities
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    text = text.replace(/&quot;/g, '"');
    text = text.replace(/&#39;/g, "'");
    // Remove extra whitespace
    text = text.replace(/\s+/g, ' ').trim();
    return text;
};

export const ProjectsPage: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [articles, setArticles] = useState<ServiceArticle[]>([]);
    const [selectedService, setSelectedService] = useState<string>('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [categories, setCategories] = useState<ProjectCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Fetch services on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch all services
                const { data: servicesData, error: servicesError } = await supabase
                    .from('services')
                    .select('*, category:service_categories(*)')
                    .order('display_order');

                if (servicesError) throw servicesError;

                setServices(servicesData || []);
            } catch (err) {
                console.error('Error fetching services:', err);
                setError('Không thể tải danh sách dịch vụ');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Sync selected service with URL params
    useEffect(() => {
        const serviceSlug = searchParams.get('service');
        if (serviceSlug) {
            setSelectedService(serviceSlug);
        } else if (services.length > 0 && !selectedService) {
            // Only set default if nothing selected and no param
            setSelectedService(services[0].slug);
        }
    }, [searchParams, services]);

    // Fetch articles when selected service changes
    useEffect(() => {
        const fetchArticles = async () => {
            if (!selectedService) return;

            try {
                setSelectedCategoryId(null); // Reset category filter

                // Fetch articles
                const { data, error } = await supabase
                    .from('service_articles')
                    .select('*, service:services!inner(*), project_category:project_categories(*)')
                    .eq('service.slug', selectedService)
                    .eq('published', true)
                    .order('display_order');

                if (error) throw error;
                setArticles(data || []);

                // Fetch categories for this service
                const service = services.find(s => s.slug === selectedService);
                if (service) {
                    const cats = await fetchProjectCategories(service.id);
                    setCategories(cats);
                } else {
                    setCategories([]);
                }
            } catch (err) {
                console.error('Error fetching articles:', err);
            }
        };

        fetchArticles();
    }, [selectedService]);

    // Get selected service details
    const activeService = services.find(s => s.slug === selectedService);

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Navbar - Always visible on service page */}
            <PageNavbar activePage="projects" />

            {/* Main Content */}
            <div className="pt-20">
                {/* Header */}
                <div className="bg-gray-50 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-12 text-center">
                        <h1 className="text-4xl lg:text-5xl font-black mb-4 text-gray-900">
                            Dịch Vụ Của HUGs Agency
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Giải pháp truyền thông toàn diện, từ chiến lược đến triển khai
                        </p>
                    </div>

                    {/* Service Tabs - Horizontal */}
                    <div className="overflow-x-auto pb-4">
                        <div className="px-6 flex justify-center">
                            <div className="flex gap-2 flex-wrap justify-center">
                                {loading ? (
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Loader2 className="animate-spin" size={20} />
                                        <span>Đang tải...</span>
                                    </div>
                                ) : (
                                    services.map((service) => (
                                        <button
                                            key={service.id}
                                            onClick={() => setSearchParams({ service: service.slug })}
                                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border relative overflow-hidden ${selectedService === service.slug
                                                ? 'bg-brand-pink text-white border-brand-pink'
                                                : 'bg-white text-gray-600 border-brand-pink/50 hover:border-brand-pink hover:text-brand-pink'
                                                }`}
                                            style={{
                                                background: selectedService !== service.slug
                                                    ? 'linear-gradient(to top, transparent, transparent)'
                                                    : undefined
                                            }}
                                            onMouseEnter={(e) => {
                                                if (selectedService !== service.slug) {
                                                    (e.target as HTMLElement).style.background = 'linear-gradient(to top, rgba(255,2,144,0.25) 0%, transparent 70%)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (selectedService !== service.slug) {
                                                    (e.target as HTMLElement).style.background = 'transparent';
                                                }
                                            }}
                                        >
                                            {service.name}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
                            {error}
                        </div>
                    </div>
                )}

                {/* 2-Column Layout: Categories Left, Articles Right */}
                {!loading && !error && activeService && (
                    <div className="max-w-7xl mx-auto px-6 py-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                            {/* Left Column - Category Filter */}
                            <div className="lg:col-span-3">
                                <div className="sticky top-28">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">{activeService.name}</h3>
                                    <p className="text-gray-600 text-sm mb-6">{activeService.short_description}</p>

                                    {/* Category Filter */}
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => setSelectedCategoryId(null)}
                                            className={`w-full text-left px-4 py-3 rounded-full border transition-all text-sm font-medium flex items-center justify-between group ${selectedCategoryId === null
                                                ? 'bg-brand-pink text-white border-brand-pink'
                                                : 'bg-white text-gray-700 border-brand-pink/50 hover:bg-brand-pink hover:text-white hover:border-brand-pink'
                                                }`}
                                        >
                                            Tất cả
                                            <ChevronRight size={16} className={`${selectedCategoryId === null ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`} />
                                        </button>
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setSelectedCategoryId(cat.id)}
                                                className={`w-full text-left px-4 py-3 rounded-full border transition-all text-sm font-medium flex items-center justify-between group ${selectedCategoryId === cat.id
                                                    ? 'bg-brand-pink text-white border-brand-pink'
                                                    : 'bg-white text-gray-700 border-brand-pink/50 hover:bg-brand-pink hover:text-white hover:border-brand-pink'
                                                    }`}
                                            >
                                                {cat.name}
                                                <ChevronRight size={16} className={`${selectedCategoryId === cat.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Articles */}
                            <div className="lg:col-span-9">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeService.slug + (selectedCategoryId || 'all')}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {selectedCategoryId ? categories.find(c => c.id === selectedCategoryId)?.name : 'Dự án tiêu biểu'}
                                            </h3>
                                            <a href="#" className="text-brand-pink text-sm font-medium hover:underline flex items-center gap-1">
                                                Xem tất cả <ArrowRight size={14} />
                                            </a>
                                        </div>

                                        {(() => {
                                            const filteredArticles = selectedCategoryId
                                                ? articles.filter(a => a.project_category_id === selectedCategoryId)
                                                : articles;

                                            return filteredArticles.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {filteredArticles.map((article) => (
                                                        <motion.a
                                                            key={article.id}
                                                            href={`/article?id=${article.id}`}
                                                            className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer group block"
                                                            whileHover={{ y: -5 }}
                                                        >
                                                            <div className="aspect-[16/10] overflow-hidden bg-gray-100 relative">
                                                                <img
                                                                    src={article.thumbnail || `https://picsum.photos/600/400?random=${article.id}`}
                                                                    alt={article.title}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                    onError={(e) => {
                                                                        (e.target as HTMLImageElement).src = `https://picsum.photos/600/400?random=${article.id}`;
                                                                    }}
                                                                />
                                                                {/* Category Tag */}
                                                                {article.project_category?.name && (
                                                                    <span className="absolute bottom-3 left-3 bg-black/70 text-white text-xs font-medium px-3 py-1 rounded">
                                                                        {article.project_category.name}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="p-5">
                                                                <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-pink transition-colors">
                                                                    {article.title}
                                                                </h4>
                                                                <p className="text-sm text-gray-500 line-clamp-2">
                                                                    {stripHtml(article.content)}
                                                                </p>
                                                            </div>
                                                        </motion.a>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                                                    <p className="text-gray-500">Chưa có bài viết nào{selectedCategoryId ? ` cho category này` : ''}</p>
                                                </div>
                                            );
                                        })()}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <FooterSection />
        </div>
    );
};
