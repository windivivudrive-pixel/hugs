import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export const CultureSection: React.FC = () => {
    return (
        <section className="py-24 bg-gray-50/80 backdrop-blur-sm relative overflow-hidden">
            {/* Logo marker - subtle corner decoration */}
            <img
                src="/logo-hugs-only.png"
                alt=""
                className="absolute bottom-8 right-8 w-16 h-16 opacity-10 pointer-events-none"
            />
            {/* Decorative elements */}
            <motion.div
                className="absolute top-20 right-20 w-20 h-20 bg-brand-pink/10 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-20 left-10 w-32 h-32 bg-brand-pink/5 rounded-full"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 5, repeat: Infinity }}
            />

            <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left - Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    {/* Quote icon */}
                    <div className="w-12 h-12 bg-brand-pink/10 rounded-xl flex items-center justify-center mb-6">
                        <Quote className="text-brand-pink" size={24} />
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
                        Chiến lược <br />
                        Sáng tạo <br />
                        <span className="text-brand-pink">Hiệu quả thực sự</span>
                    </h2>

                    <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                        Hiểu được tầm quan trọng của truyền thông trong việc quyết định sự thành bại của mỗi doanh nghiệp, chúng tôi luôn làm việc trên phương châm trên, để từ đó nuôi dưỡng, chăm sóc bằng tất cả sự tâm huyết và tình yêu thương.
                    </p>

                    <motion.button
                        className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-full text-sm font-bold hover:border-brand-pink hover:text-brand-pink transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Xem các dự án
                    </motion.button>
                </motion.div>

                {/* Right - Image */}
                <motion.div
                    className="relative"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    {/* Decorative frame */}
                    <div className="absolute -top-4 -right-4 w-full h-full border-4 border-brand-pink/20 rounded-3xl"></div>

                    <img
                        src="https://picsum.photos/600/500?random=team"
                        className="w-full rounded-3xl shadow-xl relative z-10"
                        alt="Team Culture"
                    />

                    {/* Stats badge */}
                    <motion.div
                        className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 z-20"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        <div className="text-3xl font-black text-brand-pink">50+</div>
                        <div className="text-sm text-gray-600">Dự án hoàn thành</div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};