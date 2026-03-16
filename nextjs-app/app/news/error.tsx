"use client";

import { useEffect } from "react";
import { PageNavbar } from "@/components/ui/PageNavbar";
import { FooterSection } from "@/components/ui/FooterSection";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("News page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex flex-col pt-16">
      <PageNavbar activePage="news" />
      
      <div className="flex-grow flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Tính năng tải tin tức đang bị gián đoạn</h2>
        <p className="text-gray-500 max-w-md">
          Có vẻ như kết nối đến máy chủ tin tức (WordPress) đang bị quá tải hoặc phản hồi chậm. Vui lòng thử lại sau.
        </p>
        <button
          onClick={() => reset()}
          className="mt-4 px-6 py-2 bg-brand-pink text-white rounded-full font-semibold hover:bg-brand-default transition-colors"
        >
          Thử lại
        </button>
      </div>
      
      <FooterSection />
    </div>
  );
}
