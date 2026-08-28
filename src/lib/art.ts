/**
 * Theme-aware colour for the generated artwork.
 *
 * The dark theme is the source of truth: every scene accent, sky and
 * silhouette is authored for night. The light theme re-reads those same
 * values through the transforms below, so there is one palette to maintain
 * rather than two.
 *
 * Every transform here **forces** a lightness rather than scaling it, which
 * makes them idempotent: ac(ac(x)) === ac(x). That matters because these are
 * applied liberally across the tree and a value may pass through more than
 * once on its way into an SVG.
 */

export type ArtMode = 'dark' | 'light'

/* Module-level rather than context so pure SVG helpers can read it. React
   re-renders are driven by the theme in JourneyProvider; this just keeps the
   current value where non-component code can see it. */
let mode: ArtMode = 'dark'
export const setArtMode = (m: ArtMode) => {
  mode = m
}
export const artMode = () => mode
export const isLight = () => mode === 'light'

/* ---- colour space ------------------------------------------------- */

function toRgb(hex: string) {
  const h = hex.replace('#', '')
  const n =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h
  const v = parseInt(n, 16)
  return { r: ((v >> 16) & 255) / 255, g: ((v >> 8) & 255) / 255, b: (v & 255) / 255 }
}

function rgbToHsl({ r, g, b }: { r: number; g: number; b: number }) {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }
  return { h, s, l }
}

function hslToHex(h: number, s: number, l: number) {
  const f = (n: number) => {
    const k = (n + h * 12) % 12
    const a = s * Math.min(l, 1 - l)
    const c = l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)))
    return Math.round(255 * c)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

/** Parchment base the light theme biases toward. */
const PAPER = { r: 0.945, g: 0.905, b: 0.835 }

/**
 * Nudge a colour toward parchment.
 *
 * The authored palette is blue-black, so simply raising its lightness
 * produces cold lavenders on a warm ground. Blending toward paper keeps
 * each scene's hue identity while removing the cast.
 */
function warm(hex: string, amount: number) {
  const { r, g, b } = toRgb(hex)
  const mix = (c: number, p: number) => Math.round(255 * (c + (p - c) * amount))
  return `#${[mix(r, PAPER.r), mix(g, PAPER.g), mix(b, PAPER.b)]
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('')}`
}

/** Force a colour to an exact lightness, keeping its hue. Idempotent. */
function atLightness(hex: string, l: number, satScale = 1, satMax = 1) {
  if (!/^#[0-9a-fA-F]{3,6}$/.test(hex)) return hex
  const { h, s } = rgbToHsl(toRgb(hex))
  return hslToHex(h, Math.min(satMax, s * satScale), l)
}

/* ---- the transforms ----------------------------------------------- */

/**
 * A scene accent, safe to use as text, a border or a glow.
 * Dark theme: unchanged. Light theme: driven down to a deep, readable
 * version of the same hue so pastels do not disappear on parchment.
 */
export function ac(hex: string): string {
  return mode === 'light' ? atLightness(hex, 0.34, 1.15, 0.72) : hex
}

/** A slightly deeper accent, for small text that needs to hold up. */
export function acText(hex: string): string {
  return mode === 'light' ? atLightness(hex, 0.26, 1.2, 0.8) : hex
}

/**
 * A sky stop. Light theme turns each scene's night sky into a pale wash of
 * the same hue, so Musa stays cool and Ibrahim stays warm.
 */
export function sky(hex: string, depth = 0): string {
  if (mode !== 'light') return hex
  // depth 0 = top of sky (palest), 1 = horizon (a touch deeper)
  return warm(atLightness(hex, 0.94 - depth * 0.09, 0.9, 0.34), 0.32)
}

/**
 * A silhouette fill. Already dark in the source; on parchment it is pushed
 * to a consistent deep sepia-ink so shapes read as cut paper.
 */
export function sil(hex: string, l = 0.17): string {
  return mode === 'light' ? warm(atLightness(hex, l, 0.75, 0.4), 0.12) : hex
}

/**
 * Ground the reader's text sits on — dunes, hills, seabed.
 *
 * These must NOT become silhouettes in the light theme: the type over them
 * is near-black, so the terrain has to stay sand-toned. `depth` runs 0 for
 * the furthest layer to 1 for the nearest, giving atmospheric perspective —
 * distant land pales out, foreground land carries more weight.
 */
export function ground(hex: string, depth = 0.5): string {
  if (mode !== 'light') return hex
  return warm(atLightness(hex, 0.85 - depth * 0.25, 0.6, 0.26), 0.42)
}

/** Stars become ink stipple; light shafts become a warm bronze wash. */
export const starColor = () => (mode === 'light' ? '#7c6234' : '#f6e5bf')
export const shaftColor = () => (mode === 'light' ? '#b98f3e' : '#f6e5bf')

/** Glows need less punch on a bright ground or they turn to haze. */
export const glowScale = () => (mode === 'light' ? 0.55 : 1)
