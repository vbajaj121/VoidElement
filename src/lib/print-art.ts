import sharp from 'sharp'
import { isCloudinaryConfigured, uploadImageBuffer } from './cloudinary'

/**
 * Placeholder print art — until real artwork exists, generate a simple
 * on-brand design (the same two-tone gradient used for storefront product
 * swatches, see lib/data/gradient.ts) at print resolution, with the product
 * name and color as the "design". One file per color (not per size, since
 * size doesn't change the artwork).
 *
 * Uploaded to Cloudinary rather than written to local disk — Vercel's
 * serverless functions run on a read-only filesystem, so a local
 * `public/print-files` write (the original approach) throws there. A
 * deterministic `public_id` + `overwrite: false` means re-runs (seed
 * re-runs, re-importing the same color) reuse the existing asset instead of
 * re-uploading. Shared by prisma/seed.ts and the admin vendor-table import
 * action.
 */
export async function ensurePrintArt(
  productTitle: string,
  color: string,
  [from, to]: readonly [string, string]
): Promise<string> {
  const slug = `${productTitle}-${color}`.toLowerCase().replace(/[^a-z0-9-]+/g, '-')

  if (!isCloudinaryConfigured()) {
    // No Cloudinary credentials configured (e.g. local dev without .env
    // secrets) — fall back to a data URI so callers still get something
    // usable instead of throwing.
    const svg = printArtSvg(productTitle, color, from, to)
    const buffer = await sharp(Buffer.from(svg)).png().toBuffer()
    return `data:image/png;base64,${buffer.toString('base64')}`
  }

  const svg = printArtSvg(productTitle, color, from, to)
  const buffer = await sharp(Buffer.from(svg)).png().toBuffer()
  return uploadImageBuffer(buffer, 'print-files', { publicId: slug, overwrite: false })
}

function printArtSvg(productTitle: string, color: string, from: string, to: string): string {
  // 1500x1800px = 10in x 12in @ 150dpi, matching ProductVariant's default
  // designWidthInches/designHeightInches print-area size.
  const width = 1500
  const height = 1800
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${from}"/>
          <stop offset="1" stop-color="${to}"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#g)"/>
      <text x="50%" y="48%" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
            font-size="72" font-weight="700" fill="#f5f5f0" letter-spacing="2">
        VOID ELEMENT
      </text>
      <text x="50%" y="55%" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
            font-size="44" fill="#f5f5f0" opacity="0.85">
        ${productTitle} — ${color}
      </text>
    </svg>
  `.trim()
}
