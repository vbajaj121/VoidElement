import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { CustomCursorLoader } from "@/components/motion/custom-cursor-loader";
import { LazyMotionProvider } from "@/components/motion/lazy-motion-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";
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
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <LazyMotionProvider>
            <TooltipProvider delay={150}>{children}</TooltipProvider>
            <CustomCursorLoader />
          </LazyMotionProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
