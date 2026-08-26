import { prisma } from '@/lib/db/prisma'
import { getFulfillmentProvider } from '@/lib/fulfillment'
import { sendEmail } from '@/lib/email/resend'
import { orderConfirmationEmailTemplate } from '@/lib/email/templates'
import { logger } from '@/lib/logger'

/**
 * Shared by the real Razorpay webhook, the client-side payment-verification
 * action, and the mock-payment confirm action, so "an order was paid" has
 * exactly one code path: mark paid, decrement stock, hand off to
 * fulfillment, email the receipt. Idempotent — safe to call more than once
 * for the same order (Razorpay retries webhooks, and both the webhook and
 * the client callback can fire for the same payment).
 */
export async function fulfillPaidOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { variant: { include: { product: true } } } },
      address: true,
      user: true,
    },
  })

  if (!order) {
    logger.error('order.not_found', { orderId })
    return
  }
  if (order.status !== 'PENDING_PAYMENT') {
    logger.info('order.already_processed', { orderId, status: order.status })
    return
  }

  await prisma.$transaction([
    prisma.order.update({ where: { id: order.id }, data: { status: 'PAID' } }),
    ...order.items.map((item) =>
      prisma.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: Math.min(item.quantity, item.variant.stock) } },
      })
    ),
  ])

  if (order.address) {
    try {
      const provider = await getFulfillmentProvider()
      const result = await provider.createOrder({
        orderId: order.id,
        totalValue: order.total,
        items: order.items.map((item) => ({
          providerSku: item.variant.providerSku ?? item.variant.sku,
          quantity: item.quantity,
          printFileUrl: item.printFileUrl ?? '',
          unitPrice: item.unitPrice,
          printTypeId: item.variant.printTypeId,
          printPlacement: item.variant.printPlacement,
          designWidthInches: item.variant.designWidthInches,
          designHeightInches: item.variant.designHeightInches,
        })),
        shippingAddress: {
          fullName: order.address.fullName,
          line1: order.address.line1,
          line2: order.address.line2,
          city: order.address.city,
          state: order.address.state,
          postalCode: order.address.postalCode,
          country: order.address.country,
          phone: order.address.phone,
          email: order.user.email,
        },
      })

      await prisma.order.update({
        where: { id: order.id },
        data: {
          providerName: provider.name,
          providerOrderId: result.providerOrderId,
          trackingUrl: result.trackingUrl,
          status: 'IN_PRODUCTION',
        },
      })
    } catch (err) {
      logger.error('fulfillment.create_order_failed', { orderId: order.id, err: String(err) })
    }
  }

  if (order.user.email) {
    await sendEmail({
      to: order.user.email,
      subject: `Order #${order.id} confirmed`,
      html: orderConfirmationEmailTemplate({
        orderId: order.id,
        items: order.items.map((item) => ({
          title: item.variant.product.title,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        total: order.total,
        currency: order.currency,
      }),
    })
  }

  logger.info('order.paid', { orderId: order.id })
}
