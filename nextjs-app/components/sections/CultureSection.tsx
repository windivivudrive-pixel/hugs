'use client';
import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Stagger container variant
const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.25,
            delayChildren: 0.15,
        }
    }
};

// Child fade-up variant
const fadeUpChild = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }
    }
};

// Value tag pop-in variant
const popIn = {
    hidden: { opacity: 0, scale: 0.8, y: 15 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "spring" as const, stiffness: 200, damping: 25 }
    }
};

// Extracted Carousel Component to prevent parent re-renders and video flickering
const CultureCarousel = () => {
    const { t } = useLanguage();
    const [[page, direction], setPage] = useState([0, 0]);

    const cultureImages = [
        '/team-all.png',
        '/team-man1 1.png',
        '/team-girl 1.png',
        '/team-editor 1.png',
        '/team-girl3 1.png',
        '/team-development.png',
    ];

    const imageIndex = Math.abs(page % cultureImages.length);

    // Native touch swipe handling (no framer-motion drag = no elastic snap-back jolt)
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);
    const isSwiping = useRef(false);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
        isSwiping.current = false;
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (touchStartX.current === null || touchStartY.current === null) return;
        const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
        const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
        // Lock to horizontal swipe if horizontal movement dominates
        if (dx > dy && dx > 10) {
            isSwiping.current = true;
        }
    }, []);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        if (touchStartX.current === null || !isSwiping.current) {
            touchStartX.current = null;
            touchStartY.current = null;
            return;
        }
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        if (deltaX < -40) {
            setPage(prev => [prev[0] + 1, 1]);
        } else if (deltaX > 40) {
            setPage(prev => [prev[0] - 1, -1]);
        }
        touchStartX.current = null;
        touchStartY.current = null;
        isSwiping.current = false;
    }, []);

    const paginate = (newDirection: number) => {
        setPage([page + newDirection, newDirection]);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left - Image Carousel */}
            <div
                className="relative culture-carousel-enter"
                style={{ contain: 'layout style' }}
            >
                <div
                    className="relative overflow-hidden touch-pan-y"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{ contain: 'layout style paint' }}
                >
                    {/* Fixed-size container — absolutely no height changes on image switch */}
                    <div className="relative w-full aspect-[4/3] md:aspect-video lg:aspect-[4/3] bg-white rounded-2xl overflow-hidden shadow-sm">
                        {cultureImages.map((src, idx) => (
                            <img
                                key={src}
                                src={src}
                                alt={`HUGs Team ${idx + 1}`}
                                loading="eager"
                                decoding="async"
                                className={`absolute inset-0 w-full h-full transition-opacity duration-300 ease-in-out object-contain ${
                                    src === '/team-development.png' ? 'p-4 md:p-8' : ''
                                }`}
                                style={{
                                    opacity: idx === imageIndex ? 1 : 0,
                                    pointerEvents: idx === imageIndex ? 'auto' : 'none',
                                    willChange: 'opacity',
                                    backfaceVisibility: 'hidden',
                                    transform: 'translate3d(0,0,0)',
                                }}
                                draggable={false}
                            />
                        ))}
                    </div>

                    {/* Navigation buttons */}
                    <button
                        type="button"
                        onClick={() => paginate(-1)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors z-20 border-2 border-brand-pink touch-manipulation"
                    >
                        <ChevronLeft size={20} className="text-brand-pink" />
                    </button>
                    <button
                        type="button"
                        onClick={() => paginate(1)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors z-20 border-2 border-brand-pink touch-manipulation"
                    >
                        <ChevronRight size={20} className="text-brand-pink" />
                    </button>

                    {/* Dot indicators */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {cultureImages.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setPage([idx, idx > imageIndex ? 1 : -1])}
                                className={`w-2 h-2 rounded-full transition-all touch-manipulation ${idx === imageIndex
                                    ? 'bg-brand-pink w-6'
                                    : 'bg-white/70 hover:bg-white'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* CSS entrance animation — runs once, never re-triggers on state change */}
                <style>{`
                    .culture-carousel-enter {
                        animation: culture-slide-in 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
                    }
                    @keyframes culture-slide-in {
                        from {
                            opacity: 0;
                            transform: translate3d(-60px, 0, 0) scale(0.95);
                        }
                        to {
                            opacity: 1;
                            transform: translate3d(0, 0, 0) scale(1);
                        }
                    }
                `}</style>
            </div>

            {/* Right - Content (2 text blocks) with stagger */}
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
            >
                {/* Block 1: Triển khai */}
                <motion.div className="mb-12" variants={fadeUpChild}>
                    {/* Section label */}
                    <motion.div
                        className="bg-brand-pink text-white px-4 py-2 text-sm font-black uppercase tracking-widest inline-block mb-6 shadow-md shadow-brand-pink/20"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        {t('cultureSection.implementationLabel')}
                    </motion.div>

                    {/* Description */}
                    <div className="space-y-4 text-gray-900 leading-relaxed">
                        <p className="text-lg">
                            {t('cultureSection.implementationDesc')}
                        </p>
                    </div>
                </motion.div>

                {/* Block 2: Giá trị */}
                <motion.div variants={fadeUpChild}>
                    {/* Section label */}
                    <motion.div
                        className="bg-brand-pink text-white px-4 py-2 text-sm font-black uppercase tracking-widest inline-block mb-6 shadow-md shadow-brand-pink/20"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        {t('cultureSection.valueLabel')}
                    </motion.div>

                    {/* Description */}
                    <div className="space-y-4 text-gray-900 leading-relaxed">
                        <p className="text-lg">
                            {t('cultureSection.valueDesc')}
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export const CultureSection: React.FC = () => {
    const { t } = useLanguage();

    return (
        <section className="pt-8 lg:pt-12 pb-0 bg-white relative overflow-hidden">
            {/* Subtle background decorations */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gray-50/50 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* First Block - Text Left (2 sections), Image Right */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center mb-20">

                    {/* Left - Content (2 text blocks) with staggered children */}
                    <motion.div
                        className="order-2 lg:order-1"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        {/* Block 1: Về chúng tôi */}
                        <motion.div className="mb-12" variants={fadeUpChild}>
                            {/* Section label */}
                            <motion.div
                                className="bg-brand-pink text-white px-4 py-2 text-sm font-black uppercase tracking-widest inline-block mb-6 shadow-md shadow-brand-pink/20"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                {t('cultureSection.aboutLabel')}
                            </motion.div>

                            {/* Title */}
                            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-8 leading-tight">
                                {t('cultureSection.aboutTitle')}
                            </h2>

                            {/* Description */}
                            <div className="space-y-6 text-gray-900 leading-relaxed">
                                <p className="text-lg">
                                    {t('cultureSection.aboutDesc')}
                                </p>
                            </div>
                        </motion.div>

                        {/* Block 2: Tư Duy */}
                        <motion.div className="mb-10" variants={fadeUpChild}>
                            {/* Section label */}
                            <motion.div
                                className="bg-brand-pink text-white px-4 py-2 text-sm font-black uppercase tracking-widest inline-block mb-6 shadow-md shadow-brand-pink/20"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                viewport={{ once: true }}
                            >
                                {t('cultureSection.mindsetLabel')}
                            </motion.div>

                            {/* Description */}
                            <div className="space-y-6 text-gray-900 leading-relaxed">
                                <p className="text-lg">
                                    {t('cultureSection.mindsetDesc')}
                                </p>
                            </div>
                        </motion.div>

                        <motion.div className="flex flex-wrap gap-4 mb-10" variants={fadeUpChild}>
                            <motion.div className="flex items-center gap-2 bg-white border border-brand-pink/30 px-4 py-2 rounded-full shadow-sm" variants={popIn}>
                                <Lightbulb size={18} className="text-brand-pink" />
                                <span className="text-sm font-medium text-gray-700">{t('cultureSection.values.innovative')}</span>
                            </motion.div>
                            <motion.div className="flex items-center gap-2 bg-white border border-brand-pink/30 px-4 py-2 rounded-full shadow-sm" variants={popIn}>
                                <MapPin size={18} className="text-brand-pink" />
                                <span className="text-sm font-medium text-gray-700">{t('cultureSection.values.local')}</span>
                            </motion.div>
                            <motion.div className="flex items-center gap-2 bg-white border border-brand-pink/30 px-4 py-2 rounded-full shadow-sm" variants={popIn}>
                                <Users size={18} className="text-brand-pink" />
                                <span className="text-sm font-medium text-gray-700">{t('cultureSection.values.personnel')}</span>
                            </motion.div>
                        </motion.div>

                    </motion.div>

                    {/* Right - Visual with floating badges */}
                    <motion.div
                        className="order-1 lg:order-2 relative lg:translate-x-10"
                        initial={{ opacity: 0, x: 60, scale: 0.95 }}
                        whileInView={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        {/* Main image */}
                        <div className="relative">
                            <div className="relative rounded-xl overflow-hidden">
                                <video
                                    src="/MockupLoading.mp4"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    preload="auto"
                                    className="w-full h-auto object-cover scale-[1.15]"
                                />
                            </div>

                            {/* Stats badge - top right (refined size) */}
                            <motion.div
                                className="absolute -top-3 right-[48px] bg-brand-pink text-white shadow-lg px-3 py-1 md:px-4 md:py-2 z-20"
                                initial={{ opacity: 0, scale: 0.6, y: -15 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ type: "spring" as const, stiffness: 180, damping: 22, delay: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <div className="text-lg md:text-xl font-black">2021</div>
                                <div className="text-[8px] md:text-[10px] opacity-90 uppercase tracking-wider">{t('cultureSection.stats.established')}</div>
                            </motion.div>

                            {/* Location badge - bottom left (refined size) */}
                            <motion.div
                                className="absolute -bottom-3 -left-3 bg-white shadow-xl p-2 md:p-4 z-20 border border-gray-100"
                                initial={{ opacity: 0, scale: 0.6, y: 15 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ type: "spring" as const, stiffness: 180, damping: 22, delay: 0.7 }}
                                viewport={{ once: true }}
                            >
                                <div className="flex items-center gap-2 md:gap-3">
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-pink/10 flex items-center justify-center rounded-lg">
                                        <MapPin className="text-brand-pink" size={16} />
                                    </div>
                                    <div>
                                        <div className="text-sm md:text-base font-black text-gray-900 leading-tight">{t('cultureSection.stats.location')}</div>
                                        <div className="text-[8px] md:text-[10px] font-medium text-gray-500 uppercase tracking-wide mt-0.5 md:mt-1">{t('cultureSection.stats.region')}</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Second Block - Image Left, Text Right (2 sections) */}
                <CultureCarousel />
            </div>
        </section>
    );
};