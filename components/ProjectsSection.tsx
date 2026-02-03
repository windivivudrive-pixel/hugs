import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { supabase, ServiceArticle } from '../lib/supabase';
import { Link } from 'react-router-dom';

// Fixed masonry layout for exactly 8 items to match the "bento" style
// Columns: 4
// Row Height: 240px (Tall enough for text)
// Pattern leverages CSS Grid auto-placement to fill holes
const masonryConfig = [
    { rowSpan: 1 }, // Item 1: Big (Fills Col 1)
    { rowSpan: 2 }, // Item 2: Big (Fills Col 2)
    { rowSpan: 1 }, // Item 3: Small (Fills Col 3 Top)
    { rowSpan: 2 }, // Item 4: Big (Fills Col 4)
    { rowSpan: 2 }, // Item 5: Big (Fills Col 3 Bottom - finding the gap)
    { rowSpan: 2 }, // Item 6: Small (Fills Col 1 Bottom)
    { rowSpan: 1 }, // Item 7: Small (Fills Col 2 Bottom)
    { rowSpan: 1 }, // Item 8: Small (Fills Col 4 Bottom)
];

export const ProjectsSection: React.FC = () => {
    const [projects, setProjects] = useState<ServiceArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('service_articles')
                    .select('*')
                    .eq('published', true)
                    .order('display_order')
                    .limit(8);

                if (error) throw error;
                setProjects(data || []);
            } catch (err) {
                console.error('Error fetching projects:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <section className="py-24 bg-white relative overflow-hidden">
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
                            Các dự án <span className="text-brand-pink">đã triển khai</span>
                        </h2>
                    </div>
                    <Link to="/allprojects">
                        <motion.div
                            className="mt-4 md:mt-0 text-brand-pink font-semibold flex items-center gap-2 hover:gap-3 transition-all cursor-pointer"
                            whileHover={{ x: 5 }}
                        >
                            Xem tất cả <ArrowRight size={18} />
                        </motion.div>
                    </Link>
                </motion.div>

                {/* Loading state */}
                {loading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Loader2 className="animate-spin text-brand-pink" size={40} />
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                        <p className="text-gray-500">Chưa có dự án nào</p>
                    </div>
                ) : (
                    /* Masonry Grid Layout - manual 8-item config */
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-4 md:auto-rows-[240px] gap-4"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                        }}
                    >
                        {projects.map((project, index) => {
                            // Loop the config if more than 8 items, though limit is 8
                            const config = masonryConfig[index % masonryConfig.length];
                            const isHovered = hoveredId === project.id;

                            // Logic for mobile tap interaction
                            const handleMobileClick = (e: React.MouseEvent) => {
                                if (isMobile && hoveredId !== project.id) {
                                    e.preventDefault(); // Prevent navigation on first tap
                                    setHoveredId(project.id); // Set hover state (show details)
                                }
                                // If already hovered (or on desktop), allow default navigation
                            };

                            return (
                                <Link
                                    key={project.id}
                                    to={`/article?id=${project.id}`}
                                    onClick={handleMobileClick}
                                    className={`block relative group overflow-hidden cursor-pointer ${isMobile ? 'aspect-video' : ''}`}
                                    style={{
                                        gridColumn: 'span 1', // Always single column width
                                        gridRow: isMobile ? 'auto' : `span ${config.rowSpan}`,
                                    }}
                                    onMouseEnter={() => !isMobile && setHoveredId(project.id)}
                                    onMouseLeave={() => !isMobile && setHoveredId(null)}
                                >
                                    <motion.div
                                        className="w-full h-full"
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: { opacity: 1, y: 0 }
                                        }}
                                    >
                                        {/* Project Thumbnail - always visible */}
                                        <img
                                            src={project.thumbnail || `https://picsum.photos/600/600?random=${project.id}`}
                                            alt={project.title}
                                            loading="lazy"
                                            className="absolute inset-0 w-full h-full object-cover"
                                            style={{
                                                transition: 'transform 0.4s ease-in-out',
                                                transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                                            }}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = `https://picsum.photos/600/600?random=${project.id}`;
                                            }}
                                        />

                                        {/* Pink Overlay - 60% opacity by default, fades on hover */}
                                        <div
                                            className="absolute inset-0 bg-brand-pink"
                                            style={{
                                                opacity: isHovered ? 0 : 1,
                                                transition: 'opacity 0.5s ease-in-out'
                                            }}
                                        />

                                        {/* Logo - white by default, moves up on hover */}
                                        <div
                                            className="absolute inset-0 flex items-center justify-center z-10"
                                            style={{
                                                transform: isHovered ? 'translateY(-30px)' : 'translateY(0)',
                                                transition: 'transform 0.4s ease-in-out'
                                            }}
                                        >
                                            <motion.img
                                                src={project.logo || '/logo-hugs-only.png'}
                                                alt={project.title}
                                                className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-lg"
                                                style={{
                                                    filter: 'brightness(0) invert(1)',
                                                    transition: 'filter 0.4s ease-in-out'
                                                }}
                                                whileHover={{ scale: 1.05 }}
                                            />
                                        </div>

                                        {/* Bottom content - visible on hover */}
                                        <div
                                            className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-center flex flex-col items-center"
                                            style={{
                                                opacity: isHovered ? 1 : 0,
                                                transform: isHovered ? 'translateY(0)' : 'translateY(16px)',
                                                transition: 'all 0.4s ease-in-out'
                                            }}
                                        >
                                            <h3 className="text-white font-semibold text-sm md:text-base leading-tight mb-2 line-clamp-2 drop-shadow-lg">
                                                {project.title}
                                            </h3>
                                            <span className="px-4 py-2 bg-white/0 text-white font-medium text-xs tracking-wider uppercase flex items-center gap-1.5 hover:underline transition-all">
                                                Xem chi tiết
                                                <ArrowRight size={16} />
                                            </span>
                                        </div>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </section>
    );
};