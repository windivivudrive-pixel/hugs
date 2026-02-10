import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { supabase, Service, ServiceArticle } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { STATIC_SERVICES } from '../lib/staticData';

export const ServicesSection: React.FC = () => {
    const { t } = useLanguage();
    // Use static services instead of state
    const services = STATIC_SERVICES;

    const [hoveredServiceSlug, setHoveredServiceSlug] = useState<string | null>(null);
    const [latestArticles, setLatestArticles] = useState<Record<string, ServiceArticle | null>>({});
    const [loading, setLoading] = useState(true);
    const [hoveredIndex, setHoveredIndex] = useState<number>(0);

    // Fetch latest article for each service
    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            const articlesMap: Record<string, ServiceArticle | null> = {};

            // We still need to fetch articles, but we can do it based on the static IDs/Slugs
            // Or better, just fetch all latest articles map once.
            // For now, keep the logic similar to before but iterate static services.

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
            setLoading(false);
        };

        fetchArticles();
    }, []);

    // Default to first service (no auto-cycling)
    const displayedServiceSlug = hoveredServiceSlug !== null ? hoveredServiceSlug : services[0]?.slug;
    const activeService = services.find(s => s.slug === displayedServiceSlug);

    // Get current article for displayed service
    const currentArticle = activeService ? latestArticles[activeService.slug] : null;

    return (
        <section className="py-24 bg-white overflow-x-clip">

            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <span className="inline-block bg-brand-pink/10 text-brand-pink px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        {t('services.badge')}
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-black text-gray-900">
                        {t('services.title')} <span className="text-brand-pink">{t('services.titleHighlight')}</span>
                    </h2>
                </motion.div>

                {loading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Loader2 className="animate-spin text-brand-pink" size={40} />
                    </div>
                ) : (
                    <>
                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start min-h-[500px]">
                            {/* Left - Service List from Static Data */}
                            <div className="space-y-4 lg:col-span-5">
                                {services.map((service, index) => {
                                    const isSelected = displayedServiceSlug === service.slug;
                                    const serviceArticle = latestArticles[service.slug];
                                    const thumbIndex = (index % 9) + 1; // Cycle 1-9

                                    return (
                                        <div key={service.id} className="group">
                                            <motion.div
                                                className="cursor-pointer"
                                                onMouseEnter={() => {
                                                    setHoveredServiceSlug(service.slug);
                                                    setHoveredIndex(index);
                                                }}
                                                onClick={(e) => {
                                                    setHoveredServiceSlug(service.slug);
                                                    setHoveredIndex(index);
                                                }}
                                            >
                                                <motion.h3
                                                    className={`text-lg md:text-xl lg:text-3xl font-bold transition-colors duration-300 py-1 md:py-2 ${isSelected
                                                        ? 'text-brand-pink'
                                                        : 'text-gray-300'
                                                        }`}
                                                    whileHover={{ x: 10 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    {/* Translate the service name using the slug */}
                                                    {t(`services.items.${service.slug}`)}
                                                </motion.h3>
                                            </motion.div>

                                            {/* Mobile: Inline Preview (Accordion) */}
                                            <AnimatePresence>
                                                {isSelected && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="lg:hidden overflow-hidden"
                                                    >
                                                        <Link
                                                            to={`/projects?service=${service.slug}`}
                                                            className="block relative aspect-video w-full bg-gray-900 overflow-hidden shadow-lg mt-2 mb-6"
                                                        >
                                                            {/* Browser bar */}
                                                            <div className="absolute top-0 left-0 right-0 h-6 bg-gray-800 flex items-center px-3 gap-1.5 z-10">
                                                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                            </div>

                                                            {/* Image */}
                                                            <div className="pt-6 h-full relative">
                                                                <img
                                                                    src={`/thumb-service/${thumbIndex}.png`}
                                                                    alt={serviceArticle?.title || service.name}
                                                                    className="w-full h-full object-cover"
                                                                    loading="lazy"
                                                                    onError={(e) => {
                                                                        (e.target as HTMLImageElement).src = `https://picsum.photos/800/600?random=${service.id}`;
                                                                    }}
                                                                />

                                                            </div>
                                                        </Link>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Right - Article Preview with Browser Frame */}
                            <div className="relative hidden lg:block lg:col-span-7">
                                <AnimatePresence mode="wait">
                                    {activeService && (
                                        <div
                                            className="flex items-start justify-start"
                                            style={{
                                                marginTop: `${hoveredIndex * 40}px`,
                                                transition: 'margin-top 0.15s ease-out'
                                            }}
                                        >
                                            {/* Clickable container - scaled to 2/3 */}
                                            <Link
                                                to={`/projects?service=${activeService.slug}`}
                                                className="relative w-2/3 aspect-[4/3] bg-gray-900 overflow-hidden shadow-2xl block group"
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
                                                        src={`/thumb-service/${hoveredIndex + 1}.png`}
                                                        alt={currentArticle?.title || activeService.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = `https://picsum.photos/800/600?random=${activeService.id}`;
                                                        }}
                                                    />

                                                </div>
                                            </Link>
                                        </div>
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
                            <Link to="/service">
                                <motion.div
                                    className="group inline-flex items-center gap-3 bg-brand-pink text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-gray-900 transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {t('services.viewAll')}
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </motion.div>
                            </Link>
                        </motion.div>
                    </>
                )}
            </div>
        </section >
    );
};
