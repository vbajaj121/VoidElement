"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GlassPanel } from "@/components/ui/glass-panel"
import { Caption } from "@/components/ui/typography"
import { setActiveFulfillmentProvider } from "../actions"
import type { FulfillmentProviderName } from "@/lib/fulfillment"

const PROVIDERS: { value: FulfillmentProviderName; label: string }[] = [
  { value: "PRINTROVE", label: "Printrove" },
  { value: "PRINTIFY", label: "Printify" },
  { value: "QIKINK", label: "Qikink" },
]

export function FulfillmentProviderForm({ currentProvider }: { currentProvider: FulfillmentProviderName }) {
  const [provider, setProvider] = useState(currentProvider)
  const [saving, setSaving] = useState(false)

  async function handleChange(value: FulfillmentProviderName | null) {
    if (!value) return
    setProvider(value)
    setSaving(true)
    const result = await setActiveFulfillmentProvider(value)
    setSaving(false)
    if (result.ok) toast.success(`Active provider set to ${value}.`)
    else toast.error(result.error)
  }

  return (
    <GlassPanel className="p-6">
      <Caption>Active provider</Caption>
      <div className="mt-3">
        <Select value={provider} onValueChange={handleChange} disabled={saving}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PROVIDERS.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </GlassPanel>
  )
}
