import { randomUUID } from "node:crypto";
import { test, expect, type Page } from "@playwright/test";
import { fixtureCookie, fixtureSession, FIXTURE_SUPABASE_URL } from "./fixtures/supabase.mjs";

const QUESTION_ID = "20000000-0000-4000-a000-000000000001";
const QUESTION = {
  id: QUESTION_ID,
  subject: "Mathematics",
  year: 2025,
  question_text: "What is the value of 2 + 3?",
  options: [
    { label: "A", text: "Four" },
    { label: "B", text: "Five" },
    { label: "C", text: "Six" },
    { label: "D", text: "Seven" },
  ],
};

test.beforeEach(async ({ context }, testInfo) => {
  const session = fixtureSession(`${testInfo.project.name}:${testInfo.title}:${randomUUID()}`);
  await context.addCookies([{ ...fixtureCookie(session), sameSite: "Lax" }]);
});

test("local auth fixture rejects missing and incorrectly signed tokens", async ({ request }) => {
  const missing = await request.get(`${FIXTURE_SUPABASE_URL}/auth/v1/user`);
  expect(missing.status()).toBe(401);
  const session = fixtureSession("invalid-signature-check");
  const parts = session.access_token.split(".");
  parts[2] = Buffer.alloc(32, 0).toString("base64url");
  const invalid = await request.get(`${FIXTURE_SUPABASE_URL}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${parts.join(".")}` },
  });
  expect(invalid.status()).toBe(401);
  const valid = await request.get(`${FIXTURE_SUPABASE_URL}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  expect(valid.status()).toBe(200);
  expect((await valid.json()).id).toBe(session.user.id);
});

test("authenticated dashboard shows an honest empty result state and responsive navigation", async ({
  page,
}, testInfo) => {
  const exceptions: string[] = [];
  page.on("pageerror", (error) => exceptions.push(error.message));
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Ada, keep moving forward." })).toBeVisible();
  await expect(
    page.getByText("Your first completed mock will start the story.", { exact: false }),
  ).toBeVisible();
  const stats = page.locator("dl dd");
  await expect(stats).toHaveText(["0", "—", "—"]);
  await expect(page.getByText("124", { exact: true })).toHaveCount(0);
  const navigation = page
    .getByRole("navigation", { name: "Study navigation" })
    .filter({ visible: true });
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Overview" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(navigation.getByRole("link", { name: "Study planner" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  if (testInfo.project.name === "mobile") {
    await navigation.getByRole("link", { name: "Settings" }).scrollIntoViewIfNeeded();
    await expect(navigation.getByRole("link", { name: "Settings" })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
  expect(exceptions).toEqual([]);
});

test("payment verification failures have a useful, dismissible message", async ({ page }) => {
  await page.goto("/dashboard?payment=error");
  await expect(
    page.getByRole("region", { name: "Payment status" }).getByRole("alert"),
  ).toContainText("We could not verify your payment");
  await expect(page.getByRole("link", { name: "Check exam access" })).toHaveAttribute(
    "href",
    "/exams",
  );
  await page.getByRole("link", { name: "Dismiss", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("region", { name: "Payment status" })).toHaveCount(0);
});

test("planner supports keyboard dismissal, saved reloads and accessible task removal", async ({
  page,
}) => {
  await page.goto("/schedule");
  const addButton = page.getByRole("button", { name: "Add a task", exact: true });
  await addButton.click();
  const dialog = page.getByRole("dialog", { name: "A task for Monday" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel("What will you work on?")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(addButton).toBeFocused();
  await addButton.click();
  await dialog.getByLabel("Subject", { exact: true }).selectOption("Mathematics");
  await dialog.getByLabel("What will you work on?").fill("Quadratic equations");
  await dialog.getByRole("button", { name: "Add task", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.getByText("Quadratic equations", { exact: true })).toBeVisible();
  await expect(page.getByText("You have unsaved changes")).toBeVisible();
  await page.getByRole("button", { name: "Save plan", exact: true }).click();
  await expect(page.getByText("Your plan is saved on this browser.")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Quadratic equations", { exact: true })).toBeVisible();
  const removeButton = page.getByRole("button", {
    name: "Remove Quadratic equations from Monday morning",
  });
  await removeButton.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Quadratic equations", { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Save plan", exact: true }).click();
  await page.reload();
  await expect(page.getByText("0 study tasks this week")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});

test("planner reports blocked browser storage instead of claiming a save", async ({ page }) => {
  await page.addInitScript(() => {
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key: string, value: string) {
      if (key.startsWith("cryslearn-schedule:"))
        throw new DOMException("Fixture storage is full", "QuotaExceededError");
      return originalSetItem.call(this, key, value);
    };
  });
  await page.goto("/schedule");
  await page.getByRole("button", { name: "Add a task", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "A task for Monday" });
  await dialog.getByLabel("What will you work on?").fill("Review algebra");
  await dialog.getByRole("button", { name: "Add task", exact: true }).click();
  await page.getByRole("button", { name: "Save plan", exact: true }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "Your plan could not be saved",
  );
  await expect(page.getByText("You have unsaved changes")).toBeVisible();
  await expect(page.getByText("Your plan is saved on this browser.")).toHaveCount(0);
});

test("settings preserves the edit on a failed save and succeeds on retry", async ({ page }) => {
  let failedOnce = false;
  await page.route(`${FIXTURE_SUPABASE_URL}/rest/v1/users?*`, async (route) => {
    if (route.request().method() === "PATCH" && !failedOnce) {
      failedOnce = true;
      return route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ message: "Fixture profile service unavailable" }),
      });
    }
    return route.continue();
  });
  await page.goto("/settings");
  await page.getByRole("button", { name: "Edit name", exact: true }).click();
  await page.getByLabel("Display name", { exact: true }).fill("Ada Refined");
  await page.getByRole("button", { name: "Save name", exact: true }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "Your name could not be saved",
  );
  await expect(page.getByLabel("Display name", { exact: true })).toHaveValue("Ada Refined");
  await page.getByRole("button", { name: "Save name", exact: true }).click();
  await expect(page.getByText("Your name has been updated.")).toBeVisible();
  await expect(page.getByText("Ada Refined", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Ada Refined", { exact: true })).toBeVisible();
});

test("unavailable parent sharing, AI and downloads never claim to provide access", async ({
  page,
}) => {
  await page.goto("/parent");
  await expect(
    page.getByRole("heading", { name: "Student progress stays private." }),
  ).toBeVisible();
  await expect(
    page.getByText("Parent account linking is not available yet.", { exact: false }),
  ).toBeVisible();
  await expect(page.getByPlaceholder("Paste student ID here")).toHaveCount(0);
  await page.goto("/offline");
  await expect(
    page.getByRole("heading", { name: "Question downloads aren't available yet." }),
  ).toBeVisible();
  await page.goto("/chat");
  await expect(page.getByText("Not available yet", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Practise past questions" })).toHaveAttribute(
    "href",
    "/past-questions",
  );
  await expect(page.getByRole("textbox")).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});

async function mockAttemptRoutes(
  page: Page,
  options: { expiresInMs: number; failFirstSubmission?: boolean },
) {
  let attemptId = "";
  let completed = false;
  const submissions: Record<string, string>[] = [];
  const browserNow = await page.evaluate(() => Date.now());
  const start = new Date(browserNow).toISOString();
  const deadline = new Date(browserNow + options.expiresInMs).toISOString();
  await page.route("**/api/exams/jamb/attempts", async (route) => {
    if (route.request().method() !== "POST") return route.continue();
    const request = route.request().postDataJSON();
    attemptId = request.id;
    expect(request.subjects).toEqual(["Mathematics"]);
    return route.fulfill({ status: 201, json: { id: attemptId } });
  });
  await page.route("**/api/exams/jamb/attempts/*", async (route) => {
    const method = route.request().method();
    if (method === "POST") {
      const { answers } = route.request().postDataJSON();
      submissions.push(answers);
      if (options.failFirstSubmission && submissions.length === 1)
        return route.fulfill({ status: 503, json: { error: "Connection interrupted" } });
      completed = true;
      return route.fulfill({ json: { id: attemptId } });
    }
    if (method === "PATCH")
      return route.fulfill({
        json: { saved: true, revision: route.request().postDataJSON().revision },
      });
    const answers = submissions.at(-1) || {};
    return route.fulfill({
      json: {
        attempt: {
          id: attemptId,
          subjects: ["Mathematics"],
          answers: completed ? answers : {},
          score: completed && answers[QUESTION_ID] === "B" ? 100 : 0,
          started_at: start,
          expires_at: deadline,
          completed_at: completed ? new Date().toISOString() : null,
          answer_revision: 0,
        },
        questions: [
          completed
            ? {
                ...QUESTION,
                correct_option: "B",
                explanation: "Adding two and three gives five.",
                user_answer: answers[QUESTION_ID] || null,
                is_correct: answers[QUESTION_ID] === "B",
              }
            : QUESTION,
        ],
      },
    });
  });
  return submissions;
}

test("mock timeout submits the latest selected answer and renders its saved result", async ({
  page,
}) => {
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 1_000));
  const submissions = await mockAttemptRoutes(page, { expiresInMs: 20_000 });
  await page.goto(
    `/exams/jamb/mock?${new URLSearchParams({ subjects: JSON.stringify(["Mathematics"]) })}`,
  );
  await expect(page.getByText(QUESTION.question_text, { exact: true })).toBeVisible();
  await page.getByRole("radio", { name: "A Four" }).check();
  await page.clock.fastForward(19_000);
  await page.getByRole("radio", { name: "B Five" }).check();
  await page.clock.fastForward(1_100);
  await expect(page).toHaveURL(/\/results\?attempt=/);
  expect(submissions).toEqual([{ [QUESTION_ID]: "B" }]);
  await page.clock.resume();
  await expect(page.getByRole("heading", { name: "1 of 1 correct" })).toBeVisible();
  await page.getByText(`1. ${QUESTION.question_text}`, { exact: true }).click();
  await expect(page.getByText("Adding two and three gives five.")).toBeVisible();
});

test("expired mock keeps answers after submission failure and allows a successful retry", async ({
  page,
}) => {
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 1_000));
  const submissions = await mockAttemptRoutes(page, {
    expiresInMs: 20_000,
    failFirstSubmission: true,
  });
  await page.goto(
    `/exams/jamb/mock?${new URLSearchParams({ subjects: JSON.stringify(["Mathematics"]) })}`,
  );
  await page.getByRole("radio", { name: "B Five" }).check();
  await page.clock.fastForward(20_100);
  await expect(page.getByRole("main").getByRole("alert")).toContainText("Connection interrupted");
  await expect(page.getByRole("radio", { name: "B Five" })).toBeChecked();
  await expect(page.getByRole("radio", { name: "B Five" })).toBeDisabled();
  await page.getByRole("button", { name: "Retry submission", exact: true }).click();
  await expect(page).toHaveURL(/\/results\?attempt=/);
  expect(submissions).toEqual([{ [QUESTION_ID]: "B" }, { [QUESTION_ID]: "B" }]);
  await page.clock.resume();
  await expect(page.getByRole("heading", { name: "1 of 1 correct" })).toBeVisible();
});
