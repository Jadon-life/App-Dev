export interface SecureStorage {
  getItemAsync(key: string): Promise<string | null>;
  setItemAsync(key: string, value: string): Promise<void>;
  deleteItemAsync(key: string): Promise<void>;
}
interface StorageHead {
  version: 1;
  revision: string;
  count: number;
}
const CHUNK_LENGTH = 400; // At most 1,600 UTF-8 bytes, below SecureStore's 2 KB limit.
function readHead(value: string | null): StorageHead | null {
  if (!value) return null;
  try {
    const head = JSON.parse(value) as StorageHead;
    return head.version === 1 &&
      typeof head.revision === "string" &&
      /^[\w-]+$/.test(head.revision) &&
      Number.isInteger(head.count) &&
      head.count > 0 &&
      head.count <= 256
      ? head
      : null;
  } catch {
    return null;
  }
}
// Commit a manifest only after all chunks are written. Interrupted writes keep
// the previous session readable rather than publishing a partial token.
export function createSecureStorageAdapter(storage: SecureStorage) {
  let revision = 0;
  const chunkKey = (key: string, head: StorageHead, index: number) =>
    `${key}-${head.revision}-${index}`;
  async function removeChunks(key: string, head: StorageHead | null) {
    if (head)
      await Promise.all(
        Array.from({ length: head.count }, (_, i) =>
          storage.deleteItemAsync(chunkKey(key, head, i)),
        ),
      );
  }
  return {
    async getItem(key: string) {
      const head = readHead(await storage.getItemAsync(`${key}-manifest`));
      if (!head) return storage.getItemAsync(key); // Existing single-value sessions.
      const chunks = await Promise.all(
        Array.from({ length: head.count }, (_, i) => storage.getItemAsync(chunkKey(key, head, i))),
      );
      return chunks.some((chunk) => chunk === null) ? null : chunks.join("");
    },
    async setItem(key: string, value: string) {
      const oldHead = readHead(await storage.getItemAsync(`${key}-manifest`));
      const characters = Array.from(value); // Never split a Unicode surrogate pair.
      const head: StorageHead = {
        version: 1,
        revision: `${Date.now()}-${revision++}`,
        count: Math.ceil(characters.length / CHUNK_LENGTH) || 1,
      };
      if (head.count > 256) throw new Error("This sign-in session is too large to save securely.");
      try {
        // Wait for every write before cleanup: Promise.all would reject early
        // and allow a later write to recreate an orphan after cleanup.
        const writes = await Promise.allSettled(
          Array.from({ length: head.count }, (_, i) =>
            storage.setItemAsync(
              chunkKey(key, head, i),
              characters.slice(i * CHUNK_LENGTH, (i + 1) * CHUNK_LENGTH).join(""),
            ),
          ),
        );
        const failed = writes.find(
          (result): result is PromiseRejectedResult => result.status === "rejected",
        );
        if (failed) throw failed.reason;
        await storage.setItemAsync(`${key}-manifest`, JSON.stringify(head));
      } catch (error) {
        await removeChunks(key, head).catch(() => undefined);
        throw error;
      }
      await removeChunks(key, oldHead);
      await storage.deleteItemAsync(key);
    },
    async removeItem(key: string) {
      const head = readHead(await storage.getItemAsync(`${key}-manifest`));
      await storage.deleteItemAsync(`${key}-manifest`);
      await storage.deleteItemAsync(key);
      await removeChunks(key, head);
    },
  };
}
