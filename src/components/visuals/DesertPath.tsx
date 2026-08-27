import { memo, useId } from 'react'

const W = 1200
const H = 675

/**
 * A desert road running to the horizon, with the sense of moving forward.
 *
 * `progress` (0–1) advances the ground markers toward the viewer and lifts the
 * light at the vanishing point, so scrolling reads as travelling rather than
 * as a background sliding past. Landscape only — no figures.
 */
function DesertPathImpl({
  progress = 0,
  accent = '#d3ad68',
  /** Vanishing point, as a fraction of the height. */
  horizon = 0.46,
}: {
  progress?: number
  accent?: string
  horizon?: number
}) {
  const u = useId().replace(/:/g, '')
  const hy = H * horizon
  const t = Math.max(0, Math.min(1, progress))

  // Ground markers cycle toward the camera; each has its own phase.
  const MARKERS = 9
  const markers = Array.from({ length: MARKERS }, (_, i) => {
    const k = ((i / MARKERS + t * 1.6) % 1) ** 2.2 // ease so far ones bunch up
    const y = hy + 14 + k * (H - hy - 14)
    const halfNear = 300
    const halfFar = 8
    const half = halfFar + (halfNear - halfFar) * k
    return { y, half, o: Math.min(1, k * 2.4) }
  })

  const ridge = (y: number, amp: number, phase: number) => {
    const f = (x: number) =>
      y + Math.sin((x / W) * Math.PI * 2 + phase) * amp + Math.sin((x / W) * Math.PI * 5 + phase) * amp * 0.4
    let d = `M0,${f(0).toFixed(1)}`
    for (let x = 60; x <= W; x += 60) d += ` L${x},${f(x).toFixed(1)}`
    return `${d} L${W},${H} L0,${H} Z`
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <defs>
        <linearGradient id={`sky${u}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#03050a" />
          <stop offset="70%" stopColor="#081020" />
          <stop offset="100%" stopColor="#0d1424" />
        </linearGradient>
        <radialGradient id={`glow${u}`} cx="0.5" cy={String(horizon)} r="0.42">
          <stop offset="0%" stopColor={accent} stopOpacity={0.55 + t * 0.3} />
          <stop offset="35%" stopColor={accent} stopOpacity={0.18 + t * 0.12} />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`road${u}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity={0.24} />
          <stop offset="45%" stopColor={accent} stopOpacity={0.09} />
          <stop offset="100%" stopColor={accent} stopOpacity={0.02} />
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill={`url(#sky${u})`} />

      {/* stars, thinning toward the horizon glow */}
      <g fill="#f6e5bf">
        {Array.from({ length: 90 }, (_, i) => {
          let s = (i * 9301 + 49297) % 233280
          const r1 = s / 233280
          s = (s * 9301 + 49297) % 233280
          const r2 = s / 233280
          s = (s * 9301 + 49297) % 233280
          const r3 = s / 233280
          const y = r2 * hy * 0.92
          return (
            <circle
              key={i}
              cx={r1 * W}
              cy={y}
              r={0.6 + r3 * 1.7}
              opacity={(0.2 + r3 * 0.6) * (1 - (y / hy) * 0.55) * (1 - t * 0.35)}
            />
          )
        })}
      </g>

      {/* light at the vanishing point */}
      <rect width={W} height={H} fill={`url(#glow${u})`} />

      {/* light rays fanning up from the horizon */}
      <g opacity={0.06 + t * 0.07} style={{ mixBlendMode: 'screen' }}>
        {Array.from({ length: 7 }, (_, i) => {
          const dx = (i - 3) * 120
          return (
            <path
              key={i}
              d={`M${600 - 10},${hy} L${600 + 10},${hy} L${600 + dx + 70},${hy - 320} L${600 + dx - 70},${hy - 320} Z`}
              fill="#f6e5bf"
              opacity={1 - Math.abs(i - 3) / 4}
            />
          )
        })}
      </g>

      {/* distant mountains */}
      <path
        d={`M0,${hy} L120,${hy - 66} L240,${hy - 22} L360,${hy - 92} L470,${hy - 30} L560,${hy} Z`}
        fill="#060b14"
      />
      <path
        d={`M640,${hy} L740,${hy - 44} L860,${hy - 86} L980,${hy - 34} L1090,${hy - 72} L1200,${hy} Z`}
        fill="#060b14"
      />

      {/* the road, receding */}
      <path
        d={`M600,${hy} L${600 + 300},${H} L${600 - 300},${H} Z`}
        fill={`url(#road${u})`}
      />
      <path d={`M600,${hy} L${600 - 300},${H}`} stroke={accent} strokeOpacity="0.22" strokeWidth="2" fill="none" />
      <path d={`M600,${hy} L${600 + 300},${H}`} stroke={accent} strokeOpacity="0.22" strokeWidth="2" fill="none" />

      {/* ground markers travelling toward the viewer */}
      <g>
        {markers.map((m, i) => (
          <line
            key={i}
            x1={600 - m.half}
            y1={m.y}
            x2={600 + m.half}
            y2={m.y}
            stroke={accent}
            strokeOpacity={0.16 * m.o}
            strokeWidth={1 + m.o * 2.5}
          />
        ))}
      </g>

      {/* dunes flanking the road */}
      <path d={ridge(hy + 26, 16, 0.6)} fill="#0a0d12" opacity="0.96" />
      <path d={ridge(hy + 96, 26, 2.4)} fill="#070910" />
      <path d={ridge(hy + 210, 30, 4.1)} fill="#04060b" />

      {/* the road is cut back in over the dunes so it stays readable */}
      <path
        d={`M600,${hy} L${600 + 300},${H} L${600 - 300},${H} Z`}
        fill={`url(#road${u})`}
        opacity="0.75"
      />

      {/* foreground vignette */}
      <rect
        width={W}
        height={H}
        fill="url(#none)"
        style={{ pointerEvents: 'none' }}
      />
    </svg>
  )
}

export default memo(DesertPathImpl)
