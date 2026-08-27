"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { Reveal } from "@/components/motion/reveal"
import { Magnetic } from "@/components/motion/magnetic"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eyebrow, Heading, Body } from "@/components/ui/typography"
import { subscribeToNewsletter } from "@/lib/newsletter"
import type { NewsletterContent } from "@/lib/validation/site-content"

export function NewsletterClient({ content }: { content: NewsletterContent }) {
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || submitting) return

    setSubmitting(true)
    const result = await subscribeToNewsletter({ email })
    setSubmitting(false)

    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success(result.alreadySubscribed ? "You're already on the list." : "You're on the list.", {
      description: result.alreadySubscribed ? undefined : "Check your inbox for a quick confirmation.",
    })
    setEmail("")
  }

  return (
    <Section>
      <Container className="flex flex-col items-center text-center">
        <Reveal>
          <Eyebrow>{content.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <Heading className="mt-4">{content.heading}</Heading>
        </Reveal>
        <Reveal delay={0.2}>
          <Body className="mt-4 max-w-sm">{content.body}</Body>
        </Reveal>

        <Reveal delay={0.3} className="mt-8 w-full max-w-sm">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              type="email"
              required
              placeholder={content.placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              data-cursor="text"
              data-cursor-label="Type"
              className="h-11"
            />
            <Magnetic>
              <Button type="submit" variant="luxury-filled" className="h-11 px-6" disabled={submitting}>
                {submitting ? "…" : content.buttonLabel}
              </Button>
            </Magnetic>
          </form>
        </Reveal>
      </Container>
    </Section>
  )
}
