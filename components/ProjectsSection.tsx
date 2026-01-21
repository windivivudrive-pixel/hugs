import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Project data with partner logos and campaign backgrounds
const projects = [
    {
        client: "Mobifone",
        title: "Chiến dịch truyền thông 5G",
        logo: "/logo partner/partner0.png",
        image: "https://picsum.photos/600/600?random=1"
    },
    {
        client: "Tan Ca",
        title: "Hành trình tăng nhận diện thương hiệu",
        logo: "/logo partner/partner1.png",
        image: "https://picsum.photos/600/600?random=2"
    },
    {
        client: "My Hanh",
        title: "Chanh vàng gọi hè - Chiến dịch marketing",
        logo: "/logo partner/partner2.png",
        image: "https://picsum.photos/600/600?random=3"
    },
    {
        client: "Tram Huong",
        title: "Khi mặt hàng địa phương lên sàn",
        logo: "/logo partner/partner3.png",
        image: "https://picsum.photos/600/600?random=4"
    },
    {
        client: "Kieslect",
        title: "Tăng nhận diện thương hiệu smartwatch",
        logo: "/logo partner/partner4.png",
        image: "https://picsum.photos/600/600?random=5"
    },
    {
        client: "Ai Hay",
        title: "Khi AI trở thành trợ lý đắc lực",
        logo: "/logo partner/partner5.png",
        image: "https://picsum.photos/600/600?random=6"
    }
];

export const ProjectsSection: React.FC = () => {
    return (
        <section className="py-20 bg-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-pink/5 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
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

                {/* Grid layout - 2x3 */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                    }}
                >
                    {projects.map((project, i) => (
                        <motion.div
                            key={i}
                            className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                        >
                            {/* Background Image */}
                            <motion.img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.4 }}
                            />

                            {/* Default overlay - subtle gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity duration-300 group-hover:opacity-0" />

                            {/* Hover overlay - pink */}
                            <div className="absolute inset-0 bg-brand-pink/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Logo - always centered */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    className="w-28 h-28 bg-white rounded-2xl shadow-lg flex items-center justify-center p-4"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <img
                                        src={project.logo}
                                        alt={project.client}
                                        className="w-full h-full object-contain"
                                    />
                                </motion.div>
                            </div>

                            {/* Bottom content - visible on hover */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-center flex flex-col items-center">
                                <h3 className="text-white font-bold text-lg leading-tight mb-3">
                                    {project.title}
                                </h3>
                                <button className="px-5 py-2 bg-white text-brand-pink font-bold text-sm rounded-full flex items-center gap-2 hover:bg-gray-100 transition-colors">
                                    Xem chi tiết
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};