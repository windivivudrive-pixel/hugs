
import { fetchAllArticles, fetchArticleBySlug } from "@/lib/actions-server";
import { type ServiceArticle } from "@/lib/types";

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
  const project = projects.find((p: ServiceArticle) => p.slug === slug);
  
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

// Helper: Extract FAQs from WordPress post contents using Regex, with TOC clean-up
function extractFAQs(content: string): Array<{ question: string; answer: string }> {
  const faqs: Array<{ question: string; answer: string }> = [];
  if (!content) return faqs;

  // Regular expression to match H2, H3, or H4 containing "?" or "hỏi"/"câu hỏi"/"faq"
  // followed by subsequent paragraphs or content up to the next heading or end of string.
  const regex = /<(h[2-4])(?:\s+[^>]*)*>(.*?(?:\?|câu hỏi|hỏi|faq).*?)<\/\1>\s*([\s\S]*?)(?=(?:<h[2-4]|$))/gi;
  
  let match;
  while ((match = regex.exec(content)) !== null) {
    const questionText = match[2].replace(/<\/?[^>]+(>|$)/g, "").trim();
    const rawAnswer = match[3];
    let answerText = rawAnswer.replace(/<\/?[^>]+(>|$)/g, "").trim();
    
    // Clean table of contents text
    answerText = answerText.replace(/Table of Contents\s*Toggle[\s\S]*?(?:Kết luận|Toggle)/gi, "").trim();
    
    // Clean up double spaces/newlines
    answerText = answerText.replace(/\s+/g, " ").trim();

    if (questionText && answerText && questionText.length > 5 && answerText.length > 10) {
      if (faqs.length < 5) {
        faqs.push({ question: questionText, answer: answerText });
      }
    }
  }

  return faqs;
}

// Fallback FAQs for HUGs Agency branding
const FALLBACK_FAQS = [
  {
    question: "HUGs Agency cung cấp những dịch vụ Digital Marketing nào?",
    answer: "HUGs Agency cung cấp giải pháp Marketing tổng thể bao gồm: Quản trị fanpage Facebook, vận hành kênh TikTok, sản xuất video & hình ảnh chuyên nghiệp, chạy quảng cáo đa kênh, thiết kế website, SEO và tổ chức sự kiện tại Đà Nẵng & miền Trung."
  },
  {
    question: "Làm thế nào để đăng ký tư vấn dịch vụ tại HUGs Agency?",
    answer: "Bạn có thể đăng ký tư vấn trực tiếp qua website hugs.agency bằng cách điền thông tin tại form đăng ký ở chân trang hoặc liên hệ hotline +84778970999 để được đội ngũ chuyên viên hỗ trợ nhanh nhất."
  },
  {
    question: "Tại sao nên chọn HUGs Agency làm đối tác Marketing tại miền Trung?",
    answer: "HUGs Agency sở hữu Local Insight sâu sắc về thị trường miền Trung, kết hợp với tư duy thực chiến và đội ngũ hơn 30 nhân sự chuyên nghiệp, giúp doanh nghiệp SME tối ưu hóa chi phí và đạt hiệu quả tăng trưởng bền vững."
  }
];

export default async function ArticleRoute(props: Props) {
  const params = await props.params;
  const article = await getArticleData(params.slug);
  
  if (!article) {
    notFound();
  }

  // 1. Generate Article/BlogPosting Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.excerpt || article.title,
    "image": article.thumbnail ? [article.thumbnail] : [],
    "datePublished": article.created_at,
    "dateModified": article.updated_at || article.created_at,
    "author": {
      "@type": "Organization",
      "name": "HUGs Agency",
      "url": "https://hugs.agency"
    },
    "publisher": {
      "@type": "Organization",
      "name": "HUGs Agency",
      "logo": {
        "@type": "ImageObject",
        "url": "https://hugs.agency/logo-hugs.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://hugs.agency/${params.slug}`
    }
  };

  // 2. Generate FAQPage Schema (Extracted FAQs or Fallback)
  const extractedFaqs = extractFAQs(article.content || "");
  const faqItems = extractedFaqs.length > 0 ? extractedFaqs : FALLBACK_FAQS;
  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <>
      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <ArticlePageClient article={article} />
    </>
  );
}

