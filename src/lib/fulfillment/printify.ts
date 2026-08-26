import type {
  CreateFulfillmentOrderInput,
  FulfillmentCatalogItem,
  FulfillmentOrderResult,
  FulfillmentProvider,
} from './types'
import { verifyHmacSignature } from '../webhook-signature'

const API_BASE = 'https://api.printify.com/v1'

function isConfigured() {
  return Boolean(process.env.PRINTIFY_API_KEY && process.env.PRINTIFY_SHOP_ID)
}

async function printifyFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}/shops/${process.env.PRINTIFY_SHOP_ID}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.PRINTIFY_API_KEY}`,
      ...init?.headers,
    },
  })
  if (!res.ok) {
    throw new Error(`Printify API error ${res.status}: ${await res.text()}`)
  }
  return res.json() as Promise<T>
}

export const printifyProvider: FulfillmentProvider = {
  name: 'PRINTIFY',

  async createOrder(input: CreateFulfillmentOrderInput): Promise<FulfillmentOrderResult> {
    if (!isConfigured()) {
      return {
        providerOrderId: `mock_printify_${input.orderId}`,
        status: 'PENDING',
        trackingUrl: null,
      }
    }
    return printifyFetch<FulfillmentOrderResult>('/orders.json', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  async getOrderStatus(providerOrderId: string): Promise<FulfillmentOrderResult> {
    if (!isConfigured()) {
      return { providerOrderId, status: 'PENDING', trackingUrl: null }
    }
    return printifyFetch<FulfillmentOrderResult>(`/orders/${providerOrderId}.json`)
  },

  async cancelOrder(providerOrderId: string): Promise<void> {
    if (!isConfigured()) return
    await printifyFetch<void>(`/orders/${providerOrderId}/cancel.json`, { method: 'POST' })
  },

  async listCatalog(): Promise<FulfillmentCatalogItem[]> {
    if (!isConfigured()) {
      return [
        { providerSku: 'mock-tee-white-m', title: 'Classic Tee', color: 'White', size: 'M' },
        { providerSku: 'mock-hoodie-white-l', title: 'Heavyweight Hoodie', color: 'White', size: 'L' },
      ]
    }
    return printifyFetch<FulfillmentCatalogItem[]>('/catalog/blueprints.json')
  },

  verifyWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
    if (!isConfigured()) return true
    const secret = process.env.PRINTIFY_WEBHOOK_SECRET
    // No secret configured yet means we can't verify anything — reject
    // rather than trust an unsigned/unverifiable payload once orders are
    // real. Printify's exact signing scheme isn't confirmed against real
    // docs; see lib/webhook-signature.ts.
    if (!secret || !signatureHeader) return false
    return verifyHmacSignature(rawBody, signatureHeader, secret)
  },
}
