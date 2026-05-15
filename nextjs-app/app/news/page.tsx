import { fetchInitialFeeds, fetchCategories } from "@/lib/actions-server";
import { NewsPageClient } from "@/components/NewsPageClient";
import type { Metadata } from "next";

// ISR: pre-render at build time, revalidate every 5 minutes in background.
// Initial data comes from WP REST API (works at build & runtime).
// SSH/DB is only used for "load more" cursor pagination (client-side API calls).
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Tin tức & Góc nhìn | HUGs Agency",
  description: "Cập nhật những xu hướng, kiến thức và góc nhìn mới nhất về Digital Marketing từ chuyên gia của HUGs Agency.",
  openGraph: {
    title: "Tin tức & Góc nhìn | HUGs Agency",
    description: "Cập nhật kiến thức Digital Marketing mới nhất.",
  }
};

export default async function NewsRoute() {
  const [initialFeeds, categories] = await Promise.all([
    fetchInitialFeeds(10),
    fetchCategories(),
  ]);
  
  return (
    <NewsPageClient 
      initialFeeds={initialFeeds}
      categories={categories}
    />
  );
}
