import assert from "node:assert/strict";
import test from "node:test";
import { createSecureStorageAdapter, type SecureStorage } from "../src/lib/secure-storage";
function memoryStorage() {
  const entries = new Map<string, string>();
  const storage: SecureStorage = {
    async getItemAsync(key) {
      return entries.get(key) ?? null;
    },
    async setItemAsync(key, value) {
      assert.ok(Buffer.byteLength(value, "utf8") <= 2048);
      entries.set(key, value);
    },
    async deleteItemAsync(key) {
      entries.delete(key);
    },
  };
  return { storage, entries };
}
test("sessions larger than SecureStore's item limit round-trip without splitting Unicode", async () => {
  const { storage, entries } = memoryStorage();
  const adapter = createSecureStorageAdapter(storage);
  const token = "x".repeat(399) + "🎓".repeat(2000);
  await adapter.setItem("session", token);
  assert.equal(await adapter.getItem("session"), token);
  for (const [key, value] of entries)
    if (!key.endsWith("manifest")) assert.equal(value, Buffer.from(value, "utf8").toString("utf8"));
  await adapter.setItem("session", "shorter-session");
  assert.equal(await adapter.getItem("session"), "shorter-session");
  assert.equal(entries.size, 2, "replacing a session removes old chunks");
  await adapter.removeItem("session");
  assert.equal(await adapter.getItem("session"), null);
  assert.equal(entries.size, 0);
});
test("a failed chunk write preserves the old session and cleans every new chunk", async () => {
  const { storage, entries } = memoryStorage();
  const adapter = createSecureStorageAdapter(storage);
  await adapter.setItem("session", "original-session");
  const originalEntries = new Map(entries);
  let fail = true;
  const write = storage.setItemAsync;
  storage.setItemAsync = async (key, value) => {
    if (!key.endsWith("manifest") && fail) {
      fail = false;
      throw new Error("storage full");
    }
    await new Promise((resolve) => setTimeout(resolve, 5));
    await write(key, value);
  };
  await assert.rejects(adapter.setItem("session", "a".repeat(1600)), /storage full/);
  assert.equal(await adapter.getItem("session"), "original-session");
  assert.deepEqual(entries, originalEntries);
});
test("a failed manifest commit preserves the previous session", async () => {
  const { storage, entries } = memoryStorage();
  const adapter = createSecureStorageAdapter(storage);
  await adapter.setItem("session", "previous");
  const originalEntries = new Map(entries);
  const write = storage.setItemAsync;
  storage.setItemAsync = async (key, value) => {
    if (key.endsWith("manifest")) throw new Error("write failed");
    await write(key, value);
  };
  await assert.rejects(adapter.setItem("session", "replacement"), /write failed/);
  assert.equal(await adapter.getItem("session"), "previous");
  assert.deepEqual(entries, originalEntries);
});
test("legacy single-item sessions migrate and incomplete sessions are rejected", async () => {
  const { storage, entries } = memoryStorage();
  entries.set("session", "legacy");
  const adapter = createSecureStorageAdapter(storage);
  assert.equal(await adapter.getItem("session"), "legacy");
  await adapter.setItem("session", "new-session");
  assert.equal(entries.has("session"), false);
  const chunk = Array.from(entries.keys()).find((key) => !key.endsWith("manifest"))!;
  entries.delete(chunk);
  assert.equal(await adapter.getItem("session"), null);
});
