"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Caption, Subheading } from "@/components/ui/typography"
import { GlassPanel } from "@/components/ui/glass-panel"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { saveSiteContent } from "../actions"
import type { ProcessContent } from "@/lib/validation/site-content"

export function ProcessForm({ defaultValues }: { defaultValues: ProcessContent }) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [images, setImages] = useState(defaultValues.steps.map((s) => s.imageUrl))
  const { register, control, handleSubmit } = useForm<ProcessContent>({ defaultValues })
  const { fields, append, remove } = useFieldArray({ control, name: "steps" })

  async function onSubmit(values: ProcessContent) {
    setSubmitting(true)
    const result = await saveSiteContent("process", {
      ...values,
      steps: values.steps.map((step, i) => ({ ...step, imageUrl: images[i] ?? null })),
    })
    setSubmitting(false)
    if (!result.ok) return toast.error(result.error)
    toast.success("Saved.")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <Caption>Eyebrow</Caption>
          <Input className="mt-1" {...register("eyebrow", { required: true })} />
        </label>
        <label className="block">
          <Caption>Heading</Caption>
          <Input className="mt-1" {...register("heading", { required: true })} />
        </label>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Subheading className="text-lg">Steps</Subheading>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            data-cursor="hover"
            onClick={() => {
              append({ number: String(fields.length + 1).padStart(2, "0"), title: "", description: "", imageUrl: null })
              setImages((prev) => [...prev, null])
            }}
          >
            <Plus className="size-3.5" /> Add step
          </Button>
        </div>

        <div className="mt-4 space-y-4">
          {fields.map((field, index) => (
            <GlassPanel key={field.id} className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="grid flex-1 gap-3 sm:grid-cols-[80px_1fr]">
                  <label className="block">
                    <Caption>No.</Caption>
                    <Input className="mt-1" {...register(`steps.${index}.number`, { required: true })} />
                  </label>
                  <label className="block">
                    <Caption>Title</Caption>
                    <Input className="mt-1" {...register(`steps.${index}.title`, { required: true })} />
                  </label>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  data-cursor="hover"
                  onClick={() => {
                    remove(index)
                    setImages((prev) => prev.filter((_, i) => i !== index))
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <label className="block">
                <Caption>Description</Caption>
                <Textarea className="mt-1" rows={2} {...register(`steps.${index}.description`, { required: true })} />
              </label>
              <ImageUploadField
                label="Step image"
                value={images[index] ?? null}
                onChange={(url) => setImages((prev) => prev.map((v, i) => (i === index ? url : v)))}
              />
            </GlassPanel>
          ))}
        </div>
      </div>

      <Button type="submit" variant="luxury-filled" size="xl" disabled={submitting} data-cursor="hover">
        {submitting ? "Saving…" : "Save changes"}
      </Button>
    </form>
  )
}
