import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const ProjectsSection: React.FC = () => {
    const projects = [
        { client: "Mobifone", title: "Chiến dịch truyền thông 5G", tag: "BOOKING - PR" },
        { client: "Tan Ca", title: "Hành trình tăng nhận diện thương hiệu", tag: "MARKETING F&B" },
        { client: "My Hanh", title: "Chanh vàng gọi hè - Chiến dịch marketing", tag: "MARKETING" },
        { client: "Tram Huong", title: "Khi mặt hàng địa phương lên sàn", tag: "TIKTOK" },
        { client: "Kieslect", title: "Tăng nhận diện thương hiệu smartwatch", tag: "BOOKING - PR" },
        { client: "Ai Hay", title: "Khi AI trở thành trợ lý đắc lực", tag: "MARKETING" }
    ];

    return (
        <section className="pb-10 bg-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-pink/5 rounded-full blur-3xl"></div>

            <div className="max-w-5xl mx-auto px-6">
                <motion.div
                    className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div>
                        <span className="inline-block bg-brand-pink/10 text-brand-pink px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            Dự án
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-black text-gray-900">
                            Các dự án <span className="text-brand-pink">nổi bật</span>
                        </h2>
                    </div>
                    <motion.button
                        className="mt-4 md:mt-0 text-brand-pink font-semibold flex items-center gap-2 hover:gap-3 transition-all"
                        whileHover={{ x: 5 }}
                    >
                        Xem tất cả <ArrowRight size={18} />
                    </motion.button>
                </motion.div>

                {/* 2 columns x 3 rows layout */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                    }}
                >
                    {projects.map((p, i) => (
                        <motion.div
                            key={i}
                            className="group flex items-start gap-5 p-4 rounded-2xl border border-brand-pink/30 bg-white shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            whileHover={{ y: -5 }}
                        >
                            {/* Logo/Image - square */}
                            <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                                <img
                                    src={`https://picsum.photos/100/100?random=${i + 50}`}
                                    alt={p.client}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col justify-between h-24">
                                {/* Top: Tag */}
                                <span className="text-brand-pink font-bold text-xs uppercase tracking-wider">{p.tag}</span>

                                {/* Middle: Title */}
                                <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-brand-pink transition-colors line-clamp-2">
                                    {p.title}
                                </h3>

                                {/* Bottom: Client name */}
                                <p className="text-gray-500 text-sm">{p.client}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};