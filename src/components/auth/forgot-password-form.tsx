"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Magnetic } from "@/components/motion/magnetic"
import { Eyebrow, Heading, Body } from "@/components/ui/typography"
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validation/auth"
import { requestPasswordReset } from "@/app/(storefront)/(auth)/actions"

export function ForgotPasswordForm() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  async function onSubmit(values: ForgotPasswordInput) {
    setSubmitting(true)
    await requestPasswordReset(values)
    setSubmitting(false)
    router.push(`/reset-password?email=${encodeURIComponent(values.email)}`)
  }

  return (
    <div>
      <Eyebrow>Reset password</Eyebrow>
      <Heading className="mt-3 text-3xl">Forgot your password?</Heading>
      <Body className="mt-3">Enter your email and we&apos;ll send you a reset code.</Body>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" data-cursor="text" data-cursor-label="Type" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Magnetic className="block w-full">
            <Button type="submit" variant="luxury-filled" size="xl" className="w-full" disabled={submitting} data-cursor="hover">
              {submitting ? "Sending…" : "Send reset code"}
            </Button>
          </Magnetic>
        </form>
      </Form>
    </div>
  )
}
