import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useJourney } from '../lib/journey'

/* ================================================================== *
 * Shared primitives for the cinematic scroll journey.
 *
 * A note on structure: none of these may sit inside an `overflow: hidden`
 * ancestor. That turns the ancestor into a scroll container, which stops
 * `position: sticky` from ever pinning to the viewport — every pinned
 * scene in this file depends on that.
 * ================================================================== */

interface SceneProps {
  id: string
  /** Height of the scroll track, in svh. Longer = slower, more deliberate. */
  height?: number
  /** Fixed-position layers, rendered behind the content and pinned. */
  backdrop?: (p: MotionValue<number>, step: number) => ReactNode
  children: (p: MotionValue<number>, step: number) => ReactNode
  /** Under reduced motion, render this instead of pinning. */
  flat?: ReactNode
  className?: string
  label?: string
}

/**
 * A pinned scene. The inner frame sticks to the viewport while the reader
 * scrolls through the track, and everything inside is driven by `progress`.
 */
export function Scene({
  id,
  height = 300,
  backdrop,
  children,
  flat,
  className = '',
  label,
}: SceneProps) {
  const { reduced } = useJourney()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  // Quantised so SVG-heavy backdrops re-render ~40x per scene, not per frame.
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (reduced) {
      setStep(30)
      return
    }
    return scrollYProgress.on('change', (v) => {
      const q = Math.round(v * 40)
      setStep((cur) => (cur === q ? cur : q))
    })
  }, [scrollYProgress, reduced])

  if (reduced) {
    return (
      <section id={id} data-scene={id} aria-label={label} className={`relative ${className}`}>
        {flat ?? children(scrollYProgress, 30)}
      </section>
    )
  }

  return (
    <section
      ref={ref}
      id={id}
      data-scene={id}
      aria-label={label}
      className={`relative ${className}`}
      style={{ height: `${height}svh` }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {backdrop?.(scrollYProgress, step)}
        <div className="relative z-20 flex h-full w-full items-center justify-center px-5">
          {children(scrollYProgress, step)}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

/**
 * A block of content that fades and drifts through a slice of the scene's
 * scroll range, then hands over to the next.
 */
export function Beat({
  progress,
  from,
  to,
  children,
  className = '',
  hold = false,
  /** Keep pointer events — for beats containing buttons. */
  live = false,
}: {
  progress: MotionValue<number>
  from: number
  to: number
  children: ReactNode
  className?: string
  hold?: boolean
  live?: boolean
}) {
  const pad = (to - from) * 0.28
  const stops = [from, from + pad, to - pad, to]
  const opacity = useTransform(progress, stops, [0, 1, 1, hold ? 1 : 0])
  const y = useTransform(progress, stops, [46, 0, 0, hold ? 0 : -46])
  const blurN = useTransform(progress, stops, [16, 0, 0, hold ? 0 : 16])
  const filter = useTransform(blurN, (b) => `blur(${b.toFixed(2)}px)`)
  const scale = useTransform(progress, stops, [0.96, 1, 1, hold ? 1 : 1.03])

  return (
    <motion.div
      className={`absolute max-w-5xl px-2 text-center ${live ? '' : 'pointer-events-none'} ${className}`}
      style={{ opacity, y, filter, scale }}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */

/** Big cinematic typography. */
export function Statement({
  children,
  size = 'lg',
  gilded = false,
  className = '',
}: {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  gilded?: boolean
  className?: string
}) {
  const scale = {
    sm: 'text-[clamp(1.1rem,3vw,1.8rem)]',
    md: 'text-[clamp(1.4rem,4.4vw,2.8rem)]',
    lg: 'text-[clamp(1.9rem,6.5vw,4.6rem)]',
    xl: 'text-[clamp(2.4rem,11vw,8rem)]',
  }[size]
  return (
    <p
      className={`font-display leading-[1.08] font-light ${scale} ${
        gilded ? 'text-gilded anim-shimmer uppercase' : 'text-ivory/85'
      } ${className}`}
    >
      {children}
    </p>
  )
}

/** Small caps eyebrow. */
export function Eyebrow({
  children,
  color = '#d3ad68',
  className = '',
}: {
  children: ReactNode
  color?: string
  className?: string
}) {
  return (
    <span
      className={`block text-[0.66rem] tracking-[0.46em] uppercase ${className}`}
      style={{ color }}
    >
      {children}
    </span>
  )
}

/* ------------------------------------------------------------------ */

/**
 * A glowing point of interest. Hovering lights it; selecting it opens the
 * panel and dims its siblings.
 */
export function Hotspot({
  label,
  accent,
  active,
  dimmed,
  onSelect,
  size = 'md',
  index,
  className = '',
  style,
}: {
  label: string
  accent: string
  active: boolean
  dimmed: boolean
  onSelect: () => void
  size?: 'sm' | 'md' | 'lg'
  index?: string
  className?: string
  style?: React.CSSProperties
}) {
  const { cue, reduced } = useJourney()
  const dot = size === 'lg' ? 18 : size === 'md' ? 13 : 10

  return (
    <motion.button
      type="button"
      onClick={() => {
        cue(active ? 'close' : 'select')
        onSelect()
      }}
      onMouseEnter={() => cue('hover')}
      data-cursor="explore"
      aria-pressed={active}
      aria-label={label}
      className={`group absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center ${className}`}
      style={style}
      animate={{ opacity: dimmed ? 0.3 : 1, scale: active ? 1.2 : 1 }}
      transition={{ duration: reduced ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* comfortable touch target, independent of the visual dot */}
      <span aria-hidden="true" className="absolute top-1/2 left-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2" />

      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-lg transition-all duration-500 group-hover:blur-xl"
        style={{
          width: dot * 4,
          height: dot * 4,
          background: `radial-gradient(circle, ${accent}99, transparent 70%)`,
        }}
      />
      {!reduced && (
        <span
          aria-hidden="true"
          className="anim-pulse-ring absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{ width: dot * 2.6, height: dot * 2.6, borderColor: `${accent}66` }}
        />
      )}
      <span
        className="relative block rounded-full transition-transform duration-500 group-hover:scale-125"
        style={{
          width: dot,
          height: dot,
          background: active ? '#f6e5bf' : accent,
          boxShadow: `0 0 ${dot * 1.6}px ${accent}`,
        }}
      />
      {index && (
        <span
          className="pointer-events-none mt-3 text-[0.62rem] tracking-[0.3em] tabular-nums"
          style={{ color: `${accent}99` }}
        >
          {index}
        </span>
      )}
      <span
        className={`pointer-events-none mt-2 text-[0.66rem] tracking-[0.26em] whitespace-nowrap uppercase transition-colors duration-500 ${
          active ? 'text-gold-bright' : 'text-ivory-dim/60 group-hover:text-gold-soft'
        }`}
      >
        {label}
      </span>
    </motion.button>
  )
}

/* ------------------------------------------------------------------ */

/** The panel that opens when a hotspot is chosen. */
export function InfoPanel({
  title,
  arabic,
  accent,
  children,
  footnote,
  onClose,
  className = '',
}: {
  title: string
  arabic?: string
  accent: string
  children: ReactNode
  footnote?: string
  onClose?: () => void
  className?: string
}) {
  const { reduced } = useJourney()
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 22, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{
        opacity: 0,
        y: -12,
        filter: 'blur(8px)',
        transition: { duration: reduced ? 0 : 0.2 },
      }}
      transition={{ duration: reduced ? 0 : 0.65, ease: [0.16, 1, 0.3, 1] }}
      className={`surface-glass relative w-full max-w-xl p-7 text-left sm:p-9 ${className}`}
      role="status"
    >
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 h-px w-full"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-2xl font-light sm:text-3xl" style={{ color: accent }}>
          {title}
        </h3>
        {arabic && (
          <p className="font-arabic text-xl text-gold/60 sm:text-2xl" lang="ar">
            {arabic}
          </p>
        )}
      </div>
      <div className="hairline my-5 h-px w-full" aria-hidden="true" />
      <div className="text-sm leading-relaxed text-ivory/80 sm:text-[0.95rem]">{children}</div>
      {footnote && (
        <p className="mt-5 text-[0.64rem] tracking-[0.28em] text-gold/50 uppercase">{footnote}</p>
      )}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          data-cursor="hover"
          className="mt-6 cursor-pointer text-[0.64rem] tracking-[0.3em] text-ivory-dim/45 uppercase transition-colors hover:text-gold"
        >
          Close
        </button>
      )}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */

/** The thin veil that cuts cleanly between scenes. */
export function SceneVeil({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.07, 0.93, 1], [1, 0, 0, 1])
  return <motion.div aria-hidden="true" className="absolute inset-0 z-10 bg-ink" style={{ opacity }} />
}

/** Bottom-of-scene progress hairline. */
export function SceneRail({ progress, accent }: { progress: MotionValue<number>; accent: string }) {
  return (
    <div aria-hidden="true" className="absolute bottom-0 left-0 z-20 h-px w-full bg-ivory/5">
      <motion.div className="h-full origin-left" style={{ scaleX: progress, background: accent }} />
    </div>
  )
}

/** "Scroll to explore" cue. */
export function ScrollCue({ label = 'Scroll to explore' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-[0.64rem] tracking-[0.4em] text-ivory-dim/45 uppercase">{label}</span>
      <span aria-hidden="true" className="relative block h-11 w-px overflow-hidden bg-gold/15">
        <span className="anim-scroll-cue absolute inset-x-0 top-0 block h-4 bg-gradient-to-b from-transparent via-gold to-transparent" />
      </span>
      <span aria-hidden="true" className="text-xs text-gold/50">
        ↓
      </span>
    </div>
  )
}
