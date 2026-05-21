'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowUp } from 'lucide-react';
import dynamic from 'next/dynamic';

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
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useDocumentHead } from '@/lib/useDocumentHead';

// Dynamic import ChatBot to improve initial page load performance and reduce bundle weight
const ChatBot = dynamic(() => import('@/components/ui/ChatBot').then(mod => mod.ChatBot), {
  ssr: false,
});

interface MainSiteProps {
  isLoading?: boolean;
  initialArticles?: any[];
  initialProjects?: any[];
}

export const MainSite: React.FC<MainSiteProps> = ({ 
  isLoading = false,
  initialArticles = [],
  initialProjects = []
}) => {
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
        <ProjectsSection initialProjects={initialProjects} />
        <SocialSection />
        {/* <TestimonialsSection /> */}
        <NewsSection initialArticles={initialArticles} />
        <FooterSection />
      </div>

      {/* AI Chat Bot - dynamically loaded */}
      <ChatBot onOpenChange={setIsChatOpen} />
    </div>
  );
};