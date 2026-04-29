'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

// Partner logos from logo partner directory (partner0 to partner25)
const partnerLogos = Array.from({ length: 26 }, (_, i) => ({
    id: i,
    logo: `/logo-partner/partner${i}.png`,
}));

// CountUp component for animated number
const CountUp: React.FC<{ end: number; duration?: number }> = ({ end, duration = 2 }) => {
    const [count, setCount] = React.useState(0);
    const [hasStarted, setHasStarted] = React.useState(false);

    React.useEffect(() => {
        if (!hasStarted) return;

        const stepTime = (duration * 1000) / end;
        let current = 0;

        const timer = setInterval(() => {
            current += 1;
            setCount(current);
            if (current >= end) {
                clearInterval(timer);
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, [hasStarted, end, duration]);

    return (
        <motion.span
            onViewportEnter={() => setHasStarted(true)}
            viewport={{ once: true }}
        >
            {count}
        </motion.span>
    );
};

export const PartnersSection: React.FC = () => {
    const { t } = useLanguage();

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <span className="inline-block bg-brand-pink/10 text-brand-pink px-4 py-2 rounded-full text-sm font-semibold mb-6">
                        {t('partners.badge')}
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
                        {t('partners.title')}{' '}
                        <span className="text-brand-pink">
                            <CountUp end={100} duration={2} />+
                        </span>
                        {' '}{t('partners.titleEnd')}
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        {t('partners.description')}
                    </p>
                </motion.div>

                {/* Marquee container */}
                <div className="relative">
                    {/* Fade edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                    {/* First row - scrolling left (CSS animation) */}
                    <div className="flex overflow-hidden mb-4 md:mb-6 pb-4">
                        <div
                            className="flex gap-4 md:gap-8 items-center partners-marquee-left"
                        >
                            {[...partnerLogos, ...partnerLogos].map((partner, index) => (
                                <div
                                    key={`row1-${index}`}
                                    className="flex-shrink-0 h-14 md:h-20 px-4 md:px-6 bg-gray-50/80 flex items-center justify-center grayscale hover:grayscale-0 opacity-70 hover:opacity-100 hover:bg-brand-pink/5 hover:shadow-lg transition-all duration-300 cursor-pointer"
                                >
                                    <img
                                        src={partner.logo}
                                        alt={`Partner ${partner.id}`}
                                        loading="lazy"
                                        className="h-8 md:h-12 w-auto object-contain max-w-[100px] md:max-w-[140px]"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Second row - scrolling right (CSS animation) */}
                    <div className="flex overflow-hidden pb-4">
                        <div
                            className="flex gap-4 md:gap-8 items-center partners-marquee-right"
                        >
                            {[...partnerLogos.slice().reverse(), ...partnerLogos.slice().reverse()].map((partner, index) => (
                                <div
                                    key={`row2-${index}`}
                                    className="flex-shrink-0 h-14 md:h-20 px-4 md:px-6 bg-gray-50/80 flex items-center justify-center grayscale hover:grayscale-0 opacity-70 hover:opacity-100 hover:bg-brand-pink/5 hover:shadow-lg transition-all duration-300 cursor-pointer"
                                >
                                    <img
                                        src={partner.logo}
                                        alt={`Partner ${partner.id}`}
                                        loading="lazy"
                                        className="h-8 md:h-12 w-auto object-contain max-w-[100px] md:max-w-[140px]"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CSS Marquee Animations - GPU accelerated, zero JS overhead */}
                <style>{`
                    @keyframes partners-scroll-left {
                        from { transform: translateX(0%); }
                        to { transform: translateX(-50%); }
                    }
                    @keyframes partners-scroll-right {
                        from { transform: translateX(-50%); }
                        to { transform: translateX(0%); }
                    }
                    .partners-marquee-left {
                        animation: partners-scroll-left 60s linear infinite;
                        will-change: transform;
                    }
                    .partners-marquee-right {
                        animation: partners-scroll-right 70s linear infinite;
                        will-change: transform;
                    }
                `}</style>

            </div>
        </section>
    );
};