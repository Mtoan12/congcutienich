import type { Metadata } from "next";
import { Container } from "@viettools/ui";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Thông tin liên hệ và mã nguồn của VietTools.",
  alternates: { canonical: "/lien-he" },
};
export default function ContactPage() {
  return (
    <Container>
      <article className="prose-width legal">
        <header className="page-header">
          <h1>Liên hệ</h1>
          <p className="lead">
            Gửi góp ý, báo lỗi hoặc đề xuất công cụ mới cho VietTools.
          </p>
        </header>
        <section>
          <h2>Email</h2>
          <p>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              style={{
                color: "var(--primary-dark)",
                textDecoration: "underline",
              }}
            >
              {siteConfig.contactEmail}
            </a>
          </p>
        </section>
      
      </article>
    </Container>
  );
}
