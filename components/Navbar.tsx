import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

import { supabase, Service } from '../lib/supabase';

export const Navbar: React.FC = () => {
  const [showNavbar, setShowNavbar] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileServices, setShowMobileServices] = useState(false);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight;
      setShowNavbar(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch services for dropdown
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('display_order');

        if (error) throw error;
        setServices(data || []);
      } catch (err) {
        console.error('Error fetching services:', err);
      }
    };

    fetchServices();
  }, []);

  // Close mobile menu on route change or resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowMobileMenu(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showMobileMenu]);

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
    setShowMobileServices(false);
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 h-20 flex items-center"
        initial={{ y: -100 }}
        animate={{ y: showNavbar ? 0 : -100 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo-hugs.png" alt="HUGs Agency" className="h-12 object-contain" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase text-gray-700">
            <Link to="/" className="hover:text-brand-pink transition-colors">Trang chủ</Link>
            <Link to="/about" className="hover:text-brand-pink transition-colors">Giới thiệu</Link>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowServicesDropdown(true)}
              onMouseLeave={() => setShowServicesDropdown(false)}
            >
              <Link
                to="/service"
                className="hover:text-brand-pink transition-colors flex items-center gap-1"
              >
                Dịch vụ
                <ChevronDown size={14} className={`transition-transform ${showServicesDropdown ? 'rotate-180' : ''}`} />
              </Link>

              <AnimatePresence>
                {showServicesDropdown && (
                  <motion.div
                    className="absolute top-full left-0 mt-2 w-72 bg-white shadow-xl border border-gray-100 overflow-hidden"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="py-2">
                      {services.map((service) => (
                        <Link
                          key={service.id}
                          to={`/projects?service=${service.slug}`}
                          className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-brand-pink/10 hover:text-brand-pink transition-colors normal-case"
                        >
                          {service.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/allprojects" className="hover:text-brand-pink transition-colors">Dự án</Link>
            <Link to="/careers" className="hover:text-brand-pink transition-colors">Tuyển dụng</Link>
            <Link to="/news" className="hover:text-brand-pink transition-colors">Tin tức</Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(true)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-gray-700 hover:text-brand-pink transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            <div className="hidden md:flex w-8 h-8 rounded-full border border-gray-300 items-center justify-center text-xs font-bold text-gray-500 cursor-pointer hover:border-brand-pink hover:text-brand-pink">
              VN
            </div>
            <button className="hidden md:block bg-brand-dark text-white px-5 py-2 rounded-full text-xs font-bold uppercase hover:bg-brand-pink transition-colors">
              Đăng ký tư vấn
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            className="fixed inset-0 z-[200] bg-white flex flex-col"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-2">
                <img src="/logo-hugs.png" alt="HUGs Agency" className="h-10 object-contain" />
              </Link>
              <button
                onClick={closeMobileMenu}
                className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-brand-pink transition-colors"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto px-6 py-8">
              <nav className="space-y-6">
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className="block text-2xl font-bold text-gray-900 hover:text-brand-pink transition-colors"
                >
                  Trang chủ
                </Link>
                <Link
                  to="/about"
                  onClick={closeMobileMenu}
                  className="block text-2xl font-bold text-gray-900 hover:text-brand-pink transition-colors"
                >
                  Giới thiệu
                </Link>

                {/* Services Dropdown */}
                <div>
                  <button
                    onClick={() => setShowMobileServices(!showMobileServices)}
                    className="flex items-center justify-between w-full text-2xl font-bold text-gray-900 hover:text-brand-pink transition-colors"
                  >
                    <span>Dịch vụ</span>
                    <ChevronDown
                      size={24}
                      className={`transition-transform duration-300 ${showMobileServices ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {showMobileServices && services.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 pl-4 space-y-3">
                          {services.map((service) => (
                            <Link
                              key={service.id}
                              to={`/projects?service=${service.slug}`}
                              onClick={closeMobileMenu}
                              className="block text-lg text-gray-600 hover:text-brand-pink transition-colors"
                            >
                              {service.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  to="/allprojects"
                  onClick={closeMobileMenu}
                  className="block text-2xl font-bold text-gray-900 hover:text-brand-pink transition-colors"
                >
                  Dự án
                </Link>
                <Link
                  to="/careers"
                  onClick={closeMobileMenu}
                  className="block text-2xl font-bold text-gray-900 hover:text-brand-pink transition-colors"
                >
                  Tuyển dụng
                </Link>
                <Link
                  to="/news"
                  onClick={closeMobileMenu}
                  className="block text-2xl font-bold text-gray-900 hover:text-brand-pink transition-colors"
                >
                  Tin tức
                </Link>
              </nav>
            </div>

            {/* Footer CTA */}
            <div className="px-6 py-6 border-t border-gray-100">
              <button
                onClick={closeMobileMenu}
                className="w-full bg-brand-pink text-white py-4 rounded-full text-sm font-bold uppercase hover:bg-pink-600 transition-colors"
              >
                Đăng ký tư vấn
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};