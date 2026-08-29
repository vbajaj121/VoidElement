"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useFieldArray, useForm, type Control } from "react-hook-form"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { GlassPanel } from "@/components/ui/glass-panel"
import { Caption, Subheading, Body } from "@/components/ui/typography"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { parseVendorTable, slugify, type ParsedProductGroup } from "@/lib/product-import-parser"
import { createProductFromImport } from "./actions"
import { uploadProductImage } from "../../actions"

interface EditableImage {
  url: string
  alt: string
}

interface EditableVariant {
  color: string
  size: string
  providerSku: string
  price: number
}

interface EditableProduct {
  title: string
  slug: string
  category: string
  description: string
  isLimited: boolean
  variants: EditableVariant[]
}

interface FormValues {
  products: EditableProduct[]
}

type ProductStatus = "idle" | "submitting" | "done" | "error"

function toEditableProduct(group: ParsedProductGroup): EditableProduct {
  return {
    title: group.name,
    slug: slugify(group.name),
    category: "",
    description: "",
    isLimited: false,
    variants: group.variants.map((v) => ({ color: v.color, size: v.size, providerSku: v.providerSku, price: v.price })),
  }
}

export function ImportForm() {
  const router = useRouter()
  const [raw, setRaw] = useState("")
  const [warnings, setWarnings] = useState<string[]>([])
  const [parsed, setParsed] = useState(false)
  const [statuses, setStatuses] = useState<Record<number, { status: ProductStatus; error?: string }>>({})
  // Images live outside react-hook-form, keyed by product index — same
  // pattern as product-form.tsx (uploads happen immediately on file select).
  const [imagesByIndex, setImagesByIndex] = useState<Record<number, EditableImage[]>>({})

  const { control, register, handleSubmit, reset } = useForm<FormValues>({ defaultValues: { products: [] } })
  const { fields, remove } = useFieldArray({ control, name: "products" })

  function onParse() {
    const result = parseVendorTable(raw)
    if (result.products.length === 0) {
      toast.error("Couldn't find any product rows in that text.")
      return
    }
    reset({ products: result.products.map(toEditableProduct) })
    setWarnings(result.warnings)
    setStatuses({})
    setImagesByIndex({})
    setParsed(true)
  }

  async function onSubmit(values: FormValues) {
    let anySucceeded = false

    for (let i = 0; i < values.products.length; i++) {
      const product = values.products[i]
      setStatuses((s) => ({ ...s, [i]: { status: "submitting" } }))

      const basePrice = Math.round((product.variants[0]?.price ?? 0) * 100)
      const result = await createProductFromImport({
        slug: product.slug,
        title: product.title,
        category: product.category,
        description: product.description,
        basePrice,
        currency: "INR",
        isLimited: product.isLimited,
        variants: product.variants.map((v) => ({
          color: v.color,
          size: v.size,
          providerSku: v.providerSku,
          priceDiff: Math.round(v.price * 100) - basePrice,
        })),
        images: (imagesByIndex[i] ?? []).filter((img) => img.url),
      })

      if (result.ok) {
        anySucceeded = true
        setStatuses((s) => ({ ...s, [i]: { status: "done" } }))
      } else {
        setStatuses((s) => ({ ...s, [i]: { status: "error", error: result.error } }))
      }
    }

    if (anySucceeded) toast.success("Product(s) created as drafts — review and publish from Products.")
    if (values.products.length > 0 && anySucceeded) {
      setTimeout(() => router.push("/admin/products"), 1200)
    }
  }

  return (
    <div className="max-w-3xl space-y-8">
      {!parsed && (
        <div className="space-y-3">
          <label className="block">
            <Caption>Pasted vendor table</Caption>
            <Textarea
              className="mt-1 font-mono text-sm"
              rows={12}
              placeholder={"Name\tVariation\tProduct SKU\tDesign SKU\tStore SKU\tImage\tProduct Cost\tSelling Cost\nUnisex Oversized Standard T-Shirt\tWhite - XS\tUOSsMRnHs-Wh-XS\t-\tv-...\t\t236.25\t799"}
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
            />
          </label>
          <Button type="button" variant="luxury-filled" data-cursor="hover" onClick={onParse} disabled={!raw.trim()}>
            Parse table
          </Button>
        </div>
      )}

      {parsed && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {warnings.length > 0 && (
            <GlassPanel className="border-amber-500/30 bg-amber-500/5 p-4">
              {warnings.map((w, i) => (
                <Body key={i} className="text-amber-200/90">
                  {w}
                </Body>
              ))}
            </GlassPanel>
          )}

          {fields.map((field, index) => (
            <ImportProductCard
              key={field.id}
              control={control}
              register={register}
              index={index}
              status={statuses[index]}
              onRemove={() => remove(index)}
              images={imagesByIndex[index] ?? []}
              onImagesChange={(update) =>
                setImagesByIndex((prev) => ({ ...prev, [index]: update(prev[index] ?? []) }))
              }
            />
          ))}

          <div className="flex items-center gap-3">
            <Button type="submit" variant="luxury-filled" size="xl" data-cursor="hover">
              Create {fields.length} product{fields.length === 1 ? "" : "s"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              data-cursor="hover"
              onClick={() => {
                setParsed(false)
                setRaw("")
              }}
            >
              Start over
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

function ImportProductCard({
  control,
  register,
  index,
  status,
  onRemove,
  images,
  onImagesChange,
}: {
  control: Control<FormValues>
  register: ReturnType<typeof useForm<FormValues>>["register"]
  index: number
  status?: { status: ProductStatus; error?: string }
  onRemove: () => void
  images: EditableImage[]
  onImagesChange: (update: (prev: EditableImage[]) => EditableImage[]) => void
}) {
  const { fields: variantFields, remove: removeVariant } = useFieldArray({
    control,
    name: `products.${index}.variants`,
  })

  return (
    <GlassPanel className="space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="grid flex-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <Caption>Title</Caption>
            <Input className="mt-1" {...register(`products.${index}.title`, { required: true })} />
          </label>
          <label className="block">
            <Caption>Slug</Caption>
            <Input className="mt-1" {...register(`products.${index}.slug`, { required: true })} />
          </label>
          <label className="block">
            <Caption>Category</Caption>
            <Input
              className="mt-1"
              list="import-categories"
              placeholder="Tees, Hoodies, Outerwear, Bottoms…"
              {...register(`products.${index}.category`, { required: true })}
            />
            <datalist id="import-categories">
              <option value="Tees" />
              <option value="Hoodies" />
              <option value="Outerwear" />
              <option value="Bottoms" />
            </datalist>
          </label>
          <label className="flex items-center gap-2 self-end">
            <input type="checkbox" {...register(`products.${index}.isLimited`)} />
            <Caption>Limited edition</Caption>
          </label>
        </div>
        <Button type="button" variant="ghost" size="icon" data-cursor="hover" onClick={onRemove}>
          <Trash2 className="size-4" />
        </Button>
      </div>

      <label className="block">
        <Caption>Description</Caption>
        <Textarea
          className="mt-1"
          rows={3}
          placeholder="Left blank, a placeholder description is used until you edit it."
          {...register(`products.${index}.description`)}
        />
      </label>

      <div>
        <div className="flex items-center justify-between">
          <Subheading className="text-lg">Images</Subheading>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            data-cursor="hover"
            onClick={() => onImagesChange((prev) => [...prev, { url: "", alt: "" }])}
          >
            <Plus className="size-3.5" /> Add image
          </Button>
        </div>
        <Caption className="mt-1 block">First image is used as the primary product photo. Order matters.</Caption>

        <div className="mt-3 space-y-3">
          {images.map((img, imgIndex) => (
            <GlassPanel key={imgIndex} className="flex items-start justify-between gap-4 p-4">
              <ImageUploadField
                label={`Image ${imgIndex + 1}`}
                value={img.url || null}
                onChange={(url) =>
                  onImagesChange((prev) => prev.map((v, i) => (i === imgIndex ? { ...v, url: url ?? "" } : v)))
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
                      onImagesChange((prev) => prev.map((v, i) => (i === imgIndex ? { ...v, alt: e.target.value } : v)))
                    }
                  />
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  data-cursor="hover"
                  onClick={() => onImagesChange((prev) => prev.filter((_, i) => i !== imgIndex))}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </GlassPanel>
          ))}
          {images.length === 0 && (
            <Caption className="block">No images yet — the storefront falls back to the gradient swatch until you add one.</Caption>
          )}
        </div>
      </div>

      <div>
        <Subheading className="text-lg">Variants ({variantFields.length})</Subheading>
        <div className="mt-3 space-y-2">
          {variantFields.map((field, vIndex) => (
            <div
              key={field.id}
              className="border-border grid grid-cols-[1fr_1fr_1.5fr_1fr_auto] items-end gap-2 rounded-lg border p-3"
            >
              <label className="block">
                <Caption>Color</Caption>
                <Input className="mt-1" {...register(`products.${index}.variants.${vIndex}.color`, { required: true })} />
              </label>
              <label className="block">
                <Caption>Size</Caption>
                <Input className="mt-1" {...register(`products.${index}.variants.${vIndex}.size`, { required: true })} />
              </label>
              <label className="block">
                <Caption>Provider SKU</Caption>
                <Input
                  className="mt-1 font-mono text-xs"
                  {...register(`products.${index}.variants.${vIndex}.providerSku`, { required: true })}
                />
              </label>
              <label className="block">
                <Caption>Price (₹)</Caption>
                <Input
                  type="number"
                  step="0.01"
                  className="mt-1"
                  {...register(`products.${index}.variants.${vIndex}.price`, { required: true, valueAsNumber: true })}
                />
              </label>
              <Button type="button" variant="ghost" size="icon" data-cursor="hover" onClick={() => removeVariant(vIndex)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {status?.status === "done" && <Body className="text-emerald-400">Created as a draft.</Body>}
      {status?.status === "error" && <Body className="text-red-400">{status.error}</Body>}
      {status?.status === "submitting" && <Body>Creating…</Body>}
    </GlassPanel>
  )
}
