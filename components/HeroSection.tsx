import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const HeroSection: React.FC = () => {
    const { t } = useLanguage();
    return (
        <section className="relative w-full min-h-screen bg-gray-900 overflow-hidden flex items-center">
            {/* Background Video */}
            <div className="absolute inset-0 w-full h-full">
                <video
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src="https://mltmwwywqhehrjwrrxks.supabase.co/storage/v1/object/public/hugs/video/Screen%20Recording%202026-01-22%20at%2010.23.07%20AM.mov" type="video/mp4" />
                </video>
                {/* Dark Overlay for text readability */}
                <div className="absolute inset-0 bg-black/50" />
            </div>

            <div className="max-w-7xl mx-auto px-6 w-full relative z-10 py-20 text-center flex flex-col items-center">
                <motion.h1
                    className="text-5xl lg:text-7xl font-black text-brand-pink mb-6 leading-tight tracking-tight drop-shadow-lg"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    {t('hero.title')}
                </motion.h1>

                <motion.p
                    className="text-white mb-10 max-w-6xl leading-relaxed text-xl md:text-2xl lg:text-3xl font-light"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {t('hero.subtitle')}
                </motion.p>


            </div>
        </section>
    );
};