import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
// process.cwd() is the project root for both `tsx prisma/seed.ts` and a
// running Next.js server — unlike `__dirname`, which resolves inside
// Next's bundled server output when called from a server action.
const PRINT_FILES_DIR = join(process.cwd(), 'public', 'print-files')

/**
 * Placeholder print art — until real artwork exists, generate a simple
 * on-brand design (the same two-tone gradient used for storefront product
 * swatches, see lib/data/gradient.ts) at print resolution, with the product
 * name and color as the "design". One file per color (not per size, since
 * size doesn't change the artwork), cached on disk so re-runs don't
 * regenerate unchanged files. Shared by prisma/seed.ts and the admin
 * vendor-table import action.
 */
export async function ensurePrintArt(
  productTitle: string,
  color: string,
  [from, to]: readonly [string, string]
): Promise<string> {
  mkdirSync(PRINT_FILES_DIR, { recursive: true })

  const filename = `${productTitle}-${color}`.toLowerCase().replace(/[^a-z0-9-]+/g, '-') + '.png'
  const filePath = join(PRINT_FILES_DIR, filename)
  const publicUrl = `${APP_URL}/print-files/${filename}`

  if (existsSync(filePath)) return publicUrl

  // 1500x1800px = 10in x 12in @ 150dpi, matching ProductVariant's default
  // designWidthInches/designHeightInches print-area size.
  const width = 1500
  const height = 1800
  const svg = `
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

  await sharp(Buffer.from(svg)).png().toFile(filePath)
  return publicUrl
}
