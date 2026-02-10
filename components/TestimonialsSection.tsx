import React from 'react';
import { motion } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const TestimonialsSection: React.FC = () => {
    const { t } = useLanguage();

    const testimonialLogos = [
        "/logo-partner/partner0.png", // Ahamove
        "/logo-partner/partner1.png", // Nessa House
        "/logo-partner/partner3.png", // Mai Wedding
        "/logo-partner/partner4.png", // Vinpearl
        "/logo-partner/partner2.png"  // Sun Group
    ];

    const testimonials = testimonialLogos.map((logo, i) => ({
        name: t(`testimonials.items.${i}.name`),
        role: t(`testimonials.items.${i}.role`),
        text: t(`testimonials.items.${i}.text`),
        logo: logo
    }));

    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [width, setWidth] = React.useState(0);
    const sliderRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (sliderRef.current) {
            setWidth(sliderRef.current.scrollWidth - sliderRef.current.offsetWidth);
        }
    }, []);

    // Helper to determine visible items based on screen width (simple approximation)
    // In a real app, use a resize observer or media query hook
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
    const itemsPerPage = isMobile ? 1 : 3;
    const maxIndex = Math.max(0, testimonials.length - itemsPerPage);

    const nextSlide = () => {
        setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <span className="inline-block bg-brand-pink/10 text-brand-pink px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        {t('testimonials.badge')}
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-black text-gray-900">
                        {t('testimonials.title')} <span className="text-brand-pink">{t('testimonials.titleHighlight')}</span> {t('testimonials.titleEnd')}
                    </h2>
                </motion.div>

                {/* Slider Container */}
                <div ref={sliderRef} className="overflow-hidden cursor-grab active:cursor-grabbing relative py-10 -my-10">
                    <motion.div
                        className="flex gap-8 px-4"
                        drag="x"
                        dragConstraints={{ right: 0, left: -(width + 50) }} // Allow some drag past end
                        animate={{ x: -currentIndex * (isMobile ? 100 : 33.33) + '%' }} // Move by percentage
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = offset.x;

                            if (swipe < -50) {
                                nextSlide();
                            } else if (swipe > 50) {
                                prevSlide();
                            }
                        }}
                    >
                        {testimonials.map((item, i) => (
                            <motion.div
                                key={i}
                                className={`min-w-full md:min-w-[calc(33.333%-1.33rem)] bg-white border-2 border-brand-pink p-8 shadow-sm hover:shadow-xl hover:shadow-brand-pink/20 transition-shadow relative flex flex-col group`}
                            >
                                {/* Quote icon */}
                                <div className="absolute -top-4 right-8 w-10 h-10 bg-brand-pink flex items-center justify-center">
                                    <Quote className="text-white" size={16} />
                                </div>

                                {/* Content wrapper */}
                                <div className="flex-1">
                                    {/* Stars */}
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, j) => (
                                            <svg key={j} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                            </svg>
                                        ))}
                                    </div>

                                    <p className="text-gray-600 leading-relaxed mb-6">"{item.text}"</p>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center gap-4 mt-auto">
                                    <div className="w-16 h-16 bg-gray-50 flex items-center justify-center p-2">
                                        <img
                                            src={item.logo}
                                            alt={item.name}
                                            loading="lazy"
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${item.name}&background=random`;
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
                                        <p className="text-base text-gray-500">{item.role}</p>
                                    </div>

                                    <motion.button
                                        className="ml-auto bg-brand-pink text-white text-xs font-bold px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 hover:bg-brand-pink/90 whitespace-nowrap"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        {t('testimonials.viewProject')}
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Navigation Arrows (Desktop) */}
                <div className="hidden md:flex justify-between absolute top-1/2 -translate-y-1/2 left-0 right-0 pointer-events-none px-2 w-full max-w-[1320px] mx-auto">
                    <button
                        onClick={prevSlide}
                        disabled={currentIndex === 0}
                        className={`w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-brand-pink pointer-events-auto transition-opacity hover:bg-gray-50 ${currentIndex === 0 ? 'opacity-0 cursor-default' : 'opacity-100'}`}
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextSlide}
                        disabled={currentIndex >= maxIndex}
                        className={`w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-brand-pink pointer-events-auto transition-opacity hover:bg-gray-50 ${currentIndex >= maxIndex ? 'opacity-0 cursor-default' : 'opacity-100'}`}
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* Navigation dots */}
                <div className="flex justify-center gap-2 mt-12">
                    {/* Show visual dots corresponding to scroll position chunks */}
                    {/* We map dots to potential starting positions. For simplicity, just show dots for each possible start index or grouped */}
                    {/* Since we scroll 1 by 1 or view by 3, let's just make dots clickable for each valid starting index */}
                    {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                        <motion.button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`h-3 rounded-full transition-all duration-300 ${currentIndex === i ? 'bg-brand-pink w-8' : 'bg-gray-300 w-3'}`}
                            whileHover={{ scale: 1.2 }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};