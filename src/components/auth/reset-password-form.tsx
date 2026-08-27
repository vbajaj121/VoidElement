"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Magnetic } from "@/components/motion/magnetic"
import { Eyebrow, Heading, Caption } from "@/components/ui/typography"
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validation/auth"
import { resetPasswordWithOtp } from "@/app/(storefront)/(auth)/actions"

export function ResetPasswordForm({ email }: { email: string }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email, code: "", password: "" },
  })

  async function onSubmit(values: ResetPasswordInput) {
    setSubmitting(true)
    setError(null)

    const result = await resetPasswordWithOtp(values)

    setSubmitting(false)
    if (!result.ok) {
      setError(result.error)
      return
    }

    router.push("/login")
  }

  return (
    <div>
      <Eyebrow>Reset password</Eyebrow>
      <Heading className="mt-3 text-3xl">Choose a new password</Heading>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reset code</FormLabel>
                <FormControl>
                  <Input inputMode="numeric" maxLength={6} data-cursor="text" data-cursor-label="Type" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input type="password" data-cursor="text" data-cursor-label="Type" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && <Caption className="text-red-400">{error}</Caption>}

          <Magnetic className="block w-full">
            <Button type="submit" variant="luxury-filled" size="xl" className="w-full" disabled={submitting} data-cursor="hover">
              {submitting ? "Saving…" : "Save new password"}
            </Button>
          </Magnetic>
        </form>
      </Form>
    </div>
  )
}
