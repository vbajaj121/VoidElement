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
import type { NewsletterContent } from "@/lib/validation/site-content"

export function NewsletterForm({ defaultValues }: { defaultValues: NewsletterContent }) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit } = useForm<NewsletterContent>({ defaultValues })

  async function onSubmit(values: NewsletterContent) {
    setSubmitting(true)
    const result = await saveSiteContent("newsletter", values)
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
        <Caption>Body</Caption>
        <Textarea className="mt-1" rows={2} {...register("body", { required: true })} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <Caption>Email placeholder</Caption>
          <Input className="mt-1" {...register("placeholder", { required: true })} />
        </label>
        <label className="block">
          <Caption>Button label</Caption>
          <Input className="mt-1" {...register("buttonLabel", { required: true })} />
        </label>
      </div>
      <Button type="submit" variant="luxury-filled" size="xl" disabled={submitting} data-cursor="hover">
        {submitting ? "Saving…" : "Save changes"}
      </Button>
    </form>
  )
}
