/**
 * Maps a vendor's plain-English color name (e.g. Qikink's "Grey Melange") to
 * the hex swatch + two-tone gradient our storefront's `ProductArt` visual
 * system needs, for products imported without any real photography. Pure
 * function — safe to call from both the browser (live import preview) and
 * server actions.
 */
export interface ColorHex {
  swatch: string
  colors: readonly [string, string]
}

const NAMED_COLORS: Record<string, ColorHex> = {
  white: { swatch: '#efece2', colors: ['#d9d4c4', '#f7f5ee'] },
  black: { swatch: '#242424', colors: ['#050505', '#2e2e2e'] },
  navy: { swatch: '#22304f', colors: ['#0c1424', '#334874'] },
  'navy blue': { swatch: '#22304f', colors: ['#0c1424', '#334874'] },
  blue: { swatch: '#2c4a7c', colors: ['#152640', '#3f66a8'] },
  'royal blue': { swatch: '#2748a8', colors: ['#13214f', '#3a5cd6'] },
  grey: { swatch: '#8f8f89', colors: ['#57574f', '#b6b6ae'] },
  gray: { swatch: '#8f8f89', colors: ['#57574f', '#b6b6ae'] },
  'grey melange': { swatch: '#8f8f89', colors: ['#57574f', '#b6b6ae'] },
  'gray melange': { swatch: '#8f8f89', colors: ['#57574f', '#b6b6ae'] },
  charcoal: { swatch: '#3a3a3a', colors: ['#1c1c1c', '#4d4d4d'] },
  pink: { swatch: '#eec4cd', colors: ['#dba3ae', '#f6dde2'] },
  'baby pink': { swatch: '#eec4cd', colors: ['#dba3ae', '#f6dde2'] },
  'light baby pink': { swatch: '#eec4cd', colors: ['#dba3ae', '#f6dde2'] },
  lavender: { swatch: '#c4b7db', colors: ['#9c8cc0', '#e2d7f0'] },
  purple: { swatch: '#7a5ca8', colors: ['#432f66', '#a186c9'] },
  beige: { swatch: '#d7c6a9', colors: ['#b39d78', '#ecdfc8'] },
  cream: { swatch: '#e8dfc8', colors: ['#cbbd93', '#f3ecd9'] },
  olive: { swatch: '#5c6650', colors: ['#12140f', '#5c6650'] },
  green: { swatch: '#3f6b4c', colors: ['#1c3324', '#5c9470'] },
  red: { swatch: '#a3312f', colors: ['#5a1614', '#c94a47'] },
  maroon: { swatch: '#5e2430', colors: ['#2c0f15', '#7d3242'] },
  yellow: { swatch: '#d9c14a', colors: ['#8a7418', '#eddb7a'] },
  mustard: { swatch: '#c99a2e', colors: ['#6e5210', '#e0b552'] },
  orange: { swatch: '#c96a2e', colors: ['#6e3410', '#e08a52'] },
  brown: { swatch: '#6b4a34', colors: ['#382415', '#8a6247'] },
  tan: { swatch: '#c2a377', colors: ['#8a6c42', '#dcc7a0'] },
}

const FALLBACK: ColorHex = { swatch: '#6b6f76', colors: ['#2a2a2a', '#9a9a9a'] }

export function guessColorHex(name: string): ColorHex {
  const key = name.trim().toLowerCase()
  return NAMED_COLORS[key] ?? FALLBACK
}
