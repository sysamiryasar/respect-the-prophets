/**
 * Bring your own artwork.
 *
 *   npm run plates:import
 *
 * Put images in `art/` named after the plate they replace and this turns each
 * one into the same set of assets the renderer produces — AVIF and WebP at
 * two widths, plus the inline blur-up placeholder — and records it so that
 * `npm run plates` will not overwrite it later.
 *
 *   art/musa.png          -> the night plate for Musa
 *   art/musa-light.jpg    -> the parchment plate for Musa
 *   art/ch-home.jpeg      -> the opening chapter
 *
 * png, jpg, jpeg, webp and avif are all accepted. Anything that is not 16:9
 * is centre-cropped to it, so exporting at 1920x1080 from Canva (or anywhere
 * else) is the path of least resistance. Supply only the ids you want to
 * replace — every other plate keeps its render, and the two mix freely.
 *
 * The same rule as everywhere else in this project applies to whatever you
 * put in that folder: landscapes, architecture, light and pattern. No
 * depiction of any Prophet — no faces, no bodies, no figures, no silhouettes
 * standing in for one.
 */
import { mkdir, readdir, writeFile, readFile, stat } from 'node:fs/promises'
import { join, dirname, extname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const artDir = join(root, 'art')
const outDir = join(root, 'public', 'img')
const manifestPath = join(root, 'art', 'imported.json')
const WIDTHS = [1600, 800]
const W = 1600
const H = 900
const ACCEPT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif'])

async function main() {
  let files = []
  try {
    files = await readdir(artDir)
  } catch {
    await mkdir(artDir, { recursive: true })
    console.log(
      `Created ${artDir}\n\n` +
        'Drop images in there named after the plate they should replace —\n' +
        "musa.png, musa-light.png, ch-home.png — then run this again.\n",
    )
    return
  }

  const jobs = files.filter((f) => ACCEPT.has(extname(f).toLowerCase()))
  if (!jobs.length) {
    console.log(`No images in ${artDir} (png, jpg, jpeg, webp or avif).`)
    return
  }

  await mkdir(outDir, { recursive: true })
  const imported = []

  for (const file of jobs) {
    const name = basename(file, extname(file))
    const src = join(artDir, file)
    const meta = await sharp(src).metadata()

    // Cover-fit to 16:9 so any export size works.
    const base = sharp(src).resize(W, H, { fit: 'cover', position: 'attention' })
    const flat = await base.toColorspace('srgb').toBuffer()

    for (const w of WIDTHS) {
      const at = sharp(flat).resize(w, Math.round((w / W) * H))
      await at.clone().avif({ quality: 52, effort: 6 }).toFile(join(outDir, `${name}-${w}.avif`))
      await at.clone().webp({ quality: 76, effort: 5 }).toFile(join(outDir, `${name}-${w}.webp`))
    }

    const lqip = await sharp(flat)
      .resize(20, Math.round((20 / W) * H))
      .blur(1.1)
      .webp({ quality: 42 })
      .toBuffer()

    imported.push({
      id: name,
      source: file,
      from: `${meta.width}x${meta.height}`,
      lqip: `data:image/webp;base64,${lqip.toString('base64')}`,
    })
    console.log(`  ✓ ${file}  ${meta.width}x${meta.height} → ${name}-1600 / -800`)
  }

  // Record what came from `art/`, so the renderer leaves these alone and the
  // placeholders in src/data/plates.ts match the images actually shipping.
  await writeFile(manifestPath, `${JSON.stringify(imported, null, 2)}\n`, 'utf8')
  await patchPlateData(imported)

  console.log(
    `\n${imported.length} imported. They now override the rendered plates;\n` +
      'delete the file from art/ and re-run `npm run plates` to go back.',
  )
}

/** Swap the inline blur-up placeholders for the imported images' own. */
async function patchPlateData(imported) {
  const file = join(root, 'src', 'data', 'plates.ts')
  let ts = await readFile(file, 'utf8')
  for (const im of imported) {
    const light = im.id.endsWith('-light')
    const id = light ? im.id.slice(0, -6) : im.id
    const key = light ? 'lqipLight' : 'lqip'
    const line = new RegExp(`(  '${id}': \\{[^}]*?${key}: ')[^']*(')`)
    if (line.test(ts)) ts = ts.replace(line, `$1${im.lqip}$2`)
  }
  await writeFile(file, ts, 'utf8')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
