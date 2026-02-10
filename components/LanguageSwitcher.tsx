import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../lib/translations';

export const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        {
            code: 'VI',
            label: 'Tiếng Việt',
            flag: 'https://flagcdn.com/w40/vn.png'
        },
        {
            code: 'EN',
            label: 'English',
            flag: 'https://flagcdn.com/w40/us.png'
        }
    ];

    const currentLang = languages.find(l => l.code === language) || languages[0];

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 cursor-pointer hover:border-brand-pink transition-colors group">
                <img
                    src={currentLang.flag}
                    alt={`${currentLang.label} Flag`}
                    className="w-5 h-auto object-cover rounded-sm"
                />
                <span className="text-sm font-bold text-gray-700 group-hover:text-brand-pink transition-colors">
                    {currentLang.code}
                </span>
                <ChevronDown size={14} className={`text-gray-500 group-hover:text-brand-pink transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="py-1">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang.code as Language);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-brand-pink/10 transition-colors ${language === lang.code ? 'text-brand-pink font-bold' : 'text-gray-700 font-medium'
                                        }`}
                                >
                                    <img
                                        src={lang.flag}
                                        alt={lang.label}
                                        className="w-5 h-auto object-cover rounded-sm"
                                    />
                                    {lang.code}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
