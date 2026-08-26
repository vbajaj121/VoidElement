import { formatPrice } from '@/lib/format'

const shell = (title: string, body: string) => `
<div style="background:#0a0a0a;padding:48px 24px;font-family:-apple-system,Helvetica,Arial,sans-serif;">
  <div style="max-width:480px;margin:0 auto;background:#151515;border:1px solid #2a2a2a;border-radius:16px;padding:40px;">
    <p style="color:#8a8a8a;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 24px;">Void Element</p>
    <h1 style="color:#f5f5f0;font-size:22px;font-weight:500;margin:0 0 16px;">${title}</h1>
    ${body}
  </div>
</div>`

export function otpEmailTemplate(code: string) {
  return shell(
    'Your verification code',
    `<p style="color:#c9c9c9;font-size:15px;line-height:1.6;margin:0 0 24px;">Enter this code to continue. It expires in 10 minutes.</p>
     <p style="color:#f5f5f0;font-size:32px;letter-spacing:0.3em;font-weight:600;margin:0 0 24px;">${code}</p>
     <p style="color:#6a6a6a;font-size:13px;">If you didn't request this, you can ignore this email.</p>`
  )
}

interface OrderEmailItem {
  title: string
  quantity: number
  unitPrice: number
}

export function orderConfirmationEmailTemplate(input: {
  orderId: string
  items: OrderEmailItem[]
  total: number
  currency: string
}) {
  const rows = input.items
    .map(
      (item) =>
        `<tr><td style="padding:8px 0;color:#c9c9c9;font-size:14px;">${item.title} × ${item.quantity}</td>
         <td style="padding:8px 0;color:#f5f5f0;font-size:14px;text-align:right;">${formatPrice(item.unitPrice * item.quantity, input.currency)}</td></tr>`
    )
    .join('')

  return shell(
    'Order confirmed',
    `<p style="color:#c9c9c9;font-size:15px;line-height:1.6;margin:0 0 24px;">Order #${input.orderId} is confirmed and moving into production.</p>
     <table style="width:100%;border-collapse:collapse;border-top:1px solid #2a2a2a;padding-top:12px;">${rows}</table>
     <p style="color:#f5f5f0;font-size:16px;font-weight:600;margin:24px 0 0;text-align:right;">Total: ${formatPrice(input.total, input.currency)}</p>`
  )
}

export function shippingUpdateEmailTemplate(input: {
  orderId: string
  status: string
  trackingUrl?: string | null
}) {
  return shell(
    'Order update',
    `<p style="color:#c9c9c9;font-size:15px;line-height:1.6;margin:0 0 24px;">Order #${input.orderId} is now <strong style="color:#f5f5f0;">${input.status}</strong>.</p>
     ${input.trackingUrl ? `<a href="${input.trackingUrl}" style="color:#8a5cf6;font-size:14px;">Track your shipment →</a>` : ''}`
  )
}
