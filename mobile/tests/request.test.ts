import assert from "node:assert/strict";
import test from "node:test";
import { createBoundedFetch } from "../src/lib/request";
const waitingFetch: typeof fetch = async (_input, init) =>
  new Promise((_resolve, reject) => {
    if (init?.signal?.aborted) {
      reject(new Error("aborted"));
      return;
    }
    init?.signal?.addEventListener("abort", () => reject(new Error("aborted")), { once: true });
  });
test("an unresponsive connection is bounded and reaches an error state", async () => {
  await assert.rejects(
    createBoundedFetch(waitingFetch, 10)("https://study.example.com"),
    /aborted/,
  );
});
test("screen and account cancellation propagate through the timeout wrapper", async () => {
  const controller = new AbortController();
  const request = createBoundedFetch(waitingFetch)("https://study.example.com", {
    signal: controller.signal,
  });
  controller.abort();
  await assert.rejects(request, /aborted/);
  const previouslyAborted = new AbortController();
  previouslyAborted.abort();
  await assert.rejects(
    createBoundedFetch(waitingFetch)("https://study.example.com", {
      signal: previouslyAborted.signal,
    }),
    /aborted/,
  );
});
