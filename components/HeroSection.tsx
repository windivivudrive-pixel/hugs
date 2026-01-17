import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
    return (
        <section className="relative w-full min-h-screen bg-white overflow-hidden flex items-center">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Pink gradient blob top right */}
                <motion.div
                    className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-pink-200/40 to-brand-pink/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 10, 0]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Pink gradient blob bottom left */}
                <motion.div
                    className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-gradient-to-tr from-brand-pink/20 to-pink-300/30 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.15, 1],
                        rotate: [0, -10, 0]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 py-20">
                {/* Left side - Content */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block bg-brand-pink/10 text-brand-pink px-4 py-2 rounded-full text-sm font-semibold mb-6">
                            🚀 Đối tác TikTok Shop đầu tiên tại Miền Trung
                        </span>
                    </motion.div>

                    <motion.h1
                        className="text-5xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Truyền thông <br />
                        <span className="text-brand-pink">Mạng xã hội</span> <br />
                        hàng đầu
                    </motion.h1>

                    <motion.p
                        className="text-gray-600 mb-8 max-w-lg leading-relaxed text-lg"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        HUGs Agency là ngôi nhà chung của những người trẻ yêu truyền thông, có kinh nghiệm làm việc tại các client, agency lớn nhỏ trên cả nước.
                    </motion.p>

                    <motion.div
                        className="flex flex-wrap gap-4"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <motion.button
                            className="bg-brand-pink text-white px-8 py-4 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg shadow-brand-pink/30 hover:shadow-xl hover:shadow-brand-pink/40 transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Tìm hiểu thêm
                            <ArrowRight size={18} />
                        </motion.button>
                        <motion.button
                            className="border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-full text-sm font-bold hover:border-brand-pink hover:text-brand-pink transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Xem dịch vụ
                        </motion.button>
                    </motion.div>
                </div>

                {/* Right side - Phone Mockup */}
                <motion.div
                    className="relative hidden lg:flex items-center justify-center"
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    {/* Decorative rings with ripple effect */}
                    <motion.div
                        className="absolute w-[400px] h-[400px] border-[30px] border-brand-pink/10 rounded-full"
                        animate={{
                            scale: [1, 1.15, 1],
                            opacity: [0.3, 0.1, 0.3]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        className="absolute w-[340px] h-[340px] border-[20px] border-brand-pink/20 rounded-full"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.4, 0.15, 0.4]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    />
                    <motion.div
                        className="absolute w-[280px] h-[280px] border-[15px] border-brand-pink/25 rounded-full"
                        animate={{
                            scale: [1, 1.25, 1],
                            opacity: [0.5, 0.2, 0.5]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    />

                    {/* Phone Mockup */}
                    <motion.div
                        className="relative w-[280px] h-[560px] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden z-10"
                        initial={{ rotate: -5 }}
                        animate={{ rotate: -5 }}
                        transition={{ duration: 0.5 }}
                    >
                        <img src="https://picsum.photos/280/560?random=hero" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col items-center justify-end text-white text-center p-6 pb-16">
                            <h3 className="font-bold text-lg mb-1">PHÁT TRIỂN FACEBOOK - SHOPEE</h3>
                            <p className="text-xs uppercase tracking-widest text-white/70">Cho Nessa House</p>
                        </div>
                        {/* Play Button */}
                        <div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer shadow-xl hover:bg-white active:scale-95 transition-all"
                        >
                            <Play className="fill-brand-pink text-brand-pink ml-1" size={24} />
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Wavy Divider Bottom */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                    <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="#F9FAFB" />
                </svg>
            </div>
        </section>
    );
};