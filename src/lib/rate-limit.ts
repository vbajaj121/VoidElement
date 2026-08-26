/**
 * In-memory sliding-window limiter. Single-instance only — if this ever runs
 * across multiple server instances, swap for Upstash Redis (`@upstash/ratelimit`)
 * so the counters are shared.
 */
const buckets = new Map<string, number[]>()

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs)

  if (hits.length >= limit) {
    buckets.set(key, hits)
    return { ok: false as const, retryAfterMs: windowMs - (now - hits[0]) }
  }

  hits.push(now)
  buckets.set(key, hits)
  return { ok: true as const }
}
