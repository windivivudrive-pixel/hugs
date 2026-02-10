import React, { useEffect } from 'react';
import { FooterSection } from './FooterSection';
import { PageNavbar } from './PageNavbar';

export const AdvisePage: React.FC = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <PageNavbar />
            <FooterSection />
        </div>
    );
};
