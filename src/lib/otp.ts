import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db/prisma'
import type { OtpPurpose } from '@prisma/client'

const OTP_TTL_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 5

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/** Generates a 6-digit code, stores its hash, and returns the plaintext code to send by email. */
export async function createOtp(identifier: string, purpose: OtpPurpose) {
  await prisma.otpCode.deleteMany({ where: { identifier, purpose, consumedAt: null } })

  const code = generateCode()
  const codeHash = await bcrypt.hash(code, 10)

  await prisma.otpCode.create({
    data: {
      identifier,
      purpose,
      codeHash,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
  })

  return code
}

export async function verifyOtp(identifier: string, purpose: OtpPurpose, code: string) {
  const otp = await prisma.otpCode.findFirst({
    where: { identifier, purpose, consumedAt: null },
    orderBy: { createdAt: 'desc' },
  })

  if (!otp) return { ok: false as const, reason: 'not_found' as const }
  if (otp.expiresAt < new Date()) return { ok: false as const, reason: 'expired' as const }
  if (otp.attempts >= MAX_ATTEMPTS) return { ok: false as const, reason: 'too_many_attempts' as const }

  const valid = await bcrypt.compare(code, otp.codeHash)
  if (!valid) {
    await prisma.otpCode.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } })
    return { ok: false as const, reason: 'invalid' as const }
  }

  await prisma.otpCode.update({ where: { id: otp.id }, data: { consumedAt: new Date() } })
  return { ok: true as const }
}
