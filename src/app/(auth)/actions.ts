'use server'

import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db/prisma'
import { createOtp, verifyOtp } from '@/lib/otp'
import { sendEmail } from '@/lib/email/resend'
import { otpEmailTemplate } from '@/lib/email/templates'
import { rateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import {
  registerSchema,
  otpVerifySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type RegisterInput,
  type OtpVerifyInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from '@/lib/validation/auth'

type ActionResult = { ok: true } | { ok: false; error: string }

/**
 * Never throws — a transient Resend outage shouldn't crash the calling
 * server action (which would otherwise surface as a raw 500 even though the
 * DB write it followed already succeeded). Callers decide how to react to a
 * failed send; requestPasswordReset in particular must NOT let this turn
 * into a different return value than the "email not found" case, or it
 * reintroduces the exact account-enumeration leak that function's blanket
 * `{ ok: true }` is there to prevent.
 */
async function sendOtpEmail(email: string, purpose: 'EMAIL_VERIFY' | 'PASSWORD_RESET'): Promise<boolean> {
  const code = await createOtp(email, purpose)
  try {
    await sendEmail({ to: email, subject: 'Your verification code', html: otpEmailTemplate(code) })
    return true
  } catch (err) {
    logger.error('auth.otp_email_failed', { email, purpose, err: String(err) })
    return false
  }
}

export async function registerUser(input: RegisterInput): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Invalid input.' }
  const { name, email, password } = parsed.data

  const limited = rateLimit(`register:${email}`, 3, 60_000)
  if (!limited.ok) return { ok: false, error: 'Too many attempts. Try again shortly.' }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing?.emailVerified) return { ok: false, error: 'An account with this email already exists.' }

  const passwordHash = await bcrypt.hash(password, 10)

  await prisma.user.upsert({
    where: { email },
    update: { name, password: passwordHash },
    create: { name, email, password: passwordHash },
  })

  const sent = await sendOtpEmail(email, 'EMAIL_VERIFY')
  logger.info('auth.register', { email })
  if (!sent) {
    return { ok: false, error: "Account created, but we couldn't send a verification email. Try resending it from the verify page." }
  }
  return { ok: true }
}

export async function resendVerificationOtp(email: string): Promise<ActionResult> {
  const limited = rateLimit(`otp:${email}`, 3, 60_000)
  if (!limited.ok) return { ok: false, error: 'Too many attempts. Try again shortly.' }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || user.emailVerified) return { ok: false, error: 'Nothing to verify.' }

  const sent = await sendOtpEmail(email, 'EMAIL_VERIFY')
  if (!sent) return { ok: false, error: "Couldn't send the code. Try again shortly." }
  return { ok: true }
}

export async function verifyEmailOtp(input: OtpVerifyInput): Promise<ActionResult> {
  const parsed = otpVerifySchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Invalid input.' }
  const { email, code } = parsed.data

  const result = await verifyOtp(email, 'EMAIL_VERIFY', code)
  if (!result.ok) return { ok: false, error: 'That code is invalid or expired.' }

  await prisma.user.update({ where: { email }, data: { emailVerified: new Date() } })
  logger.info('auth.email_verified', { email })
  return { ok: true }
}

export async function requestPasswordReset(input: ForgotPasswordInput): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Invalid input.' }
  const { email } = parsed.data

  const limited = rateLimit(`reset:${email}`, 3, 60_000)
  if (!limited.ok) return { ok: false, error: 'Too many attempts. Try again shortly.' }

  const user = await prisma.user.findUnique({ where: { email } })
  // Always report success so this can't be used to enumerate registered emails.
  if (!user?.password) return { ok: true }

  await sendOtpEmail(email, 'PASSWORD_RESET')
  return { ok: true }
}

export async function resetPasswordWithOtp(input: ResetPasswordInput): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Invalid input.' }
  const { email, code, password } = parsed.data

  const result = await verifyOtp(email, 'PASSWORD_RESET', code)
  if (!result.ok) return { ok: false, error: 'That code is invalid or expired.' }

  const passwordHash = await bcrypt.hash(password, 10)
  await prisma.user.update({ where: { email }, data: { password: passwordHash } })
  logger.info('auth.password_reset', { email })
  return { ok: true }
}
