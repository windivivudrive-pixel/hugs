import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Users, Target, Heart, Zap, ChevronLeft, ChevronRight, MapPin, Lightbulb, ShieldCheck, Layers } from 'lucide-react';
import { FooterSection } from './FooterSection';
import { PageNavbar } from './PageNavbar';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface SectionProps {
    title: string;
    content: React.ReactNode;
    image: string;
    reverse?: boolean;
    icon?: React.ReactNode;
}

const StorySection: React.FC<SectionProps> = ({ title, content, image, reverse, icon }) => (
    <motion.div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16 lg:py-24 ${reverse ? 'lg:flex-row-reverse' : ''}`}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-100px" }}
    >
        <div className={`space-y-6 ${reverse ? 'lg:order-2' : ''}`}>
            {icon && (
                <div className="w-14 h-14 bg-brand-pink/10 flex items-center justify-center text-brand-pink">
                    {icon}
                </div>
            )}
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900">{title}</h2>
            <div className="text-gray-600 leading-relaxed space-y-4 text-lg">
                {content}
            </div>
        </div>
        <div className={`${reverse ? 'lg:order-1' : ''}`}>
            <motion.div
                className="relative overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
            >
                <img
                    src={image}
                    alt={title}
                    loading="lazy"
                    className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
        </div>
    </motion.div>
);

export const AboutPage: React.FC = () => {
    const { t } = useLanguage();
    const [[page, direction], setPage] = useState([0, 0]);

    const visionImages = [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80',
        'https://picsum.photos/1600/900?random=10',
        'https://picsum.photos/1600/900?random=11',
        'https://picsum.photos/1600/900?random=12',
        'https://picsum.photos/1600/900?random=13',
    ];

    const imageIndex = Math.abs(page % visionImages.length);

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

    const departments = [
        t('departments.d1'),
        t('departments.d2'),
        t('departments.d3'),
        t('departments.d4'),
        t('departments.d5'),
        t('departments.d6')
    ];

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Navbar */}
            <PageNavbar activePage="about" />

            {/* Hero Section */}
            <section className="pt-32 pb-16 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-2 bg-brand-pink/10 text-brand-pink rounded-full text-sm font-semibold mb-6">
                            {t('about.badge')}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black mb-6">
                            <span className="block mb-4">{t('about.title')}</span>
                            <span className="text-brand-pink">{t('about.titleHighlight')}</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {t('about.description')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Story Sections */}
            <div className="max-w-7xl mx-auto px-6">
                {/* About HUGs */}
                <StorySection
                    title={t('about.whoTitle')}
                    icon={<Zap size={28} />}
                    image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                    content={
                        <>
                            <p>
                                {t('about.whoContent')}
                            </p>
                        </>
                    }
                />

                {/* How we work */}
                <StorySection
                    title={t('about.howTitle')}
                    icon={<Target size={28} />}
                    image="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
                    reverse
                    content={
                        <>
                            <p>
                                {t('about.howContent1')}
                            </p>
                            <p>
                                {t('about.howContent2')}
                            </p>
                            <p className="text-brand-pink font-semibold">
                                {t('about.howContentHighlight')}
                            </p>
                        </>
                    }
                />
            </div>

            {/* Vision - Full Width Centered Quote Style */}
            <section className="py-24 bg-gray-50">
                <motion.div
                    className="max-w-5xl mx-auto px-6 text-center"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div className="w-16 h-16 bg-brand-pink/10 flex items-center justify-center text-brand-pink mx-auto mb-8">
                        <ArrowRight size={32} />
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-8">{t('about.visionTitle')}</h2>
                    <p className="text-2xl lg:text-3xl text-gray-700 leading-relaxed font-light mb-12">
                        {t('about.visionContent')} <span className="text-brand-pink font-semibold">{t('about.visionHighlight1')}</span> {t('about.visionHighlight1') === 'chiều sâu' ? 'và' : 'and'} <span className="text-brand-pink font-semibold">{t('about.visionHighlight2')}</span>{t('about.visionContentEnd')}
                    </p>
                </motion.div>
                <motion.div
                    className="max-w-7xl mx-auto px-6"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <div className="relative overflow-hidden shadow-2xl rounded-2xl group">
                        <div className="relative w-full aspect-[21/9]">
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.img
                                    key={page}
                                    src={visionImages[imageIndex]}
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
                                    alt={`HUGs Vision ${imageIndex + 1}`}
                                    className="absolute inset-0 w-full h-full object-cover cursor-grab active:cursor-grabbing"
                                />
                            </AnimatePresence>
                        </div>

                        {/* Navigation buttons */}
                        <button
                            onClick={() => paginate(-1)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10 opacity-0 group-hover:opacity-100"
                        >
                            <ChevronLeft size={24} className="text-gray-800" />
                        </button>
                        <button
                            onClick={() => paginate(1)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10 opacity-0 group-hover:opacity-100"
                        >
                            <ChevronRight size={24} className="text-gray-800" />
                        </button>

                        {/* Dot indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                            {visionImages.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setPage([idx, idx > imageIndex ? 1 : -1])}
                                    className={`h-2 rounded-full transition-all ${idx === imageIndex
                                        ? 'bg-brand-pink w-8'
                                        : 'bg-white/70 hover:bg-white w-2'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Team - Stats + Grid Layout */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <div className="w-14 h-14 bg-brand-pink/10 rounded-2xl flex items-center justify-center text-brand-pink mx-auto mb-6">
                            <Users size={28} />
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">{t('about.peopleTitle')}</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            {t('about.peopleDesc')}
                        </p>
                    </motion.div>

                    {/* Stats Row */}
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        {[
                            { number: '30+', label: t('about.stats.personnel') },
                            { number: '6', label: t('about.stats.departments') },
                            { number: '50+', label: t('about.stats.projects') },
                            { number: '4', label: t('about.stats.experience') }
                        ].map((stat, i) => (
                            <div key={i} className="bg-gray-50 p-6 text-center">
                                <div className="text-4xl lg:text-5xl font-black text-brand-pink mb-2">{stat.number}</div>
                                <div className="text-gray-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Departments Grid */}
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-3 gap-4"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        {departments.map((dept, i) => (
                            <div
                                key={i}
                                className="bg-white border border-gray-200 p-5 hover:border-brand-pink hover:shadow-lg transition-all group"
                            >
                                <div className="w-10 h-10 bg-brand-pink/10 flex items-center justify-center text-brand-pink mb-3 group-hover:bg-brand-pink group-hover:text-white transition-colors">
                                    <span className="font-bold">{String(i + 1).padStart(2, '0')}</span>
                                </div>
                                <p className="font-semibold text-gray-900">{dept}</p>
                            </div>
                        ))}
                    </motion.div>

                    <motion.p
                        className="text-center text-gray-500 mt-10 max-w-3xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        {t('about.structureDesc')}
                    </motion.p>
                </div>
            </section>

            {/* Culture - 3 Value Cards */}
            <section className="py-24 bg-gradient-to-b from-brand-pink to-pink-600">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <div className="w-14 h-14 bg-white/20 flex items-center justify-center text-white mx-auto mb-6">
                            <Heart size={28} />
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">{t('about.cultureTitle')}</h2>
                        <p className="text-white/80 text-lg max-w-2xl mx-auto">
                            {t('about.cultureDesc')}
                        </p>
                    </motion.div>

                    {/* Value Cards */}
                    <motion.div
                        className="grid md:grid-cols-3 gap-6"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        {[
                            { title: t('about.values.v1.title'), desc: t('about.values.v1.desc') },
                            { title: t('about.values.v2.title'), desc: t('about.values.v2.desc') },
                            { title: t('about.values.v3.title'), desc: t('about.values.v3.desc') }
                        ].map((value, i) => (
                            <div
                                key={i}
                                className="bg-white p-8 hover:shadow-xl transition-all hover:-translate-y-1"
                            >
                                <div className="text-5xl font-black text-brand-pink mb-4">{String(i + 1).padStart(2, '0')}</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                                <p className="text-gray-600">{value.desc}</p>
                            </div>
                        ))}
                    </motion.div>

                    <motion.div
                        className="mt-16 max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        <blockquote className="text-center">
                            <p className="text-2xl text-white italic font-light leading-relaxed">
                                {t('about.quote')}
                            </p>
                            <div className="w-12 h-1 bg-white mx-auto mt-8" />
                        </blockquote>
                    </motion.div>
                </div>
            </section>

            {/* Why Choose HUGs */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl lg:text-4xl font-black text-brand-pink mb-4">{t('about.whyTitle')}</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            {t('about.whyDesc')}
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {[
                            {
                                icon: <MapPin size={32} />,
                                title: t('about.reasons.r1.title'),
                                desc: t('about.reasons.r1.desc')
                            },
                            {
                                icon: <Lightbulb size={32} />,
                                title: t('about.reasons.r2.title'),
                                desc: t('about.reasons.r2.desc')
                            },
                            {
                                icon: <ShieldCheck size={32} />,
                                title: t('about.reasons.r3.title'),
                                desc: t('about.reasons.r3.desc')
                            },
                            {
                                icon: <Layers size={32} />,
                                title: t('about.reasons.r4.title'),
                                desc: t('about.reasons.r4.desc')
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 group hover:-translate-y-1"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className="w-14 h-14 bg-brand-pink/10 rounded-xl flex items-center justify-center text-brand-pink group-hover:bg-brand-pink group-hover:text-white transition-colors mb-6">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-brand-pink mb-3">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gray-900">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                            {t('about.ctaTitle')}
                        </h2>
                        <p className="text-gray-400 mb-8 text-lg">
                            {t('about.ctaDesc')}
                        </p>
                        <Link
                            to="/#contact"
                            className="inline-flex items-center gap-2 bg-brand-pink text-white px-8 py-4 rounded-full font-bold hover:bg-pink-600 transition-colors"
                        >
                            {t('about.ctaButton')}
                            <ArrowRight size={20} />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <FooterSection />
        </div>
    );
};
