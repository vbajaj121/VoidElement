import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { SmoothScrollProvider } from "@/components/motion/smooth-scroll-provider";
import { CustomCursorLoader } from "@/components/motion/custom-cursor-loader";
import { LazyMotionProvider } from "@/components/motion/lazy-motion-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/commerce/cart-drawer";
import { SearchPalette } from "@/components/commerce/search-palette";
import { getProducts } from "@/lib/data/products.server";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

const DEFAULT_TITLE = "VOID ELEMENT — Wear the Unrepeatable";
const DEFAULT_DESCRIPTION =
  "Premium streetwear cut in small batches. Once a drop sells out, it's gone for good.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s — VOID ELEMENT",
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    siteName: "Void Element",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Set by src/proxy.ts. The admin backend gets none of the storefront
  // chrome — the navbar is `fixed`, so on admin pages it was overlapping
  // page content and swallowing clicks on anything underneath it.
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");

  // Search palette is non-essential; don't take the whole site down if the DB hiccups.
  const products = isAdmin ? [] : await getProducts().catch(() => []);

  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <LazyMotionProvider>
          <SmoothScrollProvider>
            <TooltipProvider delay={150}>
              {!isAdmin && <Navbar />}
              {children}
              {!isAdmin && <Footer />}
              {!isAdmin && <CartDrawer />}
              {!isAdmin && <SearchPalette products={products} />}
            </TooltipProvider>
          </SmoothScrollProvider>
          <CustomCursorLoader />
        </LazyMotionProvider>
        <Toaster theme="dark" />
      </body>
    </html>
  );
}
