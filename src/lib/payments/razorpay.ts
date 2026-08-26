import Razorpay from 'razorpay'
import { verifyHmacSignature } from '@/lib/webhook-signature'

const globalForRazorpay = globalThis as unknown as { razorpay?: Razorpay }

function createRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) return null
  return new Razorpay({ key_id: keyId, key_secret: keySecret })
}

export const razorpay = globalForRazorpay.razorpay ?? createRazorpayClient() ?? undefined

if (process.env.NODE_ENV !== 'production' && razorpay) {
  globalForRazorpay.razorpay = razorpay
}

export function isRazorpayConfigured() {
  return Boolean(razorpay)
}

export async function createRazorpayOrder(input: { orderId: string; amount: number; currency: string }) {
  if (!razorpay) {
    // Mirrors the fulfillment providers' mock fallback so checkout can be
    // exercised end-to-end before real Razorpay keys are configured.
    return { id: `mock_order_${input.orderId}`, mocked: true as const }
  }

  // Razorpay order ids aren't unique across retries by default — `receipt`
  // pins it to our own orderId so a duplicate createOrder call for the same
  // order is traceable on Razorpay's dashboard even though it won't dedupe.
  const razorpayOrder = await razorpay.orders.create({
    amount: input.amount,
    currency: input.currency,
    receipt: input.orderId,
  })

  return { id: razorpayOrder.id, mocked: false as const }
}

/**
 * Verifies the payment confirmation Razorpay Checkout hands back to the
 * client on success: HMAC-SHA256("{order_id}|{payment_id}", key_secret),
 * per Razorpay's documented signature scheme. This is what proves the
 * success callback actually came from a completed Razorpay payment and
 * wasn't forged by calling the client-side success handler directly.
 */
export function verifyPaymentSignature(input: {
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature: string
}) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keySecret) return false
  return verifyHmacSignature(
    `${input.razorpayOrderId}|${input.razorpayPaymentId}`,
    input.razorpaySignature,
    keySecret
  )
}

/** Webhook payloads are signed the same way as every other provider in this app — see src/lib/webhook-signature.ts. */
export function verifyRazorpayWebhookSignature(rawBody: string, signatureHeader: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret) return false
  return verifyHmacSignature(rawBody, signatureHeader, secret)
}
