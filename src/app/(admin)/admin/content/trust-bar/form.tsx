"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Caption, Subheading } from "@/components/ui/typography"
import { GlassPanel } from "@/components/ui/glass-panel"
import { saveSiteContent } from "../actions"
import { TRUST_BAR_ICONS, type TrustBarContent } from "@/lib/validation/site-content"

const ICON_LABELS: Record<(typeof TRUST_BAR_ICONS)[number], string> = {
  "shield-check": "Shield Check",
  sparkles: "Sparkles",
  "rotate-ccw": "Rotate / Returns",
  lock: "Lock",
  truck: "Truck / Shipping",
  award: "Award",
  star: "Star",
  heart: "Heart",
}

export function TrustBarForm({ defaultValues }: { defaultValues: TrustBarContent }) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const { register, control, handleSubmit } = useForm<TrustBarContent>({ defaultValues })
  const { fields, append, remove } = useFieldArray({ control, name: "items" })

  async function onSubmit(values: TrustBarContent) {
    setSubmitting(true)
    const result = await saveSiteContent("trust-bar", values)
    setSubmitting(false)
    if (!result.ok) return toast.error(result.error)
    toast.success("Saved.")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <Subheading className="text-lg">Items</Subheading>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          data-cursor="hover"
          onClick={() => append({ icon: "shield-check", title: "", subtitle: "" })}
        >
          <Plus className="size-3.5" /> Add item
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <GlassPanel key={field.id} className="grid gap-3 p-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
            <label className="block">
              <Caption>Icon</Caption>
              <select
                className="border-input mt-1 h-8 w-full rounded-lg border bg-transparent px-2.5 text-sm outline-none"
                {...register(`items.${index}.icon`, { required: true })}
              >
                {TRUST_BAR_ICONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {ICON_LABELS[icon]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <Caption>Title</Caption>
              <Input className="mt-1" {...register(`items.${index}.title`, { required: true })} />
            </label>
            <label className="block">
              <Caption>Subtitle</Caption>
              <Input className="mt-1" {...register(`items.${index}.subtitle`, { required: true })} />
            </label>
            <Button type="button" variant="ghost" size="icon" data-cursor="hover" onClick={() => remove(index)}>
              <Trash2 className="size-4" />
            </Button>
          </GlassPanel>
        ))}
      </div>

      <Button type="submit" variant="luxury-filled" size="xl" disabled={submitting} data-cursor="hover">
        {submitting ? "Saving…" : "Save changes"}
      </Button>
    </form>
  )
}
