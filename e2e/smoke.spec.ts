import { expect, test, type Page } from "@playwright/test";

const browserErrors: string[] = [];
test.beforeEach(({ page }) => {
  browserErrors.length = 0;
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));
});
test.afterEach(() =>
  expect(browserErrors, "browser console/page errors").toEqual([]),
);

test("homepage loads", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Công cụ trực tuyến",
  );
});

test("directory lists 14 tools", async ({ page }) => {
  const response = await page.goto("/cong-cu");
  expect(response?.status()).toBe(200);
  await expect(page.getByText(/Tìm thấy/)).toContainText("14");
  await expect(page.locator(".tool-card")).toHaveCount(14);
});

test("diacritic-free search finds Vietnamese tool", async ({ page }) => {
  await page.goto("/cong-cu");
  await page.getByLabel("Tìm công cụ").fill("xoa dau");
  await expect(
    page.getByRole("link", { name: /Xóa dấu tiếng Việt/ }),
  ).toBeVisible();
});

test("number converter handles 125430", async ({ page }) => {
  await page.goto("/cong-cu/chuyen-so-thanh-chu");
  await page.getByLabel("Dữ liệu đầu vào").fill("125430");
  await expect(page.getByLabel("Kết quả")).toHaveValue(
    "một trăm hai mươi lăm nghìn bốn trăm ba mươi",
  );
});

test("JSON formatter formats JSON", async ({ page }) => {
  await page.goto("/cong-cu/json-formatter");
  await page
    .getByLabel("Dữ liệu đầu vào")
    .fill('{"name":"VietTools","items":[3,2,1]}');
  await expect(page.getByLabel("Kết quả")).toHaveValue(
    /\n  "name": "VietTools"/u,
  );
});

test("JWT decoder always shows signature warning", async ({ page }) => {
  await page.goto("/cong-cu/jwt-decoder");
  await expect(page.getByRole("note")).toContainText("không xác minh chữ ký");
});

test("mobile menu opens and closes with Escape", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/");
  const button = page.getByRole("button", { name: "Mở menu" });
  await button.click();
  await expect(
    page.getByRole("navigation", { name: "Điều hướng chính" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("navigation", { name: "Điều hướng chính" }),
  ).toBeHidden();
});

test("related tool link navigates to a valid route", async ({ page }) => {
  await page.goto("/cong-cu/xoa-dau-tieng-viet");
  const related = page.locator(".related-grid a").first();
  const target = await related.getAttribute("href");
  await related.click();
  await expect(page).toHaveURL(new RegExp(`${target}$`, "u"));
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("sitemap responds with all tool URLs", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.ok()).toBe(true);
  const body = await response.text();
  expect((body.match(/<loc>[^<]*\/cong-cu\//gu) ?? []).length).toBe(14);
});

test("robots responds and references sitemap", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.ok()).toBe(true);
  expect(await response.text()).toContain("sitemap.xml");
});

test("manifest and icon assets are public", async ({ request }) => {
  for (const path of [
    "/manifest.webmanifest",
    "/icon.png",
    "/favicon-32.png",
    "/apple-touch-icon.png",
    "/icon-192.png",
    "/icon-512.png",
  ]) {
    const response = await request.get(path);
    expect(response.ok(), path).toBe(true);
  }
  const manifest = await (await request.get("/manifest.webmanifest")).json();
  expect(manifest.start_url).toBe("/");
});

test("production security headers are present", async ({ request }) => {
  const response = await request.get("/");
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response.headers()["referrer-policy"]).toBe(
    "strict-origin-when-cross-origin",
  );
  expect(response.headers()["permissions-policy"]).toContain("camera=()");
  expect(response.headers()["x-frame-options"]).toBe("SAMEORIGIN");
});

test("unknown routes show a safe not-found page", async ({ page }) => {
  const response = await page.goto("/route-khong-ton-tai");
  expect(response?.status()).toBe(404);
  browserErrors.length = 0;
  await expect(page.getByRole("heading", { level: 1 })).toContainText("404");
  await expect(page.getByRole("link", { name: /công cụ/u })).toBeVisible();
});

test("tool input is not submitted over the network", async ({ page }) => {
  const leaks: string[] = [];
  const marker = "PRIVATE_INPUT_125430";
  page.on("request", (request) => {
    const payload = `${request.url()} ${request.postData() ?? ""}`;
    if (payload.includes(marker)) leaks.push(request.url());
  });
  await page.goto("/cong-cu/json-formatter");
  await page.getByLabel("Dữ liệu đầu vào").fill(`{"value":"${marker}"}`);
  await expect(page.getByLabel("Kết quả")).toHaveValue(new RegExp(marker, "u"));
  await page.waitForTimeout(250);
  expect(leaks).toEqual([]);
});

test("production metadata uses one secure canonical origin", async ({
  page,
}) => {
  test.skip(!process.env.PLAYWRIGHT_BASE_URL, "Production-only metadata audit");
  const expectedOrigin = new URL(process.env.PLAYWRIGHT_BASE_URL!).origin;
  for (const path of [
    "/",
    "/cong-cu",
    "/cong-cu/chuyen-so-thanh-chu",
    "/cong-cu/json-formatter",
    "/cong-cu/jwt-decoder",
  ]) {
    await page.goto(path);
    const canonicals = page.locator('link[rel="canonical"]');
    await expect(canonicals).toHaveCount(1);
    const canonical = await canonicals.getAttribute("href");
    expect(canonical).toBeTruthy();
    expect(new URL(canonical!).protocol).toBe("https:");
    expect(new URL(canonical!).origin).toBe(expectedOrigin);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      new RegExp(`^${expectedOrigin.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}`),
    );
  }
});

test("all tools render core UI without horizontal body overflow", async ({
  page,
}) => {
  const routes = [
    "chuyen-so-thanh-chu",
    "xoa-dau-tieng-viet",
    "tao-slug",
    "chuyen-chu-hoa-thuong",
    "dem-tu-ky-tu",
    "chuan-hoa-khoang-trang",
    "xoa-dong-trung",
    "sap-xep-danh-sach",
    "so-sanh-van-ban",
    "tim-va-thay-the",
    "xoa-dong-trong",
    "json-formatter",
    "json-sang-typescript",
    "jwt-decoder",
  ];
  await page.setViewportSize({ width: 320, height: 568 });
  for (const route of routes) {
    await page.goto(`/cong-cu/${route}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(
      page.getByLabel(/Dữ liệu đầu vào|JWT|Văn bản gốc/u),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
      route,
    ).toBe(true);
  }
});

test("all 14 tools execute their core browser flow", async ({ page }) => {
  const cases: Array<[string, string, string]> = [
    ["chuyen-so-thanh-chu", "15", "mười lăm"],
    ["xoa-dau-tieng-viet", "Tiếng Việt 😀", "Tieng Viet 😀"],
    ["tao-slug", "Công cụ xử lý tiếng Việt", "cong-cu-xu-ly-tieng-viet"],
    ["chuyen-chu-hoa-thuong", "XIN CHÀO", "xin chào"],
    ["chuan-hoa-khoang-trang", "Xin   chào , bạn", "Xin chào, bạn"],
    ["xoa-dong-trung", "Apple\nApple\nbanana", "Apple\nbanana"],
    ["sap-xep-danh-sach", "b\na", "a\nb"],
    ["xoa-dong-trong", "a\n\n b", "a\n b"],
    ["json-formatter", '{"b":1,"a":2}', '{\n  "b": 1,\n  "a": 2\n}'],
    ["json-sang-typescript", '{"name":"VietTools"}', "export interface Root"],
  ];
  for (const [route, input, expected] of cases) {
    await page.goto(`/cong-cu/${route}`);
    await page.getByLabel("Dữ liệu đầu vào").fill(input);
    const escaped = expected.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
    await expect(page.getByLabel("Kết quả")).toHaveValue(
      new RegExp(escaped, "u"),
    );
  }
  await page.goto("/cong-cu/dem-tu-ky-tu");
  await page.getByLabel("Dữ liệu đầu vào").fill("Việt 😀");
  await expect(
    page
      .locator(".stat")
      .filter({ hasText: "Ký tự Unicode" })
      .locator("strong"),
  ).toHaveText("6");
  await page.goto("/cong-cu/so-sanh-van-ban");
  await page.getByLabel("Văn bản gốc").fill("a\nb");
  await page.getByLabel("Văn bản mới").fill("x\na\nb");
  await expect(page.getByLabel("Kết quả")).toHaveValue("+ x\n  a\n  b");
  await page.goto("/cong-cu/tim-va-thay-the");
  await page.getByLabel("Dữ liệu đầu vào").fill("a a");
  await page.getByLabel("Tìm").fill("a");
  await page.getByLabel("Thay bằng").fill("x");
  await expect(page.getByLabel("Kết quả")).toHaveValue("x x");
  await page.goto("/cong-cu/jwt-decoder");
  await page.getByLabel("JWT").fill("eyJhbGciOiJub25lIn0.eyJzdWIiOiIxIn0.eA");
  await expect(page.getByLabel("Kết quả")).toHaveValue(
    /Payload[\s\S]*"sub": "1"/u,
  );
});

test("responsive matrix has no body overflow", async ({ page }) => {
  const viewports = [
    { width: 320, height: 568 },
    { width: 375, height: 667 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 1440, height: 900 },
  ];
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/cong-cu/so-sanh-van-ban");
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
      `${viewport.width}x${viewport.height}`,
    ).toBe(true);
    await expect(page.locator(".site-header")).toBeVisible();
    await expect(page.locator(".site-footer")).toBeVisible();
    await expect(page.locator(".ad-slot")).toHaveCount(0);
  }
});

test("skip link and tool controls work from the keyboard", async ({ page }) => {
  await page.goto("/cong-cu/tim-va-thay-the");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main-content$/u);
  await page.getByLabel("Dữ liệu đầu vào").fill("abc");
  await page.getByLabel("Tìm").fill("[");
  await page.getByLabel("Regex").check();
  await expect(page.getByLabel("Dữ liệu đầu vào")).toHaveAttribute(
    "aria-describedby",
    "tim-va-thay-the-error",
  );
  await expect(page.locator("#tim-va-thay-the-error")).toHaveAttribute(
    "id",
    "tim-va-thay-the-error",
  );
});
