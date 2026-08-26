"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Caption } from "@/components/ui/typography"
import { updateOrderStatus, retryFulfillment } from "../../actions"
import type { OrderStatus, FulfillmentProviderName } from "@prisma/client"

const STATUSES: OrderStatus[] = [
  "PENDING_PAYMENT",
  "PAID",
  "IN_PRODUCTION",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
]

interface OrderStatusFormProps {
  orderId: string
  status: OrderStatus
  providerName: FulfillmentProviderName | null
  providerOrderId: string | null
  trackingUrl: string | null
}

export function OrderStatusForm({ orderId, status, providerName, providerOrderId, trackingUrl }: OrderStatusFormProps) {
  const [current, setCurrent] = useState(status)
  const [saving, setSaving] = useState(false)
  const [retrying, setRetrying] = useState(false)

  async function handleStatusChange(value: OrderStatus | null) {
    if (!value) return
    setCurrent(value)
    setSaving(true)
    const result = await updateOrderStatus(orderId, value)
    setSaving(false)
    if (result.ok) toast.success("Status updated.")
    else toast.error(result.error)
  }

  async function handleRetry() {
    setRetrying(true)
    const result = await retryFulfillment(orderId)
    setRetrying(false)
    if (result.ok) toast.success("Fulfillment retried.")
    else toast.error(result.error)
  }

  return (
    <div className="space-y-4">
      <div>
        <Caption>Status</Caption>
        <div className="mt-2">
          <Select value={current} onValueChange={handleStatusChange} disabled={saving}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Caption>Fulfillment</Caption>
        <Caption className="mt-1 block">
          {providerName ?? "Not sent"} {providerOrderId && `· ${providerOrderId}`}
        </Caption>
        {trackingUrl && (
          <a href={trackingUrl} target="_blank" rel="noreferrer" className="text-accent-champagne text-xs underline">
            {trackingUrl}
          </a>
        )}
      </div>

      <Button variant="secondary" size="sm" onClick={handleRetry} disabled={retrying} data-cursor="hover">
        {retrying ? "Retrying…" : "Retry fulfillment"}
      </Button>
    </div>
  )
}
