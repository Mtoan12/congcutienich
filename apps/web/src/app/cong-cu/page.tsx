import type { Metadata } from "next";
import { Container } from "@viettools/ui";
import { ToolCard } from "@/components/tool-card";

export const metadata: Metadata = {
  title: "Công cụ trực tuyến",
  description: "Danh sách công cụ tiếng Việt miễn phí đang có trên VietTools.",
  alternates: { canonical: "/cong-cu" },
};
export default function ToolsPage() {
  return (
    <Container>
      <header className="page-header">
        <p className="eyebrow">Thư viện công cụ</p>
        <h1>Công cụ trực tuyến</h1>
        <p className="lead">
          Các tiện ích đã hoàn thành, hoạt động trực tiếp trong trình duyệt.
        </p>
      </header>
      <section className="section">
        <h2>Công cụ tiếng Việt</h2>
        <div className="grid">
          <ToolCard />
        </div>
      </section>
    </Container>
  );
}
