/**
 * Responsive + theme audit.
 *
 *   node scripts/responsive.mjs --url http://localhost:5179/
 *
 * Loads the journey at a spread of real device widths in both themes and
 * checks the things that actually break: horizontal overflow, elements
 * escaping their container, text clipped inside its own box, tap targets
 * that are too small, and console errors.
 */
import { chromium } from 'playwright'

const arg = (n, d) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : d }
const URL = arg('--url', 'http://localhost:5179/')

const SIZES = [
  { name: 'iPhone SE', w: 375, h: 667, touch: true },
  { name: 'iPhone 14', w: 390, h: 844, touch: true },
  { name: 'Pixel 7', w: 412, h: 915, touch: true },
  { name: 'iPad mini', w: 768, h: 1024, touch: true },
  { name: 'iPad Pro', w: 1024, h: 1366, touch: true },
  { name: 'Laptop', w: 1280, h: 800, touch: false },
  { name: 'Desktop', w: 1440, h: 900, touch: false },
  { name: 'Wide', w: 1920, h: 1080, touch: false },
]

const browser = await chromium.launch()
const rows = []

for (const theme of ['light', 'dark']) {
  for (const s of SIZES) {
    const ctx = await browser.newContext({
      viewport: { width: s.w, height: s.h },
      hasTouch: s.touch,
      isMobile: s.touch,
      deviceScaleFactor: 2,
    })
    await ctx.addInitScript((t) => localStorage.setItem('rtp:theme', t), theme)
    const page = await ctx.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message.slice(0, 120)))
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 120)) })

    await page.goto(URL, { waitUntil: 'networkidle' })
    await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' })
    await page.waitForTimeout(3800)

    // walk the page so lazy sections render and every layout is exercised
    const audit = await page.evaluate(async () => {
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
      const de = document.documentElement
      let worstOverflow = 0
      const bleeds = new Set()
      const smalls = new Set()
      const clipped = new Set()

      const steps = 26
      for (let i = 0; i <= steps; i++) {
        scrollTo(0, ((de.scrollHeight - innerHeight) * i) / steps)
        await sleep(130)
        worstOverflow = Math.max(worstOverflow, de.scrollWidth - de.clientWidth)

        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect()
          if (r.width === 0 || r.height === 0) continue
          if (r.right > de.clientWidth + 1 || r.left < -1) {
            let p = el.parentElement, contained = false
            while (p && p !== document.body) {
              const o = getComputedStyle(p)
              if (/hidden|clip|auto|scroll/.test(o.overflowX + o.overflowY)) { contained = true; break }
              p = p.parentElement
            }
            if (!contained) bleeds.add(el.tagName + '.' + String(el.className).slice(0, 40))
          }
        }
        for (const b of document.querySelectorAll('button, a[href]')) {
          if (b.offsetWidth === 0) continue
          if (b.offsetWidth < 28 || b.offsetHeight < 28) {
            smalls.add((b.getAttribute('aria-label') || b.textContent || '').trim().slice(0, 28) +
              ` ${b.offsetWidth}x${b.offsetHeight}`)
          }
        }
        for (const el of document.querySelectorAll('h1,h2,h3,p')) {
          if (el.offsetWidth > 0 && el.scrollWidth > el.offsetWidth + 2) {
            clipped.add(el.tagName + ': ' + el.textContent.trim().slice(0, 26))
          }
        }
      }
      scrollTo(0, 0)
      return {
        overflowPx: worstOverflow,
        bleeds: [...bleeds].slice(0, 4),
        smalls: [...smalls].slice(0, 4),
        clipped: [...clipped].slice(0, 4),
        heightScreens: +(de.scrollHeight / de.clientHeight).toFixed(1),
      }
    })

    rows.push({ theme, device: `${s.name} ${s.w}`, ...audit, errors: [...new Set(errors)].slice(0, 2) })
    await ctx.close()
  }
}

await browser.close()

let bad = 0
for (const r of rows) {
  const issues = []
  if (r.overflowPx > 1) issues.push(`overflow ${r.overflowPx}px`)
  if (r.bleeds.length) issues.push(`bleed ${r.bleeds.length}`)
  if (r.smalls.length) issues.push(`small ${r.smalls.length}`)
  if (r.clipped.length) issues.push(`clipped ${r.clipped.length}`)
  if (r.errors.length) issues.push(`errors ${r.errors.length}`)
  if (issues.length) bad++
  console.log(
    `${r.theme.padEnd(5)} ${r.device.padEnd(16)} ${String(r.heightScreens).padStart(5)} screens  ` +
      (issues.length ? '⚠ ' + issues.join(', ') : 'clean'),
  )
  if (r.smalls.length) console.log('        small:', r.smalls.join(' | '))
  if (r.clipped.length) console.log('        clipped:', r.clipped.join(' | '))
  if (r.bleeds.length) console.log('        bleed:', r.bleeds.join(' | '))
  if (r.errors.length) console.log('        errors:', r.errors.join(' | '))
}
console.log(`\n${rows.length - bad}/${rows.length} configurations clean`)
