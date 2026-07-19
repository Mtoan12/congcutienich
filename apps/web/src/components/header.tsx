"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="VietTools - Trang chủ">
          <span className="brand-mark" aria-hidden="true">
            <Image src="/icon.png" alt="" width={40} height={40} priority />
          </span>
          VietTools
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? "Đóng menu" : "Mở menu"}
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span aria-hidden="true">{open ? "×" : "☰"}</span>
        </button>
        <nav
          id="main-navigation"
          className="nav"
          aria-label="Điều hướng chính"
          data-open={open}
        >
          <Link href="/cong-cu" onClick={() => setOpen(false)}>
            Công cụ
          </Link>
          <Link href="/gioi-thieu" onClick={() => setOpen(false)}>
            Giới thiệu
          </Link>
          <Link href="/lien-he" onClick={() => setOpen(false)}>
            Liên hệ
          </Link>
        </nav>
      </div>
    </header>
  );
}
