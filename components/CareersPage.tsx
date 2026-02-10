import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Briefcase, Send, Upload, ChevronDown, AlertCircle } from 'lucide-react';
import { FooterSection } from './FooterSection';
import { PageNavbar } from './PageNavbar';
import {
    checkRateLimit,
    recordSubmission,
    validateHoneypot,
    submitToGoogleForm,
    validateFileSize,
    RECRUITMENT_FORM_CONFIG,
} from '../lib/formUtils';
import { uploadCV } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

export const CareersPage: React.FC = () => {
    const { t } = useLanguage();
    const formRef = useRef<HTMLDivElement>(null);
    const [expandedJobId, setExpandedJobId] = useState<number | null>(null);

    const jobPositions = [
        {
            id: 1,
            title: t('careers.jobs.contentCreator.title'),
            location: t('careers.attributes.locations.hcm'),
            type: t('careers.attributes.types.fullTime'),
            level: t('careers.attributes.levels.junior'),
            active: true,
            description: t('careers.jobs.contentCreator.description'),
            fullDescription: t('careers.jobs.contentCreator.fullDescription')
        },
        {
            id: 2,
            title: t('careers.jobs.graphicDesigner.title'),
            location: t('careers.attributes.locations.hcm'),
            type: t('careers.attributes.types.fullTime'),
            level: t('careers.attributes.levels.senior'),
            active: true,
            description: t('careers.jobs.graphicDesigner.description'),
            fullDescription: t('careers.jobs.graphicDesigner.fullDescription')
        },
        {
            id: 3,
            title: t('careers.jobs.videoEditor.title'),
            location: t('careers.attributes.locations.hcm_remote'),
            type: t('careers.attributes.types.partTime'),
            level: t('careers.attributes.levels.junior'),
            active: false,
            description: t('careers.jobs.videoEditor.description'),
            fullDescription: t('careers.jobs.videoEditor.fullDescription')
        },
        {
            id: 4,
            title: t('careers.jobs.accountExecutive.title'),
            location: t('careers.attributes.locations.hcm'),
            type: t('careers.attributes.types.fullTime'),
            level: t('careers.attributes.levels.middle'),
            active: true,
            description: t('careers.jobs.accountExecutive.description'),
            fullDescription: t('careers.jobs.accountExecutive.fullDescription')
        },
        {
            id: 5,
            title: t('careers.jobs.socialIntern.title'),
            location: t('careers.attributes.locations.hcm'),
            type: t('careers.attributes.types.internship'),
            level: t('careers.attributes.levels.intern'),
            active: true,
            description: t('careers.jobs.socialIntern.description'),
            fullDescription: t('careers.jobs.socialIntern.fullDescription')
        },
    ];

    const [formData, setFormData] = useState({
        position: '',
        fullName: '',
        email: '',
        phone: '',
        portfolio: '',
        message: '',
        honeypot: '', // Anti-spam honeypot field
    });
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const scrollToForm = (positionTitle: string) => {
        setFormData(prev => ({ ...prev, position: positionTitle }));
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (submitError) setSubmitError(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Validate file size (10MB max)
            if (!validateFileSize(file, 10)) {
                setSubmitError(t('careers.form.errors.fileSize'));
                return;
            }

            setCvFile(file);
            setSubmitError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);

        // Validate honeypot (anti-spam)
        if (!validateHoneypot(formData.honeypot)) {
            console.log('Spam detected');
            return;
        }

        // Check rate limit
        if (!checkRateLimit('recruitment')) {
            setSubmitError(t('careers.form.errors.rateLimit'));
            return;
        }

        // Validate required fields
        if (!formData.fullName || !formData.email || !formData.phone) {
            setSubmitError(t('careers.form.errors.required'));
            return;
        }

        // Validate CV file
        if (!cvFile) {
            setSubmitError(t('careers.form.errors.noCV'));
            return;
        }

        setIsSubmitting(true);

        try {
            // Step 1: Upload CV to Supabase
            const { url: cvUrl, error: uploadError } = await uploadCV(cvFile);

            if (uploadError || !cvUrl) {
                setSubmitError(t('careers.form.errors.uploadFailed'));
                setIsSubmitting(false);
                return;
            }

            // Step 2: Submit form data with CV URL to Google Form
            const result = await submitToGoogleForm(RECRUITMENT_FORM_CONFIG, {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                position: formData.position,
                portfolio: formData.portfolio,
                cvUrl: cvUrl, // Supabase URL for the CV
                message: formData.message,
            });

            if (result.success) {
                // Record submission for rate limiting
                recordSubmission('recruitment');
                setSubmitSuccess(true);

                // Reset form after 3 seconds
                setTimeout(() => {
                    setSubmitSuccess(false);
                    setFormData({
                        position: '',
                        fullName: '',
                        email: '',
                        phone: '',
                        portfolio: '',
                        message: '',
                        honeypot: '',
                    });
                    setCvFile(null);
                }, 3000);
            } else {
                setSubmitError(result.message || t('careers.form.errors.generic'));
            }
        } catch (error) {
            console.error('Submit error:', error);
            setSubmitError(t('careers.form.errors.generic'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Navbar */}
            <PageNavbar activePage="careers" />

            {/* Hero Section */}
            <section className="pt-32 pb-16 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-2 bg-brand-pink/10 text-brand-pink rounded-full text-sm font-semibold mb-6">
                            {t('careers.badge')}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black mb-6">
                            {t('careers.title')}<br />
                            <span className="text-brand-pink">{t('careers.titleHighlight')}</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {t('careers.description')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Job Listings */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">
                        {t('careers.openPositions')} ({jobPositions.filter(j => j.active).length})
                    </h2>

                    <div className="space-y-4">
                        {jobPositions.map((job, index) => {
                            const isExpanded = expandedJobId === job.id;
                            const isActive = job.active;

                            return (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className={`bg-white border overflow-hidden transition-all duration-300 ${isExpanded
                                        ? 'border-brand-pink shadow-lg shadow-brand-pink/10'
                                        : 'border-gray-200 hover:border-brand-pink hover:shadow-lg'
                                        } ${!isActive ? 'opacity-50 grayscale bg-gray-50' : ''}`}
                                >
                                    {/* Clickable Header */}
                                    <div
                                        onClick={() => isActive && setExpandedJobId(isExpanded ? null : job.id)}
                                        className={`p-6 ${isActive ? 'cursor-pointer group' : 'cursor-not-allowed'}`}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-4 flex-wrap">
                                                <h3 className={`text-xl font-bold transition-colors ${isActive
                                                    ? (isExpanded ? 'text-brand-pink' : 'text-gray-900 group-hover:text-brand-pink')
                                                    : 'text-gray-500'
                                                    }`}>
                                                    {job.title}
                                                </h3>

                                                {/* Read-only Toggle Switch */}
                                                <div className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-default rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-pink focus:ring-offset-2 ${isActive ? 'bg-brand-pink' : 'bg-gray-200'}`}>
                                                    <span
                                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? 'translate-x-5' : 'translate-x-0'}`}
                                                    />
                                                </div>

                                                {/* Status Badge */}
                                                {isActive ? (
                                                    <span className="inline-block px-3 py-1 rounded-full border border-brand-pink text-brand-pink text-xs font-bold leading-none">
                                                        {t('careers.status.active')}
                                                    </span>
                                                ) : (
                                                    <span className="inline-block px-3 py-1 rounded-full border border-gray-300 text-gray-400 text-xs font-bold leading-none">
                                                        {t('careers.status.closed')}
                                                    </span>
                                                )}
                                            </div>

                                            {isActive && (
                                                <motion.div
                                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <ChevronDown
                                                        size={24}
                                                        className={`transition-colors ${isExpanded ? 'text-brand-pink' : 'text-gray-400'
                                                            }`}
                                                    />
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* Job Details Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <span className="text-xs text-gray-500 uppercase tracking-wide">{t('careers.labels.location')}</span>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <MapPin size={14} className="text-gray-400" />
                                                    <span className="text-sm text-gray-700">{job.location}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-500 uppercase tracking-wide">{t('careers.labels.type')}</span>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Clock size={14} className="text-gray-400" />
                                                    <span className="text-sm text-gray-700">{job.type}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-500 uppercase tracking-wide">{t('careers.labels.level')}</span>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Briefcase size={14} className="text-gray-400" />
                                                    <span className="text-sm text-gray-700">{job.level}</span>
                                                </div>
                                            </div>
                                            <div className="hidden md:block">
                                                <span className="text-xs text-gray-500 uppercase tracking-wide">{t('careers.labels.description')}</span>
                                                <p className="text-sm text-gray-700 mt-1 line-clamp-1">{job.description}</p>
                                            </div>
                                        </div>

                                        {/* Expand hint when collapsed */}
                                        {!isExpanded && isActive && (
                                            <div className="mt-4 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-sm text-brand-pink font-medium">
                                                    {t('careers.clickDetail')}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Expandable Content */}
                                    <AnimatePresence>
                                        {isExpanded && isActive && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-6 pb-6">
                                                    {/* Divider */}
                                                    <div className="border-t border-gray-200 pt-6">
                                                        {/* Full Description */}
                                                        <div
                                                            className="prose prose-sm max-w-none text-gray-700 
                                                                [&_h4]:text-base [&_h4]:font-bold [&_h4]:text-gray-900 [&_h4]:mt-4 [&_h4]:mb-2 [&_h4]:first:mt-0
                                                                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1
                                                                [&_li]:text-gray-600"
                                                            dangerouslySetInnerHTML={{ __html: job.fullDescription }}
                                                        />

                                                        {/* Apply Button */}
                                                        <motion.button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                scrollToForm(job.title);
                                                            }}
                                                            className="mt-6 w-full md:w-auto bg-brand-pink text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                        >
                                                            <Send size={18} />
                                                            {t('careers.applyButton')}
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Application Form */}
            <section ref={formRef} className="py-20 bg-gray-50">
                <div className="max-w-3xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-black text-gray-900 mb-2 text-center">
                            {t('careers.form.title')}
                        </h2>
                        <p className="text-gray-600 text-center mb-8">
                            {t('careers.form.subtitle')}
                        </p>

                        {submitSuccess ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-green-50 border border-green-200 p-8 text-center"
                            >
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Send className="text-green-600" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-green-800 mb-2">
                                    {t('careers.form.successTitle')}
                                </h3>
                                <p className="text-green-700">
                                    {t('careers.form.successMsg')}
                                </p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="bg-white shadow-lg p-8 space-y-6">
                                {/* Honeypot - hidden anti-spam field */}
                                <input
                                    type="text"
                                    name="honeypot"
                                    value={formData.honeypot}
                                    onChange={handleInputChange}
                                    className="absolute -left-[9999px]"
                                    tabIndex={-1}
                                    autoComplete="off"
                                />

                                {/* Error Message */}
                                {submitError && (
                                    <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                        <AlertCircle size={20} />
                                        <span className="font-medium">{submitError}</span>
                                    </div>
                                )}

                                {/* Position */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('careers.form.position')}
                                    </label>
                                    <select
                                        name="position"
                                        value={formData.position}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="">Chọn vị trí</option>
                                        {jobPositions.map(job => (
                                            <option key={job.id} value={job.title}>{job.title}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Name & Email */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('careers.form.name')}
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Nguyễn Văn A"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('careers.form.email')}
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="email@example.com"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Phone & Portfolio */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('careers.form.phone')}
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="0901 234 567"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('careers.form.portfolio')}
                                        </label>
                                        <input
                                            type="url"
                                            name="portfolio"
                                            value={formData.portfolio}
                                            onChange={handleInputChange}
                                            placeholder="https://..."
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* CV Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('careers.form.cv')}
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-pink transition-colors">
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="cv-upload"
                                            required={!cvFile}
                                        />
                                        <label htmlFor="cv-upload" className="cursor-pointer">
                                            <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                                            {cvFile ? (
                                                <span className="text-brand-pink font-medium">{cvFile.name}</span>
                                            ) : (
                                                <span className="text-gray-500">
                                                    {t('careers.form.cvHint')} <span className="text-brand-pink font-medium">{t('careers.form.cvChoose')}</span>
                                                    <br />
                                                    <span className="text-xs">{t('careers.form.cvFormat')}</span>
                                                </span>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('careers.form.message')}
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={4}
                                        placeholder={t('careers.form.messagePlaceholder')}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none transition-all resize-none"
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-brand-pink text-white py-4 rounded-lg font-bold text-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            {t('common.loading')}
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            {t('careers.applyButton')}
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <FooterSection hideCTA />
        </div>
    );
};
