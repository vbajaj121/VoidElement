import { prisma } from '@/lib/db/prisma'
import { printifyProvider } from './printify'
import { printroveProvider } from './printrove'
import { qikinkProvider } from './qikink'
import type { FulfillmentProvider, FulfillmentProviderName } from './types'

export type { FulfillmentProvider, FulfillmentProviderName } from './types'
export type {
  CreateFulfillmentOrderInput,
  FulfillmentOrderItem,
  FulfillmentOrderResult,
  FulfillmentCatalogItem,
  ShippingAddress,
} from './types'

const registry: Record<FulfillmentProviderName, FulfillmentProvider> = {
  PRINTROVE: printroveProvider,
  PRINTIFY: printifyProvider,
  QIKINK: qikinkProvider,
}

/**
 * Single entry point for all fulfillment calls. The active provider is an
 * admin-controlled DB setting (Settings.activeFulfillmentProvider), so it can
 * be switched at runtime with no deploy. Falls back to FULFILLMENT_PROVIDER
 * env var if the settings row doesn't exist yet (e.g. before first migration seed).
 */
export async function getFulfillmentProvider(): Promise<FulfillmentProvider> {
  try {
    const settings = await prisma.settings.findUnique({ where: { id: 'global' } })
    if (settings) return registry[settings.activeFulfillmentProvider]
  } catch {
    // DB not reachable yet — fall through to env default so local dev without
    // a provisioned Postgres instance still boots.
  }
  const envDefault = (process.env.FULFILLMENT_PROVIDER as FulfillmentProviderName) || 'PRINTROVE'
  return registry[envDefault] ?? printroveProvider
}

export function getFulfillmentProviderByName(providerName: FulfillmentProviderName): FulfillmentProvider {
  return registry[providerName]
}
