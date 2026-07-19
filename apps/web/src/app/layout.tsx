import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { siteConfig } from "@/lib/site-config";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: siteConfig.url,
  title: {
    default: `${siteConfig.tagline} | VietTools`,
    template: "%s | VietTools",
  },
  description:
    "Xử lý văn bản, dữ liệu và nội dung tiếng Việt nhanh chóng ngay trên trình duyệt.",
  icons: {
    icon: [
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon-32.png",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: siteConfig.name,
    title: siteConfig.tagline,
    description: "Bộ công cụ xử lý tiếng Việt miễn phí, nhanh và riêng tư.",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: siteConfig.tagline,
    description: "Bộ công cụ xử lý tiếng Việt miễn phí, nhanh và riêng tư.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <a className="skip-link" href="#main-content">
          Bỏ qua đến nội dung
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
