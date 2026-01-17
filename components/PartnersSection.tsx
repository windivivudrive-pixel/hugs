import React from 'react';
import { motion } from 'framer-motion';

export const PartnersSection: React.FC = () => {
    const logos = [
        "Saigontourist", "VinFast", "Belle Maison", "AhaMove",
        "Huda", "Carlsberg", "FPT University", "HoaTho",
        "Anna", "KoTo", "MB Bank", "Mobifone"
    ];

    return (
        <section className="py-20 bg-white/80 backdrop-blur-sm overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <span className="inline-block bg-brand-pink/10 text-brand-pink px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        Đối tác
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
                        Được tin tưởng bởi <span className="text-brand-pink">100+</span> thương hiệu
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-12">
                        Chúng tôi tự hào được đồng hành cùng các thương hiệu lớn nhỏ trên khắp Việt Nam
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.05 }
                        }
                    }}
                >
                    {logos.map((logo, i) => (
                        <motion.div
                            key={i}
                            className="bg-gray-50 rounded-2xl h-20 flex items-center justify-center p-4 hover:bg-brand-pink/5 hover:shadow-lg transition-all cursor-pointer group"
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            whileHover={{ scale: 1.05, y: -2 }}
                        >
                            <div className="text-xs text-gray-400 font-bold uppercase group-hover:text-brand-pink transition-colors">
                                {logo}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};