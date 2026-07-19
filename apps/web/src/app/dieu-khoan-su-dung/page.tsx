import type { Metadata } from "next";
import { Container } from "@viettools/ui";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng",
  description: "Điều kiện áp dụng khi sử dụng các công cụ trên VietTools.",
  alternates: { canonical: "/dieu-khoan-su-dung" },
};
export default function TermsPage() {
  return (
    <Container>
      <article className="prose-width legal">
        <header className="page-header">
          <h1>Điều khoản sử dụng</h1>
          <p className="lead">Cập nhật lần cuối: 19/07/2026</p>
        </header>
        <section>
          <h2>Chấp nhận điều khoản</h2>
          <p>
            Khi sử dụng VietTools, bạn đồng ý với các điều khoản trên trang này.
            Nếu không đồng ý, vui lòng ngừng sử dụng website.
          </p>
        </section>
        <section>
          <h2>Trạng thái cung cấp</h2>
          <p>
            Công cụ được cung cấp theo trạng thái hiện có. Chúng tôi cố gắng đảm
            bảo độ chính xác nhưng không cam kết kết quả luôn hoàn toàn đúng
            hoặc dịch vụ không bao giờ gián đoạn.
          </p>
        </section>
        <section>
          <h2>Trách nhiệm của người dùng</h2>
          <p>
            Bạn có trách nhiệm kiểm tra kết quả trước khi dùng cho tài liệu tài
            chính, pháp lý hoặc dữ liệu quan trọng. Không sử dụng VietTools cho
            mục đích bất hợp pháp hoặc gây hại.
          </p>
        </section>
        <section>
          <h2>Thay đổi dịch vụ</h2>
          <p>
            VietTools có thể cập nhật tính năng và điều khoản để phản ánh thay
            đổi của dự án. Ngày cập nhật sẽ được ghi rõ trên trang này.
          </p>
        </section>
      </article>
    </Container>
  );
}
