/**
 * Every "product photo" in the mock catalog is actually an abstract two-tone
 * gradient swatch, not a fake photograph — deliberately, so nothing implies
 * real product photography exists yet. Phase 6+ swaps these for Cloudinary
 * assets once real imagery is available.
 */
export function gradientDataUri([from, to]: readonly [string, string]): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${from}'/><stop offset='1' stop-color='${to}'/></linearGradient></defs><rect width='200' height='200' fill='url(#g)'/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
