import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Facebook } from 'lucide-react';

// TikTok icon component (lucide-react doesn't have TikTok, so we'll use a simple SVG)
const TikTokIcon = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
);

// Social media pages data
const socialPages = [
    {
        name: "Đà Nẵng 24h",
        description: "Cập nhật tin tức Đà Nẵng 24/7, những câu chuyện thường nhật và sự kiện nổi bật của thành phố đáng sống.",
        image: "/logo-partner/social1.jpg",
        link: "https://www.facebook.com/share/1AsVvrcPeC/?mibextid=wwXIfr"
    },
    {
        name: "Đà Nẵng News",
        description: "Tin tức chính thống, cập nhật nhanh chóng về mọi mặt đời sống xã hội tại Đà Nẵng.",
        image: "/logo-partner/social2.jpg",
        link: "https://www.facebook.com/danangnews2025"
    },
    {
        name: "Đà Nẵng",
        description: "Trang cộng đồng chia sẻ vẻ đẹp, văn hóa và con người Đà Nẵng đến bạn bè khắp nơi.",
        image: "/logo-partner/social3.jpg",
        link: "https://www.facebook.com/Danang2019"
    },
    {
        name: "Đà Nẵng Ơi",
        description: "Nơi kết nối cộng đồng Đà Nẵng, chia sẻ những điều hay, ý đẹp của thành phố biển.",
        image: "/logo-partner/social4.jpg",
        link: "https://www.facebook.com/share/1GkxWw2P2T/?mibextid=wwXIfr"
    },
    {
        name: "Chuyện Của Đà Nẵng",
        description: "Góc nhìn đa chiều về cuộc sống, con người và những câu chuyện thú vị tại Đà Nẵng.",
        image: "/logo-partner/social5.jpg",
        link: "https://www.facebook.com/share/1A9GFFTkT3/?mibextid=wwXIfr"
    },
    {
        name: "Review Đà Nẵng",
        description: "Review chân thật về ẩm thực, du lịch và dịch vụ tại Đà Nẵng từ cộng đồng.",
        image: "/logo-partner/social6.jpg",
        link: "https://www.facebook.com/share/1HTgqsfm5N/?mibextid=wwXIfr"
    },
    {
        name: "Check In Đà Nẵng",
        description: "Khám phá những địa điểm check-in hot nhất, đẹp nhất tại thành phố Đà Nẵng.",
        image: "/logo-partner/social7.jpg",
        link: "https://www.facebook.com/share/1BPvveuY8o/?mibextid=wwXIfr"
    },
    {
        name: "Hóng Biến Đà Nẵng",
        description: "Cập nhật nhanh những tin tức nóng hổi, sự kiện đang được quan tâm tại Đà Nẵng.",
        image: "/logo-partner/social8.jpg",
        link: "https://www.facebook.com/share/1GJa8BLRqw/?mibextid=wwXIfr"
    },
    // Facebook Groups
    {
        name: "Đà Nẵng Riviu Tất Tần Tật",
        description: "Group review mọi thứ tại Đà Nẵng - từ ẩm thực, dịch vụ đến du lịch.",
        image: "/logo-partner/g3.png",
        link: "https://www.facebook.com/share/g/1Co66mr7ew/?mibextid=wwXIfr"
    },
    {
        name: "Cộng Đồng Marketing Đà Nẵng",
        description: "Kết nối dân Marketing tại Đà Nẵng, chia sẻ kiến thức và cơ hội nghề nghiệp.",
        image: "/logo-partner/g2.png",
        link: "https://www.facebook.com/share/g/17qV81uYei/?mibextid=wwXIfr"
    },
    {
        name: "Việc Làm Đà Nẵng",
        description: "Cầu nối tuyển dụng và tìm việc làm uy tín tại Đà Nẵng.",
        image: "/logo-partner/g1.png",
        link: "https://www.facebook.com/share/g/19ZU33mMtG/?mibextid=wwXIfr"
    },
    // TikTok Pages
    {
        name: "Mê Miền Trung",
        description: "Khám phá vẻ đẹp miền Trung qua những video ngắn hấp dẫn trên TikTok.",
        image: "/logo-partner/t0.png",
        link: "https://www.tiktok.com/@memientrung?_r=1&_t=ZS-9260qu7Bs0Y"
    },
    {
        name: "Ăn Sập Đà Nẵng",
        description: "Food tour Đà Nẵng cùng những video ẩm thực hấp dẫn trên TikTok.",
        image: "/logo-partner/t1.png",
        link: "https://www.tiktok.com/@ansapdanang.official?_r=1&_t=ZS-9260mWMWn7y"
    },
    {
        name: "Ở Đà Nẵng",
        description: "Cuộc sống thường ngày tại Đà Nẵng qua góc nhìn TikToker.",
        image: "/logo-partner/t2.png",
        link: "https://www.tiktok.com/@odanang43?_r=1&_t=ZS-9260hTB2fZf"
    },
    {
        name: "Đà Nẵng News",
        description: "Tin tức Đà Nẵng cập nhật nhanh nhất trên nền tảng TikTok.",
        image: "/logo-partner/t3.png",
        link: "https://www.tiktok.com/@ansapdanang.official?_r=1&_t=ZS-9260mWMWn7y"
    },
    {
        name: "Đà Nẵng",
        description: "Trang TikTok chính thức về thành phố Đà Nẵng xinh đẹp.",
        image: "/logo-partner/t4.png",
        link: "https://www.tiktok.com/@danang_city?_r=1&_t=ZS-9260eKY9qae"
    }
];

export const SocialSection: React.FC = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [direction, setDirection] = useState<'right' | 'left'>('right');
    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const isManualScrolling = useRef(false);
    const manualScrollTimeout = useRef<NodeJS.Timeout | null>(null);

    // Auto-scroll effect
    useEffect(() => {
        if (isManualScrolling.current || !scrollContainerRef.current) return;

        const container = scrollContainerRef.current;
        const scrollSpeed = 1; // pixels per frame
        const interval = setInterval(() => {
            if (isManualScrolling.current) return; // Skip if manual scroll is active

            if (direction === 'right') {
                container.scrollLeft += scrollSpeed;
                // Check if reached the end
                if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
                    setDirection('left');
                }
            } else {
                container.scrollLeft -= scrollSpeed;
                // Check if reached the start
                if (container.scrollLeft <= 0) {
                    setDirection('right');
                }
            }
        }, 16); // ~60fps

        return () => clearInterval(interval);
    }, [direction]);

    const scroll = (dir: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            // Pause auto-scroll
            isManualScrolling.current = true;

            // Clear existing timeout
            if (manualScrollTimeout.current) {
                clearTimeout(manualScrollTimeout.current);
            }

            const scrollAmount = 800; // Increased for faster, more noticeable scroll
            scrollContainerRef.current.scrollBy({
                left: dir === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });

            // Resume auto-scroll after 500ms
            manualScrollTimeout.current = setTimeout(() => {
                isManualScrolling.current = false;
            }, 500);
        }
    };

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (!scrollContainerRef.current) return;
        isManualScrolling.current = true; // Pause auto-scroll during drag
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
        setTimeout(() => {
            setIsDragging(false);
            isManualScrolling.current = false; // Resume auto-scroll after drag
        }, 100);
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
        <section className="py-16 relative overflow-hidden bg-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <img
                    src="/pattern1.png"
                    alt=""
                    className="w-full h-full object-cover opacity-20"
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* Left side - Title and description */}
                    <motion.div
                        className="lg:col-span-4"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-block bg-brand-pink/10 text-brand-pink px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            Mạng lưới
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight mb-6">
                            Hệ sinh thái <span className="text-brand-pink">HUGs Network</span>
                        </h2>
                        <p className="text-gray-600 text-lg lg:text-xl leading-relaxed mb-8">
                            HUGs Network là hệ sinh thái các fanpage & group chủ đề Đà Nẵng và khu vực miền Trung, được vận hành bởi HUGs Agency,
                            giúp kết nối thương hiệu với tệp người dùng địa phương thông qua tương tác tự nhiên và lan tỏa nội dung hiệu quả.

                        </p>
                    </motion.div>

                    {/* Right side - Horizontal scrolling cards */}
                    <div className="lg:col-span-8 -mr-6 lg:-mr-[calc((100vw-1280px)/2+24px)]">
                        <div
                            ref={scrollContainerRef}
                            className="flex gap-6 overflow-x-scroll py-8 pr-6"
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
                                    className="social-card flex-shrink-0 w-56 md:w-72 bg-white border-2 border-brand-pink p-4 md:p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-brand-pink/20 hover:-translate-y-1 cursor-pointer flex flex-col"
                                    style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
                                    onClick={() => !isDragging && window.open(page.link, '_blank')}
                                >
                                    {/* Logo image - ROUNDED with platform badge */}
                                    <div className="relative w-14 h-14 md:w-20 md:h-20 mb-4 md:mb-6 mx-auto">
                                        <div className="w-full h-full rounded-full overflow-hidden border-2 border-brand-pink">
                                            <img
                                                src={page.image}
                                                alt={page.name}
                                                loading="lazy"
                                                className="w-full h-full object-cover"
                                                draggable={false}
                                            />
                                        </div>
                                        {/* Platform badge */}
                                        <div className={`absolute bottom-0 right-0 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-white ${page.link.includes('tiktok') ? 'bg-black' : 'bg-blue-600'}`}>
                                            {page.link.includes('tiktok') ? (
                                                <TikTokIcon size={14} />
                                            ) : (
                                                <Facebook size={14} fill="white" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 md:mb-3 text-center">
                                        {page.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-4 md:mb-6 text-center flex-grow">
                                        {page.description}
                                    </p>

                                    {/* CTA Link */}
                                    <a
                                        href={page.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 text-brand-pink font-bold text-base hover:gap-3 transition-all mt-auto"
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

                {/* Navigation arrows - BOTTOM CENTER */}
                <div className="flex items-center justify-center gap-3 mt-8">
                    <button
                        onClick={() => scroll('left')}
                        className="w-12 h-12 rounded-full border-2 border-brand-pink bg-brand-pink flex items-center justify-center text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-brand-pink/90 active:scale-95"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-12 h-12 rounded-full border-2 border-brand-pink bg-brand-pink flex items-center justify-center text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-brand-pink/90 active:scale-95"
                    >
                        <ChevronRight size={24} />
                    </button>
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
