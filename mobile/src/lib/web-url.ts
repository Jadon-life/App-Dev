export function resolveWebUrl(origin: string | undefined, path: string): string | null {
  if (!origin || !path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return null;
  try {
    const url = new URL(origin);
    if (url.username || url.password) return null;
    if (
      url.protocol !== "https:" &&
      !(url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname))
    )
      return null;
    return new URL(path, url.origin).toString();
  } catch {
    return null;
  }
}
