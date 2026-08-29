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
import { GlassPanel } from "@/components/ui/glass-panel"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { saveProduct, deleteProduct, uploadProductImage } from "../actions"

interface VariantFormValues {
  id?: string
  color: string
  swatch: string
  size: string
  priceDiff: number
  stock: number
}

interface ImageFormValues {
  url: string
  alt: string
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
  defaultImages = [],
}: {
  productId: string | null
  defaultValues: ProductFormValues
  defaultImages?: ImageFormValues[]
}) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const { register, control, handleSubmit } = useForm<ProductFormValues>({ defaultValues })
  const { fields, append, remove } = useFieldArray({ control, name: "variants" })

  // Images live in local state rather than react-hook-form (same pattern as
  // the site-content CMS forms) — uploads happen immediately on file select,
  // independent of the form's own submit cycle.
  const [images, setImages] = useState<ImageFormValues[]>(defaultImages)

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
      images: images.filter((img) => img.url),
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
          <Subheading className="text-lg">Images</Subheading>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            data-cursor="hover"
            onClick={() => setImages((prev) => [...prev, { url: "", alt: "" }])}
          >
            <Plus className="size-3.5" /> Add image
          </Button>
        </div>
        <Caption className="mt-1 block">First image is used as the primary product photo. Order matters.</Caption>

        <div className="mt-4 space-y-3">
          {images.map((img, index) => (
            <GlassPanel key={index} className="flex items-start justify-between gap-4 p-4">
              <ImageUploadField
                label={`Image ${index + 1}`}
                value={img.url || null}
                onChange={(url) =>
                  setImages((prev) => prev.map((v, i) => (i === index ? { ...v, url: url ?? "" } : v)))
                }
                uploadAction={uploadProductImage}
              />
              <div className="flex flex-1 items-end gap-2">
                <label className="block flex-1">
                  <Caption>Alt text (optional)</Caption>
                  <Input
                    className="mt-1"
                    value={img.alt}
                    onChange={(e) =>
                      setImages((prev) => prev.map((v, i) => (i === index ? { ...v, alt: e.target.value } : v)))
                    }
                  />
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  data-cursor="hover"
                  onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </GlassPanel>
          ))}
          {images.length === 0 && (
            <Caption className="block">No images yet — the storefront falls back to the gradient swatch above.</Caption>
          )}
        </div>
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
