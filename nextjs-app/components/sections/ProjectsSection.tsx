'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { fetchAllArticles } from '@/lib/actions-client';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProjectsSectionProps {
    initialProjects?: any[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ initialProjects = [] }) => {
    const { t } = useLanguage();

    // Filter and slice helper to display only up to 6 featured/fallback projects
    const getFilteredProjects = (all: any[]) => {
        if (!all || all.length === 0) return [];
        const featured = all.filter((p: any) => p.featured);
        return featured.length > 0 ? featured.slice(0, 6) : all.slice(0, 6);
    };

    const [projects, setProjects] = useState<any[]>(() => getFilteredProjects(initialProjects));
    const [loading, setLoading] = useState(initialProjects.length === 0);
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
        if (initialProjects.length > 0) {
            setProjects(getFilteredProjects(initialProjects));
            setLoading(false);
            return;
        }
        const loadProjects = async () => {
            try {
                setLoading(true);
                const all = await fetchAllArticles();
                setProjects(getFilteredProjects(all));
            } catch (err) {
                console.error('Error fetching projects:', err);
            } finally {
                setLoading(false);
            }
        };

        loadProjects();
    }, [initialProjects]);

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
                            {t('projects.badge')}
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-black text-gray-900">
                            {t('projects.title')} <span className="text-brand-pink">{t('projects.titleHighlight')}</span>
                        </h2>
                    </div>
                    <Link href="/allprojects">
                        <motion.div
                            className="mt-4 md:mt-0 text-brand-pink font-semibold flex items-center gap-2 hover:gap-3 transition-all cursor-pointer"
                            whileHover={{ x: 5 }}
                        >
                            {t('projects.viewAll')} <ArrowRight size={18} />
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
                        <p className="text-gray-500">{t('projects.empty')}</p>
                    </div>
                ) : (
                    /* Precise Proportional Grid Layout - 20 columns (8-5-7, 5-7-8) with 2.4u Row Height */
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-[repeat(20,minmax(0,1fr))] gap-4"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                        }}
                    >
                        {projects.map((project, index) => {
                            const isHovered = hoveredId === project.id;

                            // Define precise layout using 20-column grid (where 2 cols = 1 unit)
                            const getGridStyle = (idx: number) => {
                                const styles = [
                                    { colSpan: 'md:col-span-8', aspect: 'aspect-[5/3]' },     // Item 1: 4.0u
                                    { colSpan: 'md:col-span-5', aspect: 'aspect-[25/24]' },  // Item 2: 2.5u
                                    { colSpan: 'md:col-span-7', aspect: 'aspect-[35/24]' },  // Item 3: 3.5u
                                    { colSpan: 'md:col-span-5', aspect: 'aspect-[25/24]' },  // Item 4: 2.5u
                                    { colSpan: 'md:col-span-7', aspect: 'aspect-[35/24]' },  // Item 5: 3.5u
                                    { colSpan: 'md:col-span-8', aspect: 'aspect-[5/3]' },     // Item 6: 4.0u
                                ];
                                return styles[idx] || { colSpan: '', aspect: 'aspect-[4/3]' };
                            };

                            const gridStyle = getGridStyle(index);

                            // Logic for mobile tap interaction
                            const handleMobileClick = (e: React.MouseEvent) => {
                                if (isMobile && hoveredId !== project.id) {
                                    e.preventDefault(); // Prevent navigation on first tap
                                    setHoveredId(project.id); // Set hover state (show details)
                                }
                            };

                            return (
                                <Link
                                    key={project.id}
                                    href={`/${project.slug}`}
                                    onClick={handleMobileClick}
                                    className={`block relative group overflow-hidden cursor-pointer rounded-xl w-full h-full ${gridStyle.colSpan} ${gridStyle.aspect}`}
                                    onMouseEnter={() => !isMobile && setHoveredId(project.id)}
                                    onMouseLeave={() => !isMobile && setHoveredId(null)}
                                >
                                    <motion.div
                                        className="w-full h-full relative"
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: { opacity: 1, y: 0 }
                                        }}
                                    >
                                        {/* Project Thumbnail - optimized next/image with transition scale */}
                                        <div className="absolute inset-0 w-full h-full overflow-hidden">
                                            <Image
                                                src={project.thumbnail || `https://picsum.photos/600/600?random=${project.id}`}
                                                alt={project.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover"
                                                style={{
                                                    transition: 'transform 0.5s ease-in-out',
                                                    transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                                                }}
                                                priority={index < 2} // Preload above-the-fold project items
                                            />
                                        </div>

                                        {/* Transparent Pink Overlay - visible by default, fades on hover */}
                                        <div
                                            className="absolute inset-0 bg-brand-pink/35"
                                            style={{
                                                opacity: isHovered ? 0 : 1,
                                                transition: 'opacity 0.4s ease-in-out'
                                            }}
                                        />

                                        {/* Logo or Project Title - white by default, original color on hover */}
                                        <div
                                            className="absolute inset-0 flex items-center justify-center z-10 p-4"
                                        >
                                            {project.logo ? (
                                                <div
                                                    className="w-32 h-16 md:w-40 md:h-20 relative"
                                                    style={{
                                                        filter: isHovered ? 'none' : 'brightness(0) invert(1)',
                                                        transition: 'all 0.4s ease-in-out',
                                                        transform: isHovered ? 'scale(1.1) translateY(-15px)' : 'scale(1) translateY(0)'
                                                    }}
                                                >
                                                    <Image
                                                        src={project.logo}
                                                        alt={project.title}
                                                        fill
                                                        sizes="(max-width: 768px) 8rem, 10rem"
                                                        className="object-contain drop-shadow-lg"
                                                    />
                                                </div>
                                            ) : (
                                                <h3
                                                    className="text-center font-black leading-tight drop-shadow-lg px-4 max-w-[80%]"
                                                    style={{
                                                        color: '#fff',
                                                        fontSize: project.title.length > 30 ? '1rem' : project.title.length > 20 ? '1.25rem' : '1.5rem',
                                                        textShadow: isHovered ? '0 2px 8px rgba(0,0,0,0.6)' : '0 2px 4px rgba(0,0,0,0.3)',
                                                        transition: 'all 0.4s ease-in-out',
                                                        transform: isHovered ? 'scale(1.05) translateY(-15px)' : 'scale(1) translateY(0)'
                                                    }}
                                                >
                                                    {project.title}
                                                </h3>
                                            )}
                                        </div>

                                        {/* Bottom content - visible on hover */}
                                        <div
                                            className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-center flex flex-col items-center z-10"
                                            style={{
                                                opacity: isHovered ? 1 : 0,
                                                transform: isHovered ? 'translateY(0)' : 'translateY(16px)',
                                                transition: 'all 0.4s ease-in-out'
                                            }}
                                        >
                                            <h3
                                                className="text-white font-semibold text-sm md:text-base leading-tight mb-2 line-clamp-2"
                                                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                                            >
                                                {project.title}
                                            </h3>
                                            <span
                                                className="px-4 py-2 text-white font-medium text-xs tracking-wider uppercase flex items-center gap-1.5"
                                                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                                            >
                                                {t('projects.viewDetail')}
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
        </section >
    );
};