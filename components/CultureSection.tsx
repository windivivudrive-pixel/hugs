import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin, Users, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

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

export const CultureSection: React.FC = () => {
    const { t } = useLanguage();
    const [[page, direction], setPage] = useState([0, 0]);

    const cultureImages = [
        '/logo-partner/team.png',
        'https://picsum.photos/800/600?random=1',
        'https://picsum.photos/800/600?random=2',
        'https://picsum.photos/800/600?random=3',
        'https://picsum.photos/800/600?random=4',
    ];

    const imageIndex = Math.abs(page % cultureImages.length);

    const variants = {
        enter: (direction: number) => {
            return {
                x: direction > 0 ? 1000 : -1000,
                opacity: 0
            };
        },
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => {
            return {
                zIndex: 0,
                x: direction < 0 ? 1000 : -1000,
                opacity: 0
            };
        }
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const paginate = (newDirection: number) => {
        setPage([page + newDirection, newDirection]);
    };

    const prevImage = () => {
        paginate(-1);
    };

    const nextImage = () => {
        paginate(1);
    };
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
                            <div className="flex items-center gap-2 mb-6">
                                <motion.div
                                    className="w-8 h-[2px] bg-brand-pink"
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    transition={{ duration: 0.7, delay: 0.3 }}
                                    viewport={{ once: true }}
                                    style={{ originX: 0 }}
                                />
                                <span className="text-brand-pink font-semibold text-base uppercase tracking-wider">{t('cultureSection.aboutLabel')}</span>
                            </div>

                            {/* Title */}
                            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-8 leading-tight">
                                {t('cultureSection.aboutTitle')}
                            </h2>

                            {/* Description */}
                            <div className="space-y-6 text-gray-900 leading-relaxed">
                                <p className="text-xl">
                                    {t('cultureSection.aboutDesc')}
                                </p>
                            </div>
                        </motion.div>

                        {/* Block 2: Tư Duy */}
                        <motion.div className="mb-10" variants={fadeUpChild}>
                            {/* Section label */}
                            <div className="flex items-center gap-2 mb-6">
                                <motion.div
                                    className="w-8 h-[2px] bg-brand-pink"
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    transition={{ duration: 0.7, delay: 0.4 }}
                                    viewport={{ once: true }}
                                    style={{ originX: 0 }}
                                />
                                <span className="text-brand-pink font-semibold text-base uppercase tracking-wider">{t('cultureSection.mindsetLabel')}</span>
                            </div>

                            {/* Description */}
                            <div className="space-y-6 text-gray-900 leading-relaxed">
                                <p className="text-xl">
                                    {t('cultureSection.mindsetDesc')}
                                </p>
                            </div>
                        </motion.div>

                        {/* Core values - icons with pop-in */}
                        <motion.div className="flex flex-wrap gap-4 mb-10" variants={fadeUpChild}>
                            <motion.div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full" variants={popIn}>
                                <Lightbulb size={18} className="text-brand-pink" />
                                <span className="text-sm font-medium text-gray-700">{t('cultureSection.values.innovative')}</span>
                            </motion.div>
                            <motion.div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full" variants={popIn}>
                                <MapPin size={18} className="text-brand-pink" />
                                <span className="text-sm font-medium text-gray-700">{t('cultureSection.values.local')}</span>
                            </motion.div>
                            <motion.div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full" variants={popIn}>
                                <Users size={18} className="text-brand-pink" />
                                <span className="text-sm font-medium text-gray-700">{t('cultureSection.values.personnel')}</span>
                            </motion.div>
                        </motion.div>

                        {/* CTA */}
                        <motion.button
                            className="group flex items-center gap-3 bg-brand-pink text-white px-8 py-4 rounded-full text-sm font-bold shadow-lg shadow-brand-pink/25 hover:shadow-xl hover:shadow-brand-pink/30 transition-all"
                            variants={fadeUpChild}
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {t('cultureSection.ctaButton')}
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </motion.div>

                    {/* Right - Visual with floating badges */}
                    <motion.div
                        className="order-1 lg:order-2 relative lg:-mr-20 lg:scale-125 origin-left"
                        initial={{ opacity: 0, x: 60, scale: 0.95 }}
                        whileInView={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        {/* Main image */}
                        <div className="relative">
                            <img
                                src="/culture2.png"
                                alt="HUGs Agency Culture"
                                loading="lazy"
                                className="w-full h-auto object-cover"
                            />

                            {/* Stats badge - top right (refined size) */}
                            <motion.div
                                className="absolute -top-3 -right-2 bg-brand-pink text-white shadow-lg px-4 py-2 z-20"
                                initial={{ opacity: 0, scale: 0.6, y: -15 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ type: "spring" as const, stiffness: 180, damping: 22, delay: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <div className="text-xl font-black">2021</div>
                                <div className="text-[10px] opacity-90 uppercase tracking-wider">{t('cultureSection.stats.established')}</div>
                            </motion.div>

                            {/* Location badge - bottom left (refined size) */}
                            <motion.div
                                className="absolute -bottom-3 -left-3 bg-white shadow-xl p-4 z-20 border border-gray-100"
                                initial={{ opacity: 0, scale: 0.6, y: 15 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ type: "spring" as const, stiffness: 180, damping: 22, delay: 0.7 }}
                                viewport={{ once: true }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-brand-pink/10 flex items-center justify-center rounded-lg">
                                        <MapPin className="text-brand-pink" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-base font-black text-gray-900 leading-tight">{t('cultureSection.stats.location')}</div>
                                        <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mt-1">{t('cultureSection.stats.region')}</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Second Block - Image Left, Text Right (2 sections) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

                    {/* Left - Image Carousel */}
                    <motion.div
                        className="relative lg:-ml-20 lg:scale-110 origin-right"
                        initial={{ opacity: 0, x: -60, scale: 0.95 }}
                        whileInView={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        <div className="relative overflow-hidden">
                            <div className="relative w-full aspect-[4/3]">
                                <AnimatePresence initial={false} custom={direction}>
                                    <motion.img
                                        key={page}
                                        src={cultureImages[imageIndex]}
                                        custom={direction}
                                        variants={variants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{
                                            x: { type: "spring", stiffness: 300, damping: 30 },
                                            opacity: { duration: 0.2 }
                                        }}
                                        drag="x"
                                        dragConstraints={{ left: 0, right: 0 }}
                                        dragElastic={1}
                                        onDragEnd={(e, { offset, velocity }) => {
                                            const swipe = swipePower(offset.x, velocity.x);

                                            if (swipe < -swipeConfidenceThreshold) {
                                                paginate(1);
                                            } else if (swipe > swipeConfidenceThreshold) {
                                                paginate(-1);
                                            }
                                        }}
                                        alt={`HUGs Team ${imageIndex + 1}`}
                                        className="absolute inset-0 w-full h-full object-cover cursor-grab active:cursor-grabbing"
                                    />
                                </AnimatePresence>
                            </div>

                            {/* Navigation buttons */}
                            <button
                                onClick={() => paginate(-1)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110 z-10 border border-brand-pink/30"
                            >
                                <ChevronLeft size={20} className="text-brand-pink" />
                            </button>
                            <button
                                onClick={() => paginate(1)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110 z-10 border border-brand-pink/30"
                            >
                                <ChevronRight size={20} className="text-brand-pink" />
                            </button>

                            {/* Dot indicators */}
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                {cultureImages.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setPage([idx, idx > imageIndex ? 1 : -1])}
                                        className={`w-2 h-2 rounded-full transition-all ${idx === imageIndex
                                            ? 'bg-brand-pink w-6'
                                            : 'bg-white/70 hover:bg-white'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>

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
                            <div className="flex items-center gap-2 mb-6">
                                <motion.div
                                    className="w-8 h-[2px] bg-brand-pink"
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    transition={{ duration: 0.7, delay: 0.3 }}
                                    viewport={{ once: true }}
                                    style={{ originX: 0 }}
                                />
                                <span className="text-brand-pink font-semibold text-base uppercase tracking-wider">{t('cultureSection.implementationLabel')}</span>
                            </div>

                            {/* Description */}
                            <div className="space-y-4 text-gray-900 leading-relaxed">
                                <p className="text-xl">
                                    {t('cultureSection.implementationDesc')}
                                </p>
                            </div>
                        </motion.div>

                        {/* Block 2: Giá trị */}
                        <motion.div variants={fadeUpChild}>
                            {/* Section label */}
                            <div className="flex items-center gap-2 mb-6">
                                <motion.div
                                    className="w-8 h-[2px] bg-brand-pink"
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    transition={{ duration: 0.7, delay: 0.4 }}
                                    viewport={{ once: true }}
                                    style={{ originX: 0 }}
                                />
                                <span className="text-brand-pink font-semibold text-base uppercase tracking-wider">{t('cultureSection.valueLabel')}</span>
                            </div>

                            {/* Description */}
                            <div className="space-y-4 text-gray-900 leading-relaxed">
                                <p className="text-xl">
                                    {t('cultureSection.valueDesc')}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};