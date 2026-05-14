'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowUp } from 'lucide-react';

import { Navbar } from '@/components/ui/Navbar';
import { WelcomeCube } from './WelcomeCube';
import { HeroSection } from './HeroSection';
import { CultureSection } from './CultureSection';
import { ServicesSection } from './ServicesSection';
import { PartnersSection } from './PartnersSection';
import { ProjectsSection } from './ProjectsSection';
import { SocialSection } from './SocialSection';
// import { TestimonialsSection } from './TestimonialsSection';
import { NewsSection } from './NewsSection';
import { FooterSection } from '@/components/ui/FooterSection';
import { ChatBot } from '@/components/ui/ChatBot';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useDocumentHead } from '@/lib/useDocumentHead';

export const MainSite: React.FC<{ isLoading?: boolean }> = ({ isLoading = false }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  useDocumentHead({
    title: undefined, // Uses default title
    description: 'HUGs Agency - Agency Marketing tổng thể tại Việt Nam. Cung cấp dịch vụ quản trị fanpage, quảng cáo đa nền tảng, sản xuất video, thiết kế, SEO và tổ chức sự kiện.',
    keywords: 'marketing agency, digital marketing, quảng cáo, thiết kế, SEO, social media, HUGs Agency',
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 relative">
      {/* Loading Screen 0-100% */}
      {showLoading && (
        <LoadingScreen onComplete={() => setShowLoading(false)} />
      )}

      <Navbar />

      {/* WelcomeCube - integrated as first section */}
      <WelcomeCube />

      {/* Hero Section - appears after WelcomeCube scroll */}
      <div className="md:min-h-screen relative z-10">
        <HeroSection />
      </div>

      {/* Main Content */}
      <div className="relative z-20 bg-white">
        <CultureSection />
        <PartnersSection />
        <ServicesSection />
        <ProjectsSection />
        <SocialSection />
        {/* <TestimonialsSection /> */}
        <NewsSection />
        <FooterSection />
      </div>

      {/* AI Chat Bot */}
      <ChatBot onOpenChange={setIsChatOpen} />
    </div>
  );
};