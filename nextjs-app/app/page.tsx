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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "HUGs Agency cung cấp những dịch vụ Digital Marketing nào?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "HUGs Agency cung cấp giải pháp Marketing tổng thể bao gồm: Quản trị fanpage Facebook, vận hành kênh TikTok, sản xuất video & hình ảnh chuyên nghiệp, chạy quảng cáo đa kênh, thiết kế website, SEO và tổ chức sự kiện tại Đà Nẵng & miền Trung."
                }
              },
              {
                "@type": "Question",
                "name": "Làm thế nào để đăng ký tư vấn dịch vụ tại HUGs Agency?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Bạn có thể đăng ký tư vấn trực tiếp qua website hugs.agency bằng cách điền thông tin tại form đăng ký ở chân trang hoặc liên hệ hotline +84778970999 để được đội ngũ chuyên viên hỗ trợ nhanh nhất."
                }
              },
              {
                "@type": "Question",
                "name": "Tại sao nên chọn HUGs Agency làm đối tác Marketing tại miền Trung?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "HUGs Agency sở hữu Local Insight sâu sắc về thị trường miền Trung, kết hợp với tư duy thực chiến và đội ngũ hơn 30 nhân sự chuyên nghiệp, giúp doanh nghiệp SME tối ưu hóa chi phí và đạt hiệu quả tăng trưởng bền vững."
                }
              }
            ]
          })
        }}
      />
      <MainSite initialArticles={initialArticles} initialProjects={allProjects} />
    </>
  );
}

