import React from 'react';
import { motion } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
    const testimonials = [
        {
            name: "Ahamove",
            role: "Director",
            text: "HUGs Agency rất nhiệt tình và hỗ trợ linh hoạt, luôn sẵn lòng hỗ trợ cả vào buổi khuya và cuối tuần. Hy vọng mối quan hệ hợp tác giữa Ahamove và HUGs sẽ tiếp tục phát triển.",
            logo: "/logo-partner/partner0.png"
        },
        {
            name: "Nessa House",
            role: "CEO",
            text: "Nessa House rất vui được đồng hành cùng HUGs Agency trong năm thứ hai. Chúng tôi đánh giá cao sự tận tâm và hiểu biết sâu sắc của đội ngũ HUGs Agency về thị trường miền Trung.",
            logo: "/logo-partner/partner1.png"
        },
        {
            name: "Mai Wedding",
            role: "Brand Manager",
            text: "HUGs Agency không chỉ là đối tác digital marketing mà còn là người bạn đồng hành chiến lược. Sáng tạo và hiểu rõ về khách hàng của chúng tôi.",
            logo: "/logo-partner/partner3.png"
        },
        {
            name: "Vinpearl",
            role: "Marketing Director",
            text: "Đội ngũ HUGs Agency làm việc rất chuyên nghiệp, đảm bảo tiến độ và chất lượng dự án. Sự sáng tạo trong các chiến dịch marketing đã giúp chúng tôi tiếp cận hiệu quả đến khách hàng mục tiêu.",
            logo: "/logo-partner/partner4.png"
        },
        {
            name: "Sun Group",
            role: "Head of Marketing",
            text: "Giải pháp truyền thông toàn diện từ HUGs Agency đã mang lại hiệu quả vượt mong đợi. Chúng tôi rất ấn tượng với khả năng nắm bắt xu hướng và triển khai chiến dịch của team.",
            logo: "/logo-partner/partner2.png"
        }
    ];

    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [width, setWidth] = React.useState(0);
    const sliderRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (sliderRef.current) {
            setWidth(sliderRef.current.scrollWidth - sliderRef.current.offsetWidth);
        }
    }, []);

    // Helper to determine visible items based on screen width (simple approximation)
    // In a real app, use a resize observer or media query hook
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
    const itemsPerPage = isMobile ? 1 : 3;
    const maxIndex = Math.max(0, testimonials.length - itemsPerPage);

    const nextSlide = () => {
        setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative">
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

                {/* Slider Container */}
                <div ref={sliderRef} className="overflow-hidden cursor-grab active:cursor-grabbing relative py-10 -my-10">
                    <motion.div
                        className="flex gap-8 px-4"
                        drag="x"
                        dragConstraints={{ right: 0, left: -(width + 50) }} // Allow some drag past end
                        animate={{ x: -currentIndex * (isMobile ? 100 : 33.33) + '%' }} // Move by percentage
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = offset.x;

                            if (swipe < -50) {
                                nextSlide();
                            } else if (swipe > 50) {
                                prevSlide();
                            }
                        }}
                    >
                        {testimonials.map((item, i) => (
                            <motion.div
                                key={i}
                                className={`min-w-full md:min-w-[calc(33.333%-1.33rem)] bg-white border-2 border-brand-pink p-8 shadow-sm hover:shadow-xl hover:shadow-brand-pink/20 transition-shadow relative flex flex-col group`}
                            >
                                {/* Quote icon */}
                                <div className="absolute -top-4 right-8 w-10 h-10 bg-brand-pink flex items-center justify-center">
                                    <Quote className="text-white" size={16} />
                                </div>

                                {/* Content wrapper */}
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

                                {/* Footer */}
                                <div className="flex items-center gap-4 mt-auto">
                                    <div className="w-16 h-16 bg-gray-50 flex items-center justify-center p-2">
                                        <img
                                            src={item.logo}
                                            alt={item.name}
                                            loading="lazy"
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${item.name}&background=random`;
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
                                        <p className="text-base text-gray-500">{item.role}</p>
                                    </div>

                                    <motion.button
                                        className="ml-auto bg-brand-pink text-white text-xs font-bold px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 hover:bg-brand-pink/90 whitespace-nowrap"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        Xem dự án
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Navigation Arrows (Desktop) */}
                <div className="hidden md:flex justify-between absolute top-1/2 -translate-y-1/2 left-0 right-0 pointer-events-none px-2 w-full max-w-[1320px] mx-auto">
                    <button
                        onClick={prevSlide}
                        disabled={currentIndex === 0}
                        className={`w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-brand-pink pointer-events-auto transition-opacity hover:bg-gray-50 ${currentIndex === 0 ? 'opacity-0 cursor-default' : 'opacity-100'}`}
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextSlide}
                        disabled={currentIndex >= maxIndex}
                        className={`w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-brand-pink pointer-events-auto transition-opacity hover:bg-gray-50 ${currentIndex >= maxIndex ? 'opacity-0 cursor-default' : 'opacity-100'}`}
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* Navigation dots */}
                <div className="flex justify-center gap-2 mt-12">
                    {/* Show visual dots corresponding to scroll position chunks */}
                    {/* We map dots to potential starting positions. For simplicity, just show dots for each possible start index or grouped */}
                    {/* Since we scroll 1 by 1 or view by 3, let's just make dots clickable for each valid starting index */}
                    {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                        <motion.button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`h-3 rounded-full transition-all duration-300 ${currentIndex === i ? 'bg-brand-pink w-8' : 'bg-gray-300 w-3'}`}
                            whileHover={{ scale: 1.2 }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};