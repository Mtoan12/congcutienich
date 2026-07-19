import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@viettools/ui";

export const metadata: Metadata = {
  title: "Không tìm thấy trang",
  description: "Trang bạn yêu cầu không tồn tại trên VietTools.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Container>
      <article className="prose-width legal">
        <header className="page-header">
          <p className="eyebrow">Lỗi 404</p>
          <h1>404 — Không tìm thấy trang</h1>
          <p className="lead">
            Đường dẫn có thể đã thay đổi hoặc không tồn tại.
          </p>
        </header>
        <p>
          <Link href="/cong-cu">Xem danh sách công cụ</Link> hoặc{" "}
          <Link href="/">quay về trang chủ</Link>.
        </p>
      </article>
    </Container>
  );
}
