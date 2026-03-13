import { ProjectsPage } from "@/components/ProjectsPage";

export const metadata = {
  title: "Dự Án | HUGs Agency",
  description: "Các dự án nổi bật mà HUGs Agency đã thực hiện cho khách hàng.",
};

import { Suspense } from 'react';

export default function ProjectsRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ProjectsPage />
    </Suspense>
  );
}
