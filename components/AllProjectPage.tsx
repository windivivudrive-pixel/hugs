import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase, ServiceArticle, ServiceCategory, fetchServiceCategories } from '../lib/supabase';
import { Link, useSearchParams } from 'react-router-dom';
import { PageNavbar } from './PageNavbar';
import { FooterSection } from './FooterSection';

export const AllProjectPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const serviceSlug = searchParams.get('service');

    const [featuredProjects, setFeaturedProjects] = useState<ServiceArticle[]>([]);
    const [allProjects, setAllProjects] = useState<ServiceArticle[]>([]);
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [services, setServices] = useState<any[]>([]); // To look up service by slug
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(8);

    // Carousel auto-play
    const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch services (to map slug to id)
                const { data: servicesData } = await supabase
                    .from('services')
                    .select('*');

                if (servicesData) {
                    setServices(servicesData);
                    // If URL has service slug, find ID
                    if (serviceSlug) {
                        const s = servicesData.find(s => s.slug === serviceSlug);
                        if (s) setSelectedServiceId(s.id);
                    }
                }

                // Fetch featured projects (for carousel)
                const { data: featured, error: featuredError } = await supabase
                    .from('service_articles')
                    .select('*, service:services(*)')
                    .eq('published', true)
                    .eq('featured', true)
                    .order('display_order')
                    .limit(8);

                if (!featuredError && featured) {
                    setFeaturedProjects(featured);
                }

                // Fetch all projects
                const { data: all, error: allError } = await supabase
                    .from('service_articles')
                    .select('*, service:services(*)')
                    .eq('published', true)
                    .order('created_at', { ascending: false });

                if (!allError && all) {
                    setAllProjects(all);
                }

                // Fetch categories
                const cats = await fetchServiceCategories();
                setCategories(cats);

            } catch (err) {
                console.error('Error fetching projects:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [serviceSlug]); // Re-run when slug changes

    // Update selectedServiceId when serviceSlug changes (redundant but safe)
    useEffect(() => {
        if (serviceSlug && services.length > 0) {
            const s = services.find(s => s.slug === serviceSlug);
            if (s) {
                setSelectedServiceId(s.id);
                setSelectedCategory(null); // Clear category filter if service is selected
            }
        } else if (!serviceSlug) {
            setSelectedServiceId(null);
        }
    }, [serviceSlug, services]);


    // Auto-play carousel
    useEffect(() => {
        if (featuredProjects.length > 1) {
            autoPlayRef.current = setInterval(() => {
                setCurrentSlide(prev => (prev + 1) % featuredProjects.length);
            }, 5000);
        }
        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
            }
        };
    }, [featuredProjects.length]);

    const nextSlide = () => {
        setCurrentSlide(prev => (prev + 1) % featuredProjects.length);
    };

    const prevSlide = () => {
        setCurrentSlide(prev => (prev - 1 + featuredProjects.length) % featuredProjects.length);
    };

    // Filter projects logic
    const filteredProjects = allProjects.filter(p => {
        if (selectedServiceId) {
            return p.service_id === selectedServiceId;
        }
        if (selectedCategory) {
            return p.service_category_id === selectedCategory;
        }
        return true;
    });

    const displayedProjects = filteredProjects.slice(0, visibleCount);

    const loadMore = () => {
        setVisibleCount(prev => prev + 8);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-pink" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <PageNavbar activePage="projects" />

            {/* Hero Section */}
            <section className="pt-32 pb-12 px-6 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h1
                        className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        DỰ ÁN CỦA <span className="text-brand-pink">HUGs</span>
                    </motion.h1>
                    <motion.p
                        className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Khám phá những dự án truyền thông mạng xã hội thành công của HUGs Agency,
                        kiến tạo dấu ấn cho thương hiệu.
                    </motion.p>
                </div>
            </section>

            {/* Featured Carousel */}
            {featuredProjects.length > 0 && (
                <section className="relative px-6 pb-16">
                    <div className="max-w-6xl mx-auto">
                        <div className="relative">
                            {/* Navigation Arrows */}
                            <button
                                onClick={prevSlide}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-50 transition-colors"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-50 transition-colors"
                            >
                                <ChevronRight size={24} />
                            </button>

                            {/* Carousel Container */}
                            <div className="overflow-hidden shadow-2xl">
                                <div
                                    className="flex transition-transform duration-500 ease-out"
                                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                                >
                                    {featuredProjects.map((project, index) => (
                                        <Link
                                            key={project.id}
                                            to={`/article?id=${project.id}`}
                                            className="w-full flex-shrink-0 relative aspect-[16/7] group"
                                        >
                                            <img
                                                src={project.thumbnail || `https://picsum.photos/1200/500?random=${index}`}
                                                alt={project.title}
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                            {/* Content */}
                                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                                <div className="flex items-center gap-3 mb-3">
                                                    {project.logo && (
                                                        <img
                                                            src={project.logo}
                                                            alt=""
                                                            className="w-10 h-10 object-contain bg-white p-1"
                                                        />
                                                    )}
                                                    <span className="text-white/90 text-sm font-medium">
                                                        {(project as any).service?.name || 'HUGs Agency'}
                                                    </span>
                                                </div>
                                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 line-clamp-2">
                                                    {project.title}
                                                </h3>
                                                <span className="inline-block px-4 py-1 bg-brand-pink text-white text-sm font-semibold">
                                                    {project.category || 'PROJECT'}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Dots Indicator */}
                            <div className="flex justify-center gap-2 mt-6">
                                {featuredProjects.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`w-2 h-2 transition-all ${index === currentSlide
                                            ? 'w-8 bg-brand-pink'
                                            : 'bg-gray-300 hover:bg-gray-400'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* All Projects Grid */}
            <section className="px-6 pb-20">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                            TẤT CẢ DỰ ÁN
                        </h2>

                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => {
                                    setSelectedCategory(null);
                                    setSelectedServiceId(null);
                                    // Optional: Remove query param without full reload if desired, 
                                    // but state update is enough for view. 
                                    // ideally navigate('/projects') to clean URL but let's keep it simple first.
                                    window.history.pushState({}, '', '/projects');
                                }}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${!selectedCategory && !selectedServiceId
                                    ? 'bg-brand-pink text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Tất cả
                            </button>
                            {categories.slice(0, 5).map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        setSelectedCategory(cat.id);
                                        setSelectedServiceId(null);
                                        window.history.pushState({}, '', '/projects');
                                    }}
                                    className={`px-4 py-2 text-sm font-medium transition-colors ${selectedCategory === cat.id
                                        ? 'bg-brand-pink text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Projects Grid - Horizontal Cards */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-6" // Increased gap
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
                        }}
                    >
                        <AnimatePresence mode="popLayout">
                            {displayedProjects.map((project) => (
                                <motion.div
                                    key={project.id}
                                    layout
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <Link
                                        to={`/article?id=${project.id}`}
                                        className="flex flex-col bg-white overflow-hidden group shadow-sm hover:shadow-md transition-all border border-gray-100 h-full"
                                    >
                                        {/* Thumbnail */}
                                        <div className="w-full aspect-video flex-shrink-0 relative overflow-hidden">
                                            <img
                                                src={project.thumbnail || `https://picsum.photos/800/600?random=${project.id}`}
                                                alt={project.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {project.logo && (
                                                <div className="absolute top-3 left-3 bg-white p-1.5 shadow-sm rounded-lg">
                                                    <img
                                                        src={project.logo}
                                                        alt=""
                                                        className="w-8 h-8 object-contain"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 p-5 flex flex-col justify-center">
                                            <span className="text-brand-pink text-xs font-bold uppercase tracking-wide mb-2">
                                                {(project as any).service?.name || project.category || 'PROJECT'}
                                            </span>
                                            <h3 className="text-gray-900 font-bold text-base md:text-lg line-clamp-2 mb-3 group-hover:text-brand-pink transition-colors">
                                                {project.title}
                                            </h3>
                                            <span className="text-gray-500 text-xs font-medium flex items-center gap-1 mt-auto">
                                                Xem chi tiết <ArrowRight size={14} />
                                            </span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* Load More Button */}
                    {visibleCount < filteredProjects.length && (
                        <div className="text-center mt-12">
                            <button
                                onClick={loadMore}
                                className="px-8 py-3 bg-brand-pink text-white font-medium hover:bg-pink-600 transition-colors shadow-lg shadow-brand-pink/20"
                            >
                                Tải thêm dự án
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {displayedProjects.length === 0 && (
                        <div className="text-center py-16 bg-gray-50 rounded-2xl">
                            <p className="text-gray-500 text-lg">Chưa có dự án nào trong danh mục này</p>
                        </div>
                    )}
                </div>
            </section>

            <FooterSection />
        </div>
    );
};
