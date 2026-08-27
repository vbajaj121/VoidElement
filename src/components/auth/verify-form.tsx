"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Magnetic } from "@/components/motion/magnetic"
import { Eyebrow, Heading, Body, Caption } from "@/components/ui/typography"
import { otpVerifySchema, type OtpVerifyInput } from "@/lib/validation/auth"
import { verifyEmailOtp, resendVerificationOtp } from "@/app/(storefront)/(auth)/actions"

export function VerifyForm({ email }: { email: string }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)

  const form = useForm<OtpVerifyInput>({
    resolver: zodResolver(otpVerifySchema),
    defaultValues: { email, code: "" },
  })

  async function onSubmit(values: OtpVerifyInput) {
    setSubmitting(true)
    setError(null)

    const result = await verifyEmailOtp(values)

    setSubmitting(false)
    if (!result.ok) {
      setError(result.error)
      return
    }

    router.push("/login")
  }

  async function onResend() {
    setResending(true)
    setError(null)
    setNotice(null)
    const result = await resendVerificationOtp(email)
    setResending(false)
    setNotice(result.ok ? "A new code has been sent." : result.error)
  }

  return (
    <div>
      <Eyebrow>Verify your email</Eyebrow>
      <Heading className="mt-3 text-3xl">Enter your code</Heading>
      <Body className="mt-3">
        We sent a 6-digit code to <span className="text-soft-white">{email}</span>.
      </Body>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification code</FormLabel>
                <FormControl>
                  <Input
                    inputMode="numeric"
                    maxLength={6}
                    data-cursor="text"
                    data-cursor-label="Type"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && <Caption className="text-red-400">{error}</Caption>}
          {notice && !error && <Caption>{notice}</Caption>}

          <Magnetic className="block w-full">
            <Button type="submit" variant="luxury-filled" size="xl" className="w-full" disabled={submitting} data-cursor="hover">
              {submitting ? "Verifying…" : "Verify"}
            </Button>
          </Magnetic>
        </form>
      </Form>

      <Button variant="ghost" className="mt-4 w-full" onClick={onResend} disabled={resending} data-cursor="hover">
        {resending ? "Sending…" : "Resend code"}
      </Button>
    </div>
  )
}
