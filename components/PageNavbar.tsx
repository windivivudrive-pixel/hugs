import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { supabase, Service } from '../lib/supabase';

interface PageNavbarProps {
    activePage?: 'home' | 'about' | 'service' | 'projects' | 'careers' | 'news';
}

export const PageNavbar: React.FC<PageNavbarProps> = ({ activePage }) => {
    const [showServicesDropdown, setShowServicesDropdown] = useState(false);
    const [services, setServices] = useState<Service[]>([]);

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

    const getLinkClass = (page: string) => {
        return activePage === page
            ? 'text-brand-pink'
            : 'hover:text-brand-pink transition-colors';
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 h-20 flex items-center">
            <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
                <a href="/" className="flex items-center gap-2">
                    <img src="/logo hugs.png" alt="HUGs Agency" className="h-12 object-contain" />
                </a>

                <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase text-gray-700">
                    <a href="/" className={getLinkClass('home')}>Trang chủ</a>
                    <a href="/about" className={getLinkClass('about')}>Giới thiệu</a>

                    {/* Services Dropdown */}
                    <div
                        className="relative"
                        onMouseEnter={() => setShowServicesDropdown(true)}
                        onMouseLeave={() => setShowServicesDropdown(false)}
                    >
                        <a
                            href="/service"
                            className={`${getLinkClass('service')} flex items-center gap-1`}
                        >
                            Dịch vụ
                            <ChevronDown size={14} className={`transition-transform ${showServicesDropdown ? 'rotate-180' : ''}`} />
                        </a>

                        <AnimatePresence>
                            {showServicesDropdown && (
                                <motion.div
                                    className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="py-2">
                                        {services.map((service) => (
                                            <a
                                                key={service.id}
                                                href={`/projects?service=${service.slug}`}
                                                className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-brand-pink/10 hover:text-brand-pink transition-colors normal-case"
                                            >
                                                {service.name}
                                            </a>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <a href="/projects" className={getLinkClass('projects')}>Dự án</a>
                    <a href="/careers" className={getLinkClass('careers')}>Tuyển dụng</a>
                    <a href="/news" className={getLinkClass('news')}>Tin tức</a>
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
        </nav>
    );
};
