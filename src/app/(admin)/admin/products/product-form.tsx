"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Caption, Subheading } from "@/components/ui/typography"
import { saveProduct, deleteProduct } from "../actions"

interface VariantFormValues {
  id?: string
  color: string
  swatch: string
  size: string
  priceDiff: number
  stock: number
}

interface ProductFormValues {
  slug: string
  title: string
  category: string
  description: string
  basePrice: number
  currency: string
  colorFrom: string
  colorTo: string
  isLimited: boolean
  isPublished: boolean
  variants: VariantFormValues[]
}

export function ProductForm({
  productId,
  defaultValues,
}: {
  productId: string | null
  defaultValues: ProductFormValues
}) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const { register, control, handleSubmit } = useForm<ProductFormValues>({ defaultValues })
  const { fields, append, remove } = useFieldArray({ control, name: "variants" })

  async function onSubmit(values: ProductFormValues) {
    setSubmitting(true)
    const result = await saveProduct(productId, {
      ...values,
      basePrice: Number(values.basePrice),
      variants: values.variants.map((v) => ({
        ...v,
        priceDiff: Number(v.priceDiff),
        stock: Number(v.stock),
      })),
    })
    setSubmitting(false)

    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success("Product saved.")
    router.push("/admin/products")
  }

  async function onDelete() {
    if (!productId) return
    if (!confirm("Delete this product? This can't be undone.")) return
    const result = await deleteProduct(productId)
    if (result.ok) router.push("/admin/products")
    else toast.error(result.error)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <Caption>Title</Caption>
          <Input className="mt-1" {...register("title", { required: true })} />
        </label>
        <label className="block">
          <Caption>Slug</Caption>
          <Input className="mt-1" {...register("slug", { required: true })} />
        </label>
        <label className="block">
          <Caption>Category</Caption>
          <Input className="mt-1" {...register("category", { required: true })} />
        </label>
        <label className="block">
          <Caption>Base price (minor units)</Caption>
          <Input type="number" className="mt-1" {...register("basePrice", { required: true })} />
        </label>
        <label className="block">
          <Caption>Currency</Caption>
          <Input className="mt-1" {...register("currency", { required: true })} />
        </label>
        <label className="block">
          <Caption>Gradient from</Caption>
          <Input type="color" className="mt-1 h-10" {...register("colorFrom")} />
        </label>
        <label className="block">
          <Caption>Gradient to</Caption>
          <Input type="color" className="mt-1 h-10" {...register("colorTo")} />
        </label>
      </div>

      <label className="block">
        <Caption>Description</Caption>
        <Textarea className="mt-1" rows={4} {...register("description", { required: true })} />
      </label>

      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("isLimited")} />
          <Caption>Limited edition</Caption>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("isPublished")} />
          <Caption>Published</Caption>
        </label>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Subheading className="text-lg">Variants</Subheading>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            data-cursor="hover"
            onClick={() => append({ color: "", swatch: "#000000", size: "", priceDiff: 0, stock: 0 })}
          >
            <Plus className="size-3.5" /> Add variant
          </Button>
        </div>

        <div className="mt-4 space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="border-border grid grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] items-end gap-2 rounded-lg border p-3">
              <label className="block">
                <Caption>Color</Caption>
                <Input className="mt-1" {...register(`variants.${index}.color`, { required: true })} />
              </label>
              <label className="block">
                <Caption>Swatch</Caption>
                <Input type="color" className="mt-1 h-9" {...register(`variants.${index}.swatch`)} />
              </label>
              <label className="block">
                <Caption>Size</Caption>
                <Input className="mt-1" {...register(`variants.${index}.size`, { required: true })} />
              </label>
              <label className="block">
                <Caption>Price diff</Caption>
                <Input type="number" className="mt-1" {...register(`variants.${index}.priceDiff`)} />
              </label>
              <label className="block">
                <Caption>Stock</Caption>
                <Input type="number" className="mt-1" {...register(`variants.${index}.stock`)} />
              </label>
              <Button type="button" variant="ghost" size="icon" data-cursor="hover" onClick={() => remove(index)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" variant="luxury-filled" size="xl" disabled={submitting} data-cursor="hover">
          {submitting ? "Saving…" : "Save product"}
        </Button>
        {productId && (
          <Button type="button" variant="destructive" onClick={onDelete} data-cursor="hover">
            Delete
          </Button>
        )}
      </div>
    </form>
  )
}
