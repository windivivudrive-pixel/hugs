import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Send } from 'lucide-react';

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
        <footer className="bg-gray-900 text-white pt-20 pb-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-pink/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-pink/5 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* CTA Section - Contact Form */}
                {!hideCTA && (
                    <motion.div
                        className="bg-white rounded-3xl p-8 md:p-12 mb-16 text-gray-900"
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
                                                : 'border-gray-300 hover:border-brand-pink hover:text-brand-pink'
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
                        <h4 className="text-2xl font-black text-brand-pink mb-4">HUGs</h4>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Công ty Truyền thông Mạng xã hội hàng đầu Miền Trung. Đối tác TikTok Shop đầu tiên tại Đà Nẵng.
                        </p>
                        <div className="flex gap-3">
                            {[Facebook, Instagram, Youtube].map((Icon, i) => (
                                <motion.a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-pink transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <Icon size={18} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-bold mb-4">Dịch vụ</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            {["Social Media Marketing", "Content Creation", "Influencer Marketing", "TikTok Shop", "Booking - PR"].map((item, i) => (
                                <li key={i}>
                                    <a href="#" className="hover:text-brand-pink transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold mb-4">Liên kết</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            {["Về chúng tôi", "Dự án", "Blog", "Tuyển dụng", "Liên hệ"].map((item, i) => (
                                <li key={i}>
                                    <a href="#" className="hover:text-brand-pink transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold mb-4">Liên hệ</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-brand-pink mt-0.5" />
                                <span>123 Lê Lợi, Đà Nẵng</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-brand-pink" />
                                <span>0123 456 789</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-brand-pink" />
                                <span>hello@huge.agency</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">© 2024 HUGs Agency. All rights reserved.</p>
                    {/* <div className="flex gap-6 text-sm text-gray-500">
                        <a href="#" className="hover:text-brand-pink transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-brand-pink transition-colors">Terms of Service</a>
                    </div> */}
                </div>
            </div>
        </footer>
    );
};