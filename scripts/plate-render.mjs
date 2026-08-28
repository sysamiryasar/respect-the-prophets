/**
 * A small physically-motivated renderer for the backdrop plates.
 *
 * The plates used to be SVG: a linear-gradient sky, circles for stars and
 * flat-filled silhouettes. That reads as illustration, because none of the
 * things that make a photograph look like a photograph were present — no
 * aerial perspective, no light transport, no surface texture, no lens.
 *
 * So this renders them properly instead, per pixel, in linear light:
 *
 *   sky        analytic gradient + Mie/Rayleigh-ish sun scattering
 *   clouds     fBm density, shaded by transmittance toward the sun
 *   shafts     crepuscular rays, ray-marched at quarter res
 *   terrain    fBm/ridged heightfields, Lambert shading, aerial perspective
 *   water      wave normals -> Fresnel sky reflection + specular glints
 *   lens       bloom, filmic tonemap, grain, vignette, chromatic aberration
 *
 * Everything is deterministic from the plate id, so builds stay byte-stable.
 *
 * As with the rest of this project: landscapes, weather, light and
 * architecture only. No faces, no bodies, no figures — nothing here is
 * capable of drawing one.
 */

import sharp from 'sharp'
import { skylinePath } from './plate-art.mjs'

export const W = 1600
export const H = 900

/* ------------------------------------------------------------------ *
 * Noise
 * ------------------------------------------------------------------ */

function hash(x, y, s) {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(s | 0, 1274126177)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  h ^= h >>> 16
  return (h >>> 0) / 4294967295
}

/** Value noise with a quintic fade — C2 continuous, so no lattice creases. */
function vnoise(x, y, s) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const u = xf * xf * xf * (xf * (xf * 6 - 15) + 10)
  const v = yf * yf * yf * (yf * (yf * 6 - 15) + 10)
  const a = hash(xi, yi, s)
  const b = hash(xi + 1, yi, s)
  const c = hash(xi, yi + 1, s)
  const d = hash(xi + 1, yi + 1, s)
  const ab = a + (b - a) * u
  const cd = c + (d - c) * u
  return ab + (cd - ab) * v
}

function fbm(x, y, s, oct = 5, gain = 0.5, lac = 2.03) {
  let amp = 1
  let f = 1
  let sum = 0
  let norm = 0
  for (let i = 0; i < oct; i++) {
    sum += amp * vnoise(x * f, y * f, s + i * 131)
    norm += amp
    amp *= gain
    f *= lac
  }
  return sum / norm
}

/** Ridged multifractal — the sharp crests of dunes and rock. */
function ridged(x, y, s, oct = 5) {
  let amp = 1
  let f = 1
  let sum = 0
  let norm = 0
  for (let i = 0; i < oct; i++) {
    const n = 1 - Math.abs(vnoise(x * f, y * f, s + i * 197) * 2 - 1)
    sum += amp * n * n
    norm += amp
    amp *= 0.5
    f *= 2.07
  }
  return sum / norm
}

/* ------------------------------------------------------------------ *
 * Colour — all lighting math happens in linear space, which is most of
 * why this looks like light rather than like a gradient.
 * ------------------------------------------------------------------ */

const srgbToLin = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
const linToSrgb = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055)

function hexToLin(hex) {
  const n = hex.replace('#', '')
  const f = n.length === 3 ? n.split('').map((c) => c + c).join('') : n
  const v = parseInt(f, 16)
  return [
    srgbToLin(((v >> 16) & 255) / 255),
    srgbToLin(((v >> 8) & 255) / 255),
    srgbToLin((v & 255) / 255),
  ]
}

function toHsl(hex) {
  const n = hex.replace('#', '')
  const f = n.length === 3 ? n.split('').map((c) => c + c).join('') : n
  const v = parseInt(f, 16)
  const r = ((v >> 16) & 255) / 255
  const g = ((v >> 8) & 255) / 255
  const b = (v & 255) / 255
  const mx = Math.max(r, g, b)
  const mn = Math.min(r, g, b)
  const l = (mx + mn) / 2
  let h = 0
  let s = 0
  if (mx !== mn) {
    const d = mx - mn
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn)
    h = mx === r ? ((g - b) / d + (g < b ? 6 : 0)) / 6 : mx === g ? ((b - r) / d + 2) / 6 : ((r - g) / d + 4) / 6
  }
  return { h, s, l }
}

function fromHsl(h, s, l) {
  const f = (n) => {
    const k = (n + h * 12) % 12
    const a = s * Math.min(l, 1 - l)
    return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)))))
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

/** Blend two hexes. */
function mixHex(a, b, t) {
  const pa = parseInt(a.replace('#', ''), 16)
  const pb = parseInt(b.replace('#', ''), 16)
  const ch = (sh) => {
    const va = (pa >> sh) & 255
    const vb = (pb >> sh) & 255
    return Math.round(va + (vb - va) * t)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${ch(16)}${ch(8)}${ch(0)}`
}

/** Force a lightness while keeping the hue. Idempotent, so re-runs are stable. */
const at = (hex, l, satScale = 1, satMax = 1) => {
  const { h, s } = toHsl(hex)
  return fromHsl(h, Math.min(satMax, s * satScale), l)
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const smoothstep = (e0, e1, x) => {
  const t = clamp01((x - e0) / (e1 - e0))
  return t * t * (3 - 2 * t)
}

/* ------------------------------------------------------------------ *
 * Per-plate setup
 * ------------------------------------------------------------------ */

function setup(spec, light) {
  let seed = 0
  for (let i = 0; i < spec.id.length; i++) seed = (seed * 31 + spec.id.charCodeAt(i)) >>> 0
  seed = seed || 7

  // The parchment theme is not the night theme with a filter over it — it is
  // the same landscape at a different hour, so it gets its own lighting.
  const skyTop = light ? at(spec.skyTop, 0.72, 0.66, 0.34) : spec.skyTop
  const skyBottom = light ? at(spec.skyBottom, 0.9, 0.62, 0.26) : spec.skyBottom
  const accent = light ? at(spec.accent, 0.52, 1.05, 0.72) : spec.accent
  const rock = light
    ? mixHex(at(spec.accent, 0.32, 0.5, 0.3), '#8a7250', 0.55)
    : at(spec.accent, 0.15, 0.6, 0.4)

  return {
    id: spec.id,
    seed,
    light,
    terrain: spec.terrain,
    top: hexToLin(skyTop),
    bot: hexToLin(skyBottom),
    accent: hexToLin(accent),
    rock: hexToLin(rock),
    // Water read from just under the surface. In daylight it has to belong to
    // a parchment set, so it is pulled onto the same paper as everything else.
    deep: hexToLin(
      light ? mixHex(at(spec.skyBottom, 0.84, 0.4, 0.16), '#cbbb98', 0.55) : skyBottom,
    ),
    sunX: (spec.glowX ?? 0.5) * W,
    sunY: (spec.glowY ?? 0.62) * H,
    glow: (spec.glow ?? 0.5) * (light ? 0.85 : 1),
    glowR: spec.glowR ?? 0.72,
    stars: light ? 0 : (spec.stars ?? 90),
    // Daylight scatters far more, which is what makes distance read as pale.
    hazeK: light ? 0.95 : 1,
    // Daylight ground still has to sit under text, so it is held down.
    groundGain: light ? 0.62 : 1,
    exposure: light ? 0.95 : 1.06,
    lift: light ? 0.008 : 0.002,
    vignette: light ? 0.2 : 0.5,
    grain: light ? 0.007 : 0.011,
    // parchment warmth, applied at the very end
    tint: light ? [1.06, 1.0, 0.85] : [1, 0.998, 1.005],
    sat: light ? 0.7 : 1.0,
    // Pulled toward the same parchment the UI uses, so plates and page agree.
    paper: light ? 0.05 : 0,
  }
}

/* ------------------------------------------------------------------ *
 * Sky
 * ------------------------------------------------------------------ */

/** Linear radiance of the sky itself at a pixel, sun included. */
function skyAt(S, x, y, out) {
  const t = y / H
  // Real skies bunch their gradient toward the horizon.
  const k = Math.pow(t, 0.62)
  let r = S.top[0] + (S.bot[0] - S.top[0]) * k
  let g = S.top[1] + (S.bot[1] - S.top[1]) * k
  let b = S.top[2] + (S.bot[2] - S.top[2]) * k

  const dx = (x - S.sunX) / H
  const dy = (y - S.sunY) / H
  const d = Math.sqrt(dx * dx + dy * dy)
  const rs = S.glowR

  // Three lobes: the disc, the tight Mie forward-scatter halo, and the broad
  // Rayleigh wash that lifts the whole sky near the light.
  const core = Math.exp(-((d / (0.052 * rs)) ** 2)) * 5.5
  const halo = 1 / (1 + (d / (0.26 * rs)) ** 2.3) * 0.85
  const wide = Math.exp(-d / (0.95 * rs)) * 0.4
  const sun = (core + halo + wide) * S.glow

  r += S.accent[0] * sun
  g += S.accent[1] * sun
  b += S.accent[2] * sun

  out[0] = r
  out[1] = g
  out[2] = b
}

/* ------------------------------------------------------------------ *
 * Clouds
 * ------------------------------------------------------------------ */

function cloudDensity(S, x, y, cov, oct = 5) {
  const u = x / W
  const v = y / H
  // Domain warp, then a heavy vertical squash so banks stretch along the sky.
  const wx = u * 3.1 + fbm(u * 2.2, v * 3.4, S.seed + 7, 3) * 0.72
  const wy = v * 8.5
  const n = fbm(wx * 2.3, wy, S.seed + 41, oct)
  return smoothstep(cov, cov + 0.3, n)
}

function paintClouds(S, px, cover, height) {
  if (cover >= 1) return
  const sky = [0, 0, 0]
  const lit = S.light ? 1.9 : 1.5
  for (let y = 0; y < H; y++) {
    // Clouds live in the upper sky and thin out toward the horizon.
    const band = smoothstep(height + 0.34, height - 0.06, y / H)
    if (band <= 0.001) continue
    for (let x = 0; x < W; x++) {
      const dens = cloudDensity(S, x, y, cover) * band
      if (dens <= 0.004) continue

      // Transmittance toward the sun: sample ahead along the light ray, and
      // let what is left over light the near face. This is what gives a cloud
      // its bright rim instead of a flat grey blob.
      const lx = (S.sunX - x) / H
      const ly = (S.sunY - y) / H
      const ln = Math.max(1e-4, Math.sqrt(lx * lx + ly * ly))
      const sx = x + (lx / ln) * 70
      const sy = y + (ly / ln) * 70
      const ahead = cloudDensity(S, sx, sy, cover, 3)
      const trans = Math.exp(-2.6 * ahead)

      skyAt(S, x, y, sky)
      const base = S.light ? 0.55 : 0.1
      const cr = (S.accent[0] * 0.55 + 0.45) * (base + trans * lit)
      const cg = (S.accent[1] * 0.55 + 0.45) * (base + trans * lit)
      const cb = (S.accent[2] * 0.55 + 0.45) * (base + trans * lit)

      const i = (y * W + x) * 3
      const a = dens * (S.light ? 0.4 : 0.3)
      px[i] += (cr * sky[0] * 2.2 - px[i]) * a
      px[i + 1] += (cg * sky[1] * 2.2 - px[i + 1]) * a
      px[i + 2] += (cb * sky[2] * 2.2 - px[i + 2]) * a
    }
  }
}

/* ------------------------------------------------------------------ *
 * Crepuscular rays
 *
 * Marched toward the sun at quarter resolution — shafts are low frequency,
 * so the full-res cost would buy nothing.
 * ------------------------------------------------------------------ */

function paintShafts(S, px, strength, cover) {
  if (strength <= 0) return
  const qw = W >> 2
  const qh = H >> 2
  const shaft = new Float32Array(qw * qh)
  const STEPS = 16

  for (let y = 0; y < qh; y++) {
    for (let x = 0; x < qw; x++) {
      const fx = x * 4
      const fy = y * 4
      let occ = 0
      for (let i = 1; i <= STEPS; i++) {
        const f = i / STEPS
        const sx = fx + (S.sunX - fx) * f
        const sy = fy + (S.sunY - fy) * f
        occ += cloudDensity(S, sx, sy, cover, 3) * (1 - f)
      }
      occ /= STEPS * 0.5
      const dx = (fx - S.sunX) / H
      const dy = (fy - S.sunY) / H
      const dist = Math.sqrt(dx * dx + dy * dy)
      shaft[y * qw + x] = Math.exp(-2.2 * occ) * Math.exp(-dist * 1.15)
    }
  }

  blur(shaft, qw, qh, 1, 2)

  for (let y = 0; y < H; y++) {
    const gy = Math.min(qh - 1, y >> 2)
    for (let x = 0; x < W; x++) {
      const v = shaft[gy * qw + Math.min(qw - 1, x >> 2)] * strength
      const i = (y * W + x) * 3
      px[i] += S.accent[0] * v
      px[i + 1] += S.accent[1] * v
      px[i + 2] += S.accent[2] * v
    }
  }
}

/* ------------------------------------------------------------------ *
 * Stars
 * ------------------------------------------------------------------ */

function paintStars(S, px) {
  if (!S.stars) return
  let s = S.seed
  const rnd = () => {
    s ^= s << 13
    s >>>= 0
    s ^= s >>> 17
    s ^= s << 5
    s >>>= 0
    return (s % 1000000) / 1000000
  }

  // A faint band of unresolved stars, for the plates that are mostly sky.
  if (S.stars > 180) {
    for (let y = 0; y < H * 0.75; y++) {
      for (let x = 0; x < W; x++) {
        const band = Math.exp(-(((y - (120 + x * 0.22)) / 150) ** 2))
        if (band < 0.02) continue
        const n = fbm(x / W * 5, y / H * 5, S.seed + 313, 4)
        const v = band * Math.pow(n, 2.2) * 0.045
        const i = (y * W + x) * 3
        px[i] += v * 0.85
        px[i + 1] += v * 0.9
        px[i + 2] += v
      }
    }
  }

  const probe = [0, 0, 0]
  for (let n = 0; n < S.stars; n++) {
    const cx = rnd() * W
    const cy = rnd() * H * 0.72
    // Few bright, many faint — roughly how a magnitude distribution falls.
    const mag = Math.pow(rnd(), 2.6)
    const rad = 0.55 + mag * 1.9
    // Hotter stars run blue, cooler ones amber.
    const temp = rnd()
    const cr = 0.82 + temp * 0.3
    const cg = 0.88 + temp * 0.1
    const cb = 1.05 - temp * 0.25

    // Atmospheric extinction near the horizon, and washed out near the sun.
    const ext = smoothstep(0.78, 0.3, cy / H)
    const dsx = (cx - S.sunX) / H
    const dsy = (cy - S.sunY) / H
    const near = 1 / (1 + 5 / (0.05 + Math.sqrt(dsx * dsx + dsy * dsy)))
    // A bright sky drowns them out — a dusk plate should not be full of stars.
    skyAt(S, cx, cy, probe)
    const bright = 0.2126 * probe[0] + 0.7152 * probe[1] + 0.0722 * probe[2]
    const amp = (0.05 + mag * 1.5) * ext * near * Math.exp(-bright * 5.5)

    const r0 = Math.ceil(rad * 2.5)
    for (let dy = -r0; dy <= r0; dy++) {
      const y = Math.round(cy) + dy
      if (y < 0 || y >= H) continue
      for (let dx = -r0; dx <= r0; dx++) {
        const x = Math.round(cx) + dx
        if (x < 0 || x >= W) continue
        const d2 = dx * dx + dy * dy
        const g = Math.exp(-d2 / (2 * rad * rad)) * amp
        if (g < 0.0008) continue
        const i = (y * W + x) * 3
        px[i] += cr * g
        px[i + 1] += cg * g
        px[i + 2] += cb * g
      }
    }
  }
}

/* ------------------------------------------------------------------ *
 * Terrain
 * ------------------------------------------------------------------ */

/**
 * One heightfield layer, painted over whatever is behind it.
 *
 * The shading normal comes from a 2D surface field rather than from the
 * ridgeline. A normal derived only from the 1D skyline is constant all the
 * way down a column, so every variation it produces is a vertical stripe —
 * which is exactly what the first version of this rendered. The ridgeline
 * still steers the form near the crest, where it genuinely should.
 */
function paintLayer(S, px, opts) {
  const { baseY, amp, freq, depth, seedOff, kind } = opts
  const peaks = kind === 'peaks'

  // ── the skyline of this layer ──
  const top = new Float32Array(W)
  for (let x = 0; x < W; x++) {
    const u = x / W
    const h = peaks
      ? ridged(u * freq, 0.5, S.seed + seedOff, 5) * 1.05
      : fbm(u * freq, 0.5, S.seed + seedOff, 5) * 0.66 +
        ridged(u * freq * 0.85, 1.5, S.seed + seedOff + 61, 4) * 0.4
    top[x] = baseY - h * amp
  }

  // ── the surface, sampled once per pixel and differenced for normals ──
  let minTop = H
  for (let x = 0; x < W; x++) if (top[x] < minTop) minTop = top[x]
  const yBase = Math.max(0, Math.floor(minTop) - 4)
  const rows = H - yBase
  const fx = peaks ? 0.0068 : 0.0034
  const fy = peaks ? 0.0125 : 0.0076
  const field = new Float32Array(W * rows)
  for (let y = 0; y < rows; y++) {
    const wy = (y + yBase) * fy
    for (let x = 0; x < W; x++) {
      field[y * W + x] = fbm(x * fx, wy, S.seed + seedOff + 11, 5)
    }
  }
  const F = (x, y) =>
    field[Math.min(rows - 1, Math.max(0, y - yBase)) * W + Math.min(W - 1, Math.max(0, x))]

  const sky = [0, 0, 0]
  const hazeAmt = 1 - Math.exp(-S.hazeK * depth * 1.5)
  const bump = peaks ? 18 : 17

  for (let x = 0; x < W; x++) {
    const ty = top[x]
    const rslope = (top[Math.min(W - 1, x + 6)] - top[Math.max(0, x - 6)]) / 12
    const span = Math.max(1, H - ty)
    const y0 = Math.max(0, Math.floor(ty))

    for (let y = y0; y < H; y++) {
      const u = (y - ty) / span

      // Normal from the surface field; the ridge takes over at the crest.
      const crest = Math.exp(-u * 8)
      let nx = -((F(x + 3, y) - F(x - 3, y)) * bump + rslope * crest * 2.2)
      let ny = -(F(x, y + 3) - F(x, y - 3)) * bump - 0.42
      let nz = 1
      const inv = 1 / Math.sqrt(nx * nx + ny * ny + 1)
      nx *= inv
      ny *= inv
      nz *= inv

      let lx = (S.sunX - x) / H
      let ly = (S.sunY - y) / H
      let lz = 0.5
      const il = 1 / Math.sqrt(lx * lx + ly * ly + lz * lz)
      lx *= il
      ly *= il
      lz *= il
      const lam = Math.max(0, nx * lx + ny * ly + nz * lz)

      // Hollows in the field see less of the sky than the shoulders do.
      const ao = 0.55 + F(x, y) * 0.55
      // A soft crest light on whichever side the sun is — no hard sign flip.
      const toSun = Math.exp(-Math.abs(x - S.sunX) / (W * 0.4))
      const rim = Math.exp(-u * 7) * toSun * 0.3

      const shade = 0.08 + lam * 1.25 * ao + rim
      const fall = 0.55 + Math.exp(-u * 1.2) * 0.7

      skyAt(S, x, y, sky)
      // The near foreground falls into shadow, which puts the bright band
      // back where it belongs — the middle distance — and gives the text
      // that sits over the bottom of these plates something to rest on.
      const fg = 0.5 + 0.5 * (1 - (y / H) ** 2.4)
      const gg = fall * S.groundGain * fg
      const r = (S.rock[0] * shade + sky[0] * 0.14 * ao + S.accent[0] * rim * 0.3) * gg
      const g = (S.rock[1] * shade + sky[1] * 0.14 * ao + S.accent[1] * rim * 0.3) * gg
      const b = (S.rock[2] * shade + sky[2] * 0.14 * ao + S.accent[2] * rim * 0.3) * gg

      // Aerial perspective — distance dissolving into the sky. Without it the
      // layers stack like paper cutouts, which is how they used to look.
      const haze = hazeAmt * (1 - u * 0.4)
      const i = (y * W + x) * 3
      px[i] = r + (sky[0] - r) * haze
      px[i + 1] = g + (sky[1] - g) * haze
      px[i + 2] = b + (sky[2] - b) * haze
    }
  }
}

function paintDunes(S, px) {
  paintLayer(S, px, { baseY: 496, amp: 84, freq: 3.1, depth: 0.62, seedOff: 3, kind: 'dunes' })
  paintLayer(S, px, { baseY: 600, amp: 112, freq: 2.2, depth: 0.28, seedOff: 29, kind: 'dunes' })
  paintLayer(S, px, { baseY: 726, amp: 96, freq: 1.5, depth: 0.07, seedOff: 71, kind: 'dunes' })
}

function paintPeaks(S, px) {
  paintLayer(S, px, { baseY: 466, amp: 205, freq: 3.4, depth: 0.74, seedOff: 5, kind: 'peaks' })
  paintLayer(S, px, { baseY: 598, amp: 170, freq: 2.4, depth: 0.32, seedOff: 37, kind: 'peaks' })
  paintLayer(S, px, { baseY: 728, amp: 104, freq: 1.7, depth: 0.08, seedOff: 83, kind: 'peaks' })
}

/**
 * Open water.
 *
 * Wave height is evaluated once per pixel into a field, and the normal comes
 * from screen-space differences of it. Differencing in world space instead
 * sends the slope to infinity as the rows compress toward the horizon, which
 * is what turned the first version of this into radial streaks.
 */
function paintWater(S, px, horizonY) {
  const yTop = Math.floor(horizonY)
  const rows = H - yTop
  const hgt = new Float32Array(W * rows)
  for (let y = 0; y < rows; y++) {
    const d = Math.max(5, y + yTop - horizonY)
    // Capped, because an uncapped plane aliases into static at the horizon.
    const z = Math.min(14, 300 / d)
    const wz = z * 5
    // Distant water reads as a flat sheet, which is also what the eye sees.
    const rs = clamp01((y + yTop - horizonY) / (H - horizonY))
    const a = Math.pow(rs, 0.45)
    for (let x = 0; x < W; x++) {
      const wx = (x - W / 2) * z * 0.028
      hgt[y * W + x] =
        (Math.sin(wx * 1.3 + wz * 0.7) * 0.5 +
          Math.sin(wx * 2.9 - wz * 1.2 + 1.7) * 0.28 +
          Math.sin(wx * 6.3 + wz * 2.4 + 4.1) * 0.13 +
          (fbm(wx * 1.4, wz * 1.4, S.seed + 17, 4) - 0.5) * 0.75) *
        a
    }
  }
  const Hf = (x, y) =>
    hgt[Math.min(rows - 1, Math.max(0, y)) * W + Math.min(W - 1, Math.max(0, x))]

  const sky = [0, 0, 0]
  const refl = [0, 0, 0]
  const deep = S.light
    ? [S.deep[0] * 0.62, S.deep[1] * 0.7, S.deep[2] * 0.76]
    : [S.bot[0] * 0.3, S.bot[1] * 0.46, S.bot[2] * 0.6]

  for (let y = 0; y < rows; y++) {
    const sy = y + yTop
    const rowScale = clamp01((sy - horizonY) / (H - horizonY))
    // Damp the slope toward the horizon, or those rows alias into static.
    const k = 1.7 * Math.pow(rowScale, 0.55)

    for (let x = 0; x < W; x++) {
      let nx = (Hf(x - 1, y) - Hf(x + 1, y)) * k
      let ny = (Hf(x, y - 1) - Hf(x, y + 1)) * k * 2.4
      if (nx > 0.9) nx = 0.9
      else if (nx < -0.9) nx = -0.9
      if (ny > 0.9) ny = 0.9
      else if (ny < -0.9) ny = -0.9
      let nz = 1
      const inv = 1 / Math.sqrt(nx * nx + ny * ny + 1)
      nx *= inv
      ny *= inv
      nz *= inv

      // The sky this facet reflects, mirrored back above the horizon.
      const my = Math.max(0, horizonY - (sy - horizonY) * 0.5 - ny * 110)
      const mx = Math.min(W - 1, Math.max(0, x + nx * 130))
      skyAt(S, mx, my, refl)
      skyAt(S, x, sy, sky)

      // Grazing at the horizon (a mirror), steeper near the viewer.
      const cosT = 0.05 + rowScale * 0.8
      const fres = 0.02 + 0.98 * Math.pow(1 - cosT, 5)

      let lx = (S.sunX - x) / H
      let ly = (S.sunY - sy) / H
      let lz = 0.42
      const il = 1 / Math.sqrt(lx * lx + ly * ly + lz * lz)
      lx *= il
      ly *= il
      lz *= il
      const spec = Math.pow(Math.max(0, nx * lx + ny * ly + nz * lz), 60)
      // Broken up, so the highlight reads as sparkle rather than a smear.
      const glint = spec * (0.35 + Math.pow(fbm(x * 0.05, sy * 0.05, S.seed + 53, 3), 2) * 3.2)
      const track = Math.exp(-(((x - S.sunX) / (W * (0.06 + rowScale * 0.2))) ** 2))
      const sparkle = glint * track * S.glow * 3.4

      const r = deep[0] * (1 - fres) + refl[0] * fres + S.accent[0] * sparkle
      const g = deep[1] * (1 - fres) + refl[1] * fres + S.accent[1] * sparkle
      const b = deep[2] * (1 - fres) + refl[2] * fres + S.accent[2] * sparkle

      const haze = Math.exp(-(sy - horizonY) * (S.light ? 0.022 : 0.03))
      const i = (sy * W + x) * 3
      px[i] = r + (sky[0] - r) * haze
      px[i + 1] = g + (sky[1] - g) * haze
      px[i + 2] = b + (sky[2] - b) * haze
    }
  }
}

/**
 * Below the surface, looking up: light falling through water, caustics on
 * the suspended particles, and everything going dark with depth.
 */
function paintDepths(S, px) {
  for (let y = 0; y < H; y++) {
    const dep = y / H
    // Beer-Lambert absorption. Red goes first, which is why deep water is blue.
    // Deep water in the night theme; in daylight this is shallow, seen from
    // just under the surface, so it must not turn the parchment set blue.
    const ar = Math.exp(-dep * (S.light ? 1.15 : 4.5))
    const ag = Math.exp(-dep * (S.light ? 0.95 : 2.4))
    const ab = Math.exp(-dep * (S.light ? 0.8 : 1.5))
    const fall = Math.exp(-dep * 2.2)
    for (let x = 0; x < W; x++) {
      const dx = (x - S.sunX) / H
      // One shaft from the surface, wandering as it descends.
      const wander = (fbm(dep * 2.4, 0.5, S.seed + 5, 3) - 0.5) * 0.55
      const cone = Math.exp(-(((dx - wander) / (0.09 + dep * 0.6)) ** 2)) * Math.exp(-dep * 2.1)
      // Caustics, only where the light still reaches.
      const c = fbm(x * 0.006 + dep * 1.6, dep * 7, S.seed + 91, 4)
      const caus = Math.pow(clamp01(c * 1.3), 7) * Math.exp(-dep * 3.4) * 0.9
      // Sparse marine snow, dimming with depth.
      const mote = Math.pow(fbm(x * 0.1, y * 0.1, S.seed + 131, 2), 22) * 0.5 * fall
      // In daylight this is shallow water seen from just under the surface,
      // not the deep — otherwise it lands as the one cold plate in a warm set.
      const lit = (cone * 0.9 + caus) * S.glow * (S.light ? 0.85 : 1)

      const i = (y * W + x) * 3
      const bg = S.light ? 0.82 : 0.55
      px[i] = S.deep[0] * ar * bg + S.accent[0] * lit + mote * 0.55
      px[i + 1] = S.deep[1] * ag * bg + S.accent[1] * lit + mote * 0.6
      px[i + 2] = S.deep[2] * ab * bg + S.accent[2] * lit + mote * 0.65
    }
  }
}

/**
 * Architecture. The silhouette itself is the SVG skyline the project already
 * had — it is good, and nothing about it needed to become photographic. What
 * it lacked was air: haze between the ranks, and a lit edge facing the sun.
 */
async function paintSkyline(S, px) {
  let s = S.seed
  const rnd = () => {
    s ^= s << 13
    s >>>= 0
    s ^= s >>> 17
    s ^= s << 5
    s >>>= 0
    return (s % 100000) / 100000
  }

  const ranks = [
    { baseY: 574, scale: 0.86, depth: 0.55 },
    { baseY: 664, scale: 0.7, depth: 0.24 },
    { baseY: 742, scale: 0.5, depth: 0.06 },
  ]

  const sky = [0, 0, 0]
  for (const rank of ranks) {
    const d = skylinePath(rank.baseY, rank.scale, rnd, W, H)
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><path d="${d}" fill="#fff"/></svg>`
    const mask = await sharp(Buffer.from(svg)).extractChannel(0).raw().toBuffer()

    const hazeAmt = 1 - Math.exp(-S.hazeK * rank.depth * 1.6)
    // Where the silhouette's top edge is, per column — for the rim light.
    const topEdge = new Int32Array(W).fill(H)
    for (let x = 0; x < W; x++) {
      for (let y = 0; y < H; y++) {
        if (mask[y * W + x] > 127) {
          topEdge[x] = y
          break
        }
      }
    }

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const a = mask[y * W + x] / 255
        if (a < 0.004) continue
        skyAt(S, x, y, sky)

        const below = y - topEdge[x]
        // Skylight on the upward-facing surfaces, and only a faint warm edge
        // on the side the sun is actually on.
        const up = Math.exp(-below / 40) * 0.32
        const toSun = Math.exp(-Math.abs(x - S.sunX) / (W * 0.4))
        const rim = Math.exp(-below / 11) * toSun * 0.16
        // Stone picks up a little of the sky it faces.
        const grain = fbm(x * 0.01, y * 0.01, S.seed + 211, 3) * 0.3 + 0.85
        const base = S.light ? 0.5 : 0.05

        let r = S.rock[0] * base * grain + sky[0] * (0.1 + up) + S.accent[0] * rim
        let g = S.rock[1] * base * grain + sky[1] * (0.1 + up) + S.accent[1] * rim
        let b = S.rock[2] * base * grain + sky[2] * (0.1 + up) + S.accent[2] * rim
        r += (sky[0] - r) * hazeAmt
        g += (sky[1] - g) * hazeAmt
        b += (sky[2] - b) * hazeAmt

        const i = (y * W + x) * 3
        px[i] += (r - px[i]) * a
        px[i + 1] += (g - px[i + 1]) * a
        px[i + 2] += (b - px[i + 2]) * a
      }
    }
  }
}

/* ------------------------------------------------------------------ *
 * Lens and film
 * ------------------------------------------------------------------ */

/** Three box passes ~ a Gaussian, and far cheaper than one. */
function blur(buf, w, h, stride, radius) {
  const tmp = new Float32Array(buf.length)
  for (let pass = 0; pass < 3; pass++) {
    // horizontal
    for (let y = 0; y < h; y++) {
      for (let c = 0; c < stride; c++) {
        for (let x = 0; x < w; x++) {
          let sum = 0
          let n = 0
          for (let k = -radius; k <= radius; k++) {
            const xx = x + k
            if (xx < 0 || xx >= w) continue
            sum += buf[(y * w + xx) * stride + c]
            n++
          }
          tmp[(y * w + x) * stride + c] = sum / n
        }
      }
    }
    // vertical
    for (let x = 0; x < w; x++) {
      for (let c = 0; c < stride; c++) {
        for (let y = 0; y < h; y++) {
          let sum = 0
          let n = 0
          for (let k = -radius; k <= radius; k++) {
            const yy = y + k
            if (yy < 0 || yy >= h) continue
            sum += tmp[(yy * w + x) * stride + c]
            n++
          }
          buf[(y * w + x) * stride + c] = sum / n
        }
      }
    }
  }
}

/** ACES filmic approximation — the shoulder is what stops highlights clipping flat. */
function aces(x) {
  const a = 2.51
  const b = 0.03
  const c = 2.43
  const d = 0.59
  const e = 0.14
  return clamp01((x * (a * x + b)) / (x * (c * x + d) + e))
}

function post(S, px) {
  // ── bloom: threshold, blur at quarter res, add back ──
  const qw = W >> 2
  const qh = H >> 2
  const bloom = new Float32Array(qw * qh * 3)
  for (let y = 0; y < qh; y++) {
    for (let x = 0; x < qw; x++) {
      let r = 0
      let g = 0
      let b = 0
      for (let dy = 0; dy < 4; dy++) {
        for (let dx = 0; dx < 4; dx++) {
          const i = ((y * 4 + dy) * W + x * 4 + dx) * 3
          r += px[i]
          g += px[i + 1]
          b += px[i + 2]
        }
      }
      r /= 16
      g /= 16
      b /= 16
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
      const over = Math.max(0, luma - 0.5)
      const k = luma > 0 ? over / luma : 0
      const j = (y * qw + x) * 3
      bloom[j] = r * k
      bloom[j + 1] = g * k
      bloom[j + 2] = b * k
    }
  }
  blur(bloom, qw, qh, 3, 5)

  let sg = S.seed
  const rnd = () => {
    sg ^= sg << 13
    sg >>>= 0
    sg ^= sg >>> 17
    sg ^= sg << 5
    sg >>>= 0
    return (sg % 1000000) / 1000000 - 0.5
  }

  const out = Buffer.allocUnsafe(W * H * 3)
  const cx = W / 2
  const cy = H * 0.47
  const maxR = Math.sqrt(cx * cx + cy * cy)

  for (let y = 0; y < H; y++) {
    const by = Math.min(qh - 1, y >> 2)
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 3
      const j = (by * qw + Math.min(qw - 1, x >> 2)) * 3

      let r = px[i] + bloom[j] * 0.62
      let g = px[i + 1] + bloom[j + 1] * 0.62
      let b = px[i + 2] + bloom[j + 2] * 0.62

      // Lens: slight radial falloff, and a touch of transverse chromatic
      // aberration by scaling the channels apart at the edges.
      const dx = (x - cx) / maxR
      const dy = (y - cy) / maxR
      const rr = Math.sqrt(dx * dx + dy * dy)
      const vig = 1 - S.vignette * Math.pow(rr, 2.6)
      const ca = rr * rr * 0.012
      r *= vig * (1 + ca)
      g *= vig
      b *= vig * (1 - ca)

      r = r * S.exposure + S.lift
      g = g * S.exposure + S.lift
      b = b * S.exposure + S.lift

      r = aces(r)
      g = aces(g)
      b = aces(b)

      // Grade: desaturate toward the theme, warm, then settle onto paper.
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
      r = (luma + (r - luma) * S.sat) * S.tint[0]
      g = (luma + (g - luma) * S.sat) * S.tint[1]
      b = (luma + (b - luma) * S.sat) * S.tint[2]
      if (S.paper) {
        r += (0.945 - r) * S.paper
        g += (0.905 - g) * S.paper
        b += (0.835 - b) * S.paper
      }

      // Film grain, strongest in the midtones like real emulsion.
      const gn = rnd() * S.grain * (1 - Math.abs(luma * 2 - 1)) * 3
      r += gn
      g += gn
      b += gn

      out[i] = Math.round(clamp01(linToSrgb(clamp01(r))) * 255)
      out[i + 1] = Math.round(clamp01(linToSrgb(clamp01(g))) * 255)
      out[i + 2] = Math.round(clamp01(linToSrgb(clamp01(b))) * 255)
    }
  }
  return out
}

/* ------------------------------------------------------------------ *
 * Compose
 * ------------------------------------------------------------------ */

/** How much weather each kind of scene carries. */
const WEATHER = {
  veil: { cover: 0.56, height: 0.62, shafts: 0.5 },
  dunes: { cover: 0.68, height: 0.44, shafts: 0.24 },
  peaks: { cover: 0.58, height: 0.5, shafts: 0.3 },
  waves: { cover: 0.52, height: 0.42, shafts: 0.3 },
  skyline: { cover: 0.64, height: 0.46, shafts: 0.26 },
  depths: { cover: 1, height: 0, shafts: 0 },
}

export async function renderPlate(spec, light) {
  const S = setup(spec, light)
  const px = new Float32Array(W * H * 3)
  const w = WEATHER[S.terrain] ?? WEATHER.veil

  if (S.terrain === 'depths') {
    paintDepths(S, px)
  } else {
    const c = [0, 0, 0]
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        skyAt(S, x, y, c)
        const i = (y * W + x) * 3
        px[i] = c[0]
        px[i + 1] = c[1]
        px[i + 2] = c[2]
      }
    }
    paintStars(S, px)
    paintClouds(S, px, w.cover, w.height)
    paintShafts(S, px, w.shafts * S.glow, w.cover)

    if (S.terrain === 'dunes') paintDunes(S, px)
    else if (S.terrain === 'peaks') paintPeaks(S, px)
    else if (S.terrain === 'waves') paintWater(S, px, 520)
    else if (S.terrain === 'skyline') await paintSkyline(S, px)
  }

  return post(S, px)
}
