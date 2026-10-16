import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import * as tar from "tar";
import { ExpoRequest, ExpoResponse } from "@expo/server/build/environment";
import { createRequestHandler } from "@expo/server";

// The SDK-aligned CLI/router use this server request/response API. Exercise the
// compatibility boundary of the security override, rather than just a version.
test("patched Expo server retains request, response and route handler contracts", async () => {
  const request = new ExpoRequest("https://study.example/lesson?subject=maths");
  assert.equal(new URL(request.url).searchParams.get("subject"), "maths");
  assert.equal(request.method, "GET");
  const response = ExpoResponse.json({ available: true }, { status: 201 });
  assert.equal(response.status, 201);
  assert.match(response.headers.get("content-type") ?? "", /application\/json/);
  assert.deepEqual(await response.json(), { available: true });
  assert.equal(typeof createRequestHandler, "function");
});

test("patched archive library preserves Expo's archive extraction API", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "cryslearn-tar-test-"));
  try {
    await mkdir(path.join(directory, "source"));
    await mkdir(path.join(directory, "restored"));
    await writeFile(path.join(directory, "source", "lesson.txt"), "Practice with clarity.");
    const archive = path.join(directory, "lesson.tgz");
    await tar.create({ cwd: path.join(directory, "source"), file: archive, gzip: true }, [
      "lesson.txt",
    ]);
    await tar.extract({ cwd: path.join(directory, "restored"), file: archive });
    assert.equal(
      await readFile(path.join(directory, "restored", "lesson.txt"), "utf8"),
      "Practice with clarity.",
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
