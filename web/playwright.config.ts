import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 2,
  timeout: 30_000,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "retain-on-failure",
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || "/usr/bin/chromium",
      args: ["--no-sandbox"],
    },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } },
  ],
  webServer: [
    {
      command: "node web/e2e/fixtures/supabase.mjs",
      cwd: "..",
      url: "http://127.0.0.1:54329/health",
      reuseExistingServer: false,
      timeout: 15_000,
    },
    {
      command: "npm run start --workspace=web -- --hostname 127.0.0.1 --port 3100",
      cwd: "..",
      url: "http://127.0.0.1:3100/api/health",
      reuseExistingServer: false,
      timeout: 60_000,
    },
  ],
});
