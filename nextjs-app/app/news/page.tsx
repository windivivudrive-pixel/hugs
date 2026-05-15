import { fetchInitialFeeds, fetchCategories } from "@/lib/actions-server";

export const revalidate = 120;
import { NewsPageClient } from "@/components/NewsPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tin tức & Góc nhìn | HUGs Agency",
  description: "Cập nhật những xu hướng, kiến thức và góc nhìn mới nhất về Digital Marketing từ chuyên gia của HUGs Agency.",
  openGraph: {
    title: "Tin tức & Góc nhìn | HUGs Agency",
    description: "Cập nhật kiến thức Digital Marketing mới nhất.",
  }
};

export default async function NewsRoute() {
  // Fetch top 10 posts per category in one query — every section guaranteed content
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
