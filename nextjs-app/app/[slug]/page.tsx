import { getPostBySlug } from "@/lib/wordpress";

export const dynamic = 'force-dynamic';
import { ArticlePageClient } from "@/components/ArticlePageClient";
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const article = await getPostBySlug(params.slug);
  
  if (!article) {
    return { title: 'Not Found' };
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.created_at,
      authors: [article.author],
      images: article.thumbnail ? [article.thumbnail] : [],
    },
  };
}

export default async function ArticleRoute(props: Props) {
  const params = await props.params;
  const article = await getPostBySlug(params.slug);
  
  if (!article) {
    notFound();
  }

  return <ArticlePageClient article={article} />;
}
