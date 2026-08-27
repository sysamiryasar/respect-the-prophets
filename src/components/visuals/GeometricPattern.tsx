import { useId, useMemo } from 'react'

/* ------------------------------------------------------------------ *
 * Geometry helpers
 *
 * The motifs below are built from the classic Islamic constructions —
 * the eight-pointed khatam (two squares on a shared circle), the
 * octagon-and-cross lattice, and a sixteen-fold rosette. They are
 * generated rather than hand-drawn so they stay crisp at any scale and
 * cost nothing to ship.
 * ------------------------------------------------------------------ */

function polygon(cx: number, cy: number, r: number, sides: number, rotation = 0) {
  const pts: string[] = []
  for (let i = 0; i < sides; i++) {
    const a = rotation + (i / sides) * Math.PI * 2
    pts.push(`${(cx + Math.cos(a) * r).toFixed(3)},${(cy + Math.sin(a) * r).toFixed(3)}`)
  }
  return pts.join(' ')
}

/** {n/k}-style star: alternates outer radius R and inner radius r. */
function starPath(cx: number, cy: number, R: number, r: number, points: number, rotation = 0) {
  const pts: string[] = []
  for (let i = 0; i < points * 2; i++) {
    const rad = i % 2 === 0 ? R : r
    const a = rotation + (i / (points * 2)) * Math.PI * 2
    pts.push(`${(cx + Math.cos(a) * rad).toFixed(3)},${(cy + Math.sin(a) * rad).toFixed(3)}`)
  }
  return `M${pts.join('L')}Z`
}

type Variant = 'khatam' | 'lattice' | 'weave'

interface PatternProps {
  variant?: Variant
  color?: string
  opacity?: number
  /** Tile size in px. Larger = grander. */
  scale?: number
  strokeWidth?: number
  className?: string
  /** Slow rotation of the whole field. */
  drift?: boolean
}

/**
 * A full-bleed tessellated pattern layer. One <pattern> definition,
 * one <rect> fill — the browser tiles it on the GPU.
 */
export function GeometricPattern({
  variant = 'khatam',
  color = '#d3ad68',
  opacity = 0.07,
  scale = 132,
  strokeWidth = 1,
  className = '',
  drift = false,
}: PatternProps) {
  const uid = useId().replace(/:/g, '')
  const id = `pat-${variant}-${uid}`

  const tile = useMemo(() => {
    const S = 100
    const c = S / 2

    if (variant === 'khatam') {
      const R = 46
      // Two squares sharing a circumcircle == the eight-pointed khatam.
      return (
        <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round">
          <polygon points={polygon(c, c, R, 4, Math.PI / 4)} />
          <polygon points={polygon(c, c, R, 4, 0)} />
          <polygon points={polygon(c, c, R * 0.52, 8, Math.PI / 8)} opacity={0.75} />
          <circle cx={c} cy={c} r={R * 0.16} opacity={0.6} />
          {/* quarter motifs at the tile corners so the tiling interlocks */}
          <polygon points={polygon(0, 0, R * 0.42, 4, Math.PI / 4)} opacity={0.5} />
          <polygon points={polygon(S, 0, R * 0.42, 4, Math.PI / 4)} opacity={0.5} />
          <polygon points={polygon(0, S, R * 0.42, 4, Math.PI / 4)} opacity={0.5} />
          <polygon points={polygon(S, S, R * 0.42, 4, Math.PI / 4)} opacity={0.5} />
        </g>
      )
    }

    if (variant === 'lattice') {
      // Octagon-and-cross: a regular octagon inscribed in the cell,
      // with the interstitial squares implied by the tiling.
      const k = (S * (1 - 1 / Math.SQRT2)) / 2
      const oct = `${k},0 ${S - k},0 ${S},${k} ${S},${S - k} ${S - k},${S} ${k},${S} 0,${S - k} 0,${k}`
      return (
        <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round">
          <polygon points={oct} />
          <polygon points={polygon(c, c, 22, 4, Math.PI / 4)} opacity={0.7} />
          <line x1={0} y1={0} x2={k} y2={k} opacity={0.45} />
          <line x1={S} y1={0} x2={S - k} y2={k} opacity={0.45} />
          <line x1={0} y1={S} x2={k} y2={S - k} opacity={0.45} />
          <line x1={S} y1={S} x2={S - k} y2={S - k} opacity={0.45} />
        </g>
      )
    }

    // 'weave' — interlaced ribbon lattice
    return (
      <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
        <path d={starPath(c, c, 40, 17, 6, -Math.PI / 2)} opacity={0.85} />
        <path d={starPath(0, c, 22, 9, 6, -Math.PI / 2)} opacity={0.5} />
        <path d={starPath(S, c, 22, 9, 6, -Math.PI / 2)} opacity={0.5} />
        <path d={starPath(c, 0, 22, 9, 6, -Math.PI / 2)} opacity={0.5} />
        <path d={starPath(c, S, 22, 9, 6, -Math.PI / 2)} opacity={0.5} />
      </g>
    )
  }, [variant, color, strokeWidth])

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${
        drift ? 'anim-spin-slow' : ''
      } ${className}`}
      style={{ opacity }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id={id} width={scale} height={scale} patternUnits="userSpaceOnUse" viewBox="0 0 100 100">
          {tile}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

/* ------------------------------------------------------------------ */

interface RosetteProps {
  className?: string
  color?: string
  /** 0–1: how much of the rosette has been drawn in. */
  progress?: number
  spin?: boolean
}

/**
 * A sixteen-fold rosette used as the hero's focal ornament and as the
 * hub of the Pillars wheel. Stroke-dash driven so it can "draw itself".
 */
export function Rosette({ className = '', color = '#d3ad68', progress = 1, spin = true }: RosetteProps) {
  const rings = useMemo(() => {
    const c = 200
    return {
      outerStar: starPath(c, c, 190, 150, 16, -Math.PI / 2),
      midStar: starPath(c, c, 148, 104, 12, -Math.PI / 2),
      innerStar: starPath(c, c, 96, 62, 8, -Math.PI / 8),
      core: starPath(c, c, 52, 34, 8, 0),
      petals: Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2 - Math.PI / 2
        const x1 = c + Math.cos(a) * 60
        const y1 = c + Math.sin(a) * 60
        const x2 = c + Math.cos(a) * 186
        const y2 = c + Math.sin(a) * 186
        return `M${x1.toFixed(2)},${y1.toFixed(2)}L${x2.toFixed(2)},${y2.toFixed(2)}`
      }),
    }
  }, [])

  const dash = 4000
  const offset = dash * (1 - Math.max(0, Math.min(1, progress)))

  return (
    <svg
      viewBox="0 0 400 400"
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
      fill="none"
      stroke={color}
    >
      <g className={spin ? 'anim-spin-slow' : ''} style={{ transformOrigin: '200px 200px' }}>
        <circle cx="200" cy="200" r="192" strokeWidth="0.7" opacity="0.35" />
        <path
          d={rings.outerStar}
          strokeWidth="0.9"
          opacity="0.55"
          strokeDasharray={dash}
          strokeDashoffset={offset}
        />
      </g>
      <g className={spin ? 'anim-spin-rev' : ''} style={{ transformOrigin: '200px 200px' }}>
        <path
          d={rings.midStar}
          strokeWidth="1"
          opacity="0.7"
          strokeDasharray={dash}
          strokeDashoffset={offset}
        />
        <circle cx="200" cy="200" r="120" strokeWidth="0.6" opacity="0.3" />
      </g>
      <g opacity="0.5">
        {rings.petals.map((d, i) => (
          <path key={i} d={d} strokeWidth="0.45" opacity={i % 2 ? 0.45 : 0.8} />
        ))}
      </g>
      <path
        d={rings.innerStar}
        strokeWidth="1.1"
        opacity="0.85"
        strokeDasharray={dash}
        strokeDashoffset={offset}
      />
      <path d={rings.core} strokeWidth="1" opacity="0.95" />
      <circle cx="200" cy="200" r="16" strokeWidth="0.8" opacity="0.6" />
    </svg>
  )
}

/** A slim divider: hairline rule interrupted by a small khatam. */
export function OrnamentDivider({ className = '', color = '#d3ad68' }: { className?: string; color?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
      <span
        className="h-px w-16 sm:w-28"
        style={{ background: `linear-gradient(90deg, transparent, ${color}66)` }}
      />
      <svg viewBox="0 0 40 40" className="h-4 w-4 shrink-0" fill="none" stroke={color} opacity={0.75}>
        <polygon points={polygon(20, 20, 15, 4, Math.PI / 4)} strokeWidth="1.4" />
        <polygon points={polygon(20, 20, 15, 4, 0)} strokeWidth="1.4" />
      </svg>
      <span
        className="h-px w-16 sm:w-28"
        style={{ background: `linear-gradient(270deg, transparent, ${color}66)` }}
      />
    </div>
  )
}
