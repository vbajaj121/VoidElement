import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Standard HMAC-SHA256-over-raw-body webhook verification — the scheme used
 * by the large majority of webhook providers (GitHub, Shopify, etc). None of
 * Printrove/Printify/Qikink's exact signing schemes are confirmed against
 * real vendor docs, so this is a best-effort default rather than a verified
 * implementation. It's still strictly safer than trusting any non-empty
 * header: a provider using this common pattern verifies correctly, and one
 * using a different scheme fails closed (rejected) instead of failing open
 * (accepted) — confirm against a real webhook delivery before depending on
 * this for a specific provider.
 */
export function verifyHmacSignature(rawBody: string, signatureHeader: string, secret: string): boolean {
  const expected = Buffer.from(createHmac('sha256', secret).update(rawBody).digest('hex'))
  const provided = Buffer.from(signatureHeader)
  if (expected.length !== provided.length) return false
  return timingSafeEqual(expected, provided)
}
