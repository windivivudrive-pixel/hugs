'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchServices, fetchAllArticles, fetchProjectCategories } from '@/lib/actions-client';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { PageNavbar } from '@/components/ui/PageNavbar';
import { FooterSection } from '@/components/ui/FooterSection';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDocumentHead } from '@/lib/useDocumentHead';

export const AllProjectPage: React.FC = () => {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const router = useRouter();
    const serviceSlug = searchParams.get('service');

    useDocumentHead({
        title: 'Tất cả dự án',
        description: 'Xem toàn bộ dự án của HUGs Agency - Portfolio marketing, thiết kế, sáng tạo nội dung đa ngành hàng.',
        keywords: 'tất cả dự án, portfolio, marketing agency, HUGs Agency',
    });

    const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
    const [allProjects, setAllProjects] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
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
                const servicesData = await fetchServices();

                if (servicesData) {
                    setServices(servicesData);
                    // If URL has service slug, find ID
                    if (serviceSlug) {
                        const s = servicesData.find((s: any) => s.slug === serviceSlug);
                        if (s) setSelectedServiceId(s.id);
                    }
                }

                // Fetch all projects
                const all = await fetchAllArticles();
                
                // Map the service object if possible
                const mappedAll = all.map(p => {
                    if (p.service_id && !p.service?.name) {
                        const s = servicesData?.find((srv:any) => srv.id === p.service_id);
                        if (s) {
                            p.service = { id: s.id, name: s.name, slug: s.slug };
                        }
                    }
                    return p;
                });

                if (mappedAll) {
                    setAllProjects(mappedAll);
                    setFeaturedProjects(mappedAll.filter(p => p.featured).slice(0, 8));
                }

                // Fetch categories
                const cats = await fetchProjectCategories();
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

    const filteredProjects = allProjects.filter(p => {
        if (selectedServiceId) {
            return p.service_id === selectedServiceId;
        }
        if (selectedCategory) {
            // Check project_category_ids array if populated, or match term logic
            // For now, if we match against category, we just check if categories intersect
            // In the legacy system, it was p.service_category_id
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
                        {t('projectPage.title')} <span className="text-brand-pink">{t('projectPage.highlight')}</span>
                    </motion.h1>
                    <motion.p
                        className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {t('projectPage.description')}
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
                                            href={`/${project.slug}`}
                                            className="w-full flex-shrink-0 relative aspect-[900/598] group"
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
                                                    {project.category || t('nav.projects').toUpperCase()}
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
                            {t('projectPage.allProjects')}
                        </h2>

                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => {
                                    setSelectedCategory(null);
                                    setSelectedServiceId(null);
                                    window.history.pushState({}, '', '/projects');
                                }}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${!selectedCategory && !selectedServiceId
                                    ? 'bg-brand-pink text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {t('projectPage.all')}
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
                                    <Link href={`/${project.slug}`}
                                        className="flex flex-col bg-white overflow-hidden group shadow-sm hover:shadow-md transition-all border border-gray-100 h-full"
                                    >
                                        {/* Thumbnail */}
                                        <div className="w-full aspect-[900/598] flex-shrink-0 relative overflow-hidden">
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
                                                {(project as any).service?.name || project.category || t('nav.projects').toUpperCase()}
                                            </span>
                                            <h3 className="text-gray-900 font-bold text-base md:text-lg line-clamp-2 mb-3 group-hover:text-brand-pink transition-colors">
                                                {project.title}
                                            </h3>
                                            <span className="text-gray-500 text-xs font-medium flex items-center gap-1 mt-auto">
                                                {t('projectPage.viewDetails')} <ArrowRight size={14} />
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
                                {t('projectPage.loadMore')}
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {displayedProjects.length === 0 && (
                        <div className="text-center py-16 bg-gray-50 rounded-2xl">
                            <p className="text-gray-500 text-lg">{t('projectPage.noProjects')}</p>
                        </div>
                    )}
                </div>
            </section>

            <FooterSection />
        </div>
    );
};
