
import { fetchAllArticles, fetchArticleBySlug } from "@/lib/actions-server";

export const revalidate = 120;
import { ArticlePageClient } from "@/components/ArticlePageClient";
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

// Helper: Try to get article from REST API (projects list) first, fallback to DB (news posts)
async function getArticleData(slug: string) {
  // First, check if it's a project via fast REST endpoint
  const projects = await fetchAllArticles();
  const project = projects.find((p: any) => p.slug === slug);
  
  if (project) {
    // Map project shape to expected NewsArticle shape
    return {
      ...project,
      category: project.service?.name || 'Project',
      category_slug: project.service?.slug || 'project',
      author: 'Admin',
      updated_at: project.created_at,
      views: 0
    };
  }

  // Fallback to REST API for news posts
  return await fetchArticleBySlug(slug);
}

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const article = await getArticleData(params.slug);
  
  if (!article) {
    return { title: 'Not Found' };
  }

  return {
    title: article.title,
    description: article.excerpt || article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt || article.title,
      type: "article",
      publishedTime: article.created_at,
      authors: [article.author || 'Admin'],
      images: article.thumbnail ? [article.thumbnail] : [],
    },
  };
}

export default async function ArticleRoute(props: Props) {
  const params = await props.params;
  const article = await getArticleData(params.slug);
  
  if (!article) {
    notFound();
  }

  return <ArticlePageClient article={article} />;
}
