"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Magnetic } from "@/components/motion/magnetic"
import { Subheading } from "@/components/ui/typography"
import {
  checkoutSchema,
  contactSchema,
  shippingSchema,
  type CheckoutInput,
} from "@/lib/validation/checkout"

interface CheckoutFormProps {
  onSubmit: (values: CheckoutInput) => void
  onProgressChange: (progress: { contactDone: boolean; shippingDone: boolean }) => void
  disabled: boolean
}

export function CheckoutForm({ onSubmit, onProgressChange, disabled }: CheckoutFormProps) {
  const form = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      fullName: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phone: "",
    },
  })

  const values = form.watch()

  const contactDone = contactSchema.safeParse({ email: values.email }).success
  const shippingDone = shippingSchema.safeParse(values).success

  useEffect(() => {
    onProgressChange({ contactDone, shippingDone })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactDone, shippingDone])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        <section>
          <Subheading>Contact</Subheading>
          <div className="mt-4">
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
          </div>
        </section>

        <section>
          <Subheading>Shipping Address</Subheading>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input data-cursor="text" data-cursor-label="Type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="line1"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input data-cursor="text" data-cursor-label="Type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="line2"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Apartment, suite, etc. (optional)</FormLabel>
                  <FormControl>
                    <Input data-cursor="text" data-cursor-label="Type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input data-cursor="text" data-cursor-label="Type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input data-cursor="text" data-cursor-label="Type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal code</FormLabel>
                  <FormControl>
                    <Input data-cursor="text" data-cursor-label="Type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input data-cursor="text" data-cursor-label="Type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" data-cursor="text" data-cursor-label="Type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <Magnetic className="block w-full">
          <Button
            type="submit"
            variant="luxury-filled"
            size="xl"
            className="w-full"
            disabled={disabled}
            data-cursor="hover"
          >
            Continue To Payment
          </Button>
        </Magnetic>
      </form>
    </Form>
  )
}
