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

Sao chép `.env.example` thành `.env` cho local development. Không commit file
`.env` hoặc token. Các biến:

- `NEXT_PUBLIC_SITE_URL`: URL dùng cho canonical, sitemap và JSON-LD.
- `NEXT_PUBLIC_SITE_NAME`: tên website.
- `NEXT_PUBLIC_CONTACT_EMAIL`: email hiển thị trên trang liên hệ.
- `NEXT_PUBLIC_GITHUB_URL`: GitHub hiển thị trên trang liên hệ.
- `NEXT_PUBLIC_ADSENSE_CLIENT_ID`: giữ trống; quảng cáo thật chưa được tích hợp.
- Vercel Web Analytics và Speed Insights không cần biến môi trường; cần bật hai
  tính năng này trong dashboard của Vercel.

Các giá trị tùy chọn rỗng không tạo link hay placeholder. URL GitHub sai định
dạng cũng không được render. Production bắt buộc dùng `NEXT_PUBLIC_SITE_URL`
HTTPS thực tế và một `NEXT_PUBLIC_CONTACT_EMAIL` phù hợp.

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

Để smoke test domain production mà không khởi động server local:

```bash
PLAYWRIGHT_BASE_URL=https://your-domain.example pnpm test:e2e
```

Suite production kiểm tra thêm canonical HTTPS và Open Graph origin. Không đặt
URL production trực tiếp trong source.

## Production deployment (Vercel)

Cấu hình khuyến nghị cho pnpm/Turborepo monorepo:

- Import Git repository vào Vercel, Framework Preset `Next.js`.
- Root Directory: `apps/web` (Vercel vẫn phát hiện workspace và dùng lockfile ở
  repository root).
- Package manager: pnpm; Node.js: 22.x.
- Install Command: `pnpm install --frozen-lockfile`.
- Build Command: `cd ../.. && pnpm turbo build --filter=@viettools/web`.
- Output Directory: để trống, dùng Next.js managed output.
- Production branch: `master` (hoặc đổi theo branch release thực tế trước khi
  kết nối Git).

Không cần `vercel.json`; dashboard monorepo settings tránh ghi đè Next.js
managed output. Trước lần deploy đầu, cấu hình Production environment variables:

```text
NEXT_PUBLIC_SITE_URL=https://domain-thuc-te.example
NEXT_PUBLIC_SITE_NAME=VietTools
NEXT_PUBLIC_CONTACT_EMAIL=dia-chi-lien-he-hop-le
NEXT_PUBLIC_GITHUB_URL=
NEXT_PUBLIC_ADSENSE_CLIENT_ID=
```

Với deployment hiện tại, đặt `NEXT_PUBLIC_SITE_URL` thành
`https://congcutienich-psi.vercel.app`. Nếu bỏ biến này, ứng dụng tự dùng
`VERCEL_PROJECT_PRODUCTION_URL` do Vercel cung cấp. Kết nối custom domain trước
khi coi URL là canonical cuối cùng, cập nhật `NEXT_PUBLIC_SITE_URL`, rồi redeploy
Production. Trong dashboard dự án, bật **Web Analytics** và **Speed Insights**;
sau đó deploy lại để Vercel bắt đầu thu thập dữ liệu. Chỉ khi deployment ở trạng
thái Ready mới chạy smoke test production ở trên.

### Launch operations

- Search Console: tạo Domain hoặc URL-prefix property, xác minh quyền sở hữu,
  submit `https://domain-thuc-te.example/sitemap.xml`; chỉ request indexing trang
  chủ, `/cong-cu` và 2–3 công cụ chính ban đầu.
- Availability: theo dõi Vercel deployment status; có thể tạo monitor HTTPS cho
  `/` bằng UptimeRobot hoặc Better Stack sau khi chủ dự án có tài khoản.
- Errors: theo dõi build/function logs và console error từ Playwright. Chưa thêm
  Sentry khi không có DSN.
- CSP đầy đủ được hoãn đến khi chốt analytics/AdSense để không khóa nhầm script
  Next.js hay provider tương lai. Các header `nosniff`, referrer, permissions và
  chống iframe đã bật trong `next.config.ts`.
- Lighthouse mobile cần chạy trên `/`, `/cong-cu/chuyen-so-thanh-chu` và
  `/cong-cu/json-formatter` sau khi custom domain hoạt động; ghi lại cả bốn score.

## License

[MIT](LICENSE)
