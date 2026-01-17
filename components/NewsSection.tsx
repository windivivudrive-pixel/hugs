import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, User } from 'lucide-react';

export const NewsSection: React.FC = () => {
    const sideNews = [
        { title: "Into the Teamverse: Chuyến teambuilding 2 ngày 1 đêm", date: "15 Dec 2024" },
        { title: "Thương hiệu tỏa sáng, chinh phục khách hàng: Marketing bài bản", date: "10 Dec 2024" },
        { title: "HUGs Agency trở thành đối tác TikTok Shop đầu tiên tại miền Trung", date: "5 Dec 2024" }
    ];

    return (
        <section className="py-24 bg-white/80 backdrop-blur-sm overflow-hidden relative">
            {/* Logo marker - bottom right */}
            <img
                src="/logo-hugs-only.png"
                alt=""
                className="absolute bottom-8 right-8 w-14 h-14 opacity-10 pointer-events-none"
            />
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div>
                        <span className="inline-block bg-brand-pink/10 text-brand-pink px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            Blog
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-black text-gray-900">
                            Tin tức <span className="text-brand-pink">nổi bật</span>
                        </h2>
                    </div>
                    <motion.button
                        className="mt-4 md:mt-0 text-brand-pink font-semibold flex items-center gap-2 hover:gap-3 transition-all"
                        whileHover={{ x: 5 }}
                    >
                        Xem tất cả <ArrowRight size={18} />
                    </motion.button>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Featured Article */}
                    <motion.div
                        className="group relative rounded-3xl overflow-hidden cursor-pointer"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -5 }}
                    >
                        <div className="aspect-[4/3] overflow-hidden">
                            <img
                                src="https://picsum.photos/800/600?random=news"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                            <span className="inline-block bg-brand-pink px-3 py-1 rounded-full text-xs font-bold mb-4">
                                Featured
                            </span>
                            <h3 className="text-2xl font-bold mb-4 leading-tight">
                                Top 5 công ty Marketing uy tín tại Đà Nẵng
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-white/70">
                                <span className="flex items-center gap-1"><User size={14} /> Admin</span>
                                <span className="flex items-center gap-1"><Clock size={14} /> 20 Dec 2024</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Side Articles */}
                    <motion.div
                        className="space-y-4"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
                        }}
                    >
                        {sideNews.map((news, i) => (
                            <motion.div
                                key={i}
                                className="flex gap-4 bg-gray-50 rounded-2xl p-4 cursor-pointer group hover:bg-brand-pink/5 transition-colors"
                                variants={{
                                    hidden: { opacity: 0, x: 30 },
                                    visible: { opacity: 1, x: 0 }
                                }}
                                whileHover={{ x: 5 }}
                            >
                                <div className="w-28 h-24 rounded-xl overflow-hidden flex-shrink-0">
                                    <img
                                        src={`https://picsum.photos/200/200?random=${i + 100}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <span className="text-xs text-brand-pink font-semibold mb-1">{news.date}</span>
                                    <h4 className="font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-brand-pink transition-colors">
                                        {news.title}
                                    </h4>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};