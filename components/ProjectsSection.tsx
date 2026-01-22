import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { supabase, ServiceArticle } from '../lib/supabase';

export const ProjectsSection: React.FC = () => {
    const [projects, setProjects] = useState<ServiceArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('service_articles')
                    .select('*')
                    .eq('published', true)
                    .eq('featured', true)
                    .order('display_order')
                    .limit(6);

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
        <section className="py-20 bg-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-pink/5 rounded-full blur-3xl"></div>

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
                            Các dự án <span className="text-brand-pink">nổi bật</span>
                        </h2>
                    </div>
                    <motion.a
                        href="/projects"
                        className="mt-4 md:mt-0 text-brand-pink font-semibold flex items-center gap-2 hover:gap-3 transition-all"
                        whileHover={{ x: 5 }}
                    >
                        Xem tất cả <ArrowRight size={18} />
                    </motion.a>
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
                    /* Grid layout - 2x3 */
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                        }}
                    >
                        {projects.map((project) => (
                            <motion.a
                                key={project.id}
                                href={`/article?id=${project.id}`}
                                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer block"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                            >
                                {/* Background Image */}
                                <motion.img
                                    src={project.thumbnail || `https://picsum.photos/600/600?random=${project.id}`}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.4 }}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://picsum.photos/600/600?random=${project.id}`;
                                    }}
                                />

                                {/* Default overlay - subtle gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity duration-300 group-hover:opacity-0" />

                                {/* Hover overlay - pink */}
                                <div className="absolute inset-0 bg-brand-pink/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Logo - centered */}
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <motion.div
                                        className="w-28 h-28 bg-white rounded-2xl shadow-lg flex items-center justify-center p-4"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <img
                                            src={project.logo || '/logo-hugs-only.png'}
                                            alt={project.title}
                                            className="w-full h-full object-contain"
                                        />
                                    </motion.div>
                                </div>

                                {/* Category Tag - always visible */}
                                {project.category && (
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-full">
                                            {project.category}
                                        </span>
                                    </div>
                                )}

                                {/* Bottom content - visible on hover */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-center flex flex-col items-center">
                                    <h3 className="text-white font-bold text-lg leading-tight mb-3 line-clamp-2">
                                        {project.title}
                                    </h3>
                                    <span className="px-5 py-2 bg-white text-brand-pink font-bold text-sm rounded-full flex items-center gap-2 hover:bg-gray-100 transition-colors">
                                        Xem chi tiết
                                        <ArrowRight size={16} />
                                    </span>
                                </div>
                            </motion.a>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
};