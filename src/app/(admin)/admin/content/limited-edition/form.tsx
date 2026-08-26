"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Caption } from "@/components/ui/typography"
import { saveSiteContent } from "../actions"
import type { LimitedEditionContent } from "@/lib/validation/site-content"

export function LimitedEditionForm({
  defaultValues,
  products,
}: {
  defaultValues: LimitedEditionContent
  products: { slug: string; title: string }[]
}) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit } = useForm<LimitedEditionContent>({ defaultValues })

  async function onSubmit(values: LimitedEditionContent) {
    setSubmitting(true)
    const result = await saveSiteContent("limited-edition", values)
    setSubmitting(false)
    if (!result.ok) return toast.error(result.error)
    toast.success("Saved.")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <label className="block">
        <Caption>Eyebrow</Caption>
        <Input className="mt-1" {...register("eyebrow", { required: true })} />
      </label>
      <label className="block">
        <Caption>Headline</Caption>
        <Input className="mt-1" {...register("headline", { required: true })} />
      </label>
      <label className="block">
        <Caption>Body</Caption>
        <Textarea className="mt-1" rows={3} {...register("body", { required: true })} />
      </label>
      <label className="block">
        <Caption>Button label</Caption>
        <Input className="mt-1" {...register("buttonLabel", { required: true })} />
      </label>
      <label className="block">
        <Caption>Featured product</Caption>
        <select
          className="border-input mt-1 h-8 w-full rounded-lg border bg-transparent px-2.5 text-sm outline-none"
          {...register("productSlug", { required: true })}
        >
          {products.length === 0 && <option value="">No products available</option>}
          {products.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.title}
            </option>
          ))}
        </select>
      </label>
      <Button type="submit" variant="luxury-filled" size="xl" disabled={submitting} data-cursor="hover">
        {submitting ? "Saving…" : "Save changes"}
      </Button>
    </form>
  )
}
