import { Resend } from 'resend'
import { logger } from '@/lib/logger'

const FROM = process.env.EMAIL_FROM || 'Void Element <onboarding@resend.dev>'

function isConfigured() {
  return Boolean(process.env.RESEND_API_KEY)
}

const resend = isConfigured() ? new Resend(process.env.RESEND_API_KEY) : null

interface SendEmailInput {
  to: string
  subject: string
  html: string
}

/**
 * Logs to the console instead of sending when RESEND_API_KEY is unset —
 * same mock-fallback pattern as the fulfillment providers, so email flows
 * are fully exercisable in local dev with no account signup required.
 */
export async function sendEmail({ to, subject, html }: SendEmailInput) {
  if (!resend) {
    logger.info('email.mock_send', { to, subject, html })
    return { id: 'mock', mocked: true as const }
  }

  const { data, error } = await resend.emails.send({ from: FROM, to, subject, html })
  if (error) {
    logger.error('email.send_failed', { to, subject, error })
    throw new Error(`Failed to send email: ${error.message}`)
  }

  return { id: data?.id ?? 'unknown', mocked: false as const }
}
