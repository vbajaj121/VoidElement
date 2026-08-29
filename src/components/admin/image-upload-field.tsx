"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { Loader2, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Caption } from "@/components/ui/typography"
import { uploadContentImage } from "@/app/(admin)/admin/content/actions"

type UploadResult = { ok: true; url: string } | { ok: false; error: string }

export function ImageUploadField({
  label,
  value,
  onChange,
  uploadAction = uploadContentImage,
}: {
  label: string
  value: string | null
  onChange: (url: string | null) => void
  /** Defaults to the site-content uploader; pass a different action (e.g. uploadProductImage) to store elsewhere in Cloudinary. */
  uploadAction?: (formData: FormData) => Promise<UploadResult>
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const result = await uploadAction(formData)

      if (!result.ok) {
        toast.error(result.error)
        return
      }
      onChange(result.url)
    } catch {
      // A framework-level failure (e.g. the request body exceeding Next's
      // server-action size limit) rejects instead of returning {ok:false} —
      // without this the button would be stuck on "Uploading…" forever.
      toast.error("Upload failed. The file may be too large — try a smaller image.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <Caption>{label}</Caption>
      <div className="mt-2 flex items-center gap-4">
        {value ? (
          <div className="border-border relative size-24 overflow-hidden rounded-lg border">
            <Image src={value} alt="" fill className="object-cover" />
          </div>
        ) : (
          <div className="border-border text-warm-grey flex size-24 items-center justify-center rounded-lg border border-dashed text-xs">
            No image
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            data-cursor="hover"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
            {uploading ? "Uploading…" : value ? "Replace" : "Upload image"}
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              data-cursor="hover"
              onClick={() => onChange(null)}
            >
              <X className="size-3.5" /> Remove
            </Button>
          )}
        </div>

        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>
    </div>
  )
}
