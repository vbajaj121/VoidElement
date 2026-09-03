import type { Metadata } from "next";
import { Instrument_Sans, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { LazyMotionProvider } from "@/components/motion/lazy-motion-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// One typeface everywhere, including what used to be the separate serif
// display font — swapped from Geist (a clean but neutral dev-tool grotesk)
// for something warmer and more editorial that matches the quiet-luxury,
// moody-photography brand vibe. Italic included since Display headings
// still use it — without it, "italic" utility classes would fall back to
// a browser-synthesized (faux) oblique instead of true italic glyphs.
const instrumentSans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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

// No Dynamic APIs (headers/cookies) here on purpose — the (admin) and
// (storefront) route groups used to be told apart at request time via a
// `headers()` read of an `x-pathname` header set in proxy.ts, but that
// forced every single page in the app into fully dynamic, server-rendered-
// per-request mode (a Dynamic API anywhere in a route's tree opts the whole
// route out of static rendering). Storefront chrome (Navbar/Footer/etc.) now
// lives in `(storefront)/layout.tsx` instead — a route group can only ADD
// wrapping relative to its parent, never remove it, so the only way to give
// (admin) and (storefront) genuinely different top-level UI without a
// Dynamic API is to keep this shared root layout down to universally-needed
// providers only, and let the group-level layouts diverge from there.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <LazyMotionProvider>
            <TooltipProvider delay={150}>{children}</TooltipProvider>
          </LazyMotionProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
