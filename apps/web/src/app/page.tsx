import Link from "next/link";
import { Container } from "@viettools/ui";
import { ShieldIcon } from "@/components/icons";
import { ToolCard } from "@/components/tool-card";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <Container>
          {/* <p className="eyebrow">Nhanh · Riêng tư · Miễn phí</p> */}
          <h1>Công cụ trực tuyến miễn phí dành cho người Việt</h1>
          <p className="lead">
            Xử lý văn bản, dữ liệu và nội dung tiếng Việt nhanh chóng ngay trên
            trình duyệt.
          </p>
          <p className="pt-4">
            <Link className="button button-primary" href="/cong-cu">
              Khám phá công cụ
            </Link>
          </p>
        </Container>
      </section>
      <section className="section pt-0">
        <Container>
          <h2>Công cụ nổi bật</h2>
          <div className="grid">
            <ToolCard />
          </div>
        </Container>
      </section>
    </>
  );
}
