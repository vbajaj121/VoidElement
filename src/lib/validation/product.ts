import { z } from "zod"
import { OrderStatus } from "@prisma/client"

export const productVariantInputSchema = z.object({
  id: z.string().optional(),
  color: z.string().min(1, "Color is required"),
  swatch: z.string().min(1, "Swatch color is required"),
  size: z.string().min(1, "Size is required"),
  priceDiff: z.number().int("Price diff must be a whole number"),
  stock: z.number().int().min(0, "Stock can't be negative"),
})

export const productInputSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  basePrice: z.number().int().min(0, "Price can't be negative"),
  currency: z.string().min(1, "Currency is required"),
  colorFrom: z.string().min(1),
  colorTo: z.string().min(1),
  isLimited: z.boolean(),
  isPublished: z.boolean(),
  variants: z.array(productVariantInputSchema).min(1, "Add at least one variant"),
})

export const orderStatusSchema = z.nativeEnum(OrderStatus)

export type ProductVariantInput = z.infer<typeof productVariantInputSchema>
export type ProductInput = z.infer<typeof productInputSchema>
