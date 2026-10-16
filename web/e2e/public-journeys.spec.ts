import { test, expect } from "@playwright/test";

test("landing is useful without WebGL, responsive, and links to real sign-in", async ({
  page,
}, testInfo) => {
  const exceptions: string[] = [];
  page.on("pageerror", (error) => exceptions.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /A little practice.*A clearer path/,
  );
  await expect(page.getByRole("link", { name: "Find your starting point" })).toBeVisible();
  expect(await page.locator("canvas").count()).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({ path: testInfo.outputPath("home.png"), fullPage: true });
  await page.getByRole("link", { name: "Find your starting point" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByLabel("Email address")).toBeVisible();
  expect(exceptions).toEqual([]);
});

test("theme choice persists and book works with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: "Open the CrysLearn book" }).click();
  const book = page.getByRole("dialog", { name: "A new chapter starts here." });
  await expect(book).toBeVisible();
  expect(await book.locator("canvas").count()).toBe(0);
  await expect(book.getByRole("link", { name: "Start studying" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(book).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Open the CrysLearn book" })).toBeFocused();
});

test("private pages require sign-in and keep the requested destination", async ({ page }) => {
  for (const destination of [
    "/dashboard",
    "/exams/jamb/subjects",
    "/schedule",
    "/chat",
    "/parent",
    "/settings",
    "/offline",
  ]) {
    await page.goto(destination);
    await expect(page).toHaveURL(new RegExp("/login\\?redirect="));
    const url = new URL(page.url());
    expect(url.searchParams.get("redirect")).toBe(destination);
    await expect(page.getByLabel("Email address")).toBeVisible();
  }
});

test("sign-in form supports keyboard validation, signup, and password visibility", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  expect(
    await page
      .getByLabel("Email address")
      .evaluate((input: HTMLInputElement) => input.validity.valueMissing),
  ).toBe(true);
  await page.getByRole("button", { name: "Create an account", exact: true }).click();
  await expect(page.getByLabel("Full name")).toBeVisible();
  await page.getByLabel("Password", { exact: true }).fill("short");
  await page.getByRole("button", { name: "Show password" }).click();
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute("type", "text");
  expect(
    await page
      .getByLabel("Password", { exact: true })
      .evaluate((input: HTMLInputElement) => input.validity.tooShort),
  ).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});

test("callback errors are recoverable and health reports the expected app", async ({
  page,
  request,
}) => {
  await page.goto("/api/auth/callback?next=https://untrusted.invalid");
  await expect(page).toHaveURL(/\/login\?error=auth_callback_failed/);
  await expect(page.locator("#auth-error")).toContainText("couldn't complete sign-in");
  const health = await request.get("/api/health");
  expect(health.status()).toBe(200);
  expect(await health.json()).toMatchObject({ status: "healthy", app: "CrysLearn" });
  expect(health.headers()["x-content-type-options"]).toBe("nosniff");
});

test("exam and payment APIs reject anonymous requests", async ({ request }) => {
  const questions = await request.get("/api/exams/jamb/questions");
  expect(questions.status()).toBe(401);
  const payment = await request.post("/api/payments/initialize", {
    data: { exam_slug: "jamb", email: "someone@example.invalid" },
  });
  expect(payment.status()).toBe(401);
  const invalidWebhook = await request.post("/api/payments/webhook", {
    data: { event: "charge.success" },
  });
  expect([401, 503]).toContain(invalidWebhook.status());
});
