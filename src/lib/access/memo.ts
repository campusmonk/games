import "server-only";

/**
 * Tiny in-process TTL cache.
 *
 * The allowlist and the global daily limits are read on every protected
 * request but change only when an admin edits them, so hitting Supabase
 * each time was the main source of slow page loads. These values are
 * cached in memory for a few seconds and invalidated explicitly by the
 * admin actions that write them.
 *
 * Deliberately not `unstable_cache`: these reads sit behind `cookies()`
 * on dynamic routes, and a plain module-level map keeps the behaviour
 * identical in dev and in production without a serialization step.
 */

type Entry<T> = { value: T; expiresAt: number };

const store = new Map<string, Entry<unknown>>();

/** In-flight requests, so a burst of parallel misses makes one round trip. */
const inflight = new Map<string, Promise<unknown>>();

export const memoTtlMs = {
  /** Allowlist membership: an added user waits at most this long. */
  allowlist: 30_000,
  /** Global daily limits: an admin edit lands within this long. */
  limits: 30_000,
} as const;

export async function memoize<T>(
  key: string,
  ttlMs: number,
  load: () => Promise<T>,
): Promise<T> {
  const now = Date.now();
  const hit = store.get(key);

  if (hit && hit.expiresAt > now) return hit.value as T;

  const pending = inflight.get(key);
  if (pending) return pending as Promise<T>;

  const promise = load()
    .then((value) => {
      store.set(key, { value, expiresAt: Date.now() + ttlMs });
      return value;
    })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, promise);

  return promise as Promise<T>;
}

/** Drop every entry whose key starts with `prefix` (no prefix drops all). */
export function invalidateMemo(prefix = "") {
  if (!prefix) {
    store.clear();
    return;
  }

  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}
