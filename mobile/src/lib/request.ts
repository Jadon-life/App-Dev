// Bound mobile requests so a dropped connection reaches a retryable error state.
// Preserve React Query cancellation when a screen or account changes.
export function createBoundedFetch(fetcher: typeof fetch, timeoutMs = 15_000): typeof fetch {
  return async (input, init) => {
    const controller = new AbortController();
    const signal =
      init?.signal || (typeof input === "object" && "signal" in input ? input.signal : null);
    const cancel = () => controller.abort();
    if (signal?.aborted) cancel();
    else signal?.addEventListener("abort", cancel, { once: true });
    const timer = setTimeout(cancel, timeoutMs);
    try {
      return await fetcher(input, { ...init, signal: controller.signal });
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener("abort", cancel);
    }
  };
}
