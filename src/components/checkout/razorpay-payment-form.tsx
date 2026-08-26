"use client"

import { useState } from "react"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { Magnetic } from "@/components/motion/magnetic"
import { Caption } from "@/components/ui/typography"
import { verifyRazorpayPayment } from "@/app/checkout/actions"

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void }
  }
}

interface RazorpaySuccessResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  order_id: string
  handler: (response: RazorpaySuccessResponse) => void
  modal?: { ondismiss?: () => void }
  theme?: { color?: string }
}

interface RazorpayPaymentFormProps {
  orderId: string
  razorpayOrderId: string
  amount: number
  currency: string
  onSuccess: () => void
  onProcessingChange: (processing: boolean) => void
}

export function RazorpayPaymentForm({
  orderId,
  razorpayOrderId,
  amount,
  currency,
  onSuccess,
  onProcessingChange,
}: RazorpayPaymentFormProps) {
  const [scriptReady, setScriptReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

  function openCheckout() {
    if (!keyId) return
    setError(null)
    setSubmitting(true)
    onProcessingChange(true)

    const razorpay = new window.Razorpay({
      key: keyId,
      amount,
      currency,
      name: "Void Element",
      order_id: razorpayOrderId,
      theme: { color: "#c9a668" },
      handler: async (response) => {
        const result = await verifyRazorpayPayment({
          orderId,
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        })
        if (result.ok) {
          onSuccess()
          return
        }
        setError(result.error)
        setSubmitting(false)
        onProcessingChange(false)
      },
      modal: {
        ondismiss: () => {
          setSubmitting(false)
          onProcessingChange(false)
        },
      },
    })
    razorpay.open()
  }

  if (!keyId) {
    return (
      <Caption className="text-red-400">
        Razorpay isn&apos;t configured (missing NEXT_PUBLIC_RAZORPAY_KEY_ID).
      </Caption>
    )
  }

  return (
    <div className="space-y-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" onReady={() => setScriptReady(true)} />
      {error && <Caption className="text-red-400 block">{error}</Caption>}
      <Magnetic className="block w-full">
        <Button
          type="button"
          variant="luxury-filled"
          size="xl"
          className="w-full"
          disabled={!scriptReady || submitting}
          onClick={openCheckout}
          data-cursor="hover"
        >
          {submitting ? "Processing…" : "Pay now"}
        </Button>
      </Magnetic>
    </div>
  )
}
