# VietTools

VietTools là bộ công cụ tiếng Việt, xử lý văn bản và dữ liệu dành cho trình duyệt. Phase 2 có 14 công cụ hoạt động, không có backend và không gửi dữ liệu người dùng lên máy chủ.

## Công cụ hiện có

- Tiếng Việt: Chuyển số thành chữ, Xóa dấu, Tạo slug, Chuyển kiểu chữ, Đếm từ và ký tự.
- Văn bản: Chuẩn hóa khoảng trắng, Xóa dòng trùng, Sắp xếp danh sách, So sánh văn bản, Tìm và thay thế, Xóa dòng trống.
- Developer: JSON Formatter & Validator, JSON sang TypeScript, JWT Decoder.

## Kiến trúc

```text
apps/web                         Next.js App Router và shared tool UI
apps/web/src/lib/tool-registry.ts Nguồn dữ liệu duy nhất cho tool
packages/vietnamese-utils        Pure utilities tiếng Việt
packages/text-utils              Pure text utilities
packages/developer-utils         Pure JSON, TypeScript và JWT utilities
packages/ui                      UI primitives dùng chung
```

Registry cung cấp dữ liệu cho trang chủ, `/cong-cu`, search/filter, related tools và sitemap. Các route dùng `ToolPage` và `ToolWorkbench` để chia sẻ breadcrumb, input/output, actions, privacy, FAQ, JSON-LD và responsive layout.

## Local development

Yêu cầu Node.js 22+ và pnpm 10+.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Environment variables tùy chọn:

- `NEXT_PUBLIC_SITE_URL`: URL dùng cho canonical, sitemap và JSON-LD.
- `NEXT_PUBLIC_SITE_NAME`: tên website.
- `NEXT_PUBLIC_CONTACT_EMAIL`: email hiển thị trên trang liên hệ.
- `NEXT_PUBLIC_GITHUB_URL`: GitHub hiển thị trên trang liên hệ.
- `NEXT_PUBLIC_ANALYTICS_ID`: chỉ bật abstraction event cục bộ; chưa có provider thật.

## How to add a new tool

1. Tạo pure utility trong package phù hợp và export qua `src/index.ts`.
2. Viết unit test, gồm empty/invalid/options/Unicode nếu liên quan.
3. Đăng ký tool một lần trong `apps/web/src/lib/tool-registry.ts`.
4. Tạo route mỏng dùng `ToolPage`; thêm nghiệp vụ vào workbench/component chuyên biệt.
5. Thêm metadata, hướng dẫn, ví dụ, privacy và FAQ hiển thị thật.
6. Chọn related tools qua category/registry, không hard-code danh sách ở page.
7. Chạy `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:coverage` và `pnpm build`.

Để thêm utility package, tạo workspace dưới `packages/`, cung cấp typed exports, `build/lint/typecheck/test/test:coverage`, Vitest thresholds và thêm dependency workspace vào consumer.

## Testing

Utility packages áp dụng coverage: statements/functions/lines ≥90%, branches ≥85%. Vitest và React Testing Library kiểm tra utilities, clipboard fallback, registry search/filter và các tương tác quan trọng của tool.

## Privacy principles

Input/output được xử lý client-side, không lưu trong localStorage, không đưa vào URL và không gửi trong analytics. JWT chỉ được decode, không xác minh chữ ký. Không có account, database, payment, cloud storage hoặc AI API.

## Scripts

`pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:coverage`, `pnpm format`, `pnpm format:check`.

### E2E smoke tests

```bash
pnpm exec playwright install chromium
pnpm test:e2e
```

Playwright khởi động web app cục bộ và chạy Chromium smoke tests cho homepage, directory/search, các luồng đại diện, mobile menu, internal links, sitemap và robots.

## Deployment và roadmap

Deployment được để dành cho phase sau. Trước deployment cần cấu hình domain/environment production, provider analytics/quảng cáo nếu được phê duyệt, kiểm tra trình duyệt thật và thiết lập CI release. Roadmap tiếp theo tập trung hardening, E2E smoke, performance profiling và deployment preparation.

## License

[MIT](LICENSE)
