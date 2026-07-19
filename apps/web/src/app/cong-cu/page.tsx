import type { Metadata } from "next";
import { Container } from "@viettools/ui";
import { ToolDirectory } from "@/components/tool/tool-directory";
export const metadata: Metadata = {
  title: "Công cụ trực tuyến",
  description:
    "Tìm kiếm các công cụ tiếng Việt, văn bản và developer miễn phí.",
  alternates: { canonical: "/cong-cu" },
};
export default function ToolsPage() {
  return (
    <Container>
      <header className="page-header">
        <p className="eyebrow">Thư viện công cụ</p>
        <h1>Công cụ trực tuyến</h1>
        <p className="lead">
          Tìm và sử dụng các tiện ích riêng tư ngay trong trình duyệt.
        </p>
      </header>
      <ToolDirectory />
    </Container>
  );
}
