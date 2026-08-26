import fs from "node:fs"
import path from "node:path"

// ---- Configuration ----
// Frame folder (relative to /public) and accepted file extensions.
// Naming convention: any name that natural-sorts correctly, e.g.
// "ezgif-frame-001.jpg" ... "ezgif-frame-200.jpg". Zero-padding isn't
// required — the sort below is numeric-aware either way.
const FRAME_FOLDER = "hero-sequence"
const VALID_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"])

/**
 * Reads `public/hero-sequence/`, keeps only image files, and sorts them in
 * true numeric order (so "frame-2" sorts before "frame-10", unlike a plain
 * alphabetical sort). Server-only — call from a Server Component and pass
 * the result down as a prop; this can't run in the browser.
 */
export function getHeroSequenceFrames(): string[] {
  const dir = path.join(process.cwd(), "public", FRAME_FOLDER)
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir)
    .filter((file) => VALID_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
    .map((file) => `/${FRAME_FOLDER}/${file}`)
}
