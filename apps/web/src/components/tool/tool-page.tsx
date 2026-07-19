import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@viettools/ui";
import { AdSlot } from "@/components/ad-slot";
import {
  getTool,
  availableTools,
  toolCategories,
  toolContent,
} from "@/lib/tool-registry";
import { siteConfig } from "@/lib/site-config";
import { ToolWorkbench } from "./tool-workbench";

export function createToolMetadata(id: string): Metadata {
  const tool = getTool(id);
  const title = `${tool.name} online miễn phí`;
  const description = `${tool.shortDescription} Xử lý riêng tư ngay trong trình duyệt, không tải dữ liệu lên máy chủ.`;
  return {
    title,
    description,
    alternates: { canonical: tool.path },
    openGraph: {
      title: `${title} | VietTools`,
      description,
      url: tool.path,
      type: "website",
      locale: "vi_VN",
    },
    twitter: { card: "summary", title: `${title} | VietTools`, description },
  };
}

export function ToolPage({ id }: { id: string }) {
  const tool = getTool(id);
  const content = toolContent[id]!;
  const related = availableTools
    .filter((item) => item.id !== id && item.category === tool.category)
    .slice(0, 3);
  const faqs = [
    [
      `${tool.name} có gửi dữ liệu lên máy chủ không?`,
      "Không. Nội dung được xử lý trực tiếp trong trình duyệt và không được lưu lại.",
    ],
    [
      "Công cụ có dùng được trên điện thoại không?",
      "Có. Giao diện hỗ trợ màn hình nhỏ, bàn phím và thiết bị cảm ứng.",
    ],
    [
      "Tôi có cần đăng ký tài khoản không?",
      "Không. Công cụ miễn phí và không yêu cầu đăng nhập.",
    ],
  ] as const;
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: tool.name,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      url: new URL(tool.path, siteConfig.url).toString(),
      offers: { "@type": "Offer", price: "0", priceCurrency: "VND" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Trang chủ",
          item: siteConfig.url.toString(),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Công cụ",
          item: new URL("/cong-cu", siteConfig.url).toString(),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: tool.name,
          item: new URL(tool.path, siteConfig.url).toString(),
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ];
  return (
    <Container>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</gu, "\\u003c"),
          }}
        />
      ))}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span>/</span>
        <Link href="/cong-cu">Công cụ</Link>
        <span>/</span>
        <span aria-current="page">{tool.name}</span>
      </nav>
      <header className="page-header prose-width">
        <p className="eyebrow">{toolCategories[tool.category]}</p>
        <h1>{tool.name}</h1>
        <p className="lead">
          {tool.shortDescription} Mọi thao tác diễn ra cục bộ trên thiết bị của
          bạn.
        </p>
      </header>
      <div className="prose-width">
        <ToolWorkbench toolId={id} />
        <AdSlot placement="below-tool" />
      </div>
      <article className="section prose-width content-stack">
        <section>
          <h2>Cách sử dụng {tool.name.toLocaleLowerCase("vi")}</h2>
          <p>{content.usage}</p>
        </section>
        <section>
          <h2>Ví dụ thực tế</h2>
          <p>{content.example}</p>
        </section>
        <section>
          <h2>Giới hạn và lưu ý</h2>
          <p>{content.note}</p>
        </section>
        <section className="privacy">
          <span aria-hidden="true">✓</span>
          <div>
            <h2>Quyền riêng tư</h2>
            <p>
              VietTools không gửi, lưu hay gắn nội dung nhập/kết quả vào
              analytics, URL hoặc localStorage.
            </p>
          </div>
        </section>
        <section>
          <h2>Câu hỏi thường gặp</h2>
          {faqs.map(([question, answer]) => (
            <details className="faq" key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </section>
        <section>
          <h2>Công cụ liên quan</h2>
          <div className="related-grid">
            {related.map((item) => (
              <Link className="card" href={item.path} key={item.id}>
                <strong>{item.name}</strong>
                <p>{item.shortDescription}</p>
              </Link>
            ))}
          </div>
        </section>
      </article>
      <AdSlot placement="content-bottom" />
    </Container>
  );
}
