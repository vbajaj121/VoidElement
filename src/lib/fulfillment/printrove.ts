import type {
  CreateFulfillmentOrderInput,
  FulfillmentCatalogItem,
  FulfillmentOrderResult,
  FulfillmentProvider,
} from './types'
import { verifyHmacSignature } from '../webhook-signature'

const API_BASE = 'https://api.printrove.com/api/external'

function isConfigured() {
  return Boolean(process.env.PRINTROVE_API_KEY)
}

async function printroveFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.PRINTROVE_API_KEY}`,
      ...init?.headers,
    },
  })
  if (!res.ok) {
    throw new Error(`Printrove API error ${res.status}: ${await res.text()}`)
  }
  return res.json() as Promise<T>
}

export const printroveProvider: FulfillmentProvider = {
  name: 'PRINTROVE',

  async createOrder(input: CreateFulfillmentOrderInput): Promise<FulfillmentOrderResult> {
    if (!isConfigured()) {
      return {
        providerOrderId: `mock_printrove_${input.orderId}`,
        status: 'PENDING',
        trackingUrl: null,
      }
    }
    return printroveFetch<FulfillmentOrderResult>('/orders', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  async getOrderStatus(providerOrderId: string): Promise<FulfillmentOrderResult> {
    if (!isConfigured()) {
      return { providerOrderId, status: 'PENDING', trackingUrl: null }
    }
    return printroveFetch<FulfillmentOrderResult>(`/orders/${providerOrderId}`)
  },

  async cancelOrder(providerOrderId: string): Promise<void> {
    if (!isConfigured()) return
    await printroveFetch<void>(`/orders/${providerOrderId}/cancel`, { method: 'POST' })
  },

  async listCatalog(): Promise<FulfillmentCatalogItem[]> {
    if (!isConfigured()) {
      return [
        { providerSku: 'mock-tee-black-m', title: 'Classic Tee', color: 'Black', size: 'M' },
        { providerSku: 'mock-hoodie-black-l', title: 'Heavyweight Hoodie', color: 'Black', size: 'L' },
      ]
    }
    return printroveFetch<FulfillmentCatalogItem[]>('/products')
  },

  verifyWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
    if (!isConfigured()) return true
    const secret = process.env.PRINTROVE_WEBHOOK_SECRET
    // No secret configured yet means we can't verify anything — reject
    // rather than trust an unsigned/unverifiable payload once orders are
    // real. Printrove's exact signing scheme isn't confirmed against real
    // docs; see lib/webhook-signature.ts.
    if (!secret || !signatureHeader) return false
    return verifyHmacSignature(rawBody, signatureHeader, secret)
  },
}
