import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Send } from 'lucide-react';

export const FooterSection: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-white pt-20 pb-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-pink/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-pink/5 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* CTA Section */}
                <motion.div
                    className="bg-gradient-to-r from-brand-pink to-pink-600 rounded-3xl p-8 md:p-12 mb-16 text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-2xl md:text-4xl font-black mb-4">Sẵn sàng bắt đầu dự án?</h3>
                    <p className="text-white/80 mb-6 max-w-xl mx-auto">
                        Liên hệ ngay với chúng tôi để được tư vấn miễn phí về chiến lược marketing cho doanh nghiệp của bạn.
                    </p>
                    <motion.button
                        className="bg-white text-brand-pink px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Liên hệ ngay
                    </motion.button>
                </motion.div>

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