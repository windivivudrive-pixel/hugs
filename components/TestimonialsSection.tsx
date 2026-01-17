import React from 'react';
import { motion } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
    const testimonials = [
        {
            name: "Ahamove",
            role: "Marketing Director",
            text: "HUGs Agency rất nhiệt tình và hỗ trợ linh hoạt, luôn sẵn lòng hỗ trợ cả vào buổi khuya và cuối tuần. Hy vọng mối quan hệ hợp tác giữa Ahamove và HUGs sẽ tiếp tục phát triển.",
            avatar: "AH"
        },
        {
            name: "Nessa House",
            role: "CEO",
            text: "Nessa House rất vui được đồng hành cùng HUGs Agency trong năm thứ hai. Chúng tôi đánh giá cao sự tận tâm và hiểu biết sâu sắc của đội ngũ HUGs Agency về thị trường miền Trung.",
            avatar: "NH"
        },
        {
            name: "Kính mắt Anna",
            role: "Brand Manager",
            text: "HUGs Agency không chỉ là đối tác digital marketing mà còn là người bạn đồng hành chiến lược. Sáng tạo và hiểu rõ về khách hàng của chúng tôi.",
            avatar: "KA"
        }
    ];

    return (
        <section className="py-24 bg-gray-50/80 backdrop-blur-sm overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <span className="inline-block bg-brand-pink/10 text-brand-pink px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        Đánh giá
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-black text-gray-900">
                        Khách hàng <span className="text-brand-pink">nói gì</span> về chúng tôi
                    </h2>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
                    }}
                >
                    {testimonials.map((item, i) => (
                        <motion.div
                            key={i}
                            className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow relative flex flex-col"
                            variants={{
                                hidden: { opacity: 0, y: 40 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            whileHover={{ y: -5 }}
                        >
                            {/* Quote icon */}
                            <div className="absolute -top-4 right-8 w-10 h-10 bg-brand-pink rounded-full flex items-center justify-center">
                                <Quote className="text-white" size={16} />
                            </div>

                            {/* Content wrapper - grows to fill space */}
                            <div className="flex-1">
                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, j) => (
                                        <svg key={j} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                        </svg>
                                    ))}
                                </div>

                                <p className="text-gray-600 leading-relaxed mb-6">"{item.text}"</p>
                            </div>

                            {/* Footer - always at bottom */}
                            <div className="flex items-center gap-4 mt-auto">
                                <div className="w-12 h-12 bg-brand-pink/10 rounded-full flex items-center justify-center text-brand-pink font-bold text-sm">
                                    {item.avatar}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                                    <p className="text-sm text-gray-500">{item.role}</p>
                                </div>
                                {/* HUGs logo marker - bottom right */}
                                <img
                                    src="/logo-hugs-only.png"
                                    alt=""
                                    className="absolute bottom-6 right-6 w-20 h-20 opacity-20 pointer-events-none"
                                />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Navigation dots */}
                <div className="flex justify-center gap-2 mt-12">
                    {[0, 1, 2].map((i) => (
                        <motion.button
                            key={i}
                            className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-brand-pink w-8' : 'bg-gray-300'} transition-all`}
                            whileHover={{ scale: 1.2 }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};