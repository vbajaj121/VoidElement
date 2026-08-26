"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Caption } from "@/components/ui/typography"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { saveSiteContent } from "../actions"
import type { HeroContent } from "@/lib/validation/site-content"

export function HeroForm({ defaultValues }: { defaultValues: HeroContent }) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [bannerImageUrl, setBannerImageUrl] = useState(defaultValues.bannerImageUrl)
  const { register, handleSubmit } = useForm<HeroContent>({ defaultValues })

  async function onSubmit(values: HeroContent) {
    setSubmitting(true)
    const result = await saveSiteContent("hero", { ...values, bannerImageUrl })
    setSubmitting(false)

    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success("Hero section saved.")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <ImageUploadField label="Banner image" value={bannerImageUrl} onChange={setBannerImageUrl} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <Caption>Eyebrow</Caption>
          <Input className="mt-1" {...register("eyebrow", { required: true })} />
        </label>
        <label className="block">
          <Caption>Scroll hint</Caption>
          <Input className="mt-1" {...register("scrollHint", { required: true })} />
        </label>
      </div>

      <label className="block">
        <Caption>Headline</Caption>
        <Input className="mt-1" {...register("headline", { required: true })} />
      </label>

      <label className="block">
        <Caption>Subtext</Caption>
        <Textarea className="mt-1" rows={2} {...register("subtext", { required: true })} />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <Caption>Primary button label</Caption>
          <Input className="mt-1" {...register("primaryButtonLabel", { required: true })} />
        </label>
        <label className="block">
          <Caption>Primary button link</Caption>
          <Input className="mt-1" {...register("primaryButtonHref", { required: true })} />
        </label>
        <label className="block">
          <Caption>Secondary button label</Caption>
          <Input className="mt-1" {...register("secondaryButtonLabel", { required: true })} />
        </label>
        <label className="block">
          <Caption>Secondary button link</Caption>
          <Input className="mt-1" {...register("secondaryButtonHref", { required: true })} />
        </label>
      </div>

      <Button type="submit" variant="luxury-filled" size="xl" disabled={submitting} data-cursor="hover">
        {submitting ? "Saving…" : "Save changes"}
      </Button>
    </form>
  )
}
