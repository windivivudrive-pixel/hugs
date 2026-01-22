import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
    return (
        <section className="relative w-full min-h-screen bg-gray-900 overflow-hidden flex items-center">
            {/* Background Video */}
            <div className="absolute inset-0 w-full h-full">
                <video
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src="https://mltmwwywqhehrjwrrxks.supabase.co/storage/v1/object/public/hugs/video/Screen%20Recording%202026-01-22%20at%2010.23.07%20AM.mov" type="video/mp4" />
                </video>
                {/* Dark Overlay for text readability */}
                <div className="absolute inset-0 bg-black/50" />
            </div>

            <div className="max-w-7xl mx-auto px-6 w-full relative z-10 py-20 text-center flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-block bg-white/10 backdrop-blur-md text-white px-6 py-2 rounded-full text-sm font-semibold mb-8 border border-white/20">
                        🚀 Đối tác TikTok Shop đầu tiên tại Miền Trung
                    </span>
                </motion.div>

                <motion.h1
                    className="text-5xl lg:text-7xl font-black text-white mb-8 leading-tight tracking-tight"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    Truyền thông <br />
                    <span className="text-brand-pink drop-shadow-lg">Mạng xã hội</span> <br />
                    hàng đầu
                </motion.h1>

                <motion.p
                    className="text-gray-200 mb-10 max-w-2xl leading-relaxed text-lg lg:text-xl font-light"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    HUGs Agency là ngôi nhà chung của những người trẻ yêu truyền thông, có kinh nghiệm làm việc tại các client, agency lớn nhỏ trên cả nước.
                </motion.p>


            </div>
        </section>
    );
};