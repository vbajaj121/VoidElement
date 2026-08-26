import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata: Metadata = { title: "Reset password" }

interface ResetPasswordPageProps {
  searchParams: Promise<{ email?: string }>
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { email } = await searchParams
  if (!email) redirect("/forgot-password")

  return <ResetPasswordForm email={email} />
}
