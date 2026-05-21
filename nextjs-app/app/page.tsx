import { MainSite } from "@/components/sections/MainSite";
import { fetchNewsArticles, fetchAllArticles } from "@/lib/actions-server";

export const revalidate = 120;

export default async function Home() {
  // Fetch initial news articles (limit to 4) and all projects (featured filtered by components) at build/request time
  const [initialArticles, allProjects] = await Promise.all([
    fetchNewsArticles(4).catch((err) => {
      console.error("Error fetching news for home:", err);
      return [];
    }),
    fetchAllArticles().catch((err) => {
      console.error("Error fetching projects for home:", err);
      return [];
    })
  ]);

  return <MainSite initialArticles={initialArticles} initialProjects={allProjects} />;
}
