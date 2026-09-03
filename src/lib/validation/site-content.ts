import { z } from "zod"

/**
 * Every editable marketing-content section, in one place. Each section has
 * a Zod schema (validated server-side on save, not DB-enforced — same
 * pattern as Product.colors/ProductVariant.colors) and a default value
 * matching today's actual hardcoded copy, so a fresh DB with zero
 * SiteContent rows renders identically to before this feature existed.
 */

const linkSchema = z.object({
  label: z.string().min(1, "Label is required"),
  href: z.string().min(1, "Link is required"),
})

// ---- hero ----
export const heroContentSchema = z.object({
  eyebrow: z.string().min(1),
  headline: z.string().min(1),
  subtext: z.string().min(1),
  primaryButtonLabel: z.string().min(1),
  primaryButtonHref: z.string().min(1),
  secondaryButtonLabel: z.string().min(1),
  secondaryButtonHref: z.string().min(1),
  scrollHint: z.string().min(1),
  bannerImageUrl: z.string().nullable(),
})
export type HeroContent = z.infer<typeof heroContentSchema>
const heroDefault: HeroContent = {
  eyebrow: "FW25 Collection — Drop 002",
  headline: "Wear the unrepeatable.",
  subtext: "Cut in small batches. Once a drop sells out, it's gone for good.",
  primaryButtonLabel: "Shop The Drop",
  primaryButtonHref: "/shop",
  secondaryButtonLabel: "View Lookbook",
  secondaryButtonHref: "/lookbook",
  scrollHint: "Scroll To Explore",
  bannerImageUrl: "/hero/banner.png",
}

// ---- process ----
export const processStepSchema = z.object({
  number: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().nullable(),
})
export const processContentSchema = z.object({
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  steps: z.array(processStepSchema).min(1, "Add at least one step"),
})
export type ProcessContent = z.infer<typeof processContentSchema>
const processDefault: ProcessContent = {
  eyebrow: "Our Process",
  heading: "Five steps. Every single piece.",
  steps: [
    {
      number: "01",
      title: "Fabric Selection",
      description:
        "We start with 260gsm heavyweight cotton — dense enough to hold its shape, soft enough to actually wear.",
      imageUrl: "/process/01-fabric-selection.png",
    },
    {
      number: "02",
      title: "Cut & Sew",
      description: "Every panel is cut and stitched with reinforced seams built to outlast the season.",
      imageUrl: "/process/02-cut-and-sew.png",
    },
    {
      number: "03",
      title: "Design Application",
      description: "Each graphic is applied layer by layer until it sits flush with the fabric instead of on top of it.",
      imageUrl: "/process/03-design-application.png",
    },
    {
      number: "04",
      title: "Quality Check",
      description: "Every piece is checked by hand before it leaves the studio — stitching, print, and fit.",
      imageUrl: "/process/04-quality-check.png",
    },
    {
      number: "05",
      title: "Ready To Ship",
      description: "Folded, boxed, and shipped — ready to wear the day it lands.",
      imageUrl: "/process/05-ready-to-ship.png",
    },
  ],
}

// ---- product-showcase ----
export const productShowcaseContentSchema = z.object({
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  hint: z.string().min(1),
})
export type ProductShowcaseContent = z.infer<typeof productShowcaseContentSchema>
const productShowcaseDefault: ProductShowcaseContent = {
  eyebrow: "The Drop",
  heading: "Six pieces. This season only.",
  hint: "Hover to preview. Once a design sells out, it never gets reprinted.",
}

// ---- limited-edition ----
export const limitedEditionContentSchema = z.object({
  eyebrow: z.string().min(1),
  headline: z.string().min(1),
  body: z.string().min(1),
  buttonLabel: z.string().min(1),
  productSlug: z.string().min(1),
})
export type LimitedEditionContent = z.infer<typeof limitedEditionContentSchema>
const limitedEditionDefault: LimitedEditionContent = {
  eyebrow: "Limited Edition",
  headline: "Nocturne Bomber — No. 001",
  body: "Numbered and never repeated. Once this batch sells out, the design is retired from the catalog for good.",
  buttonLabel: "Claim Yours",
  productSlug: "oversized-tee",
}

// ---- trust-bar ----
export const TRUST_BAR_ICONS = [
  "shield-check",
  "sparkles",
  "rotate-ccw",
  "lock",
  "truck",
  "award",
  "star",
  "heart",
] as const
export const trustBarItemSchema = z.object({
  icon: z.enum(TRUST_BAR_ICONS),
  title: z.string().min(1),
  subtitle: z.string().min(1),
})
export const trustBarContentSchema = z.object({
  items: z.array(trustBarItemSchema).min(1, "Add at least one item"),
})
export type TrustBarContent = z.infer<typeof trustBarContentSchema>
const trustBarDefault: TrustBarContent = {
  items: [
    { icon: "shield-check", title: "Premium Quality", subtitle: "Top-notch materials" },
    { icon: "sparkles", title: "Exclusive Designs", subtitle: "Limited runs only" },
    { icon: "rotate-ccw", title: "Easy Returns", subtitle: "Hassle-free within 14 days" },
    { icon: "lock", title: "Secure Checkout", subtitle: "Encrypted payments" },
  ],
}

// ---- marquee ----
export const marqueeContentSchema = z.object({
  messages: z.array(z.string().min(1)).min(1, "Add at least one message"),
})
export type MarqueeContent = z.infer<typeof marqueeContentSchema>
const marqueeDefault: MarqueeContent = {
  messages: [
    "Cut in small batches — once sold out, gone for good",
    "14-day easy returns",
    "Secure checkout — encrypted payments",
    "Ships in 5–7 business days",
    "Limited runs only",
  ],
}

// ---- newsletter ----
export const newsletterContentSchema = z.object({
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  body: z.string().min(1),
  buttonLabel: z.string().min(1),
  placeholder: z.string().min(1),
})
export type NewsletterContent = z.infer<typeof newsletterContentSchema>
const newsletterDefault: NewsletterContent = {
  eyebrow: "Stay In The Loop",
  heading: "First access to every drop.",
  body: "No spam. Just a heads-up before each limited run goes live.",
  buttonLabel: "Join",
  placeholder: "you@email.com",
}

// ---- footer ----
export const footerColumnSchema = z.object({
  heading: z.string().min(1),
  links: z.array(linkSchema).min(1),
})
export const footerContentSchema = z.object({
  tagline: z.string().min(1),
  bottomTagline: z.string().min(1),
  instagramUrl: z.string().min(1),
  twitterUrl: z.string().min(1),
  youtubeUrl: z.string().min(1),
  columns: z.array(footerColumnSchema).min(1),
})
export type FooterContent = z.infer<typeof footerContentSchema>
const footerDefault: FooterContent = {
  tagline: "Premium streetwear cut in small batches. Once a drop sells out, it's gone for good.",
  bottomTagline: "Cut in small batches. Never restocked.",
  instagramUrl: "#",
  twitterUrl: "#",
  youtubeUrl: "#",
  columns: [
    {
      heading: "Shop",
      links: [{ label: "All Products", href: "/shop" }],
    },
    {
      heading: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Lookbook", href: "/lookbook" },
        { label: "Archive", href: "/archive" },
      ],
    },
    {
      heading: "Support",
      links: [
        { label: "Shipping", href: "/shipping" },
        { label: "Returns", href: "/returns" },
        { label: "Contact", href: "/contact" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
  ],
}

// ---- static pages (about / contact / shipping / returns / lookbook / archive) ----
export const pageBlockSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
})
export const pageContentSchema = z.object({
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  intro: z.string().min(1),
  contactEmail: z.string().optional(),
  blocks: z.array(pageBlockSchema),
})
export type PageContent = z.infer<typeof pageContentSchema>

const pageAboutDefault: PageContent = {
  eyebrow: "About",
  heading: "Void Element",
  intro:
    "Void Element started as a rejection of the endless-restock model — drops that are truly limited, cut once, and never brought back. We'd rather make six pieces that hold up than sixty that don't.",
  blocks: [
    {
      title: "Small Batches",
      body: "Every drop is cut in limited numbers — no warehouse of unsold stock sitting behind the scenes.",
    },
    {
      title: "Built To Last",
      body: "Heavyweight cotton, reinforced seams, prints that don't crack. Made to be worn for years, not one season.",
    },
    {
      title: "Direct To You",
      body: "No middlemen, no markdowns to clear inventory. What you see is the only run there is.",
    },
  ],
}

const pageContactDefault: PageContent = {
  eyebrow: "Contact",
  heading: "Get in touch.",
  intro: "Questions about an order, sizing, or anything else — we read every email.",
  contactEmail: "hello@voidelement.com",
  blocks: [],
}

const pageShippingDefault: PageContent = {
  eyebrow: "Shipping",
  heading: "Getting it to you.",
  intro: "",
  blocks: [
    { title: "Processing time", body: "Orders ship within 5–7 business days of purchase." },
    {
      title: "Delivery estimates",
      body: "Domestic orders typically arrive within 3–5 business days of shipping. International timelines vary by destination and customs processing.",
    },
    { title: "Tracking", body: "You'll get a tracking link by email the moment your order ships." },
  ],
}

const pageReturnsDefault: PageContent = {
  eyebrow: "Returns",
  heading: "If it's not right.",
  intro: "",
  blocks: [
    {
      title: "Sizing exchanges",
      body: "Accepted within 14 days of delivery. Since each run is limited, exchanges are subject to availability in your size.",
    },
    {
      title: "Final sale items",
      body: "Worn or washed items, and anything from a fully sold-out run, can't be returned or exchanged.",
    },
    { title: "How to start one", body: "Email us with your order number and we'll walk you through it." },
  ],
}

const pageLookbookDefault: PageContent = {
  eyebrow: "Lookbook",
  heading: "FW25 — Drop 002",
  intro: "Six pieces, shot as they're worn.",
  blocks: [],
}

const pageArchiveDefault: PageContent = {
  eyebrow: "Archive",
  heading: "Nothing here yet.",
  intro: "This is where retired drops will live once a run sells out for good. Check back after Drop 002 closes.",
  blocks: [],
}

const pagePrivacyDefault: PageContent = {
  eyebrow: "Privacy",
  heading: "Your data, handled carefully.",
  intro:
    "This policy explains what information Void Element collects when you use this site, how it's used, and the choices you have. Last updated: check the date on your most recent order confirmation.",
  blocks: [
    {
      title: "Information we collect",
      body: "When you create an account, place an order, or sign up for the newsletter, we collect your name, email, shipping address, phone number, and order history. We do not collect or store your full payment card details — those are handled directly by our payment processor.",
    },
    {
      title: "How we use it",
      body: "To process and ship your orders, send order and account-related emails, respond to support requests, and — only if you've opted in — send occasional drop announcements. We do not sell your personal information to third parties.",
    },
    {
      title: "Third-party services",
      body: "We share the minimum information necessary with the services that help us run this store: our payment processor (to charge your order), our fulfillment partner (to print and ship it), and our email provider (to send transactional emails). Each is bound by its own privacy and security terms.",
    },
    {
      title: "Cookies",
      body: "We use essential cookies to keep you signed in and to remember your cart. We don't use third-party advertising or tracking cookies.",
    },
    {
      title: "Data security",
      body: "Passwords are stored using industry-standard hashing, and all traffic to this site is encrypted (HTTPS). No online system is 100% secure, but we take reasonable steps to protect your information.",
    },
    {
      title: "Your rights",
      body: "You can request a copy of the personal data we hold about you, ask us to correct it, or request deletion of your account, by contacting us using the details below. We'll respond within a reasonable time.",
    },
    {
      title: "Changes to this policy",
      body: "If this policy changes in a meaningful way, we'll update this page and, where appropriate, notify you by email.",
    },
  ],
}

const pageTermsDefault: PageContent = {
  eyebrow: "Terms",
  heading: "The fine print.",
  intro:
    "By using this site or placing an order, you agree to the terms below. Please read them alongside our Shipping and Returns policies.",
  blocks: [
    {
      title: "Products & pricing",
      body: "Every piece is produced in limited batches; once a size or design sells out, it will not be restocked under the same drop. Prices are listed in the currency shown at checkout and may change without notice, though the price you pay is the price shown at the time you complete your order.",
    },
    {
      title: "Orders & payment",
      body: "An order is confirmed once payment is successfully processed. We reserve the right to cancel or refuse any order — for example in cases of suspected fraud or a pricing/stock error — in which case you'll be refunded in full.",
    },
    {
      title: "Shipping & delivery",
      body: "Estimated delivery timelines are outlined on our Shipping page. Once an order leaves our fulfillment partner, delivery timing is subject to the shipping carrier and, for international orders, customs processing outside our control.",
    },
    {
      title: "Returns & exchanges",
      body: "Our return and exchange policy is outlined in full on our Returns page. Because each drop is limited, exchanges are subject to size/stock availability at the time of request.",
    },
    {
      title: "Intellectual property",
      body: "All designs, graphics, photography, and branding on this site are the property of Void Element and may not be reproduced or used commercially without written permission.",
    },
    {
      title: "Limitation of liability",
      body: "Void Element is not liable for indirect, incidental, or consequential damages arising from the use of this site or its products, to the fullest extent permitted by law.",
    },
    {
      title: "Changes to these terms",
      body: "We may update these terms from time to time. Continued use of the site after changes are posted constitutes acceptance of the updated terms.",
    },
  ],
}

/**
 * Registry every generic admin/data-layer piece iterates over — add a new
 * section here (schema + default) and it automatically gets an admin editor
 * and a working default fallback, no other wiring required.
 */
export const SITE_CONTENT_SECTIONS = {
  hero: { label: "Hero & Banner", schema: heroContentSchema, default: heroDefault },
  process: { label: "Our Process", schema: processContentSchema, default: processDefault },
  "product-showcase": {
    label: "The Drop (Product Grid)",
    schema: productShowcaseContentSchema,
    default: productShowcaseDefault,
  },
  "limited-edition": {
    label: "Limited Edition Callout",
    schema: limitedEditionContentSchema,
    default: limitedEditionDefault,
  },
  "trust-bar": { label: "Trust Bar", schema: trustBarContentSchema, default: trustBarDefault },
  marquee: { label: "Scrolling Banner", schema: marqueeContentSchema, default: marqueeDefault },
  newsletter: { label: "Newsletter", schema: newsletterContentSchema, default: newsletterDefault },
  footer: { label: "Footer", schema: footerContentSchema, default: footerDefault },
  "page-about": { label: "About Page", schema: pageContentSchema, default: pageAboutDefault },
  "page-contact": { label: "Contact Page", schema: pageContentSchema, default: pageContactDefault },
  "page-shipping": { label: "Shipping Page", schema: pageContentSchema, default: pageShippingDefault },
  "page-returns": { label: "Returns Page", schema: pageContentSchema, default: pageReturnsDefault },
  "page-lookbook": { label: "Lookbook Page", schema: pageContentSchema, default: pageLookbookDefault },
  "page-archive": { label: "Archive Page", schema: pageContentSchema, default: pageArchiveDefault },
  "page-privacy": { label: "Privacy Policy Page", schema: pageContentSchema, default: pagePrivacyDefault },
  "page-terms": { label: "Terms of Service Page", schema: pageContentSchema, default: pageTermsDefault },
} as const

export type SiteContentSection = keyof typeof SITE_CONTENT_SECTIONS
