import { ImageResponse } from "next/og"
import { getProductBySlug } from "@/lib/data/products.server"
import { formatPrice } from "@/lib/format"

export const alt = "Product preview"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  const [from, to] = product?.colors ?? ["#050505", "#2e2e2e"]

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: "rgba(245,245,240,0.7)" }}>
          VOID ELEMENT
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            marginTop: 20,
            color: "#f5f5f0",
            textAlign: "center",
            padding: "0 80px",
          }}
        >
          {product?.title ?? "Void Element"}
        </div>
        {product && (
          <div style={{ display: "flex", fontSize: 30, marginTop: 24, color: "rgba(245,245,240,0.85)" }}>
            {formatPrice(product.price, product.currency)}
          </div>
        )}
      </div>
    ),
    { ...size }
  )
}
