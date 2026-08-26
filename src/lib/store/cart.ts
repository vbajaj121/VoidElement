import { create } from "zustand"

export interface CartLine {
  variantId: string
  slug: string
  title: string
  price: number
  quantity: number
  color: string
  size: string
  colors: readonly [string, string]
}

export interface AddCartItem {
  variantId: string
  slug: string
  title: string
  price: number
  color: string
  size: string
  colors: readonly [string, string]
}

interface CartState {
  lines: CartLine[]
  isOpen: boolean
  open: () => void
  close: () => void
  addItem: (item: AddCartItem, quantity?: number) => void
  removeItem: (variantId: string) => void
  incrementQuantity: (variantId: string) => void
  decrementQuantity: (variantId: string) => void
  clear: () => void
}

export const useCart = create<CartState>((set) => ({
  lines: [],
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  addItem: (item, quantity = 1) =>
    set((state) => {
      const existing = state.lines.find((l) => l.variantId === item.variantId)
      const lines = existing
        ? state.lines.map((l) =>
            l.variantId === item.variantId ? { ...l, quantity: l.quantity + quantity } : l
          )
        : [...state.lines, { ...item, quantity }]
      return { lines, isOpen: true }
    }),
  removeItem: (variantId) =>
    set((state) => ({ lines: state.lines.filter((l) => l.variantId !== variantId) })),
  incrementQuantity: (variantId) =>
    set((state) => ({
      lines: state.lines.map((l) =>
        l.variantId === variantId ? { ...l, quantity: l.quantity + 1 } : l
      ),
    })),
  decrementQuantity: (variantId) =>
    set((state) => ({
      lines: state.lines
        .map((l) => (l.variantId === variantId ? { ...l, quantity: l.quantity - 1 } : l))
        .filter((l) => l.quantity > 0),
    })),
  clear: () => set({ lines: [] }),
}))

export function cartSubtotal(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + l.price * l.quantity, 0)
}

export function cartCount(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + l.quantity, 0)
}
