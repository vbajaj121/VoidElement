'use server'

import { prisma } from '@/lib/db/prisma'
import { isUniqueConstraintViolation } from '@/lib/prisma-errors'
import { rateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import { sendEmail } from '@/lib/email/resend'
import { newsletterWelcomeEmailTemplate } from '@/lib/email/templates'
import { newsletterSubscribeSchema } from '@/lib/validation/newsletter'

type SubscribeResult = { ok: true; alreadySubscribed: boolean } | { ok: false; error: string }

export async function subscribeToNewsletter(rawInput: { email: string }): Promise<SubscribeResult> {
  const parsed = newsletterSubscribeSchema.safeParse(rawInput)
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Enter a valid email.' }
  const { email } = parsed.data

  const limited = rateLimit(`newsletter:${email}`, 5, 60_000)
  if (!limited.ok) return { ok: false, error: 'Too many attempts. Try again shortly.' }

  try {
    await prisma.newsletterSubscriber.create({ data: { email } })
  } catch (err) {
    if (isUniqueConstraintViolation(err)) {
      // Already on the list — treat as success rather than leaking whether
      // an email is subscribed to someone probing addresses that aren't theirs.
      return { ok: true, alreadySubscribed: true }
    }
    logger.error('newsletter.subscribe_failed', { err: String(err) })
    return { ok: false, error: 'Could not subscribe right now. Please try again.' }
  }

  const sent = await sendEmail({
    to: email,
    subject: "You're on the list",
    html: newsletterWelcomeEmailTemplate(),
  }).catch((err) => {
    logger.error('newsletter.welcome_email_failed', { email, err: String(err) })
    return null
  })

  logger.info('newsletter.subscribed', { email, emailSent: Boolean(sent) })
  return { ok: true, alreadySubscribed: false }
}
