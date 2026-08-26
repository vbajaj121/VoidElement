import { ImageResponse } from "next/og"

export const alt = "Void Element — Wear the Unrepeatable"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
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
          background: "linear-gradient(135deg, #050505 0%, #1c1c1c 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: 14,
            color: "#f5f5f0",
          }}
        >
          VOID ELEMENT
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 26,
            letterSpacing: 6,
            color: "#8a8a8a",
          }}
        >
          WEAR THE UNREPEATABLE
        </div>
      </div>
    ),
    { ...size }
  )
}
