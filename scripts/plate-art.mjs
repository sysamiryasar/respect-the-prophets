/**
 * Atmospheric plate artwork.
 *
 * These are the painted *backdrops* of the experience — sky, light, haze and
 * silhouette. They deliberately contain no symbols and no figures: the
 * symbolic vector art (staff, ark, well, Ka'bah…) is layered live on top of
 * them in the app, so nothing is duplicated between the two.
 *
 * Output is plain SVG markup, rasterised to AVIF/WebP by build-plates.mjs.
 *
 * As with everything else in this project: no faces, no bodies, no figures.
 */

export const W = 1600
export const H = 900

/* ---- deterministic randomness so builds are byte-stable ---------------- */
function seeded(seed) {
  let s = seed >>> 0 || 1
  return () => {
    s ^= s << 13
    s >>>= 0
    s ^= s >>> 17
    s ^= s << 5
    s >>>= 0
    return (s % 100000) / 100000
  }
}

const hex = (c, a) => {
  const n = c.replace('#', '')
  const v = parseInt(
    n.length === 3
      ? n
          .split('')
          .map((x) => x + x)
          .join('')
      : n,
    16,
  )
  return `rgba(${(v >> 16) & 255},${(v >> 8) & 255},${v & 255},${a})`
}

/** Smooth horizon line built from stacked sines. */
function horizon(y, amp, phase, rough = 0.35) {
  const f = (x) =>
    y +
    Math.sin((x / W) * Math.PI * 2 + phase) * amp +
    Math.sin((x / W) * Math.PI * 5.3 + phase * 1.7) * amp * rough +
    Math.sin((x / W) * Math.PI * 11 + phase * 0.6) * amp * rough * 0.4
  let d = `M0,${f(0).toFixed(1)}`
  for (let x = 40; x <= W; x += 40) d += ` L${x},${f(x).toFixed(1)}`
  return `${d} L${W},${H} L0,${H} Z`
}

/**
 * An architectural skyline in the Islamic idiom — low arcaded halls, domes,
 * and slender minarets with onion caps and finials. Buildings only.
 */
function skyline(baseY, scale, rnd) {
  const n = (v) => v.toFixed(0)
  let d = `M0,${H} L0,${baseY}`
  let x = -20
  while (x < W) {
    const kind = rnd()
    if (kind > 0.62) {
      // ── dome on a low drum ──
      const w = (110 + rnd() * 130) * scale
      const drum = (28 + rnd() * 34) * scale
      const rise = w * (0.52 + rnd() * 0.18)
      const top = baseY - drum
      d += ` L${n(x)},${n(top)}`
      d += ` Q${n(x + w * 0.5)},${n(top - rise)} ${n(x + w)},${n(top)}`
      d += ` L${n(x + w)},${n(baseY)}`
      x += w
    } else if (kind > 0.4) {
      // ── minaret: slender shaft, gallery, onion cap, finial ──
      const shaft = (16 + rnd() * 12) * scale
      const h = (190 + rnd() * 150) * scale
      const top = baseY - h
      const gal = shaft * 1.9
      const cx = x + shaft / 2
      d += ` L${n(x)},${n(baseY - h * 0.82)}`
      // gallery ledge
      d += ` L${n(cx - gal / 2)},${n(baseY - h * 0.82)} L${n(cx - gal / 2)},${n(baseY - h * 0.88)}`
      d += ` L${n(cx - shaft * 0.55)},${n(baseY - h * 0.88)}`
      // onion cap
      d += ` Q${n(cx - shaft * 0.85)},${n(top + h * 0.06)} ${n(cx)},${n(top)}`
      d += ` Q${n(cx + shaft * 0.85)},${n(top + h * 0.06)} ${n(cx + shaft * 0.55)},${n(baseY - h * 0.88)}`
      d += ` L${n(cx + gal / 2)},${n(baseY - h * 0.88)} L${n(cx + gal / 2)},${n(baseY - h * 0.82)}`
      d += ` L${n(x + shaft)},${n(baseY - h * 0.82)} L${n(x + shaft)},${n(baseY)}`
      x += shaft + 14 * scale
    } else {
      // ── arcaded hall: flat roof with a run of small arches cut in ──
      const w = (140 + rnd() * 180) * scale
      const h = (46 + rnd() * 60) * scale
      const top = baseY - h
      const arches = Math.max(2, Math.round(w / (34 * scale)))
      const aw = w / arches
      d += ` L${n(x)},${n(top)}`
      for (let i = 0; i < arches; i++) {
        const ax = x + i * aw
        d += ` L${n(ax + aw * 0.18)},${n(top)}`
        d += ` Q${n(ax + aw * 0.5)},${n(top - aw * 0.34)} ${n(ax + aw * 0.82)},${n(top)}`
      }
      d += ` L${n(x + w)},${n(top)} L${n(x + w)},${n(baseY)}`
      x += w
    }
  }
  return `${d} L${W},${H} Z`
}

/** Layered sea bands. */
function seaBand(y, amp, phase) {
  let d = `M0,${(y + Math.sin(phase) * amp).toFixed(1)}`
  for (let x = 30; x <= W; x += 30) {
    d += ` L${x},${(y + Math.sin((x / W) * Math.PI * 6 + phase) * amp).toFixed(1)}`
  }
  return `${d} L${W},${H} L0,${H} Z`
}

/* ----------------------------------------------------------------------- */

const TERRAIN = {
  dunes: (rnd, accent) => {
    const layers = []
    const bands = [
      { y: 520, amp: 26, o: 0.9, c: '#0d0a07' },
      { y: 600, amp: 34, o: 1, c: '#090705' },
      { y: 690, amp: 22, o: 1, c: '#050403' },
    ]
    bands.forEach((b, i) => {
      layers.push(
        `<path d="${horizon(b.y, b.amp, i * 1.9 + rnd())}" fill="${b.c}" opacity="${b.o}"/>`,
      )
      layers.push(
        `<path d="${horizon(b.y, b.amp, i * 1.9 + rnd())}" fill="none" stroke="${hex(accent, 0.14 - i * 0.035)}" stroke-width="2"/>`,
      )
    })
    return layers.join('')
  },
  peaks: (rnd, accent) => {
    const mk = (baseY, h, o, c) => {
      let d = `M0,${H} L0,${baseY}`
      let x = 0
      while (x < W) {
        const w = 180 + rnd() * 260
        d += ` L${(x + w / 2).toFixed(0)},${(baseY - h * (0.5 + rnd() * 0.7)).toFixed(0)} L${(x + w).toFixed(0)},${baseY}`
        x += w
      }
      return `<path d="${d} L${W},${H} Z" fill="${c}" opacity="${o}"/>`
    }
    return [
      mk(520, 210, 0.85, '#0a1018'),
      mk(600, 160, 1, '#070b12'),
      `<path d="${horizon(700, 16, 2.2)}" fill="#04070b"/>`,
      `<path d="${horizon(700, 16, 2.2)}" fill="none" stroke="${hex(accent, 0.12)}" stroke-width="2"/>`,
    ].join('')
  },
  waves: (rnd, accent) => {
    const bands = [
      { y: 500, amp: 14, p: 0.4, c: '#0c2b3d' },
      { y: 560, amp: 20, p: 2.3, c: '#08202f' },
      { y: 630, amp: 26, p: 4.1, c: '#051520' },
      { y: 720, amp: 18, p: 1.1, c: '#020b12' },
    ]
    return bands
      .map(
        (b) =>
          `<path d="${seaBand(b.y, b.amp, b.p + rnd() * 0.3)}" fill="${b.c}"/>` +
          `<path d="${seaBand(b.y, b.amp, b.p + rnd() * 0.3)}" fill="none" stroke="${hex(accent, 0.16)}" stroke-width="1.6"/>`,
      )
      .join('')
  },
  skyline: (rnd, accent) => {
    return [
      `<path d="${skyline(600, 0.85, rnd)}" fill="#070c11" opacity="0.9"/>`,
      `<path d="${skyline(680, 0.7, rnd)}" fill="#04080c"/>`,
      `<path d="${horizon(740, 10, 1.4)}" fill="#020508"/>`,
      `<rect x="0" y="736" width="${W}" height="4" fill="${hex(accent, 0.12)}"/>`,
    ].join('')
  },
  depths: (rnd, accent) => {
    const bands = []
    for (let i = 0; i < 6; i++) {
      const y = 120 + i * 140
      bands.push(
        `<path d="${seaBand(y, 22 + i * 4, i * 1.6 + rnd())}" fill="#020d13" opacity="${0.18 + i * 0.13}"/>`,
      )
      bands.push(
        `<path d="${seaBand(y, 22 + i * 4, i * 1.6 + rnd())}" fill="none" stroke="${hex(accent, 0.07)}" stroke-width="1.4"/>`,
      )
    }
    return bands.join('')
  },
  veil: (rnd, accent) => {
    // No hard horizon: pure atmosphere. Used for abstract chapters.
    const bands = []
    for (let i = 0; i < 5; i++) {
      const y = 260 + i * 130
      bands.push(
        `<path d="${seaBand(y, 30, i * 2.1 + rnd())}" fill="${hex(accent, 0.045)}" />`,
      )
    }
    bands.push(`<path d="${horizon(780, 14, 0.8)}" fill="#03060a"/>`)
    return bands.join('')
  },
}

/**
 * Build one plate.
 *
 * @param {object} o
 * @param {string} o.id            stable name (also the seed)
 * @param {string} o.accent        highlight hue
 * @param {string} o.skyTop        upper sky
 * @param {string} o.skyBottom     lower sky
 * @param {keyof TERRAIN} o.terrain
 * @param {number} o.glowX         0–1 across the frame
 * @param {number} o.glowY         0–1 down the frame
 * @param {number} [o.glow]        bloom strength
 * @param {number} [o.glowR]       bloom radius (smaller = tighter light)
 * @param {number} [o.stars]       star count (0 = daylight)
 */
export function buildPlateSvg({
  id,
  accent,
  skyTop,
  skyBottom,
  terrain,
  glowX = 0.5,
  glowY = 0.62,
  glow = 0.5,
  glowR = 0.72,
  stars = 90,
}) {
  let seed = 0
  for (let i = 0; i < id.length; i++) seed = (seed * 31 + id.charCodeAt(i)) >>> 0
  const rnd = seeded(seed || 7)

  const starField = Array.from({ length: stars }, () => {
    const x = (rnd() * W).toFixed(0)
    const y = (rnd() * H * 0.62).toFixed(0)
    const r = (0.6 + rnd() * rnd() * 2.4).toFixed(2)
    const o = (0.14 + rnd() * 0.66).toFixed(2)
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#f6e5bf" opacity="${o}"/>`
  }).join('')

  // A few soft haze ribbons for depth between sky and terrain.
  const haze = Array.from({ length: 4 }, (_, i) => {
    const y = 330 + i * 90 + rnd() * 40
    const h = 70 + rnd() * 90
    return `<rect x="0" y="${y.toFixed(0)}" width="${W}" height="${h.toFixed(0)}" fill="url(#haze)" opacity="${(0.22 - i * 0.045).toFixed(2)}"/>`
  }).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${skyTop}"/>
      <stop offset="55%" stop-color="${skyBottom}"/>
      <stop offset="100%" stop-color="${skyBottom}"/>
    </linearGradient>
    <radialGradient id="bloom" cx="${glowX}" cy="${glowY}" r="${glowR}">
      <stop offset="0%" stop-color="${hex(accent, glow)}"/>
      <stop offset="26%" stop-color="${hex(accent, glow * 0.34)}"/>
      <stop offset="60%" stop-color="${hex(accent, glow * 0.08)}"/>
      <stop offset="100%" stop-color="${hex(accent, 0)}"/>
    </radialGradient>
    <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${hex(accent, 0)}"/>
      <stop offset="50%" stop-color="${hex(accent, 0.12)}"/>
      <stop offset="100%" stop-color="${hex(accent, 0)}"/>
    </linearGradient>
    <radialGradient id="vig" cx="0.5" cy="0.46" r="0.78">
      <stop offset="45%" stop-color="rgba(2,4,7,0)"/>
      <stop offset="82%" stop-color="rgba(2,4,7,0.45)"/>
      <stop offset="100%" stop-color="rgba(2,4,7,0.88)"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  ${starField}
  <rect width="${W}" height="${H}" fill="url(#bloom)"/>
  ${haze}
  ${TERRAIN[terrain](rnd, accent)}
  <rect width="${W}" height="${H}" fill="url(#vig)"/>
</svg>`
}
