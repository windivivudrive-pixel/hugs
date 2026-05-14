'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const HeroSection: React.FC = () => {
    const { t } = useLanguage();
    return (
        <section className="relative w-full aspect-video md:aspect-auto md:min-h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* Background Video */}
            <div className="absolute inset-0 w-full h-full">
                <video
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src="/Loading.mp4" type="video/mp4" />
                </video>
                {/* Dark Overlay for text readability */}
                {/* <div className="absolute inset-0 bg-black/50" /> */}
            </div>

            <div className="max-w-7xl mx-auto px-6 w-full relative z-10 py-6 md:py-20 text-center flex flex-col items-center justify-center h-full">
                <motion.div
                    className="text-base md:text-5xl lg:text-6xl font-black text-white mb-2 md:mb-4 leading-tight tracking-tight drop-shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    HUGs Agency
                </motion.div>

                <motion.h1
                    className="text-lg md:text-5xl lg:text-6xl font-black text-white mb-2 md:mb-6 leading-tight tracking-tight drop-shadow-lg"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    {t('hero.title').includes(' – ') ? (
                        t('hero.title').split(' – ').map((part, index) => (
                            <React.Fragment key={index}>
                                {part}
                                {index === 0 && (
                                    <>
                                        <span className="hidden md:inline"> – </span>
                                        <br className="md:hidden" />
                                    </>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        t('hero.title')
                    )}
                </motion.h1>

                <motion.p
                    className="text-white mb-4 md:mb-10 max-w-6xl leading-relaxed text-xs md:text-2xl lg:text-3xl font-light"
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