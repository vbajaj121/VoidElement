import type { Metadata } from "next"
import { CheckoutClient } from "@/components/checkout/checkout-client"
import { Section } from "@/components/layout/section"

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
}

export default function CheckoutPage() {
  return (
    <main className="bg-background">
      <Section className="pt-32">
        <CheckoutClient />
      </Section>
    </main>
  )
}
