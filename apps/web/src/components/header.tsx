"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);
  const current = (href: string) =>
    href === "/cong-cu" ? pathname.startsWith(href) : pathname === href;
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
          {open ? (
            <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24">
              <path
                d="m6 6 12 12M18 6 6 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          )}
        </button>
        <nav
          id="main-navigation"
          className="nav"
          aria-label="Điều hướng chính"
          data-open={open}
        >
          <Link
            href="/cong-cu"
            aria-current={current("/cong-cu") ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            Công cụ
          </Link>
          <Link
            href="/gioi-thieu"
            aria-current={current("/gioi-thieu") ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            Giới thiệu
          </Link>
          <Link
            href="/lien-he"
            aria-current={current("/lien-he") ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            Liên hệ
          </Link>
        </nav>
      </div>
    </header>
  );
}
