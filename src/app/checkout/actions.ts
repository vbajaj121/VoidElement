'use server'

import { prisma } from '@/lib/db/prisma'
import { isUniqueConstraintViolation } from '@/lib/prisma-errors'
import { auth } from '@/lib/auth/auth'
import { createRazorpayOrder, isRazorpayConfigured, verifyPaymentSignature } from '@/lib/payments/razorpay'
import { fulfillPaidOrder } from '@/lib/orders/fulfill-paid-order'
import { createOrderSchema, type CreateOrderInput } from '@/lib/validation/checkout'
import { rateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

type CreateOrderResult =
  | { ok: true; orderId: string; razorpayOrderId: string; amount: number; currency: string; mocked: boolean }
  | { ok: false; error: string }

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const parsed = createOrderSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Please check the form for errors.' }
  const { contact, shipping, items } = parsed.data

  const limited = rateLimit(`checkout:${contact.email}`, 8, 60_000)
  if (!limited.ok) return { ok: false, error: 'Too many attempts. Try again shortly.' }

  const variantIds = items.map((i) => i.variantId)
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: { product: true },
  })

  if (variants.length !== new Set(variantIds).size) {
    return { ok: false, error: 'One or more items in your bag are no longer available.' }
  }

  const unavailable = variants.find((v) => !v.product.isPublished)
  if (unavailable) return { ok: false, error: `${unavailable.product.title} is no longer available.` }

  // Doesn't fully close the race between two concurrent checkouts for the
  // last unit (that needs stock reserved atomically at order-creation, with
  // a release path if payment fails — a bigger change), but it does stop
  // the common case: an item that's already out of stock being ordered at all.
  const outOfStock = items.find((item) => {
    const variant = variants.find((v) => v.id === item.variantId)!
    return variant.stock < item.quantity
  })
  if (outOfStock) {
    const variant = variants.find((v) => v.id === outOfStock.variantId)!
    return { ok: false, error: `${variant.product.title} (${variant.color}, ${variant.size}) is out of stock.` }
  }

  const orderItems = items.map((item) => {
    const variant = variants.find((v) => v.id === item.variantId)!
    const unitPrice = variant.product.basePrice + variant.priceDiff
    return {
      variantId: variant.id,
      quantity: item.quantity,
      unitPrice,
      currency: variant.product.currency,
      printFileUrl: variant.printFileUrl,
    }
  })

  const currency = orderItems[0]?.currency ?? 'INR'
  const subtotal = orderItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
  const shippingCost = 0
  const total = subtotal + shippingCost

  const session = await auth()
  let userId: string
  if (session?.user?.id) {
    userId = session.user.id
  } else {
    // Guest checkout. Only ever create a brand-new account here — never
    // attach to an existing one by email, or anyone could type a stranger's
    // email, ship an order to an address of their own choosing, and have it
    // land in that stranger's order history (plus trigger a confirmation
    // email to them). Let Postgres's unique constraint on User.email be the
    // source of truth rather than a check-then-act race.
    try {
      const guest = await prisma.user.create({ data: { email: contact.email, name: shipping.fullName } })
      userId = guest.id
    } catch (err) {
      if (isUniqueConstraintViolation(err)) {
        return { ok: false, error: 'An account already exists with this email. Sign in, then check out again.' }
      }
      throw err
    }
  }

  const address = await prisma.address.create({
    data: { userId, ...shipping },
  })

  const order = await prisma.order.create({
    data: {
      userId,
      addressId: address.id,
      subtotal,
      shippingCost,
      total,
      currency,
      items: {
        create: orderItems.map(({ variantId, quantity, unitPrice, printFileUrl }) => ({
          variantId,
          quantity,
          unitPrice,
          printFileUrl,
        })),
      },
    },
  })

  let razorpayOrder
  try {
    razorpayOrder = await createRazorpayOrder({ orderId: order.id, amount: total, currency })
  } catch (err) {
    // The order row is left behind as an abandoned PENDING_PAYMENT record —
    // harmless (never paid, never fulfilled) — rather than risk compounding
    // a Razorpay-outage failure with a second failing DB call here.
    logger.error('checkout.razorpay_order_failed', { orderId: order.id, err: String(err) })
    return { ok: false, error: 'Payment setup failed. Please try again in a moment.' }
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { razorpayOrderId: razorpayOrder.id },
  })

  logger.info('checkout.order_created', { orderId: order.id, total, mocked: razorpayOrder.mocked })

  return {
    ok: true,
    orderId: order.id,
    razorpayOrderId: razorpayOrder.id,
    amount: total,
    currency,
    mocked: razorpayOrder.mocked,
  }
}

/**
 * Only reachable when Razorpay isn't configured (createOrder returned
 * `mocked: true`) — simulates the payment-success handoff so the full order
 * flow is exercisable without real Razorpay keys.
 *
 * This is a server action, so it's a real POSTable endpoint regardless of
 * the client-side `mocked` gate — without these checks, anyone who knows or
 * guesses an order ID could mark it PAID and trigger real fulfillment
 * without paying, even with Razorpay fully configured. Both checks matter:
 * `isRazorpayConfigured()` closes it entirely once Razorpay is live, and the
 * `mock_order_` prefix check stops it from being used against a real,
 * still-unpaid order even while running in mock mode.
 */
export async function confirmMockPayment(orderId: string) {
  if (isRazorpayConfigured()) return

  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order?.razorpayOrderId?.startsWith('mock_order_')) return

  await fulfillPaidOrder(orderId)
}

type VerifyPaymentResult = { ok: true } | { ok: false; error: string }

/**
 * Called by the client immediately after Razorpay Checkout's success
 * handler fires. The signature check proves this really came from a
 * completed Razorpay payment (see verifyPaymentSignature) — without it,
 * anyone could call this action directly with a fabricated payment id and
 * get a free order. The Razorpay webhook is the durable source of truth in
 * production (a shopper may close the tab before this fires), but this
 * gives them an immediate confirmation instead of waiting on the webhook.
 */
export async function verifyRazorpayPayment(input: {
  orderId: string
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature: string
}): Promise<VerifyPaymentResult> {
  const order = await prisma.order.findUnique({ where: { id: input.orderId } })
  if (!order || order.razorpayOrderId !== input.razorpayOrderId) {
    return { ok: false, error: 'Order not found.' }
  }

  const valid = verifyPaymentSignature({
    razorpayOrderId: input.razorpayOrderId,
    razorpayPaymentId: input.razorpayPaymentId,
    razorpaySignature: input.razorpaySignature,
  })
  if (!valid) {
    logger.error('checkout.razorpay_signature_invalid', { orderId: input.orderId })
    return { ok: false, error: 'Payment could not be verified.' }
  }

  await prisma.order.update({ where: { id: order.id }, data: { razorpayPaymentId: input.razorpayPaymentId } })
  await fulfillPaidOrder(order.id)
  return { ok: true }
}
