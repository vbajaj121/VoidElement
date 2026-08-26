import type {
  CreateFulfillmentOrderInput,
  FulfillmentCatalogItem,
  FulfillmentOrderResult,
  FulfillmentProvider,
  ShippingAddress,
} from './types'
import { verifyHmacSignature } from '../webhook-signature'

// Confirmed from Qikink's official API reference (PDF supplied 2026-08-15):
// sandbox/live are different hosts, auth is a ClientId/client_secret exchange
// for an Accesstoken (not a static bearer key), and every subsequent request
// carries that token in a custom `Accesstoken` header alongside `ClientId` —
// there is no `Authorization: Bearer` header on this API.
const API_BASE =
  process.env.QIKINK_ENV === 'live' ? 'https://api.qikink.com' : 'https://sandbox.qikink.com'

function isConfigured() {
  return Boolean(process.env.QIKINK_CLIENT_ID && process.env.QIKINK_CLIENT_SECRET)
}

let cachedToken: { value: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value

  const res = await fetch(`${API_BASE}/api/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      ClientId: process.env.QIKINK_CLIENT_ID ?? '',
      client_secret: process.env.QIKINK_CLIENT_SECRET ?? '',
    }),
  })
  if (!res.ok) {
    throw new Error(`Qikink token exchange failed ${res.status}: ${await res.text()}`)
  }
  const data = (await res.json()) as { Accesstoken: string; expires_in?: number }
  cachedToken = {
    value: data.Accesstoken,
    // Refresh a minute early; fall back to a 50-minute lifetime if the
    // response doesn't say how long the token lasts.
    expiresAt: Date.now() + ((data.expires_in ?? 3000) - 60) * 1000,
  }
  return cachedToken.value
}

async function qikinkFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAccessToken()
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ClientId: process.env.QIKINK_CLIENT_ID ?? '',
      Accesstoken: token,
      ...init?.headers,
    },
  })
  if (res.status === 429) {
    throw new Error('Qikink API rate limit exceeded (30 requests/minute) — retry later.')
  }
  if (!res.ok) {
    throw new Error(`Qikink API error ${res.status}: ${await res.text()}`)
  }
  return res.json() as Promise<T>
}

// Qikink wants a 2-letter ISO country code; our checkout form collects free
// text. Common storefront markets are mapped explicitly; anything unmapped
// falls back to "IN" since this store's default currency is INR.
const COUNTRY_CODES: Record<string, string> = {
  india: 'IN',
  'united states': 'US',
  usa: 'US',
  'united kingdom': 'GB',
  uk: 'GB',
  canada: 'CA',
  australia: 'AU',
  'united arab emirates': 'AE',
  uae: 'AE',
  singapore: 'SG',
}

function toCountryCode(country: string): string {
  const trimmed = country.trim()
  if (trimmed.length === 2) return trimmed.toUpperCase()
  return COUNTRY_CODES[trimmed.toLowerCase()] ?? 'IN'
}

function buildShippingAddress(address: ShippingAddress) {
  const [firstName, ...rest] = address.fullName.trim().split(/\s+/)
  return {
    first_name: firstName || address.fullName,
    last_name: rest.join(' '),
    address1: address.line1,
    address2: address.line2 ?? '',
    phone: address.phone ?? '',
    email: address.email ?? '',
    city: address.city,
    zip: address.postalCode,
    province: address.state,
    country_code: toCountryCode(address.country),
  }
}

export const qikinkProvider: FulfillmentProvider = {
  name: 'QIKINK',

  async createOrder(input: CreateFulfillmentOrderInput): Promise<FulfillmentOrderResult> {
    if (!isConfigured()) {
      return {
        providerOrderId: `mock_qikink_${input.orderId}`,
        status: 'PENDING',
        trackingUrl: null,
      }
    }

    const missingArt = input.items.find((item) => !item.printFileUrl)
    if (missingArt) {
      throw new Error(
        `Qikink order requires a print file URL for SKU ${missingArt.providerSku} — cannot create a design_code without artwork.`
      )
    }

    // Qikink caps order_number at 15 chars and design_code at 20 — our cuid
    // orderId is longer, so use its tail (still effectively unique; cuids
    // pack their entropy there).
    const shortId = input.orderId.slice(-15)

    const body = {
      order_number: shortId,
      qikink_shipping: '1', // We don't run our own logistics — Qikink handles shipment end to end.
      gateway: 'Prepaid', // createOrder only runs after Razorpay payment succeeds.
      total_order_value: String(input.totalValue ?? 0),
      line_items: input.items.map((item, index) => ({
        search_from_my_products: 0,
        quantity: String(item.quantity),
        print_type_id: item.printTypeId ?? 1,
        price: String(item.unitPrice ?? 0),
        sku: item.providerSku,
        designs: [
          {
            design_code: `${shortId}-${index}`,
            width_inches: String(item.designWidthInches ?? 10),
            height_inches: String(item.designHeightInches ?? 12),
            placement_sku: item.printPlacement ?? 'fr',
            design_link: item.printFileUrl,
            mockup_link: item.printFileUrl,
          },
        ],
      })),
      shipping_address: buildShippingAddress(input.shippingAddress),
    }

    interface QikinkCreateOrderResponse {
      order_id?: string | number
      id?: string | number
      status?: string
    }
    const result = await qikinkFetch<QikinkCreateOrderResponse>('/api/order/create', {
      method: 'POST',
      body: JSON.stringify(body),
    })

    return {
      providerOrderId: String(result.order_id ?? result.id ?? input.orderId),
      status: result.status ?? 'PENDING',
      trackingUrl: null,
    }
  },

  async getOrderStatus(providerOrderId: string): Promise<FulfillmentOrderResult> {
    if (!isConfigured()) {
      return { providerOrderId, status: 'PENDING', trackingUrl: null }
    }
    // The response shape for GET /api/order wasn't in the docs supplied —
    // this reads the most likely field names defensively and needs
    // confirming against a real sandbox response.
    interface QikinkOrderResponse {
      status?: string
      order_status?: string
      tracking_url?: string | null
      tracking_link?: string | null
      awb?: string | null
    }
    const result = await qikinkFetch<QikinkOrderResponse>(`/api/order?id=${encodeURIComponent(providerOrderId)}`)
    return {
      providerOrderId,
      status: result.status ?? result.order_status ?? 'PENDING',
      trackingUrl: result.tracking_url ?? result.tracking_link ?? null,
    }
  },

  async cancelOrder(): Promise<void> {
    // Qikink's API reference doesn't document a cancel-order endpoint —
    // cancellations currently have to be done manually via dashboard.qikink.com.
    throw new Error('Qikink does not expose a cancel-order API endpoint — cancel manually via dashboard.qikink.com.')
  },

  async listCatalog(): Promise<FulfillmentCatalogItem[]> {
    // Qikink doesn't expose a catalog/SKU-listing API either — SKUs are
    // managed via dashboard.qikink.com -> Products, so this stays mock-only
    // regardless of configuration.
    return [
      { providerSku: 'mock-tee-black-m', title: 'Classic Tee', color: 'Black', size: 'M' },
      { providerSku: 'mock-hoodie-black-l', title: 'Heavyweight Hoodie', color: 'Black', size: 'L' },
    ]
  },

  verifyWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
    if (!isConfigured()) return true
    // No webhook section was present in the docs supplied — Qikink may not
    // push status updates at all. Order-status sync likely needs to be
    // polling-based (call getOrderStatus periodically) rather than
    // webhook-driven; revisit once/if a webhook section of the docs turns up.
    // Until then, fail closed rather than accept an unverifiable payload —
    // QIKINK_WEBHOOK_SECRET must be set and match for anything to be trusted.
    const secret = process.env.QIKINK_WEBHOOK_SECRET
    if (!secret || !signatureHeader) return false
    return verifyHmacSignature(rawBody, signatureHeader, secret)
  },
}
