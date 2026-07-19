import { defineConfig, devices } from "@playwright/test";

const localBaseUrl = "http://127.0.0.1:3100";
const baseURL = process.env.PLAYWRIGHT_BASE_URL || localBaseUrl;
const testsProduction = Boolean(process.env.PLAYWRIGHT_BASE_URL);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: "line",
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: testsProduction
    ? undefined
    : {
        command:
          "pnpm --filter @viettools/web build && pnpm --filter @viettools/web start --hostname 127.0.0.1 --port 3100",
        url: localBaseUrl,
        reuseExistingServer: false,
        timeout: 120_000,
      },
});
