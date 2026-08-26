/** Must be a real, internet-reachable origin in production — used for the
 * sitemap, robots.txt, and resolving relative OG image URLs. */
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
