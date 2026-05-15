import { fetchInitialFeeds, fetchCategories } from "@/lib/actions-server";
import { NewsPageClient } from "@/components/NewsPageClient";
import type { Metadata } from "next";

// Force dynamic rendering — the news page queries the DB via SSH tunnel
// which is not available during the static build phase on Vercel.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Tin tức & Góc nhìn | HUGs Agency",
  description: "Cập nhật những xu hướng, kiến thức và góc nhìn mới nhất về Digital Marketing từ chuyên gia của HUGs Agency.",
  openGraph: {
    title: "Tin tức & Góc nhìn | HUGs Agency",
    description: "Cập nhật kiến thức Digital Marketing mới nhất.",
  }
};

export default async function NewsRoute() {
  // Fetch top 10 posts per category in one query — every section guaranteed content.
  // If DB is unavailable, fetchInitialFeeds returns empty feeds gracefully.
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
