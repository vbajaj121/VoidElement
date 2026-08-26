import { z } from "zod"

export const contactSchema = z.object({
  email: z.string().email("Enter a valid email"),
})

export const shippingSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  line1: z.string().min(3, "Enter your street address"),
  line2: z.string().optional(),
  city: z.string().min(2, "Enter your city"),
  state: z.string().min(2, "Enter your state"),
  postalCode: z.string().min(3, "Enter a valid postal code"),
  country: z.string().min(2, "Enter your country"),
  phone: z.string().min(7, "Enter a valid phone number"),
})

export const checkoutSchema = contactSchema.and(shippingSchema)

export const orderItemSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.int().min(1).max(20),
})

export const createOrderSchema = z.object({
  contact: contactSchema,
  shipping: shippingSchema,
  items: z.array(orderItemSchema).min(1),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>
export type OrderItemInput = z.infer<typeof orderItemSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>
