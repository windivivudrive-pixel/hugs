import { AllProjectPage } from "@/components/AllProjectPage";

export const metadata = {
  title: "Tất Cả Dự Án | HUGs Agency",
  description: "Toàn bộ portfolio dự án của HUGs Agency.",
};

import { Suspense } from 'react';

export default function AllProjectsRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <AllProjectPage />
    </Suspense>
  );
}
