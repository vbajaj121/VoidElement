import { NextRequest, NextResponse } from 'next/server'
import { isRazorpayConfigured, verifyRazorpayWebhookSignature } from '@/lib/payments/razorpay'
import { prisma } from '@/lib/db/prisma'
import { fulfillPaidOrder } from '@/lib/orders/fulfill-paid-order'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  if (!isRazorpayConfigured()) {
    return NextResponse.json({ error: 'Razorpay is not configured' }, { status: 503 })
  }

  // Fails closed: no RAZORPAY_WEBHOOK_SECRET configured means every request
  // is rejected rather than trusted, same policy as the fulfillment webhooks.
  const signature = request.headers.get('x-razorpay-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing webhook signature' }, { status: 400 })
  }

  const rawBody = await request.text()

  if (!verifyRazorpayWebhookSignature(rawBody, signature)) {
    logger.error('razorpay.webhook_signature_invalid')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(rawBody) as {
    event: string
    payload: { payment: { entity: { id: string; order_id: string } } }
  }

  switch (event.event) {
    case 'payment.captured': {
      const payment = event.payload.payment.entity
      const order = await prisma.order.findUnique({ where: { razorpayOrderId: payment.order_id } })
      if (order) {
        await prisma.order.update({ where: { id: order.id }, data: { razorpayPaymentId: payment.id } })
        await fulfillPaidOrder(order.id)
      }
      break
    }
    case 'payment.failed': {
      const payment = event.payload.payment.entity
      await prisma.order.updateMany({
        where: { razorpayOrderId: payment.order_id, status: 'PENDING_PAYMENT' },
        data: { status: 'CANCELLED' },
      })
      break
    }
    default:
      break
  }

  return NextResponse.json({ received: true })
}
