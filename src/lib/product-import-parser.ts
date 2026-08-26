/**
 * Parses a copy-pasted vendor product table (e.g. Qikink's "My Products"
 * list: Name | Variation | Product SKU | Design SKU | Store SKU | Image |
 * Product Cost | Selling Cost) into structured product groups. Pure string
 * parsing, no Node APIs — safe to run in the browser for a live preview
 * before anything is submitted to the server.
 */

export interface ParsedVariantRow {
  color: string
  size: string
  providerSku: string
  price: number
}

export interface ParsedProductGroup {
  name: string
  variants: ParsedVariantRow[]
}

export interface ParseResult {
  products: ParsedProductGroup[]
  warnings: string[]
}

const HEADER_ALIASES: Record<string, string[]> = {
  name: ['name', 'product name', 'product'],
  variation: ['variation', 'variant', 'option'],
  productSku: ['product sku', 'sku'],
  price: ['selling cost', 'selling price', 'price', 'mrp'],
  cost: ['product cost', 'cost'],
}

// Qikink's own column order, used when no recognizable header row is found.
const DEFAULT_COLUMNS = ['name', 'variation', 'productSku', 'designSku', 'storeSku', 'image', 'cost', 'price']

function splitRow(line: string): string[] {
  const tabSplit = line.split('\t').map((c) => c.trim())
  if (tabSplit.length >= 3) return tabSplit
  return line.split(/\s{2,}/).map((c) => c.trim())
}

function detectHeader(cells: string[]): Record<string, number> | null {
  const map: Record<string, number> = {}
  for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
    const index = cells.findIndex((c) => aliases.includes(c.trim().toLowerCase()))
    if (index !== -1) map[field] = index
  }
  // Require at minimum a name and a variation/sku column to call this a header row.
  if (map.name !== undefined && (map.variation !== undefined || map.productSku !== undefined)) return map
  return null
}

function parseVariation(variation: string): { color: string; size: string } {
  for (const sep of [' - ', ' / ', '-', '/']) {
    if (variation.includes(sep)) {
      const idx = variation.lastIndexOf(sep)
      return {
        color: variation.slice(0, idx).trim(),
        size: variation.slice(idx + sep.length).trim(),
      }
    }
  }
  const lastSpace = variation.lastIndexOf(' ')
  if (lastSpace === -1) return { color: variation.trim(), size: 'One Size' }
  return { color: variation.slice(0, lastSpace).trim(), size: variation.slice(lastSpace + 1).trim() }
}

function parsePrice(raw: string | undefined): number {
  if (!raw) return 0
  const n = Number.parseFloat(raw.replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

export function parseVendorTable(raw: string): ParseResult {
  const warnings: string[] = []
  const lines = raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  if (lines.length === 0) return { products: [], warnings: ['Nothing to parse.'] }

  const rows = lines.map(splitRow)
  let columnMap = detectHeader(rows[0])
  let dataRows = rows

  if (columnMap) {
    dataRows = rows.slice(1)
  } else {
    warnings.push('No header row detected — assumed Qikink\'s default column order (Name, Variation, Product SKU, Design SKU, Store SKU, Image, Product Cost, Selling Cost). Check the preview carefully.')
    columnMap = Object.fromEntries(DEFAULT_COLUMNS.map((field, i) => [field, i]))
  }

  const groups = new Map<string, ParsedProductGroup>()

  for (const cells of dataRows) {
    const name = cells[columnMap.name]?.trim()
    const variation = cells[columnMap.variation ?? -1]?.trim()
    const providerSku = cells[columnMap.productSku ?? -1]?.trim()
    const price = parsePrice(cells[columnMap.price ?? -1] ?? cells[columnMap.cost ?? -1])

    if (!name) continue
    if (!providerSku) {
      warnings.push(`Row for "${name}" (${variation ?? 'unknown variation'}) has no SKU — skipped.`)
      continue
    }

    const { color, size } = variation ? parseVariation(variation) : { color: 'Default', size: 'One Size' }

    if (!groups.has(name)) groups.set(name, { name, variants: [] })
    groups.get(name)!.variants.push({ color, size, providerSku, price })
  }

  return { products: [...groups.values()], warnings }
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
