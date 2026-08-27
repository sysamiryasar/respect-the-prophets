/**
 * Visual QA harness.
 *
 *   node scripts/capture.mjs [--url http://localhost:5178] [--out .qa] [--mobile]
 *
 * Walks the whole journey in a real rendering browser, screenshotting every
 * scene at several points through its scroll track, exercising each
 * interaction, and collecting console errors. The point is to actually look
 * at the thing rather than infer it from the DOM.
 */
import { chromium, devices } from 'playwright'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const args = process.argv.slice(2)
const arg = (n, d) => {
  const i = args.indexOf(n)
  return i >= 0 ? args[i + 1] : d
}
const URL = arg('--url', 'http://localhost:5178/')
const OUT = arg('--out', '.qa')
const MOBILE = args.includes('--mobile')
const ONLY = arg('--only', null)

/** Scroll fractions to sample within each pinned scene's track. */
const SAMPLES = [0.12, 0.38, 0.62, 0.88]

const shots = []
const problems = []

async function settle(page, ms = 900) {
  await page.waitForTimeout(ms)
}

async function shot(page, name) {
  const file = join(OUT, `${String(shots.length).padStart(2, '0')}-${name}.png`)
  await page.screenshot({ path: file })
  shots.push(file)
  return file
}

async function main() {
  await rm(OUT, { recursive: true, force: true })
  await mkdir(OUT, { recursive: true })

  const browser = await chromium.launch()
  const ctx = await browser.newContext(
    MOBILE
      ? { ...devices['iPhone 13'], reducedMotion: 'no-preference' }
      : { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  )
  const page = await ctx.newPage()

  const consoleErrors = []
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') consoleErrors.push(m.text().slice(0, 240))
  })
  page.on('pageerror', (e) => consoleErrors.push(`PAGEERROR: ${e.message}`))

  await page.goto(URL, { waitUntil: 'networkidle' })

  // Deterministic scrolling, and let the opening finish its staged reveal.
  await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' })
  await settle(page, 4500)

  /* ── 1. the opening ───────────────────────────────────────────── */
  await shot(page, 'intro')

  /* ── 2. every scene, sampled through its track ────────────────── */
  const scenes = await page.evaluate(() =>
    [...document.querySelectorAll('[data-scene]')].map((el) => {
      const r = el.getBoundingClientRect()
      return { id: el.id, top: r.top + window.scrollY, height: el.offsetHeight }
    }),
  )

  for (const s of scenes) {
    if (ONLY && !s.id.includes(ONLY)) continue
    const tall = s.height > window0(page) * 1.4
    const fracs = tall ? SAMPLES : [0.5]
    for (const f of fracs) {
      const y = tall
        ? s.top + (s.height - 900) * f
        : s.top + s.height / 2 - 450
      await page.evaluate((v) => window.scrollTo(0, v), Math.max(0, y))
      await settle(page, tall ? 1100 : 1600)
      await shot(page, `${s.id}${tall ? `-${Math.round(f * 100)}` : ''}`)
    }
  }

  /* ── 3. interactions ──────────────────────────────────────────── */
  const interactions = [
    { name: 'road-learn', scene: 'why', sel: 'button[aria-pressed]', filter: 'Learn' },
    { name: 'iman-messengers', scene: 'iman', sel: '#iman button[aria-pressed]', nth: 3 },
    { name: 'prophets-musa', scene: 'prophets', sel: '#prophets button[aria-pressed]', nth: 3 },
    { name: 'trial-fire', scene: 'trials', sel: '#trials button[aria-pressed]', nth: 1 },
    { name: 'wheel-mercy', scene: 'lessons', sel: '#lessons button[aria-pressed]', nth: 4 },
    { name: 'quality-mercy', scene: 'muhammad', sel: '#muhammad button[aria-pressed]', nth: 0 },
    { name: 'step-live-it', scene: 'action', sel: '#action button[aria-expanded]', nth: 4 },
  ]

  for (const it of interactions) {
    if (ONLY && !it.scene.includes(ONLY)) continue
    try {
      const target = await page.evaluate(
        ({ sel, filter, nth }) => {
          let list = [...document.querySelectorAll(sel)]
          if (filter) list = list.filter((b) => (b.getAttribute('aria-label') || '').includes(filter))
          const el = list[nth ?? 0]
          if (!el) return null
          el.scrollIntoView({ block: 'center' })
          return true
        },
        { sel: it.sel, filter: it.filter, nth: it.nth },
      )
      if (!target) {
        problems.push(`interaction target missing: ${it.name}`)
        continue
      }
      await settle(page, 700)
      await page.evaluate(
        ({ sel, filter, nth }) => {
          let list = [...document.querySelectorAll(sel)]
          if (filter) list = list.filter((b) => (b.getAttribute('aria-label') || '').includes(filter))
          list[nth ?? 0]?.click()
        },
        { sel: it.sel, filter: it.filter, nth: it.nth },
      )
      await settle(page, 1300)
      await shot(page, `x-${it.name}`)
    } catch (e) {
      problems.push(`interaction failed: ${it.name} — ${e.message}`)
    }
  }

  /* ── 4. layout audit at this viewport ─────────────────────────── */
  const audit = await page.evaluate(() => {
    const de = document.documentElement
    const vw = de.clientWidth
    const bleed = [...document.querySelectorAll('body *')]
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .filter(({ el, r }) => {
        if (r.width === 0 || r.right <= vw + 1) return false
        let p = el.parentElement
        while (p && p !== document.body) {
          const o = getComputedStyle(p)
          if (/hidden|clip|auto|scroll/.test(o.overflowX + o.overflowY)) return false
          p = p.parentElement
        }
        return true
      })
      .slice(0, 6)
      .map(({ el, r }) => `${el.tagName}.${String(el.className).slice(0, 50)} → ${Math.round(r.right)}`)

    // text that overflows its own box (clipped headlines etc.)
    const clipped = [...document.querySelectorAll('h1,h2,h3,h4,p,span,button')]
      .filter((el) => el.offsetWidth > 0 && el.scrollWidth > el.offsetWidth + 2)
      .slice(0, 8)
      .map((el) => `${el.tagName}: "${el.textContent.trim().slice(0, 34)}" ${el.scrollWidth}>${el.offsetWidth}`)

    return {
      vw,
      docScrollWidth: de.scrollWidth,
      horizontalOverflow: de.scrollWidth > vw + 1,
      bleed,
      clipped,
      heightScreens: +(de.scrollHeight / de.clientHeight).toFixed(1),
    }
  })

  await writeFile(
    join(OUT, 'report.json'),
    JSON.stringify(
      { url: URL, mobile: MOBILE, audit, consoleErrors: [...new Set(consoleErrors)], problems, shots },
      null,
      2,
    ),
  )

  console.log(`\n${shots.length} screenshots → ${OUT}`)
  console.log('overflow:', audit.horizontalOverflow, '| height:', audit.heightScreens, 'screens')
  if (audit.clipped.length) console.log('clipped text:', audit.clipped)
  if (audit.bleed.length) console.log('bleeding elements:', audit.bleed)
  if (consoleErrors.length) console.log('console:', [...new Set(consoleErrors)].slice(0, 6))
  if (problems.length) console.log('problems:', problems)

  await browser.close()
}

function window0() {
  return 900
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
