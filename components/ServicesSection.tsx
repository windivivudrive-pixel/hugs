import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { supabase, Service, ServiceArticle } from '../lib/supabase';

export const ServicesSection: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [hoveredServiceSlug, setHoveredServiceSlug] = useState<string | null>(null);
    const [latestArticles, setLatestArticles] = useState<Record<string, ServiceArticle | null>>({});
    const [loading, setLoading] = useState(true);

    // Fetch services from database
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('services')
                    .select('*')
                    .order('display_order')
                    .limit(6); // Only show first 6 services on homepage

                if (error) throw error;
                setServices(data || []);
            } catch (err) {
                console.error('Error fetching services:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    // Fetch latest article for each service when services are loaded
    useEffect(() => {
        if (services.length === 0) return;

        const fetchArticles = async () => {
            const articlesMap: Record<string, ServiceArticle | null> = {};

            for (const service of services) {
                try {
                    const { data, error } = await supabase
                        .from('service_articles')
                        .select('*')
                        .eq('service_id', service.id)
                        .eq('published', true)
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .maybeSingle();

                    if (!error && data) {
                        articlesMap[service.slug] = data;
                    }
                } catch (err) {
                    console.error(`Error fetching article for ${service.slug}:`, err);
                }
            }

            setLatestArticles(articlesMap);
        };

        fetchArticles();
    }, [services]);

    // Default to first service (no auto-cycling)
    const displayedServiceSlug = hoveredServiceSlug !== null ? hoveredServiceSlug : services[0]?.slug;
    const activeService = services.find(s => s.slug === displayedServiceSlug);

    // Get current article for displayed service
    const currentArticle = activeService ? latestArticles[activeService.slug] : null;

    return (
        <section className="pt-20 pb-8 bg-gray-50 overflow-x-clip">

            {/* Services Section - Haptic Style */}
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Label */}
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-2 h-2 rounded-full bg-brand-pink"></div>
                    <span className="text-xl font-semibold text-gray-900">Dịch Vụ</span>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Loader2 className="animate-spin text-brand-pink" size={40} />
                    </div>
                ) : (
                    <>
                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start min-h-[500px]">
                            {/* Left - Service List from Database */}
                            <div className="space-y-4 lg:col-span-5">
                                {services.map((service) => (
                                    <motion.div
                                        key={service.id}
                                        className="group cursor-pointer"
                                        onMouseEnter={() => setHoveredServiceSlug(service.slug)}
                                        onMouseLeave={() => setHoveredServiceSlug(null)}
                                    >
                                        <motion.h3
                                            className={`text-3xl md:text-4xl lg:text-5xl font-bold transition-colors duration-300 py-2 ${displayedServiceSlug === service.slug
                                                ? 'text-brand-pink'
                                                : 'text-gray-300'
                                                }`}
                                            whileHover={{ x: 10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {service.name}
                                        </motion.h3>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Right - Article Preview with Browser Frame */}
                            <div className="relative h-[450px] lg:h-[550px] hidden lg:block lg:col-span-7">
                                <AnimatePresence mode="wait">
                                    {activeService && (
                                        <motion.div
                                            key={activeService.slug}
                                            className="absolute inset-0 flex items-center justify-end"
                                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                            transition={{ duration: 0.3, ease: 'easeOut' }}
                                        >
                                            {/* Clickable container */}
                                            <a
                                                href={currentArticle ? `/article?id=${currentArticle.id}` : `/service?s=${activeService.slug}`}
                                                className="relative w-full h-full bg-gray-900 rounded-2xl overflow-hidden shadow-2xl block group"
                                            >
                                                {/* Browser-like frame */}
                                                <div className="absolute top-0 left-0 right-0 h-8 bg-gray-800 flex items-center px-3 gap-1.5 z-10">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                                </div>

                                                {/* Article image */}
                                                <div className="pt-8 h-full relative">
                                                    <img
                                                        src={currentArticle?.thumbnail || `https://picsum.photos/800/600?random=${activeService.id}`}
                                                        alt={currentArticle?.title || activeService.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = `https://picsum.photos/800/600?random=${activeService.id}`;
                                                        }}
                                                    />

                                                    {/* Pink gradient overlay from bottom */}
                                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-pink/70 via-brand-pink/30 to-transparent p-6">
                                                        <h4 className="text-white text-lg lg:text-xl font-bold line-clamp-2 drop-shadow-lg">
                                                            {currentArticle?.title || activeService.name}
                                                        </h4>
                                                        <p className="text-white/90 text-sm mt-2 line-clamp-2 drop-shadow">
                                                            {currentArticle?.content?.slice(0, 100) || activeService.short_description || 'Click để xem thêm thông tin về dịch vụ này'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </a>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* CTA */}
                        <motion.div
                            className="mt-16"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            <motion.a
                                href="/service"
                                className="group inline-flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-brand-pink transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Xem tất cả dịch vụ
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </motion.a>
                        </motion.div>
                    </>
                )}
            </div>
        </section>
    );
};
