import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="relative">
        {/* Decorative background glow */}
        <div className="absolute inset-0 bg-brand-pink/20 blur-3xl rounded-full scale-150 animate-pulse" />
        
        {/* Main loader */}
        <div className="relative flex flex-col items-center gap-6">
          <Loader2 className="w-12 h-12 text-brand-pink animate-spin" />
          
          <div className="flex flex-col items-center text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Đang tải dự án...</h3>
            <p className="text-gray-500 text-sm max-w-[250px]">
              Vui lòng đợi trong giây lát khi chúng tôi chuẩn bị nội dung tốt nhất cho bạn.
            </p>
          </div>
        </div>
      </div>
      
      {/* Skeleton-like placeholder layout below (optional visual hint) */}
      <div className="mt-12 w-full max-w-4xl space-y-8 opacity-20 pointer-events-none hidden md:block">
        <div className="h-64 bg-gray-200 rounded-3xl animate-pulse" />
        <div className="flex gap-4">
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-[90%] bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-[85%] bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
