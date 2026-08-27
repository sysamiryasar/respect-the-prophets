import { useId, memo } from 'react'
import type { ArtKey } from '../../data/prophets'

/* ================================================================== *
 * SYMBOLIC SCENE ARTWORK
 *
 * Hard rule for this entire file: nothing here draws a face, a body,
 * a head, a silhouette of a person, or anything intended to represent
 * a Prophet. The visual language is strictly:
 *
 *   landscape · architecture · objects · light · shadow · abstraction
 *
 * Everything is generated SVG — no photography, no stock imagery, and
 * no human figures of any kind.
 * ================================================================== */

const VB = { w: 1200, h: 675 }

interface ArtProps {
  /** 0 → 1 as the scene moves through the viewport. Drives the "reveal". */
  progress: number
  accent: string
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * Math.max(0, Math.min(1, t))

/** A soft rolling dune / hill silhouette. */
function ridgePath(y: number, amp: number, phase = 0) {
  const p = (x: number) =>
    y + Math.sin((x / VB.w) * Math.PI * 2 + phase) * amp + Math.sin((x / VB.w) * Math.PI * 5 + phase) * amp * 0.35
  const pts: string[] = [`M0,${p(0).toFixed(1)}`]
  for (let x = 60; x <= VB.w; x += 60) pts.push(`L${x},${p(x).toFixed(1)}`)
  pts.push(`L${VB.w},${VB.h}`, `L0,${VB.h}`, 'Z')
  return pts.join(' ')
}

/** A wave crest band. */
function wavePath(y: number, amp: number, phase: number, freq = 3) {
  const pts: string[] = [`M0,${(y + Math.sin(phase) * amp).toFixed(1)}`]
  for (let x = 40; x <= VB.w; x += 40) {
    pts.push(`L${x},${(y + Math.sin((x / VB.w) * Math.PI * freq * 2 + phase) * amp).toFixed(1)}`)
  }
  pts.push(`L${VB.w},${VB.h}`, `L0,${VB.h}`, 'Z')
  return pts.join(' ')
}

/** A pointed Islamic arch, as a closed path. */
function archPath(x: number, y: number, w: number, h: number) {
  const half = w / 2
  const springLine = y - h * 0.55
  return [
    `M${x - half},${y}`,
    `L${x - half},${springLine}`,
    `Q${x - half},${springLine - h * 0.28} ${x},${y - h}`,
    `Q${x + half},${springLine - h * 0.28} ${x + half},${springLine}`,
    `L${x + half},${y}`,
    'Z',
  ].join(' ')
}

/* ------------------------------------------------------------------ */
/*  Shared atmospheric primitives                                      */
/* ------------------------------------------------------------------ */

function Sky({ id, top, bottom }: { id: string; top: string; bottom: string }) {
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={top} />
          <stop offset="100%" stopColor={bottom} />
        </linearGradient>
      </defs>
      <rect width={VB.w} height={VB.h} fill={`url(#${id})`} />
    </>
  )
}

function Glow({
  id,
  cx,
  cy,
  r,
  color,
  strength = 0.55,
}: {
  id: string
  cx: number
  cy: number
  r: number
  color: string
  strength?: number
}) {
  return (
    <>
      <defs>
        <radialGradient id={id}>
          <stop offset="0%" stopColor={color} stopOpacity={strength} />
          <stop offset="45%" stopColor={color} stopOpacity={strength * 0.28} />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} />
    </>
  )
}

function LightShafts({ x, y, count = 7, spread = 520, length = 620, color = '#f6e5bf', opacity = 0.1 }: {
  x: number
  y: number
  count?: number
  spread?: number
  length?: number
  color?: string
  opacity?: number
}) {
  return (
    <g opacity={opacity} style={{ mixBlendMode: 'screen' }}>
      {Array.from({ length: count }, (_, i) => {
        const t = count === 1 ? 0.5 : i / (count - 1)
        const dx = (t - 0.5) * spread
        const w = 12 + Math.abs(dx) * 0.06
        return (
          <path
            key={i}
            d={`M${x - w / 2},${y} L${x + w / 2},${y} L${x + dx + w * 3},${y + length} L${x + dx - w * 3},${y + length} Z`}
            fill={color}
            opacity={0.35 + 0.65 * (1 - Math.abs(t - 0.5) * 2)}
          />
        )
      })}
    </g>
  )
}

function StarPoints({ seed = 1, count = 70, maxY = 420 }: { seed?: number; count?: number; maxY?: number }) {
  let s = seed * 9301
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  return (
    <g fill="#f6e5bf">
      {Array.from({ length: count }, (_, i) => {
        const x = rnd() * VB.w
        const y = rnd() * maxY
        const r = 0.6 + rnd() * 1.6
        return <circle key={i} cx={x} cy={y} r={r} opacity={0.2 + rnd() * 0.65} />
      })}
    </g>
  )
}

/* ================================================================== */
/*  Scene 1 — Adam (AS): forming earth, first light, an abstract garden */
/* ================================================================== */

function AdamArt({ progress, accent }: ArtProps) {
  const u = useId().replace(/:/g, '')
  const grow = lerp(0.65, 1, progress)
  const dawn = lerp(0, 1, progress)

  return (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <Sky id={`sky${u}`} top="#03050a" bottom="#071a19" />
      <StarPoints seed={3} count={90} maxY={520} />
      <Glow id={`g1${u}`} cx={600} cy={640} r={520} color={accent} strength={0.24 + dawn * 0.22} />

      {/* the earth, forming */}
      <g transform={`translate(600 660) scale(${grow.toFixed(3)})`}>
        <defs>
          <radialGradient id={`earth${u}`} cx="0.4" cy="0.25">
            <stop offset="0%" stopColor={accent} stopOpacity="0.5" />
            <stop offset="55%" stopColor="#0b2a2a" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#04100f" stopOpacity="1" />
          </radialGradient>
        </defs>
        <circle cx="0" cy="0" r="330" fill={`url(#earth${u})`} />
        <circle cx="0" cy="0" r="330" fill="none" stroke={accent} strokeOpacity="0.35" strokeWidth="1.5" />
        {/* latitude arcs — abstract, not cartographic */}
        {[0.35, 0.55, 0.75, 0.92].map((k, i) => (
          <ellipse
            key={i}
            cx="0"
            cy={-330 * (1 - k) * 0.5}
            rx={330 * k}
            ry={330 * k * 0.16}
            fill="none"
            stroke={accent}
            strokeOpacity={0.12}
            strokeWidth="1"
          />
        ))}
      </g>

      {/* first light from above */}
      <LightShafts x={600} y={-40} count={9} spread={720} length={620} color="#f6e5bf" opacity={0.05 + dawn * 0.09} />

      {/* an abstract garden: arches of foliage, no figures */}
      <g opacity={0.5 + dawn * 0.3}>
        {[180, 400, 800, 1020].map((x, i) => (
          <g key={x} opacity={0.5 - i * 0.06}>
            <path
              d={`M${x},${VB.h} Q${x - 40},${520 - i * 18} ${x - 6},${430 - i * 24}`}
              stroke={accent}
              strokeOpacity="0.4"
              strokeWidth="2"
              fill="none"
            />
            {Array.from({ length: 6 }, (_, k) => {
              const y = 460 - k * 28 - i * 12
              const s = 26 - k * 2.5
              return (
                <path
                  key={k}
                  d={`M${x - 6},${y} q${-s},${-s * 0.5} ${-s * 1.4},${-s * 0.1} q${s * 0.5},${s * 0.6} ${s * 1.4},${s * 0.1} Z`}
                  fill={accent}
                  opacity="0.16"
                />
              )
            })}
          </g>
        ))}
      </g>

      {/* falling leaves */}
      <g opacity={0.35}>
        {Array.from({ length: 14 }, (_, i) => {
          const x = 90 + ((i * 137) % 1020)
          const y = 120 + ((i * 211) % 420)
          return (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx="7"
              ry="3"
              fill={accent}
              opacity={0.25 + (i % 5) * 0.08}
              transform={`rotate(${(i * 47) % 180} ${x} ${y})`}
            />
          )
        })}
      </g>
      <rect width={VB.w} height={VB.h} fill="url(#none)" />
    </svg>
  )
}

/* ================================================================== */
/*  Scene 2 — Nuh (AS): storm, flood, the ark                          */
/* ================================================================== */

function NuhArt({ progress, accent }: ArtProps) {
  const u = useId().replace(/:/g, '')
  const rise = lerp(0, 90, progress)

  return (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <Sky id={`sky${u}`} top="#04080f" bottom="#0a1b2c" />

      {/* storm clouds */}
      <g>
        <defs>
          <radialGradient id={`cloud${u}`}>
            <stop offset="0%" stopColor="#1b2c40" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0a1421" stopOpacity="0" />
          </radialGradient>
        </defs>
        {[
          [180, 120, 300, 130],
          [520, 70, 380, 150],
          [900, 130, 340, 140],
          [1120, 60, 260, 110],
          [340, 40, 260, 100],
        ].map(([cx, cy, rx, ry], i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#cloud${u})`} />
        ))}
      </g>

      {/* a break of light through the storm */}
      <LightShafts x={620} y={80} count={5} spread={340} length={460} color={accent} opacity={0.07 + progress * 0.05} />

      {/* the ark — hull, mast, spar. Deliberately distant and empty of figures. */}
      <g transform={`translate(0 ${(-rise * 0.5).toFixed(1)})`} opacity="0.92">
        <g transform="translate(770 392) scale(0.95)">
          <path
            d="M-150,0 L150,0 L118,54 Q0,86 -118,54 Z"
            fill="#0b1420"
            stroke={accent}
            strokeOpacity="0.55"
            strokeWidth="2"
          />
          <path d="M-150,0 L150,0" stroke={accent} strokeOpacity="0.3" strokeWidth="1" />
          <rect x="-58" y="-40" width="116" height="40" fill="#0b1420" stroke={accent} strokeOpacity="0.4" strokeWidth="1.6" />
          <path d="M-58,-40 L0,-64 L58,-40 Z" fill="#0b1420" stroke={accent} strokeOpacity="0.4" strokeWidth="1.6" />
          <line x1="0" y1="-64" x2="0" y2="-190" stroke={accent} strokeOpacity="0.5" strokeWidth="3" />
          <line x1="-56" y1="-150" x2="56" y2="-150" stroke={accent} strokeOpacity="0.35" strokeWidth="2" />
          {/* windows as light, not as figures */}
          {[-34, -10, 14, 38].map((x) => (
            <rect key={x} x={x} y="-30" width="10" height="12" fill={accent} opacity="0.5" />
          ))}
        </g>
      </g>

      {/* rising water — layered wave bands */}
      <g>
        <defs>
          <linearGradient id={`w1${u}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#123a55" />
            <stop offset="100%" stopColor="#04101c" />
          </linearGradient>
          <linearGradient id={`w2${u}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d2c44" />
            <stop offset="100%" stopColor="#04101c" />
          </linearGradient>
        </defs>
        <path d={wavePath(430 - rise, 16, 0.6, 2)} fill={`url(#w2${u})`} opacity="0.85" />
        <path d={wavePath(470 - rise, 22, 2.1, 3)} fill={`url(#w1${u})`} opacity="0.92" />
        <path d={wavePath(524 - rise, 28, 4.0, 2.4)} fill="#061520" />
        <path d={wavePath(590 - rise, 20, 1.2, 4)} fill="#030c14" />
        {/* crest highlights */}
        {[430, 470, 524].map((y, i) => (
          <path
            key={y}
            d={wavePath(y - rise, [16, 22, 28][i], [0.6, 2.1, 4.0][i], [2, 3, 2.4][i]).replace(
              /L1200,675 L0,675 Z/,
              '',
            )}
            fill="none"
            stroke={accent}
            strokeOpacity={0.22 - i * 0.05}
            strokeWidth="1.4"
          />
        ))}
      </g>
    </svg>
  )
}

/* ================================================================== */
/*  Scene 3 — Ibrahim (AS): night sky, broken idols, fire become light */
/* ================================================================== */

function IbrahimArt({ progress, accent }: ArtProps) {
  const u = useId().replace(/:/g, '')
  // Fire dominates early, then cools into light.
  const cool = Math.max(0, Math.min(1, (progress - 0.45) / 0.5))
  const fireColor = cool > 0.5 ? '#8fd6e8' : accent
  const moonX = lerp(220, 940, progress)

  return (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <Sky id={`sky${u}`} top="#050510" bottom={cool > 0.5 ? '#0a1c26' : '#1a0d08'} />
      <StarPoints seed={7} count={110} maxY={460} />

      {/* the moon, crossing the sky.
          The inner arc needs a LARGER radius than the outer and the same
          sweep, or SVG scales it up to fit the chord and you get a full
          disc instead of a crescent. */}
      <g transform={`translate(${moonX.toFixed(1)} ${lerp(150, 96, progress).toFixed(1)})`}>
        <circle cx="0" cy="0" r="34" fill="#f6e5bf" opacity="0.07" />
        <path d="M0,-30 A30,30 0 1,0 0,30 A40,40 0 0,0 0,-30 Z" fill="#f6e5bf" opacity="0.9" />
      </g>

      {/* desert dunes */}
      <path d={ridgePath(520, 26, 0.4)} fill="#160d08" />
      <path d={ridgePath(576, 20, 2.6)} fill="#0d0705" />

      {/* broken idols: toppled plinths and columns. No faces, no figures. */}
      <g opacity={lerp(0.9, 0.35, cool)}>
        {[
          { x: 235, h: 120, tilt: -16 },
          { x: 340, h: 76, tilt: 8 },
          { x: 900, h: 104, tilt: 21 },
          { x: 1000, h: 62, tilt: -9 },
        ].map(({ x, h, tilt }) => (
          <g key={x} transform={`translate(${x} 540) rotate(${tilt})`}>
            <rect x="-26" y={-h} width="52" height={h} fill="#080505" stroke={accent} strokeOpacity="0.28" strokeWidth="1.4" />
            <rect x="-36" y="-6" width="72" height="14" fill="#080505" stroke={accent} strokeOpacity="0.24" strokeWidth="1.4" />
            {/* fracture line */}
            <path d={`M-26,${-h * 0.55} L6,${-h * 0.5} L-14,${-h * 0.42} L26,${-h * 0.36}`} stroke={accent} strokeOpacity="0.4" strokeWidth="1.2" fill="none" />
          </g>
        ))}
        {/* rubble */}
        {[280, 312, 372, 866, 940, 1046].map((x, i) => (
          <rect key={x} x={x} y={534 - (i % 3) * 4} width={16 + (i % 4) * 6} height="10" fill="#0a0606" stroke={accent} strokeOpacity="0.18" />
        ))}
      </g>

      {/* the fire — a wall of flame that becomes cool light */}
      <g>
        <defs>
          <linearGradient id={`fire${u}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={fireColor} stopOpacity={lerp(0.85, 0.5, cool)} />
            <stop offset="55%" stopColor={cool > 0.5 ? '#bfe8f2' : '#f0a860'} stopOpacity={lerp(0.5, 0.3, cool)} />
            <stop offset="100%" stopColor={cool > 0.5 ? '#e8f6ff' : '#f6e5bf'} stopOpacity="0" />
          </linearGradient>
        </defs>
        <Glow id={`fg${u}`} cx={600} cy={520} r={lerp(300, 420, progress)} color={fireColor} strength={0.4} />
        <g transform="translate(600 546)">
          {/* Three layers — a broad body, mid tongues, and a hot core — each
              built from cubic curves that lean and curl, so the fire reads as
              flame rather than as a row of spikes. */}
          {[
            { n: 9, spread: 250, base: 230, hMin: 0.55, w: 96, o: 0.32, lean: 34 },
            { n: 13, spread: 236, base: 270, hMin: 0.5, w: 62, o: 0.42, lean: -26 },
            { n: 7, spread: 150, base: 190, hMin: 0.6, w: 44, o: 0.6, lean: 18 },
          ].map((layer, li) =>
            Array.from({ length: layer.n }, (_, i) => {
              const t = layer.n === 1 ? 0 : (i - (layer.n - 1) / 2) / ((layer.n - 1) / 2)
              const x = t * layer.spread
              // taller in the middle, with a stable per-flame wobble
              const wob = 0.5 + 0.5 * Math.abs(Math.sin(i * 2.3 + li * 1.7))
              const h = layer.base * (layer.hMin + (1 - layer.hMin) * (1 - Math.abs(t) * 0.75)) * (0.7 + 0.3 * wob)
              const w = layer.w * (0.55 + 0.45 * (1 - Math.abs(t) * 0.6))
              // the tip leans away from centre, like real flame licks
              const lean = layer.lean * t + (i % 2 ? 9 : -9)
              const d = [
                `M${(-w / 2).toFixed(1)},0`,
                // left edge: out, pinch in, then curl to the tip
                `C${(-w * 0.62).toFixed(1)},${(-h * 0.3).toFixed(1)}`,
                `${(-w * 0.2 + lean * 0.35).toFixed(1)},${(-h * 0.66).toFixed(1)}`,
                `${lean.toFixed(1)},${(-h).toFixed(1)}`,
                // right edge back down
                `C${(w * 0.24 + lean * 0.35).toFixed(1)},${(-h * 0.64).toFixed(1)}`,
                `${(w * 0.62).toFixed(1)},${(-h * 0.32).toFixed(1)}`,
                `${(w / 2).toFixed(1)},0`,
                'Z',
              ].join(' ')
              return (
                <path
                  key={`${li}-${i}`}
                  d={d}
                  transform={`translate(${x.toFixed(1)} 0)`}
                  fill={`url(#fire${u})`}
                  opacity={layer.o * (0.7 + 0.3 * wob)}
                />
              )
            }),
          )}
        </g>
        {/* the cool light that replaces it */}
        <LightShafts x={600} y={210} count={7} spread={420} length={340} color="#e8f6ff" opacity={cool * 0.16} />
      </g>
    </svg>
  )
}

/* ================================================================== */
/*  Scene 4 — Musa (AS): the staff, the desert, the parted sea         */
/* ================================================================== */

function MusaArt({ progress, accent }: ArtProps) {
  const u = useId().replace(/:/g, '')
  // The sea opens as the scene advances.
  const open = Math.max(0, Math.min(1, (progress - 0.25) / 0.6))
  const gap = lerp(0, 300, open)
  const leftEdge = 600 - gap / 2
  const rightEdge = 600 + gap / 2
  const wallTop = lerp(560, 150, open)

  const wallFace = (side: 'l' | 'r') => {
    const inner = side === 'l' ? leftEdge : rightEdge
    const outer = side === 'l' ? -40 : VB.w + 40
    const pts: string[] = [`M${outer},${VB.h}`, `L${outer},420`]
    // crest
    const steps = 8
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const x = lerp(outer, inner, t)
      const y = lerp(420, wallTop, t * t) + Math.sin(t * 9 + (side === 'l' ? 0 : 1.7)) * 12 * t
      pts.push(`L${x.toFixed(1)},${y.toFixed(1)}`)
    }
    pts.push(`L${inner},${VB.h}`, 'Z')
    return pts.join(' ')
  }

  return (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <Sky id={`sky${u}`} top="#02060c" bottom="#04202c" />
      <StarPoints seed={11} count={80} maxY={340} />

      {/* mountain and the light in the valley */}
      <g opacity={lerp(0.9, 0.35, open)}>
        <path d="M0,430 L180,270 L300,352 L420,214 L560,430 Z" fill="#07161c" stroke={accent} strokeOpacity="0.2" />
        <path d="M700,430 L840,268 L960,340 L1090,236 L1200,430 Z" fill="#07161c" stroke={accent} strokeOpacity="0.14" />
      </g>
      <Glow id={`vg${u}`} cx={420} cy={228} r={lerp(150, 60, open)} color="#f6e5bf" strength={lerp(0.55, 0.15, open)} />

      {/* dry seabed corridor, receding to the horizon */}
      <g opacity={open}>
        <defs>
          <linearGradient id={`bed${u}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#123a42" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1c1508" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path
          d={`M${leftEdge},${VB.h} L${lerp(leftEdge, 580, 0.82).toFixed(1)},${wallTop + 40} L${lerp(rightEdge, 620, 0.82).toFixed(1)},${wallTop + 40} L${rightEdge},${VB.h} Z`}
          fill={`url(#bed${u})`}
        />
        {/* ripples on the seabed */}
        {Array.from({ length: 7 }, (_, i) => {
          const t = i / 7
          const y = lerp(VB.h, wallTop + 46, t)
          const l = lerp(leftEdge, 584, t * 0.85)
          const r = lerp(rightEdge, 616, t * 0.85)
          return <line key={i} x1={l} y1={y} x2={r} y2={y} stroke={accent} strokeOpacity={0.14 * (1 - t)} strokeWidth="2" />
        })}
        <Glow id={`hz${u}`} cx={600} cy={wallTop + 30} r={220} color={accent} strength={0.4} />
      </g>

      {/* the two towering walls of water */}
      <g>
        <defs>
          <linearGradient id={`wall${u}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1d6d80" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#0d3a48" />
            <stop offset="100%" stopColor="#03151c" />
          </linearGradient>
        </defs>
        <path d={wallFace('l')} fill={`url(#wall${u})`} />
        <path d={wallFace('r')} fill={`url(#wall${u})`} />
        {/* inner faces catch the light */}
        <path d={wallFace('l')} fill="none" stroke={accent} strokeOpacity="0.45" strokeWidth="2" />
        <path d={wallFace('r')} fill="none" stroke={accent} strokeOpacity="0.45" strokeWidth="2" />
        {/* streaming water texture */}
        <g opacity={0.28 * open}>
          {Array.from({ length: 16 }, (_, i) => {
            const t = i / 15
            const xl = lerp(0, leftEdge, t)
            const xr = lerp(VB.w, rightEdge, t)
            return (
              <g key={i}>
                <line x1={xl} y1={VB.h} x2={xl} y2={lerp(420, wallTop, t * t) + 20} stroke={accent} strokeWidth="1" />
                <line x1={xr} y1={VB.h} x2={xr} y2={lerp(420, wallTop, t * t) + 20} stroke={accent} strokeWidth="1" />
              </g>
            )
          })}
        </g>
      </g>

      {/* the staff — an object, planted in the sand at the left */}
      <g transform="translate(170 620)" opacity={lerp(0.95, 0.5, open)}>
        <line x1="0" y1="0" x2="-14" y2="-240" stroke="#c9a06a" strokeWidth="7" strokeLinecap="round" />
        <line x1="0" y1="0" x2="-14" y2="-240" stroke={accent} strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
        <path d="M-14,-240 q-22,-16 -6,-40 q26,10 6,40 Z" fill="#c9a06a" opacity="0.9" />
        <ellipse cx="2" cy="2" rx="24" ry="7" fill="#000" opacity="0.45" />
        <Glow id={`sg${u}`} cx={-14} cy={-250} r={90} color={accent} strength={0.35 + open * 0.3} />
      </g>

      {/* foreground sand */}
      <path d={ridgePath(636, 12, 1.4)} fill="#120d06" />
    </svg>
  )
}

/* ================================================================== */
/*  Scene 5 — Yusuf (AS): the well, the bars, the palace, the stars    */
/* ================================================================== */

function YusufArt({ progress, accent }: ArtProps) {
  const u = useId().replace(/:/g, '')
  const stage = progress * 3 // 0 well → 1 prison → 2 palace → 3 stars
  const wellA = Math.max(0, 1 - Math.abs(stage - 0.15) / 1.05)
  const prisonA = Math.max(0, 1 - Math.abs(stage - 1.25) / 0.9)
  const palaceA = Math.max(0, 1 - Math.abs(stage - 2.2) / 0.95)
  const starsA = Math.max(0, Math.min(1, (stage - 2.1) / 0.8))

  return (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <Sky id={`sky${u}`} top="#050410" bottom="#120c22" />

      {/* ── the well: looking up from the bottom ── */}
      <g opacity={wellA}>
        <rect width={VB.w} height={VB.h} fill="#04030a" />
        <defs>
          <radialGradient id={`shaft${u}`} cx="0.5" cy="0.24" r="0.55">
            <stop offset="0%" stopColor="#f6e5bf" stopOpacity="0.85" />
            <stop offset="40%" stopColor={accent} stopOpacity="0.2" />
            <stop offset="100%" stopColor="#04030a" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* stone courses of the shaft, in perspective */}
        {Array.from({ length: 9 }, (_, i) => {
          const t = i / 8
          const inset = lerp(0, 430, t)
          return (
            <rect
              key={i}
              x={inset}
              y={lerp(0, 150, t)}
              width={VB.w - inset * 2}
              height={lerp(VB.h, 130, t)}
              fill="none"
              stroke={accent}
              strokeOpacity={0.06 + t * 0.12}
              strokeWidth="2"
              rx="8"
            />
          )
        })}
        <ellipse cx="600" cy="158" rx="132" ry="60" fill={`url(#shaft${u})`} />
        <ellipse cx="600" cy="158" rx="132" ry="60" fill="none" stroke="#f6e5bf" strokeOpacity="0.55" strokeWidth="2" />
        <LightShafts x={600} y={168} count={5} spread={300} length={520} color="#f6e5bf" opacity={0.14} />
      </g>

      {/* ── prison bars ── */}
      <g opacity={prisonA}>
        <rect width={VB.w} height={VB.h} fill="#07060c" />
        <Glow id={`pg${u}`} cx={600} cy={300} r={420} color={accent} strength={0.16} />
        <g>
          {Array.from({ length: 9 }, (_, i) => {
            const x = 200 + i * 100
            return <rect key={x} x={x} y="60" width="15" height="560" fill="#0d0b12" stroke={accent} strokeOpacity="0.35" strokeWidth="1.5" rx="6" />
          })}
          <rect x="180" y="120" width="850" height="14" fill="#0d0b12" stroke={accent} strokeOpacity="0.3" strokeWidth="1.5" rx="5" />
          <rect x="180" y="520" width="850" height="14" fill="#0d0b12" stroke={accent} strokeOpacity="0.3" strokeWidth="1.5" rx="5" />
        </g>
        {/* a single window of light behind the bars */}
        <path d={archPath(600, 500, 210, 330)} fill="#1a1428" opacity="0.9" />
        <path d={archPath(600, 500, 210, 330)} fill="none" stroke={accent} strokeOpacity="0.4" strokeWidth="2" />
      </g>

      {/* ── palace architecture ── */}
      <g opacity={palaceA}>
        <defs>
          <linearGradient id={`pal${u}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#241a3a" />
            <stop offset="100%" stopColor="#0a0714" />
          </linearGradient>
        </defs>
        <rect width={VB.w} height={VB.h} fill={`url(#pal${u})`} />
        <Glow id={`plg${u}`} cx={600} cy={430} r={480} color={accent} strength={0.22} />
        {/* colonnade */}
        {[
          [600, 250, 430],
          [330, 190, 340],
          [870, 190, 340],
          [110, 150, 270],
          [1090, 150, 270],
        ].map(([x, w, h], i) => (
          <g key={i}>
            <path d={archPath(x, 620, w, h)} fill="#090613" stroke={accent} strokeOpacity={0.45 - i * 0.05} strokeWidth="2.2" />
            <path d={archPath(x, 620, w * 0.68, h * 0.8)} fill="none" stroke={accent} strokeOpacity={0.2} strokeWidth="1.2" />
          </g>
        ))}
        {/* floor reflection */}
        <rect y="620" width={VB.w} height="55" fill={accent} opacity="0.07" />
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1={i * 100} y1="620" x2={i * 100 - 40} y2={VB.h} stroke={accent} strokeOpacity="0.08" />
        ))}
      </g>

      {/* ── eleven stars ── */}
      <g opacity={starsA}>
        <Glow id={`stg${u}`} cx={600} cy={300} r={520} color={accent} strength={0.22} />
        {Array.from({ length: 11 }, (_, i) => {
          const a = (i / 11) * Math.PI * 2 - Math.PI / 2
          const R = 210
          const x = 600 + Math.cos(a) * R
          const y = 300 + Math.sin(a) * R * 0.68
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="4.5" fill="#f6e5bf" />
              <circle cx={x} cy={y} r="14" fill="#f6e5bf" opacity="0.15" />
              <path
                d={`M${x - 22},${y} L${x + 22},${y} M${x},${y - 22} L${x},${y + 22}`}
                stroke="#f6e5bf"
                strokeOpacity="0.35"
                strokeWidth="1"
              />
            </g>
          )
        })}
        <circle cx="600" cy="300" r="9" fill={accent} />
        <circle cx="600" cy="300" r="30" fill="none" stroke={accent} strokeOpacity="0.35" />
      </g>
    </svg>
  )
}

/* ================================================================== */
/*  Scene 6 — 'Isa (AS): desert light, ancient stone, an open scroll   */
/* ================================================================== */

function IsaArt({ progress, accent }: ArtProps) {
  const u = useId().replace(/:/g, '')
  const light = lerp(0.4, 1, progress)

  return (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <Sky id={`sky${u}`} top="#050a12" bottom="#16202a" />
      <StarPoints seed={17} count={45} maxY={220} />
      <Glow id={`sun${u}`} cx={600} cy={300} r={lerp(240, 400, progress)} color="#dff0ff" strength={0.18 * light} />

      {/* distant hills */}
      <path d={ridgePath(452, 22, 1.1)} fill="#0d1620" />
      <path d={ridgePath(492, 16, 3.4)} fill="#0a1119" />

      {/* ancient colonnade — architecture only */}
      <g>
        {[210, 400, 800, 990].map((x, i) => (
          <g key={x} opacity={0.85 - i * 0.04}>
            <path d={archPath(x, 560, 150, 250)} fill="#0b1017" stroke={accent} strokeOpacity="0.4" strokeWidth="2" />
            <rect x={x - 88} y="552" width="176" height="16" fill="#0b1017" stroke={accent} strokeOpacity="0.28" strokeWidth="1.4" />
          </g>
        ))}
        {/* a broken lintel between them */}
        <rect x="130" y="296" width="360" height="14" fill="#0b1017" stroke={accent} strokeOpacity="0.22" strokeWidth="1.2" />
        <rect x="720" y="296" width="360" height="14" fill="#0b1017" stroke={accent} strokeOpacity="0.22" strokeWidth="1.2" />
      </g>

      <LightShafts x={600} y={110} count={7} spread={460} length={470} color="#dff0ff" opacity={0.12 * light} />

      {/* an open scroll on a stone plinth */}
      <g transform="translate(600 540)">
        <rect x="-150" y="20" width="300" height="20" fill="#0a0f16" stroke={accent} strokeOpacity="0.3" strokeWidth="1.4" />
        <path
          d="M-140,20 Q-150,-30 -128,-56 L128,-56 Q150,-30 140,20 Z"
          fill="#131a22"
          stroke={accent}
          strokeOpacity="0.5"
          strokeWidth="2"
        />
        {/* rolled ends */}
        <ellipse cx="-134" cy="-18" rx="14" ry="38" fill="#0b1017" stroke={accent} strokeOpacity="0.45" strokeWidth="1.6" />
        <ellipse cx="134" cy="-18" rx="14" ry="38" fill="#0b1017" stroke={accent} strokeOpacity="0.45" strokeWidth="1.6" />
        {/* abstract ruled lines — never rendered as legible sacred text */}
        {[-40, -26, -12, 2].map((y, i) => (
          <line
            key={y}
            x1={-104 + (i % 2) * 10}
            y1={y}
            x2={104 - (i % 3) * 22}
            y2={y}
            stroke={accent}
            strokeOpacity="0.24"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}
        <Glow id={`scg${u}`} cx={0} cy={-20} r={190} color="#dff0ff" strength={0.22 * light} />
      </g>

      {/* olive branches at the edges */}
      <g opacity="0.4">
        {[80, 1120].map((x, s) => (
          <g key={x} transform={`translate(${x} ${VB.h}) scale(${s ? -1 : 1} 1)`}>
            <path d="M0,0 Q30,-140 90,-230" stroke={accent} strokeOpacity="0.45" strokeWidth="2.5" fill="none" />
            {Array.from({ length: 7 }, (_, k) => {
              const t = 0.25 + k * 0.11
              const px = 30 * (2 * t * (1 - t)) + 90 * t * t
              const py = -140 * (2 * t * (1 - t)) - 230 * t * t
              return <ellipse key={k} cx={px} cy={py} rx="16" ry="6" fill={accent} opacity="0.3" transform={`rotate(${-40 + k * 12} ${px} ${py})`} />
            })}
          </g>
        ))}
      </g>
    </svg>
  )
}

/* ================================================================== */
/*  Scene 7 — Muhammad ﷺ: night to dawn, the Ka'bah, Madinah arches    */
/* ================================================================== */

function MuhammadArt({ progress, accent }: ArtProps) {
  const u = useId().replace(/:/g, '')
  const dawn = Math.max(0, Math.min(1, (progress - 0.2) / 0.7))

  return (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <defs>
        <linearGradient id={`sky${u}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#03060c" />
          <stop offset="55%" stopColor={dawn > 0.5 ? '#0d2028' : '#060d16'} />
          <stop offset="100%" stopColor={dawn > 0.5 ? '#2a2313' : '#0a1418'} />
        </linearGradient>
      </defs>
      <rect width={VB.w} height={VB.h} fill={`url(#sky${u})`} />
      <g opacity={1 - dawn * 0.7}>
        <StarPoints seed={23} count={120} maxY={430} />
      </g>

      {/* dawn on the horizon */}
      <Glow id={`dw${u}`} cx={600} cy={520} r={lerp(260, 620, dawn)} color={accent} strength={0.16 + dawn * 0.3} />

      {/* distant hills of the valley */}
      <path d={ridgePath(470, 30, 0.9)} fill="#060d12" />

      {/* Madinah-inspired skyline: domes and minarets, no interiors */}
      <g opacity={0.9}>
        {[
          { x: 180, s: 0.72 },
          { x: 1020, s: 0.72 },
        ].map(({ x, s }) => (
          <g key={x} transform={`translate(${x} 540) scale(${s})`}>
            {/* prayer hall */}
            <rect x="-190" y="-120" width="380" height="120" fill="#050a0e" stroke={accent} strokeOpacity="0.3" strokeWidth="2" />
            {/* arcade */}
            {[-140, -70, 0, 70, 140].map((ax) => (
              <path key={ax} d={archPath(ax, 0, 54, 92)} fill="#0a1116" stroke={accent} strokeOpacity="0.28" strokeWidth="1.4" />
            ))}
            {/* dome */}
            <path d="M-88,-120 Q-88,-236 0,-236 Q88,-236 88,-120 Z" fill="#061116" stroke={accent} strokeOpacity="0.42" strokeWidth="2.2" />
            <path d="M0,-236 L0,-268" stroke={accent} strokeOpacity="0.5" strokeWidth="3" />
            <circle cx="0" cy="-276" r="7" fill="none" stroke={accent} strokeOpacity="0.6" strokeWidth="2" />
            {/* minarets */}
            {[-230, 230].map((mx) => (
              <g key={mx}>
                <rect x={mx - 14} y="-320" width="28" height="320" fill="#050a0e" stroke={accent} strokeOpacity="0.3" strokeWidth="1.6" />
                <rect x={mx - 22} y="-336" width="44" height="18" fill="#050a0e" stroke={accent} strokeOpacity="0.35" strokeWidth="1.4" />
                <path d={`M${mx - 16},-336 Q${mx},-392 ${mx + 16},-336 Z`} fill="#061116" stroke={accent} strokeOpacity="0.45" strokeWidth="1.8" />
                <path d={`M${mx},-392 L${mx},-414`} stroke={accent} strokeOpacity="0.5" strokeWidth="2" />
              </g>
            ))}
          </g>
        ))}
      </g>

      {/* the Ka'bah — a cube with the kiswah band. Architecture only. */}
      <g transform="translate(600 560)">
        <Glow id={`kg${u}`} cx={0} cy={-110} r={280} color={accent} strength={0.18 + dawn * 0.2} />
        {/* mataf floor */}
        <ellipse cx="0" cy="6" rx="330" ry="46" fill="#0b1216" opacity="0.9" />
        <ellipse cx="0" cy="6" rx="330" ry="46" fill="none" stroke={accent} strokeOpacity="0.16" />
        <ellipse cx="0" cy="6" rx="230" ry="32" fill="none" stroke={accent} strokeOpacity="0.12" />
        {/* the cube */}
        <g>
          <path d="M-105,0 L-105,-215 L60,-248 L60,-33 Z" fill="#05080b" stroke={accent} strokeOpacity="0.45" strokeWidth="2" />
          <path d="M60,-248 L60,-33 L118,-52 L118,-234 Z" fill="#080c10" stroke={accent} strokeOpacity="0.32" strokeWidth="1.6" />
          {/* kiswah band */}
          <path d="M-105,-158 L60,-191 L118,-177 L118,-160 L60,-174 L-105,-141 Z" fill={accent} opacity={0.5 + dawn * 0.25} />
          {/* door */}
          <rect x="-30" y="-150" width="34" height="96" fill={accent} opacity={0.28} />
          {/* corner highlight */}
          <path d="M60,-248 L60,-33" stroke={accent} strokeOpacity="0.5" strokeWidth="1.6" />
        </g>
      </g>

      {/* palms along the road */}
      <g opacity="0.55">
        {[70, 400, 780, 1140].map((x, i) => (
          <g key={x} transform={`translate(${x} ${VB.h}) scale(${0.8 + (i % 3) * 0.12})`}>
            <path d={`M0,0 Q${i % 2 ? 12 : -12},-90 ${i % 2 ? 4 : -4},-170`} stroke="#0a1216" strokeWidth="9" fill="none" />
            <path d={`M0,0 Q${i % 2 ? 12 : -12},-90 ${i % 2 ? 4 : -4},-170`} stroke={accent} strokeOpacity="0.3" strokeWidth="2.5" fill="none" />
            {Array.from({ length: 7 }, (_, k) => {
              const a = -Math.PI + (k / 6) * Math.PI
              const ex = (i % 2 ? 4 : -4) + Math.cos(a) * 62
              const ey = -170 + Math.sin(a) * 34 - 12
              return (
                <path
                  key={k}
                  d={`M${i % 2 ? 4 : -4},-170 Q${(ex * 0.6).toFixed(0)},${(ey - 26).toFixed(0)} ${ex.toFixed(0)},${ey.toFixed(0)}`}
                  stroke={accent}
                  strokeOpacity="0.34"
                  strokeWidth="2.5"
                  fill="none"
                />
              )
            })}
          </g>
        ))}
      </g>

      {/* the road */}
      <path d="M480,675 L560,540 L640,540 L720,675 Z" fill={accent} opacity={0.05 + dawn * 0.05} />
      <path d={ridgePath(648, 8, 2.2)} fill="#050a0d" />
    </svg>
  )
}

/* ================================================================== */
/*  Compact symbolic art for prophets without a full scene             */
/* ================================================================== */

function EmblemArt({ id, accent, progress }: ArtProps & { id: ArtKey }) {
  const u = useId().replace(/:/g, '')
  const glow = 0.2 + progress * 0.25

  const motif = () => {
    switch (id) {
      case 'ismail':
        return (
          <g>
            {/* a spring welling in barren ground + stone foundations */}
            <path d={ridgePath(500, 18, 1.2)} fill="#120d06" />
            <ellipse cx="600" cy="512" rx="120" ry="34" fill="#0e2b30" stroke={accent} strokeOpacity="0.5" strokeWidth="2" />
            {[0, 1, 2].map((i) => (
              <ellipse key={i} cx="600" cy="512" rx={60 + i * 34} ry={17 + i * 10} fill="none" stroke={accent} strokeOpacity={0.28 - i * 0.07} />
            ))}
            {[[430, 560], [500, 574], [700, 574], [770, 560]].map(([x, y], i) => (
              <rect key={i} x={x - 34} y={y - 22} width="68" height="24" fill="#0a0806" stroke={accent} strokeOpacity="0.35" strokeWidth="1.4" />
            ))}
          </g>
        )
      case 'ishaq':
        return (
          <g>
            <path d={ridgePath(470, 26, 0.5)} fill="#111a10" />
            <path d={ridgePath(520, 18, 2.8)} fill="#0a110a" />
            <g transform="translate(600 470)">
              <path d="M0,140 Q-14,40 0,-40" stroke={accent} strokeOpacity="0.5" strokeWidth="3" fill="none" />
              {Array.from({ length: 10 }, (_, k) => {
                const side = k % 2 ? 1 : -1
                const y = 100 - k * 18
                return <ellipse key={k} cx={side * 34} cy={y} rx="30" ry="10" fill={accent} opacity="0.22" transform={`rotate(${side * 22} ${side * 34} ${y})`} />
              })}
            </g>
          </g>
        )
      case 'yaqub':
        return (
          <g>
            <path d={ridgePath(500, 14, 1.9)} fill="#1a120c" />
            {/* an empty road receding, with a lamp in a doorway */}
            <path d="M520,675 L578,470 L622,470 L680,675 Z" fill={accent} opacity="0.08" />
            {Array.from({ length: 6 }, (_, i) => {
              const t = i / 6
              const y = lerp(660, 480, t)
              const hw = lerp(76, 8, t)
              return <line key={i} x1={600 - hw} y1={y} x2={600 + hw} y2={y} stroke={accent} strokeOpacity={0.16 * (1 - t)} strokeWidth="3" />
            })}
            <g transform="translate(940 520)">
              <path d={archPath(0, 100, 120, 200)} fill="#0d0a07" stroke={accent} strokeOpacity="0.4" strokeWidth="2" />
              <circle cx="0" cy="30" r="16" fill={accent} opacity="0.7" />
              <circle cx="0" cy="30" r="52" fill={accent} opacity="0.12" />
            </g>
          </g>
        )
      case 'harun':
        return (
          <g>
            <path d="M0,470 L200,300 L340,392 L470,470 Z" fill="#0a1512" />
            <path d="M730,470 L860,320 L1000,400 L1200,470 Z" fill="#0a1512" />
            <path d={ridgePath(520, 16, 1.5)} fill="#07100e" />
            {/* two paths converging */}
            <path d="M300,675 Q520,540 600,470" stroke={accent} strokeOpacity="0.35" strokeWidth="3" fill="none" />
            <path d="M900,675 Q680,540 600,470" stroke={accent} strokeOpacity="0.35" strokeWidth="3" fill="none" />
            <circle cx="600" cy="470" r="8" fill={accent} />
            <circle cx="600" cy="470" r="30" fill="none" stroke={accent} strokeOpacity="0.35" />
          </g>
        )
      case 'dawud':
        return (
          <g>
            <path d="M0,470 L170,250 L300,360 L430,220 L560,470 Z" fill="#0b1224" stroke={accent} strokeOpacity="0.24" />
            <path d="M640,470 L790,264 L910,352 L1060,232 L1200,470 Z" fill="#0a1020" stroke={accent} strokeOpacity="0.18" />
            <path d={ridgePath(516, 18, 2.2)} fill="#070b16" />
            {/* birds in flight */}
            {[[300, 200], [360, 172], [420, 210], [820, 190], [880, 216]].map(([x, y], i) => (
              <path key={i} d={`M${x - 18},${y} q18,-12 18,0 q0,-12 18,0`} stroke={accent} strokeOpacity="0.5" strokeWidth="2" fill="none" />
            ))}
            {/* shaped iron rings */}
            <g transform="translate(600 560)" opacity="0.75">
              {Array.from({ length: 5 }, (_, r) =>
                Array.from({ length: 7 }, (_, c) => (
                  <circle
                    key={`${r}-${c}`}
                    cx={(c - 3) * 34 + (r % 2 ? 17 : 0)}
                    cy={r * 26 - 40}
                    r="15"
                    fill="none"
                    stroke={accent}
                    strokeOpacity="0.3"
                    strokeWidth="2"
                  />
                )),
              )}
            </g>
          </g>
        )
      case 'sulayman':
        return (
          <g>
            <rect y="440" width={VB.w} height="235" fill="#120c22" />
            {[300, 600, 900].map((x, i) => (
              <path key={x} d={archPath(x, 560, 200 - i * 10, 320)} fill="#0a0716" stroke={accent} strokeOpacity="0.4" strokeWidth="2" />
            ))}
            {/* wind over water */}
            {Array.from({ length: 6 }, (_, i) => (
              <path
                key={i}
                d={`M${80 + i * 30},${600 + i * 12} q120,${i % 2 ? -18 : 18} 240,0 q120,${i % 2 ? 18 : -18} 240,0`}
                stroke={accent}
                strokeOpacity={0.16}
                strokeWidth="2"
                fill="none"
              />
            ))}
            {/* a hoopoe, small and distant */}
            <path d="M880,250 q26,-16 26,0 q0,-16 26,0" stroke={accent} strokeOpacity="0.6" strokeWidth="2.5" fill="none" />
          </g>
        )
      case 'yunus':
        return (
          <g>
            <rect width={VB.w} height={VB.h} fill="#02141a" />
            {/* layered darkness of the depths */}
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} y={i * 150} width={VB.w} height="170" fill="#01090d" opacity={0.18 + i * 0.16} />
            ))}
            <LightShafts x={600} y={-20} count={3} spread={200} length={560} color={accent} opacity={0.18} />
            {/* a single shaft reaching down */}
            <ellipse cx="600" cy="30" rx="120" ry="34" fill={accent} opacity="0.2" />
            {/* current lines */}
            {Array.from({ length: 7 }, (_, i) => (
              <path
                key={i}
                d={`M${-40 + i * 30},${180 + i * 62} q200,${i % 2 ? -28 : 28} 420,0 q200,${i % 2 ? 28 : -28} 420,0`}
                stroke={accent}
                strokeOpacity={0.1}
                strokeWidth="2"
                fill="none"
              />
            ))}
          </g>
        )
      case 'zakariyya':
        return (
          <g>
            <rect width={VB.w} height={VB.h} fill="#070d14" />
            {/* a mihrab niche */}
            <path d={archPath(600, 620, 300, 470)} fill="#0b131c" stroke={accent} strokeOpacity="0.45" strokeWidth="2.5" />
            <path d={archPath(600, 600, 210, 380)} fill="#060b12" stroke={accent} strokeOpacity="0.28" strokeWidth="1.6" />
            <Glow id={`zg${u}`} cx={600} cy={430} r={220} color={accent} strength={0.3} />
            {/* candle */}
            <rect x="588" y="500" width="24" height="90" fill="#101820" stroke={accent} strokeOpacity="0.4" />
            <path d="M600,470 q-14,20 0,30 q14,-10 0,-30 Z" fill={accent} opacity="0.85" />
            {/* branches in bloom */}
            {[300, 900].map((x, s) => (
              <g key={x} transform={`translate(${x} ${VB.h}) scale(${s ? -1 : 1} 1)`}>
                <path d="M0,0 Q40,-160 30,-300" stroke={accent} strokeOpacity="0.35" strokeWidth="2.5" fill="none" />
                {Array.from({ length: 5 }, (_, k) => (
                  <circle key={k} cx={34 - k * 3} cy={-90 - k * 44} r="6" fill={accent} opacity="0.4" />
                ))}
              </g>
            ))}
          </g>
        )
      case 'yahya':
        return (
          <g>
            <path d={ridgePath(430, 24, 0.8)} fill="#0a1a16" />
            {/* a river catching first light */}
            <path d="M0,675 L420,470 L780,470 L1200,675 Z" fill="#0b2a26" />
            <path d="M0,675 L420,470 L780,470 L1200,675 Z" fill={accent} opacity="0.1" />
            {Array.from({ length: 6 }, (_, i) => {
              const t = i / 6
              const y = lerp(660, 490, t)
              const hw = lerp(560, 110, t)
              return <line key={i} x1={600 - hw} y1={y} x2={600 + hw} y2={y} stroke={accent} strokeOpacity={0.14 * (1 - t) + 0.05} strokeWidth="3" />
            })}
            {/* reeds */}
            {[120, 170, 210, 990, 1040, 1090].map((x, i) => (
              <path key={x} d={`M${x},675 q${i % 2 ? 16 : -16},-110 ${i % 2 ? 6 : -6},-190`} stroke={accent} strokeOpacity="0.4" strokeWidth="2.5" fill="none" />
            ))}
            <Glow id={`yg${u}`} cx={600} cy={452} r={260} color={accent} strength={0.3} />
          </g>
        )
      default:
        return null
    }
  }

  return (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <Sky id={`sky${u}`} top="#03060b" bottom="#080f14" />
      <StarPoints seed={id.length * 13} count={55} maxY={380} />
      <Glow id={`amb${u}`} cx={600} cy={560} r={520} color={accent} strength={glow} />
      {motif()}
    </svg>
  )
}

/* ================================================================== */

const FULL: Partial<Record<ArtKey, (p: ArtProps) => JSX.Element>> = {
  adam: AdamArt,
  nuh: NuhArt,
  ibrahim: IbrahimArt,
  musa: MusaArt,
  yusuf: YusufArt,
  isa: IsaArt,
  muhammad: MuhammadArt,
}

function SceneArtImpl({ art, progress, accent }: { art: ArtKey } & ArtProps) {
  const Full = FULL[art]
  if (Full) return <Full progress={progress} accent={accent} />
  return <EmblemArt id={art} progress={progress} accent={accent} />
}

/** Memoised: these trees are large and only need to re-render on progress steps. */
const SceneArt = memo(SceneArtImpl)
export default SceneArt
