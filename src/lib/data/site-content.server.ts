import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/db/prisma'
import { SITE_CONTENT_SECTIONS, type SiteContentSection } from '@/lib/validation/site-content'

async function fetchSiteContentRow(section: SiteContentSection) {
  return prisma.siteContent.findUnique({ where: { id: section } })
}

/**
 * Tagged `site-content` (not `products`) so admin content saves only bust
 * this cache, mirroring the isolation `products.server.ts` already has for
 * its own `products` tag.
 */
const getCachedSiteContentRow = unstable_cache(
  (section: SiteContentSection) => fetchSiteContentRow(section),
  ['site-content-by-section'],
  { tags: ['site-content'] }
)

/**
 * Falls back to the section's hardcoded default (today's actual copy) when
 * no admin edit has ever been saved, so the site never breaks on a fresh
 * DB or before an admin touches a given section.
 */
export async function getSiteContent<K extends SiteContentSection>(
  section: K
): Promise<(typeof SITE_CONTENT_SECTIONS)[K]['default']> {
  const row = await getCachedSiteContentRow(section)
  const fallback = SITE_CONTENT_SECTIONS[section].default
  if (!row) return fallback

  const schema = SITE_CONTENT_SECTIONS[section].schema
  const parsed = schema.safeParse(row.data)
  return parsed.success ? (parsed.data as (typeof SITE_CONTENT_SECTIONS)[K]['default']) : fallback
}
