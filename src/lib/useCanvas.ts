import { useEffect, useRef } from 'react'

export interface CanvasFrame {
  ctx: CanvasRenderingContext2D
  /** CSS pixel width/height (already DPR-corrected via transform). */
  w: number
  h: number
  /** Seconds since the loop started. */
  t: number
  /** Seconds since the previous frame, clamped to avoid tab-switch jumps. */
  dt: number
}

interface Options {
  /** Called once per resize (and on mount) before the first draw. */
  setup?: (f: Omit<CanvasFrame, 't' | 'dt'>) => void
  draw: (f: CanvasFrame) => void
  /** When true, draw exactly one frame and stop. */
  still?: boolean
  /** Cap the device pixel ratio. 2 is plenty; 3 costs 2.25x the fill rate. */
  maxDpr?: number
  /** Re-run setup when any of these change. */
  deps?: unknown[]
}

/**
 * A single well-behaved canvas loop:
 *  - DPR-aware, capped, and re-fit on container resize
 *  - paused when scrolled out of view (IntersectionObserver)
 *  - paused when the tab is hidden
 *  - `still` renders one frame and stops (reduced-motion path)
 */
/* ------------------------------------------------------------------ *
 * One requestAnimationFrame loop drives every canvas on the page.
 *
 * Each field used to own its own rAF; a page with twenty of them paid the
 * scheduling cost twenty times over and gave the browser no chance to skip
 * the ones that are off screen.
 * ------------------------------------------------------------------ */
type Ticker = (now: number) => void
const tickers = new Set<Ticker>()
let rafId = 0

function pump(now: number) {
  rafId = tickers.size ? requestAnimationFrame(pump) : 0
  for (const t of tickers) t(now)
}

function subscribe(t: Ticker) {
  tickers.add(t)
  if (!rafId) rafId = requestAnimationFrame(pump)
  return () => {
    tickers.delete(t)
    if (!tickers.size && rafId) {
      cancelAnimationFrame(rafId)
      rafId = 0
    }
  }
}

export function useCanvas<T extends HTMLCanvasElement>({
  setup,
  draw,
  still = false,
  // 1.5 is indistinguishable for soft particle sprites and costs ~45% fewer
  // pixels per frame than 2.
  maxDpr = 1.5,
  deps = [],
}: Options) {
  const ref = useRef<T | null>(null)
  const drawRef = useRef(draw)
  const setupRef = useRef(setup)
  drawRef.current = draw
  setupRef.current = setup

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let w = 0
    let h = 0
    let start = 0
    let prev = 0
    let frame = 0
    let visible = true
    let onScreen = true

    /**
     * Re-size the backing store to match the CSS box.
     * Returns true when something actually changed, so callers can avoid
     * needlessly regenerating particle state.
     */
    const fit = (force = false) => {
      const rect = canvas.getBoundingClientRect()
      const nw = Math.max(1, Math.round(rect.width))
      const nh = Math.max(1, Math.round(rect.height))
      if (!force && nw === w && nh === h) return false
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
      w = nw
      h = nh
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      setupRef.current?.({ ctx, w, h })
      return true
    }

    const renderOnce = () => {
      ctx.clearRect(0, 0, w, h)
      drawRef.current({ ctx, w, h, t: 0, dt: 0 })
    }

    const loop = (now: number) => {
      if (!visible || !onScreen) {
        prev = now
        return
      }
      // Cheap self-healing: re-measure occasionally in case a ResizeObserver
      // callback was missed (background tabs, late web fonts, layout settling).
      if (++frame % 30 === 0) fit()
      if (!start) start = now
      const t = (now - start) / 1000
      const dt = Math.min(0.05, prev ? (now - prev) / 1000 : 0.016)
      prev = now
      ctx.clearRect(0, 0, w, h)
      drawRef.current({ ctx, w, h, t, dt })
    }

    fit(true)

    const ro = new ResizeObserver(() => {
      if (fit() && still) renderOnce()
    })
    ro.observe(canvas)

    // Layout is often not final on the first effect tick — fonts, lazy
    // sections and `svh` units all settle a beat later.
    const settle = [
      requestAnimationFrame(() => {
        if (fit() && still) renderOnce()
      }),
    ]
    const settleTimer = window.setTimeout(() => {
      if (fit() && still) renderOnce()
    }, 400)

    const onResize = () => {
      if (fit() && still) renderOnce()
    }
    window.addEventListener('resize', onResize, { passive: true })

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
      },
      { rootMargin: '120px' },
    )
    io.observe(canvas)

    const onVisibility = () => {
      visible = !document.hidden
    }
    document.addEventListener('visibilitychange', onVisibility)

    let unsubscribe: (() => void) | undefined
    if (still) {
      renderOnce()
    } else {
      unsubscribe = subscribe(loop)
    }

    return () => {
      unsubscribe?.()
      settle.forEach(cancelAnimationFrame)
      window.clearTimeout(settleTimer)
      window.removeEventListener('resize', onResize)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [still, maxDpr, ...deps])

  return ref
}

/** Deterministic pseudo-random so layouts stay stable across renders. */
export function seeded(seed: number) {
  let s = seed >>> 0 || 1
  return () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return ((s >>> 0) % 100000) / 100000
  }
}

/** #rrggbb -> "r, g, b" for use inside rgba(). */
export function rgbTriplet(hex: string) {
  const h = hex.replace('#', '')
  const n =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h
  const v = parseInt(n, 16)
  return `${(v >> 16) & 255}, ${(v >> 8) & 255}, ${v & 255}`
}
