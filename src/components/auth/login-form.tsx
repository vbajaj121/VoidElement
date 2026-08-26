"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Magnetic } from "@/components/motion/magnetic"
import { Eyebrow, Heading, Body, Caption } from "@/components/ui/typography"
import { loginSchema, type LoginInput } from "@/lib/validation/auth"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(values: LoginInput) {
    setSubmitting(true)
    setError(null)

    const result = await signIn("credentials", { ...values, redirect: false })

    setSubmitting(false)
    if (result?.error) {
      setError("Incorrect email or password, or your email isn't verified yet.")
      return
    }

    router.push(searchParams.get("callbackUrl") || "/account")
    router.refresh()
  }

  return (
    <div>
      <Eyebrow>Welcome back</Eyebrow>
      <Heading className="mt-3 text-3xl">Sign in</Heading>

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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
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
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </Magnetic>
        </form>
      </Form>

      <div className="mt-6 flex items-center justify-between">
        <Body>
          <Link href="/forgot-password" data-cursor="hover" className="hover:text-soft-white underline">
            Forgot password?
          </Link>
        </Body>
        <Body>
          <Link href="/register" data-cursor="hover" className="hover:text-soft-white underline">
            Create account
          </Link>
        </Body>
      </div>
    </div>
  )
}
