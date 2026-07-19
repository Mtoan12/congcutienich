import Link from "next/link";
import { Container } from "@viettools/ui";
import { ToolCard } from "@/components/tool-card";
import { availableTools, toolCategories } from "@/lib/tool-registry";
export default function HomePage() {
  const featured = availableTools.filter((tool) => tool.featured).slice(0, 8);
  return (
    <>
      <section className="hero">
        <Container>
          <p className="eyebrow">Nhanh · Riêng tư · Miễn phí</p>
          <h1>Công cụ trực tuyến dành cho người Việt</h1>
          <p className="lead">
            Xử lý văn bản và dữ liệu ngay trên trình duyệt, không cần tài khoản.
          </p>
          <p className="pt-4">
            <Link className="button button-primary" href="/cong-cu">
              Khám phá {availableTools.length} công cụ
            </Link>
          </p>
        </Container>
      </section>
      <section className="section">
        <Container>
          <h2>Công cụ nổi bật</h2>
          <div className="grid">
            {featured.map((tool) => (
              <ToolCard tool={tool} key={tool.id} />
            ))}
          </div>
          <p className="center-cta">
            <Link className="button button-secondary" href="/cong-cu">
              Xem toàn bộ công cụ
            </Link>
          </p>
        </Container>
      </section>
      <section className="section section-muted">
        <Container>
          <h2>Khám phá theo danh mục</h2>
          <div className="category-grid">
            {Object.entries(toolCategories)
              .filter(([key]) => key !== "generator")
              .map(([key, label]) => (
                <Link
                  className="card"
                  href={`/cong-cu?category=${key}`}
                  key={key}
                >
                  <strong>{label}</strong>
                  <p>
                    {
                      availableTools.filter((tool) => tool.category === key)
                        .length
                    }{" "}
                    công cụ đang hoạt động
                  </p>
                </Link>
              ))}
          </div>
        </Container>
      </section>
    </>
  );
}
