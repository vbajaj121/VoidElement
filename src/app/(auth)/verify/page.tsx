import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { VerifyForm } from "@/components/auth/verify-form"

export const metadata: Metadata = { title: "Verify email" }

interface VerifyPageProps {
  searchParams: Promise<{ email?: string }>
}

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const { email } = await searchParams
  if (!email) redirect("/register")

  return <VerifyForm email={email} />
}
