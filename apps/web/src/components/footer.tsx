import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <strong>VietTools</strong>
          <p>Công cụ miễn phí, riêng tư và dễ sử dụng.</p>
          <small>© {new Date().getFullYear()} VietTools</small>
        </div>
        <nav className="footer-links" aria-label="Liên kết cuối trang">
          <Link href="/gioi-thieu">Giới thiệu</Link>
          <Link href="/lien-he">Liên hệ</Link>
          <Link href="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
          <Link href="/dieu-khoan-su-dung">Điều khoản sử dụng</Link>
        </nav>
      </div>
    </footer>
  );
}
