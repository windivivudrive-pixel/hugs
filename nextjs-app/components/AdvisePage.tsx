'use client';
import React, { useEffect } from 'react';
import { FooterSection } from '@/components/ui/FooterSection';
import { PageNavbar } from '@/components/ui/PageNavbar';
import { useDocumentHead } from '@/lib/useDocumentHead';

export const AdvisePage: React.FC = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useDocumentHead({
        title: 'Tư vấn',
        description: 'Đăng ký tư vấn dịch vụ marketing từ HUGs Agency. Chúng tôi sẵn sàng hỗ trợ bạn xây dựng chiến lược marketing hiệu quả.',
        keywords: 'tư vấn marketing, đăng ký tư vấn, HUGs Agency',
    });

    return (
        <div className="min-h-screen bg-white">
            <PageNavbar />
            <FooterSection />
        </div>
    );
};
