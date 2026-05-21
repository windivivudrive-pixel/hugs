import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import { FloatingActionButtons } from "@/components/ui/FloatingActionButtons";
import { GlobalWelcomeCube } from "@/components/ui/GlobalWelcomeCube";

const manrope = localFont({
  src: [{
    path: "../public/Manrope-Regular.ttf",
    weight: "400",
    style: "normal",
  },
  {
    path: "../public/Manrope-Bold.ttf",
    weight: "700",
    style: "normal",
  },
  {
    path: "../public/Manrope-Light.ttf",
    weight: "300",
    style: "normal",
  },
  ],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: {
    default: "HUGs Agency | Digital Marketing Agency tại Đà Nẵng & Miền Trung",
    template: "%s | HUGs Agency",
  },
  description:
    "HUGs Agency - Agency Marketing tổng thể tại Đà Nẵng & Miền Trung. Cung cấp dịch vụ quản trị fanpage, quảng cáo đa nền tảng, sản xuất video, thiết kế, SEO và tổ chức sự kiện.",
  keywords: [
    "marketing agency",
    "digital marketing",
    "quảng cáo",
    "thiết kế",
    "SEO",
    "social media",
    "HUGs Agency",
    "agency đà nẵng",
    "digital marketing đà nẵng",
    "marketing agency đà nẵng",
    "seo đà nẵng",
    "agency việt nam",
  ],
  authors: [{ name: "HUGs Agency" }],
  metadataBase: new URL("https://hugs.agency"),
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://hugs.agency/",
    siteName: "HUGs Agency",
    title: "HUGs Agency | Digital Marketing Agency tại Đà Nẵng & Miền Trung",
    description:
      "HUGs Agency - Agency Marketing tổng thể tại Đà Nẵng & Miền Trung. Cung cấp dịch vụ quản trị fanpage, quảng cáo đa nền tảng, sản xuất video, thiết kế, SEO và tổ chức sự kiện.",
    images: [{ url: "/logo-hugs.png", width: 800, height: 600, alt: "HUGs Agency" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HUGs Agency | Digital Marketing Agency tại Đà Nẵng & Miền Trung",
    description:
      "HUGs Agency - Agency Marketing tổng thể tại Đà Nẵng & Miền Trung.",
    images: ["/logo-hugs.png"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/logo-hugs.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={manrope.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AdvertisingAgency",
              "@id": "https://hugs.agency/#agency",
              "name": "HUGs Agency",
              "alternateName": "HUGs Digital Marketing Agency",
              "url": "https://hugs.agency",
              "logo": {
                "@type": "ImageObject",
                "url": "https://hugs.agency/logo-hugs.png",
                "width": 800,
                "height": 600
              },
              "image": "https://hugs.agency/logo-hugs.png",
              "description": "HUGs Agency - Agency Marketing tổng thể tại Việt Nam. Cung cấp dịch vụ quản trị fanpage, quảng cáo đa nền tảng, sản xuất video, thiết kế, SEO và tổ chức sự kiện.",
              "telephone": "+84778970999",
              "email": "lienhe@hugs.agency",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "55 Lý Thường Kiệt, phường Hải Châu",
                "addressLocality": "Hải Châu",
                "addressRegion": "Đà Nẵng",
                "postalCode": "550000",
                "addressCountry": "VN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 16.07990,
                "longitude": 108.21894
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday"
                ],
                "opens": "08:00",
                "closes": "17:30"
              },
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "telephone": "+84778970999",
                  "contactType": "customer service",
                  "areaServed": "VN",
                  "availableLanguage": ["Vietnamese", "English"]
                }
              ],
              "sameAs": [
                "https://www.facebook.com/share/17GUXExbcd/?mibextid=wwXIfr",
                "https://www.instagram.com/hugs_agency?igsh=MW9hOGkxYmUwaGFyYg==",
                "https://www.tiktok.com/@hugsagency?_r=1&_t=ZS-93Pejzk3yJW",
                "https://www.linkedin.com/company/hugs-agency/"
              ],
              "priceRange": "$$"
            }),
          }}
        />
      </head>
      <body className={`${manrope.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
          {children}
          <FloatingActionButtons />
          <GlobalWelcomeCube />
        </Providers>
      </body>
    </html>
  );
}
