"use client"

import dynamic from "next/dynamic"

// `next/dynamic` with `ssr: false` can only be called from a Client
// Component, not directly in the (Server Component) root layout — hence
// this one-line wrapper. CustomCursor renders an independent overlay with
// no content of its own to lose by skipping SSR, so this is a clean win:
// its code (plus the framer-motion hooks it uses) loads in its own chunk,
// after first paint, instead of blocking every page's initial hydration.
const CustomCursor = dynamic(() => import("./custom-cursor").then((mod) => mod.CustomCursor), {
  ssr: false,
})

export function CustomCursorLoader() {
  return <CustomCursor />
}
