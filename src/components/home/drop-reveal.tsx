"use client"

import { useEffect, useState } from "react"
import { m } from "framer-motion"
import { LogoMark } from "@/components/brand/logo"
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group"
import { ProductCard } from "@/components/commerce/product-card"
import type { MockProduct } from "@/lib/data/products"

const STORAGE_KEY = "void-element:drop-box-opened"

/**
 * Wraps the real product grid — first-time-per-drop, a box falls in as this
 * section scrolls into view; the visitor taps it, it opens with a light
 * glow, and the actual grid (its normal StaggerGroup entrance) appears in
 * its place. No separate decorative grid: the box just gates when the real
 * one first mounts. Once opened, remembered per `dropId` (localStorage) —
 * every later visit skips straight to the grid, same as before this
 * existed.
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

  function handleOpen() {
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
    <div className="mt-14 flex min-h-[26rem] items-center justify-center">
      <m.div
        className="relative flex flex-col items-center"
        initial={{ y: -400, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ type: "spring", bounce: 0.4, duration: 1.1 }}
      >
        <m.div
          aria-hidden
          className="bg-accent-champagne pointer-events-none absolute top-0 left-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-3xl"
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <button
          type="button"
          onClick={handleOpen}
          data-cursor="hover"
          aria-label="Open the drop"
          className="relative flex h-40 w-56 flex-col transition-transform hover:scale-[1.03]"
        >
          <div className="from-carbon to-matte-black absolute inset-x-0 top-0 h-1/2 rounded-t-xl bg-gradient-to-b" />
          <div className="from-carbon to-matte-black absolute inset-x-0 bottom-0 h-1/2 rounded-b-xl bg-gradient-to-t" />
          <div className="bg-accent-champagne absolute inset-y-0 left-1/2 w-3 -translate-x-1/2" />
          <LogoMark className="text-accent-champagne relative m-auto size-12" />
        </button>

        <p className="text-warm-grey mt-6 text-xs font-medium tracking-[0.3em] uppercase">Tap to open</p>
      </m.div>
    </div>
  )
}
