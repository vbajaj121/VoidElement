import { z } from "zod"

export const importVariantSchema = z.object({
  color: z.string().min(1, "Color is required"),
  size: z.string().min(1, "Size is required"),
  providerSku: z.string().min(1, "SKU is required"),
  priceDiff: z.number().int().default(0),
})

export const importProductSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().default(""),
  basePrice: z.number().int().min(0, "Price can't be negative"),
  currency: z.string().default("INR"),
  isLimited: z.boolean().default(false),
  variants: z.array(importVariantSchema).min(1, "Add at least one variant"),
})

export type ImportVariantInput = z.infer<typeof importVariantSchema>
export type ImportProductInput = z.infer<typeof importProductSchema>
