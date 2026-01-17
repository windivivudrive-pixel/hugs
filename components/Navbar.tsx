import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const Navbar: React.FC = () => {
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show navbar after scrolling 100% of viewport (when cube fully hidden)
      const threshold = window.innerHeight;
      setShowNavbar(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 h-20 flex items-center"
      initial={{ y: -100 }}
      animate={{ y: showNavbar ? 0 : -100 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/logo hugs.png" alt="HUGs Agency" className="h-12 object-contain" />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase text-gray-700">
          <a href="#" className="hover:text-brand-pink transition-colors">Trang chủ</a>
          <a href="#" className="hover:text-brand-pink transition-colors">Giới thiệu</a>
          <a href="#" className="hover:text-brand-pink transition-colors flex items-center gap-1">Dịch vụ <span className="text-[10px]">▼</span></a>
          <a href="#" className="hover:text-brand-pink transition-colors">Dự án</a>
          <a href="#" className="hover:text-brand-pink transition-colors">Tuyển dụng</a>
          <a href="#" className="hover:text-brand-pink transition-colors">Tin tức</a>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-xs font-bold text-gray-500 cursor-pointer hover:border-brand-pink hover:text-brand-pink">
            VN
          </div>
          <button className="bg-brand-dark text-white px-5 py-2 rounded-full text-xs font-bold uppercase hover:bg-brand-pink transition-colors">
            Đăng ký tư vấn
          </button>
        </div>
      </div>
    </motion.nav>
  );
};