/**
 * Scroll performance probe.
 *
 *   node scripts/perf.mjs --url http://localhost:5179/ [--theme light] [--mobile]
 *
 * Drives a real scroll down the whole journey and reports frame timing, so
 * "is it laggy" is a measurement rather than a guess.
 */
import { chromium, devices } from 'playwright'

const args = process.argv.slice(2)
const arg = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d }
const URL = arg('--url', 'http://localhost:5179/')
const THEME = arg('--theme', 'light')
const MOBILE = args.includes('--mobile')
const CPU = Number(arg('--cpu', 4))

const browser = await chromium.launch()
const ctx = await browser.newContext(
  MOBILE ? { ...devices['iPhone 13'] } : { viewport: { width: 1440, height: 900 } },
)
await ctx.addInitScript((t) => localStorage.setItem('rtp:theme', t), THEME)
const page = await ctx.newPage()

// Throttle to something like a mid-range laptop/phone so the numbers mean something.
const cdp = await ctx.newCDPSession(page)
await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU })

await page.goto(URL, { waitUntil: 'networkidle' })
await page.waitForTimeout(4000)

const result = await page.evaluate(async () => {
  const frames = []
  let last = performance.now()
  let running = true
  const tick = (t) => { frames.push(t - last); last = t; if (running) requestAnimationFrame(tick) }
  requestAnimationFrame(tick)

  const total = document.documentElement.scrollHeight - innerHeight
  const step = total / 320
  for (let i = 0; i < 320; i++) {
    window.scrollTo(0, i * step)
    await new Promise((r) => requestAnimationFrame(r))
  }
  running = false
  await new Promise((r) => setTimeout(r, 60))

  const f = frames.slice(3).sort((a, b) => a - b)
  const at = (p) => f[Math.min(f.length - 1, Math.floor(f.length * p))]
  return {
    frames: f.length,
    medianMs: +at(0.5).toFixed(1),
    p95Ms: +at(0.95).toFixed(1),
    worstMs: +f[f.length - 1].toFixed(1),
    longFrames: f.filter((x) => x > 50).length,
    canvases: document.querySelectorAll('canvas').length,
    svgNodes: document.querySelectorAll('svg *').length,
    domNodes: document.querySelectorAll('*').length,
  }
})

console.log(JSON.stringify({ theme: THEME, mobile: MOBILE, cpuThrottle: CPU, ...result }, null, 2))
await browser.close()
