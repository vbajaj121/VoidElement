"use client"

import Link from "next/link"
import { m } from "framer-motion"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Magnetic } from "@/components/motion/magnetic"
import { Body, Display, Eyebrow } from "@/components/ui/typography"

export function CheckoutSuccess({ orderNumber, email }: { orderNumber: string; email: string }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center py-16 text-center"
    >
      <m.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
        className="bg-accent-champagne text-matte-black flex size-16 items-center justify-center rounded-full"
      >
        <Check className="size-7" strokeWidth={2} />
      </m.div>

      <Eyebrow className="mt-8">Order {orderNumber}</Eyebrow>
      <Display as="h1" className="mt-4 text-4xl italic sm:text-5xl">
        You&apos;re in the drop.
      </Display>
      <Body className="mt-4 max-w-sm">
        A confirmation is on its way to <span className="text-soft-white">{email}</span>.
        We&apos;ll email you as soon as it ships.
      </Body>

      <Magnetic className="mt-10">
        <Button render={<Link href="/" data-cursor="hover" />} nativeButton={false} variant="luxury-filled" size="xl">
          Continue Shopping
        </Button>
      </Magnetic>
    </m.div>
  )
}
