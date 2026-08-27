"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Magnetic } from "@/components/motion/magnetic"
import { Eyebrow, Heading, Body, Caption } from "@/components/ui/typography"
import { registerSchema, type RegisterInput } from "@/lib/validation/auth"
import { registerUser } from "@/app/(storefront)/(auth)/actions"

export function RegisterForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  })

  async function onSubmit(values: RegisterInput) {
    setSubmitting(true)
    setError(null)

    const result = await registerUser(values)

    setSubmitting(false)
    if (!result.ok) {
      setError(result.error)
      return
    }

    router.push(`/verify?email=${encodeURIComponent(values.email)}`)
  }

  return (
    <div>
      <Eyebrow>Join</Eyebrow>
      <Heading className="mt-3 text-3xl">Create your account</Heading>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input data-cursor="text" data-cursor-label="Type" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
              {submitting ? "Creating account…" : "Create account"}
            </Button>
          </Magnetic>
        </form>
      </Form>

      <Body className="mt-6">
        Already have an account?{" "}
        <Link href="/login" data-cursor="hover" className="hover:text-soft-white underline">
          Sign in
        </Link>
      </Body>
    </div>
  )
}
