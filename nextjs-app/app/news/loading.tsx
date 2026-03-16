import { PageNavbar } from '@/components/ui/PageNavbar';
import { FooterSection } from '@/components/ui/FooterSection';
import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="min-h-screen bg-white flex flex-col pt-16">
            {/* The page navbar shows active site. 'news' refers to this page */}
            <PageNavbar activePage="news" />
            
            <div className="flex-grow flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 text-brand-pink animate-spin" />
                <p className="text-gray-500 font-medium">Đang tải tin tức mới nhất...</p>
            </div>
            
            <FooterSection />
        </div>
    );
}
