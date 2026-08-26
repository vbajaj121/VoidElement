"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import type { MockProduct } from "@/lib/data/products"
import { formatPrice } from "@/lib/format"
import { useSearchStore } from "@/lib/store/search"

export function SearchPalette({ products }: { products: MockProduct[] }) {
  const { isOpen, open, close, toggle } = useSearchStore()
  const router = useRouter()

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggle()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [toggle])

  function goToProduct(slug: string) {
    close()
    router.push(`/products/${slug}`)
  }

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={(v) => (v ? open() : close())}
      title="Search"
      description="Search the collection"
    >
      <Command>
        <CommandInput placeholder="Search the collection..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Products">
            {products.map((product) => (
              <CommandItem
                key={product.slug}
                value={product.title}
                onSelect={() => goToProduct(product.slug)}
              >
                {product.title}
                <CommandShortcut>{formatPrice(product.price, product.currency)}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
