import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowUp } from 'lucide-react';

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

export const MainSite: React.FC = () => {
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

      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-20 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
      >
        <motion.div
          className="bg-brand-pink w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-brand-pink/30 cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <MessageSquare className="text-white" />
        </motion.div>
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