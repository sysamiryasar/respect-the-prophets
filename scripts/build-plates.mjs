/**
 * Rasterises the atmospheric plates into real image assets.
 *
 *   npm run plates
 *
 * Produces, for every plate:
 *   public/img/<id>-1600.avif   public/img/<id>-1600.webp
 *   public/img/<id>-800.avif    public/img/<id>-800.webp
 *
 * …and writes src/data/plates.ts containing a tiny inline LQIP for each, so
 * every plate can blur up instead of popping in.
 *
 * The pixels come from plate-render.mjs, which renders each one properly —
 * sky scattering, clouds, aerial perspective, wave optics, film response.
 *
 * ── Using your own artwork instead ─────────────────────────────────────
 * Put your images in `art/` named after the plate — `musa.png`,
 * `musa-light.png` — and run `npm run plates:import`. Anything it finds
 * there wins over the render, so a Canva export drops straight in. See
 * import-art.mjs.
 */
import { mkdir, writeFile, readdir, readFile, rm } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { renderPlate, W, H } from './plate-render.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'img')
const WIDTHS = [1600, 800]

/** id → look. Palettes mirror data/prophets.ts so plates and UI agree. */
const PLATES = [
  // ── chapters ──────────────────────────────────────────────────────────
  { id: 'ch-home', accent: '#d3ad68', skyTop: '#03050a', skyBottom: '#0a1120', terrain: 'veil', glowY: 0.58, glow: 0.55, stars: 150 },
  { id: 'ch-why', accent: '#7fd8b4', skyTop: '#03060b', skyBottom: '#07201d', terrain: 'veil', glowY: 0.5, glow: 0.4, stars: 110 },
  { id: 'ch-pillars', accent: '#d3ad68', skyTop: '#04060d', skyBottom: '#101c33', terrain: 'veil', glowY: 0.46, glow: 0.42, stars: 130 },
  { id: 'ch-prophets', accent: '#e7cd9b', skyTop: '#03050a', skyBottom: '#0a1424', terrain: 'dunes', glowY: 0.6, glow: 0.4, stars: 160 },
  { id: 'ch-stories', accent: '#c9a2e8', skyTop: '#050410', skyBottom: '#141024', terrain: 'peaks', glowY: 0.55, glow: 0.38, stars: 120 },
  { id: 'ch-quran', accent: '#d3ad68', skyTop: '#03080a', skyBottom: '#06241f', terrain: 'veil', glowY: 0.42, glow: 0.45, stars: 90 },
  { id: 'ch-lessons', accent: '#8ec6a8', skyTop: '#04070c', skyBottom: '#0b1c22', terrain: 'peaks', glowY: 0.58, glow: 0.35, stars: 100 },
  { id: 'ch-respect', accent: '#e8cf96', skyTop: '#04060a', skyBottom: '#120f1c', terrain: 'dunes', glowY: 0.5, glow: 0.5, stars: 120 },
  { id: 'ch-constellation', accent: '#e7cd9b', skyTop: '#02040a', skyBottom: '#040812', terrain: 'veil', glowY: 0.5, glow: 0.34, glowR: 0.5, stars: 300 },
  { id: 'ch-final', accent: '#e8cf96', skyTop: '#010204', skyBottom: '#03050a', terrain: 'veil', glowY: 0.5, glow: 0.95, glowR: 0.3, stars: 220 },

  // ── prophets ──────────────────────────────────────────────────────────
  { id: 'adam', accent: '#7fd8b4', skyTop: '#03050a', skyBottom: '#0a2a2a', terrain: 'veil', glowY: 0.72, glow: 0.45, stars: 170 },
  { id: 'nuh', accent: '#6fb2e0', skyTop: '#04080f', skyBottom: '#0a1b2c', terrain: 'waves', glowY: 0.34, glow: 0.34, stars: 40 },
  { id: 'ibrahim', accent: '#f0a860', skyTop: '#050510', skyBottom: '#2a1206', terrain: 'dunes', glowY: 0.66, glow: 0.55, stars: 190 },
  { id: 'ismail', accent: '#e0c58a', skyTop: '#05060c', skyBottom: '#20180c', terrain: 'dunes', glowY: 0.62, glow: 0.42, stars: 150 },
  { id: 'ishaq', accent: '#c8d7a8', skyTop: '#060a10', skyBottom: '#141c10', terrain: 'peaks', glowY: 0.56, glow: 0.4, stars: 90 },
  { id: 'yaqub', accent: '#d9a97e', skyTop: '#06060c', skyBottom: '#1d1410', terrain: 'dunes', glowY: 0.58, glow: 0.36, stars: 120 },
  { id: 'yusuf', accent: '#e9c56b', skyTop: '#050410', skyBottom: '#191026', terrain: 'skyline', glowY: 0.55, glow: 0.44, stars: 140 },
  { id: 'musa', accent: '#5fd0d8', skyTop: '#02060c', skyBottom: '#04202c', terrain: 'waves', glowY: 0.46, glow: 0.48, stars: 130 },
  { id: 'harun', accent: '#8ec6a8', skyTop: '#040709', skyBottom: '#0c1f1c', terrain: 'peaks', glowY: 0.6, glow: 0.36, stars: 110 },
  { id: 'dawud', accent: '#9fb6e8', skyTop: '#04060e', skyBottom: '#101830', terrain: 'peaks', glowY: 0.5, glow: 0.4, stars: 160 },
  { id: 'sulayman', accent: '#c9a2e8', skyTop: '#060410', skyBottom: '#1a1030', terrain: 'skyline', glowY: 0.52, glow: 0.42, stars: 130 },
  { id: 'yunus', accent: '#4fc0b0', skyTop: '#02121a', skyBottom: '#04202a', terrain: 'depths', glowY: 0.12, glow: 0.5, stars: 0 },
  { id: 'zakariyya', accent: '#a8c8d8', skyTop: '#04070c', skyBottom: '#0c1620', terrain: 'skyline', glowY: 0.5, glow: 0.36, stars: 100 },
  { id: 'yahya', accent: '#8fd6b8', skyTop: '#050a0b', skyBottom: '#0a1e1a', terrain: 'waves', glowY: 0.52, glow: 0.4, stars: 80 },
  { id: 'isa', accent: '#bcd8e8', skyTop: '#050a12', skyBottom: '#0e1826', terrain: 'skyline', glowY: 0.44, glow: 0.4, stars: 60 },
  { id: 'muhammad', accent: '#e8cf96', skyTop: '#03060c', skyBottom: '#0d1a1c', terrain: 'skyline', glowY: 0.62, glow: 0.55, stars: 210 },
]

/**
 * Ids the reader supplied their own artwork for, via `npm run plates:import`.
 * Those are left exactly as they are — the render would otherwise overwrite
 * them on the next build, which is a rude way to lose someone's work.
 */
async function importedArt() {
  try {
    const list = JSON.parse(await readFile(join(root, 'art', 'imported.json'), 'utf8'))
    return new Map(list.map((e) => [e.id, e.lqip]))
  } catch {
    return new Map()
  }
}

async function main() {
  const custom = await importedArt()
  // A targeted clean, so imported files survive.
  try {
    for (const f of await readdir(outDir)) {
      const id = f.replace(/-(?:1600|800)\.(?:avif|webp)$/, '')
      if (!custom.has(id)) await rm(join(outDir, f), { force: true })
    }
  } catch {
    /* first run */
  }
  await mkdir(outDir, { recursive: true })

  const manifest = []
  let kept = 0

  for (const plate of PLATES) {
    const variants = {}

    // Each plate is rendered twice — night, and the parchment theme, which
    // is not the night one with a filter over it but the same landscape at a
    // different hour, lit and graded for daylight.
    for (const light of [false, true]) {
      const suffix = light ? '-light' : ''
      if (custom.has(`${plate.id}${suffix}`)) {
        kept++
        continue
      }
      const raw = await renderPlate(plate, light)
      const src = () => sharp(raw, { raw: { width: W, height: H, channels: 3 } })

      for (const w of WIDTHS) {
        const base = src().resize(w, Math.round((w / W) * H))
        await base
          .clone()
          .avif({ quality: 52, effort: 6 })
          .toFile(join(outDir, `${plate.id}${suffix}-${w}.avif`))
        await base
          .clone()
          .webp({ quality: 76, effort: 5 })
          .toFile(join(outDir, `${plate.id}${suffix}-${w}.webp`))
      }

      // Tiny blur-up placeholder, inlined into the bundle.
      const lqip = await src()
        .resize(20, Math.round((20 / W) * H))
        .blur(1.1)
        .webp({ quality: 42 })
        .toBuffer()
      variants[light ? 'lqipLight' : 'lqip'] = `data:image/webp;base64,${lqip.toString('base64')}`
    }

    manifest.push({
      id: plate.id,
      // An imported plate keeps the placeholder built from its own image.
      lqip: variants.lqip ?? custom.get(plate.id) ?? '',
      lqipLight: variants.lqipLight ?? custom.get(`${plate.id}-light`) ?? variants.lqip ?? '',
    })
    process.stdout.write(`  ✓ ${plate.id}\n`)
  }

  const ts = `// GENERATED by scripts/build-plates.mjs — do not edit by hand.
// Run \`npm run plates\` to regenerate.

export interface Plate {
  id: string
  /** Inline blur-up placeholders, one per theme. */
  lqip: string
  lqipLight: string
}

export const PLATE_WIDTHS = [${WIDTHS.join(', ')}] as const
export const PLATE_RATIO = ${(W / H).toFixed(6)}

export const PLATES: Record<string, Plate> = {
${manifest
  .map((m) => `  '${m.id}': { id: '${m.id}', lqip: '${m.lqip}', lqipLight: '${m.lqipLight}' },`)
  .join('\n')}
}

export type PlateId = keyof typeof PLATES
`
  await writeFile(join(root, 'src', 'data', 'plates.ts'), ts, 'utf8')

  const files = await readdir(outDir)
  console.log(`\n${manifest.length} plates → ${files.length} image files in public/img`)
  if (kept) console.log(`${kept} left alone — your own artwork, from art/`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
