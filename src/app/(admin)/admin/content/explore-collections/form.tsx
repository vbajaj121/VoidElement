"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Caption } from "@/components/ui/typography"
import { saveSiteContent } from "../actions"
import type { ExploreCollectionsContent } from "@/lib/validation/site-content"

export function ExploreCollectionsForm({ defaultValues }: { defaultValues: ExploreCollectionsContent }) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit } = useForm<ExploreCollectionsContent>({ defaultValues })

  async function onSubmit(values: ExploreCollectionsContent) {
    setSubmitting(true)
    const result = await saveSiteContent("explore-collections", values)
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
        <Caption>Heading</Caption>
        <Input className="mt-1" {...register("heading", { required: true })} />
      </label>
      <label className="block">
        <Caption>&ldquo;Browse all&rdquo; button label</Caption>
        <Input className="mt-1" {...register("browseAllLabel", { required: true })} />
      </label>
      <Button type="submit" variant="luxury-filled" size="xl" disabled={submitting} data-cursor="hover">
        {submitting ? "Saving…" : "Save changes"}
      </Button>
    </form>
  )
}
