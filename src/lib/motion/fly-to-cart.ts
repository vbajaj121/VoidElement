/**
 * Clones the product art into a fixed-position element and animates it into
 * the navbar's cart icon (id="cart-icon-target"). Pure DOM + CSS transition —
 * a one-off imperative effect doesn't need to fight React's render cycle.
 */
export function flyToCart(sourceEl: HTMLElement, colors: readonly [string, string]) {
  const target = document.getElementById("cart-icon-target")
  if (!target) return

  const sourceRect = sourceEl.getBoundingClientRect()
  const targetRect = target.getBoundingClientRect()

  const clone = document.createElement("div")
  clone.style.position = "fixed"
  clone.style.left = `${sourceRect.left}px`
  clone.style.top = `${sourceRect.top}px`
  clone.style.width = `${sourceRect.width}px`
  clone.style.height = `${sourceRect.height}px`
  clone.style.borderRadius = "16px"
  clone.style.background = `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`
  clone.style.zIndex = "200"
  clone.style.pointerEvents = "none"
  clone.style.willChange = "transform, opacity"
  clone.style.transition = "transform 0.7s cubic-bezier(0.16,1,0.3,1), opacity 0.6s ease 0.15s"
  clone.setAttribute("aria-hidden", "true")
  clone.dataset.flyToCart = "true"
  document.body.appendChild(clone)

  const dx = targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2)
  const dy = targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2)
  const scale = Math.max(targetRect.width / sourceRect.width, 0.12)

  requestAnimationFrame(() => {
    clone.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`
    clone.style.opacity = "0"
  })

  setTimeout(() => clone.remove(), 750)
}
