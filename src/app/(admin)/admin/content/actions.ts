'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { prisma } from '@/lib/db/prisma'
import { logger } from '@/lib/logger'
import { requireAdmin, type ActionResult } from '../actions'
import { SITE_CONTENT_SECTIONS, type SiteContentSection } from '@/lib/validation/site-content'
import { isCloudinaryConfigured, uploadImageBuffer } from '@/lib/cloudinary'

const PUBLIC_PATHS_BY_SECTION: Record<SiteContentSection, string[]> = {
  hero: ['/'],
  'drop-intro': ['/'],
  process: ['/'],
  'product-showcase': ['/'],
  'limited-edition': ['/'],
  'trust-bar': ['/'],
  marquee: ['/'],
  newsletter: ['/'],
  footer: ['/'],
  'page-about': ['/about'],
  'page-contact': ['/contact'],
  'page-shipping': ['/shipping'],
  'page-returns': ['/returns'],
  'page-lookbook': ['/lookbook'],
  'page-archive': ['/archive'],
  'page-privacy': ['/privacy'],
  'page-terms': ['/terms'],
}

export async function saveSiteContent(section: SiteContentSection, rawData: unknown): Promise<ActionResult> {
  await requireAdmin()

  const definition = SITE_CONTENT_SECTIONS[section]
  if (!definition) return { ok: false, error: 'Unknown content section.' }

  const parsed = definition.schema.safeParse(rawData)
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input.' }

  try {
    await prisma.siteContent.upsert({
      where: { id: section },
      update: { data: parsed.data },
      create: { id: section, data: parsed.data },
    })
  } catch (err) {
    logger.error('admin.save_site_content_failed', { section, err: String(err) })
    return { ok: false, error: 'Could not save this section.' }
  }

  updateTag('site-content')
  for (const path of PUBLIC_PATHS_BY_SECTION[section]) revalidatePath(path)
  revalidatePath(`/admin/content/${section}`)
  return { ok: true }
}

export type UploadImageResult = { ok: true; url: string } | { ok: false; error: string }

export async function uploadContentImage(formData: FormData): Promise<UploadImageResult> {
  await requireAdmin()

  if (!isCloudinaryConfigured()) {
    return { ok: false, error: 'Image uploads are not configured yet. Add Cloudinary credentials to enable this.' }
  }

  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: 'No file was selected.' }
  }
  if (!file.type.startsWith('image/')) {
    return { ok: false, error: 'Only image files are supported.' }
  }
  if (file.size > 10 * 1024 * 1024) {
    return { ok: false, error: 'Image must be under 10MB.' }
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const url = await uploadImageBuffer(buffer, 'site-content')
    return { ok: true, url }
  } catch (err) {
    logger.error('admin.upload_content_image_failed', { err: String(err) })
    return { ok: false, error: 'Upload failed. Try again.' }
  }
}
