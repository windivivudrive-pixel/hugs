import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send } from 'lucide-react';

const INTEREST_TAGS = [
    'Social Media',
    'Thiết kế Website',
    'TikTok Shop',
    'Thiết kế đồ họa',
    'UI/UX',
    'Video Production',
    'Booking - PR',
    'KOL/KOC',
    'Khác'
];

// Social links with platform colors
const socialLinks = [
    {
        name: 'Facebook',
        url: 'https://www.facebook.com/share/17GUXExbcd/?mibextid=wwXIfr',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
        hoverColor: 'hover:text-brand-pink'
    },
    {
        name: 'Instagram',
        url: 'https://www.instagram.com/hugs_agency?igsh=MW9hOGkxYmUwaGFyYg==',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
        ),
        hoverColor: 'hover:text-brand-pink'
    },
    {
        name: 'TikTok',
        url: 'https://www.tiktok.com/@hugsagency?_r=1&_t=ZS-93Pejzk3yJW',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
        ),
        hoverColor: 'hover:text-brand-pink'
    },
    {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/company/hugs-agency/',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
        hoverColor: 'hover:text-brand-pink'
    }
];

interface FooterSectionProps {
    hideCTA?: boolean;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ hideCTA = false }) => {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    return (
        <footer className="bg-white text-gray-900 pt-20 pb-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-pink/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-pink/5 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* CTA Section - Contact Form */}
                {!hideCTA && (
                    <motion.div
                        className="bg-gray-50 rounded-3xl p-8 md:p-12 mb-16 text-gray-900 border border-gray-100"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-2xl md:text-4xl font-black mb-10 text-center">
                            Bắt đầu dự án mới cùng HUGs
                        </h3>

                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            {/* Left - Input Fields */}
                            <div className="space-y-6">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Tên của bạn*"
                                        className="w-full border-b-2 border-gray-200 py-3 text-gray-900 placeholder-gray-400 focus:border-brand-pink outline-none transition-colors bg-transparent"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Email của bạn*"
                                        className="w-full border-b-2 border-gray-200 py-3 text-gray-900 placeholder-gray-400 focus:border-brand-pink outline-none transition-colors bg-transparent"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Mô tả về dự án của bạn..."
                                        className="w-full border-b-2 border-gray-200 py-3 text-gray-900 placeholder-gray-400 focus:border-brand-pink outline-none transition-colors bg-transparent"
                                    />
                                </div>
                            </div>

                            {/* Right - Interest Tags */}
                            <div>
                                <p className="text-lg font-semibold mb-4">Tôi quan tâm đến...</p>
                                <div className="flex flex-wrap gap-3">
                                    {INTEREST_TAGS.map((tag, i) => (
                                        <button
                                            key={i}
                                            onClick={() => toggleTag(tag)}
                                            className={`px-4 py-2 border rounded-full text-sm transition-all duration-200 ${selectedTags.includes(tag)
                                                ? 'bg-brand-pink text-white border-brand-pink'
                                                : 'border-gray-300 text-gray-700 hover:border-brand-pink hover:text-brand-pink'
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Square Send Button */}
                        <div className="flex justify-center mt-12">
                            <button
                                className="w-24 h-24 bg-brand-pink text-white font-bold flex items-center justify-center hover:bg-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                            >
                                <span className="flex flex-col items-center">
                                    <Send size={20} className="mb-1" />
                                    <span className="text-sm">Gửi</span>
                                </span>
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Footer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* About */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <img src="/logo-hugs.png" alt="HUGs Logo" className="w-12 h-12 object-contain" />
                            <h4 className="text-2xl font-black text-brand-pink">HUGs</h4>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-6">
                            Công ty Truyền thông Mạng xã hội hàng đầu Miền Trung. Đối tác TikTok Shop đầu tiên tại Đà Nẵng.
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((social, i) => (
                                <motion.a
                                    key={i}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-900 transition-colors ${social.hoverColor}`}
                                    whileHover={{ scale: 1.1 }}
                                    title={social.name}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-bold mb-4 text-gray-900">Dịch vụ</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            {["Social Media Marketing", "Content Creation", "Influencer Marketing", "TikTok Shop", "Booking - PR"].map((item, i) => (
                                <li key={i}>
                                    <a href="#" className="hover:text-brand-pink transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold mb-4 text-gray-900">Liên kết</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            {["Về chúng tôi", "Dự án", "Blog", "Tuyển dụng", "Liên hệ"].map((item, i) => (
                                <li key={i}>
                                    <a href="#" className="hover:text-brand-pink transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold mb-4 text-gray-900">Liên hệ</h4>
                        <ul className="space-y-4 text-sm text-gray-600">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-brand-pink mt-0.5 flex-shrink-0" />
                                <span>55 Lý Thường Kiệt, phường Hải Châu, TP. Đà Nẵng</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-brand-pink flex-shrink-0" />
                                <a href="tel:0924392222" className="hover:text-brand-pink transition-colors">0924 392 222</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-brand-pink flex-shrink-0" />
                                <a href="mailto:lienhe@hugs.agency" className="hover:text-brand-pink transition-colors">lienhe@hugs.agency</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">© 2024 HUGs Agency. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};