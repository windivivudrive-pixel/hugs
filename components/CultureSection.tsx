import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin, Users, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';

export const CultureSection: React.FC = () => {
    const [[page, direction], setPage] = useState([0, 0]);

    const cultureImages = [
        '/logo-partner/team.png',
        'https://picsum.photos/800/600?random=1',
        'https://picsum.photos/800/600?random=2',
        'https://picsum.photos/800/600?random=3',
        'https://picsum.photos/800/600?random=4',
    ];

    const imageIndex = Math.abs(page % cultureImages.length);

    const variants = {
        enter: (direction: number) => {
            return {
                x: direction > 0 ? 1000 : -1000,
                opacity: 0
            };
        },
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => {
            return {
                zIndex: 0,
                x: direction < 0 ? 1000 : -1000,
                opacity: 0
            };
        }
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const paginate = (newDirection: number) => {
        setPage([page + newDirection, newDirection]);
    };

    const prevImage = () => {
        paginate(-1);
    };

    const nextImage = () => {
        paginate(1);
    };
    return (
        <section className="pt-8 lg:pt-12 pb-0 bg-white relative overflow-hidden">
            {/* Subtle background decorations */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gray-50/50 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* First Block - Text Left (2 sections), Image Right */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center mb-20">

                    {/* Left - Content (2 text blocks) */}
                    <motion.div
                        className="order-2 lg:order-1"
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                    >
                        {/* Block 1: Về chúng tôi */}
                        <div className="mb-12">
                            {/* Section label */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-[2px] bg-brand-pink"></div>
                                <span className="text-brand-pink font-semibold text-base uppercase tracking-wider">Về chúng tôi</span>
                            </div>

                            {/* Title */}
                            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-8 leading-tight">
                                HUGs Agency
                            </h2>

                            {/* Description */}
                            <div className="space-y-6 text-gray-900 leading-relaxed">
                                <p className="text-xl">
                                    Sinh ra ở Đà Nẵng. Lớn lên cùng nhịp sống Miền Trung. HUGs là một đội ngũ trẻ, kỷ luật và giàu năng lượng sáng tạo, làm marketing với tư duy định hướng chiến lược và tiêu chuẩn triển khai chuyên nghiệp.
                                </p>
                            </div>
                        </div>

                        {/* Block 2: Tư Duy */}
                        <div className="mb-10">
                            {/* Section label */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-[2px] bg-brand-pink"></div>
                                <span className="text-brand-pink font-semibold text-base uppercase tracking-wider">Tư Duy</span>
                            </div>

                            {/* Description */}
                            <div className="space-y-6 text-gray-900 leading-relaxed">
                                <p className="text-xl">
                                    HUGs không bắt đầu bằng ý tưởng có sẵn. Chúng tôi bắt đầu từ việc hiểu đúng bối cảnh — thị trường, con người và những áp lực tăng trưởng mà thương hiệu đang đối mặt.
                                </p>
                            </div>
                        </div>

                        {/* Core values - icons */}
                        <div className="flex flex-wrap gap-4 mb-10">
                            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
                                <Lightbulb size={18} className="text-brand-pink" />
                                <span className="text-sm font-medium text-gray-700">Tư duy sáng tạo</span>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
                                <MapPin size={18} className="text-brand-pink" />
                                <span className="text-sm font-medium text-gray-700">Local Insight Miền Trung</span>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
                                <Users size={18} className="text-brand-pink" />
                                <span className="text-sm font-medium text-gray-700">30+ Nhân sự</span>
                            </div>
                        </div>

                        {/* CTA */}
                        <motion.button
                            className="group flex items-center gap-3 bg-brand-pink text-white px-8 py-4 rounded-full text-sm font-bold shadow-lg shadow-brand-pink/25 hover:shadow-xl hover:shadow-brand-pink/30 transition-all"
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Khám phá dự án
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </motion.div>

                    {/* Right - Visual with floating badges */}
                    <motion.div
                        className="order-1 lg:order-2 relative lg:-mr-20 lg:scale-125 origin-left"
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                    >
                        {/* Main image */}
                        <div className="relative">
                            <img
                                src="/culture2.png"
                                alt="HUGs Agency Culture"
                                loading="lazy"
                                className="w-full h-auto object-cover"
                            />

                            {/* Stats badge - top right (smaller) */}
                            <motion.div
                                className="absolute -top-2 right-2 bg-brand-pink text-white shadow-lg px-3 py-2 z-20"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                viewport={{ once: true }}
                            >
                                <div className="text-base font-black">2021</div>
                                <div className="text-[10px] opacity-80">Thành lập</div>
                            </motion.div>

                            {/* Location badge - bottom left (smaller) */}
                            <motion.div
                                className="absolute -bottom-2 -left-2 bg-white shadow-lg p-3 z-20"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                viewport={{ once: true }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-brand-pink/10 flex items-center justify-center">
                                        <MapPin className="text-brand-pink" size={16} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">Đà Nẵng</div>
                                        <div className="text-[10px] text-gray-500">Miền Trung, VN</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Second Block - Image Left, Text Right (2 sections) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

                    {/* Left - Image Carousel */}
                    <motion.div
                        className="relative lg:-ml-20 lg:scale-110 origin-right"
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                    >
                        <div className="relative overflow-hidden">
                            <div className="relative w-full aspect-[4/3]">
                                <AnimatePresence initial={false} custom={direction}>
                                    <motion.img
                                        key={page}
                                        src={cultureImages[imageIndex]}
                                        custom={direction}
                                        variants={variants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{
                                            x: { type: "spring", stiffness: 300, damping: 30 },
                                            opacity: { duration: 0.2 }
                                        }}
                                        drag="x"
                                        dragConstraints={{ left: 0, right: 0 }}
                                        dragElastic={1}
                                        onDragEnd={(e, { offset, velocity }) => {
                                            const swipe = swipePower(offset.x, velocity.x);

                                            if (swipe < -swipeConfidenceThreshold) {
                                                paginate(1);
                                            } else if (swipe > swipeConfidenceThreshold) {
                                                paginate(-1);
                                            }
                                        }}
                                        alt={`HUGs Team ${imageIndex + 1}`}
                                        className="absolute inset-0 w-full h-full object-cover cursor-grab active:cursor-grabbing"
                                    />
                                </AnimatePresence>
                            </div>

                            {/* Navigation buttons */}
                            <button
                                onClick={() => paginate(-1)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110 z-10"
                            >
                                <ChevronLeft size={20} className="text-gray-800" />
                            </button>
                            <button
                                onClick={() => paginate(1)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110 z-10"
                            >
                                <ChevronRight size={20} className="text-gray-800" />
                            </button>

                            {/* Dot indicators */}
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                {cultureImages.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setPage([idx, idx > imageIndex ? 1 : -1])}
                                        className={`w-2 h-2 rounded-full transition-all ${idx === imageIndex
                                            ? 'bg-brand-pink w-6'
                                            : 'bg-white/70 hover:bg-white'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right - Content (2 text blocks) */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                    >
                        {/* Block 1: Triển khai */}
                        <div className="mb-12">
                            {/* Section label */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-[2px] bg-brand-pink"></div>
                                <span className="text-brand-pink font-semibold text-base uppercase tracking-wider">Triển Khai</span>
                            </div>

                            {/* Description */}
                            <div className="space-y-4 text-gray-900 leading-relaxed">
                                <p className="text-xl">
                                    Mỗi dự án tại HUGs được xây dựng như một hệ thống. Sáng tạo được dẫn dắt bởi chiến lược, triển khai có kỷ luật và luôn được đo lường để tạo ra hiệu quả thực.
                                </p>
                            </div>
                        </div>

                        {/* Block 2: Giá trị */}
                        <div>
                            {/* Section label */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-[2px] bg-brand-pink"></div>
                                <span className="text-brand-pink font-semibold text-base uppercase tracking-wider">Giá Trị</span>
                            </div>

                            {/* Description */}
                            <div className="space-y-4 text-gray-900 leading-relaxed">
                                <p className="text-xl">
                                    Giữa một thị trường ngày càng ồn ào, chỉ những thương hiệu xuất hiện đúng cách, đúng thời điểm và đủ chiều sâu mới có thể được ghi nhớ và lựa chọn.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};