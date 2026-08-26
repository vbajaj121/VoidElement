import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getFulfillmentProviderByName } from '@/lib/fulfillment'
import type { FulfillmentProviderName } from '@/lib/fulfillment'
import { sendEmail } from '@/lib/email/resend'
import { shippingUpdateEmailTemplate } from '@/lib/email/templates'
import { logger } from '@/lib/logger'

const PROVIDER_STATUS_MAP: Record<string, 'IN_PRODUCTION' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'> = {
  PENDING: 'IN_PRODUCTION',
  IN_PRODUCTION: 'IN_PRODUCTION',
  PRINTING: 'IN_PRODUCTION',
  SHIPPED: 'SHIPPED',
  IN_TRANSIT: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  CANCELED: 'CANCELLED',
}

interface FulfillmentWebhookPayload {
  providerOrderId: string
  status: string
  trackingUrl?: string | null
}

export async function POST(
  request: NextRequest,
  ctx: RouteContext<'/api/webhooks/fulfillment/[provider]'>
) {
  const { provider: providerSlug } = await ctx.params
  const providerName = providerSlug.toUpperCase() as FulfillmentProviderName

  if (!['PRINTROVE', 'PRINTIFY', 'QIKINK'].includes(providerName)) {
    return NextResponse.json({ error: 'Unknown provider' }, { status: 404 })
  }

  const provider = getFulfillmentProviderByName(providerName)
  const rawBody = await request.text()
  const signature = request.headers.get('x-webhook-signature')

  if (!provider.verifyWebhookSignature(rawBody, signature)) {
    logger.error('fulfillment.webhook_signature_invalid', { provider: providerName })
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  let payload: FulfillmentWebhookPayload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const order = await prisma.order.findFirst({
    where: { providerName, providerOrderId: payload.providerOrderId },
    include: { user: true },
  })
  if (!order) {
    logger.error('fulfillment.webhook_order_not_found', { provider: providerName, payload })
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const mappedStatus = PROVIDER_STATUS_MAP[payload.status.toUpperCase()]
  if (!mappedStatus) {
    logger.info('fulfillment.webhook_unmapped_status', { provider: providerName, status: payload.status })
    return NextResponse.json({ received: true })
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: mappedStatus,
      trackingUrl: payload.trackingUrl ?? order.trackingUrl,
    },
  })

  if (order.user.email && (mappedStatus === 'SHIPPED' || mappedStatus === 'DELIVERED')) {
    await sendEmail({
      to: order.user.email,
      subject: `Order #${order.id} ${mappedStatus === 'SHIPPED' ? 'has shipped' : 'was delivered'}`,
      html: shippingUpdateEmailTemplate({
        orderId: order.id,
        status: mappedStatus,
        trackingUrl: payload.trackingUrl,
      }),
    })
  }

  logger.info('fulfillment.webhook_processed', { provider: providerName, orderId: order.id, status: mappedStatus })
  return NextResponse.json({ received: true })
}
