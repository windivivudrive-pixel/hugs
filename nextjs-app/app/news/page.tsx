import { getPublishedPostsLite, getCategories, getPostCount } from "@/lib/wordpress";

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
  // Fetch only first batch (30 posts) for fast initial load
  const [initialArticles, categories, totalCount] = await Promise.all([
    getPublishedPostsLite(30, 0),
    getCategories(),
    getPostCount(),
  ]);
  
  return (
    <NewsPageClient 
      initialArticles={initialArticles} 
      categories={categories}
      totalCount={totalCount}
    />
  );
}
