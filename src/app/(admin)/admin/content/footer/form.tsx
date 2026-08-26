"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useFieldArray, useForm, type Control } from "react-hook-form"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Caption, Subheading } from "@/components/ui/typography"
import { GlassPanel } from "@/components/ui/glass-panel"
import { saveSiteContent } from "../actions"
import type { FooterContent } from "@/lib/validation/site-content"

function FooterColumnFields({
  control,
  register,
  columnIndex,
  onRemoveColumn,
}: {
  control: Control<FooterContent>
  register: ReturnType<typeof useForm<FooterContent>>["register"]
  columnIndex: number
  onRemoveColumn: () => void
}) {
  const { fields, append, remove } = useFieldArray({ control, name: `columns.${columnIndex}.links` })

  return (
    <GlassPanel className="space-y-3 p-4">
      <div className="flex items-center justify-between gap-3">
        <label className="block flex-1">
          <Caption>Column heading</Caption>
          <Input className="mt-1" {...register(`columns.${columnIndex}.heading`, { required: true })} />
        </label>
        <Button type="button" variant="ghost" size="icon" data-cursor="hover" onClick={onRemoveColumn}>
          <Trash2 className="size-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {fields.map((field, linkIndex) => (
          <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] items-end gap-2">
            <label className="block">
              <Caption>Label</Caption>
              <Input className="mt-1" {...register(`columns.${columnIndex}.links.${linkIndex}.label`, { required: true })} />
            </label>
            <label className="block">
              <Caption>Link</Caption>
              <Input className="mt-1" {...register(`columns.${columnIndex}.links.${linkIndex}.href`, { required: true })} />
            </label>
            <Button type="button" variant="ghost" size="icon" data-cursor="hover" onClick={() => remove(linkIndex)}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          data-cursor="hover"
          onClick={() => append({ label: "", href: "" })}
        >
          <Plus className="size-3.5" /> Add link
        </Button>
      </div>
    </GlassPanel>
  )
}

export function FooterForm({ defaultValues }: { defaultValues: FooterContent }) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const { register, control, handleSubmit } = useForm<FooterContent>({ defaultValues })
  const { fields, append, remove } = useFieldArray({ control, name: "columns" })

  async function onSubmit(values: FooterContent) {
    setSubmitting(true)
    const result = await saveSiteContent("footer", values)
    setSubmitting(false)
    if (!result.ok) return toast.error(result.error)
    toast.success("Saved.")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <label className="block">
        <Caption>Tagline (near logo)</Caption>
        <Textarea className="mt-1" rows={2} {...register("tagline", { required: true })} />
      </label>
      <label className="block">
        <Caption>Bottom bar tagline</Caption>
        <Input className="mt-1" {...register("bottomTagline", { required: true })} />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <Caption>Instagram URL</Caption>
          <Input className="mt-1" {...register("instagramUrl", { required: true })} />
        </label>
        <label className="block">
          <Caption>Twitter / X URL</Caption>
          <Input className="mt-1" {...register("twitterUrl", { required: true })} />
        </label>
        <label className="block">
          <Caption>YouTube URL</Caption>
          <Input className="mt-1" {...register("youtubeUrl", { required: true })} />
        </label>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Subheading className="text-lg">Columns</Subheading>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            data-cursor="hover"
            onClick={() => append({ heading: "", links: [{ label: "", href: "" }] })}
          >
            <Plus className="size-3.5" /> Add column
          </Button>
        </div>

        <div className="mt-4 space-y-4">
          {fields.map((field, index) => (
            <FooterColumnFields
              key={field.id}
              control={control}
              register={register}
              columnIndex={index}
              onRemoveColumn={() => remove(index)}
            />
          ))}
        </div>
      </div>

      <Button type="submit" variant="luxury-filled" size="xl" disabled={submitting} data-cursor="hover">
        {submitting ? "Saving…" : "Save changes"}
      </Button>
    </form>
  )
}
