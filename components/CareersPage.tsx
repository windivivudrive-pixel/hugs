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

// Sample job positions data
const jobPositions = [
    {
        id: 1,
        title: 'Content Creator',
        location: 'Hồ Chí Minh',
        type: 'Full-time',
        level: 'Junior',
        active: true,
        description: 'Sáng tạo nội dung cho các kênh social media của khách hàng.',
        fullDescription: `
            <h4>Mô tả công việc:</h4>
            <ul>
                <li>Sáng tạo nội dung text, hình ảnh, video cho các kênh social media (Facebook, Instagram, TikTok)</li>
                <li>Nghiên cứu xu hướng và đề xuất ý tưởng content mới</li>
                <li>Phối hợp với team design để tạo ra các ấn phẩm truyền thông chất lượng</li>
                <li>Theo dõi và phân tích hiệu quả content</li>
            </ul>
            <h4>Yêu cầu:</h4>
            <ul>
                <li>Đam mê sáng tạo nội dung, cập nhật xu hướng</li>
                <li>Có khả năng viết lách tốt</li>
                <li>Biết sử dụng Canva, CapCut là lợi thế</li>
                <li>Có kinh nghiệm làm content là một cộng</li>
            </ul>
            <h4>Quyền lợi:</h4>
            <ul>
                <li>Mức lương: 8-12 triệu VNĐ</li>
                <li>Được đào tạo và phát triển kỹ năng</li>
                <li>Môi trường làm việc năng động, sáng tạo</li>
            </ul>
        `
    },
    {
        id: 2,
        title: 'Graphic Designer',
        location: 'Hồ Chí Minh',
        type: 'Full-time',
        level: 'Senior',
        active: true,
        description: 'Thiết kế ấn phẩm truyền thông, branding cho các dự án lớn.',
        fullDescription: `
            <h4>Mô tả công việc:</h4>
            <ul>
                <li>Thiết kế ấn phẩm truyền thông cho các chiến dịch marketing</li>
                <li>Xây dựng và phát triển bộ nhận diện thương hiệu cho khách hàng</li>
                <li>Tham gia brainstorm ý tưởng sáng tạo cho các dự án</li>
                <li>Hướng dẫn và hỗ trợ các designer junior</li>
            </ul>
            <h4>Yêu cầu:</h4>
            <ul>
                <li>Tối thiểu 3 năm kinh nghiệm thiết kế đồ họa</li>
                <li>Thành thạo Adobe Creative Suite (Photoshop, Illustrator, InDesign)</li>
                <li>Có portfolio ấn tượng</li>
                <li>Tư duy sáng tạo và khả năng làm việc độc lập</li>
            </ul>
            <h4>Quyền lợi:</h4>
            <ul>
                <li>Mức lương: 18-25 triệu VNĐ</li>
                <li>Làm việc với các thương hiệu lớn</li>
                <li>Cơ hội thăng tiến lên Lead Designer</li>
            </ul>
        `
    },
    {
        id: 3,
        title: 'Video Editor',
        location: 'Hồ Chí Minh / Remote',
        type: 'Part-time',
        level: 'Junior',
        active: false,
        description: 'Dựng video cho các chiến dịch marketing và social media.',
        fullDescription: `
            <h4>Mô tả công việc:</h4>
            <ul>
                <li>Dựng video ngắn cho TikTok, Reels, Shorts</li>
                <li>Edit video quảng cáo cho các chiến dịch marketing</li>
                <li>Tạo motion graphics đơn giản</li>
                <li>Phối hợp với team content để hoàn thiện sản phẩm</li>
            </ul>
            <h4>Yêu cầu:</h4>
            <ul>
                <li>Thành thạo Premiere Pro hoặc Final Cut</li>
                <li>Biết After Effects là một cộng lớn</li>
                <li>Có khiếu thẩm mỹ và sense về nhạc</li>
                <li>Có thể làm việc remote hiệu quả</li>
            </ul>
            <h4>Quyền lợi:</h4>
            <ul>
                <li>Lương theo dự án hoặc giờ làm</li>
                <li>Linh hoạt thời gian và địa điểm làm việc</li>
                <li>Cơ hội chuyển sang full-time</li>
            </ul>
        `
    },
    {
        id: 4,
        title: 'Account Executive',
        location: 'Hồ Chí Minh',
        type: 'Full-time',
        level: 'Middle',
        active: true,
        description: 'Quản lý dự án và chăm sóc khách hàng.',
        fullDescription: `
            <h4>Mô tả công việc:</h4>
            <ul>
                <li>Là cầu nối giữa khách hàng và các team nội bộ</li>
                <li>Quản lý timeline và tiến độ dự án</li>
                <li>Đề xuất chiến lược và giải pháp cho khách hàng</li>
                <li>Chăm sóc và phát triển quan hệ khách hàng</li>
            </ul>
            <h4>Yêu cầu:</h4>
            <ul>
                <li>Tối thiểu 2 năm kinh nghiệm account/project management</li>
                <li>Kỹ năng giao tiếp và thuyết phục tốt</li>
                <li>Khả năng quản lý thời gian và đa nhiệm</li>
                <li>Hiểu biết về digital marketing là lợi thế</li>
            </ul>
            <h4>Quyền lợi:</h4>
            <ul>
                <li>Mức lương: 15-20 triệu VNĐ + hoa hồng</li>
                <li>Được training về account management</li>
                <li>Cơ hội làm việc với nhiều ngành hàng khác nhau</li>
            </ul>
        `
    },
    {
        id: 5,
        title: 'Social Media Intern',
        location: 'Hồ Chí Minh',
        type: 'Internship',
        level: 'Intern',
        active: true,
        description: 'Hỗ trợ team vận hành và phát triển các kênh social media.',
        fullDescription: `
            <h4>Mô tả công việc:</h4>
            <ul>
                <li>Hỗ trợ đăng bài và quản lý các kênh social media</li>
                <li>Theo dõi và báo cáo chỉ số engagement</li>
                <li>Tham gia brainstorm ý tưởng content</li>
                <li>Tương tác với followers và trả lời comment</li>
            </ul>
            <h4>Yêu cầu:</h4>
            <ul>
                <li>Sinh viên năm 3-4 hoặc mới ra trường</li>
                <li>Đam mê social media và digital marketing</li>
                <li>Chủ động học hỏi và có tinh thần trách nhiệm</li>
                <li>Có thể làm việc tối thiểu 4 ngày/tuần</li>
            </ul>
            <h4>Quyền lợi:</h4>
            <ul>
                <li>Trợ cấp: 3-5 triệu VNĐ/tháng</li>
                <li>Được đào tạo bài bản về social media marketing</li>
                <li>Cơ hội trở thành nhân viên chính thức</li>
            </ul>
        `
    },
];

export const CareersPage: React.FC = () => {
    const formRef = useRef<HTMLDivElement>(null);
    const [expandedJobId, setExpandedJobId] = useState<number | null>(null);

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
                setSubmitError('File CV không được vượt quá 10MB');
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
            setSubmitError('Bạn đã gửi quá nhiều đơn. Vui lòng thử lại sau 1 giờ.');
            return;
        }

        // Validate required fields
        if (!formData.fullName || !formData.email || !formData.phone) {
            setSubmitError('Vui lòng điền đầy đủ thông tin bắt buộc.');
            return;
        }

        // Validate CV file
        if (!cvFile) {
            setSubmitError('Vui lòng đính kèm CV của bạn.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Step 1: Upload CV to Supabase
            const { url: cvUrl, error: uploadError } = await uploadCV(cvFile);

            if (uploadError || !cvUrl) {
                setSubmitError('Không thể tải lên CV. Vui lòng thử lại.');
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
                setSubmitError(result.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Submit error:', error);
            setSubmitError('Có lỗi xảy ra. Vui lòng thử lại sau.');
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
                            Gia nhập HUGs
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black mb-6">
                            Tìm kiếm cơ hội<br />
                            <span className="text-brand-pink">phát triển cùng HUGs</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Chúng tôi luôn tìm kiếm những tài năng đam mê sáng tạo và muốn tạo ra giá trị thực sự trong lĩnh vực truyền thông số.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Job Listings */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">
                        Vị trí đang tuyển ({jobPositions.filter(j => j.active).length})
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

                                                {/* Status Badge */}
                                                {isActive ? (
                                                    <span className="inline-block px-3 py-1 rounded-full border border-brand-pink text-brand-pink text-xs font-bold leading-none">
                                                        Đang Tuyển Dụng
                                                    </span>
                                                ) : (
                                                    <span className="inline-block px-3 py-1 rounded-full border border-gray-300 text-gray-400 text-xs font-bold leading-none">
                                                        Đã đóng
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
                                                <span className="text-xs text-gray-500 uppercase tracking-wide">Địa điểm</span>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <MapPin size={14} className="text-gray-400" />
                                                    <span className="text-sm text-gray-700">{job.location}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-500 uppercase tracking-wide">Hình thức</span>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Clock size={14} className="text-gray-400" />
                                                    <span className="text-sm text-gray-700">{job.type}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-500 uppercase tracking-wide">Cấp bậc</span>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Briefcase size={14} className="text-gray-400" />
                                                    <span className="text-sm text-gray-700">{job.level}</span>
                                                </div>
                                            </div>
                                            <div className="hidden md:block">
                                                <span className="text-xs text-gray-500 uppercase tracking-wide">Mô tả</span>
                                                <p className="text-sm text-gray-700 mt-1 line-clamp-1">{job.description}</p>
                                            </div>
                                        </div>

                                        {/* Expand hint when collapsed */}
                                        {!isExpanded && isActive && (
                                            <div className="mt-4 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-sm text-brand-pink font-medium">
                                                    Click để xem chi tiết →
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
                                                            Ứng tuyển ngay
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
                            Form ứng tuyển
                        </h2>
                        <p className="text-gray-600 text-center mb-8">
                            Điền thông tin bên dưới và chúng tôi sẽ liên hệ với bạn sớm nhất
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
                                    Gửi thành công!
                                </h3>
                                <p className="text-green-700">
                                    Cảm ơn bạn đã ứng tuyển. Chúng tôi sẽ liên hệ sớm!
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
                                        Vị trí ứng tuyển *
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
                                            Họ và tên *
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
                                            Email *
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
                                            Số điện thoại *
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
                                            Portfolio / LinkedIn
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
                                        CV / Resume *
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
                                                    Kéo thả hoặc <span className="text-brand-pink font-medium">chọn file</span>
                                                    <br />
                                                    <span className="text-xs">PDF, DOC, DOCX (tối đa 10MB)</span>
                                                </span>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Giới thiệu bản thân
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={4}
                                        placeholder="Chia sẻ về kinh nghiệm, kỹ năng và lý do bạn muốn gia nhập HUGs..."
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
                                            Đang gửi...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            Gửi đơn ứng tuyển
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
