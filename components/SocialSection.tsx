import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

// Social media pages data
const socialPages = [
    {
        name: "Đà Nẵng 24h",
        description: "Cập nhật tin tức Đà Nẵng 24/7, những câu chuyện thường nhật và sự kiện nổi bật của thành phố đáng sống.",
        image: "/logo partner/social1.jpg",
        link: "https://www.facebook.com/share/1AsVvrcPeC/?mibextid=wwXIfr"
    },
    {
        name: "Đà Nẵng News",
        description: "Tin tức chính thống, cập nhật nhanh chóng về mọi mặt đời sống xã hội tại Đà Nẵng.",
        image: "/logo partner/social2.jpg",
        link: "https://www.facebook.com/danangnews2025"
    },
    {
        name: "Đà Nẵng",
        description: "Trang cộng đồng chia sẻ vẻ đẹp, văn hóa và con người Đà Nẵng đến bạn bè khắp nơi.",
        image: "/logo partner/social3.jpg",
        link: "https://www.facebook.com/Danang2019"
    },
    {
        name: "Đà Nẵng Ơi",
        description: "Nơi kết nối cộng đồng Đà Nẵng, chia sẻ những điều hay, ý đẹp của thành phố biển.",
        image: "/logo partner/social4.jpg",
        link: "https://www.facebook.com/share/1GkxWw2P2T/?mibextid=wwXIfr"
    },
    {
        name: "Chuyện Của Đà Nẵng",
        description: "Góc nhìn đa chiều về cuộc sống, con người và những câu chuyện thú vị tại Đà Nẵng.",
        image: "/logo partner/social5.jpg",
        link: "https://www.facebook.com/share/1A9GFFTkT3/?mibextid=wwXIfr"
    },
    {
        name: "Review Đà Nẵng",
        description: "Review chân thật về ẩm thực, du lịch và dịch vụ tại Đà Nẵng từ cộng đồng.",
        image: "/logo partner/social6.jpg",
        link: "https://www.facebook.com/share/1HTgqsfm5N/?mibextid=wwXIfr"
    },
    {
        name: "Check In Đà Nẵng",
        description: "Khám phá những địa điểm check-in hot nhất, đẹp nhất tại thành phố Đà Nẵng.",
        image: "/logo partner/social7.jpg",
        link: "https://www.facebook.com/share/1BPvveuY8o/?mibextid=wwXIfr"
    },
    {
        name: "Hóng Biến Đà Nẵng",
        description: "Cập nhật nhanh những tin tức nóng hổi, sự kiện đang được quan tâm tại Đà Nẵng.",
        image: "/logo partner/social8.jpg",
        link: "https://www.facebook.com/share/1GJa8BLRqw/?mibextid=wwXIfr"
    }
];

export const SocialSection: React.FC = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (!scrollContainerRef.current) return;
        isDown.current = true;
        startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
        scrollLeft.current = scrollContainerRef.current.scrollLeft;
        scrollContainerRef.current.style.cursor = 'grabbing';
    }, []);

    const handleMouseLeave = useCallback(() => {
        isDown.current = false;
        if (scrollContainerRef.current) {
            scrollContainerRef.current.style.cursor = 'grab';
        }
        setIsDragging(false);
    }, []);

    const handleMouseUp = useCallback(() => {
        isDown.current = false;
        if (scrollContainerRef.current) {
            scrollContainerRef.current.style.cursor = 'grab';
        }
        setTimeout(() => setIsDragging(false), 0);
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDown.current || !scrollContainerRef.current) return;
        e.preventDefault();
        setIsDragging(true);
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX.current) * 1;
        scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
    }, []);

    return (
        <section className="py-20 relative overflow-hidden" style={{ background: '#f5f5f5' }}>
            {/* Background pattern */}
            <div
                className="absolute inset-0 opacity-30 pointer-events-none z-0"
                style={{
                    backgroundImage: 'url(/pattern.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Left side - Title and description */}
                    <motion.div
                        className="lg:col-span-4"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6">
                            Hệ sinh thái<br />
                            <span className="text-brand-pink">HUGE Network</span>
                        </h2>
                        <p className="text-gray-600 text-base leading-relaxed mb-8">
                            HUGE Network mang tới một hệ sinh thái phong phú, trải dài các mảng nội dung,
                            cộng đồng góp phần vào sự phát triển mạnh mẽ của truyền thông internet tại Việt Nam.
                        </p>

                        {/* Navigation arrows */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => scroll('left')}
                                className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-brand-pink hover:text-brand-pink transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-brand-pink hover:text-brand-pink transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </motion.div>

                    {/* Right side - Horizontal scrolling cards */}
                    <div className="lg:col-span-8 -mr-6 lg:-mr-[calc((100vw-1280px)/2+24px)]">
                        <div
                            ref={scrollContainerRef}
                            className="flex gap-6 overflow-x-scroll pb-4 pr-6 pt-4"
                            style={{
                                cursor: 'grab',
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                WebkitOverflowScrolling: 'touch'
                            }}
                            onMouseDown={handleMouseDown}
                            onMouseLeave={handleMouseLeave}
                            onMouseUp={handleMouseUp}
                            onMouseMove={handleMouseMove}
                        >
                            {socialPages.map((page, index) => (
                                <div
                                    key={index}
                                    className="social-card flex-shrink-0 w-72 bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col"
                                    style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
                                    onClick={() => !isDragging && window.open(page.link, '_blank')}
                                >
                                    {/* Logo image */}
                                    <div className="w-20 h-20 rounded-full overflow-hidden mb-6 mx-auto border-4 border-brand-pink/20">
                                        <img
                                            src={page.image}
                                            alt={page.name}
                                            className="w-full h-full object-cover"
                                            draggable={false}
                                        />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
                                        {page.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 text-center flex-grow">
                                        {page.description}
                                    </p>

                                    {/* CTA Link */}
                                    <a
                                        href={page.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 text-brand-pink font-semibold text-sm hover:gap-3 transition-all mt-auto"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (isDragging) e.preventDefault();
                                        }}
                                    >
                                        Khám phá <ArrowRight size={16} />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hide scrollbar CSS */}
            <style>{`
                div::-webkit-scrollbar {
                    display: none;
                }
                .social-card {
                    user-select: none;
                }
            `}</style>
        </section>
    );
};
