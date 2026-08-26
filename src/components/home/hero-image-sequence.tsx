"use client"

import { useEffect, useRef, useState } from "react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

// ---- Configuration ----
/** Total scroll distance the sequence scrubs across, as a ScrollTrigger "end" value. */
const SCROLL_DISTANCE = "+=300%"
/** How each frame fits the canvas box. "contain" never crops the garment. */
const IMAGE_FIT: "contain" | "cover" = "contain"
/** Scrub smoothing — a small lerp for a precise-but-not-jerky feel, no autoplay. */
const SCRUB_SMOOTHING = 0.5
/**
 * The source frames carry a small AI-tool watermark in the bottom-right
 * corner. Trimmed from the source before drawing rather than shipped on a
 * "premium" hero. Fractions of the source image; raise/lower if the crop
 * feels too aggressive or not enough once you see it live.
 */
const SOURCE_CROP = { top: 0, right: 0.09, bottom: 0.1, left: 0 }
/** Caps device-pixel-ratio canvas scaling so very high-DPI phones don't over-render. */
const MAX_DPR = 2

interface HeroImageSequenceProps {
  frames: string[]
  children?: React.ReactNode
}

export function HeroImageSequence({ frames, children }: HeroImageSequenceProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const currentFrameRef = useRef(0)
  const [posterLoaded, setPosterLoaded] = useState(false)

  const lastFrame = frames[frames.length - 1]
  const firstFrame = frames[0]

  function drawFrame(index: number) {
    const canvas = canvasRef.current
    const img = imagesRef.current[index]
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
    const boxWidth = canvas.clientWidth
    const boxHeight = canvas.clientHeight
    if (boxWidth === 0 || boxHeight === 0) return

    if (canvas.width !== boxWidth * dpr || canvas.height !== boxHeight * dpr) {
      canvas.width = boxWidth * dpr
      canvas.height = boxHeight * dpr
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = "#0a0a0a"
    ctx.fillRect(0, 0, boxWidth, boxHeight)

    const sx = img.naturalWidth * SOURCE_CROP.left
    const sy = img.naturalHeight * SOURCE_CROP.top
    const sWidth = img.naturalWidth * (1 - SOURCE_CROP.left - SOURCE_CROP.right)
    const sHeight = img.naturalHeight * (1 - SOURCE_CROP.top - SOURCE_CROP.bottom)
    const sourceRatio = sWidth / sHeight
    const boxRatio = boxWidth / boxHeight

    let drawWidth = boxWidth
    let drawHeight = boxHeight
    const fitWide = IMAGE_FIT === "contain" ? sourceRatio > boxRatio : sourceRatio <= boxRatio

    if (fitWide) {
      drawWidth = boxWidth
      drawHeight = boxWidth / sourceRatio
    } else {
      drawHeight = boxHeight
      drawWidth = boxHeight * sourceRatio
    }

    const dx = (boxWidth - drawWidth) / 2
    const dy = (boxHeight - drawHeight) / 2

    ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, drawWidth, drawHeight)
  }

  // Preload every frame off-DOM; frame 0 is prioritized so the first paint
  // never waits on the rest of the sequence.
  useEffect(() => {
    if (frames.length === 0) return
    let cancelled = false
    const imgs: HTMLImageElement[] = new Array(frames.length)

    function loadFrame(i: number) {
      const img = new window.Image()
      img.decoding = "async"
      img.src = frames[i]
      imgs[i] = img
      img.onload = () => {
        if (cancelled) return
        if (i === 0) setPosterLoaded(true)
        // Catches up if this frame finishes loading after scroll already
        // requested it (so a fast scroll never leaves the canvas stuck on
        // a stale frame once the correct one becomes available).
        if (i === currentFrameRef.current) drawFrame(i)
      }
      return img
    }

    loadFrame(0)
    for (let i = 1; i < frames.length; i++) loadFrame(i)
    imagesRef.current = imgs

    return () => {
      cancelled = true
    }
  }, [frames])

  // Redraw the current frame on resize (canvas bitmap doesn't auto-rescale with CSS size).
  useEffect(() => {
    function handleResize() {
      drawFrame(currentFrameRef.current)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const pinRef = useScrollReveal<HTMLDivElement>((el, _gsap, ScrollTrigger) => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) {
      // Static hero on the final, fully-assembled frame — no scroll-jacking.
      currentFrameRef.current = frames.length - 1
      const settle = () => drawFrame(frames.length - 1)
      const img = imagesRef.current[frames.length - 1]
      if (img?.complete) settle()
      else if (img) img.onload = settle
      return
    }

    ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: SCROLL_DISTANCE,
      pin: true,
      scrub: SCRUB_SMOOTHING,
      onUpdate: (self) => {
        const next = Math.min(frames.length - 1, Math.floor(self.progress * frames.length))
        if (next !== currentFrameRef.current) {
          currentFrameRef.current = next
          drawFrame(next)
        }
      },
    })
  }, [frames])

  return (
    <div ref={pinRef} className="relative h-screen w-full overflow-hidden bg-[#0a0a0a]">
      <div ref={wrapperRef} className="absolute inset-0">
        {/* Poster frame — guarantees something is painted immediately, before
            the canvas/JS finishes hydrating, and as the true no-JS fallback. */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lastFrame}
            alt="Void Element — assembled hoodie"
            className="absolute inset-0 h-full w-full object-contain"
          />
        </noscript>
        {!posterLoaded && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={firstFrame}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-contain"
          />
        )}
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </div>

      {children}
    </div>
  )
}
