"use client"

import { useEffect, useState } from "react"
import { m } from "framer-motion"
import { LogoMark } from "@/components/brand/logo"
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group"
import { ProductCard } from "@/components/commerce/product-card"
import type { MockProduct } from "@/lib/data/products"

const STORAGE_KEY = "void-element:drop-box-opened"

type BoxPhase = "waiting" | "falling" | "landed" | "idle"

/**
 * Wraps the real product grid — first-time-per-drop, an airdrop-style crate
 * (parachute, sway, a light beacon marking the landing spot, a dust-burst
 * touchdown, chute detaching) falls in as this section scrolls into view.
 * The visitor taps the crate, it opens with a light glow, and the actual
 * grid (its normal StaggerGroup entrance) appears in its place — no
 * separate decorative grid, this just gates when the real one first
 * mounts. Once opened, remembered per `dropId` (localStorage) — every
 * later visit shows the grid directly, same as before this existed.
 */
export function DropReveal({
  dropId,
  enabled,
  products,
  gridClassName,
}: {
  dropId: string
  enabled: boolean
  products: MockProduct[]
  gridClassName: string
}) {
  // Whether the box gate applies at all is SSR-unknowable (localStorage),
  // so default to "just show the grid" and only swap to the box after
  // mount confirms this drop hasn't been opened yet — never flash a box
  // that then has to disappear.
  const [showBox, setShowBox] = useState(false)
  const [phase, setPhase] = useState<BoxPhase>("waiting")
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    if (!enabled) return
    try {
      const openedDropId = localStorage.getItem(STORAGE_KEY)
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (openedDropId === dropId || reducedMotion) return
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowBox(true)
    } catch {
      // localStorage can throw in some private-browsing modes — fail
      // closed (skip the box, just show the grid).
    }
  }, [dropId, enabled])

  function handleLanded() {
    if (phase !== "falling") return
    setPhase("landed")
    // Dust settles and the chute detaches over ~0.9s, then it's just the
    // crate waiting for a tap — same idle state as before this existed.
    setTimeout(() => setPhase("idle"), 900)
  }

  function handleOpen() {
    if (phase !== "idle") return
    setOpened(true)
    try {
      localStorage.setItem(STORAGE_KEY, dropId)
    } catch {
      // Ignore — worst case the box shows again next visit.
    }
  }

  const grid = (
    <StaggerGroup className={gridClassName}>
      {products.map((product) => (
        <StaggerItem key={product.slug}>
          <ProductCard product={product} />
        </StaggerItem>
      ))}
    </StaggerGroup>
  )

  if (!showBox) return grid

  if (opened) {
    return (
      <div className="relative">
        <m.div
          aria-hidden
          className="bg-accent-champagne pointer-events-none absolute top-0 left-1/2 z-10 size-32 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          initial={{ opacity: 0.9, scale: 0.6 }}
          animate={{ opacity: 0, scale: 3 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
        {grid}
      </div>
    )
  }

  return (
    <m.div
      className="relative mt-14 flex min-h-[26rem] items-end justify-center overflow-hidden pt-20"
      // whileInView lives on this un-transformed wrapper rather than the
      // falling crate below — Framer's viewport check reads the element's
      // current (transformed) bounding box, so putting it directly on an
      // element that starts translated 420px above its slot means it can
      // report "not in view" and never fire at all. onViewportEnter here
      // just flips `phase`; the crate's own fall is a plain `animate` keyed
      // off that, decoupled from viewport detection entirely.
      onViewportEnter={() => setPhase((p) => (p === "waiting" ? "falling" : p))}
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {/* Beacon marking the landing spot, PUBG-airdrop style — anchored to
          the ground (a sibling of the falling crate, not a child of it) so
          it stays put while the crate descends through it, rather than
          falling along with it. Fades in with the descent, out on landing. */}
      {phase !== "idle" && (
        <m.div
          aria-hidden
          className="from-accent-champagne/70 pointer-events-none absolute bottom-16 left-1/2 h-full w-px -translate-x-1/2 bg-gradient-to-t to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "falling" ? 0.8 : 0 }}
          transition={{ duration: phase === "falling" ? 0.4 : 0.6 }}
        />
      )}

      <m.div
        className="relative flex flex-col items-center"
        initial={{ y: -420, x: 0, opacity: 0 }}
        animate={
          phase === "waiting"
            ? { y: -420, x: 0, opacity: 0 }
            : { y: 0, x: phase === "falling" ? [0, -18, 14, -8, 0] : 0, opacity: 1 }
        }
        transition={{
          y: { duration: 1.5, ease: [0.45, 0, 0.55, 1] },
          x: { duration: 1.5, times: [0, 0.3, 0.6, 0.85, 1] },
          opacity: { duration: 0.3 },
        }}
        onAnimationComplete={handleLanded}
      >
        {/* Dust burst on touchdown */}
        {phase === "landed" && (
          <m.div
            aria-hidden
            className="border-accent-champagne/50 pointer-events-none absolute bottom-0 left-1/2 size-10 -translate-x-1/2 translate-y-1/2 rounded-full border-2"
            initial={{ opacity: 0.8, scale: 0.3 }}
            animate={{ opacity: 0, scale: 5 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        )}

        {/* Parachute — sways with the crate while falling, detaches and
            blows away once it lands. */}
        {phase !== "idle" && (
          <m.div
            aria-hidden
            className="pointer-events-none absolute -top-14 left-1/2 -translate-x-1/2"
            animate={
              phase === "landed"
                ? { x: 90, y: -70, rotate: 40, opacity: 0 }
                : { x: 0, y: 0, rotate: 0, opacity: 1 }
            }
            transition={{ duration: phase === "landed" ? 0.8 : 0, ease: "easeIn" }}
          >
            <div
              className="from-carbon to-matte-black h-9 w-24 rounded-t-full border-b-0 bg-gradient-to-b"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, color-mix(in oklch, var(--accent-champagne) 35%, transparent) 0 2px, transparent 2px 12px)",
              }}
            />
            <svg viewBox="0 0 96 40" className="absolute top-7 left-0 h-10 w-24 overflow-visible" aria-hidden>
              <line x1="4" y1="0" x2="34" y2="38" stroke="var(--accent-champagne)" strokeWidth="1" opacity="0.6" />
              <line x1="92" y1="0" x2="62" y2="38" stroke="var(--accent-champagne)" strokeWidth="1" opacity="0.6" />
            </svg>
          </m.div>
        )}

        <m.button
          type="button"
          onClick={handleOpen}
          data-cursor="hover"
          aria-label="Open the drop"
          className="relative flex h-40 w-56 flex-col transition-transform hover:scale-[1.03]"
          animate={phase === "landed" ? { scaleY: [1, 0.82, 1.05, 1] } : undefined}
          transition={phase === "landed" ? { duration: 0.4, ease: "easeOut" } : undefined}
        >
          <div className="from-carbon to-matte-black absolute inset-x-0 top-0 h-1/2 rounded-t-xl bg-gradient-to-b" />
          <div className="from-carbon to-matte-black absolute inset-x-0 bottom-0 h-1/2 rounded-b-xl bg-gradient-to-t" />
          <div className="bg-accent-champagne absolute inset-y-0 left-1/2 w-3 -translate-x-1/2" />
          <LogoMark className="text-accent-champagne relative m-auto size-12" />
        </m.button>

        {phase === "idle" && (
          <m.div
            aria-hidden
            className="bg-accent-champagne pointer-events-none absolute top-0 left-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-3xl"
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {phase === "idle" && (
          <m.p
            className="text-warm-grey mt-6 text-xs font-medium tracking-[0.3em] uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Tap to open
          </m.p>
        )}
      </m.div>
    </m.div>
  )
}
