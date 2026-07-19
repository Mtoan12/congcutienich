import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@viettools/ui";
import { AdSlot } from "@/components/ad-slot";
import { NumberInputForm } from "@/features/number-to-vietnamese";
import { siteConfig } from "@/lib/site-config";

const title = "Chuyển số thành chữ tiếng Việt online";
const description =
  "Công cụ chuyển số thành chữ tiếng Việt miễn phí, hỗ trợ số lớn và tiền Việt Nam. Dữ liệu được xử lý trực tiếp trên trình duyệt.";
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/cong-cu/chuyen-so-thanh-chu" },
  openGraph: {
    title: `${title} | VietTools`,
    description,
    url: "/cong-cu/chuyen-so-thanh-chu",
    type: "website",
    locale: "vi_VN",
  },
  twitter: { card: "summary", title: `${title} | VietTools`, description },
  robots: { index: true, follow: true },
};

const faqs = [
  [
    "Công cụ có lưu số tôi nhập không?",
    "Không. Số được xử lý trong trình duyệt và không được gửi lên máy chủ.",
  ],
  ["Có hỗ trợ số âm không?", "Có. Hãy thêm dấu trừ trước số, ví dụ -125."],
  [
    "Có thể chuyển số tiền thành chữ không?",
    "Có. Bật tùy chọn đọc dưới dạng tiền Việt Nam để thêm từ “đồng”.",
  ],
  [
    "Công cụ có hoạt động trên điện thoại không?",
    "Có. Giao diện được thiết kế để dùng trên điện thoại, máy tính bảng và máy tính.",
  ],
  [
    "Tại sao số 21 được đọc là hai mươi mốt?",
    "Trong tiếng Việt, chữ số một ở hàng đơn vị được đọc là “mốt” khi hàng chục lớn hơn một.",
  ],
] as const;

export default function NumberToWordsPage() {
  const webApplication = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Chuyển số thành chữ tiếng Việt",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    url: new URL("/cong-cu/chuyen-so-thanh-chu", siteConfig.url).toString(),
    offers: { "@type": "Offer", price: "0", priceCurrency: "VND" },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
  return (
    <Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplication).replace(/</gu, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</gu, "\\u003c"),
        }}
      />
      <header className="page-header prose-width">
        <p className="eyebrow">Công cụ tiếng Việt</p>
        <h1>Chuyển số thành chữ tiếng Việt</h1>
        <p className="lead">
          Nhập một số để chuyển nhanh sang cách đọc bằng tiếng Việt. Dữ liệu
          được xử lý hoàn toàn trên trình duyệt.
        </p>
      </header>
      <div className="prose-width">
        <NumberInputForm />
        <AdSlot placement="below-tool" />
      </div>
      <article className="section prose-width content-stack">
        <section>
          <h2>Cách sử dụng</h2>
          <p>
            Nhập số cần chuyển vào ô phía trên. Bạn có thể nhập số nguyên có
            hoặc không có dấu phân tách hàng nghìn. Bật tùy chọn tiền Việt Nam
            nếu muốn thêm từ “đồng” vào cuối kết quả.
          </p>
        </section>
        <section>
          <h2>Ví dụ chuyển số thành chữ</h2>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Số</th>
                  <th>Cách đọc</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>15</td>
                  <td>mười lăm</td>
                </tr>
                <tr>
                  <td>105</td>
                  <td>một trăm linh năm</td>
                </tr>
                <tr>
                  <td>1.005</td>
                  <td>một nghìn không trăm linh năm</td>
                </tr>
                <tr>
                  <td>125.430</td>
                  <td>một trăm hai mươi lăm nghìn bốn trăm ba mươi</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section>
          <h2>Các trường hợp được hỗ trợ</h2>
          <ul>
            <li>Số nguyên dương và số nguyên âm</li>
            <li>Số có dấu phân tách hàng nghìn</li>
            <li>Đọc dưới dạng tiền Việt Nam</li>
            <li>Viết hoa chữ cái đầu</li>
            <li>Số lớn được xử lý bằng chuỗi để tránh mất độ chính xác</li>
          </ul>
        </section>
        <section className="privacy">
          <span aria-hidden="true">✓</span>
          <div>
            <h2>Quyền riêng tư</h2>
            <p>
              Nội dung bạn nhập được xử lý trực tiếp trong trình duyệt.
              VietTools không tải hoặc lưu trữ số bạn nhập trên máy chủ.
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
          <p>
            Các công cụ tiếng Việt mới sẽ được bổ sung trong giai đoạn tiếp
            theo.{" "}
            <Link
              href="/cong-cu"
              style={{
                color: "var(--primary-dark)",
                textDecoration: "underline",
              }}
            >
              Xem danh sách công cụ hiện có
            </Link>
            .
          </p>
        </section>
      </article>
      <AdSlot placement="content-bottom" />
    </Container>
  );
}
