import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, ArrowUp } from 'lucide-react';

import { Navbar } from './Navbar';
import { WelcomeCube } from './WelcomeCube';
import { HeroSection } from './HeroSection';
import { CultureSection } from './CultureSection';
import { ServicesSection } from './ServicesSection';
import { PartnersSection } from './PartnersSection';
import { ProjectsSection } from './ProjectsSection';
import { SocialSection } from './SocialSection';
import { TestimonialsSection } from './TestimonialsSection';
import { NewsSection } from './NewsSection';
import { FooterSection } from './FooterSection';

export const MainSite: React.FC<{ isLoading?: boolean }> = ({ isLoading = false }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 relative">
      <Navbar />

      {/* WelcomeCube - integrated as first section */}
      <WelcomeCube />

      {/* Hero Section - appears after WelcomeCube scroll */}
      <div className="min-h-screen overflow-hidden relative z-10">
        <HeroSection />
      </div>

      {/* Main Content */}
      <div className="relative z-20 bg-white">
        <CultureSection />
        <PartnersSection />
        <ServicesSection />
        <ProjectsSection />
        <SocialSection />
        <TestimonialsSection />
        <NewsSection />
        <FooterSection />
      </div>

      {/* Floating Call Button */}
      <motion.div
        className="fixed bottom-20 right-6 z-[100] pointer-events-auto"
      >
        <a href="tel:0924392222" className="relative block group">
          {/* Ripple Effects using CSS Keyframes */}
          <div className="absolute w-14 h-14 rounded-full bg-brand-pink animate-ripple" />
          <div className="absolute w-14 h-14 rounded-full bg-brand-pink animate-ripple" style={{ animationDelay: '1s' }} />

          {/* Main Button */}
          <motion.div
            className="relative bg-brand-pink w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-brand-pink/30 cursor-pointer overflow-hidden z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1.0 }}
          >
            <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 origin-center" />
            <Phone className="text-white relative z-10 w-6 h-6" />
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

      {/* Scroll Top Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showScrollTop ? 1 : 0, y: showScrollTop ? 0 : 20 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="bg-gray-900 w-10 h-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ scale: 1.1, backgroundColor: '#FF0290' }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowUp className="text-white w-5 h-5" />
        </motion.div>
      </motion.div>
    </div>
  );
};