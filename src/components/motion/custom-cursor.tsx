'use client'

import { useEffect, useState } from 'react'
import { m, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

type CursorVariant = 'default' | 'hover' | 'text' | 'preview'

type CursorState = {
  variant: CursorVariant
  label?: string
  previewSrc?: string
}

const SIZE: Record<CursorVariant, number> = {
  default: 12,
  hover: 56,
  text: 80,
  preview: 140,
}

/**
 * Award-site-style cursor: a small dot that inverts against whatever's under it
 * (mix-blend-mode: difference — no per-pixel sampling needed), expands on
 * `[data-cursor="hover"]` elements, and can show text or an image preview via
 * `data-cursor="text" data-cursor-label="..."` / `data-cursor="preview" data-cursor-preview="/img.jpg"`.
 * Disabled entirely on touch/coarse-pointer devices.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [state, setState] = useState<CursorState>({ variant: 'default' })

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 })

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    // matchMedia is unavailable during SSR, so this can only be known client-side —
    // the one-extra-render-on-mount tradeoff is unavoidable here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(isFinePointer)
    if (!isFinePointer) return

    document.documentElement.classList.add('cursor-none')

    function handleMove(e: MouseEvent) {
      x.set(e.clientX)
      y.set(e.clientY)
    }

    function handleOver(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest?.('[data-cursor]') as HTMLElement | null
      if (!target) return
      setState({
        variant: (target.dataset.cursor as CursorVariant) || 'hover',
        label: target.dataset.cursorLabel,
        previewSrc: target.dataset.cursorPreview,
      })
    }

    function handleOut(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest?.('[data-cursor]')
      if (!target) return
      const related = e.relatedTarget as HTMLElement | null
      if (related?.closest?.('[data-cursor]') === target) return
      setState({ variant: 'default' })
    }

    window.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseover', handleOver)
    document.addEventListener('mouseout', handleOut)
    return () => {
      document.documentElement.classList.remove('cursor-none')
      window.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseover', handleOver)
      document.removeEventListener('mouseout', handleOut)
    }
  }, [x, y])

  if (!enabled) return null

  const isContentVariant = state.variant === 'preview' || state.variant === 'text'
  const size = SIZE[state.variant]

  return (
    <m.div
      aria-hidden
      className={cn(
        'pointer-events-none fixed top-0 left-0 z-100',
        !isContentVariant && 'mix-blend-difference'
      )}
      style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
    >
      <m.div
        animate={{ width: size, height: size }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className={cn(
          'flex items-center justify-center overflow-hidden rounded-full',
          isContentVariant ? 'glass' : 'bg-soft-white'
        )}
      >
        {state.variant === 'preview' && state.previewSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={state.previewSrc} alt="" className="h-full w-full object-cover" />
        )}
        {state.variant === 'text' && state.label && (
          <span className="text-ink px-2 text-center text-[10px] font-medium tracking-wide uppercase">
            {state.label}
          </span>
        )}
      </m.div>
    </m.div>
  )
}
