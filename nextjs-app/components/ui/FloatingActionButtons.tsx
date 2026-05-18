'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowUp } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export function FloatingActionButtons() {
    const pathname = usePathname();
    const isCareersPage = pathname === '/careers';
    const [showScrollTop, setShowScrollTop] = useState(false);
    // Note: We use z-[90] to ensure it stays below the ChatBot window (z-[100]) if they overlap
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <>
            {/* Recruitment Button (Only for Careers Page) */}
            <AnimatePresence>
                {isCareersPage && isVisible && (
                    <motion.div
                        className={`fixed bottom-0 z-[90] pointer-events-auto ${
                            isCareersPage ? "right-[-30px] md:right-[80px]" : "right-[60px] md:right-[80px]"
                        }`}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <a 
                            href="https://www.facebook.com/hugs.tuyendung" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block hover:scale-105 transition-transform duration-300"
                        >
                            <div className="relative w-[240px] h-[240px] md:w-[360px] md:h-[360px]">
                                <Image 
                                    src="/career.png" 
                                    alt="Recruitment" 
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Call Button */}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        className={`fixed bottom-20 right-[34px] md:right-11 z-[90] pointer-events-auto ${
                            isCareersPage ? "hidden md:block" : "block"
                        }`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                    >
                        <a href="tel:0778970999" className="relative block group">
                            {/* Ripple Effects using CSS Keyframes */}
                            <div className="absolute w-11 h-11 md:w-14 md:h-14 rounded-full bg-brand-pink animate-ripple" />
                            <div className="absolute w-11 h-11 md:w-14 md:h-14 rounded-full bg-brand-pink animate-ripple" style={{ animationDelay: '1s' }} />

                            {/* Main Button */}
                            <motion.div
                                className="relative bg-brand-pink w-11 h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg shadow-brand-pink/30 cursor-pointer overflow-hidden z-10"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 1.0 }}
                            >
                                <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 origin-center" />
                                <Phone className="text-white relative z-10 w-5 h-5 md:w-6 md:h-6" />
                            </motion.div>
                        </a>

                        <style>{`
                            @keyframes ripple {
                                0% {
                                    transform: scale(1);
                                    opacity: 0.4;
                                }
                                100% {
                                    transform: scale(2);
                                    opacity: 0;
                                }
                            }
                            .animate-ripple {
                                animation: ripple 2s linear infinite;
                            }
                        `}</style>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Scroll Top Button */}
            <motion.div
                className={`fixed bottom-6 right-[40px] md:right-[54px] z-[90] ${
                    isCareersPage ? "hidden md:block" : "block"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showScrollTop ? 1 : 0, y: showScrollTop ? 0 : 20 }}
                transition={{ duration: 0.3 }}
                style={{ pointerEvents: showScrollTop ? 'auto' : 'none' }}
            >
                <motion.div
                    className="bg-brand-pink w-8 h-8 md:w-9 md:h-9 rounded-none flex items-center justify-center shadow-lg shadow-brand-pink/20 cursor-pointer hover:bg-brand-pink/90 transition-colors"
                    onClick={scrollToTop}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <ArrowUp className="text-white w-4 h-4 md:w-5 md:h-5" />
                </motion.div>
            </motion.div>
        </>
    );
}
