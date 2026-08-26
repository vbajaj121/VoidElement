'use server'

import { revalidatePath, updateTag } from 'next/cache'
import type { OrderStatus } from '@prisma/client'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db/prisma'
import { getFulfillmentProvider } from '@/lib/fulfillment'
import { fulfillPaidOrder } from '@/lib/orders/fulfill-paid-order'
import { logger } from '@/lib/logger'
import { productInputSchema, orderStatusSchema, type ProductInput } from '@/lib/validation/product'
import { isForeignKeyViolation, isUniqueConstraintViolation } from '@/lib/prisma-errors'
import type { FulfillmentProviderName } from '@/lib/fulfillment'

export type ActionResult = { ok: true } | { ok: false; error: string }

export async function requireAdmin() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') throw new Error('Forbidden')
  return session
}

export async function setActiveFulfillmentProvider(provider: FulfillmentProviderName): Promise<ActionResult> {
  await requireAdmin()

  await prisma.settings.upsert({
    where: { id: 'global' },
    update: { activeFulfillmentProvider: provider },
    create: { id: 'global', activeFulfillmentProvider: provider },
  })

  logger.info('admin.fulfillment_provider_changed', { provider })
  revalidatePath('/admin/fulfillment')
  return { ok: true }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<ActionResult> {
  await requireAdmin()

  const parsed = orderStatusSchema.safeParse(status)
  if (!parsed.success) return { ok: false, error: 'Not a valid order status.' }

  await prisma.order.update({ where: { id: orderId }, data: { status: parsed.data } })
  logger.info('admin.order_status_changed', { orderId, status: parsed.data })
  revalidatePath(`/admin/orders/${orderId}`)
  return { ok: true }
}

export async function retryFulfillment(orderId: string): Promise<ActionResult> {
  await requireAdmin()

  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) return { ok: false, error: 'Order not found.' }

  if (order.status === 'PENDING_PAYMENT') {
    return { ok: false, error: 'Order has not been paid yet.' }
  }

  if (!order.providerOrderId) {
    // Never went through fulfillment — reuse the same paid->fulfillment handoff.
    await prisma.order.update({ where: { id: orderId }, data: { status: 'PAID' } })
    await fulfillPaidOrder(orderId)
    revalidatePath(`/admin/orders/${orderId}`)
    return { ok: true }
  }

  try {
    const provider = await getFulfillmentProvider()
    const result = await provider.getOrderStatus(order.providerOrderId)
    await prisma.order.update({
      where: { id: orderId },
      data: { trackingUrl: result.trackingUrl ?? order.trackingUrl },
    })
    revalidatePath(`/admin/orders/${orderId}`)
    return { ok: true }
  } catch (err) {
    logger.error('admin.retry_fulfillment_failed', { orderId, err: String(err) })
    return { ok: false, error: 'Fulfillment provider request failed.' }
  }
}

export async function saveProduct(productId: string | null, rawInput: ProductInput): Promise<ActionResult> {
  await requireAdmin()

  const parsed = productInputSchema.safeParse(rawInput)
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' }
  const input = parsed.data

  const colors = [input.colorFrom, input.colorTo]
  const data = {
    slug: input.slug,
    title: input.title,
    category: input.category,
    description: input.description,
    basePrice: input.basePrice,
    currency: input.currency,
    colors,
    isLimited: input.isLimited,
    isPublished: input.isPublished,
  }

  try {
    if (productId) {
      await prisma.$transaction([
        prisma.product.update({ where: { id: productId }, data }),
        prisma.productVariant.deleteMany({
          where: { productId, id: { notIn: input.variants.filter((v) => v.id).map((v) => v.id!) } },
        }),
        ...input.variants.map((v) =>
          v.id
            ? prisma.productVariant.update({
                where: { id: v.id },
                data: {
                  color: v.color,
                  swatch: v.swatch,
                  colors,
                  size: v.size,
                  priceDiff: v.priceDiff,
                  stock: v.stock,
                },
              })
            : prisma.productVariant.create({
                data: {
                  productId,
                  sku: `${input.slug}-${v.color}-${v.size}`.toLowerCase().replace(/[^a-z0-9-]+/g, '-'),
                  color: v.color,
                  swatch: v.swatch,
                  colors,
                  size: v.size,
                  priceDiff: v.priceDiff,
                  stock: v.stock,
                  providerSku: `mock-${input.slug}-${v.color}-${v.size}`.toLowerCase().replace(/[^a-z0-9-]+/g, '-'),
                },
              })
        ),
      ])
    } else {
      await prisma.product.create({
        data: {
          ...data,
          variants: {
            create: input.variants.map((v) => {
              const sku = `${input.slug}-${v.color}-${v.size}`.toLowerCase().replace(/[^a-z0-9-]+/g, '-')
              return {
                sku,
                color: v.color,
                swatch: v.swatch,
                colors,
                size: v.size,
                priceDiff: v.priceDiff,
                stock: v.stock,
                providerSku: `mock-${sku}`,
              }
            }),
          },
        },
      })
    }
  } catch (err) {
    if (isForeignKeyViolation(err)) {
      return { ok: false, error: "Can't remove a variant that has existing orders — unpublish it instead of deleting it." }
    }
    if (isUniqueConstraintViolation(err)) {
      return { ok: false, error: 'That slug or SKU is already in use.' }
    }
    logger.error('admin.save_product_failed', { productId, err: String(err) })
    return { ok: false, error: 'Could not save the product.' }
  }

  updateTag('products')
  revalidatePath('/admin/products')
  return { ok: true }
}

export async function deleteProduct(productId: string): Promise<ActionResult> {
  await requireAdmin()

  try {
    await prisma.product.delete({ where: { id: productId } })
  } catch (err) {
    if (isForeignKeyViolation(err)) {
      return { ok: false, error: "Can't delete a product that has existing orders — unpublish it instead." }
    }
    logger.error('admin.delete_product_failed', { productId, err: String(err) })
    return { ok: false, error: 'Could not delete the product.' }
  }

  updateTag('products')
  revalidatePath('/admin/products')
  return { ok: true }
}
