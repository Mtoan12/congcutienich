import type { Metadata } from "next";
import { Container } from "@viettools/ui";

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
  description: "Cách VietTools xử lý dữ liệu, cookies và dịch vụ bên thứ ba.",
  alternates: { canonical: "/chinh-sach-bao-mat" },
};
export default function PrivacyPage() {
  return (
    <Container>
      <article className="prose-width legal">
        <header className="page-header">
          <h1>Chính sách bảo mật</h1>
          <p className="lead">Cập nhật lần cuối: 19/07/2026</p>
        </header>
        <section>
          <h2>Nội dung nhập vào công cụ</h2>
          <p>
            VietTools không tải lên hoặc lưu trữ nội dung bạn nhập vào công cụ
            chuyển số thành chữ. Việc chuyển đổi diễn ra trực tiếp trong trình
            duyệt của bạn.
          </p>
        </section>
        <section>
          <h2>Thông tin kỹ thuật</h2>
          <p>
            Nền tảng lưu trữ có thể ghi nhận dữ liệu kỹ thuật tiêu chuẩn như địa
            chỉ IP, loại trình duyệt và thời điểm truy cập nhằm bảo mật, vận
            hành website.
          </p>
        </section>
        <section>
          <h2>Analytics và cookies</h2>
          <p>
            VietTools sử dụng Vercel Web Analytics và Speed Insights để đo lượt
            truy cập, tương tác tổng hợp và hiệu năng website. Nội dung bạn nhập
            vào các công cụ không được gửi cùng dữ liệu đo lường. VietTools chưa
            bật quảng cáo.
          </p>
        </section>
        <section>
          <h2>Dịch vụ bên thứ ba</h2>
          <p>
            Website được triển khai qua nhà cung cấp hạ tầng và có thể liên kết
            đến trang bên ngoài. Chính sách của bên thứ ba được áp dụng khi bạn
            truy cập dịch vụ của họ.
          </p>
        </section>
        <section>
          <h2>Liên hệ về dữ liệu</h2>
          <p>
            Nếu có câu hỏi về dữ liệu cá nhân hoặc chính sách này, vui lòng liên
            hệ qua thông tin trên trang Liên hệ.
          </p>
        </section>
      </article>
    </Container>
  );
}
