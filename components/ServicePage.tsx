import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { FooterSection } from './FooterSection';
import { PageNavbar } from './PageNavbar';
import { supabase, Service } from '../lib/supabase';

// Service icons mapping
const serviceIcons: Record<string, string> = {
    'quan-tri-page-facebook': '📱',
    'xay-kenh-tiktok': '🎵',
    'media-production': '🎬',
    'booking-kol-koc': '⭐',
    'seo': '🔍',
    'social-media': '💬',
    'quang-cao-da-nen-tang': '📢',
    'seeding': '🌱',
    'thiet-ke-an-pham': '🎨',
    'to-chuc-su-kien': '🎪',
    'thiet-ke-website': '🌐',
};

export const ServicePage: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const handleServiceClick = (slug: string) => {
        navigate(`/projects?service=${slug}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-8 h-8 animate-spin text-brand-pink" />
            </div>
        );
    }

    // Split services into rows: 3-3-3-2
    const rows = [
        services.slice(0, 3),
        services.slice(3, 6),
        services.slice(6, 9),
        services.slice(9, 11),
    ];

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Navbar */}
            <PageNavbar activePage="service" />

            {/* Hero Section */}
            <section className="pt-32 pb-16 bg-gradient-to-b from-brand-pink/5 to-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-2 bg-brand-pink/10 text-brand-pink rounded-full text-sm font-semibold mb-6">
                            Dịch vụ của chúng tôi
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black mb-6">
                            Giải pháp truyền thông<br />
                            <span className="text-brand-pink">toàn diện</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            HUGs cung cấp đầy đủ các dịch vụ truyền thông số, từ xây dựng nội dung đến quản lý kênh và quảng cáo đa nền tảng.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    {rows.map((row, rowIndex) => (
                        <div
                            key={rowIndex}
                            className={`grid gap-6 mb-6 ${row.length === 2
                                ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
                                : 'grid-cols-1 md:grid-cols-3'
                                }`}
                        >
                            {row.map((service, index) => (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    onClick={() => handleServiceClick(service.slug)}
                                    className="group bg-white border border-gray-200 rounded-2xl p-8 hover:border-brand-pink hover:shadow-xl transition-all cursor-pointer"
                                >
                                    {/* Icon */}
                                    <div className="text-4xl mb-4">
                                        {serviceIcons[service.slug] || '📌'}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-pink transition-colors">
                                        {service.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                        {service.short_description || 'Giải pháp chuyên nghiệp giúp thương hiệu phát triển bền vững trên nền tảng số.'}
                                    </p>

                                    {/* CTA */}
                                    <div className="flex items-center gap-2 text-brand-pink font-semibold text-sm group-hover:gap-3 transition-all">
                                        Xem dự án
                                        <ArrowRight size={16} />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-brand-pink">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                            Bạn cần tư vấn dịch vụ phù hợp?
                        </h2>
                        <p className="text-white/80 mb-8 text-lg">
                            Liên hệ với HUGs để được tư vấn chiến lược truyền thông phù hợp với doanh nghiệp của bạn
                        </p>
                        <Link
                            to="/#contact"
                            className="inline-flex items-center gap-2 bg-white text-brand-pink px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors"
                        >
                            Liên hệ ngay
                            <ArrowRight size={20} />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <FooterSection />
        </div>
    );
};
