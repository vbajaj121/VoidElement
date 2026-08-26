"use client"

import { useState } from "react"
import Link from "next/link"
import { useLenis } from "lenis/react"
import { Menu, Search, ShoppingBag, User } from "lucide-react"
import { Magnetic } from "@/components/motion/magnetic"
import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCart, cartCount } from "@/lib/store/cart"
import { useSearchStore } from "@/lib/store/search"
import { cn } from "@/lib/utils"

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/archive", label: "Archive" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/about", label: "About" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const count = useCart((s) => cartCount(s.lines))
  const openCart = useCart((s) => s.open)
  const openSearch = useSearchStore((s) => s.open)

  useLenis(({ scroll }) => {
    setScrolled(scroll > 40)
  })

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 transition-[background-color,backdrop-filter,border-color] duration-300 sm:px-10",
        scrolled && "glass"
      )}
    >
      <Magnetic strength={0.25}>
        <Link href="/" data-cursor="hover">
          <Logo />
        </Link>
      </Magnetic>

      <nav className="hidden items-center gap-10 text-xs font-medium tracking-[0.2em] text-warm-grey uppercase md:flex">
        {links.map((link) => (
          <Link key={link.href} href={link.href} data-cursor="hover" className="hover:text-soft-white transition-colors">
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2 text-soft-white">
        <Button
          size="icon"
          variant="ghost"
          data-cursor="hover"
          aria-label="Search"
          onClick={openSearch}
          className="hidden sm:inline-flex"
        >
          <Search className="size-4" strokeWidth={1.5} />
        </Button>
        <Button size="icon" variant="ghost" data-cursor="hover" aria-label="Search" onClick={openSearch} className="sm:hidden">
          <Search className="size-4" strokeWidth={1.5} />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          data-cursor="hover"
          aria-label="Account"
          render={<Link href="/account" data-cursor="hover" />}
          nativeButton={false}
          className="hidden sm:inline-flex"
        >
          <User className="size-4" strokeWidth={1.5} />
        </Button>

        <Button
          id="cart-icon-target"
          size="icon"
          variant="ghost"
          data-cursor="hover"
          aria-label={`Bag, ${count} item${count === 1 ? "" : "s"}`}
          onClick={openCart}
          className="relative"
        >
          <ShoppingBag className="size-4" strokeWidth={1.5} />
          {count > 0 && (
            <span className="bg-accent-champagne text-matte-black absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full text-[10px] font-semibold">
              {count}
            </span>
          )}
        </Button>

        <Button
          size="icon"
          variant="ghost"
          data-cursor="hover"
          aria-label="Menu"
          onClick={() => setMenuOpen(true)}
          className="md:hidden"
        >
          <Menu className="size-4" strokeWidth={1.5} />
        </Button>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="right" className="glass w-full sm:max-w-xs">
          <SheetHeader>
            <SheetTitle className="font-serif text-xl italic">Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-cursor="hover"
                onClick={() => setMenuOpen(false)}
                className="text-soft-white border-border border-b py-4 text-sm font-medium tracking-[0.15em] uppercase last:border-b-0"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}
