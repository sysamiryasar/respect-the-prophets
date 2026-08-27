import { useMemo } from 'react'
import { useCanvas, rgbTriplet, seeded } from '../../lib/useCanvas'
import { useJourney } from '../../lib/journey'

export type Weather = 'stars' | 'rain' | 'sand' | 'dust' | 'embers' | 'motes'

interface Props {
  weather?: Weather
  /** Multiplier on the auto-computed particle count. */
  density?: number
  color?: string
  className?: string
  /** Overall opacity of the layer. */
  opacity?: number
  /** Parallax-ish speed multiplier. */
  speed?: number
}

interface P {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  a: number
  /** Per-particle phase for twinkle / sway. */
  p: number
  /** Length, used by rain. */
  l: number
}

/** Particles per 100k CSS px², tuned per variant so density feels even. */
const BASE_DENSITY: Record<Weather, number> = {
  stars: 16,
  rain: 12,
  sand: 20,
  dust: 10,
  embers: 7,
  motes: 8,
}

const MAX_PARTICLES = 420

/**
 * One canvas, six behaviours. Kept deliberately cheap:
 *  - no shadowBlur in the hot loop (it is the classic canvas frame-killer);
 *    glow comes from a pre-rendered radial sprite instead
 *  - integer-ish counts scaled to viewport area, halved on small screens
 *  - reduced-motion renders a single static frame
 */
export default function ParticleField({
  weather = 'stars',
  density = 1,
  color = '#e7cd9b',
  className = '',
  opacity = 1,
  speed = 1,
}: Props) {
  const { reduced, compact } = useJourney()
  const rgb = useMemo(() => rgbTriplet(color), [color])

  const state = useMemo(
    () => ({ parts: [] as P[], sprite: null as HTMLCanvasElement | null }),
    // rebuild when the look changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [weather, color, density, compact],
  )

  const ref = useCanvas<HTMLCanvasElement>({
    still: reduced,
    deps: [weather, color, density, compact, speed, opacity],
    setup: ({ w, h }) => {
      const rand = seeded(Math.round(w * 31 + h * 17 + weather.length * 7919))
      const area = (w * h) / 100_000
      const scale = compact ? 0.5 : 1
      const count = Math.min(
        MAX_PARTICLES,
        Math.max(8, Math.round(area * BASE_DENSITY[weather] * density * scale)),
      )

      const parts: P[] = []
      for (let i = 0; i < count; i++) {
        const rn = rand()
        switch (weather) {
          case 'stars':
            parts.push({
              x: rand() * w,
              y: rand() * h,
              vx: 0,
              vy: 0,
              r: 0.4 + rn * rn * 1.8,
              a: 0.25 + rand() * 0.75,
              p: rand() * Math.PI * 2,
              l: 0,
            })
            break
          case 'rain':
            parts.push({
              x: rand() * w,
              y: rand() * h,
              vx: -26 - rand() * 16,
              vy: 420 + rand() * 380,
              r: 0.5 + rand() * 0.8,
              a: 0.12 + rand() * 0.4,
              p: 0,
              l: 10 + rand() * 26,
            })
            break
          case 'sand':
            parts.push({
              x: rand() * w,
              y: rand() * h,
              vx: 22 + rand() * 68,
              vy: (rand() - 0.5) * 12,
              r: 0.35 + rand() * 1.1,
              a: 0.1 + rand() * 0.45,
              p: rand() * Math.PI * 2,
              l: 0,
            })
            break
          case 'dust':
            parts.push({
              x: rand() * w,
              y: rand() * h,
              vx: (rand() - 0.5) * 9,
              vy: -3 - rand() * 8,
              r: 0.5 + rand() * 1.7,
              a: 0.08 + rand() * 0.3,
              p: rand() * Math.PI * 2,
              l: 0,
            })
            break
          case 'embers':
            parts.push({
              x: rand() * w,
              y: h * (0.55 + rand() * 0.6),
              vx: (rand() - 0.5) * 14,
              vy: -18 - rand() * 46,
              r: 0.6 + rand() * 1.9,
              a: 0.25 + rand() * 0.6,
              p: rand() * Math.PI * 2,
              l: 0,
            })
            break
          case 'motes':
          default:
            parts.push({
              x: rand() * w,
              y: rand() * h,
              vx: (rand() - 0.5) * 6,
              vy: (rand() - 0.5) * 6,
              r: 0.4 + rand() * 1.4,
              a: 0.1 + rand() * 0.45,
              p: rand() * Math.PI * 2,
              l: 0,
            })
        }
      }
      state.parts = parts

      // Pre-rendered glow sprite — one radial gradient, reused thousands of times.
      const S = 32
      const sprite = document.createElement('canvas')
      sprite.width = S
      sprite.height = S
      const sctx = sprite.getContext('2d')
      if (sctx) {
        const g = sctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
        g.addColorStop(0, `rgba(${rgb}, 1)`)
        g.addColorStop(0.35, `rgba(${rgb}, 0.42)`)
        g.addColorStop(1, `rgba(${rgb}, 0)`)
        sctx.fillStyle = g
        sctx.fillRect(0, 0, S, S)
      }
      state.sprite = sprite
    },
    draw: ({ ctx, w, h, t, dt }) => {
      const parts = state.parts
      const sprite = state.sprite
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'lighter'

      const step = reduced ? 0 : dt * speed

      for (let i = 0; i < parts.length; i++) {
        const p = parts[i]

        if (weather === 'rain') {
          p.x += p.vx * step
          p.y += p.vy * step
          if (p.y > h + p.l) {
            p.y = -p.l
            p.x = Math.random() * (w + 120)
          }
          if (p.x < -60) p.x = w + 40
          ctx.globalAlpha = p.a * opacity
          ctx.strokeStyle = `rgba(${rgb}, 1)`
          ctx.lineWidth = p.r
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x - p.vx * 0.035, p.y - p.l)
          ctx.stroke()
          continue
        }

        switch (weather) {
          case 'stars': {
            // Stars do not translate; they breathe.
            const tw = 0.55 + 0.45 * Math.sin(t * 1.1 * speed + p.p)
            ctx.globalAlpha = p.a * tw * opacity
            break
          }
          case 'sand':
            p.x += p.vx * step
            p.y += (p.vy + Math.sin(t * 1.6 + p.p) * 9) * step
            if (p.x > w + 8) p.x = -8
            if (p.y > h + 8) p.y = -8
            if (p.y < -8) p.y = h + 8
            ctx.globalAlpha = p.a * opacity
            break
          case 'dust':
            p.x += (p.vx + Math.sin(t * 0.5 + p.p) * 5) * step
            p.y += p.vy * step
            if (p.y < -10) {
              p.y = h + 10
              p.x = Math.random() * w
            }
            if (p.x < -10) p.x = w + 10
            if (p.x > w + 10) p.x = -10
            ctx.globalAlpha = p.a * (0.6 + 0.4 * Math.sin(t * 0.9 + p.p)) * opacity
            break
          case 'embers': {
            p.x += (p.vx + Math.sin(t * 1.9 + p.p) * 11) * step
            p.y += p.vy * step
            const life = 1 - Math.max(0, (h * 0.62 - p.y) / (h * 0.72))
            if (p.y < -12) {
              p.y = h * (0.75 + Math.random() * 0.35)
              p.x = Math.random() * w
            }
            ctx.globalAlpha = p.a * Math.max(0, life) * opacity
            break
          }
          default:
            p.x += (p.vx + Math.sin(t * 0.4 + p.p) * 4) * step
            p.y += (p.vy + Math.cos(t * 0.33 + p.p) * 4) * step
            if (p.x < -12) p.x = w + 12
            if (p.x > w + 12) p.x = -12
            if (p.y < -12) p.y = h + 12
            if (p.y > h + 12) p.y = -12
            ctx.globalAlpha = p.a * (0.55 + 0.45 * Math.sin(t * 0.8 + p.p)) * opacity
        }

        if (sprite) {
          const d = p.r * 7
          ctx.drawImage(sprite, p.x - d / 2, p.y - d / 2, d, d)
        }
      }

      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
    },
  })

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  )
}
