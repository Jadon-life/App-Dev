import assert from "node:assert/strict";
import test from "node:test";
import { resolveWebUrl } from "../src/lib/web-url";
test("web handoff uses the configured HTTPS origin", () => {
  assert.equal(
    resolveWebUrl("https://study.example.com/base", "/exams/jamb/subjects"),
    "https://study.example.com/exams/jamb/subjects",
  );
  assert.equal(resolveWebUrl("http://localhost:3000", "/exams"), "http://localhost:3000/exams");
});
test("web handoff refuses missing configuration, credentials, and unsafe destinations", () => {
  for (const origin of [
    undefined,
    "invalid",
    "javascript:alert(1)",
    "http://study.example.com",
    "https://user:password@study.example.com",
  ])
    assert.equal(resolveWebUrl(origin, "/exams"), null);
  for (const path of ["https://other.example.com", "//other.example.com", "/\\other.example.com"])
    assert.equal(resolveWebUrl("https://study.example.com", path), null);
});
