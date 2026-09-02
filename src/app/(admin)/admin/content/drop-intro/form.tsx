"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Caption, Body } from "@/components/ui/typography"
import { saveSiteContent } from "../actions"
import type { DropIntroContent } from "@/lib/validation/site-content"

export function DropIntroForm({ defaultValues }: { defaultValues: DropIntroContent }) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit } = useForm<DropIntroContent>({ defaultValues })

  async function onSubmit(values: DropIntroContent) {
    setSubmitting(true)
    const result = await saveSiteContent("drop-intro", values)
    setSubmitting(false)
    if (!result.ok) return toast.error(result.error)
    toast.success("Saved.")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Body>
        A box falls in as visitors scroll to The Drop section on the homepage. Tapping it opens it — a light glow —
        and the real product grid appears in its place. Shown once per browser per drop — change{" "}
        <strong>Drop ID</strong> below whenever a new drop goes live to make everyone see it again.
      </Body>

      <label className="flex items-center gap-2">
        <input type="checkbox" {...register("enabled")} />
        <Caption>Enabled</Caption>
      </label>

      <label className="block">
        <Caption>Drop ID</Caption>
        <Input className="mt-1" {...register("dropId", { required: true })} />
        <Caption className="mt-1 block">Any unique label works, e.g. &ldquo;drop-003&rdquo; or a date.</Caption>
      </label>

      <Button type="submit" variant="luxury-filled" size="xl" disabled={submitting} data-cursor="hover">
        {submitting ? "Saving…" : "Save changes"}
      </Button>
    </form>
  )
}
