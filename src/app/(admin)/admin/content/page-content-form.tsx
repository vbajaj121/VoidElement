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
import { saveSiteContent } from "./actions"
import type { PageContent, SiteContentSection } from "@/lib/validation/site-content"

export function PageContentForm({
  section,
  defaultValues,
  showContactEmail = false,
}: {
  section: SiteContentSection
  defaultValues: PageContent
  showContactEmail?: boolean
}) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const { register, control, handleSubmit } = useForm<PageContent>({ defaultValues })
  const { fields, append, remove } = useFieldArray({ control, name: "blocks" })

  async function onSubmit(values: PageContent) {
    setSubmitting(true)
    const result = await saveSiteContent(section, values)
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

      <label className="block">
        <Caption>Intro text</Caption>
        <Textarea className="mt-1" rows={2} {...register("intro")} />
      </label>

      {showContactEmail && (
        <label className="block">
          <Caption>Contact email</Caption>
          <Input className="mt-1" {...register("contactEmail")} />
        </label>
      )}

      <div>
        <div className="flex items-center justify-between">
          <Subheading className="text-lg">Content blocks</Subheading>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            data-cursor="hover"
            onClick={() => append({ title: "", body: "" })}
          >
            <Plus className="size-3.5" /> Add block
          </Button>
        </div>

        <div className="mt-4 space-y-3">
          {fields.map((field, index) => (
            <GlassPanel key={field.id} className="space-y-2 p-4">
              <div className="flex items-start justify-between gap-3">
                <label className="block flex-1">
                  <Caption>Title</Caption>
                  <Input className="mt-1" {...register(`blocks.${index}.title`, { required: true })} />
                </label>
                <Button type="button" variant="ghost" size="icon" data-cursor="hover" onClick={() => remove(index)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <label className="block">
                <Caption>Body</Caption>
                <Textarea className="mt-1" rows={2} {...register(`blocks.${index}.body`, { required: true })} />
              </label>
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
