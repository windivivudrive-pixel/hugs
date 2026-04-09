import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

const helveticaNeue = localFont({
  src: [
    {
      path: "../public/SVN-Helvetica Neue Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/SVN-Helvetica Neue Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/SVN-Helvetica Neue Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/SVN-Helvetica Neue Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/SVN-Helvetica Neue Bold Italic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-helvetica-neue",
});

export const metadata: Metadata = {
  title: {
    default: "HUGs Agency | Digital Marketing Agency tại Việt Nam",
    template: "%s | HUGs Agency",
  },
  description:
    "HUGs Agency - Agency Marketing tổng thể tại Việt Nam. Cung cấp dịch vụ quản trị fanpage, quảng cáo đa nền tảng, sản xuất video, thiết kế, SEO và tổ chức sự kiện.",
  keywords: [
    "marketing agency",
    "digital marketing",
    "quảng cáo",
    "thiết kế",
    "SEO",
    "social media",
    "HUGs Agency",
    "agency việt nam",
  ],
  authors: [{ name: "HUGs Agency" }],
  metadataBase: new URL("https://hugs.agency"),
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://hugs.agency/",
    siteName: "HUGs Agency",
    title: "HUGs Agency | Digital Marketing Agency tại Việt Nam",
    description:
      "HUGs Agency - Agency Marketing tổng thể tại Việt Nam. Cung cấp dịch vụ quản trị fanpage, quảng cáo đa nền tảng, sản xuất video, thiết kế, SEO và tổ chức sự kiện.",
    images: [{ url: "/logo-hugs.png", width: 800, height: 600, alt: "HUGs Agency" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HUGs Agency | Digital Marketing Agency tại Việt Nam",
    description:
      "HUGs Agency - Agency Marketing tổng thể tại Việt Nam.",
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
    <html lang="vi" className={helveticaNeue.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "HUGs Agency",
              url: "https://hugs.agency",
              logo: "https://hugs.agency/logo-hugs.png",
              description: "Agency Marketing tổng thể tại Việt Nam",
              address: {
                "@type": "PostalAddress",
                addressCountry: "VN",
              },
            }),
          }}
        />
      </head>
      <body className={`${helveticaNeue.variable} font-sans antialiased`} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "HUGs Agency",
              "url": "https://hugs.agency",
              "logo": "https://hugs.agency/logo-hugs.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+84 934 68 86 52",
                "contactType": "customer service"
              }
            })
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
