export type FulfillmentProviderName = 'PRINTROVE' | 'PRINTIFY' | 'QIKINK'

export interface ShippingAddress {
  fullName: string
  line1: string
  line2?: string | null
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string | null
  /** Required by Qikink's shipping_address.email; unused by Printrove/Printify's placeholder integrations. */
  email?: string | null
}

export interface FulfillmentOrderItem {
  providerSku: string
  quantity: number
  printFileUrl: string
  /** Per-unit price in the order's smallest currency unit (matches OrderItem.unitPrice). Required by Qikink's line-item `price`; unused by Printrove/Printify's placeholder integrations. */
  unitPrice?: number
  /** Qikink `print_type_id` (1=DTG, 2=All-over, 3=Embroidery, 5=Accessories, 6=Puff, 7=Glow-in-dark, 12-15=Vinyl variants, 17=DTF). Defaults to DTG when omitted. */
  printTypeId?: number
  /** Qikink `placement_sku`: "fr" | "bk" | "lp" | "rp" | "rs" | "ls". Defaults to "fr" (front). */
  printPlacement?: string
  /** Print area dimensions in inches, required by Qikink for a new design_code. Default to a standard 10x12in tee print area when omitted. */
  designWidthInches?: number
  designHeightInches?: number
}

export interface CreateFulfillmentOrderInput {
  orderId: string
  items: FulfillmentOrderItem[]
  shippingAddress: ShippingAddress
  /** Order total in the smallest currency unit. Required by Qikink's `total_order_value`; unused by Printrove/Printify's placeholder integrations. */
  totalValue?: number
}

export interface FulfillmentOrderResult {
  providerOrderId: string
  status: string
  trackingUrl?: string | null
}

export interface FulfillmentCatalogItem {
  providerSku: string
  title: string
  color: string
  size: string
}

/**
 * Every print-on-demand provider (Printrove, Qikink, Printify, future ones)
 * must implement this surface. Nothing outside `lib/fulfillment` may import a
 * provider-specific module directly — always go through `getFulfillmentProvider()`.
 */
export interface FulfillmentProvider {
  readonly name: FulfillmentProviderName
  createOrder(input: CreateFulfillmentOrderInput): Promise<FulfillmentOrderResult>
  getOrderStatus(providerOrderId: string): Promise<FulfillmentOrderResult>
  cancelOrder(providerOrderId: string): Promise<void>
  listCatalog(): Promise<FulfillmentCatalogItem[]>
  verifyWebhookSignature(rawBody: string, signatureHeader: string | null): boolean
}
