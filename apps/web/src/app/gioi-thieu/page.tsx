import type { Metadata } from "next";
import { Container } from "@viettools/ui";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description:
    "Tìm hiểu mục tiêu, nguyên tắc riêng tư và cách VietTools hoạt động.",
  alternates: { canonical: "/gioi-thieu" },
};
export default function AboutPage() {
  return (
    <Container>
      <article className="prose-width legal">
        <header className="page-header">
          <h1>Giới thiệu VietTools</h1>
          <p className="lead">
            Những công cụ nhỏ, hữu ích và tôn trọng quyền riêng tư dành cho
            người Việt.
          </p>
        </header>
        <section>
          <h2>VietTools là gì?</h2>
          <p>
            VietTools là website tổng hợp các tiện ích xử lý văn bản và dữ liệu
            tiếng Việt miễn phí. Dự án tập trung vào trải nghiệm đơn giản, tốc
            độ nhanh và kết quả dễ kiểm tra.
          </p>
        </section>
        <section>
          <h2>Mục tiêu của dự án</h2>
          <p>
            Chúng tôi muốn giúp những công việc lặp lại hằng ngày trở nên nhanh
            hơn trên mọi thiết bị, không yêu cầu tài khoản hay cài đặt phần mềm.
          </p>
        </section>
        <section>
          <h2>Dữ liệu ở lại trên thiết bị</h2>
          <p>
            Các công cụ được ưu tiên xử lý hoàn toàn trong trình duyệt. Nội dung
            bạn nhập không được gửi lên máy chủ của VietTools.
          </p>
        </section>
        <section>
          <h2>Miễn phí để sử dụng</h2>
          <p>
            Các công cụ hiện có được cung cấp miễn phí. VietTools có thể hiển
            thị quảng cáo trong tương lai để duy trì hoạt động, nhưng không đặt
            quảng cáo làm ảnh hưởng thao tác chính.
          </p>
        </section>
      </article>
    </Container>
  );
}
