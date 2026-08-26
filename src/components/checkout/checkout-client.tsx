"use client"

import { useState } from "react"
import Link from "next/link"
import { Container } from "@/components/layout/container"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { CheckoutProgress, type CheckoutStage } from "@/components/checkout/checkout-progress"
import { CheckoutSuccess } from "@/components/checkout/checkout-success"
import { OrderSummary } from "@/components/checkout/order-summary"
import { RazorpayPaymentForm } from "@/components/checkout/razorpay-payment-form"
import { Button } from "@/components/ui/button"
import { Magnetic } from "@/components/motion/magnetic"
import { Eyebrow, Heading, Body, Caption, Subheading } from "@/components/ui/typography"
import { useCart } from "@/lib/store/cart"
import type { CheckoutInput } from "@/lib/validation/checkout"
import { createOrder, confirmMockPayment } from "@/app/checkout/actions"

export function CheckoutClient() {
  const lines = useCart((s) => s.lines)
  const clearCart = useCart((s) => s.clear)

  const [stage, setStage] = useState<CheckoutStage>("form")
  const [progress, setProgress] = useState({ contactDone: false, shippingDone: false })
  const [error, setError] = useState<string | null>(null)
  const [confirmedEmail, setConfirmedEmail] = useState("")
  const [orderId, setOrderId] = useState<string | null>(null)
  const [payment, setPayment] = useState<{ razorpayOrderId: string; amount: number; currency: string } | null>(null)

  async function handleSubmit(values: CheckoutInput) {
    setStage("processing")
    setError(null)
    setConfirmedEmail(values.email)

    const { email, ...shipping } = values
    const result = await createOrder({
      contact: { email },
      shipping,
      items: lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
    })

    if (!result.ok) {
      setError(result.error)
      setStage("form")
      return
    }

    setOrderId(result.orderId)

    if (result.mocked) {
      setStage("confirming")
      await confirmMockPayment(result.orderId)
      setStage("success")
      clearCart()
      return
    }

    setPayment({ razorpayOrderId: result.razorpayOrderId, amount: result.amount, currency: result.currency })
    setStage("payment")
  }

  async function handlePaymentSuccess() {
    setStage("success")
    clearCart()
  }

  if (lines.length === 0 && stage === "form") {
    return (
      <Container className="pt-40 text-center">
        <Eyebrow>Checkout</Eyebrow>
        <Heading className="mt-4">Your bag is empty.</Heading>
        <Body className="mx-auto mt-4 max-w-md">
          Add something to your bag before checking out.
        </Body>
        <Magnetic className="mt-8 inline-flex">
          <Button render={<Link href="/" data-cursor="hover" />} nativeButton={false} variant="luxury-filled" size="xl">
            Back To Shop
          </Button>
        </Magnetic>
      </Container>
    )
  }

  if (stage === "success" && orderId) {
    return (
      <Container>
        <CheckoutSuccess orderNumber={orderId} email={confirmedEmail} />
      </Container>
    )
  }

  return (
    <Container>
      <Eyebrow>Checkout</Eyebrow>
      <Heading className="mt-4">Almost yours.</Heading>

      <div className="mt-10">
        <CheckoutProgress
          contactDone={progress.contactDone}
          shippingDone={progress.shippingDone}
          stage={stage}
        />
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
        {stage === "payment" && payment && orderId ? (
          <div>
            <Subheading>Payment</Subheading>
            <div className="mt-4">
              <RazorpayPaymentForm
                orderId={orderId}
                razorpayOrderId={payment.razorpayOrderId}
                amount={payment.amount}
                currency={payment.currency}
                onSuccess={handlePaymentSuccess}
                onProcessingChange={(processing) => setStage(processing ? "confirming" : "payment")}
              />
            </div>
          </div>
        ) : (
          <div>
            <CheckoutForm
              onSubmit={handleSubmit}
              onProgressChange={setProgress}
              disabled={stage === "processing" || stage === "confirming"}
            />
            {error && <Caption className="text-red-400 mt-4 block">{error}</Caption>}
          </div>
        )}
        <OrderSummary lines={lines} />
      </div>
    </Container>
  )
}
