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
import type { MarqueeContent } from "@/lib/validation/site-content"

// react-hook-form's useFieldArray needs an array of objects, not raw
// strings — same workaround the other list-editing admin forms don't need
// (their arrays are already objects) but a flat string[] does.
interface FormValues {
  messages: { text: string }[]
}

export function MarqueeForm({ defaultValues }: { defaultValues: MarqueeContent }) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const { register, control, handleSubmit } = useForm<FormValues>({
    defaultValues: { messages: defaultValues.messages.map((text) => ({ text })) },
  })
  const { fields, append, remove } = useFieldArray({ control, name: "messages" })

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    const result = await saveSiteContent("marquee", {
      messages: values.messages.map((m) => m.text).filter(Boolean),
    })
    setSubmitting(false)
    if (!result.ok) return toast.error(result.error)
    toast.success("Saved.")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Caption className="block">
        Scrolls in a loop in a strip between the hero and the product grid on the homepage.
      </Caption>

      <div className="flex items-center justify-between">
        <Subheading className="text-lg">Messages</Subheading>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          data-cursor="hover"
          onClick={() => append({ text: "" })}
        >
          <Plus className="size-3.5" /> Add message
        </Button>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <GlassPanel key={field.id} className="flex items-end gap-3 p-4">
            <label className="block flex-1">
              <Caption>Message {index + 1}</Caption>
              <Input className="mt-1" {...register(`messages.${index}.text`, { required: true })} />
            </label>
            <Button type="button" variant="ghost" size="icon" data-cursor="hover" onClick={() => remove(index)}>
              <Trash2 className="size-4" />
            </Button>
          </GlassPanel>
        ))}
        {fields.length === 0 && <Caption className="block">No messages yet — add at least one.</Caption>}
      </div>

      <Button type="submit" variant="luxury-filled" size="xl" disabled={submitting} data-cursor="hover">
        {submitting ? "Saving…" : "Save changes"}
      </Button>
    </form>
  )
}
